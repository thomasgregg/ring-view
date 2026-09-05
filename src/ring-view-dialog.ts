import { mdiClose, mdiPlay } from "@mdi/js";
import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { customElement, property, state } from "lit/decorators.js";
import { aspectRatioNumber } from "./config";
import "./media/native-camera-adapter";
import type {
  NativeAdapterFailure,
  NativeMediaCapabilities,
} from "./media/native-camera-adapter";
import { posterUrl } from "./media/poster-provider";
import { renderModeIcon } from "./mode-icon";
import { dialogStyles } from "./styles";
import type {
  CameraMode,
  HassEntity,
  HomeAssistant,
  NormalizedConfig,
} from "./types";
import { entityIsUnavailable, friendlyName } from "./utilities/entity-validation";
import { saveMode } from "./utilities/mode-storage";
import { StreamLifecycle } from "./utilities/stream-lifecycle";

type MediaStatus = "idle" | "pending" | "ready" | "error" | "compatibility";

@customElement("ring-view-dialog")
export class RingViewDialog extends LitElement {
  public static styles = dialogStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: NormalizedConfig;
  @property({ type: Boolean, reflect: true }) public open = false;

  @state() private mode: CameraMode = "last_recording";
  @state() private mediaStatus: MediaStatus = "idle";
  @state() private session = 0;
  @state() private suspended = false;
  @state() private recordingStarted = true;
  @state() private recordingMuted = false;
  @state() private liveMuted = true;
  @state() private liveHasAudio?: boolean;
  @state() private recordingVideoFailed = false;
  @state() private retryCount = 0;
  @state() private statusAnnouncement = "";

  private lifecycle = new StreamLifecycle();
  private historyMarker = `ring-view-${Math.random().toString(36).slice(2)}`;
  private ownsHistoryEntry = false;
  private opener?: HTMLElement;
  private audioFallbackAttempted = false;
  private recordingPlaybackPending = false;
  private recordingPlaybackStarted = false;

  public show(mode: CameraMode, opener?: HTMLElement): void {
    if (!this.config || !this.hass || this.open) return;
    this.opener = opener;
    this.mode = mode;
    this.liveMuted = this.config.viewer.live_muted;
    this.recordingStarted =
      mode === "live" || this.config.autoplay_recording;
    this.retryCount = 0;
    this.audioFallbackAttempted = false;
    this.recordingPlaybackPending = false;
    this.recordingPlaybackStarted = false;
    this.recordingMuted = false;
    this.liveHasAudio = undefined;
    this.recordingVideoFailed = false;
    this.suspended = false;
    this.open = true;
    this.debugLog("Viewer opened");
    this.pushHistoryEntry();
    this.attachGlobalListeners();
    this.startMedia();
    void this.updateComplete.then(() => this.focusInitialControl());
  }

  public close(): void {
    if (!this.open) return;
    if (this.ownsHistoryEntry && history.state?.ringView === this.historyMarker) {
      this.ownsHistoryEntry = false;
      history.back();
    }
    this.finishClose();
  }

  public disconnectedCallback(): void {
    this.finishClose(false);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!this.open || !changed.has("hass") || !this.config) return;
    const entity = this.activeEntity();
    if (entityIsUnavailable(entity) && this.mediaStatus !== "error") {
      this.lifecycle.dispose();
      this.session = this.lifecycle.current();
      this.mediaStatus = "error";
      this.statusAnnouncement = "Camera entity is unavailable.";
    }
  }

  protected render() {
    if (!this.open || !this.hass || !this.config) return nothing;
    const title = this.dialogTitle();
    const ratio = this.config.appearance.aspect_ratio;
    const style = {
      "--ring-view-aspect-ratio":
        ratio === "auto" ? "16 / 9" : ratio.replace(":", " / "),
      "--ring-view-fit-mode": this.config.appearance.fit_mode,
    };

    return html`
      <div class="backdrop" @pointerdown=${this.handleBackdrop}></div>
      <section
        class="dialog"
        style=${styleMap(style)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ring-view-dialog-title"
        @keydown=${this.handleKeyDown}
      >
        <div class="body">
          ${this.renderMedia()}
          <header class="header">
            <h2 id="ring-view-dialog-title">${title}</h2>
            <div class="header-actions">
              <button
                class="icon-button close"
                type="button"
                aria-label="Close camera viewer"
                title="Close"
                @click=${this.close}
              >
                ${this.icon(mdiClose)}
              </button>
            </div>
          </header>
          ${this.renderModeSwitch()}
        </div>
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          ${this.statusAnnouncement}
        </div>
      </section>
    `;
  }

  private renderModeSwitch(): TemplateResult {
    return html`
      <div class="mode-switch" role="tablist" aria-label="Camera view">
        <button
          id="ring-view-tab-recording"
          class="mode-button recording"
          type="button"
          role="tab"
          aria-label="Last recording"
          title="Last recording"
          aria-selected=${String(this.mode === "last_recording")}
          tabindex=${this.mode === "last_recording" ? "0" : "-1"}
          @click=${() => this.selectMode("last_recording")}
          @keydown=${this.handleTabKeyDown}
        >
          ${renderModeIcon("last_recording")}
        </button>
        <button
          id="ring-view-tab-live"
          class="mode-button live"
          type="button"
          role="tab"
          title="Live"
          aria-selected=${String(this.mode === "live")}
          tabindex=${this.mode === "live" ? "0" : "-1"}
          @click=${() => this.selectMode("live")}
          @keydown=${this.handleTabKeyDown}
        >
          ${renderModeIcon("live")}
        </button>
      </div>
    `;
  }

  private renderMedia(): TemplateResult {
    const entity = this.activeEntity();
    const entityId = this.activeEntityId();
    const unavailable = entityIsUnavailable(entity);
    const canRender = !unavailable && this.recordingStarted && !this.suspended;
    const ratio = aspectRatioNumber(this.config!.appearance.aspect_ratio);
    const poster = posterUrl(this.hass!, entity, entityId);
    const fallbackUrl =
      this.mode === "last_recording" && typeof entity?.attributes.video_url === "string"
        ? entity.attributes.video_url
        : undefined;
    const useRecordingVideo = Boolean(
      canRender && fallbackUrl && !this.recordingVideoFailed,
    );

    return html`
      <div
        class=${classMap({
          "media-frame": true,
          "auto-ratio": this.config!.appearance.aspect_ratio === "auto",
        })}
        role="tabpanel"
        aria-labelledby=${
          this.mode === "live" ? "ring-view-tab-live" : "ring-view-tab-recording"
        }
      >
        <img class="poster" src=${poster} alt="" aria-hidden="true" />
        ${canRender && !useRecordingVideo && this.mediaStatus !== "compatibility"
          ? keyed(
              `${entityId}:${this.session}`,
              html`
                <ring-view-native-camera-adapter
                  class=${this.mediaStatus === "pending" ? "pending" : ""}
                  .stateObj=${entity}
                  .controls=${this.config!.viewer.show_controls}
                  .muted=${this.mode === "live" ? this.liveMuted : this.recordingMuted}
                  .allowExoPlayer=${true}
                  .aspectRatio=${ratio}
                  .fitMode=${this.config!.appearance.fit_mode}
                  @native-media-ready=${this.handleMediaReady}
                  @native-media-error=${this.handleMediaError}
                  @native-media-capabilities=${this.handleMediaCapabilities}
                ></ring-view-native-camera-adapter>
              `,
            )
          : nothing}
        ${useRecordingVideo
          ? keyed(
              `${entityId}:${this.session}:recording-video`,
              html`
              <video
                class="video-fallback"
                src=${fallbackUrl}
                poster=${poster}
                playsinline
                autoplay
                preload="auto"
                ?controls=${this.config!.viewer.show_controls}
                .muted=${this.recordingMuted}
                @canplay=${this.handleRecordingCanPlay}
                @error=${this.handleRecordingVideoError}
              ></video>
            `,
            )
          : nothing}
        ${this.renderStateLayer(unavailable, useRecordingVideo)}
      </div>
    `;
  }

  private renderStateLayer(
    unavailable: boolean,
    hasRecordingFallback: boolean,
  ): TemplateResult | typeof nothing {
    if (unavailable) {
      const entity = this.activeEntity();
      return html`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">${friendlyName(entity, this.activeEntityId())}</div>
            <div class="state-detail">Camera entity is unavailable.</div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                Retry
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }

    if (this.mode === "last_recording" && !this.recordingStarted) {
      return html`
        <div class="state-layer">
          <div class="state-card">
            <button
              class="action-button primary"
              type="button"
              aria-label="Play last recording"
              @click=${this.startRecording}
            >
              ${this.icon(mdiPlay)} Play last recording
            </button>
          </div>
        </div>
      `;
    }

    if (this.suspended) {
      return html`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">Playback paused while this tab is hidden.</div>
          </div>
        </div>
      `;
    }

    if (this.mediaStatus === "pending") {
      return html`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="spinner" aria-hidden="true"></div>
            <div class="state-title">
              ${this.mode === "live"
                ? "Connecting to Ring live view…"
                : "Loading last recording…"}
            </div>
          </div>
        </div>
      `;
    }

    if (this.mediaStatus === "compatibility" && !hasRecordingFallback) {
      return html`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">Native camera playback is unavailable.</div>
            <div class="state-detail">
              This Home Assistant version did not provide the expected camera component.
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.openMoreInfo}>
                Open Home Assistant camera
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }

    if (this.mediaStatus === "error") {
      return html`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${this.mode === "live"
                ? "Live view could not be started."
                : "No Ring recording is currently available."}
            </div>
            ${this.mode === "last_recording"
              ? html`<div class="state-detail">A Ring Protect subscription may be required.</div>`
              : nothing}
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                Retry
              </button>
              ${this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }

    return nothing;
  }

  private renderAlternateModeButton(): TemplateResult {
    const alternate = this.mode === "live" ? "last_recording" : "live";
    return html`
      <button class="action-button" type="button" @click=${() => this.selectMode(alternate)}>
        ${alternate === "live" ? "Switch to Live" : "Switch to Last recording"}
      </button>
    `;
  }

  private selectMode(mode: CameraMode): void {
    if (!this.config || mode === this.mode) return;
    this.lifecycle.dispose();
    this.mode = mode;
    saveMode(this.config, mode);
    this.recordingStarted = mode === "live" || this.config.autoplay_recording;
    this.liveMuted = this.config.viewer.live_muted;
    this.retryCount = 0;
    this.audioFallbackAttempted = false;
    this.recordingPlaybackPending = false;
    this.recordingPlaybackStarted = false;
    this.recordingMuted = false;
    this.liveHasAudio = undefined;
    this.recordingVideoFailed = false;
    this.statusAnnouncement =
      mode === "live" ? "Live view selected." : "Last recording selected.";
    this.debugLog(`Mode selected: ${mode}`);
    this.startMedia();
  }

  private startRecording = (): void => {
    this.recordingStarted = true;
    this.startMedia();
  };

  private startMedia(): void {
    if (!this.open || this.suspended || !this.recordingStarted) {
      this.mediaStatus = "idle";
      return;
    }
    if (entityIsUnavailable(this.activeEntity())) {
      this.mediaStatus = "error";
      this.statusAnnouncement = "Camera entity is unavailable.";
      return;
    }
    this.mediaStatus = "pending";
    this.session = this.lifecycle.next();
    const timeoutSeconds = this.config?.performance.live_timeout_seconds ?? 20;
    this.lifecycle.scheduleTimeout(
      () => this.failMedia(true),
      timeoutSeconds * 1_000,
    );
  }

  private handleMediaReady = (): void => {
    this.lifecycle.clearTimeout();
    this.mediaStatus = "ready";
    this.statusAnnouncement =
      this.mode === "live"
        ? this.liveAudioStatus()
        : this.recordingMuted
          ? "Last recording loaded. Audio is muted because the browser blocked audible autoplay."
          : "Last recording loaded. Audio is available.";
    this.debugLog(`Media ready: ${this.mode}`);
  };

  private handleMediaCapabilities = (
    event: CustomEvent<NativeMediaCapabilities>,
  ): void => {
    if (this.mode !== "live" || typeof event.detail?.hasAudio !== "boolean") return;
    // Home Assistant's WebRTC player intentionally drops an arriving audio
    // track when it starts muted. In that state, hasAudio=false means "audio
    // was not attached", not necessarily "the camera has no audio".
    if (this.liveMuted && event.detail.hasAudio === false) return;
    // Multiple native candidates can report capabilities. A positive audio
    // result wins because Home Assistant can select that candidate when sound
    // is requested.
    this.liveHasAudio = this.liveHasAudio === true || event.detail.hasAudio;
    if (this.mediaStatus === "ready" && this.liveHasAudio) {
      this.statusAnnouncement = "Live view connected. Audio is available.";
    } else if (this.mediaStatus === "ready" && this.liveHasAudio === false) {
      this.statusAnnouncement = "Live view connected. No audio track was detected.";
    }
  };

  private liveAudioStatus(): string {
    if (this.liveMuted) return "Live view connected. Audio is muted.";
    if (this.liveHasAudio === true) return "Live view connected. Audio is available.";
    if (this.liveHasAudio === false) {
      return "Live view connected. No audio track was detected.";
    }
    return "Live view connected. Audio status is still being detected.";
  }

  private handleRecordingVideoError = (): void => {
    if (this.mode !== "last_recording") return;
    this.recordingPlaybackPending = false;
    this.recordingPlaybackStarted = false;
    // The Ring URL is temporary and can expire between state refreshes. Fall
    // back to Home Assistant's authenticated MJPEG renderer for this attempt.
    this.recordingVideoFailed = true;
    this.statusAnnouncement = "Trying Home Assistant camera playback.";
    this.startMedia();
  };

  private handleRecordingCanPlay = (event: Event): void => {
    if (
      this.mode !== "last_recording" ||
      this.recordingPlaybackPending ||
      this.recordingPlaybackStarted ||
      !(event.currentTarget instanceof HTMLVideoElement)
    ) {
      return;
    }

    const video = event.currentTarget;
    this.recordingPlaybackPending = true;
    void video.play().then(() => {
      this.recordingPlaybackPending = false;
      this.recordingPlaybackStarted = true;
      this.handleMediaReady();
    }).catch(() => {
      if (!this.open || this.mode !== "last_recording" || !video.isConnected) {
        this.recordingPlaybackPending = false;
        return;
      }
      if (!this.recordingMuted) {
        // Some browsers reject audible autoplay even after the viewer was
        // opened by a user gesture. Keep the same recording and retry muted;
        // the native media controls can then be used to enable sound.
        this.recordingMuted = true;
        video.muted = true;
        this.statusAnnouncement = "The browser blocked recording audio. Retrying muted.";
        void video.play().then(() => {
          this.recordingPlaybackPending = false;
          this.recordingPlaybackStarted = true;
          this.handleMediaReady();
        }).catch(() => {
          this.recordingPlaybackPending = false;
          this.handleRecordingVideoError();
        });
        return;
      }
      this.recordingPlaybackPending = false;
      this.handleRecordingVideoError();
    });
  };

  private handleMediaError = (event: CustomEvent<NativeAdapterFailure>): void => {
    if (event.detail === "component-unavailable") {
      this.lifecycle.clearTimeout();
      this.mediaStatus = "compatibility";
      this.statusAnnouncement = "Native camera playback is unavailable.";
      this.debugLog("Native camera component unavailable");
      return;
    }
    if (this.mode === "live" && !this.liveMuted && !this.audioFallbackAttempted) {
      this.audioFallbackAttempted = true;
      this.liveMuted = true;
      this.statusAnnouncement = "Live audio was muted so playback can start.";
      this.startMedia();
      return;
    }
    this.failMedia(false);
  };

  private failMedia(allowAutomaticRetry: boolean): void {
    if (
      allowAutomaticRetry &&
      this.mode === "live" &&
      this.config?.performance.retry_live_once &&
      this.retryCount < 1
    ) {
      this.retryCount += 1;
      this.statusAnnouncement = "Retrying Ring live view.";
      this.startMedia();
      return;
    }
    this.lifecycle.dispose();
    this.session = this.lifecycle.current();
    this.mediaStatus = "error";
    this.statusAnnouncement =
      this.mode === "live"
        ? "Live view could not be started."
        : "No Ring recording is currently available.";
    this.debugLog(`Media failed: ${this.mode}`);
  }

  private retry = (): void => {
    this.retryCount = 0;
    this.audioFallbackAttempted = false;
    this.recordingPlaybackPending = false;
    this.recordingPlaybackStarted = false;
    this.recordingMuted = false;
    this.liveHasAudio = undefined;
    this.recordingVideoFailed = false;
    this.startMedia();
  };

  private openMoreInfo = (): void => {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.activeEntityId() },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private activeEntityId(): string {
    return this.mode === "live"
      ? this.config!.live_entity
      : this.config!.recording_entity;
  }

  private activeEntity(): HassEntity | undefined {
    return this.hass?.states[this.activeEntityId()];
  }

  private dialogTitle(): string {
    if (this.config?.name) return this.config.name;
    return friendlyName(
      this.hass?.states[this.config!.recording_entity],
      "Camera",
    );
  }

  private handleBackdrop = (event: PointerEvent): void => {
    if (event.target === event.currentTarget) this.close();
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Tab") return;
    const focusable = this.focusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    const activeElement = this.shadowRoot?.activeElement;
    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  private handleTabKeyDown = (event: KeyboardEvent): void => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next: CameraMode =
      event.key === "ArrowLeft" || event.key === "Home" ? "last_recording" : "live";
    this.selectMode(next);
    void this.updateComplete.then(() => {
      const selector = next === "live" ? ".mode-button.live" : ".mode-button.recording";
      this.renderRoot.querySelector<HTMLElement>(selector)?.focus();
    });
  };

  private focusableElements(): HTMLElement[] {
    return Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null);
  }

  private focusInitialControl(): void {
    this.renderRoot.querySelector<HTMLElement>(".close")?.focus();
  }

  private pushHistoryEntry(): void {
    try {
      const base = history.state && typeof history.state === "object" ? history.state : {};
      history.pushState(
        { ...base, ringView: this.historyMarker },
        "",
        location.href,
      );
      this.ownsHistoryEntry = true;
    } catch {
      this.ownsHistoryEntry = false;
    }
  }

  private attachGlobalListeners(): void {
    window.addEventListener("popstate", this.handlePopState);
    document.addEventListener("keydown", this.handleDocumentKeyDown, true);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  private detachGlobalListeners(): void {
    window.removeEventListener("popstate", this.handlePopState);
    document.removeEventListener("keydown", this.handleDocumentKeyDown, true);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  private handlePopState = (): void => {
    this.ownsHistoryEntry = false;
    if (this.open) this.finishClose();
  };

  private handleDocumentKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape" || !this.config?.viewer.close_on_escape) return;
    if (document.fullscreenElement) return;
    event.preventDefault();
    event.stopPropagation();
    this.close();
  };

  private handleVisibilityChange = (): void => {
    if (!this.open || !this.config?.performance.suspend_when_hidden) return;
    if (document.hidden) {
      this.lifecycle.dispose();
      this.session = this.lifecycle.current();
      this.suspended = true;
      this.mediaStatus = "idle";
    } else if (this.suspended) {
      this.suspended = false;
      this.startMedia();
    }
  };

  private finishClose(restoreFocus = true): void {
    if (!this.open && !this.isConnected) return;
    this.lifecycle.dispose();
    this.session = this.lifecycle.current();
    this.mediaStatus = "idle";
    this.open = false;
    this.suspended = false;
    this.recordingPlaybackPending = false;
    this.recordingPlaybackStarted = false;
    this.recordingMuted = false;
    this.liveHasAudio = undefined;
    this.recordingVideoFailed = false;
    this.detachGlobalListeners();
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    this.debugLog("Viewer closed");
    this.dispatchEvent(
      new CustomEvent("viewer-closed", { bubbles: true, composed: true }),
    );
    if (restoreFocus) this.opener?.focus();
    this.opener = undefined;
  }

  private icon(path: string): TemplateResult {
    return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${path}></path></svg>`;
  }

  private debugLog(message: string): void {
    if (!this.config?.performance.debug) return;
    console.debug("[ring-view]", message);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ring-view-dialog": RingViewDialog;
  }
}
