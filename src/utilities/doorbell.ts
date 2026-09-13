import type { HassEntity } from "../types";
import { parseTimestampValue } from "./activity-time";

const UNAVAILABLE_STATES = new Set(["unknown", "unavailable"]);
const RECENT_RING_WINDOW_MS = 12_000;
const FUTURE_CLOCK_TOLERANCE_MS = 5_000;

export function isDoorbellRingTransition(
  entityId: string,
  previous: HassEntity | undefined,
  current: HassEntity | undefined,
  now = Date.now(),
): boolean {
  if (!current || UNAVAILABLE_STATES.has(current.state)) return false;

  if (!previous || UNAVAILABLE_STATES.has(previous.state)) {
    return isRecentRetainedRing(entityId, current, now);
  }

  if (entityId.startsWith("binary_sensor.")) {
    if (previous.state === "off" && current.state === "on") return true;
    if (previous.state !== "on" || current.state !== "on") return false;

    const previousDing = ringMqttDingTimestamp(previous);
    const currentDing = ringMqttDingTimestamp(current);
    if (hasRingMqttDingMarker(previous) || hasRingMqttDingMarker(current)) {
      return previousDing !== undefined
        && currentDing !== undefined
        && currentDing > previousDing;
    }

    const previousUpdate = parseTimestampValue(previous.last_updated);
    const currentUpdate = parseTimestampValue(current.last_updated);
    return previousUpdate !== undefined
      && currentUpdate !== undefined
      && currentUpdate > previousUpdate;
  }

  if (
    !entityId.startsWith("event.")
    || (current.attributes.event_type !== undefined
      && current.attributes.event_type !== "ring")
  ) {
    return false;
  }

  const previousEvent = parseTimestampValue(previous.state);
  const currentEvent = parseTimestampValue(current.state);
  if (currentEvent === undefined) return false;
  return previousEvent === undefined
    ? isRecentTimestamp(currentEvent, now)
    : currentEvent > previousEvent;
}

function isRecentRetainedRing(
  entityId: string,
  current: HassEntity,
  now: number,
): boolean {
  if (entityId.startsWith("binary_sensor.")) {
    if (current.state !== "on") return false;
    return isRecentTimestamp(ringMqttDingTimestamp(current), now);
  }

  return entityId.startsWith("event.")
    && (current.attributes.event_type === undefined
      || current.attributes.event_type === "ring")
    && isRecentTimestamp(parseTimestampValue(current.state), now);
}

function isRecentTimestamp(timestamp: number | undefined, now: number): boolean {
  if (timestamp === undefined) return false;
  const age = now - timestamp;
  return age >= -FUTURE_CLOCK_TOLERANCE_MS && age <= RECENT_RING_WINDOW_MS;
}

function ringMqttDingTimestamp(entity: HassEntity): number | undefined {
  const candidates = [
    parseTimestampValue(entity.attributes.lastDingTime),
    parseTimestampValue(entity.attributes.lastDing),
  ].filter((value): value is number => value !== undefined);

  return candidates.length > 0 ? Math.max(...candidates) : undefined;
}

function hasRingMqttDingMarker(entity: HassEntity): boolean {
  return entity.attributes.lastDingTime !== undefined
    || entity.attributes.lastDing !== undefined;
}
