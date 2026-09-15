import { afterEach, describe, expect, it } from "vitest";
import "../../src/index";
import { normalizeConfig } from "../../src/config";
import type { HomeAssistant } from "../../src/types";
import {
  aspectRatioFromDimensions,
  aspectRatiosMatch,
} from "../../src/utilities/media-aspect-ratio";
import type { RingView } from "../../src/ring-view";
import type { RingViewDialog } from "../../src/ring-view-dialog";

const hass: HomeAssistant = {
  states: {
    "camera.recording": {
      entity_id: "camera.recording",
      state: "idle",
      attributes: {
        entity_picture: "/recording.jpg",
        video_url: "https://example.test/recording.mp4",
      },
    },
    "camera.live": {
      entity_id: "camera.live",
      state: "idle",
      attributes: {
        entity_picture: "/live.jpg",
        supported_features: 2,
      },
    },
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
};

function setImageDimensions(
  image: HTMLImageElement,
  width: number,
  height: number,
): void {
  Object.defineProperties(image, {
    naturalWidth: { configurable: true, value: width },
    naturalHeight: { configurable: true, value: height },
  });
}

function setVideoDimensions(
  video: HTMLVideoElement,
  width: number,
  height: number,
): void {
  Object.defineProperties(video, {
    videoWidth: { configurable: true, value: width },
    videoHeight: { configurable: true, value: height },
  });
}

async function flush(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe("automatic media aspect ratio", () => {
  afterEach(() => document.body.replaceChildren());

  it("rejects missing dimensions and treats small adaptive-stream changes as equal", () => {
    expect(aspectRatioFromDimensions(0, 1080)).toBeUndefined();
    expect(aspectRatioFromDimensions(1920, 0)).toBeUndefined();
    expect(aspectRatioFromDimensions(Number.NaN, 1080)).toBeUndefined();
    expect(aspectRatioFromDimensions(1080, 1080)).toBe(1);
    expect(aspectRatiosMatch(16 / 9, 1921 / 1080)).toBe(true);
    expect(aspectRatiosMatch(16 / 9, 4 / 3)).toBe(false);
  });

  it("sizes a passive card from its loaded poster while explicit shapes win", async () => {
    const card = document.createElement("ring-view") as RingView;
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      aspect_ratio: "auto",
      fit_mode: "contain",
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;

    const image = card.shadowRoot!.querySelector<HTMLImageElement>(".preview > img")!;
    setImageDimensions(image, 1080, 1080);
    image.dispatchEvent(new Event("load"));
    await card.updateComplete;
    expect(
      card.shadowRoot!.querySelector<HTMLElement>(".preview")!.style
        .getPropertyValue("--ring-view-aspect-ratio"),
    ).toBe("1");

    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      aspect_ratio: "4:3",
      fit_mode: "contain",
    });
    await card.updateComplete;
    image.dispatchEvent(new Event("load"));
    await card.updateComplete;
    expect(
      card.shadowRoot!.querySelector<HTMLElement>(".preview")!.style
        .getPropertyValue("--ring-view-aspect-ratio"),
    ).toBe("4 / 3");
  });

  it("does not force a thumbnail height before discovering native shape", async () => {
    const signedHass: HomeAssistant = {
      ...hass,
      callWS: async () => ({
        path: "/api/camera_proxy/camera.recording?authSig=temporary",
      }) as never,
    };
    const card = document.createElement("ring-view") as RingView;
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      aspect_ratio: "auto",
    });
    card.hass = signedHass;
    document.body.append(card);
    await flush();

    const source = card.shadowRoot!.querySelector<HTMLImageElement>(".preview > img")!.src;
    expect(source).toContain("authSig=temporary");
    expect(source).toContain("width=");
    expect(source).not.toContain("height=");
  });

  it("propagates an inline viewer poster ratio to the outer card and resets on mode change", async () => {
    const card = document.createElement("ring-view") as RingView;
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      dashboard_behavior: "interactive",
      aspect_ratio: "auto",
    });
    card.hass = hass;
    document.body.append(card);
    await flush();

    const dialog = card.shadowRoot!.querySelector<RingViewDialog>(
      "ring-view-dialog[inline]",
    )!;
    const poster = dialog.shadowRoot!.querySelector<HTMLImageElement>(".poster")!;
    setImageDimensions(poster, 900, 1200);
    poster.dispatchEvent(new Event("load"));
    await dialog.updateComplete;
    await card.updateComplete;
    expect(
      card.shadowRoot!.querySelector<HTMLElement>(".inline-shell")!.style
        .getPropertyValue("--ring-view-aspect-ratio"),
    ).toBe("0.75");

    dialog.shadowRoot!.querySelector<HTMLButtonElement>("#ring-view-tab-live")!.click();
    // The old recording poster can finish between the synchronous mode change
    // and Lit replacing its entity identity on the next update.
    setImageDimensions(poster, 1000, 1000);
    poster.dispatchEvent(new Event("load"));
    await dialog.updateComplete;
    await card.updateComplete;
    expect(
      card.shadowRoot!.querySelector<HTMLElement>(".inline-shell")!.style
        .getPropertyValue("--ring-view-aspect-ratio"),
    ).toBe("16 / 9");
  });

  it("lets playable media override its poster without a late poster load winning", async () => {
    const dialog = document.createElement("ring-view-dialog") as RingViewDialog;
    dialog.hass = hass;
    document.body.append(dialog);
    dialog.showDialog({
      mode: "last_recording",
      config: normalizeConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        aspect_ratio: "auto",
      }),
    });
    await dialog.updateComplete;

    const poster = dialog.shadowRoot!.querySelector<HTMLImageElement>(".poster")!;
    setImageDimensions(poster, 1000, 1000);
    poster.dispatchEvent(new Event("load"));
    await dialog.updateComplete;
    expect(
      dialog.shadowRoot!.querySelector<HTMLElement>(".dialog")!.style
        .getPropertyValue("--ring-view-aspect-ratio"),
    ).toBe("1");

    const video = dialog.shadowRoot!.querySelector<HTMLVideoElement>(".video-fallback")!;
    setVideoDimensions(video, 1920, 1080);
    video.dispatchEvent(new Event("loadedmetadata"));
    await dialog.updateComplete;
    const mediaRatio = dialog.shadowRoot!.querySelector<HTMLElement>(".dialog")!.style
      .getPropertyValue("--ring-view-aspect-ratio");
    expect(Number(mediaRatio)).toBeCloseTo(16 / 9);

    setImageDimensions(poster, 800, 600);
    poster.dispatchEvent(new Event("load"));
    await dialog.updateComplete;
    expect(
      Number(
        dialog.shadowRoot!.querySelector<HTMLElement>(".dialog")!.style
          .getPropertyValue("--ring-view-aspect-ratio"),
      ),
    ).toBeCloseTo(16 / 9);
  });
});
