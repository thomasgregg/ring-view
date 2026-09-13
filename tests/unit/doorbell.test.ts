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
  const now = Date.parse("2026-09-12T14:20:12Z");

  it("accepts off-to-on binary-sensor transitions without stale recovery noise", () => {
    const id = "binary_sensor.front_door_ding";
    expect(isDoorbellRingTransition(id, entity(id, "off"), entity(id, "on"), now)).toBe(true);
    expect(isDoorbellRingTransition(id, entity(id, "on"), entity(id, "on"), now)).toBe(false);
    expect(isDoorbellRingTransition(id, entity(id, "on"), entity(id, "off"), now)).toBe(false);
    expect(isDoorbellRingTransition(id, entity(id, "on"), entity(id, "unavailable"), now)).toBe(false);
    expect(isDoorbellRingTransition(id, entity(id, "unavailable"), entity(id, "on"), now)).toBe(false);
  });

  it("recovers only fresh retained or reconnected Ring-MQTT Dings", () => {
    const id = "binary_sensor.front_door_ding";
    const fresh = entity(id, "on", undefined, {
      lastDingTime: "2026-09-12T14:20:05Z",
    });
    const stale = entity(id, "on", undefined, {
      lastDingTime: "2026-09-12T14:19:59Z",
    });
    const nearFuture = entity(id, "on", undefined, {
      lastDing: (now + 4_000) / 1_000,
    });
    const tooFarFuture = entity(id, "on", undefined, {
      lastDing: (now + 6_000) / 1_000,
    });

    expect(isDoorbellRingTransition(id, undefined, fresh, now)).toBe(true);
    expect(isDoorbellRingTransition(id, undefined, stale, now)).toBe(false);
    expect(isDoorbellRingTransition(id, entity(id, "unavailable"), fresh, now)).toBe(true);
    expect(isDoorbellRingTransition(id, entity(id, "unknown"), stale, now)).toBe(false);
    expect(isDoorbellRingTransition(id, undefined, nearFuture, now)).toBe(true);
    expect(isDoorbellRingTransition(id, undefined, tooFarFuture, now)).toBe(false);
  });

  it("accepts only advancing Ring-MQTT Ding timestamps while the sensor remains on", () => {
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
      now,
    )).toBe(true);
    expect(isDoorbellRingTransition(id, previous, { ...previous }, now)).toBe(false);
    expect(isDoorbellRingTransition(
      id,
      previous,
      entity(id, "on", undefined, {
        lastDingTime: "2026-09-12T14:18:13Z",
        lastDing: 1_789_222_693,
      }),
      now,
    )).toBe(false);
    expect(isDoorbellRingTransition(
      id,
      entity(id, "off", undefined, { lastDingTime: "2026-09-12T14:19:13Z" }),
      entity(id, "off", undefined, { lastDingTime: "2026-09-12T14:20:10Z" }),
      now,
    )).toBe(false);
  });

  it("normalizes equivalent markers and compares both Ring-MQTT timestamp attributes", () => {
    const id = "binary_sensor.front_door_ding";
    const previous = entity(id, "on", undefined, {
      lastDingTime: "2026-09-12T14:19:13Z",
      lastDing: 1_789_222_753,
    });

    expect(isDoorbellRingTransition(
      id,
      previous,
      entity(id, "on", undefined, {
        lastDingTime: "2026-09-12T14:19:13+00:00",
        lastDing: "1789222753",
      }),
      now,
    )).toBe(false);
    expect(isDoorbellRingTransition(
      id,
      previous,
      entity(id, "on", undefined, { lastDing: 1_789_222_753 }),
      now,
    )).toBe(false);
    expect(isDoorbellRingTransition(
      id,
      previous,
      entity(id, "on", undefined, {
        lastDingTime: "invalid",
        lastDing: 1_789_222_810,
      }),
      now,
    )).toBe(true);
    expect(isDoorbellRingTransition(
      id,
      entity(id, "on"),
      entity(id, "on", undefined, { lastDingTime: "2026-09-12T14:20:10Z" }),
      now,
    )).toBe(false);
  });

  it("uses last_updated only when neither binary-sensor state has a Ding marker", () => {
    const id = "binary_sensor.front_door_ding";
    const previous = {
      ...entity(id, "on"),
      last_updated: "2026-09-12T14:19:13Z",
    };
    const current = {
      ...entity(id, "on"),
      last_updated: "2026-09-12T14:20:10Z",
    };

    expect(isDoorbellRingTransition(id, previous, current, now)).toBe(true);
    expect(isDoorbellRingTransition(id, current, { ...current }, now)).toBe(false);
    expect(isDoorbellRingTransition(
      id,
      entity(id, "on", undefined, { lastDingTime: "2026-09-12T14:19:13Z" }),
      current,
      now,
    )).toBe(false);
    expect(isDoorbellRingTransition(
      id,
      { ...previous, attributes: { lastDingTime: "invalid" } },
      { ...current, attributes: { lastDingTime: "invalid" } },
      now,
    )).toBe(false);
  });

  it("accepts only advancing Ring event timestamps and ignores other event types", () => {
    const id = "event.front_door_ding";
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:19:00Z"), entity(id, "2026-09-12T14:20:10Z", "ring"), now),
    ).toBe(true);
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:19:00Z"), entity(id, "2026-09-12T14:20:10Z", "motion"), now),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:20:10Z"), entity(id, "2026-09-12T14:20:10Z", "ring"), now),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:20:10Z"), entity(id, "2026-09-12T14:20:09Z", "ring"), now),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, entity(id, "2026-09-12T14:20:10Z"), entity(id, "2026-09-12T14:20:10+00:00", "ring"), now),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, undefined, entity(id, "2026-09-12T14:20:10Z", "ring"), now),
    ).toBe(true);
    expect(
      isDoorbellRingTransition(id, entity(id, "unavailable"), entity(id, "2026-09-12T14:20:10Z", "ring"), now),
    ).toBe(true);
    expect(
      isDoorbellRingTransition(id, undefined, entity(id, "2026-09-12T14:19:59Z", "ring"), now),
    ).toBe(false);
  });

  it("does not treat invalid, unavailable, or unsupported entities as a ring", () => {
    expect(isDoorbellRingTransition("event.ding", undefined, entity("event.ding", "not-a-date", "ring"), now)).toBe(false);
    expect(isDoorbellRingTransition("event.ding", entity("event.ding", "before"), entity("event.ding", "unavailable", "ring"), now)).toBe(false);
    expect(isDoorbellRingTransition("sensor.ding", entity("sensor.ding", "off"), entity("sensor.ding", "on"), now)).toBe(false);
  });
});
