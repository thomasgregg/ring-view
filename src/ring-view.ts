import { mdiBellRingOutline } from "@mdi/js";
import { LitElement, html, nothing, type PropertyValues } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { customElement, property, state } from "lit/decorators.js";
import pickerPreviewSvg from "../demo/camera-preview.svg?raw";
import {
  aspectRatioNumber,
  aspectRatioCss,
  CARD_NAME,
  CARD_TAG,
  CARD_TYPE,
  normalizeConfig,
} from "./config";
import {
  RING_ALERT_DURATION_MS,
  showRingViewDialog,
} from "./dialog-controller";
import { localize } from "./localize";
import { posterUrl, sizedPosterUrl } from "./media/poster-provider";
import { modeLabel } from "./mode-icon";
import { cardStyles } from "./styles";
import type { GridOptions, HomeAssistant, NormalizedConfig, RingViewConfig } from "./types";
import { entityIsUnavailable, friendlyName } from "./utilities/entity-validation";
import { loadMode } from "./utilities/mode-storage";
import "./ring-view-dialog";
import type { RingViewDialog } from "./ring-view-dialog";
import {
  decodeRingViewUrl,
  ringViewUrlMatchesConfig,
} from "./utilities/dialog-url";
import {
  captureTimestamp,
  recordingMediaMarker,
  selectPreviewEntityId,
} from "./utilities/preview-selection";

const PREVIEW_REFRESH_INTERVAL_MS = 10_000;
const PREVIEW_FALLBACK_WIDTH = 640;
const PREVIEW_FALLBACK_RATIO = 16 / 9;
const PREVIEW_RESIZE_THRESHOLD_PX = 16;
const PICKER_PREVIEW_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
  pickerPreviewSvg,
)}`;

@customElement(CARD_TAG)
export class RingView extends LitElement {
  public static styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ reflect: true }) public layout?: string;
  @property({ type: Boolean }) public preview = false;
  @state() private config?: NormalizedConfig;
  @state() private previewFailed = false;
  @state() private lastPoster?: string;
  @state() private ringAlertVisible = false;
  private lastFallbackPoster?: string;
  private activePreviewEntityId?: string;
  private lastPreviewSize?: { width: number; height: number };
  private previewIntersecting = false;
  private previewVisible = false;
  private previewRequestId = 0;
  private previewRefreshTimer?: number;
  private previewResizeFrame?: number;
  private previewIntersectionObserver?: IntersectionObserver;
  private previewResizeObserver?: ResizeObserver;
  private ringAlertTimer?: number;
  private restoreViewerTimer?: number;
  private lastRingAlertAt = 0;
  private previewMarkersInitialized = false;
  private recordingMarker?: string;
  private snapshotTimestamp?: number;
  private latestObservedPreviewSource?: "last_recording" | "snapshot";
  private inlinePausedForViewer = false;

  public static async getConfigElement(): Promise<HTMLElement> {
    await import("./ring-view-editor");
    return document.createElement("ring-view-editor");
  }

  public static getStubConfig(hass?: HomeAssistant): RingViewConfig {
    const cameraIds = Object.keys(hass?.states ?? {}).filter((id) => id.startsWith("camera."));
    const live =
      cameraIds.find(
        (id) =>
          (Number(hass?.states[id]?.attributes.supported_features ?? 0) & 2) !== 0,
      ) ??
      cameraIds.find((id) => /live(_view)?$/i.test(id)) ??
      cameraIds[1] ??
      "camera.live_view";
    const recording =
      cameraIds.find(
        (id) =>
          id !== live &&
          (Number(hass?.states[id]?.attributes.supported_features ?? 0) & 2) === 0,
      ) ??
      cameraIds.find((id) => id !== live) ??
      cameraIds[0] ??
      "camera.latest_recording";
    return {
      type: CARD_TYPE,
      recording_entity: recording,
      live_entity: live,
    };
  }

  public setConfig(config: RingViewConfig): void {
    const next = normalizeConfig(config);
    if (
      next.recording_entity !== this.config?.recording_entity
      || next.snapshot_entity !== this.config?.snapshot_entity
    ) {
      this.previewMarkersInitialized = false;
      this.recordingMarker = undefined;
      this.snapshotTimestamp = undefined;
      this.latestObservedPreviewSource = undefined;
    }
    this.config = next;
  }

  public getCardSize(): number {
    return 3;
  }

  public getGridOptions(): GridOptions {
    return {
      columns: 12,
      rows: 3,
      min_columns: 6,
      min_rows: 2,
      ...this.config?.grid_options,
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("viewer-closed", this.handleViewerClosed);
    this.updateRingAlert();
    void this.updateComplete.then(() => {
      if (this.isConnected && !this.isInCardPicker()) this.setupPreviewLifecycle();
    });
  }

  public disconnectedCallback(): void {
    document.removeEventListener("viewer-closed", this.handleViewerClosed);
    this.teardownPreviewLifecycle();
    this.clearRingAlertTimer();
    if (this.restoreViewerTimer !== undefined) {
      window.clearTimeout(this.restoreViewerTimer);
      this.restoreViewerTimer = undefined;
    }
    super.disconnectedCallback();
  }

  protected shouldUpdate(changed: PropertyValues<this>): boolean {
    for (const key of changed.keys()) {
      if (key !== "hass") return true;
    }
    if (!changed.has("hass") || !this.hass || !this.config) return false;
    const previous = changed.get("hass") as HomeAssistant | undefined;
    if (!previous) return true;
    return (
      previous.language !== this.hass.language ||
      previous.locale?.language !== this.hass.locale?.language ||
      previous.states[this.config.recording_entity] !==
        this.hass.states[this.config.recording_entity] ||
      previous.states[this.config.live_entity] !== this.hass.states[this.config.live_entity] ||
      (this.config.snapshot_entity !== undefined &&
        previous.states[this.config.snapshot_entity] !==
          this.hass.states[this.config.snapshot_entity]) ||
      (this.config.doorbell_entity !== undefined &&
        previous.states[this.config.doorbell_entity] !==
          this.hass.states[this.config.doorbell_entity]) ||
      (this.config.door_entity !== undefined &&
        previous.states[this.config.door_entity] !==
          this.hass.states[this.config.door_entity]) ||
      (this.config.door_contact_entity !== undefined &&
        previous.states[this.config.door_contact_entity] !==
          this.hass.states[this.config.door_contact_entity])
    );
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!this.hass || !this.config) return;
    this.observePreviewMedia();
    this.detectDoorbellEvent(changed.get("hass") as HomeAssistant | undefined);
    if (this.isInCardPicker()) return;
    const entityId = this.previewEntityId();
    const fallbackPoster = posterUrl(this.hass, this.hass.states[entityId], entityId);
    if (
      entityId !== this.activePreviewEntityId ||
      fallbackPoster !== this.lastFallbackPoster
    ) {
      this.activePreviewEntityId = entityId;
      this.lastFallbackPoster = fallbackPoster;
      this.lastPoster = fallbackPoster;
      this.lastPreviewSize = undefined;
      this.previewRequestId += 1;
      this.previewFailed = false;
    }
  }

  protected updated(changed: PropertyValues<this>): void {
    const configChanged = (changed as unknown as Map<PropertyKey, unknown>).has("config");
    if ((configChanged || changed.has("preview")) && !this.isInCardPicker()) {
      this.teardownPreviewLifecycle();
      this.setupPreviewLifecycle();
    }
    if (
      !this.isInCardPicker() &&
      this.config?.dashboard_behavior === "open_viewer" &&
      (changed.has("hass") || configChanged) &&
      this.previewVisible
    ) {
      void this.refreshPreview(true);
    }
    if (!this.isInCardPicker() && this.hass && this.config) {
      this.scheduleViewerRestore();
    }
    if (
      !this.isInCardPicker()
      && !this.preview
      && this.config?.dashboard_behavior === "interactive"
    ) {
      this.initializeInlineViewer();
    }
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    const previewId = this.previewEntityId();
    const previewEntity = this.hass.states[previewId];
    const name =
      this.config.name ||
      friendlyName(
        this.hass.states[this.config.recording_entity],
        localize(this.hass, "common.camera"),
      );
    const openingMode = this.ringAlertVisible ? "live" : loadMode(this.config);
    const pickerPreview = this.isInCardPicker();
    const safePreview = pickerPreview || this.preview;
    const unavailable = pickerPreview ? false : entityIsUnavailable(previewEntity);
    const style = {
      "--ring-view-aspect-ratio": aspectRatioCss(this.config.aspect_ratio),
      "--ring-view-fit-mode": this.config.fit_mode,
    };

    if (this.config.dashboard_behavior === "interactive" && !safePreview) {
      return html`
        <ha-card class="interactive">
          <div class="inline-shell" style=${styleMap(style)}>
            <ring-view-dialog
              inline
              .hass=${this.hass}
              @ring-view-expand=${this.openExpandedViewer}
            ></ring-view-dialog>
          </div>
        </ha-card>
      `;
    }

    const previewInteractive = !safePreview;
    return html`
      <ha-card class=${safePreview ? "safe-preview" : nothing}>
        <div
          class="preview"
          style=${styleMap(style)}
          role=${previewInteractive ? "button" : "img"}
          tabindex=${previewInteractive ? "0" : nothing}
          aria-label=${previewInteractive
            ? localize(this.hass, "card.open_viewer", {
                name,
                mode: modeLabel(openingMode, this.hass),
              })
            : localize(this.hass, "card.preview_alt", { name })}
          title=${previewInteractive
            ? localize(
                this.hass,
                openingMode === "live" ? "card.open_live" : "card.open_recording",
              )
            : nothing}
          @click=${previewInteractive ? this.openViewer : undefined}
          @keydown=${previewInteractive ? this.handleKeyDown : undefined}
        >
          ${!unavailable && !this.previewFailed
            ? html`
                <img
                  src=${pickerPreview ? PICKER_PREVIEW_URL : (this.lastPoster ?? "")}
                  alt=${localize(this.hass, "card.preview_alt", { name })}
                  @error=${this.handlePreviewError}
                />
              `
            : html`<div class="placeholder">
                ${localize(this.hass, "card.preview_unavailable")}
              </div>`}
          ${this.config.show_name ? html`<div class="name">${name}</div>` : nothing}
          ${this.ringAlertVisible
            ? html`<div class="ring-alert" role="status">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d=${mdiBellRingOutline}></path>
                </svg>
                <span>${localize(this.hass, "ring.alert")}</span>
              </div>`
            : nothing}
        </div>
      </ha-card>
    `;
  }

  private previewEntityId(): string {
    return selectPreviewEntityId(
      this.hass!,
      this.config!,
      loadMode(this.config!),
      this.latestObservedPreviewSource,
    );
  }

  private observePreviewMedia(): void {
    const recordingMarker = recordingMediaMarker(
      this.hass?.states[this.config!.recording_entity],
    );
    const snapshotTimestamp = captureTimestamp(
      this.config!.snapshot_entity
        ? this.hass?.states[this.config!.snapshot_entity]
        : undefined,
    );
    if (!this.previewMarkersInitialized) {
      this.previewMarkersInitialized = true;
      this.recordingMarker = recordingMarker;
      this.snapshotTimestamp = snapshotTimestamp;
      return;
    }

    const recordingChanged =
      recordingMarker !== undefined && recordingMarker !== this.recordingMarker;
    const snapshotChanged =
      snapshotTimestamp !== undefined && snapshotTimestamp !== this.snapshotTimestamp;
    if (recordingChanged !== snapshotChanged) {
      this.latestObservedPreviewSource = recordingChanged
        ? "last_recording"
        : "snapshot";
    } else if (recordingChanged) {
      this.latestObservedPreviewSource = undefined;
    }
    this.recordingMarker = recordingMarker;
    this.snapshotTimestamp = snapshotTimestamp;
  }

  private openViewer = (): void => {
    if (this.preview || this.isInCardPicker()) return;
    // Timers may be throttled while the app is hidden; never open Live for an
    // expired ring just because its timeout has not run yet.
    this.updateRingAlert();
    const trigger = this.renderRoot.querySelector<HTMLElement>(".preview") ?? undefined;
    showRingViewDialog(trigger ?? this, {
      config: this.config!,
      mode: this.ringAlertVisible ? "live" : loadMode(this.config!),
      opener: trigger,
      ringingUntil: this.ringAlertVisible
        ? this.lastRingAlertAt + RING_ALERT_DURATION_MS
        : undefined,
    });
  };

  private initializeInlineViewer(): void {
    if (!this.hass || !this.config || this.inlinePausedForViewer) return;
    const viewer = this.renderRoot.querySelector<RingViewDialog>(
      "ring-view-dialog[inline]",
    );
    if (!viewer) return;
    viewer.hass = this.hass;
    viewer.showInline({
      config: this.config,
      mode: this.ringAlertVisible ? "live" : loadMode(this.config),
      start: this.ringAlertVisible ? "on_demand" : this.config.dashboard_start,
      ringingUntil: this.ringAlertVisible
        ? this.lastRingAlertAt + RING_ALERT_DURATION_MS
        : undefined,
    });
    viewer.setInlineVisible(this.previewVisible);
  }

  private openExpandedViewer = (
    event: CustomEvent<{ mode: "last_recording" | "live"; ringingUntil?: number }>,
  ): void => {
    if (!this.config) return;
    event.stopPropagation();
    const viewer = event.currentTarget as RingViewDialog;
    viewer.stopInline();
    this.inlinePausedForViewer = true;
    showRingViewDialog(viewer, {
      config: this.config,
      mode: event.detail.mode,
      opener: viewer,
      ringingUntil: event.detail.ringingUntil,
    });
  };

  private handleViewerClosed = (): void => {
    if (!this.inlinePausedForViewer) return;
    this.inlinePausedForViewer = false;
    void this.updateComplete.then(() => this.initializeInlineViewer());
  };

  private scheduleViewerRestore(): void {
    if (this.restoreViewerTimer !== undefined || !this.config) return;
    const state = decodeRingViewUrl();
    if (!ringViewUrlMatchesConfig(state, this.config)) return;

    // Let Home Assistant finish cleaning the stale in-memory dialog state
    // from the previous document before asking its manager to reopen it.
    this.restoreViewerTimer = window.setTimeout(() => {
      this.restoreViewerTimer = undefined;
      if (!this.isConnected || !this.hass || !this.config) return;
      const restore = decodeRingViewUrl();
      if (!ringViewUrlMatchesConfig(restore, this.config)) return;
      const trigger = this.renderRoot.querySelector<HTMLElement>(".preview") ?? undefined;
      if (this.config.dashboard_behavior === "interactive") {
        this.renderRoot
          .querySelector<RingViewDialog>("ring-view-dialog[inline]")
          ?.stopInline();
        this.inlinePausedForViewer = true;
      }
      showRingViewDialog(trigger ?? this, {
        config: this.config,
        mode: restore.mode,
        opener: trigger,
        restored: true,
        ringingUntil:
          restore.ringingUntil !== undefined && restore.ringingUntil > Date.now()
            ? restore.ringingUntil
            : undefined,
      });
    }, 0);
  }

  private detectDoorbellEvent(previous?: HomeAssistant): void {
    const entityId = this.config?.doorbell_entity;
    if (!entityId || !previous || !this.hass) return;
    const before = previous.states[entityId];
    const after = this.hass.states[entityId];
    if (!after || before?.state === after.state || ["unknown", "unavailable"].includes(after.state)) {
      return;
    }
    if (after.attributes.event_type !== undefined && after.attributes.event_type !== "ring") {
      return;
    }

    const now = Date.now();
    if (now - this.lastRingAlertAt < 5_000) return;
    this.lastRingAlertAt = now;
    this.updateRingAlert();
  }

  private updateRingAlert(): void {
    this.clearRingAlertTimer();
    const remaining = this.lastRingAlertAt + RING_ALERT_DURATION_MS - Date.now();
    this.ringAlertVisible = this.lastRingAlertAt > 0 && remaining > 0;
    if (this.ringAlertVisible && this.isConnected) {
      // Preserve the original expiry across detach/reinsert, without starting
      // a new twelve-second alert on each responsive layout change.
      this.ringAlertTimer = window.setTimeout(() => this.updateRingAlert(), remaining);
    }
  }

  private clearRingAlertTimer(): void {
    if (this.ringAlertTimer === undefined) return;
    window.clearTimeout(this.ringAlertTimer);
    this.ringAlertTimer = undefined;
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.openViewer();
  };

  private handlePreviewError = (): void => {
    this.previewFailed = true;
  };

  private setupPreviewLifecycle(): void {
    if (this.isInCardPicker()) return;
    if (this.previewIntersectionObserver || this.previewResizeObserver) return;
    const preview = this.renderRoot.querySelector<HTMLElement>(
      ".preview, .inline-shell",
    );
    if (!preview) return;

    if (typeof IntersectionObserver === "undefined") {
      this.previewIntersecting = true;
    } else {
      this.previewIntersectionObserver = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        this.previewIntersecting = entry.isIntersecting || entry.intersectionRatio > 0;
        this.updatePreviewVisibility();
      });
      this.previewIntersectionObserver.observe(preview);
    }

    if (typeof ResizeObserver !== "undefined") {
      this.previewResizeObserver = new ResizeObserver(() => {
        if (!this.previewVisible || this.previewResizeFrame !== undefined) return;
        this.previewResizeFrame = window.requestAnimationFrame(() => {
          this.previewResizeFrame = undefined;
          void this.refreshPreview(false);
        });
      });
      this.previewResizeObserver.observe(preview);
    }

    document.addEventListener("visibilitychange", this.handleDocumentVisibility);
    this.updatePreviewVisibility();
  }

  private teardownPreviewLifecycle(): void {
    this.renderRoot
      .querySelector<RingViewDialog>("ring-view-dialog[inline]")
      ?.setInlineVisible(false);
    this.previewIntersectionObserver?.disconnect();
    this.previewResizeObserver?.disconnect();
    this.previewIntersectionObserver = undefined;
    this.previewResizeObserver = undefined;
    document.removeEventListener("visibilitychange", this.handleDocumentVisibility);
    this.stopPreviewRefreshTimer();
    if (this.previewResizeFrame !== undefined) {
      window.cancelAnimationFrame(this.previewResizeFrame);
      this.previewResizeFrame = undefined;
    }
    this.previewVisible = false;
    this.previewIntersecting = false;
    this.previewRequestId += 1;
  }

  private handleDocumentVisibility = (): void => {
    this.updatePreviewVisibility();
  };

  private updatePreviewVisibility(): void {
    if (this.isInCardPicker()) return;
    const visible = this.previewIntersecting && document.visibilityState !== "hidden";
    if (visible === this.previewVisible) return;
    this.previewVisible = visible;
    if (this.config?.dashboard_behavior === "interactive" && !this.preview) {
      this.stopPreviewRefreshTimer();
      this.renderRoot
        .querySelector<RingViewDialog>("ring-view-dialog[inline]")
        ?.setInlineVisible(visible);
      return;
    }
    if (visible) {
      void this.refreshPreview(true);
      this.previewRefreshTimer = window.setInterval(() => {
        void this.refreshPreview(true);
      }, PREVIEW_REFRESH_INTERVAL_MS);
      return;
    }
    this.stopPreviewRefreshTimer();
    this.previewRequestId += 1;
  }

  private stopPreviewRefreshTimer(): void {
    if (this.previewRefreshTimer === undefined) return;
    window.clearInterval(this.previewRefreshTimer);
    this.previewRefreshTimer = undefined;
  }

  private async refreshPreview(force: boolean): Promise<void> {
    if (this.isInCardPicker() || !this.previewVisible || !this.hass || !this.config) return;
    const preview = this.renderRoot.querySelector<HTMLElement>(".preview");
    if (!preview) return;

    const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    const renderedWidth = preview.clientWidth || preview.getBoundingClientRect().width;
    const cssWidth = renderedWidth > 0 ? renderedWidth : PREVIEW_FALLBACK_WIDTH;
    const renderedHeight = preview.clientHeight || preview.getBoundingClientRect().height;
    const configuredRatio =
      aspectRatioNumber(this.config.aspect_ratio) ?? PREVIEW_FALLBACK_RATIO;
    const cssHeight = renderedHeight > 0 ? renderedHeight : cssWidth / configuredRatio;
    const width = Math.ceil(cssWidth * pixelRatio);
    const height = Math.ceil(cssHeight * pixelRatio);
    if (
      !force &&
      this.lastPreviewSize &&
      Math.abs(width - this.lastPreviewSize.width) < PREVIEW_RESIZE_THRESHOLD_PX &&
      Math.abs(height - this.lastPreviewSize.height) < PREVIEW_RESIZE_THRESHOLD_PX
    ) {
      return;
    }
    this.lastPreviewSize = { width, height };

    const entityId = this.previewEntityId();
    const hass = this.hass;
    const requestId = ++this.previewRequestId;
    try {
      const nextPoster = await sizedPosterUrl(hass, entityId, width, height);
      if (
        requestId !== this.previewRequestId ||
        !this.isConnected ||
        !this.previewVisible ||
        this.previewEntityId() !== entityId
      ) {
        return;
      }
      this.lastPoster = nextPoster;
      this.previewFailed = false;
    } catch {
      // Keep the entity_picture/camera-proxy fallback already on screen. Some
      // older Home Assistant releases may not expose auth/sign_path here.
    }
  }

  /**
   * Home Assistant mounts picker previews inside `hui-card-picker`. Keep that
   * catalog surface representative without exposing a user's camera image.
   * The standard `preview` property is also used while editing dashboards, so
   * the ancestor check intentionally distinguishes the picker from edit mode.
   */
  private isInCardPicker(): boolean {
    let node: Node | null = this.parentNode ?? this.getRootNode();
    while (node) {
      if (node instanceof Element && node.localName === "hui-card-picker") return true;
      node = node instanceof ShadowRoot ? node.host : node.parentNode;
    }
    return false;
  }
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TAG)) {
  window.customCards.push({
    type: CARD_TAG,
    name: CARD_NAME,
    description: localize(undefined, "card.description"),
    preview: true,
    getEntitySuggestion: (
      hass: HomeAssistant,
      entityId: string,
    ): { config: RingViewConfig } | null => {
      if (!entityId.startsWith("camera.")) return null;
      const live = Object.keys(hass.states).find(
        (id) => id !== entityId && id.startsWith("camera.") && /live(_view)?$/i.test(id),
      );
      if (!live) return null;
      return {
        config: {
          type: CARD_TYPE,
          recording_entity: entityId,
          live_entity: live,
        },
      };
    },
  });
}

declare global {
  interface HTMLElementTagNameMap {
    "ring-view": RingView;
  }
}
