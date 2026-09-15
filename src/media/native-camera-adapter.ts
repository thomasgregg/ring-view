import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { HassEntity } from "../types";
import {
  aspectRatioFromMedia,
  aspectRatiosMatch,
  mediaAspectRatioEvent,
} from "../utilities/media-aspect-ratio";

export type NativeAdapterFailure = "component-unavailable";
export interface NativeMediaCapabilities {
  hasAudio?: boolean;
  hasVideo?: boolean;
}

const NATIVE_TAG = "ha-camera-stream";
const LOAD_TIMEOUT_MS = 8_000;
const NATIVE_LAYOUT_STYLE_ID = "ring-view-native-layout";

async function waitForDefinition(tag: string, timeout: number): Promise<boolean> {
  if (customElements.get(tag)) return true;
  let timeoutId: number | undefined;
  try {
    await Promise.race([
      customElements.whenDefined(tag),
      new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error("timeout")), timeout);
      }),
    ]);
    return Boolean(customElements.get(tag));
  } catch {
    return false;
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
}

export async function ensureNativeCameraAvailable(): Promise<boolean> {
  if (customElements.get(NATIVE_TAG)) return true;
  try {
    const helpers = await window.loadCardHelpers?.();
    await helpers?.importMoreInfoControl?.("camera");
  } catch {
    // The compatibility fallback below handles unavailable internal APIs.
  }
  return waitForDefinition(NATIVE_TAG, LOAD_TIMEOUT_MS);
}

@customElement("ring-view-native-camera-adapter")
export class RingViewNativeCameraAdapter extends LitElement {
  public static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      background: transparent;
    }

    ha-camera-stream {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  @property({ attribute: false }) public stateObj?: HassEntity;
  @property({ type: Boolean }) public controls = true;
  @property({ type: Boolean }) public muted = true;
  @property({ type: Boolean, attribute: "allow-exoplayer" })
  public allowExoPlayer = true;
  @property({ type: Number, attribute: false }) public aspectRatio?: number;
  @property({ attribute: false }) public fitMode: "cover" | "contain" | "fill" =
    "cover";
  @property({ type: Boolean, attribute: "passive-surface" })
  public passiveSurface = false;

  @state() private nativeAvailable = Boolean(customElements.get(NATIVE_TAG));
  private eventHost?: HTMLElement;
  private eventRoot?: ShadowRoot;
  private mediaObserver?: MutationObserver;
  private observedMedia = new Set<HTMLImageElement | HTMLVideoElement>();
  private lastAspectRatio?: number;
  private handledStreamEvents = new WeakSet<Event>();
  private ready = false;

  public connectedCallback(): void {
    super.connectedCallback();
    void this.loadNativeComponent();
  }

  public disconnectedCallback(): void {
    this.detachEventListeners();
    this.replaceChildren();
    super.disconnectedCallback();
  }

  protected render() {
    if (!this.nativeAvailable || !this.stateObj) return nothing;
    return html`
      <ha-camera-stream
        .stateObj=${this.stateObj}
        .controls=${this.controls}
        .muted=${this.muted}
        .allowExoPlayer=${this.allowExoPlayer}
        .aspectRatio=${this.aspectRatio}
        .fitMode=${this.fitMode}
      ></ha-camera-stream>
    `;
  }

  protected updated(): void {
    if (!this.nativeAvailable) return;
    const stream = this.renderRoot.querySelector(NATIVE_TAG) as HTMLElement | null;
    if (!stream) return;
    this.attachEventListeners(stream);
  }

  private async loadNativeComponent(): Promise<void> {
    const available = await ensureNativeCameraAvailable();
    if (!this.isConnected) return;
    if (!available) {
      this.dispatchFailure("component-unavailable");
      return;
    }
    this.nativeAvailable = true;
    await this.updateComplete;
  }

  private attachEventListeners(stream: HTMLElement): void {
    const root = stream.shadowRoot;
    stream.style.setProperty("--ring-view-native-fit-mode", this.fitMode);
    if (stream === this.eventHost && root === this.eventRoot) {
      if (root) this.prepareNativeRoot(root);
      this.detectReadyMedia(root ?? undefined);
      return;
    }
    this.detachEventListeners();
    this.eventHost = stream;
    stream.addEventListener("click", this.handleSurfaceClick, true);
    stream.addEventListener("load", this.handleNativeLoad, true);
    stream.addEventListener("streams", this.handleStreams as EventListener, true);
    if (!root) return;
    this.eventRoot = root;
    root.addEventListener("streams", this.handleStreams as EventListener, true);
    root.addEventListener("load", this.handleShadowLoad, true);
    this.mediaObserver = new MutationObserver(() => {
      this.observeNativeMedia(root);
      this.prepareNativeRoot(root);
      this.detectReadyMedia(root);
    });
    this.mediaObserver.observe(root, { childList: true, subtree: true });
    this.observeNativeMedia(root);
    this.prepareNativeRoot(root);
    this.detectReadyMedia(root);
  }

  private observeNativeMedia(root: ShadowRoot): void {
    const roots: ShadowRoot[] = [root];
    const visited = new Set<ShadowRoot>();
    while (roots.length > 0) {
      const current = roots.pop()!;
      if (visited.has(current)) continue;
      visited.add(current);
      this.mediaObserver?.observe(current, { childList: true, subtree: true });
      current.querySelectorAll("*").forEach((element) => {
        if (
          (element instanceof HTMLImageElement || element instanceof HTMLVideoElement)
          && !this.observedMedia.has(element)
        ) {
          this.observedMedia.add(element);
          element.addEventListener("load", this.handleObservedMediaDimensions);
          element.addEventListener("loadedmetadata", this.handleObservedMediaDimensions);
          element.addEventListener("resize", this.handleObservedMediaDimensions);
          element.addEventListener("error", this.handleObservedMediaDimensions);
        }
        if (element.shadowRoot) roots.push(element.shadowRoot);
      });
    }
  }

  private prepareNativeRoot(root: ShadowRoot): void {
    if (root.getElementById(NATIVE_LAYOUT_STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = NATIVE_LAYOUT_STYLE_ID;
    style.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
      }

      img,
      ha-hls-player,
      ha-web-rtc-player {
        display: block;
        width: 100% !important;
        height: 100% !important;
        min-width: 0;
        min-height: 0;
        object-fit: var(--ring-view-native-fit-mode, cover) !important;
      }

      ha-web-rtc-player {
        --video-max-height: 100%;
      }
    `;
    root.append(style);
  }

  private detachEventListeners(): void {
    this.mediaObserver?.disconnect();
    this.mediaObserver = undefined;
    this.observedMedia.forEach((media) => {
      media.removeEventListener("load", this.handleObservedMediaDimensions);
      media.removeEventListener("loadedmetadata", this.handleObservedMediaDimensions);
      media.removeEventListener("resize", this.handleObservedMediaDimensions);
      media.removeEventListener("error", this.handleObservedMediaDimensions);
    });
    this.observedMedia.clear();
    this.lastAspectRatio = undefined;
    this.eventHost?.removeEventListener("click", this.handleSurfaceClick, true);
    this.eventHost?.removeEventListener("load", this.handleNativeLoad, true);
    this.eventHost?.removeEventListener(
      "streams",
      this.handleStreams as EventListener,
      true,
    );
    this.eventHost = undefined;
    this.eventRoot?.removeEventListener(
      "streams",
      this.handleStreams as EventListener,
      true,
    );
    this.eventRoot?.removeEventListener("load", this.handleShadowLoad, true);
    this.eventRoot = undefined;
  }

  private handleSurfaceClick = (event: MouseEvent): void => {
    if (!this.passiveSurface || event.detail === 0 || !this.eventHost) return;
    const rect = this.eventHost.getBoundingClientRect();
    const controlStripHeight = this.controls ? 64 : 0;
    if (event.clientY >= rect.bottom - controlStripHeight) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  };

  private handleNativeLoad = (event: Event): void => {
    // Home Assistant explicitly emits a CustomEvent from ha-camera-stream when
    // its MJPEG image is ready. Ignore retargeted native poster/image load events.
    if (event instanceof CustomEvent) this.handleReady();
  };

  private handleStreams = (event: Event): void => {
    if (this.handledStreamEvents.has(event)) return;
    this.handledStreamEvents.add(event);
    const detail = (event as CustomEvent<NativeMediaCapabilities>).detail;
    this.dispatchEvent(
      new CustomEvent<NativeMediaCapabilities>("native-media-capabilities", {
        detail: {
          hasAudio: detail?.hasAudio,
          hasVideo: detail?.hasVideo,
        },
        bubbles: true,
        composed: true,
      }),
    );
    if (detail?.hasVideo === true) this.handleReady();
    if (this.eventRoot) {
      this.observeNativeMedia(this.eventRoot);
      this.detectReadyMedia(this.eventRoot);
    }
    // A failed HLS/WebRTC candidate is not a final camera failure. Home
    // Assistant may immediately fall back to another native renderer (most
    // importantly MJPEG for Ring recordings). The enclosing
    // ha-camera-stream reports that fallback with its own `load` event.
  };

  private handleShadowLoad = (event: Event): void => {
    if (event.target instanceof HTMLImageElement) {
      this.detectReadyMedia(this.eventRoot);
    }
  };

  private detectReadyMedia(root?: ShadowRoot): void {
    if (!root) return;
    this.observeNativeMedia(root);
    const images: HTMLImageElement[] = [];
    const videos: HTMLVideoElement[] = [];
    this.observedMedia.forEach((media) => {
      if (!media.isConnected) {
        media.removeEventListener("load", this.handleObservedMediaDimensions);
        media.removeEventListener("loadedmetadata", this.handleObservedMediaDimensions);
        media.removeEventListener("resize", this.handleObservedMediaDimensions);
        media.removeEventListener("error", this.handleObservedMediaDimensions);
        this.observedMedia.delete(media);
        return;
      }
      if (media instanceof HTMLImageElement && media.complete && media.naturalWidth > 0) {
        this.handleReady();
      }
      if (aspectRatioFromMedia(media) === undefined) return;
      if (media instanceof HTMLVideoElement) {
        if (!media.error) videos.push(media);
      } else {
        images.push(media);
      }
    });
    // Native players often keep a poster image beside the actual video. Once
    // video metadata exists it is authoritative; a later poster load must not
    // pull Automatic back to the poster's shape. The newest candidate wins
    // during Home Assistant's renderer replacement/fallback transitions.
    const preferred = videos[videos.length - 1] ?? images[images.length - 1];
    if (preferred) this.reportMediaAspectRatio(preferred);
  }

  private handleObservedMediaDimensions = (event: Event): void => {
    if (
      (event.currentTarget instanceof HTMLImageElement
        || event.currentTarget instanceof HTMLVideoElement)
      && this.observedMedia.has(event.currentTarget)
    ) {
      this.detectReadyMedia(this.eventRoot);
    }
  };

  private reportMediaAspectRatio(
    media: HTMLImageElement | HTMLVideoElement,
  ): void {
    const aspectRatio = aspectRatioFromMedia(media);
    if (
      aspectRatio === undefined
      || aspectRatiosMatch(this.lastAspectRatio, aspectRatio)
    ) {
      return;
    }
    this.lastAspectRatio = aspectRatio;
    this.dispatchEvent(mediaAspectRatioEvent(aspectRatio));
  }

  private handleReady = (): void => {
    if (this.ready) return;
    this.ready = true;
    this.dispatchEvent(
      new CustomEvent("native-media-ready", { bubbles: true, composed: true }),
    );
  };

  private dispatchFailure(reason: NativeAdapterFailure): void {
    this.dispatchEvent(
      new CustomEvent<NativeAdapterFailure>("native-media-error", {
        detail: reason,
        bubbles: true,
        composed: true,
      }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ring-view-native-camera-adapter": RingViewNativeCameraAdapter;
  }
}
