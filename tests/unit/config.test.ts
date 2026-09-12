import { describe, expect, it } from "vitest";
import { normalizeConfig, validateConfig } from "../../src/config";

describe("configuration", () => {
  it("applies the focused defaults to a minimal config", () => {
    const config = normalizeConfig({
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
    });

    expect(config).toMatchObject({
      type: "custom:ring-view",
      default_mode: "last_recording",
      remember_last_mode: false,
      autoplay_recording: true,
      live_muted: false,
      two_way_audio: false,
      door_action: "unlock",
      door_control_visibility: "live_only",
      door_control_location: "viewer_only",
      door_hold_to_activate: true,
      dashboard_behavior: "open_viewer",
      dashboard_start: "on_demand",
      dashboard_live_muted: true,
      show_name: false,
      preview_source: "last_recording",
      preview_fallback: "last_recording",
      show_snapshot_button: false,
      snapshot_directory: "/media/ring-view",
      aspect_ratio: "16:9",
      fit_mode: "cover",
    });
  });

  it("rejects missing, non-camera, and invalid appearance values", () => {
    expect(() =>
      validateConfig({ recording_entity: "light.porch", live_entity: "camera.live" }),
    ).toThrow(/camera entity/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        fit_mode: "fill",
      } as never),
    ).toThrow(/fit_mode/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        preview_source: "moving_picture",
      } as never),
    ).toThrow(/preview_source/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        doorbell_entity: "sensor.doorbell",
      }),
    ).toThrow(/doorbell_entity/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        snapshot_entity: "sensor.snapshot",
      }),
    ).toThrow(/camera entity/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        preview_fallback: "live",
      } as never),
    ).toThrow(/preview_fallback/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        door_entity: "button.front_door",
      }),
    ).toThrow(/door_entity/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        door_contact_entity: "sensor.front_door_contact",
      }),
    ).toThrow(/door_contact_entity/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        door_action: "lock",
      } as never),
    ).toThrow(/door_action/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        dashboard_behavior: "always_live",
      } as never),
    ).toThrow(/dashboard_behavior/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        dashboard_start: "viewer_default",
      } as never),
    ).toThrow(/dashboard_start/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        door_control_location: "dashboard_only",
      } as never),
    ).toThrow(/door_control_location/);
  });

  it.each(["event.front_door_ding", "binary_sensor.front_door_ding"])(
    "accepts %s as a doorbell entity",
    (doorbellEntity) => {
      expect(
        normalizeConfig({
          recording_entity: "camera.recording",
          live_entity: "camera.live",
          doorbell_entity: doorbellEntity,
        }).doorbell_entity,
      ).toBe(doorbellEntity);
    },
  );

  it("accepts the optional snapshot and freshest-preview settings", () => {
    expect(
      normalizeConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        snapshot_entity: "camera.snapshot",
        preview_source: "newest",
        preview_fallback: "snapshot",
      }),
    ).toMatchObject({
      snapshot_entity: "camera.snapshot",
      preview_source: "newest",
      preview_fallback: "snapshot",
    });
  });

  it("normalizes and validates manual snapshot storage", () => {
    expect(
      normalizeConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        show_snapshot_button: true,
        snapshot_directory: " /media/ring-view/ ",
      }),
    ).toMatchObject({
      show_snapshot_button: true,
      snapshot_directory: "/media/ring-view",
    });

    for (const snapshot_directory of [
      "",
      "media/ring-view",
      "/",
      "/media/../config",
      "/media/{{ camera }}",
    ]) {
      expect(() =>
        validateConfig({
          recording_entity: "camera.recording",
          live_entity: "camera.live",
          snapshot_directory,
        }),
      ).toThrow(/snapshot_directory/);
    }
  });

  it("normalizes an optional last activity timestamp entity", () => {
    expect(
      normalizeConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        last_activity_entity: "sensor.front_door_last_activity",
      }).last_activity_entity,
    ).toBe("sensor.front_door_last_activity");
    expect(
      normalizeConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        last_activity_entity: "",
      }).last_activity_entity,
    ).toBeUndefined();
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        last_activity_entity: "not-an-entity",
      }),
    ).toThrow(/last_activity_entity/);
  });

  it("preserves explicit grid sizing", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      grid_options: { columns: 9, rows: 4 },
    });
    expect(config.grid_options).toEqual({ columns: 9, rows: 4 });
  });

  it("normalizes the optional door-access settings", () => {
    expect(
      normalizeConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        door_entity: "lock.front_door",
        door_contact_entity: "binary_sensor.front_door_contact",
        door_action: "open",
        door_control_visibility: "all_views",
        door_hold_to_activate: false,
      }),
    ).toMatchObject({
      door_entity: "lock.front_door",
      door_contact_entity: "binary_sensor.front_door_contact",
      door_action: "open",
      door_control_visibility: "all_views",
      door_hold_to_activate: false,
    });
  });

  it("normalizes an explicitly enabled interactive dashboard", () => {
    expect(
      normalizeConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        dashboard_behavior: "interactive",
        dashboard_start: "live",
        dashboard_live_muted: false,
        door_control_location: "dashboard_and_viewer",
      }),
    ).toMatchObject({
      dashboard_behavior: "interactive",
      dashboard_start: "live",
      dashboard_live_muted: false,
      door_control_location: "dashboard_and_viewer",
    });
  });

  it("drops the removed nested configuration instead of preserving it", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      preview: { source: "live", show_name: true },
      viewer: { live_muted: true },
      performance: { debug: true },
      show_mode_icon: true,
    } as never);
    expect(config).not.toHaveProperty("preview");
    expect(config).not.toHaveProperty("viewer");
    expect(config).not.toHaveProperty("performance");
    expect(config).not.toHaveProperty("show_mode_icon");
    expect(config.show_name).toBe(false);
    expect(config.live_muted).toBe(false);
  });
});
