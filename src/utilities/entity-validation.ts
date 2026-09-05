import { localize } from "../localize";
import type { HassEntity, HomeAssistant, NormalizedConfig } from "../types";

export const CAMERA_STREAM_FEATURE = 2;

export function entityIsUnavailable(entity?: HassEntity): boolean {
  return !entity || entity.state === "unavailable" || entity.state === "unknown";
}

export function supportsStream(entity?: HassEntity): boolean {
  const features = Number(entity?.attributes.supported_features ?? 0);
  return (features & CAMERA_STREAM_FEATURE) !== 0;
}

export function recordingHasMedia(entity?: HassEntity): boolean {
  return Boolean(
    entity?.attributes.video_url || entity?.attributes.entity_picture,
  );
}

export interface EntityWarning {
  kind: "recording" | "live" | "compatibility";
  message: string;
}

export function validateEntities(
  hass: HomeAssistant | undefined,
  config: NormalizedConfig | undefined,
): EntityWarning[] {
  if (!hass || !config) return [];
  const recording = hass.states[config.recording_entity];
  const live = hass.states[config.live_entity];
  const warnings: EntityWarning[] = [];

  if (entityIsUnavailable(recording)) {
    warnings.push({
      kind: "recording",
      message: localize(hass, "warning.unavailable", {
        name: friendlyName(recording, config.recording_entity),
      }),
    });
  } else if (!recordingHasMedia(recording)) {
    warnings.push({
      kind: "recording",
      message: localize(hass, "warning.recording_media"),
    });
  }

  if (entityIsUnavailable(live)) {
    warnings.push({
      kind: "live",
      message: localize(hass, "warning.unavailable", {
        name: friendlyName(live, config.live_entity),
      }),
    });
  } else if (!supportsStream(live)) {
    warnings.push({
      kind: "live",
      message: localize(hass, "warning.live_stream"),
    });
  }

  if (!customElements.get("ha-camera-stream")) {
    warnings.push({
      kind: "compatibility",
      message: localize(hass, "warning.compatibility"),
    });
  }

  return warnings;
}

export function friendlyName(entity: HassEntity | undefined, fallback: string): string {
  return entity?.attributes.friendly_name || fallback;
}
