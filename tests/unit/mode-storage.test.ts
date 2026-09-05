import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import { loadMode, saveMode, storageKey } from "../../src/utilities/mode-storage";

const base = {
  recording_entity: "camera.recording",
  live_entity: "camera.live",
};

describe("remembered mode", () => {
  it("does not persist when disabled", () => {
    const config = normalizeConfig(base);
    saveMode(config, "live");
    expect(window.localStorage.getItem(storageKey(config))).toBeNull();
    expect(loadMode(config)).toBe("last_recording");
  });

  it("persists locally per camera pair when enabled", () => {
    const config = normalizeConfig({ ...base, remember_last_mode: true });
    saveMode(config, "live");
    expect(loadMode(config)).toBe("live");
  });

  it("ignores corrupt stored values", () => {
    const config = normalizeConfig({ ...base, remember_last_mode: true });
    window.localStorage.setItem(storageKey(config), "unexpected");
    expect(loadMode(config)).toBe("last_recording");
  });
});
