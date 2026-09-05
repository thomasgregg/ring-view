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
