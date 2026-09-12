import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  isRingMqttEventSelect,
  recordingPosterEntityId,
  recordingSourceMarker,
  recordingUrl,
  recordingUrlIsReady,
} from "../../src/utilities/recording-source";

function entity(
  entityId: string,
  state = "idle",
  attributes: HassEntity["attributes"] = {},
): HassEntity {
  return { entity_id: entityId, state, attributes };
}

function hass(): HomeAssistant {
  return {
    states: {
      "select.renamed_event": entity("select.renamed_event", "Ding 1", {
        eventId: "event-1",
        recordingUrl: "https://example.test/event.mp4",
      }),
      "camera.snapshot": entity("camera.snapshot", "idle", {
        entity_picture: "/snapshot.jpg",
      }),
      "camera.live": entity("camera.live"),
    },
    entities: {
      "select.renamed_event": {
        entity_id: "select.renamed_event",
        platform: "mqtt",
        original_name: "Event Select",
        unique_id: "083a8804c4c5_event_select",
      },
    },
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
  };
}

describe("recording sources", () => {
  it("reads official Ring and Ring-MQTT recording URLs without accepting sentinels", () => {
    expect(recordingUrl(entity("camera.recording", "idle", {
      video_url: "https://example.test/official.mp4",
    }))).toBe("https://example.test/official.mp4");
    expect(recordingUrl(entity("select.events", "Ding 1", {
      recordingUrl: "https://example.test/mqtt.mp4",
    }))).toBe("https://example.test/mqtt.mp4");
    expect(recordingUrl(entity("select.events", "Ding 1", {
      recordingUrl: "<Recording Not Found>",
    }))).toBeUndefined();
    expect(recordingUrl(entity("select.events", "Ding 1", {
      recordingUrl: "<Transcoding in Progress>",
    }))).toBeUndefined();
  });

  it("refreshes signed URLs before they are too close to expiry", () => {
    const signed = entity("select.events", "Ding 1", {
      recordingUrl:
        "https://example.test/event.mp4?X-Amz-Date=20260912T120000Z&X-Amz-Expires=60",
    });
    expect(recordingUrlIsReady(signed, Date.parse("2026-09-12T12:00:20Z"))).toBe(true);
    expect(recordingUrlIsReady(signed, Date.parse("2026-09-12T12:00:31Z"))).toBe(false);
    expect(recordingUrlIsReady(entity("select.events", "Ding 1", {
      recordingUrl: "https://example.test/non-expiring.mp4",
    }))).toBe(true);
  });

  it("recognizes a renamed Ring-MQTT Event Select by registry identity", () => {
    const homeAssistant = hass();
    expect(isRingMqttEventSelect(homeAssistant, "select.renamed_event")).toBe(true);
    expect(isRingMqttEventSelect({
      ...homeAssistant,
      entities: {
        "select.renamed_event": {
          entity_id: "select.renamed_event",
          platform: "template",
          unique_id: "083a8804c4c5_event_select",
        },
      },
    }, "select.renamed_event")).toBe(false);
  });

  it("uses a camera poster while keeping the event selector as the media source", () => {
    const homeAssistant = hass();
    const config = normalizeConfig({
      recording_entity: "select.renamed_event",
      live_entity: "camera.live",
      snapshot_entity: "camera.snapshot",
    });
    expect(recordingPosterEntityId(homeAssistant, config)).toBe("camera.snapshot");
    expect(recordingSourceMarker(homeAssistant.states["select.renamed_event"])).toBe(
      "event-1:https://example.test/event.mp4",
    );

    homeAssistant.states["camera.snapshot"] = {
      ...homeAssistant.states["camera.snapshot"]!,
      state: "unavailable",
    };
    expect(recordingPosterEntityId(homeAssistant, config)).toBe("camera.live");
  });
});
