import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/media/native-camera-adapter";
import type { HassEntity } from "../../src/types";
import type { RingViewNativeCameraAdapter } from "../../src/media/native-camera-adapter";
import { TestCameraStream } from "../setup";

const recording: HassEntity = {
  entity_id: "camera.recording",
  state: "idle",
  attributes: {
    friendly_name: "Recording",
    entity_picture: "/image.jpg",
    supported_features: 0,
  },
};

async function flush(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe("native camera adapter", () => {
  afterEach(() => document.body.replaceChildren());

  it("allows Home Assistant to fall back after a preferred stream reports no video", async () => {
    TestCameraStream.autoLoad = false;
    const adapter = document.createElement(
      "ring-view-native-camera-adapter",
    ) as RingViewNativeCameraAdapter;
    adapter.stateObj = recording;
    const ready = vi.fn();
    const error = vi.fn();
    const capabilities = vi.fn();
    adapter.addEventListener("native-media-ready", ready);
    adapter.addEventListener("native-media-error", error);
    adapter.addEventListener("native-media-capabilities", capabilities);
    document.body.append(adapter);
    await adapter.updateComplete;
    await flush();

    const stream = adapter.shadowRoot?.querySelector("ha-camera-stream");
    expect(stream?.shadowRoot).not.toBeNull();
    const player = document.createElement("span");
    stream!.shadowRoot!.append(player);
    player.dispatchEvent(
      new CustomEvent("streams", {
        detail: { hasAudio: false, hasVideo: false },
        bubbles: true,
        composed: true,
      }),
    );
    expect(error).not.toHaveBeenCalled();
    expect(capabilities).toHaveBeenCalledOnce();
    expect(capabilities.mock.calls[0]?.[0]).toMatchObject({
      detail: { hasAudio: false, hasVideo: false },
    });

    const fallbackImage = document.createElement("img");
    Object.defineProperties(fallbackImage, {
      complete: { value: true },
      naturalWidth: { value: 1920 },
    });
    stream!.shadowRoot!.append(fallbackImage);
    await flush();
    expect(ready).toHaveBeenCalledOnce();
  });

  it("captures composed capability events on the native stream host", async () => {
    const adapter = document.createElement(
      "ring-view-native-camera-adapter",
    ) as RingViewNativeCameraAdapter;
    adapter.stateObj = recording;
    const capabilities = vi.fn();
    adapter.addEventListener("native-media-capabilities", capabilities);
    document.body.append(adapter);
    await adapter.updateComplete;
    await flush();

    const stream = adapter.shadowRoot?.querySelector("ha-camera-stream");
    stream?.dispatchEvent(
      new CustomEvent("streams", {
        detail: { hasAudio: true, hasVideo: true },
        bubbles: true,
        composed: true,
      }),
    );
    expect(capabilities).toHaveBeenCalledOnce();
    expect(capabilities.mock.calls[0]?.[0]).toMatchObject({
      detail: { hasAudio: true, hasVideo: true },
    });
  });

  it("reports dimensions from native images and nested video players", async () => {
    TestCameraStream.autoLoad = false;
    const adapter = document.createElement(
      "ring-view-native-camera-adapter",
    ) as RingViewNativeCameraAdapter;
    adapter.stateObj = recording;
    const ratios = vi.fn();
    adapter.addEventListener("ring-view-media-aspect-ratio", ratios);
    document.body.append(adapter);
    await adapter.updateComplete;
    await flush();

    const stream = adapter.shadowRoot!.querySelector("ha-camera-stream")!;
    const nestedPlayer = document.createElement("span");
    const nestedRoot = nestedPlayer.attachShadow({ mode: "open" });
    stream.shadowRoot!.append(nestedPlayer);
    const image = document.createElement("img");
    Object.defineProperties(image, {
      complete: { configurable: true, value: true },
      naturalWidth: { configurable: true, value: 1080 },
      naturalHeight: { configurable: true, value: 1080 },
    });
    nestedRoot.append(image);
    await flush();
    image.dispatchEvent(new Event("load"));

    expect(ratios).toHaveBeenCalledOnce();
    expect(ratios.mock.calls[0]?.[0]).toMatchObject({
      detail: { aspectRatio: 1 },
    });

    const video = document.createElement("video");
    Object.defineProperties(video, {
      videoWidth: { configurable: true, value: 1920 },
      videoHeight: { configurable: true, value: 1080 },
    });
    nestedRoot.append(video);
    await flush();
    video.dispatchEvent(new Event("loadedmetadata"));

    expect(ratios).toHaveBeenCalledTimes(2);
    expect(ratios.mock.calls[1]?.[0]).toMatchObject({
      detail: { aspectRatio: 16 / 9 },
    });

    Object.defineProperties(image, {
      naturalWidth: { configurable: true, value: 800 },
      naturalHeight: { configurable: true, value: 600 },
    });
    image.dispatchEvent(new Event("load"));
    expect(ratios).toHaveBeenCalledTimes(2);

    Object.defineProperty(video, "error", {
      configurable: true,
      value: {} as MediaError,
    });
    video.dispatchEvent(new Event("error"));
    expect(ratios).toHaveBeenCalledTimes(3);
    expect(ratios.mock.calls[2]?.[0]).toMatchObject({
      detail: { aspectRatio: 4 / 3 },
    });
  });

  it("forces Home Assistant camera media to fill the overlay surface", async () => {
    const adapter = document.createElement(
      "ring-view-native-camera-adapter",
    ) as RingViewNativeCameraAdapter;
    adapter.stateObj = recording;
    adapter.fitMode = "cover";
    document.body.append(adapter);
    await adapter.updateComplete;
    await flush();

    const stream = adapter.shadowRoot?.querySelector(
      "ha-camera-stream",
    ) as HTMLElement | null;
    const layoutStyle = stream?.shadowRoot?.getElementById(
      "ring-view-native-layout",
    );

    expect(stream?.style.getPropertyValue("--ring-view-native-fit-mode")).toBe(
      "cover",
    );
    expect(layoutStyle?.textContent).toContain("height: 100% !important");
    expect(layoutStyle?.textContent).toContain(
      "object-fit: var(--ring-view-native-fit-mode, cover) !important",
    );
    expect(layoutStyle?.textContent).toContain("--video-max-height: 100%");
  });

  it("suppresses live-surface clicks without blocking the native control strip", async () => {
    const adapter = document.createElement(
      "ring-view-native-camera-adapter",
    ) as RingViewNativeCameraAdapter;
    adapter.stateObj = recording;
    adapter.controls = true;
    adapter.passiveSurface = true;
    document.body.append(adapter);
    await adapter.updateComplete;
    await flush();

    const stream = adapter.shadowRoot?.querySelector("ha-camera-stream");
    vi.spyOn(stream!, "getBoundingClientRect").mockReturnValue({
      bottom: 500,
    } as DOMRect);

    const surfaceClick = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientY: 200,
      composed: true,
      detail: 1,
    });
    stream?.dispatchEvent(surfaceClick);
    expect(surfaceClick.defaultPrevented).toBe(true);

    const controlClick = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      clientY: 470,
      composed: true,
      detail: 1,
    });
    stream?.dispatchEvent(controlClick);
    expect(controlClick.defaultPrevented).toBe(false);
  });
});
