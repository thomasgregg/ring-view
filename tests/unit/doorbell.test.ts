import { describe, expect, it } from "vitest";
import type { HassEntity } from "../../src/types";
import { isDoorbellRingTransition } from "../../src/utilities/doorbell";

function entity(entityId: string, state: string, eventType?: string): HassEntity {
  return {
    entity_id: entityId,
    state,
    attributes: eventType === undefined ? {} : { event_type: eventType },
  };
}

describe("doorbell ring transitions", () => {
  it("accepts only off-to-on transitions for binary sensors", () => {
    const id = "binary_sensor.front_door_ding";
    expect(isDoorbellRingTransition(id, "off", entity(id, "on"))).toBe(true);
    expect(isDoorbellRingTransition(id, "on", entity(id, "on"))).toBe(false);
    expect(isDoorbellRingTransition(id, "on", entity(id, "off"))).toBe(false);
    expect(isDoorbellRingTransition(id, "unknown", entity(id, "on"))).toBe(false);
    expect(isDoorbellRingTransition(id, "unavailable", entity(id, "on"))).toBe(false);
  });

  it("accepts Ring events and ignores other event types", () => {
    const id = "event.front_door_ding";
    expect(
      isDoorbellRingTransition(id, "2026-09-12T14:00:00Z", entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(true);
    expect(
      isDoorbellRingTransition(id, "2026-09-12T14:00:00Z", entity(id, "2026-09-12T14:01:00Z", "motion")),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, "2026-09-12T14:01:00Z", entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(false);
    expect(
      isDoorbellRingTransition(id, "unknown", entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(true);
    expect(
      isDoorbellRingTransition(id, "unavailable", entity(id, "2026-09-12T14:01:00Z", "ring")),
    ).toBe(false);
  });

  it("does not treat initial, unavailable, or unsupported states as a ring", () => {
    expect(isDoorbellRingTransition("event.ding", undefined, entity("event.ding", "now", "ring"))).toBe(false);
    expect(isDoorbellRingTransition("event.ding", "before", entity("event.ding", "unavailable", "ring"))).toBe(false);
    expect(isDoorbellRingTransition("sensor.ding", "off", entity("sensor.ding", "on"))).toBe(false);
  });
});
