import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  buildSnapshotFilename,
  formatSnapshotTimestamp,
  normalizeSnapshotDirectory,
  selectSnapshotEntityId,
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
