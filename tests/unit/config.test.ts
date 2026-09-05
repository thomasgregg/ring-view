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
      live_muted: false,
      show_name: false,
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
  });

  it("preserves explicit grid sizing", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      grid_options: { columns: 9, rows: 4 },
    });
    expect(config.grid_options).toEqual({ columns: 9, rows: 4 });
  });

  it("drops the removed nested configuration instead of preserving it", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      preview: { source: "live", show_name: true },
      viewer: { live_muted: true },
      performance: { debug: true },
    } as never);
    expect(config).not.toHaveProperty("preview");
    expect(config).not.toHaveProperty("viewer");
    expect(config).not.toHaveProperty("performance");
    expect(config.show_name).toBe(false);
    expect(config.live_muted).toBe(false);
  });
});
