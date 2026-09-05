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
  it("emits nested preview updates as a card configuration change", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    const listener = vi.fn();
    editor.addEventListener("config-changed", listener);
    document.body.append(editor);
    await editor.updateComplete;

    const previewForm = editor.shadowRoot?.querySelector<HTMLElement>(
      'ha-form[data-target="preview"]',
    );
    previewForm?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: { source: "live", show_name: true, show_mode_badge: false },
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
    expect(event.detail.config.preview).toEqual({
      source: "live",
      show_name: true,
      show_mode_badge: false,
    });
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
  });

  it("keeps the dashboard preview on the right and reveals the name field on demand", async () => {
    const editor = document.createElement("ring-view-editor");
    editor.hass = hass;
    editor.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      preview: { source: "live", show_mode_badge: false, show_name: false },
    });
    document.body.append(editor);
    await editor.updateComplete;

    const layout = editor.shadowRoot?.querySelector(".editor-layout");
    expect(layout?.lastElementChild?.classList.contains("preview-pane")).toBe(true);
    expect(editor.shadowRoot?.querySelector(".preview-card img")).not.toBeNull();
    expect(editor.shadowRoot?.querySelector(".preview-mode-indicator")).toBeNull();

    const previewForms = editor.shadowRoot?.querySelectorAll<HTMLElement>(
      'ha-form[data-target="preview"]',
    );
    previewForms?.[1]?.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { show_name: true } },
        bubbles: true,
        composed: true,
      }),
    );
    await editor.updateComplete;

    expect(editor.shadowRoot?.querySelector(".preview-name")).not.toBeNull();
    const rootForms = Array.from(
      editor.shadowRoot?.querySelectorAll<HTMLElement>('ha-form[data-target="root"]') ?? [],
    );
    expect(
      rootForms.some((form) =>
        ((form as HTMLElement & { schema?: ConfigFormSchema[] }).schema ?? []).some(
          (field) => field.name === "name",
        ),
      ),
    ).toBe(true);
  });
});
