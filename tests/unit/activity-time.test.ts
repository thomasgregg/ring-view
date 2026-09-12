import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/activity-time";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  activityTimestamp,
  formatActivityTime,
  parseTimestampValue,
  resolveActivityTimestamp,
  ringMqttActivityTimestamp,
} from "../../src/utilities/activity-time";

const entity = (state: string): HassEntity => ({
  entity_id: "sensor.last_activity",
  state,
  attributes: { device_class: "timestamp" },
});

describe("last activity timestamps", () => {
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  it("parses ISO timestamps with UTC, offsets, and Home Assistant local spacing", () => {
    expect(parseTimestampValue("2026-09-12T10:15:30Z")).toBe(
      Date.parse("2026-09-12T10:15:30Z"),
    );
    expect(parseTimestampValue("2026-09-12T12:15:30+02:00")).toBe(
      Date.parse("2026-09-12T12:15:30+02:00"),
    );
    expect(parseTimestampValue("2026-09-12 10:15:30")).toBe(
      new Date(2026, 8, 12, 10, 15, 30).getTime(),
    );
  });

  it("accepts Unix seconds and milliseconds as strings or numbers", () => {
    expect(parseTimestampValue("1789208130")).toBe(1_789_208_130_000);
    expect(parseTimestampValue(1_789_208_130)).toBe(1_789_208_130_000);
    expect(parseTimestampValue("1789208130000")).toBe(1_789_208_130_000);
    expect(parseTimestampValue(1_789_208_130_000)).toBe(1_789_208_130_000);
  });

  it("rejects missing times, invalid calendar values, and unavailable states", () => {
    for (const value of [
      "",
      "unknown",
      "unavailable",
      "2026-09-12",
      "10:15:30",
      "2026-02-30T10:15:30Z",
      "2026-13-12T10:15:30Z",
      "2026-09-12T24:15:30Z",
      "not a date",
      undefined,
      null,
    ]) {
      expect(parseTimestampValue(value)).toBeUndefined();
    }
    expect(activityTimestamp(undefined)).toBeUndefined();
    expect(activityTimestamp(entity("unknown"))).toBeUndefined();
  });

  it("reads only the approved Ring-MQTT Ding and motion attributes", () => {
    const mqttEntity: HassEntity = {
      entity_id: "binary_sensor.front_door_ding",
      state: "off",
      attributes: {
        lastDingTime: "2026-09-12T10:15:30Z",
        lastMotionTime: "2026-09-12T10:16:30Z",
        lastDing: 1_789_208_130,
        lastMotion: "1789208250000",
        timestamp: "2026-09-12T11:00:00Z",
      },
      last_changed: "2026-09-12T12:00:00Z",
      last_updated: "2026-09-12T13:00:00Z",
    };

    expect(ringMqttActivityTimestamp(mqttEntity)).toBe(1_789_208_250_000);
    expect(ringMqttActivityTimestamp({
      ...mqttEntity,
      state: "unavailable",
    })).toBeUndefined();
    expect(ringMqttActivityTimestamp({
      ...mqttEntity,
      attributes: { timestamp: "2026-09-12T11:00:00Z" },
    })).toBeUndefined();
  });

  it("uses the freshest available MQTT Ding or motion sibling on the same device", () => {
    const ding: HassEntity = {
      entity_id: "binary_sensor.renamed_ding",
      state: "off",
      attributes: { lastDingTime: "2026-09-12T10:15:30Z" },
    };
    const motion: HassEntity = {
      entity_id: "binary_sensor.renamed_motion",
      state: "off",
      attributes: { lastMotionTime: "2026-09-12T10:17:30Z" },
    };
    const unavailable: HassEntity = {
      entity_id: "binary_sensor.unavailable_motion",
      state: "unavailable",
      attributes: { lastMotionTime: "2026-09-12T10:20:30Z" },
    };
    const info: HassEntity = {
      entity_id: "sensor.renamed_info",
      state: "2026-09-12T10:30:30Z",
      attributes: { lastMotionTime: "2026-09-12T10:30:30Z" },
    };
    const hass: HomeAssistant = {
      states: {
        [ding.entity_id]: ding,
        [motion.entity_id]: motion,
        [unavailable.entity_id]: unavailable,
        [info.entity_id]: info,
      },
      entities: Object.fromEntries(
        Object.keys({
          [ding.entity_id]: ding,
          [motion.entity_id]: motion,
          [unavailable.entity_id]: unavailable,
          [info.entity_id]: info,
        }).map((entityId) => [entityId, {
          entity_id: entityId,
          platform: "mqtt",
          device_id: "front-door",
        }]),
      ),
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };

    expect(resolveActivityTimestamp(hass, ding.entity_id)).toBe(
      Date.parse("2026-09-12T10:17:30Z"),
    );

    hass.states[ding.entity_id] = { ...ding, state: "unavailable" };
    expect(resolveActivityTimestamp(hass, ding.entity_id)).toBe(
      Date.parse("2026-09-12T10:17:30Z"),
    );
  });

  it("degrades to selected attributes without registry data and preserves state timestamps", () => {
    const ding: HassEntity = {
      entity_id: "binary_sensor.front_door_ding",
      state: "off",
      attributes: { lastDingTime: "2026-09-12T10:15:30Z" },
    };
    const official = entity("2026-09-12T10:18:30Z");
    const hass: HomeAssistant = {
      states: {
        [ding.entity_id]: ding,
        [official.entity_id]: official,
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };

    expect(resolveActivityTimestamp(hass, ding.entity_id)).toBe(
      Date.parse("2026-09-12T10:15:30Z"),
    );
    expect(resolveActivityTimestamp(hass, official.entity_id)).toBe(
      Date.parse("2026-09-12T10:18:30Z"),
    );
  });

  it("formats compact visible text and a fuller accessible label in English", () => {
    const now = Date.parse("2026-09-12T10:15:30Z");
    const display = formatActivityTime(
      undefined,
      now - 2 * 60 * 1_000,
      now,
    );
    expect(display.relative).toMatch(/2 min.*ago/i);
    expect(display.accessible).toBe("Last activity, 2 minutes ago");
    expect(display.title).toMatch(/^Last activity: /);
  });

  it("localizes relative, accessible, and exact text in German", () => {
    const hass = {
      language: "de-DE",
      states: {},
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    } satisfies HomeAssistant;
    const now = Date.parse("2026-09-12T10:15:30Z");
    const display = formatActivityTime(hass, now - 2 * 60 * 1_000, now);
    expect(display.relative).toContain("2 Min");
    expect(display.accessible).toBe("Letzte Aktivität, vor 2 Minuten");
    expect(display.title).toMatch(/^Letzte Aktivität: /);
  });

  it("chooses readable units for recent, old, and future timestamps", () => {
    const now = Date.parse("2026-09-12T10:15:30Z");
    expect(formatActivityTime(undefined, now - 12_000, now).relative).toMatch(
      /12 sec.*ago/i,
    );
    expect(
      formatActivityTime(undefined, now - 3 * 3_600_000, now).accessible,
    ).toContain("3 hours ago");
    expect(
      formatActivityTime(undefined, now - 4 * 86_400_000, now).accessible,
    ).toContain("4 days ago");
    expect(
      formatActivityTime(undefined, now + 2 * 60_000, now).accessible,
    ).toContain("in 2 minutes");
  });

  it("refreshes its visible time and asks the card to refresh its accessible label", async () => {
    const now = Date.parse("2026-09-12T10:15:30Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const activity = document.createElement("ring-view-activity-time");
    activity.hass = {
      states: {
        "sensor.last_activity": entity(
          new Date(now - 2 * 60_000).toISOString(),
        ),
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    activity.entityId = "sensor.last_activity";
    const tick = vi.fn();
    activity.addEventListener("ring-view-activity-tick", tick);
    document.body.append(activity);
    await activity.updateComplete;
    expect(activity.shadowRoot?.textContent).toContain("2 min ago");

    await vi.advanceTimersByTimeAsync(30_000);
    await activity.updateComplete;
    expect(tick).toHaveBeenCalledTimes(1);
    expect(activity.shadowRoot?.textContent).toContain("2 min ago");
  });
});
