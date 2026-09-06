import { mdiDoorbellVideo, mdiImageOutline, mdiPlayCircleOutline } from "@mdi/js";
import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { normalizeConfig } from "./config";
import {
  localize,
  localizeHaOrFallback,
  type TranslationKey,
} from "./localize";
import { ensureNativeCameraAvailable } from "./media/native-camera-adapter";
import { editorStyles } from "./styles";
import type {
  ConfigFormSchema,
  HomeAssistant,
  NormalizedConfig,
  RingViewConfig,
} from "./types";
import { validateEntities } from "./utilities/entity-validation";

function configSchema(hass: HomeAssistant): ConfigFormSchema[] {
  return [
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
                {
                  value: "last_recording",
                  label: localize(hass, "common.last_recording"),
                },
                { value: "live", label: localize(hass, "common.live") },
              ],
            },
          },
        },
        { name: "remember_last_mode", selector: { boolean: {} } },
        { name: "autoplay_recording", selector: { boolean: {} } },
        { name: "live_muted", selector: { boolean: {} } },
      ],
    },
    {
      name: "doorbell_features",
      type: "expandable",
      flatten: true,
      iconPath: mdiDoorbellVideo,
      schema: [
        { name: "two_way_audio", selector: { boolean: {} } },
        {
          name: "doorbell_entity",
          selector: { entity: { domain: "event", device_class: "doorbell" } },
        },
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
          name: "preview_source",
          selector: {
            select: {
              mode: "dropdown",
              options: [
                {
                  value: "last_recording",
                  label: localize(hass, "editor.preview_recording"),
                },
                {
                  value: "live",
                  label: localize(hass, "editor.preview_live"),
                },
                {
                  value: "default",
                  label: localize(hass, "editor.preview_default"),
                },
              ],
            },
          },
        },
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
                    {
                      value: "16:9",
                      label: localize(hass, "editor.aspect_widescreen"),
                    },
                    {
                      value: "4:3",
                      label: localize(hass, "editor.aspect_standard"),
                    },
                    {
                      value: "1:1",
                      label: localize(hass, "editor.aspect_square"),
                    },
                    {
                      value: "auto",
                      label: localize(hass, "editor.aspect_auto"),
                    },
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
                    {
                      value: "cover",
                      label: localize(hass, "editor.fit_cover"),
                    },
                    {
                      value: "contain",
                      label: localize(hass, "editor.fit_contain"),
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  ];
}

const LABELS: Record<string, TranslationKey> = {
  recording_entity: "editor.recording_entity",
  live_entity: "editor.live_entity",
  viewer_behavior: "editor.viewer_behavior",
  default_mode: "editor.default_mode",
  remember_last_mode: "editor.remember_last_mode",
  autoplay_recording: "editor.autoplay_recording",
  live_muted: "editor.live_muted",
  doorbell_features: "editor.doorbell_features",
  two_way_audio: "editor.two_way_audio",
  doorbell_entity: "editor.doorbell_entity",
  card_appearance: "editor.card_appearance",
  name: "editor.name",
  show_name: "editor.show_name",
  preview_source: "editor.preview_source",
  aspect_ratio: "editor.aspect_ratio",
  fit_mode: "editor.fit_mode",
};

const HELPERS: Record<string, TranslationKey> = {
  default_mode: "editor.helper_default_mode",
  remember_last_mode: "editor.helper_remember_last_mode",
  autoplay_recording: "editor.helper_autoplay_recording",
  live_muted: "editor.helper_live_muted",
  two_way_audio: "editor.helper_two_way_audio",
  doorbell_entity: "editor.helper_doorbell_entity",
  show_name: "editor.helper_show_name",
  preview_source: "editor.helper_preview_source",
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
            <div
              class="warnings"
              role="status"
              aria-label=${localize(this.hass, "editor.warnings")}
            >
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
        .schema=${configSchema(this.hass)}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }

  private computeLabel = (schema: ConfigFormSchema): string | undefined => {
    const key = LABELS[schema.name];
    if (!key) return undefined;
    const label = localize(this.hass, key);
    if (schema.name !== "name") return label;
    const optional = localizeHaOrFallback(
      this.hass,
      "ui.panel.lovelace.editor.card.config.optional",
      "common.optional",
    );
    return `${label} (${optional})`;
  };

  private computeHelper = (schema: ConfigFormSchema): string | undefined => {
    const key = HELPERS[schema.name];
    return key ? localize(this.hass, key) : undefined;
  };

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
