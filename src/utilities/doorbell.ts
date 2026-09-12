import type { HassEntity } from "../types";

const UNAVAILABLE_STATES = new Set(["unknown", "unavailable"]);

export function isDoorbellRingTransition(
  entityId: string,
  previousState: string | undefined,
  current: HassEntity | undefined,
): boolean {
  if (
    !current
    || previousState === undefined
    || UNAVAILABLE_STATES.has(current.state)
  ) {
    return false;
  }

  if (entityId.startsWith("binary_sensor.")) {
    return previousState === "off" && current.state === "on";
  }

  return (
    entityId.startsWith("event.")
    && previousState !== "unavailable"
    && previousState !== current.state
    && (current.attributes.event_type === undefined
      || current.attributes.event_type === "ring")
  );
}
