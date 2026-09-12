import type {
  CameraMode,
  HassEntity,
  HomeAssistant,
  NormalizedConfig,
  PreviewFallback,
} from "../types";
import { entityIsUnavailable } from "./entity-validation";
import {
  recordingPosterEntityId,
  recordingSourceMarker,
} from "./recording-source";

const CAPTURE_TIMESTAMP_ATTRIBUTES = [
  "timestamp",
  "capture_timestamp",
  "captured_at",
  "recorded_at",
  "last_recording_at",
  "recording_timestamp",
] as const;

export function parseCaptureTimestamp(value: unknown): number | undefined {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value <= 0) return undefined;
    return value < 1_000_000_000_000 ? value * 1_000 : value;
  }
  if (typeof value !== "string" || value.trim() === "") return undefined;

  const numeric = Number(value);
  if (Number.isFinite(numeric) && numeric > 0) {
    return numeric < 1_000_000_000_000 ? numeric * 1_000 : numeric;
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function captureTimestamp(entity?: HassEntity): number | undefined {
  if (!entity) return undefined;
  for (const attribute of CAPTURE_TIMESTAMP_ATTRIBUTES) {
    const parsed = parseCaptureTimestamp(entity.attributes[attribute]);
    if (parsed !== undefined) return parsed;
  }
  return undefined;
}

export function recordingMediaMarker(entity?: HassEntity): string | undefined {
  return recordingSourceMarker(entity);
}

function previewRecordingEntityId(
  hass: HomeAssistant,
  config: NormalizedConfig,
): string {
  return recordingPosterEntityId(hass, config);
}

function freshestEntityId(
  hass: HomeAssistant,
  config: NormalizedConfig,
  latestObservedSource?: PreviewFallback,
): string {
  const recordingId = config.recording_entity;
  const snapshotId = config.snapshot_entity;
  if (!snapshotId) return previewRecordingEntityId(hass, config);

  const recording = hass.states[recordingId];
  const snapshot = hass.states[snapshotId];
  const recordingAvailable = !entityIsUnavailable(recording);
  const snapshotAvailable = !entityIsUnavailable(snapshot);
  if (recordingAvailable && !snapshotAvailable) {
    return previewRecordingEntityId(hass, config);
  }
  if (snapshotAvailable && !recordingAvailable) return snapshotId;

  if (recordingAvailable && snapshotAvailable) {
    const recordingTimestamp = captureTimestamp(recording);
    const snapshotTimestamp = captureTimestamp(snapshot);
    if (
      recordingTimestamp !== undefined
      && snapshotTimestamp !== undefined
    ) {
      if (recordingTimestamp !== snapshotTimestamp) {
        return snapshotTimestamp > recordingTimestamp
          ? snapshotId
          : previewRecordingEntityId(hass, config);
      }
      return config.preview_fallback === "snapshot"
        ? snapshotId
        : previewRecordingEntityId(hass, config);
    }
    if (latestObservedSource !== undefined) {
      return latestObservedSource === "snapshot"
        ? snapshotId
        : previewRecordingEntityId(hass, config);
    }
  }

  return config.preview_fallback === "snapshot"
    ? snapshotId
    : previewRecordingEntityId(hass, config);
}

export function selectPreviewEntityId(
  hass: HomeAssistant,
  config: NormalizedConfig,
  openingMode: CameraMode,
  latestObservedSource?: PreviewFallback,
): string {
  switch (config.preview_source) {
    case "live":
      return config.live_entity;
    case "snapshot":
      return config.snapshot_entity ?? previewRecordingEntityId(hass, config);
    case "newest":
      return freshestEntityId(hass, config, latestObservedSource);
    case "default":
      return openingMode === "live"
        ? config.live_entity
        : previewRecordingEntityId(hass, config);
    default:
      return previewRecordingEntityId(hass, config);
  }
}
