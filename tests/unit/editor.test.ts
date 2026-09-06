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
  states: {
    "camera.recording": entity("camera.recording", 0),
    "camera.live": entity("camera.live", 2),
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
      preview_source: "last_recording",
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

  it("uses one native form with two compact expandable groups and no duplicate preview", async () => {
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
      { name: "viewer_behavior", flatten: true, icon: true },
      { name: "card_appearance", flatten: true, icon: true },
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
    expect(form?.computeLabel?.({ name: "name" })).toBe("Kameraname (optional)");
    expect(form?.computeLabel?.({ name: "show_name" })).toBe(
      "Kameranamen anzeigen",
    );
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
      "preview_source",
      "",
    ]);
    const previewSource = cardAppearance?.schema?.find(
      (field) => field.name === "preview_source",
    );
    expect(previewSource?.selector).toMatchObject({
      select: {
        options: [
          { value: "last_recording", label: "Standbild der letzten Aufnahme" },
          { value: "live", label: "Standbild der Live-Kamera" },
          { value: "default", label: "Der Startansicht folgen" },
        ],
      },
    });
  });
});
