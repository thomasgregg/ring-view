import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/ring-view-dialog";
import { normalizeConfig } from "../../src/config";
import type { HomeAssistant } from "../../src/types";
import { TestCameraStream } from "../setup";

const config = normalizeConfig({ live_entity: "camera.live", recording_entity: "camera.recording" });
const hass: HomeAssistant = {
  states: {
    "camera.live": { entity_id: "camera.live", state: "idle", attributes: { supported_features: 2 } },
    "camera.recording": {
      entity_id: "camera.recording", state: "idle",
      attributes: { video_url: "https://example.test/recording.mp4" },
    },
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
};
const flush = () => vi.advanceTimersByTimeAsync(0);

async function mount() {
  const dialog = document.createElement("ring-view-dialog");
  dialog.hass = hass;
  document.body.append(dialog);
  dialog.showDialog({ mode: "last_recording", config });
  await flush();
  const video = () => dialog.shadowRoot!.querySelector<HTMLVideoElement>(".video-fallback")!;
  return { dialog, video };
}

describe("recording player lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestCameraStream.autoLoad = false;
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("hides native video chrome until the recording can play", async () => {
    const { dialog, video } = await mount();
    expect(video().classList.contains("pending")).toBe(true);
    expect(dialog.shadowRoot!.querySelector(".spinner")).not.toBeNull();

    video().dispatchEvent(new Event("canplay"));
    await flush();

    expect(video().classList.contains("pending")).toBe(false);
    expect(dialog.shadowRoot!.querySelector(".spinner")).toBeNull();
  });

  it("recognizes each replacement recording after repeated app backgrounding", async () => {
    const visibility = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();
    expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();

    for (let cycle = 0; cycle < 2; cycle += 1) {
      const previous = video();
      visibility.mockReturnValue(true);
      document.dispatchEvent(new Event("visibilitychange"));
      await flush();
      expect(previous.isConnected).toBe(false);
      visibility.mockReturnValue(false);
      document.dispatchEvent(new Event("visibilitychange"));
      await flush();
      const replacement = video();
      expect(replacement).not.toBe(previous);
      replacement.dispatchEvent(new Event("canplay"));
      replacement.dispatchEvent(new Event("canplay"));
      await vi.advanceTimersByTimeAsync(25_000);
      expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();
      expect(video()).toBe(replacement);
    }
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(3);
  });

  it.each(["resolve", "reject"] as const)("ignores a late recording %s after switching to Live", async (settlement) => {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    vi.mocked(HTMLMediaElement.prototype.play).mockReturnValueOnce(new Promise<void>((yes, no) => {
      resolve = yes;
      reject = no;
    }));
    const { dialog, video } = await mount();
    const previous = video();
    previous.dispatchEvent(new Event("canplay"));
    dialog.shadowRoot!.querySelector<HTMLButtonElement>("#ring-view-tab-live")!.click();
    await flush();
    const live = dialog.shadowRoot!.querySelector("ring-view-native-camera-adapter")!;
    expect(previous.isConnected).toBe(false);
    if (settlement === "resolve") resolve();
    else reject(new Error("Old recording stopped"));
    await flush();
    expect(live.classList.contains("pending")).toBe(true);
    // The old promise must not cancel Live's timeout or mark it ready.
    await vi.advanceTimersByTimeAsync(45_000);
    expect(dialog.shadowRoot!.querySelector('[role="alert"]')).not.toBeNull();
  });

  it.each(["resolve", "reject"] as const)("ignores an old muted-playback %s after reopening the dialog", async (settlement) => {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockRejectedValueOnce(new DOMException("Autoplay blocked", "NotAllowedError"));
    play.mockReturnValueOnce(new Promise<void>((yes, no) => { resolve = yes; reject = no; }));
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();
    expect(play).toHaveBeenCalledTimes(2);
    dialog.close();
    await flush();
    dialog.showDialog({ mode: "last_recording", config });
    await flush();
    const replacement = video();
    if (settlement === "resolve") resolve();
    else reject(new Error("Old muted playback stopped"));
    await flush();
    expect(video()).toBe(replacement);
    replacement.dispatchEvent(new Event("canplay"));
    await vi.advanceTimersByTimeAsync(25_000);
    expect(play).toHaveBeenCalledTimes(3);
    expect(video()).toBe(replacement);
    expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();
  });
});
