import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  entityIsUnavailable,
  recordingHasMedia,
  supportsLockOpen,
  supportsRingTalkback,
  supportsStream,
  validateEntities,
} from "../../src/utilities/entity-validation";

const entity = (id: string, attributes: HassEntity["attributes"] = {}): HassEntity => ({
  entity_id: id,
  state: "idle",
  attributes,
});

describe("entity validation", () => {
  it("detects stream capability without inspecting URLs", () => {
    expect(supportsStream(entity("camera.live", { supported_features: 2 }))).toBe(true);
    expect(supportsStream(entity("camera.recording", { supported_features: 0 }))).toBe(false);
    expect(recordingHasMedia(entity("camera.recording", { video_url: "secret" }))).toBe(true);
  });

  it("accepts talkback only for a streaming camera from the official Ring platform", () => {
    const states = {
      "camera.live": entity("camera.live", { supported_features: 2 }),
      "camera.recording": entity("camera.recording", { supported_features: 0 }),
    };
    const officialRing: HomeAssistant = {
      states,
      entities: {
        "camera.live": { entity_id: "camera.live", platform: "ring" },
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    expect(supportsRingTalkback(officialRing, "camera.live")).toBe(true);
    expect(supportsRingTalkback(officialRing, "camera.recording")).toBe(false);
    expect(
      supportsRingTalkback(
        {
          ...officialRing,
          entities: {
            "camera.live": { entity_id: "camera.live", platform: "generic" },
          },
        },
        "camera.live",
      ),
    ).toBe(false);
  });

  it("detects missing and unavailable entities", () => {
    expect(entityIsUnavailable(undefined)).toBe(true);
    expect(entityIsUnavailable({ ...entity("camera.one"), state: "unavailable" })).toBe(true);
  });

  it("detects whether a lock supports opening its latch", () => {
    expect(supportsLockOpen(entity("lock.front_door", { supported_features: 1 }))).toBe(true);
    expect(supportsLockOpen(entity("lock.front_door", { supported_features: 0 }))).toBe(false);
  });

  it("returns capability warnings without including the recording URL", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    const hass: HomeAssistant = {
      states: {
        "camera.recording": entity("camera.recording", { video_url: "top-secret-url" }),
        "camera.live": entity("camera.live", { supported_features: 0 }),
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    const warnings = validateEntities(hass, config);
    expect(warnings.some((warning) => /does not advertise/.test(warning.message))).toBe(true);
    expect(JSON.stringify(warnings)).not.toContain("top-secret-url");
  });

  it("returns warnings in the active Home Assistant language", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    const hass: HomeAssistant = {
      language: "de-AT",
      states: {
        "camera.recording": entity("camera.recording", {
          entity_picture: "/camera.jpg",
        }),
        "camera.live": entity("camera.live", { supported_features: 0 }),
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    expect(
      validateEntities(hass, config).map((warning) => warning.message),
    ).toContain(
      "Die Live-Kamera meldet keine Unterstützung für Kamera-Streaming.",
    );
  });

  it("validates an optional snapshot entity without treating idle as stale", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      snapshot_entity: "camera.snapshot",
      preview_source: "newest",
    });
    const baseStates = {
      "camera.recording": entity("camera.recording", { entity_picture: "/recording.jpg" }),
      "camera.live": entity("camera.live", { supported_features: 2 }),
    };
    const available: HomeAssistant = {
      states: {
        ...baseStates,
        "camera.snapshot": entity("camera.snapshot", {
          entity_picture: "/snapshot.jpg",
          timestamp: 1_780_000_000,
        }),
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    expect(validateEntities(available, config).map((warning) => warning.kind)).not.toContain(
      "snapshot",
    );

    const unavailable = {
      ...available,
      states: {
        ...available.states,
        "camera.snapshot": {
          ...available.states["camera.snapshot"]!,
          state: "unavailable",
        },
      },
    };
    expect(validateEntities(unavailable, config).map((warning) => warning.kind)).toContain(
      "snapshot",
    );
  });

  it("warns when a snapshot-based preview has no snapshot entity", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      preview_source: "snapshot",
    });
    const snapshotWarning = validateEntities(
      {
        states: {
          "camera.recording": entity("camera.recording", { entity_picture: "/recording.jpg" }),
          "camera.live": entity("camera.live", { supported_features: 2 }),
        },
        hassUrl: (path = "") => path,
        callWS: async () => ({}) as never,
      },
      config,
    ).find((warning) => warning.kind === "snapshot");
    expect(snapshotWarning?.message).toContain("Select a device snapshot camera");
  });

  it("warns when two-way audio is enabled for a non-Ring live camera", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      two_way_audio: true,
    });
    const baseHass: HomeAssistant = {
      states: {
        "camera.recording": entity("camera.recording", {
          entity_picture: "/recording.jpg",
        }),
        "camera.live": entity("camera.live", { supported_features: 2 }),
      },
      entities: {
        "camera.live": { entity_id: "camera.live", platform: "generic" },
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    const warnings = validateEntities(baseHass, config);
    expect(warnings.find((warning) => warning.kind === "talkback")?.message).toContain(
      "requires the official Ring Live view camera",
    );
    expect(
      validateEntities(
        {
          ...baseHass,
          entities: {
            "camera.live": { entity_id: "camera.live", platform: "ring" },
          },
        },
        config,
      ).map((warning) => warning.kind),
    ).not.toContain("talkback");
  });

  it("warns when Open is selected for a lock without latch support", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      door_entity: "lock.front_door",
      door_action: "open",
    });
    const warnings = validateEntities(
      {
        states: {
          "camera.recording": entity("camera.recording", { entity_picture: "/recording.jpg" }),
          "camera.live": entity("camera.live", { supported_features: 2 }),
          "lock.front_door": {
            ...entity("lock.front_door", { supported_features: 0 }),
            state: "locked",
          },
        },
        hassUrl: (path = "") => path,
        callWS: async () => ({}) as never,
      },
      config,
    );
    expect(warnings.find((warning) => warning.kind === "door")?.message).toContain(
      "does not advertise support for opening",
    );
  });

  it("validates a configured door contact independently from the lock", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      door_entity: "lock.front_door",
      door_contact_entity: "binary_sensor.front_door_contact",
    });
    const baseStates = {
      "camera.recording": entity("camera.recording", { entity_picture: "/recording.jpg" }),
      "camera.live": entity("camera.live", { supported_features: 2 }),
      "lock.front_door": {
        ...entity("lock.front_door", { supported_features: 1 }),
        state: "locked",
      },
    };
    const hass: HomeAssistant = {
      states: {
        ...baseStates,
        "binary_sensor.front_door_contact": {
          ...entity("binary_sensor.front_door_contact", { device_class: "door" }),
          state: "off",
        },
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    expect(validateEntities(hass, config).map((warning) => warning.kind)).not.toContain(
      "door_contact",
    );

    hass.states["binary_sensor.front_door_contact"] = {
      ...hass.states["binary_sensor.front_door_contact"]!,
      state: "unavailable",
    };
    expect(validateEntities(hass, config).map((warning) => warning.kind)).toContain(
      "door_contact",
    );
  });

  it("validates the configured last activity source without exposing its value", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      last_activity_entity: "sensor.front_door_last_activity",
    });
    const baseStates = {
      "camera.recording": entity("camera.recording", {
        entity_picture: "/recording.jpg",
      }),
      "camera.live": entity("camera.live", { supported_features: 2 }),
    };
    const activity = {
      ...entity("sensor.front_door_last_activity", {
        device_class: "timestamp",
      }),
      state: "2026-09-12T10:15:30Z",
    };
    const hass: HomeAssistant = {
      states: {
        ...baseStates,
        [activity.entity_id]: activity,
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    expect(validateEntities(hass, config).map((warning) => warning.kind)).not.toContain(
      "last_activity",
    );

    hass.states[activity.entity_id] = {
      ...activity,
      state: "motion detected at the front door",
    };
    const invalidWarnings = validateEntities(hass, config);
    expect(invalidWarnings.find((warning) => warning.kind === "last_activity")?.message)
      .toContain("does not currently provide a valid activity date and time");
    expect(JSON.stringify(invalidWarnings)).not.toContain(
      "motion detected at the front door",
    );

    hass.states[activity.entity_id] = { ...activity, state: "unavailable" };
    expect(validateEntities(hass, config).map((warning) => warning.kind)).toContain(
      "last_activity",
    );
  });

  it("accepts Ring-MQTT Ding attributes as a last activity source", () => {
    const activity = {
      ...entity("binary_sensor.front_door_ding", {
        lastDingTime: "2026-09-12T10:15:30Z",
      }),
      state: "off",
    };
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      last_activity_entity: activity.entity_id,
    });
    const hass: HomeAssistant = {
      states: {
        "camera.recording": entity("camera.recording", {
          entity_picture: "/recording.jpg",
        }),
        "camera.live": entity("camera.live", { supported_features: 2 }),
        [activity.entity_id]: activity,
      },
      entities: {
        [activity.entity_id]: {
          entity_id: activity.entity_id,
          platform: "mqtt",
          device_id: "front-door",
        },
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };

    expect(validateEntities(hass, config).map((warning) => warning.kind)).not.toContain(
      "last_activity",
    );
  });
});
