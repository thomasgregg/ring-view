import { languageCode, localize } from "../localize";
import type { HassEntity, HomeAssistant } from "../types";
import {
  resolveEntitySource,
  sameDeviceEntityIds,
} from "./entity-sources";

const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:?\d{2})?$/i;
const NUMERIC_PATTERN = /^-?\d+(?:\.\d+)?$/;
const UNIX_MILLISECONDS_THRESHOLD = 100_000_000_000;
const RING_MQTT_ACTIVITY_ATTRIBUTES = [
  "lastDingTime",
  "lastMotionTime",
  "lastDing",
  "lastMotion",
] as const;
const UNAVAILABLE_STATES = new Set(["unknown", "unavailable"]);

export interface ActivityTimeDisplay {
  relative: string;
  accessible: string;
  title: string;
}

function validDateTimeParts(match: RegExpMatchArray): boolean {
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6] ?? 0);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return (
    month >= 1
    && month <= 12
    && day >= 1
    && day <= daysInMonth
    && hour >= 0
    && hour <= 23
    && minute >= 0
    && minute <= 59
    && second >= 0
    && second <= 59
  );
}

export function parseTimestampValue(value: unknown): number | undefined {
  if (typeof value !== "string" && typeof value !== "number") return undefined;
  const text = String(value).trim();
  if (!text || ["unknown", "unavailable", "none", "null"].includes(text.toLowerCase())) {
    return undefined;
  }

  if (NUMERIC_PATTERN.test(text)) {
    const numeric = Number(text);
    if (!Number.isFinite(numeric)) return undefined;
    const timestamp = Math.abs(numeric) < UNIX_MILLISECONDS_THRESHOLD
      ? numeric * 1_000
      : numeric;
    return Number.isFinite(new Date(timestamp).getTime()) ? timestamp : undefined;
  }

  const match = text.match(DATE_TIME_PATTERN);
  if (!match || !validDateTimeParts(match)) return undefined;
  const normalized = text.includes(" ") ? text.replace(" ", "T") : text;
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? timestamp : undefined;
}

export function activityTimestamp(entity?: HassEntity): number | undefined {
  return parseTimestampValue(entity?.state);
}

function latestTimestamp(values: Array<number | undefined>): number | undefined {
  const timestamps = values.filter((value): value is number => value !== undefined);
  return timestamps.length > 0 ? Math.max(...timestamps) : undefined;
}

/**
 * Ring-MQTT exposes the latest Ding and motion timestamps as attributes on its
 * binary sensors. Restricting this to the documented keys avoids presenting
 * unrelated Home Assistant metadata as camera activity.
 */
export function ringMqttActivityTimestamp(
  entity?: HassEntity,
): number | undefined {
  if (!entity || UNAVAILABLE_STATES.has(entity.state)) return undefined;
  return latestTimestamp(
    RING_MQTT_ACTIVITY_ATTRIBUTES.map((attribute) =>
      parseTimestampValue(entity.attributes[attribute]),
    ),
  );
}

/**
 * Resolve the configured activity source without relying on last_changed or
 * last_updated. Official Ring timestamp entities continue to use their state.
 * A Ring-MQTT binary sensor additionally contributes its own approved
 * attributes and those of available MQTT binary-sensor siblings on the same
 * Home Assistant device.
 */
export function resolveActivityTimestamp(
  hass: HomeAssistant,
  entityId: string,
): number | undefined {
  const selected = hass.states[entityId];
  const selectedAvailable = selected && !UNAVAILABLE_STATES.has(selected.state);
  const candidates = selectedAvailable
    ? [activityTimestamp(selected)]
    : [];
  if (!entityId.startsWith("binary_sensor.")) {
    return latestTimestamp(candidates);
  }

  if (selectedAvailable) {
    candidates.push(ringMqttActivityTimestamp(selected));
  }
  const source = resolveEntitySource(hass, "activity", entityId);
  if (source.provider !== "mqtt") return latestTimestamp(candidates);

  for (const siblingId of sameDeviceEntityIds(hass, entityId)) {
    if (
      siblingId === entityId
      || !siblingId.startsWith("binary_sensor.")
      || resolveEntitySource(hass, "activity", siblingId).provider !== "mqtt"
    ) {
      continue;
    }
    candidates.push(ringMqttActivityTimestamp(hass.states[siblingId]));
  }
  return latestTimestamp(candidates);
}

function relativeUnit(deltaSeconds: number): {
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
} {
  const magnitude = Math.abs(deltaSeconds);
  if (magnitude < 60) return { unit: "second", seconds: 1 };
  if (magnitude < 3_600) return { unit: "minute", seconds: 60 };
  if (magnitude < 86_400) return { unit: "hour", seconds: 3_600 };
  if (magnitude < 2_629_746) return { unit: "day", seconds: 86_400 };
  if (magnitude < 31_556_952) return { unit: "month", seconds: 2_629_746 };
  return { unit: "year", seconds: 31_556_952 };
}

function relativeValue(deltaSeconds: number, secondsPerUnit: number): number {
  const value = Math.trunc(deltaSeconds / secondsPerUnit);
  return Object.is(value, -0) ? 0 : value;
}

export function formatActivityTime(
  hass: HomeAssistant | undefined,
  timestamp: number,
  now = Date.now(),
): ActivityTimeDisplay {
  const locale = languageCode(hass);
  const deltaSeconds = (timestamp - now) / 1_000;
  const { unit, seconds } = relativeUnit(deltaSeconds);
  const value = relativeValue(deltaSeconds, seconds);
  const formattedRelative = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "short",
  }).format(value, unit);
  const relative = locale === "en"
    ? formattedRelative.replace(/\b(sec|min|hr)\./g, "$1")
    : formattedRelative;
  const spokenRelative = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: "long",
  }).format(value, unit);
  const absolute = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
  return {
    relative,
    accessible: localize(hass, "activity.accessible", {
      time: spokenRelative,
    }),
    title: localize(hass, "activity.title", { time: absolute }),
  };
}
