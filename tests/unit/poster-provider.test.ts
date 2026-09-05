import { describe, expect, it, vi } from "vitest";
import { sizedPosterUrl } from "../../src/media/poster-provider";
import type { HomeAssistant } from "../../src/types";

describe("sized camera poster", () => {
  it("requests a signed camera proxy path with physical pixel dimensions", async () => {
    const callWS = vi.fn(async (_message: Record<string, unknown>) => ({
      path: "/api/camera_proxy/camera.recording?authSig=temporary",
    }));
    const hass: HomeAssistant = {
      states: {},
      hassUrl: (path = "") => `https://ha.test${path}`,
      callWS: <T>(message: Record<string, unknown>) =>
        callWS(message) as unknown as Promise<T>,
    };

    const url = await sizedPosterUrl(hass, "camera.recording", 781.2, 439.1);

    expect(callWS).toHaveBeenCalledWith({
      type: "auth/sign_path",
      path: "/api/camera_proxy/camera.recording",
    });
    expect(url).toContain("&width=782&height=440");
  });

  it("reuses only the short-lived in-memory signed path", async () => {
    vi.useFakeTimers();
    const callWS = vi.fn(async (_message: Record<string, unknown>) => ({
      path: "/signed?authSig=temporary",
    }));
    const hass: HomeAssistant = {
      states: {},
      hassUrl: (path = "") => path,
      callWS: <T>(message: Record<string, unknown>) =>
        callWS(message) as unknown as Promise<T>,
    };

    await sizedPosterUrl(hass, "camera.recording", 640, 360);
    await sizedPosterUrl(hass, "camera.recording", 1280, 720);
    expect(callWS).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(9_001);
    await sizedPosterUrl(hass, "camera.recording", 1280, 720);
    expect(callWS).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });
});
