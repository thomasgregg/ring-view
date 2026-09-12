import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  findSameDeviceEntityId,
  resolveEntitySources,
  sameDeviceEntityIds,
} from "../../src/utilities/entity-sources";

const state = (entityId: string): HassEntity => ({
  entity_id: entityId,
  state: "idle",
  attributes: {},
});

function mixedHass(): HomeAssistant {
  const states = Object.fromEntries([
    "camera.recording",
    "camera.live",
    "camera.renamed_snapshot",
    "binary_sensor.renamed_ding",
    "button.renamed_refresh",
    "button.ambiguous_refresh",
  ].map((entityId) => [entityId, state(entityId)]));
  return {
    states,
    entities: {
      "camera.recording": {
        entity_id: "camera.recording",
        platform: "ring",
        device_id: "ring-device",
      },
      "camera.live": {
        entity_id: "camera.live",
        platform: "ring",
        device_id: "ring-device",
      },
      "camera.renamed_snapshot": {
        entity_id: "camera.renamed_snapshot",
        platform: "mqtt",
        device_id: "mqtt-device",
      },
      "binary_sensor.renamed_ding": {
        entity_id: "binary_sensor.renamed_ding",
        platform: "mqtt",
        device_id: "mqtt-device",
      },
      "button.renamed_refresh": {
        entity_id: "button.renamed_refresh",
        platform: "mqtt",
        device_id: "mqtt-device",
      },
      "button.ambiguous_refresh": {
        entity_id: "button.ambiguous_refresh",
        platform: "mqtt",
        device_id: "mqtt-device",
      },
      "sensor.disabled": {
        entity_id: "sensor.disabled",
        platform: "mqtt",
        device_id: "mqtt-device",
        disabled_by: "user",
      },
    },
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
  };
}

describe("entity feature sources", () => {
  it("resolves every configured feature independently in a mixed setup", () => {
    const hass = mixedHass();
    const sources = resolveEntitySources(hass, normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      snapshot_entity: "camera.renamed_snapshot",
      doorbell_entity: "binary_sensor.renamed_ding",
    }));

    expect(sources.recording.provider).toBe("official_ring");
    expect(sources.live.provider).toBe("official_ring");
    expect(sources.snapshot?.provider).toBe("mqtt");
    expect(sources.doorbell?.provider).toBe("mqtt");
    expect(sources.activity).toBeUndefined();
  });

  it("finds renamed companions by device identity rather than name", () => {
    const hass = mixedHass();
    expect(sameDeviceEntityIds(hass, "camera.renamed_snapshot")).toEqual([
      "binary_sensor.renamed_ding",
      "button.ambiguous_refresh",
      "button.renamed_refresh",
      "camera.renamed_snapshot",
    ]);
    expect(findSameDeviceEntityId(
      hass,
      "camera.renamed_snapshot",
      (entityId) => entityId === "button.renamed_refresh",
    )).toBe("button.renamed_refresh");
  });

  it("refuses an ambiguous companion and degrades without registry data", () => {
    const hass = mixedHass();
    expect(findSameDeviceEntityId(
      hass,
      "camera.renamed_snapshot",
      (entityId) => entityId.startsWith("button."),
    )).toBeUndefined();
    expect(sameDeviceEntityIds(
      { ...hass, entities: undefined },
      "camera.renamed_snapshot",
    )).toEqual([]);
  });
});
