import { describe, expect, it } from "vitest";
import "../../src/activity-time";
import "../../src/ring-view-editor";
import "../../src/ring-view";
import "../../src/ring-view-dialog";
import { normalizeConfig } from "../../src/config";
import { activityEntityId, recordingTimestampSensor, formatActivityTime } from "../../src/utilities/activity-time";
import type { HomeAssistant } from "../../src/types";

function fixture(): HomeAssistant {
  return {
    language: "en",
    hassUrl: (path) => path ?? "",
    callWS: async <T>() => ({} as T),
    states: {
      "camera.clip": { entity_id: "camera.clip", state: "idle", attributes: {} },
      "sensor.renamed": { entity_id: "sensor.renamed", state: "2026-10-01T12:00:00Z", attributes: { device_class: "timestamp" } },
    },
    entities: {
      "camera.clip": { entity_id: "camera.clip", platform: "ring", device_id: "door" },
      "sensor.renamed": { entity_id: "sensor.renamed", platform: "ring", device_id: "door", unique_id: "123-last_recording" },
    },
  };
}

describe("official Ring recording age", () => {
  it("discovers renamed sensors and honours explicit activity sources", () => {
    const hass = fixture();
    expect(activityEntityId(hass, { recording_entity: "camera.clip" })).toBe("sensor.renamed");
    expect(activityEntityId(hass, { recording_entity: "camera.clip", last_activity_entity: "event.ding" })).toBe("event.ding");
    hass.entities!["sensor.renamed"]!.unique_id = undefined;
    hass.entities!["sensor.renamed"]!.translation_key = "last_recording";
    expect(recordingTimestampSensor(hass, "camera.clip")).toBe("sensor.renamed");
  });
  it("does not guess across devices, providers, disabled or ambiguous sensors", () => {
    const hass = fixture();
    hass.entities!["sensor.renamed"]!.disabled_by = "integration";
    expect(recordingTimestampSensor(hass, "camera.clip")).toBeUndefined();
    expect(recordingTimestampSensor(hass, "camera.clip", true)).toBe("sensor.renamed");
    hass.entities!["sensor.renamed"]!.disabled_by = null;
    hass.entities!["sensor.renamed"]!.device_id = "other";
    expect(recordingTimestampSensor(hass, "camera.clip")).toBeUndefined();
    hass.entities!["sensor.renamed"]!.device_id = "door";
    hass.entities!["camera.clip"]!.platform = "mqtt";
    expect(recordingTimestampSensor(hass, "camera.clip")).toBeUndefined();
    hass.entities!["camera.clip"]!.platform = "ring";
    hass.entities!["sensor.second"] = { ...hass.entities!["sensor.renamed"]!, entity_id: "sensor.second" };
    hass.states["sensor.second"] = { ...hass.states["sensor.renamed"]!, entity_id: "sensor.second" };
    expect(recordingTimestampSensor(hass, "camera.clip")).toBeUndefined();
    expect(activityEntityId({ ...fixture(), states: {}, entities: {} }, { recording_entity: "camera.old" })).toBeUndefined();
  });
  it("renders recording wording and hides unavailable dates", async () => {
    const hass = fixture();
    const now = Date.parse("2026-10-01T12:08:00Z");
    expect(formatActivityTime(hass, now - 480000, now, true).relative).toBe("Recorded 8 min ago");
    expect(formatActivityTime(hass, now - 480000, now).relative).toContain("Activity");
    const element = document.createElement("ring-view-activity-time");
    element.hass = hass; element.entityId = "sensor.renamed";
    document.body.append(element); await element.updateComplete;
    expect(element.shadowRoot?.textContent).toContain("Recorded");
    hass.states["sensor.renamed"] = { ...hass.states["sensor.renamed"]!, state: "unavailable" };
    element.hass = { ...hass }; await element.updateComplete;
    expect(element.shadowRoot?.querySelector("span")).toBeNull();
    element.remove();
  });
  it("updates the automatically discovered card timestamp when only the sensor changes", async () => {
    const hass = fixture();
    const card = document.createElement("ring-view");
    card.setConfig({ recording_entity: "camera.clip", live_entity: "camera.clip" });
    card.hass = hass; document.body.append(card); await card.updateComplete;
    expect(card.shadowRoot?.querySelector("ring-view-activity-time")?.entityId).toBe("sensor.renamed");
    expect(card.shadowRoot?.querySelector(".preview")?.getAttribute("aria-label")).toContain("Recorded");
    card.hass = { ...hass, states: { ...hass.states, "sensor.renamed": { ...hass.states["sensor.renamed"]!, state: "unavailable" } } };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector("ring-view-activity-time")).toBeNull();
    card.remove();
  });
  it("explains how to enable a disabled sensor in the editor", async () => {
    const hass = fixture(); hass.entities!["sensor.renamed"]!.disabled_by = "integration";
    const editor = document.createElement("ring-view-editor"); editor.hass = hass;
    editor.setConfig({ type: "custom:ring-view", recording_entity: "camera.clip", live_entity: "camera.clip" });
    document.body.append(editor); await editor.updateComplete;
    expect(editor.shadowRoot?.textContent).toContain("Enable the Ring Last recording sensor");
    editor.remove();
  });

  it("keeps recording age in Recording mode and hides it in idle Live mode", async () => {
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = fixture();
    document.body.append(dialog);
    const config = normalizeConfig({ recording_entity: "camera.clip", live_entity: "camera.clip" });
    dialog.showInline({ config, mode: "last_recording", start: "on_demand" });
    await dialog.updateComplete;
    expect(dialog.shadowRoot?.querySelector("ring-view-activity-time")?.entityId).toBe("sensor.renamed");
    expect(dialog.shadowRoot?.querySelector(".live-subtitle")).toBeNull();
    dialog.stopInline();
    dialog.showInline({ config, mode: "live", start: "on_demand" });
    await dialog.updateComplete;
    expect(dialog.shadowRoot?.querySelector("ring-view-activity-time")).toBeNull();
    expect(dialog.shadowRoot?.querySelector(".live-subtitle")).toBeNull();
    dialog.stopInline();
    dialog.remove();
  });
});
