import { beforeEach, describe, expect, it, vi } from "vitest";
import { normalizeConfig } from "../../src/config";
import {
  createRingViewUrl,
  decodeRingViewUrl,
  removeRingViewUrl,
  replaceCurrentUrl,
  ringViewUrlMatchesConfig,
} from "../../src/utilities/dialog-url";

describe("dialog URL state", () => {
  beforeEach(() => {
    history.replaceState({ root: true }, "", "/dashboard/security?panel=front#camera");
  });

  it("round-trips the camera pair, selected mode, and active ring alert", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000);
    const url = createRingViewUrl(location.href, {
      liveEntity: "camera.entrance_live",
      recordingEntity: "camera.entrance_recording",
      mode: "live",
      ringingUntil: 13_000,
    });

    expect(url).toContain("panel=front");
    expect(url).toContain("ring-view-live-entity=camera.entrance_live");
    expect(url).toContain("ring-view-mode=live");
    expect(url.endsWith("#camera")).toBe(true);
    expect(decodeRingViewUrl(new URL(url, location.origin).search)).toEqual({
      liveEntity: "camera.entrance_live",
      recordingEntity: "camera.entrance_recording",
      mode: "live",
      ringingUntil: 13_000,
    });
    expect(removeRingViewUrl(url)).toBe("/dashboard/security?panel=front#camera");
  });

  it("matches only the card that owns both camera entities", () => {
    const state = {
      liveEntity: "camera.entrance_live",
      recordingEntity: "camera.entrance_recording",
      mode: "last_recording" as const,
    };
    expect(
      ringViewUrlMatchesConfig(
        state,
        normalizeConfig({
          live_entity: state.liveEntity,
          recording_entity: state.recordingEntity,
        }),
      ),
    ).toBe(true);
    expect(
      ringViewUrlMatchesConfig(
        state,
        normalizeConfig({
          live_entity: "camera.garden_live",
          recording_entity: state.recordingEntity,
        }),
      ),
    ).toBe(false);
  });

  it("keeps Home Assistant history fields while adding its recoverable URL", () => {
    replaceCurrentUrl("/dashboard/security?ring-view-mode=live", "/restore-ring-view");
    expect(history.state).toEqual({ root: true, refreshUrl: "/restore-ring-view" });
    replaceCurrentUrl("/dashboard/security", null);
    expect(history.state).toEqual({ root: true });
  });
});
