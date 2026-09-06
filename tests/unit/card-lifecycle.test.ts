import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/index";
import type { HomeAssistant, HassEntity } from "../../src/types";
import type { RingView } from "../../src/ring-view";
import type { RingViewDialog } from "../../src/ring-view-dialog";
import type { RingViewNativeCameraAdapter } from "../../src/media/native-camera-adapter";
import { TestCameraStream } from "../setup";

const camera = (id: string, features: number): HassEntity => ({
  entity_id: id,
  state: "idle",
  attributes: {
    friendly_name: id,
    entity_picture: "/image.jpg",
    supported_features: features,
  },
});

const hass: HomeAssistant = {
  states: {
    "camera.recording": camera("camera.recording", 0),
    "camera.live": camera("camera.live", 2),
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
};

async function mount(): Promise<RingView> {
  const card = document.createElement("ring-view");
  card.setConfig({ recording_entity: "camera.recording", live_entity: "camera.live" });
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  return card;
}

async function flush(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe("card stream lifecycle", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("never mounts a camera stream for the dashboard preview", async () => {
    const card = await mount();
    expect(card.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
    expect(card.shadowRoot?.querySelector(".mode-indicator")).toBeNull();
    expect(TestCameraStream.active).toBe(0);
  });

  it("shows the freshest configured still without adding a third viewer tab", async () => {
    const snapshot = {
      ...camera("camera.snapshot", 0),
      attributes: {
        ...camera("camera.snapshot", 0).attributes,
        entity_picture: "/snapshot.jpg",
        timestamp: Date.parse("2026-09-06T12:01:00Z") / 1_000,
      },
    };
    const recording = {
      ...hass.states["camera.recording"]!,
      attributes: {
        ...hass.states["camera.recording"]!.attributes,
        recorded_at: "2026-09-06T12:00:00Z",
      },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: recording.entity_id,
      live_entity: "camera.live",
      snapshot_entity: snapshot.entity_id,
      preview_source: "newest",
    });
    card.hass = {
      ...hass,
      states: { ...hass.states, [recording.entity_id]: recording, [snapshot.entity_id]: snapshot },
    };
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/snapshot.jpg",
    );
    expect(card.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog");
    expect(dialog?.shadowRoot?.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(
      dialog?.shadowRoot
        ?.querySelector("#ring-view-tab-recording")
        ?.getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("follows snapshot timestamp and recording ID changes received after load", async () => {
    const recording = {
      ...camera("camera.recording", 0),
      attributes: {
        ...camera("camera.recording", 0).attributes,
        entity_picture: "/recording.jpg",
        last_video_id: "recording-1",
      },
    };
    const snapshot = {
      ...camera("camera.snapshot", 0),
      attributes: {
        ...camera("camera.snapshot", 0).attributes,
        entity_picture: "/snapshot.jpg",
        timestamp: 1_780_000_000,
      },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: recording.entity_id,
      live_entity: "camera.live",
      snapshot_entity: snapshot.entity_id,
      preview_source: "newest",
      preview_fallback: "last_recording",
    });
    const initialHass = {
      ...hass,
      states: { ...hass.states, [recording.entity_id]: recording, [snapshot.entity_id]: snapshot },
    };
    card.hass = initialHass;
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/recording.jpg",
    );

    const newerSnapshot = {
      ...snapshot,
      attributes: { ...snapshot.attributes, timestamp: 1_780_000_060 },
    };
    card.hass = {
      ...initialHass,
      states: { ...initialHass.states, [snapshot.entity_id]: newerSnapshot },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/snapshot.jpg",
    );

    const newerRecording = {
      ...recording,
      attributes: { ...recording.attributes, last_video_id: "recording-2" },
    };
    card.hass = {
      ...initialHass,
      states: {
        ...initialHass.states,
        [recording.entity_id]: newerRecording,
        [snapshot.entity_id]: newerSnapshot,
      },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/recording.jpg",
    );
  });

  it("uses the synthetic scene in the card picker without requesting a camera", async () => {
    const callWS = vi.fn(async (_message: Record<string, unknown>) => ({
      path: "/api/camera_proxy/camera.recording?authSig=temporary",
    }));
    const picker = document.createElement("hui-card-picker");
    const card = document.createElement("ring-view");
    card.setConfig({ recording_entity: "camera.recording", live_entity: "camera.live" });
    card.hass = {
      ...hass,
      callWS: <T>(message: Record<string, unknown>) =>
        callWS(message) as unknown as Promise<T>,
    };
    picker.append(card);
    document.body.append(picker);
    await card.updateComplete;
    await Promise.resolve();

    const image = card.shadowRoot?.querySelector<HTMLImageElement>("img");
    expect(image?.src).toMatch(/^data:image\/svg\+xml/);
    expect(image?.src).not.toContain("image.jpg");
    expect(card.shadowRoot?.querySelector(".mode-indicator")).toBeNull();
    expect(callWS).not.toHaveBeenCalled();
  });

  it("uses one name setting for a top-left card label and the viewer title", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      name: "Entrance",
      show_name: true,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".name")?.textContent).toBe("Entrance");
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog");
    expect(dialog?.shadowRoot?.querySelector("h2")?.textContent).toBe("Entrance");
  });

  it("shows a fresh doorbell event without starting a stream and opens Live on tap", async () => {
    const doorbell: HassEntity = {
      entity_id: "event.front_door_ding",
      state: "2026-09-06T12:00:00Z",
      attributes: { event_type: "ring", event_types: ["ring"] },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      doorbell_entity: doorbell.entity_id,
    });
    card.hass = { ...hass, states: { ...hass.states, [doorbell.entity_id]: doorbell } };
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".ring-alert")).toBeNull();
    expect(TestCameraStream.active).toBe(0);

    card.hass = {
      ...hass,
      states: {
        ...hass.states,
        [doorbell.entity_id]: { ...doorbell, state: "2026-09-06T12:01:00Z" },
      },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".ring-alert")?.textContent).toContain(
      "Someone is at the door",
    );
    expect(TestCameraStream.active).toBe(0);

    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog");
    expect(
      dialog?.shadowRoot?.querySelector("#ring-view-tab-live")?.getAttribute("aria-selected"),
    ).toBe("true");
    expect(TestCameraStream.active).toBe(1);
  });

  it("keeps the card and viewer name hidden while preserving a dialog label", async () => {
    const card = await mount();
    expect(card.shadowRoot?.querySelector(".name")).toBeNull();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog");
    const section = dialog?.shadowRoot?.querySelector<HTMLElement>(".dialog");
    expect(dialog?.shadowRoot?.querySelector("h2")).toBeNull();
    expect(section?.getAttribute("aria-label")).toBe("Camera view");
    expect(section?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("waits for an explicit Play action when recording autoplay is disabled", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      autoplay_recording: false,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();

    const dialog = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog");
    const play = dialog?.shadowRoot?.querySelector<HTMLElement>(".play-recording");
    expect(play?.textContent).toContain("Play last recording");
    expect(TestCameraStream.active).toBe(0);
    play?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);
  });

  it("can remember the selected view", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      remember_last_mode: true,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".mode-indicator")).toBeNull();

    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    let dialog = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog");
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    dialog?.close();
    await flush();

    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    dialog = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog");
    expect(
      dialog?.shadowRoot
        ?.querySelector("#ring-view-tab-live")
        ?.getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("refreshes a native-sized still only while the preview is visible", async () => {
    vi.useFakeTimers();
    let intersectionCallback: IntersectionObserverCallback | undefined;
    class TestIntersectionObserver {
      public constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      public observe(): void {}
      public unobserve(): void {}
      public disconnect(): void {}
      public takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
      public readonly root = null;
      public readonly rootMargin = "0px";
      public readonly thresholds = [0];
    }
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);

    const callWS = vi.fn(async (_message: Record<string, unknown>) => ({
      path: "/api/camera_proxy/camera.recording?authSig=temporary",
    }));
    const card = document.createElement("ring-view");
    card.setConfig({ recording_entity: "camera.recording", live_entity: "camera.live" });
    card.hass = {
      ...hass,
      callWS: <T>(message: Record<string, unknown>) =>
        callWS(message) as unknown as Promise<T>,
    };
    document.body.append(card);
    await card.updateComplete;
    await Promise.resolve();
    expect(callWS).not.toHaveBeenCalled();

    intersectionCallback?.(
      [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(0);
    await card.updateComplete;
    expect(callWS).toHaveBeenCalledTimes(1);
    expect(callWS).toHaveBeenCalledWith({
      type: "auth/sign_path",
      path: "/api/camera_proxy/camera.recording",
    });
    const image = card.shadowRoot?.querySelector<HTMLImageElement>("img");
    expect(image?.getAttribute("src")).toContain("width=640&height=360");
    expect(card.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();

    await vi.advanceTimersByTimeAsync(10_000);
    await Promise.resolve();
    expect(callWS).toHaveBeenCalledTimes(2);

    intersectionCallback?.(
      [{ isIntersecting: false, intersectionRatio: 0 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    await vi.advanceTimersByTimeAsync(20_000);
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it("keeps exactly one renderer while switching and removes it on close", async () => {
    const card = await mount();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);

    const dialog = card.shadowRoot?.querySelector<RingViewDialog>(
      "ring-view-dialog",
    );
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);

    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-recording")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);

    dialog?.close();
    await flush();
    expect(TestCameraStream.active).toBe(0);
  });

  it("removes the renderer when the card disconnects", async () => {
    const card = await mount();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);
    card.remove();
    await flush();
    expect(TestCameraStream.active).toBe(0);
  });

  it("starts the temporary recording with audio and falls back muted if blocked", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    card.hass = {
      ...hass,
      states: {
        ...hass.states,
        "camera.recording": {
          ...hass.states["camera.recording"]!,
          attributes: {
            ...hass.states["camera.recording"]!.attributes,
            video_url: "https://example.test/latest-recording.mp4",
          },
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();

    const dialog = card.shadowRoot?.querySelector<RingViewDialog>(
      "ring-view-dialog",
    );
    const video = dialog?.shadowRoot?.querySelector<HTMLVideoElement>("video");
    expect(video?.src).toBe("https://example.test/latest-recording.mp4");
    expect(video?.muted).toBe(false);
    expect(TestCameraStream.active).toBe(0);
    const play = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new DOMException("Autoplay blocked", "NotAllowedError"))
      .mockResolvedValueOnce(undefined);
    Object.defineProperty(video, "play", { configurable: true, value: play });
    video?.dispatchEvent(new Event("canplay"));
    await flush();
    expect(play).toHaveBeenCalledTimes(2);
    expect(video?.muted).toBe(true);
    expect(dialog?.shadowRoot?.textContent).toContain(
      "Audio is muted because the browser blocked audible autoplay.",
    );
    expect(video?.controls).toBe(true);
    expect(dialog?.shadowRoot?.querySelector(".audio-button")).toBeNull();
    expect(play).toHaveBeenCalledTimes(2);

    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    expect(dialog?.shadowRoot?.querySelector("video")).toBeNull();
    expect(TestCameraStream.active).toBe(1);
  });

  it("announces when Home Assistant reports live audio", async () => {
    const card = await mount();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = card.shadowRoot?.querySelector<RingViewDialog>(
      "ring-view-dialog",
    );
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    const stream = dialog?.shadowRoot
      ?.querySelector("ring-view-native-camera-adapter")
      ?.shadowRoot?.querySelector<TestCameraStream>("ha-camera-stream");
    expect(stream?.muted).toBe(false);
    const player = document.createElement("span");
    stream?.shadowRoot?.append(player);
    player.dispatchEvent(
      new CustomEvent("streams", {
        detail: { hasAudio: true, hasVideo: true },
        bubbles: true,
        composed: true,
      }),
    );
    await flush();
    expect(dialog?.shadowRoot?.textContent).toContain(
      "Live view connected. Audio is available.",
    );

    expect(dialog?.shadowRoot?.querySelector(".audio-button")).toBeNull();
    expect(stream?.muted).toBe(false);
    expect(TestCameraStream.active).toBe(1);
  });

  it("leaves fullscreen and audio to the native media controls", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      live_muted: true,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = card.shadowRoot?.querySelector<RingViewDialog>(
      "ring-view-dialog",
    );
    expect(
      dialog?.shadowRoot?.querySelector("#ring-view-tab-recording .mode-icon-recording"),
    ).not.toBeNull();
    expect(
      dialog?.shadowRoot?.querySelector("#ring-view-tab-live .mode-icon-live"),
    ).not.toBeNull();
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();

    const adapter =
      dialog?.shadowRoot?.querySelector<RingViewNativeCameraAdapter>(
        "ring-view-native-camera-adapter",
      );
    const stream = adapter?.shadowRoot?.querySelector<
      TestCameraStream & { controls?: boolean }
    >(
      "ha-camera-stream",
    );
    expect(stream?.controls).toBe(true);
    expect(stream?.muted).toBe(true);
    expect(adapter?.passiveSurface).toBe(true);
    expect(dialog?.shadowRoot?.querySelector(".audio-button")).toBeNull();
    expect(
      dialog?.shadowRoot?.querySelector('[aria-label="Enter fullscreen"]'),
    ).toBeNull();
    expect(TestCameraStream.active).toBe(1);
  });
});
