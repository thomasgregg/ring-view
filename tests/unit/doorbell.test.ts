import { describe, expect, it } from "vitest";
import type { HassEntity } from "../../src/types";
import { isDoorbellRingTransition } from "../../src/utilities/doorbell";

function entity(
  entityId: string,
  state: string,
  eventType?: string,
  attributes: HassEntity["attributes"] = {},
): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: eventType === undefined ? attributes : { ...attributes, event_type: eventType },
  };
}

describe("doorbell ring transitions", () => {
  it("accepts only off-to-on transitions for binary sensors", () => {
    const id = "binary_sensor.front_door_ding";
    expect(isDoorbellRingTransition(id, entity(id, "off"), entity(id, "on"))).toBe(true);
    expect(isDoorbellRingTransition(id, entity(id, "on"), entity(id, "on"))).toBe(false);
    expect(isDoorbellRingTransition(id, entity(id, "on"), entity(id, "off"))).toBe(false);
    expect(isDoorbellRingTransition(id, entity(id, "unknown"), entity(id, "on"))).toBe(false);
    expect(isDoorbellRingTransition(id, entity(id, "unavailable"), entity(id, "on"))).toBe(false);
  });

  it("accepts a new Ring-MQTT Ding marker while the sensor remains on", () => {
    const id = "binary_sensor.front_door_ding";
    const previous = entity(id, "on", undefined, {
      lastDingTime: "2026-09-12T14:19:13Z",
      lastDing: 1_789_222_753,
    });

    expect(isDoorbellRingTransition(
      id,
      previous,
      entity(id, "on", undefined, {
        lastDingTime: "2026-09-12T14:20:10Z",
        lastDing: 1_789_222_810,
      }),
    )).toBe(true);
    expect(isDoorbellRingTransition(id, previous, { ...previous })).toBe(false);
    expect(isDoorbellRingTransition(
      id,
      entity(id, "off", undefined, { lastDingTime: "2026-09-12T14:19:13Z" }),
      entity(id, "off", undefined, { lastDingTime: "2026-09-12T14:20:10Z" }),
    )).toBe(false);
  });

  it("falls back to lastDing and ignores a marker first added to an active sensor", () => {
    const id = "binary_sensor.front_door_ding";
    expect(isDoorbellRingTransition(
      id,
      entity(id, "on", undefined, { lastDing: 1_789_222_753 }),
      entity(id, "on", undefined, { lastDing: 1_789_222_810 }),
    )).toBe(true);
    expect(isDoorbellRingTransition(
      id,
      entity(id, "on"),
      entity(id, "on", undefined, { lastDingTime: "2026-09-12T14:20:10Z" }),
    )).toBe(false);
  });

  it("accepts Ring events and ignores other event types", () => {
    const id = "event.front_door_ding";
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:00:00Z"), entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(true);
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:00:00Z"), entity(id, "2026-09-12T14:01:00Z", "motion")),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:01:00Z"), entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, entity(id, "unknown"), entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(true);
    expect(
      isDoorbellRingTransition(id, entity(id, "unavailable"), entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(false);
  });

  it("does not treat initial, unavailable, or unsupported states as a ring", () => {
    expect(isDoorbellRingTransition("event.ding", undefined, entity("event.ding", "now", "ring"))).toBe(false);
    expect(isDoorbellRingTransition("event.ding", entity("event.ding", "before"), entity("event.ding", "unavailable", "ring"))).toBe(false);
    expect(isDoorbellRingTransition("sensor.ding", entity("sensor.ding", "off"), entity("sensor.ding", "on"))).toBe(false);
  });
});
