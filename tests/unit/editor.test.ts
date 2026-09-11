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
    "lock.front_door": { entity_id: "lock.front_door", platform: "nuki" },
  },
  states: {
    "camera.recording": entity("camera.recording", 0),
    "camera.live": entity("camera.live", 2),
    "camera.snapshot": entity("camera.snapshot", 0),
    "lock.front_door": {
      ...entity("lock.front_door", 1),
      state: "locked",
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
      default_mode: "last_recording",
      remember_last_mode: false,
      autoplay_recording: true,
      live_muted: false,
      two_way_audio: false,
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

  it("groups related settings in five compact native expandable sections", async () => {
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
      { name: "dashboard_preview", flatten: true, icon: true },
      { name: "viewer_behavior", flatten: true, icon: true },
      { name: "doorbell_features", flatten: true, icon: true },
      { name: "door_access", flatten: true, icon: true },
      { name: "card_appearance", flatten: true, icon: true },
    ]);
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
      "Anzeigeverhalten",
    );
    expect(form?.computeLabel?.({ name: "snapshot_entity" })).toBe(
      "Kamera für Geräte-Schnappschuss",
    );
    expect(form?.computeLabel?.({ name: "name" })).toBe("Kameraname (optional)");
    expect(form?.computeLabel?.({ name: "show_name" })).toBe(
      "Kameranamen anzeigen",
    );
    expect(form?.computeLabel?.({ name: "dashboard_preview" })).toBe(
      "Dashboard-Vorschau",
    );
    expect(form?.computeLabel?.({ name: "door_access" })).toBe("Türzugang");
    expect(form?.computeHelper?.({ name: "live_muted" })).toContain(
      "mit Ton zu starten",
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
      "",
    ]);
    const dashboardPreview = form?.schema?.find(
      (field) => field.name === "dashboard_preview",
    );
    expect(dashboardPreview?.schema?.map((field) => field.name)).toEqual([
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
      "door_action",
      "door_control_visibility",
      "door_control_layout",
      "door_hold_to_activate",
    ]);

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
