import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  captureTimestamp,
  parseCaptureTimestamp,
  recordingMediaMarker,
  selectPreviewEntityId,
} from "../../src/utilities/preview-selection";

const entity = (
  id: string,
  attributes: HassEntity["attributes"] = {},
  state = "idle",
): HassEntity => ({ entity_id: id, state, attributes });

const recording = entity("camera.recording", {
  entity_picture: "/recording.jpg",
  last_video_id: "recording-1",
});
const snapshot = entity("camera.snapshot", {
  entity_picture: "/snapshot.jpg",
});
const live = entity("camera.live", { supported_features: 2 });

const config = normalizeConfig({
  recording_entity: recording.entity_id,
  live_entity: live.entity_id,
  snapshot_entity: snapshot.entity_id,
  preview_source: "newest",
});

function hassWith(
  nextRecording: HassEntity = recording,
  nextSnapshot: HassEntity = snapshot,
): HomeAssistant {
  return {
    states: {
      [nextRecording.entity_id]: nextRecording,
      [nextSnapshot.entity_id]: nextSnapshot,
      [live.entity_id]: live,
    },
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
  };
}

describe("preview selection", () => {
  it("parses Ring-MQTT Unix seconds, milliseconds, and ISO timestamps", () => {
    expect(parseCaptureTimestamp(1_780_000_000)).toBe(1_780_000_000_000);
    expect(parseCaptureTimestamp("1780000000000")).toBe(1_780_000_000_000);
    expect(parseCaptureTimestamp("2026-09-06T12:00:00Z")).toBe(
      Date.parse("2026-09-06T12:00:00Z"),
    );
    expect(parseCaptureTimestamp("not-a-time")).toBeUndefined();
    expect(captureTimestamp(entity("camera.one", { timestamp: 1_780_000_000 }))).toBe(
      1_780_000_000_000,
    );
    expect(
      captureTimestamp(
        entity("camera.recording", {
          last_recording_at: "2026-09-06T12:00:00Z",
        }),
      ),
    ).toBe(Date.parse("2026-09-06T12:00:00Z"));
  });

  it("selects the newer image when both capture times are comparable", () => {
    const timedRecording = entity(recording.entity_id, {
      ...recording.attributes,
      recorded_at: "2026-09-06T12:00:00Z",
    });
    const timedSnapshot = entity(snapshot.entity_id, {
      ...snapshot.attributes,
      timestamp: Date.parse("2026-09-06T12:01:00Z") / 1_000,
    });
    expect(
      selectPreviewEntityId(
        hassWith(timedRecording, timedSnapshot),
        config,
        "last_recording",
      ),
    ).toBe(snapshot.entity_id);
  });

  it("uses the most recently observed media change when timestamps are incomparable", () => {
    const timedSnapshot = entity(snapshot.entity_id, {
      ...snapshot.attributes,
      timestamp: Date.parse("2026-09-06T12:01:00Z") / 1_000,
    });
    expect(
      selectPreviewEntityId(
        hassWith(recording, timedSnapshot),
        config,
        "last_recording",
        "last_recording",
      ),
    ).toBe(recording.entity_id);
    expect(
      selectPreviewEntityId(
        hassWith(recording, timedSnapshot),
        config,
        "last_recording",
        "snapshot",
      ),
    ).toBe(snapshot.entity_id);
    expect(recordingMediaMarker(recording)).toBe("last_video_id:recording-1");
  });

  it("uses the available entity and a configured fallback for ties or unknown times", () => {
    expect(
      selectPreviewEntityId(
        hassWith(recording, { ...snapshot, state: "unavailable" }),
        config,
        "last_recording",
      ),
    ).toBe(recording.entity_id);
    expect(
      selectPreviewEntityId(
        hassWith(recording, snapshot),
        { ...config, preview_fallback: "snapshot" },
        "last_recording",
      ),
    ).toBe(snapshot.entity_id);

    expect(
      selectPreviewEntityId(
        hassWith(
          { ...recording, last_updated: "2026-09-06T13:00:00Z" },
          snapshot,
        ),
        { ...config, preview_fallback: "snapshot" },
        "last_recording",
      ),
    ).toBe(snapshot.entity_id);

    const timestamp = "2026-09-06T12:00:00Z";
    expect(
      selectPreviewEntityId(
        hassWith(
          entity(recording.entity_id, { ...recording.attributes, timestamp }),
          entity(snapshot.entity_id, { ...snapshot.attributes, timestamp }),
        ),
        config,
        "last_recording",
        "snapshot",
      ),
    ).toBe(recording.entity_id);
  });

  it("keeps snapshot previews separate from the two viewer modes", () => {
    expect(
      selectPreviewEntityId(
        hassWith(),
        { ...config, preview_source: "snapshot" },
        "live",
      ),
    ).toBe(snapshot.entity_id);
    expect(
      selectPreviewEntityId(
        hassWith(),
        { ...config, preview_source: "default" },
        "live",
      ),
    ).toBe(live.entity_id);
  });

  it("uses the configured snapshot as the still image for an Event Select recording", () => {
    const mqttRecording = entity("select.front_door_event_select", {
      eventId: "event-1",
      recordingUrl: "https://example.test/event.mp4",
    }, "Ding 1");
    const mqttConfig = normalizeConfig({
      recording_entity: mqttRecording.entity_id,
      live_entity: live.entity_id,
      snapshot_entity: snapshot.entity_id,
      preview_source: "last_recording",
    });
    const homeAssistant = hassWith(mqttRecording, snapshot);

    expect(
      selectPreviewEntityId(homeAssistant, mqttConfig, "last_recording"),
    ).toBe(snapshot.entity_id);
    expect(
      selectPreviewEntityId(
        homeAssistant,
        { ...mqttConfig, preview_source: "default" },
        "last_recording",
      ),
    ).toBe(snapshot.entity_id);
  });
});
