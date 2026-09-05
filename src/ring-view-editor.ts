import { mdiImageOutline, mdiPlayCircleOutline } from "@mdi/js";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { normalizeConfig } from "./config";
import { ensureNativeCameraAvailable } from "./media/native-camera-adapter";
import { editorStyles } from "./styles";
import type {
  ConfigFormSchema,
  HomeAssistant,
  NormalizedConfig,
  RingViewConfig,
} from "./types";
import { validateEntities } from "./utilities/entity-validation";

const CONFIG_SCHEMA: ConfigFormSchema[] = [
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
  {
    name: "viewer_behavior",
    type: "expandable",
    flatten: true,
    iconPath: mdiPlayCircleOutline,
    schema: [
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
      { name: "live_muted", selector: { boolean: {} } },
    ],
  },
  {
    name: "card_appearance",
    type: "expandable",
    flatten: true,
    iconPath: mdiImageOutline,
    schema: [
      { name: "name", selector: { text: {} } },
      { name: "show_name", selector: { boolean: {} } },
      {
        name: "",
        type: "grid",
        schema: [
          {
            name: "aspect_ratio",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "16:9", label: "Widescreen (16:9)" },
                  { value: "4:3", label: "Standard (4:3)" },
                  { value: "1:1", label: "Square (1:1)" },
                  { value: "auto", label: "Automatic" },
                ],
              },
            },
          },
          {
            name: "fit_mode",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "cover", label: "Crop to fill" },
                  { value: "contain", label: "Fit entire image" },
                ],
              },
            },
          },
        ],
      },
    ],
  },
];

const LABELS: Record<string, string> = {
  recording_entity: "Last recording camera",
  live_entity: "Live camera",
  viewer_behavior: "Viewer behavior",
  default_mode: "Open viewer on",
  live_muted: "Start live audio muted",
  card_appearance: "Card appearance",
  name: "Camera name (optional)",
  show_name: "Show name on card",
  aspect_ratio: "Image shape",
  fit_mode: "Image crop",
};

const HELPERS: Record<string, string> = {
  default_mode: "Opening directly on Live starts a Ring live session.",
  live_muted: "Leave off to start with sound when the browser allows it.",
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
      ${warnings.length
        ? html`
            <div class="warnings" role="status" aria-label="Configuration warnings">
              ${warnings.map(
                (warning) => html`
                  <ha-alert alert-type="warning">${warning.message}</ha-alert>
                `,
              )}
            </div>
          `
        : nothing}
      <ha-form
        .hass=${this.hass}
        .data=${this.config}
        .schema=${CONFIG_SCHEMA}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }

  private computeLabel = (schema: ConfigFormSchema): string | undefined =>
    LABELS[schema.name];

  private computeHelper = (schema: ConfigFormSchema): string | undefined =>
    HELPERS[schema.name];

  private valueChanged = (event: CustomEvent<{ value: RingViewConfig }>): void => {
    if (!this.config) return;
    const next = normalizeConfig({
      ...this.config,
      ...event.detail.value,
    });
    this.config = next;
    const emitted = Object.fromEntries(
      Object.entries(next).filter(([, value]) => value !== undefined),
    ) as unknown as RingViewConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: emitted },
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
