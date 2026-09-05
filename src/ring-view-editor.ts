import { mdiAlertOutline } from "@mdi/js";
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { customElement, property, state } from "lit/decorators.js";
import { aspectRatioCss, badgeLabel, normalizeConfig } from "./config";
import { ensureNativeCameraAvailable } from "./media/native-camera-adapter";
import { posterUrl } from "./media/poster-provider";
import { editorStyles } from "./styles";
import type {
  CameraMode,
  ConfigFormSchema,
  HomeAssistant,
  NormalizedConfig,
  RingViewConfig,
} from "./types";
import { friendlyName, validateEntities } from "./utilities/entity-validation";

const CAMERA_SCHEMA: ConfigFormSchema[] = [
  {
    name: "recording_entity",
    required: true,
    selector: { entity: { domain: "camera" } },
  },
  {
    name: "live_entity",
    required: true,
    selector: { entity: { domain: "camera" } },
  },
];

const OPENING_SCHEMA: ConfigFormSchema[] = [
  {
    name: "default_mode",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "last_recording", label: "Last recording" },
          { value: "live", label: "Live" },
        ],
      },
    },
  },
  { name: "remember_last_mode", selector: { boolean: {} } },
  { name: "autoplay_recording", selector: { boolean: {} } },
];

const PREVIEW_APPEARANCE_SCHEMA: ConfigFormSchema[] = [
  {
    name: "source",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "last_recording", label: "Last recording snapshot" },
          { value: "live", label: "Live camera snapshot" },
          { value: "default", label: "Follow default view" },
        ],
      },
    },
  },
  { name: "show_mode_badge", selector: { boolean: {} } },
];

const PREVIEW_LABEL_SCHEMA: ConfigFormSchema[] = [
  { name: "show_name", selector: { boolean: {} } },
];

const NAME_SCHEMA: ConfigFormSchema[] = [
  { name: "name", selector: { text: {} } },
];

const APPEARANCE_SCHEMA: ConfigFormSchema[] = [
  {
    name: "aspect_ratio",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "auto", label: "Automatic" },
          { value: "16:9", label: "16:9" },
          { value: "4:3", label: "4:3" },
          { value: "1:1", label: "1:1" },
        ],
      },
    },
  },
  {
    name: "fit_mode",
    selector: {
      select: {
        mode: "dropdown",
        options: ["cover", "contain", "fill"].map((value) => ({
          value,
          label: value[0]!.toUpperCase() + value.slice(1),
        })),
      },
    },
  },
];

const VIEWER_SCHEMA: ConfigFormSchema[] = [
  { name: "show_controls", selector: { boolean: {} } },
  { name: "live_muted", selector: { boolean: {} } },
  { name: "close_on_escape", selector: { boolean: {} } },
];

const ADVANCED_SCHEMA: ConfigFormSchema[] = [
  {
    name: "live_timeout_seconds",
    selector: {
      number: { min: 10, max: 60, step: 1, mode: "box", unit_of_measurement: "s" },
    },
  },
  { name: "retry_live_once", selector: { boolean: {} } },
  { name: "suspend_when_hidden", selector: { boolean: {} } },
  { name: "debug", selector: { boolean: {} } },
];

const LABELS: Record<string, string> = {
  recording_entity: "Last recording entity",
  live_entity: "Live camera entity",
  default_mode: "Default view",
  remember_last_mode: "Remember the last selected view",
  autoplay_recording: "Autoplay last recording",
  source: "Preview image",
  show_name: "Show camera name",
  show_mode_badge: "Show status badge",
  name: "Camera name",
  aspect_ratio: "Aspect ratio",
  fit_mode: "Image fit",
  show_controls: "Show native media controls",
  live_muted: "Start live audio muted",
  close_on_escape: "Close on Escape",
  live_timeout_seconds: "Live connection timeout",
  retry_live_once: "Retry live connection automatically",
  suspend_when_hidden: "Pause when browser tab is hidden",
  debug: "Debug logging",
};

const HELPERS: Record<string, string> = {
  recording_entity: "Camera entity containing the most recent recording.",
  live_entity: "Camera entity used for the live stream.",
  default_mode:
    "Starting with Live will create a Ring live session whenever the card is opened.",
  source: "This is always a still image and never starts a live stream.",
  name: "Leave blank to use the friendly name of the recording entity.",
  debug: "Logs lifecycle events only; camera URLs and tokens are never logged.",
};

@customElement("ring-view-editor")
export class RingViewEditor extends LitElement {
  public static styles = editorStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: NormalizedConfig;
  @state() private nativeChecked = false;
  @state() private nativeAvailable = false;

  public setConfig(config: RingViewConfig): void {
    this.config = normalizeConfig(config);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    void ensureNativeCameraAvailable().then((available) => {
      if (!this.isConnected) return;
      this.nativeAvailable = available;
      this.nativeChecked = true;
    });
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    const warnings = validateEntities(this.hass, this.config).filter(
      (warning) =>
        warning.kind !== "compatibility" ||
        (this.nativeChecked && !this.nativeAvailable),
    );

    return html`
      <div class="editor-layout">
        <div class="settings-pane">
          ${warnings.length
            ? html`
                <div class="warnings" role="status" aria-label="Configuration warnings">
                  ${warnings.map(
                    (warning) => html`
                      <div class="warning">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d=${mdiAlertOutline}></path>
                        </svg>
                        <span>${warning.message}</span>
                      </div>
                    `,
                  )}
                </div>
              `
            : nothing}

          ${this.section("Sources", this.config, CAMERA_SCHEMA, "root")}
          ${this.section("Playback", this.config, OPENING_SCHEMA, "root")}
          <section class="settings-group">
            <h3>Card appearance</h3>
            <div class="form-stack">
              ${this.form(this.config.preview, PREVIEW_APPEARANCE_SCHEMA, "preview")}
              ${this.form(this.config.appearance, APPEARANCE_SCHEMA, "appearance")}
            </div>
          </section>
          <section class="settings-group">
            <h3>Labels</h3>
            <div class="form-stack">
              ${this.form(this.config.preview, PREVIEW_LABEL_SCHEMA, "preview")}
              ${this.config.preview.show_name
                ? this.form(this.config, NAME_SCHEMA, "root")
                : nothing}
            </div>
          </section>
          <details class="settings-group">
            <summary>Viewer controls</summary>
            <div class="details-content form-stack">
              ${this.form(this.config.viewer, VIEWER_SCHEMA, "viewer")}
            </div>
          </details>
          <details class="settings-group">
            <summary>Advanced</summary>
            <div class="details-content">
              ${this.form(this.config.performance, ADVANCED_SCHEMA, "performance")}
            </div>
          </details>
        </div>
        ${this.renderPreview()}
      </div>
    `;
  }

  private section(
    title: string,
    data: object,
    schema: ConfigFormSchema[],
    target: "root" | "preview" | "appearance" | "viewer" | "performance",
  ): TemplateResult {
    return html`
      <section class="settings-group">
        <h3>${title}</h3>
        ${this.form(data, schema, target)}
      </section>
    `;
  }

  private renderPreview(): TemplateResult {
    const source = this.config!.preview.source;
    const mode: CameraMode =
      source === "default"
        ? this.config!.default_mode
        : source === "live"
          ? "live"
          : "last_recording";
    const entityId =
      mode === "live" ? this.config!.live_entity : this.config!.recording_entity;
    const entity = this.hass!.states[entityId];
    const name =
      this.config!.name ||
      friendlyName(this.hass!.states[this.config!.recording_entity], "Camera");
    const previewStyle = {
      "--ring-view-editor-aspect-ratio": aspectRatioCss(
        this.config!.appearance.aspect_ratio,
      ),
      "--ring-view-editor-fit-mode": this.config!.appearance.fit_mode,
    };

    return html`
      <aside class="preview-pane" aria-label="Dashboard preview">
        <div class="preview-sticky">
          <div class="preview-heading">Dashboard preview</div>
          <div class="preview-card" style=${styleMap(previewStyle)}>
            <img src=${posterUrl(this.hass!, entity, entityId)} alt=${`${name} preview`} />
            ${this.config!.preview.show_name
              ? html`<div class="preview-name">${name}</div>`
              : nothing}
            ${this.config!.preview.show_mode_badge
              ? html`
                  <div class="preview-badge">
                    <span class="preview-badge-dot" aria-hidden="true"></span>
                    ${badgeLabel(mode)}
                  </div>
                `
              : nothing}
          </div>
        </div>
      </aside>
    `;
  }

  private form(
    data: object,
    schema: ConfigFormSchema[],
    target: "root" | "preview" | "appearance" | "viewer" | "performance",
  ): TemplateResult {
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${schema}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        data-target=${target}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }

  private computeLabel = (schema: ConfigFormSchema): string | undefined =>
    LABELS[schema.name];

  private computeHelper = (schema: ConfigFormSchema): string | undefined =>
    HELPERS[schema.name];

  private valueChanged = (event: CustomEvent<{ value: Record<string, unknown> }>): void => {
    if (!this.config) return;
    const target = (event.currentTarget as HTMLElement).dataset.target as
      | "root"
      | "preview"
      | "appearance"
      | "viewer"
      | "performance";
    const value = event.detail.value;
    const next =
      target === "root"
        ? { ...this.config, ...value }
        : {
            ...this.config,
            [target]: { ...this.config[target], ...value },
          };
    this.config = normalizeConfig(next as RingViewConfig);
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    "ring-view-editor": RingViewEditor;
  }
}
