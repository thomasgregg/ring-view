import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  buildSnapshotFilename,
  findRingMqttSnapshotButton,
  findRingMqttSnapshotCamera,
  formatSnapshotTimestamp,
  normalizeSnapshotDirectory,
  selectSnapshotEntityId,
  snapshotCaptureMarker,
  snapshotCameraSlug,
  snapshotDirectoryProblem,
  snapshotDirectoryWarning,
} from "../../src/utilities/snapshot";

const camera = (entity_id: string, state = "idle"): HassEntity => ({
  entity_id,
  state,
  attributes: { friendly_name: "Front Döör", entity_picture: "/image.jpg" },
});

function setup(snapshotState = "idle", liveState = "idle") {
  const config = normalizeConfig({
    recording_entity: "camera.recording",
    live_entity: "camera.front_door_live_view",
    snapshot_entity: "camera.front_door_snapshot",
    name: "Front Döör",
    show_snapshot_button: true,
    snapshot_directory: "/media/ring-view/",
  });
  const hass: HomeAssistant = {
    config: { time_zone: "Europe/Berlin" },
    states: {
      "camera.recording": camera("camera.recording"),
      "camera.front_door_live_view": camera(
        "camera.front_door_live_view",
        liveState,
      ),
      "camera.front_door_snapshot": camera(
        "camera.front_door_snapshot",
        snapshotState,
      ),
    },
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
  };
  return { config, hass };
}

describe("manual snapshots", () => {
  it("normalizes folders and identifies invalid paths", () => {
    expect(normalizeSnapshotDirectory(" /media/ring-view/// ")).toBe(
      "/media/ring-view",
    );
    expect(snapshotDirectoryProblem("")).toBe("required");
    expect(snapshotDirectoryProblem("media/ring-view")).toBe("absolute");
    expect(snapshotDirectoryProblem("/")).toBe("root");
    expect(snapshotDirectoryProblem("/media/../config")).toBe("unsafe");
    expect(snapshotDirectoryProblem("/media/{{ camera }}")).toBe("unsafe");
    expect(snapshotDirectoryProblem("/media/ring-view")).toBeUndefined();
  });

  it("warns only for public or custom locations", () => {
    expect(snapshotDirectoryWarning("/media/ring-view")).toBeUndefined();
    expect(snapshotDirectoryWarning("/config/www/ring-view")).toBe("public");
    expect(snapshotDirectoryWarning("/mnt/camera")).toBe("custom");
  });

  it("prefers an available device snapshot and falls back to Live", () => {
    const available = setup();
    expect(selectSnapshotEntityId(available.hass, available.config)).toBe(
      "camera.front_door_snapshot",
    );

    for (const state of ["unavailable", "unknown"]) {
      const fallback = setup(state);
      expect(selectSnapshotEntityId(fallback.hass, fallback.config)).toBe(
        "camera.front_door_live_view",
      );
    }

    const missing = setup("unavailable", "unavailable");
    expect(selectSnapshotEntityId(missing.hass, missing.config)).toBeUndefined();
  });

  it("finds a renamed Ring-MQTT snapshot button without guessing its entity ID", () => {
    const { hass } = setup();
    const snapshotId = "camera.front_door_snapshot";
    const refreshId = "button.renamed_camera_action";
    const unrelatedId = "button.restart_camera_bridge";
    hass.states[snapshotId] = {
      ...hass.states[snapshotId]!,
      attributes: {
        ...hass.states[snapshotId]!.attributes,
        timestamp: 1_789_208_130,
      },
    };
    hass.states[refreshId] = camera(refreshId);
    hass.states[unrelatedId] = camera(unrelatedId);
    hass.entities = {
      [snapshotId]: {
        entity_id: snapshotId,
        platform: "mqtt",
        device_id: "front-door",
        unique_id: "083a8804c4c5_snapshot",
      },
      [refreshId]: {
        entity_id: refreshId,
        platform: "mqtt",
        device_id: "front-door",
        unique_id: "083a8804c4c5_take_snapshot",
        original_name: "Take Snapshot",
      },
      [unrelatedId]: {
        entity_id: unrelatedId,
        platform: "mqtt",
        device_id: "front-door",
        unique_id: "083a8804c4c5_restart",
      },
    };

    expect(findRingMqttSnapshotButton(hass, snapshotId)).toBe(refreshId);
    expect(snapshotCaptureMarker(hass, snapshotId)).toBe(1_789_208_130_000);
  });

  it("finds a renamed same-device Ring-MQTT snapshot camera", () => {
    const { hass } = setup();
    const anchorId = "select.renamed_events";
    const snapshotId = "camera.renamed_snapshot";
    hass.states[anchorId] = {
      entity_id: anchorId,
      state: "Ding 1",
      attributes: {},
    };
    hass.states[snapshotId] = camera(snapshotId);
    hass.entities = {
      [anchorId]: {
        entity_id: anchorId,
        platform: "mqtt",
        device_id: "front-door",
      },
      [snapshotId]: {
        entity_id: snapshotId,
        platform: "mqtt",
        device_id: "front-door",
        unique_id: "083a8804c4c5_snapshot",
        original_name: "Snapshot",
      },
    };

    expect(findRingMqttSnapshotCamera(hass, anchorId)).toBe(snapshotId);
    hass.entities[snapshotId] = {
      ...hass.entities[snapshotId]!,
      disabled_by: "user",
    };
    expect(findRingMqttSnapshotCamera(hass, anchorId)).toBeUndefined();
  });

  it("uses only an unambiguous MQTT button when registry identity is compact", () => {
    const { hass } = setup();
    const snapshotId = "camera.front_door_snapshot";
    const firstId = "button.renamed_action";
    hass.states[firstId] = camera(firstId);
    hass.entities = {
      [snapshotId]: {
        entity_id: snapshotId,
        platform: "mqtt",
        device_id: "front-door",
      },
      [firstId]: {
        entity_id: firstId,
        platform: "mqtt",
        device_id: "front-door",
      },
    };
    expect(findRingMqttSnapshotButton(hass, snapshotId)).toBe(firstId);

    const secondId = "button.another_action";
    hass.states[secondId] = camera(secondId);
    hass.entities[secondId] = {
      entity_id: secondId,
      platform: "mqtt",
      device_id: "front-door",
    };
    expect(findRingMqttSnapshotButton(hass, snapshotId)).toBeUndefined();

    hass.entities[snapshotId] = {
      ...hass.entities[snapshotId]!,
      platform: "ring",
    };
    expect(findRingMqttSnapshotButton(hass, snapshotId)).toBeUndefined();
  });

  it("builds a safe timestamped filename in the Home Assistant timezone", () => {
    const { config, hass } = setup();
    const date = new Date("2026-09-12T12:30:22.381Z");
    expect(snapshotCameraSlug(hass, config)).toBe("front-door");
    expect(formatSnapshotTimestamp(date, "Europe/Berlin")).toBe(
      "2026-09-12_14-30-22-381",
    );
    expect(formatSnapshotTimestamp(date, "Not/A_Timezone")).toMatch(
      /^2026-09-12_\d{2}-30-22-381$/,
    );
    expect(buildSnapshotFilename(hass, config, date)).toBe(
      "/media/ring-view/front-door_2026-09-12_14-30-22-381.jpg",
    );
  });

  it("falls back to a stable camera slug", () => {
    const { config, hass } = setup();
    const withoutNames = {
      ...config,
      name: undefined,
      live_entity: "camera.front_door_live_view",
    };
    hass.states[withoutNames.live_entity] = {
      ...hass.states[withoutNames.live_entity]!,
      attributes: {},
    };
    expect(snapshotCameraSlug(hass, withoutNames)).toBe(
      "front-door-live-view",
    );
  });
});
