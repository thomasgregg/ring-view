import type {
  HassEntity,
  HomeAssistant,
  NormalizedConfig,
} from "../types";
import { parseTimestampValue } from "./activity-time";
import {
  resolveEntitySource,
  sameDeviceEntityIds,
} from "./entity-sources";

const RECORDING_URL_ATTRIBUTES = [
  "video_url",
  "recordingUrl",
  "recording_url",
] as const;
const RECORDING_EVENT_ID_ATTRIBUTES = [
  "eventId",
  "event_id",
  "last_video_id",
] as const;
const MINIMUM_SIGNED_URL_LIFETIME_MS = 30_000;

type RingRecordingCategory = "ding" | "motion" | "person" | "on_demand";

export interface RingMqttRecordingSelection {
  option: string;
  marker: string;
  recordingReady: boolean;
}

interface RingActivityCandidate {
  category: RingRecordingCategory;
  timestamp: number;
  recordingReady: boolean;
}

const CATEGORY_OPTION_LABELS: Record<RingRecordingCategory, string> = {
  ding: "Ding",
  motion: "Motion",
  person: "Person",
  on_demand: "On-demand",
};

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

/**
 * Return a compact revision for the still frame associated with a recording.
 * Camera entity_picture URLs normally keep the same access token across Ring
 * events, so the event ID must participate in the rendered URL to make the
 * browser request the new frame.
 */
export function recordingPosterRevision(entity?: HassEntity): string | undefined {
  if (!entity) return undefined;
  for (const attribute of RECORDING_EVENT_ID_ATTRIBUTES) {
    const value = entity.attributes[attribute];
    if (typeof value === "string" && value.trim() !== "") {
      return `${attribute}:${value.trim()}`;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return `${attribute}:${String(value)}`;
    }
  }
  return entity.last_updated ? `updated:${entity.last_updated}` : undefined;
}

export function transcodedRecordingOption(entity?: HassEntity): string | undefined {
  const selected = entity?.state.trim();
  const options = entity?.attributes.options;
  if (!selected || /\s\(transcoded\)$/i.test(selected) || !Array.isArray(options)) {
    return undefined;
  }

  const candidate = `${selected} (Transcoded)`.toLowerCase();
  const match = options.find(
    (option): option is string =>
      typeof option === "string" && option.toLowerCase() === candidate,
  );
  return match;
}

function ringRecordingCategory(value: unknown): RingRecordingCategory | undefined {
  if (typeof value !== "string") return undefined;
  switch (value.trim().toLowerCase().replace(/[\s-]+/g, "_")) {
    case "ding":
    case "ring":
    case "doorbell":
      return "ding";
    case "motion":
      return "motion";
    case "person":
      return "person";
    case "on_demand":
    case "ondemand":
      return "on_demand";
    default:
      return undefined;
  }
}

function activityStateTimestamp(entity: HassEntity): number | undefined {
  for (const value of [
    entity.attributes.created_at,
    entity.attributes.timestamp,
    entity.attributes.event_timestamp,
    entity.state,
  ]) {
    const parsed = parseTimestampValue(value);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

function activityCandidates(entity?: HassEntity): RingActivityCandidate[] {
  if (!entity || entity.state === "unknown" || entity.state === "unavailable") {
    return [];
  }
  const candidates: RingActivityCandidate[] = [];
  const directCategory = ringRecordingCategory(
    entity.attributes.category
      ?? entity.attributes.event_type
      ?? entity.attributes.eventType,
  );
  const directTimestamp = activityStateTimestamp(entity);
  if (directCategory && directTimestamp !== undefined) {
    const status = entity.attributes.recording_status;
    candidates.push({
      category: directCategory,
      timestamp: directTimestamp,
      recordingReady: typeof status !== "string"
        || status.trim().toLowerCase() === "ready",
    });
  }

  const dingTimestamp = parseTimestampValue(
    entity.attributes.lastDingTime ?? entity.attributes.lastDing,
  );
  if (dingTimestamp !== undefined) {
    candidates.push({
      category: "ding",
      timestamp: dingTimestamp,
      recordingReady: true,
    });
  }
  const motionTimestamp = parseTimestampValue(
    entity.attributes.lastMotionTime ?? entity.attributes.lastMotion,
  );
  if (motionTimestamp !== undefined) {
    candidates.push({
      category: entity.attributes.personDetected === true ? "person" : "motion",
      timestamp: motionTimestamp,
      recordingReady: true,
    });
  }
  return candidates;
}

function newestRingActivity(
  hass: HomeAssistant,
  activityEntityId: string,
): RingActivityCandidate | undefined {
  const entityIds = new Set([
    activityEntityId,
    ...sameDeviceEntityIds(hass, activityEntityId),
  ]);
  const candidates = [...entityIds].flatMap((entityId) =>
    activityCandidates(hass.states[entityId])
  );
  return candidates.reduce<RingActivityCandidate | undefined>(
    (latest, candidate) =>
      latest === undefined || candidate.timestamp > latest.timestamp
        ? candidate
        : latest,
    undefined,
  );
}

/**
 * Resolve the Event Select option representing the newest Ring activity.
 * Ring-MQTT numbers each category independently, so the latest activity's
 * category selects slot 1 while the timestamp provides a stable refresh key.
 */
export function newestRingMqttRecordingSelection(
  hass: HomeAssistant,
  activityEntityId: string | undefined,
  selectEntity: HassEntity | undefined,
  preferTranscoded = false,
): RingMqttRecordingSelection | undefined {
  if (!activityEntityId || !selectEntity) return undefined;
  const activity = newestRingActivity(hass, activityEntityId);
  const options = selectEntity.attributes.options;
  if (!activity || !Array.isArray(options)) return undefined;

  const base = `${CATEGORY_OPTION_LABELS[activity.category]} 1`;
  const direct = options.find(
    (option): option is string =>
      typeof option === "string" && option.toLowerCase() === base.toLowerCase(),
  );
  const transcoded = options.find(
    (option): option is string =>
      typeof option === "string"
      && option.toLowerCase() === `${base} (transcoded)`.toLowerCase(),
  );
  const option = preferTranscoded
    ? transcoded ?? direct
    : direct ?? transcoded;
  if (!option) return undefined;
  return {
    option,
    marker: `${activity.category}:${String(activity.timestamp)}`,
    recordingReady: activity.recordingReady,
  };
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
