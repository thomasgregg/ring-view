import { describe, expect, it } from "vitest";
import { normalizeConfig, validateConfig } from "../../src/config";

describe("configuration", () => {
  it("applies every documented default to a minimal config", () => {
    const config = normalizeConfig({
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
    });

    expect(config.default_mode).toBe("last_recording");
    expect(config.remember_last_mode).toBe(false);
    expect(config.autoplay_recording).toBe(true);
    expect(config.preview).toEqual({
      source: "last_recording",
      show_name: false,
      show_mode_badge: true,
    });
    expect(config.appearance).toEqual({
      aspect_ratio: "16:9",
      fit_mode: "cover",
    });
    expect(config.viewer.live_muted).toBe(false);
    expect(config.performance.live_timeout_seconds).toBe(20);
    expect(config.performance.retry_live_once).toBe(true);
  });

  it("rejects missing, non-camera, and out-of-range values", () => {
    expect(() =>
      validateConfig({ recording_entity: "light.porch", live_entity: "camera.live" }),
    ).toThrow(/camera entity/);
    expect(() =>
      validateConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        performance: { live_timeout_seconds: 61 },
      }),
    ).toThrow(/between 10 and 60/);
  });

  it("preserves explicit grid sizing", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      grid_options: { columns: 9, rows: 4 },
    });
    expect(config.grid_options).toEqual({ columns: 9, rows: 4 });
  });

  it("drops removed overlay options instead of preserving legacy behavior", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      appearance: { switch_position: "bottom" },
      viewer: { show_fullscreen: true },
    } as never);
    expect(config.appearance).not.toHaveProperty("switch_position");
    expect(config.viewer).not.toHaveProperty("show_fullscreen");
  });
});
