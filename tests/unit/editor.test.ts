import { describe, expect, it, vi } from "vitest";
import "../../src/ring-view-editor";
import type {
  ConfigFormSchema,
  HassEntity,
  HomeAssistant,
  RingViewConfig,
} from "../../src/types";

const entity = (id: string, supportedFeatures: number): HassEntity => ({
  entity_id: id,
  state: "idle",
  attributes: {
    friendly_name: id,
    entity_picture: "/camera.jpg",
    supported_features: supportedFeatures,
  },
});

const hass: HomeAssistant = {
  entities: {
    "camera.recording": {
      entity_id: "camera.recording",
      platform: "ring",
    },
    "camera.live": { entity_id: "camera.live", platform: "ring" },
    "camera.snapshot": { entity_id: "camera.snapshot", platform: "mqtt" },
    "sensor.front_door_last_activity": {
      entity_id: "sensor.front_door_last_activity",
      platform: "template",
    },
    "lock.front_door": { entity_id: "lock.front_door", platform: "nuki" },
    "binary_sensor.front_door_contact": {
      entity_id: "binary_sensor.front_door_contact",
      platform: "nuki",
    },
  },
  states: {
    "camera.recording": entity("camera.recording", 0),
    "camera.live": entity("camera.live", 2),
    "camera.snapshot": entity("camera.snapshot", 0),
    "sensor.front_door_last_activity": {
      ...entity("sensor.front_door_last_activity", 0),
      state: "2026-09-12T10:15:30Z",
      attributes: {
        friendly_name: "Front Door Last Activity",
        device_class: "timestamp",
      },
    },
    "lock.front_door": {
      ...entity("lock.front_door", 1),
      state: "locked",
    },
    "binary_sensor.front_door_contact": {
      ...entity("binary_sensor.front_door_contact", 0),
      state: "off",
      attributes: {
        friendly_name: "Front Door Contact",
        device_class: "door",
      },
    },
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
};

describe("visual editor", () => {
  it("emits the compact flat configuration and removes obsolete options", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      preview: { source: "live" },
      show_mode_icon: true,
    } as never);
    const listener = vi.fn();
    editor.addEventListener("config-changed", listener);
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector<HTMLElement>("ha-form");
    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            recording_entity: "camera.recording",
            live_entity: "camera.live",
            show_name: true,
            name: "Entrance",
            last_activity_entity: "sensor.front_door_last_activity",
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
    await editor.updateComplete;

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0]?.[0] as CustomEvent<{
      config: RingViewConfig;
    }>;
    expect(event.detail.config).toMatchObject({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      name: "Entrance",
      show_name: true,
      last_activity_entity: "sensor.front_door_last_activity",
      default_mode: "last_recording",
      remember_last_mode: false,
      autoplay_recording: true,
      live_muted: false,
      two_way_audio: false,
      dashboard_behavior: "open_viewer",
      dashboard_start: "on_demand",
      dashboard_live_muted: true,
      preview_source: "last_recording",
      preview_fallback: "last_recording",
      aspect_ratio: "16:9",
      fit_mode: "cover",
    });
    expect(event.detail.config).not.toHaveProperty("preview");
    expect(event.detail.config).not.toHaveProperty("show_mode_icon");
  });

  it("shows a capability warning for a non-streaming live entity", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = {
      ...hass,
      states: {
        ...hass.states,
        "camera.live": entity("camera.live", 0),
      },
    };
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    document.body.append(editor);
    await editor.updateComplete;
    expect(editor.shadowRoot?.textContent).toContain(
      "does not advertise camera streaming support",
    );
    expect(editor.shadowRoot?.querySelector("ha-alert")).not.toBeNull();
  });

  it("warns when talkback is enabled for a non-Ring live camera", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = {
      ...hass,
      entities: {
        ...hass.entities,
        "camera.live": { entity_id: "camera.live", platform: "generic" },
      },
    };
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      two_way_audio: true,
    });
    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.shadowRoot?.textContent).toContain(
      "Two-way audio requires the official Ring Live view camera",
    );
  });

  it("groups related settings in six compact native expandable sections", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    document.body.append(editor);
    await editor.updateComplete;

    const forms = editor.shadowRoot?.querySelectorAll<HTMLElement>("ha-form");
    expect(forms).toHaveLength(1);
    expect(editor.shadowRoot?.querySelector(".preview-card")).toBeNull();
    expect(editor.shadowRoot?.querySelector(".settings-group")).toBeNull();

    const schema = (forms?.[0] as HTMLElement & { schema?: ConfigFormSchema[] }).schema ?? [];
    expect(schema.slice(0, 2).map((field) => field.name)).toEqual([
      "recording_entity",
      "live_entity",
    ]);
    expect(
      schema.filter((field) => field.type === "expandable").map((field) => ({
        name: field.name,
        flatten: field.flatten,
        icon: Boolean(field.iconPath),
      })),
    ).toEqual([
      { name: "snapshots", flatten: true, icon: true },
      { name: "dashboard_preview", flatten: true, icon: true },
      { name: "viewer_behavior", flatten: true, icon: true },
      { name: "doorbell_features", flatten: true, icon: true },
      { name: "door_access", flatten: true, icon: true },
      { name: "card_appearance", flatten: true, icon: true },
    ]);
  });

  it("reveals only the save folder when manual snapshots are enabled", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as
      | (HTMLElement & {
          schema?: ConfigFormSchema[];
          computeHelper?: (schema: ConfigFormSchema) => string | undefined;
        })
      | null;
    const snapshotFields = () =>
      form?.schema
        ?.find((field) => field.name === "snapshots")
        ?.schema?.map((field) => field.name);

    expect(snapshotFields()).toEqual(["show_snapshot_button"]);
    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            recording_entity: "camera.recording",
            live_entity: "camera.live",
            show_snapshot_button: true,
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
    await editor.updateComplete;
    expect(snapshotFields()).toEqual([
      "show_snapshot_button",
      "snapshot_directory",
    ]);
    expect(form?.computeHelper?.({ name: "snapshot_directory" })).toBeUndefined();

    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      show_snapshot_button: true,
      snapshot_directory: "/config/www/ring-view",
    });
    await editor.updateComplete;
    expect(form?.computeHelper?.({ name: "snapshot_directory" })).toContain(
      "publicly accessible",
    );
  });

  it("only reveals the snapshot settings required by the selected image source", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as
      | (HTMLElement & { schema?: ConfigFormSchema[] })
      | null;
    const previewFields = () =>
      form?.schema
        ?.find((field) => field.name === "dashboard_preview")
        ?.schema?.map((field) => ({
          name: field.name,
          required: field.required ?? false,
        }));

    expect(previewFields()).toEqual([
      { name: "dashboard_behavior", required: true },
      { name: "preview_source", required: true },
    ]);

    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            recording_entity: "camera.recording",
            live_entity: "camera.live",
            preview_source: "snapshot",
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
    await editor.updateComplete;
    expect(previewFields()).toEqual([
      { name: "dashboard_behavior", required: true },
      { name: "preview_source", required: true },
      { name: "snapshot_entity", required: true },
    ]);

    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            recording_entity: "camera.recording",
            live_entity: "camera.live",
            preview_source: "newest",
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
    await editor.updateComplete;
    expect(previewFields()).toEqual([
      { name: "dashboard_behavior", required: true },
      { name: "preview_source", required: true },
      { name: "snapshot_entity", required: true },
      { name: "preview_fallback", required: true },
    ]);
  });

  it("localizes native form labels, help, and options from the Home Assistant language", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = {
      ...hass,
      language: "de-DE",
      locale: { language: "de-DE" },
    };
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as
      | (HTMLElement & {
          schema?: ConfigFormSchema[];
          computeLabel?: (schema: ConfigFormSchema) => string | undefined;
          computeHelper?: (schema: ConfigFormSchema) => string | undefined;
        })
      | null;
    expect(form?.computeLabel?.({ name: "recording_entity" })).toBe(
      "Kamera für letzte Aufnahme",
    );
    expect(form?.computeLabel?.({ name: "viewer_behavior" })).toBe(
      "Vollbildansicht",
    );
    expect(form?.computeLabel?.({ name: "snapshot_entity" })).toBe(
      "Kamera für Geräte-Schnappschuss",
    );
    expect(form?.computeLabel?.({ name: "snapshots" })).toBe("Schnappschüsse");
    expect(form?.computeLabel?.({ name: "name" })).toBe("Kameraname (optional)");
    expect(form?.computeLabel?.({ name: "show_name" })).toBe(
      "Kameranamen anzeigen",
    );
    expect(form?.computeLabel?.({ name: "last_activity_entity" })).toBe(
      "Zeitstempel der letzten Aktivität (optional)",
    );
    expect(form?.computeLabel?.({ name: "dashboard_preview" })).toBe(
      "Dashboard-Karte",
    );
    expect(form?.computeLabel?.({ name: "door_access" })).toBe("Türzugang");
    expect(form?.computeLabel?.({ name: "door_contact_entity" })).toBe(
      "Türkontaktsensor (optional)",
    );
    expect(form?.computeHelper?.({ name: "live_muted" })).toContain(
      "mit Ton zu starten",
    );
    expect(form?.computeHelper?.({ name: "last_activity_entity" })).toContain(
      "bei sichtbarem Kameranamen darunter",
    );

    const viewerBehavior = form?.schema?.find(
      (field) => field.name === "viewer_behavior",
    );
    const defaultMode = viewerBehavior?.schema?.find(
      (field) => field.name === "default_mode",
    );
    expect(viewerBehavior?.schema?.map((field) => field.name)).toEqual([
      "default_mode",
      "remember_last_mode",
      "autoplay_recording",
      "live_muted",
      "two_way_audio",
    ]);
    const doorbellFeatures = form?.schema?.find(
      (field) => field.name === "doorbell_features",
    );
    expect(form?.computeLabel?.({ name: "doorbell_features" })).toBe(
      "Türklingelfunktionen",
    );
    expect(form?.computeLabel?.({ name: "two_way_audio" })).toBe(
      "Zwei-Wege-Audio aktivieren",
    );
    expect(doorbellFeatures?.schema?.map((field) => field.name)).toEqual([
      "doorbell_entity",
    ]);
    const doorAccess = form?.schema?.find(
      (field) => field.name === "door_access",
    );
    expect(doorAccess?.schema?.map((field) => field.name)).toEqual([
      "door_entity",
    ]);
    expect(defaultMode?.selector).toMatchObject({
      select: {
        options: [
          { value: "last_recording", label: "Letzte Aufnahme" },
          { value: "live", label: "Live" },
        ],
      },
    });

    const cardAppearance = form?.schema?.find(
      (field) => field.name === "card_appearance",
    );
    expect(cardAppearance?.schema?.map((field) => field.name)).toEqual([
      "name",
      "show_name",
      "last_activity_entity",
      "",
    ]);
    expect(
      cardAppearance?.schema?.find(
        (field) => field.name === "last_activity_entity",
      )?.selector,
    ).toEqual({
      entity: {
        filter: [
          { domain: "sensor" },
          { domain: "event" },
          { domain: "input_datetime" },
        ],
      },
    });
    const dashboardPreview = form?.schema?.find(
      (field) => field.name === "dashboard_preview",
    );
    expect(dashboardPreview?.schema?.map((field) => field.name)).toEqual([
      "dashboard_behavior",
      "preview_source",
    ]);
    const previewSource = dashboardPreview?.schema?.find(
      (field) => field.name === "preview_source",
    );
    expect(previewSource?.selector).toMatchObject({
      select: {
        options: [
          { value: "last_recording", label: "Standbild der letzten Aufnahme" },
          { value: "live", label: "Standbild der Live-Kamera" },
          { value: "default", label: "Der Startansicht folgen" },
          { value: "snapshot", label: "Geräte-Schnappschuss" },
          {
            value: "newest",
            label: "Neuester Schnappschuss oder Aufnahme",
          },
        ],
      },
    });
  });

  it("reveals only the controls relevant to an interactive dashboard", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      door_entity: "lock.front_door",
      dashboard_behavior: "interactive",
    });
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as
      | (HTMLElement & { schema?: ConfigFormSchema[] })
      | null;
    expect(
      form?.schema
        ?.find((field) => field.name === "dashboard_preview")
        ?.schema?.map((field) => field.name),
    ).toEqual([
      "dashboard_behavior",
      "dashboard_start",
      "dashboard_live_muted",
    ]);
    expect(
      form?.schema
        ?.find((field) => field.name === "door_access")
        ?.schema?.map((field) => field.name),
    ).toEqual([
      "door_entity",
      "door_contact_entity",
      "door_action",
      "door_control_visibility",
      "door_hold_to_activate",
      "door_control_location",
    ]);
  });

  it("progressively reveals the logical door-access controls", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      door_entity: "lock.front_door",
      two_way_audio: true,
    });
    document.body.append(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as
      | (HTMLElement & { schema?: ConfigFormSchema[] })
      | null;
    const names = () => form?.schema
      ?.find((field) => field.name === "door_access")
      ?.schema?.map((field) => field.name);
    expect(names()).toEqual([
      "door_entity",
      "door_contact_entity",
      "door_action",
      "door_control_visibility",
      "door_hold_to_activate",
    ]);
    const contactField = form?.schema
      ?.find((field) => field.name === "door_access")
      ?.schema?.find((field) => field.name === "door_contact_entity");
    expect(contactField?.required).not.toBe(true);
    expect(contactField?.selector).toEqual({
      entity: { domain: "binary_sensor" },
    });

    form?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            recording_entity: "camera.recording",
            live_entity: "camera.live",
            door_entity: "",
            two_way_audio: true,
          },
        },
        bubbles: true,
        composed: true,
      }),
    );
    await editor.updateComplete;
    expect(names()).toEqual(["door_entity"]);
  });
});
