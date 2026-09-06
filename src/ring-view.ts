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
import { localize } from "./localize";
import { posterUrl, sizedPosterUrl } from "./media/poster-provider";
import { modeLabel, renderModeIcon } from "./mode-icon";
import "./ring-view-dialog";
import type { RingViewDialog } from "./ring-view-dialog";
import { cardStyles } from "./styles";
import type { GridOptions, HomeAssistant, NormalizedConfig, RingViewConfig } from "./types";
import { entityIsUnavailable, friendlyName } from "./utilities/entity-validation";
import { loadMode } from "./utilities/mode-storage";

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
  @state() private config?: NormalizedConfig;
  @state() private previewFailed = false;
  @state() private lastPoster?: string;
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
    this.config = normalizeConfig(config);
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
    void this.updateComplete.then(() => {
      if (this.isConnected && !this.isInCardPicker()) this.setupPreviewLifecycle();
    });
  }

  public disconnectedCallback(): void {
    this.renderRoot.querySelector<RingViewDialog>("ring-view-dialog")?.close();
    this.teardownPreviewLifecycle();
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
      previous.states[this.config.live_entity] !== this.hass.states[this.config.live_entity]
    );
  }

  protected willUpdate(): void {
    if (!this.hass || !this.config) return;
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
    if (
      !this.isInCardPicker() &&
      (changed.has("hass") || configChanged) &&
      this.previewVisible
    ) {
      void this.refreshPreview(true);
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
    const openingMode = loadMode(this.config);
    const pickerPreview = this.isInCardPicker();
    const unavailable = pickerPreview ? false : entityIsUnavailable(previewEntity);
    const style = {
      "--ring-view-aspect-ratio": aspectRatioCss(this.config.aspect_ratio),
      "--ring-view-fit-mode": this.config.fit_mode,
    };

    return html`
      <ha-card>
        <div
          class="preview"
          style=${styleMap(style)}
          role="button"
          tabindex="0"
          aria-label=${localize(this.hass, "card.open_viewer", {
            name,
            mode: modeLabel(openingMode, this.hass),
          })}
          title=${localize(
            this.hass,
            openingMode === "live" ? "card.open_live" : "card.open_recording",
          )}
          @click=${this.openViewer}
          @keydown=${this.handleKeyDown}
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
          ${this.config.show_mode_icon && !pickerPreview
            ? html`
                <div
                  class=${`mode-indicator ${openingMode === "live" ? "live" : "recording"}`}
                  aria-hidden="true"
                >
                  ${renderModeIcon(openingMode)}
                </div>
              `
            : nothing}
        </div>
      </ha-card>
      <ring-view-dialog
        .hass=${this.hass}
        .config=${this.config}
        @viewer-closed=${this.handleViewerClosed}
      ></ring-view-dialog>
    `;
  }

  private previewEntityId(): string {
    const source = this.config!.preview_source;
    const mode = source === "default" ? loadMode(this.config!) : source;
    return mode === "live"
      ? this.config!.live_entity
      : this.config!.recording_entity;
  }

  private openViewer = (): void => {
    const trigger = this.renderRoot.querySelector<HTMLElement>(".preview") ?? undefined;
    this.renderRoot
      .querySelector<RingViewDialog>("ring-view-dialog")
      ?.show(loadMode(this.config!), trigger);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    this.openViewer();
  };

  private handlePreviewError = (): void => {
    this.previewFailed = true;
  };

  private handleViewerClosed = (): void => {
    this.requestUpdate();
  };

  private setupPreviewLifecycle(): void {
    if (this.isInCardPicker()) return;
    if (this.previewIntersectionObserver || this.previewResizeObserver) return;
    const preview = this.renderRoot.querySelector<HTMLElement>(".preview");
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
