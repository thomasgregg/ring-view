import type {
  HassEntity,
  HomeAssistant,
  NormalizedConfig,
} from "../types";
import { resolveEntitySource } from "./entity-sources";

const RECORDING_URL_ATTRIBUTES = [
  "video_url",
  "recordingUrl",
  "recording_url",
] as const;
const MINIMUM_SIGNED_URL_LIFETIME_MS = 30_000;

function nonPlayableRecordingUrl(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return normalized === ""
    || normalized.includes("<recording not found>")
    || normalized.includes("<transcoding in progress>");
}

export function recordingUrl(entity?: HassEntity): string | undefined {
  if (!entity) return undefined;
  for (const attribute of RECORDING_URL_ATTRIBUTES) {
    const value = entity.attributes[attribute];
    if (typeof value !== "string" || nonPlayableRecordingUrl(value)) continue;
    return value.trim();
  }
  return undefined;
}

function signedUrlExpiry(url: string): number | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url, "http://homeassistant.local");
  } catch {
    return undefined;
  }

  const parameters = new Map<string, string>();
  parsed.searchParams.forEach((value, key) => {
    parameters.set(key.toLowerCase(), value);
  });
  const signedAt = parameters.get("x-amz-date");
  const expiresIn = Number(parameters.get("x-amz-expires"));
  if (!signedAt || !Number.isFinite(expiresIn) || expiresIn < 0) return undefined;

  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/i.exec(signedAt);
  if (!match) return undefined;
  const [, year, month, day, hour, minute, second] = match;
  const timestamp = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second),
  );
  return Number.isFinite(timestamp) ? timestamp + expiresIn * 1_000 : undefined;
}

export function recordingUrlIsReady(
  entity?: HassEntity,
  now = Date.now(),
): boolean {
  const url = recordingUrl(entity);
  if (!url) return false;
  const expiry = signedUrlExpiry(url);
  return expiry === undefined || expiry - now > MINIMUM_SIGNED_URL_LIFETIME_MS;
}

export function recordingSourceMarker(entity?: HassEntity): string | undefined {
  if (!entity) return undefined;
  const url = recordingUrl(entity);
  const eventId = entity.attributes.eventId ?? entity.attributes.event_id;
  if (url) return `${String(eventId ?? "")}:${url}`;
  for (const attribute of ["last_video_id", "entity_picture"] as const) {
    const value = entity.attributes[attribute];
    if (typeof value === "string" && value !== "") return `${attribute}:${value}`;
    if (typeof value === "number" && Number.isFinite(value)) {
      return `${attribute}:${value}`;
    }
  }
  return undefined;
}

export function isRingMqttEventSelect(
  hass: HomeAssistant,
  entityId: string,
): boolean {
  if (!entityId.startsWith("select.")) return false;
  const source = resolveEntitySource(hass, "recording", entityId);
  if (source.provider !== "mqtt") return false;
  const uniqueId = source.registry?.unique_id?.toLowerCase();
  const originalName = source.registry?.original_name?.trim().toLowerCase();
  return uniqueId?.endsWith("_event_select") === true
    || originalName === "event select"
    || "recordingUrl" in (source.entity?.attributes ?? {})
    || "eventId" in (source.entity?.attributes ?? {});
}

function available(hass: HomeAssistant, entityId?: string): entityId is string {
  if (!entityId) return false;
  const state = hass.states[entityId]?.state;
  return state !== undefined && state !== "unavailable" && state !== "unknown";
}

export function recordingPosterEntityId(
  hass: HomeAssistant,
  config: NormalizedConfig,
): string {
  if (config.recording_entity.startsWith("camera.")) {
    return config.recording_entity;
  }
  if (available(hass, config.snapshot_entity)) return config.snapshot_entity;
  if (available(hass, config.live_entity)) return config.live_entity;
  return config.live_entity;
}
