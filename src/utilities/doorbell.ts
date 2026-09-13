import type { HassEntity } from "../types";

const UNAVAILABLE_STATES = new Set(["unknown", "unavailable"]);

export function isDoorbellRingTransition(
  entityId: string,
  previous: HassEntity | undefined,
  current: HassEntity | undefined,
): boolean {
  if (
    !current
    || !previous
    || UNAVAILABLE_STATES.has(current.state)
  ) {
    return false;
  }

  if (entityId.startsWith("binary_sensor.")) {
    if (UNAVAILABLE_STATES.has(previous.state)) return false;
    if (previous.state === "off" && current.state === "on") return true;
    if (previous.state !== "on" || current.state !== "on") return false;

    const previousDing = ringMqttDingMarker(previous);
    const currentDing = ringMqttDingMarker(current);
    return previousDing !== undefined
      && currentDing !== undefined
      && previousDing !== currentDing;
  }

  return (
    entityId.startsWith("event.")
    && previous.state !== "unavailable"
    && previous.state !== current.state
    && (current.attributes.event_type === undefined
      || current.attributes.event_type === "ring")
  );
}

function ringMqttDingMarker(entity: HassEntity): string | undefined {
  const lastDingTime = entity.attributes.lastDingTime;
  if (typeof lastDingTime === "string" && lastDingTime.trim() !== "") {
    return `time:${lastDingTime}`;
  }

  const lastDing = entity.attributes.lastDing;
  if (
    (typeof lastDing === "string" && lastDing.trim() !== "")
    || (typeof lastDing === "number" && Number.isFinite(lastDing))
  ) {
    return `epoch:${lastDing}`;
  }

  return undefined;
}
