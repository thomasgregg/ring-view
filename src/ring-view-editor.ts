import {
  mdiCameraControl,
  mdiCameraOutline,
  mdiDoorbellVideo,
  mdiLockOpenVariantOutline,
  mdiPaletteOutline,
  mdiPlayCircleOutline,
} from "@mdi/js";
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
import { snapshotDirectoryWarning } from "./utilities/snapshot";

function configSchema(
  hass: HomeAssistant,
  config: NormalizedConfig,
): ConfigFormSchema[] {
  const dashboardPreview: ConfigFormSchema[] = [
    {
      name: "dashboard_behavior",
      required: true,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "open_viewer",
              label: localize(hass, "editor.dashboard_behavior_viewer"),
            },
            {
              value: "interactive",
              label: localize(hass, "editor.dashboard_behavior_interactive"),
            },
          ],
        },
      },
    },
  ];

  if (config.dashboard_behavior === "interactive") {
    dashboardPreview.push(
      {
        name: "dashboard_start",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: [
              {
                value: "on_demand",
                label: localize(hass, "editor.dashboard_start_on_demand"),
              },
              {
                value: "last_recording",
                label: localize(hass, "common.last_recording"),
              },
              { value: "live", label: localize(hass, "common.live") },
            ],
          },
        },
      },
      { name: "dashboard_live_muted", selector: { boolean: {} } },
    );
  } else {
    dashboardPreview.push(
      {
        name: "preview_source",
        required: true,
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
              {
                value: "snapshot",
                label: localize(hass, "editor.preview_snapshot"),
              },
              {
                value: "newest",
                label: localize(hass, "editor.preview_newest"),
              },
            ],
          },
        },
      },
    );
  }

  if (
    config.dashboard_behavior === "open_viewer"
    && ["snapshot", "newest"].includes(config.preview_source)
  ) {
    dashboardPreview.push({
      name: "snapshot_entity",
      required: true,
      selector: { entity: { domain: "camera" } },
    });
  }

  if (
    config.dashboard_behavior === "open_viewer"
    && config.preview_source === "newest"
  ) {
    dashboardPreview.push({
      name: "preview_fallback",
      required: true,
      selector: {
        select: {
          mode: "dropdown",
          options: [
            {
              value: "last_recording",
              label: localize(hass, "editor.fallback_recording"),
            },
            {
              value: "snapshot",
              label: localize(hass, "editor.fallback_snapshot"),
            },
          ],
        },
      },
    });
  }

  const doorAccess: ConfigFormSchema[] = [
    {
      name: "door_entity",
      selector: { entity: { domain: "lock" } },
    },
  ];

  if (config.door_entity) {
    doorAccess.push(
      {
        name: "door_contact_entity",
        selector: { entity: { domain: "binary_sensor" } },
      },
      {
        name: "door_action",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: [
              {
                value: "unlock",
                label: localize(hass, "editor.door_action_unlock"),
              },
              {
                value: "open",
                label: localize(hass, "editor.door_action_open"),
              },
            ],
          },
        },
      },
      {
        name: "door_control_visibility",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: [
              {
                value: "live_only",
                label: localize(hass, "editor.door_visibility_live"),
              },
              {
                value: "all_views",
                label: localize(hass, "editor.door_visibility_all"),
              },
            ],
          },
        },
      },
    );
    doorAccess.push({
      name: "door_hold_to_activate",
      selector: { boolean: {} },
    });
    if (config.dashboard_behavior === "interactive") {
      doorAccess.push({
        name: "door_control_location",
        required: true,
        selector: {
          select: {
            mode: "dropdown",
            options: [
              {
                value: "viewer_only",
                label: localize(hass, "editor.door_location_viewer"),
              },
              {
                value: "dashboard_and_viewer",
                label: localize(hass, "editor.door_location_dashboard"),
              },
            ],
          },
        },
      });
    }
  }

  return [
    {
      name: "recording_entity",
      required: true,
      selector: {
        entity: {
          filter: [{ domain: "camera" }, { domain: "select" }],
        },
      },
    },
    {
      name: "live_entity",
      required: true,
      selector: { entity: { domain: "camera" } },
    },
    {
      name: "dashboard_preview",
      type: "expandable",
      flatten: true,
      iconPath: mdiCameraControl,
      schema: dashboardPreview,
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
        { name: "two_way_audio", selector: { boolean: {} } },
      ],
    },
    {
      name: "snapshots",
      type: "expandable",
      flatten: true,
      iconPath: mdiCameraOutline,
      schema: [
        { name: "show_snapshot_button", selector: { boolean: {} } },
        ...(config.show_snapshot_button
          ? [{
              name: "snapshot_directory",
              required: true,
              selector: { text: {} },
            } satisfies ConfigFormSchema]
          : []),
      ],
    },
    {
      name: "doorbell_features",
      type: "expandable",
      flatten: true,
      iconPath: mdiDoorbellVideo,
      schema: [
        {
          name: "doorbell_entity",
          selector: {
            entity: {
              filter: [
                { domain: "event", device_class: "doorbell" },
                { domain: "binary_sensor" },
              ],
            },
          },
        },
      ],
    },
    {
      name: "door_access",
      type: "expandable",
      flatten: true,
      iconPath: mdiLockOpenVariantOutline,
      schema: doorAccess,
    },
    {
      name: "card_appearance",
      type: "expandable",
      flatten: true,
      iconPath: mdiPaletteOutline,
      schema: [
        { name: "name", selector: { text: {} } },
        { name: "show_name", selector: { boolean: {} } },
        {
          name: "last_activity_entity",
          selector: {
            entity: {
              filter: [
                { domain: "sensor" },
                { domain: "event" },
                { domain: "input_datetime" },
                { domain: "binary_sensor" },
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
  snapshot_entity: "editor.snapshot_entity",
  snapshots: "editor.snapshots",
  show_snapshot_button: "editor.show_snapshot_button",
  snapshot_directory: "editor.snapshot_directory",
  dashboard_preview: "editor.dashboard_preview",
  dashboard_behavior: "editor.dashboard_behavior",
  dashboard_start: "editor.dashboard_start",
  dashboard_live_muted: "editor.dashboard_live_muted",
  viewer_behavior: "editor.viewer_behavior",
  default_mode: "editor.default_mode",
  remember_last_mode: "editor.remember_last_mode",
  autoplay_recording: "editor.autoplay_recording",
  live_muted: "editor.live_muted",
  doorbell_features: "editor.doorbell_features",
  two_way_audio: "editor.two_way_audio",
  doorbell_entity: "editor.doorbell_entity",
  door_access: "editor.door_access",
  door_entity: "editor.door_entity",
  door_contact_entity: "editor.door_contact_entity",
  door_action: "editor.door_action",
  door_control_visibility: "editor.door_control_visibility",
  door_hold_to_activate: "editor.door_hold_to_activate",
  door_control_location: "editor.door_control_location",
  card_appearance: "editor.card_appearance",
  name: "editor.name",
  show_name: "editor.show_name",
  last_activity_entity: "editor.last_activity_entity",
  preview_source: "editor.preview_source",
  preview_fallback: "editor.preview_fallback",
  aspect_ratio: "editor.aspect_ratio",
  fit_mode: "editor.fit_mode",
};

const HELPERS: Record<string, TranslationKey> = {
  recording_entity: "editor.helper_recording_entity",
  dashboard_behavior: "editor.helper_dashboard_behavior",
  dashboard_start: "editor.helper_dashboard_start",
  dashboard_live_muted: "editor.helper_dashboard_live_muted",
  default_mode: "editor.helper_default_mode",
  remember_last_mode: "editor.helper_remember_last_mode",
  autoplay_recording: "editor.helper_autoplay_recording",
  live_muted: "editor.helper_live_muted",
  two_way_audio: "editor.helper_two_way_audio",
  doorbell_entity: "editor.helper_doorbell_entity",
  door_entity: "editor.helper_door_entity",
  door_contact_entity: "editor.helper_door_contact_entity",
  door_action: "editor.helper_door_action",
  door_control_visibility: "editor.helper_door_control_visibility",
  door_hold_to_activate: "editor.helper_door_hold_to_activate",
  door_control_location: "editor.helper_door_control_location",
  show_name: "editor.helper_show_name",
  last_activity_entity: "editor.helper_last_activity_entity",
  preview_source: "editor.helper_preview_source",
  snapshot_entity: "editor.helper_snapshot_entity",
  preview_fallback: "editor.helper_preview_fallback",
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
        .schema=${configSchema(this.hass, this.config)}
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
    if (
      !["name", "door_contact_entity", "last_activity_entity"].includes(
        schema.name,
      )
    ) return label;
    const optional = localizeHaOrFallback(
      this.hass,
      "ui.panel.lovelace.editor.card.config.optional",
      "common.optional",
    );
    return `${label} (${optional})`;
  };

  private computeHelper = (schema: ConfigFormSchema): string | undefined => {
    if (schema.name === "snapshot_directory" && this.config) {
      const warning = snapshotDirectoryWarning(this.config.snapshot_directory);
      if (warning === "public") {
        return localize(this.hass, "editor.helper_snapshot_directory_public");
      }
      if (warning === "custom") {
        return localize(this.hass, "editor.helper_snapshot_directory_custom");
      }
      return undefined;
    }
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
    const inactiveDoorOptions = new Set([
      "door_contact_entity",
      "door_action",
      "door_control_visibility",
      "door_hold_to_activate",
      "door_control_location",
    ]);
    const emitted = Object.fromEntries(
      Object.entries(next).filter(
        ([key, value]) =>
          value !== undefined
          && (Boolean(next.door_entity) || !inactiveDoorOptions.has(key)),
      ),
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
