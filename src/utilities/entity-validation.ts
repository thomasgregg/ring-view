import { localize } from "../localize";
import type { HassEntity, HomeAssistant, NormalizedConfig } from "../types";
import { resolveActivityTimestamp } from "./activity-time";
import { resolveEntitySource } from "./entity-sources";
import { recordingUrl } from "./recording-source";

export const CAMERA_STREAM_FEATURE = 2;
export const LOCK_OPEN_FEATURE = 1;

export function entityIsUnavailable(entity?: HassEntity): boolean {
  return !entity || entity.state === "unavailable" || entity.state === "unknown";
}

export function supportsStream(entity?: HassEntity): boolean {
  const features = Number(entity?.attributes.supported_features ?? 0);
  return (features & CAMERA_STREAM_FEATURE) !== 0;
}

export function supportsRingTalkback(
  hass: HomeAssistant,
  entityId: string,
): boolean {
  return (
    resolveEntitySource(hass, "live", entityId).provider === "official_ring"
    && supportsStream(hass.states[entityId])
  );
}

export function supportsLockOpen(entity?: HassEntity): boolean {
  const features = Number(entity?.attributes.supported_features ?? 0);
  return (features & LOCK_OPEN_FEATURE) !== 0;
}

export function recordingHasMedia(entity?: HassEntity): boolean {
  return Boolean(
    recordingUrl(entity) || entity?.attributes.entity_picture,
  );
}

export interface EntityWarning {
  kind:
    | "recording"
    | "live"
    | "snapshot"
    | "last_activity"
    | "doorbell"
    | "door"
    | "door_contact"
    | "talkback"
    | "compatibility";
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
  } else if (
    config.two_way_audio
    && !supportsRingTalkback(hass, config.live_entity)
  ) {
    warnings.push({
      kind: "talkback",
      message: localize(hass, "warning.talkback_unsupported"),
    });
  }

  if (
    config.snapshot_entity
    && ["snapshot", "newest"].includes(config.preview_source)
  ) {
    const snapshot = hass.states[config.snapshot_entity];
    if (entityIsUnavailable(snapshot)) {
      warnings.push({
        kind: "snapshot",
        message: localize(hass, "warning.unavailable", {
          name: friendlyName(snapshot, config.snapshot_entity),
        }),
      });
    }
  } else if (["snapshot", "newest"].includes(config.preview_source)) {
    warnings.push({
      kind: "snapshot",
      message: localize(hass, "warning.snapshot_required"),
    });
  }

  if (config.last_activity_entity) {
    const activity = hass.states[config.last_activity_entity];
    if (entityIsUnavailable(activity)) {
      warnings.push({
        kind: "last_activity",
        message: localize(hass, "warning.unavailable", {
          name: friendlyName(activity, config.last_activity_entity),
        }),
      });
    } else if (
      resolveActivityTimestamp(hass, config.last_activity_entity) === undefined
    ) {
      warnings.push({
        kind: "last_activity",
        message: localize(hass, "warning.activity_timestamp"),
      });
    }
  }

  if (config.doorbell_entity) {
    const doorbell = hass.states[config.doorbell_entity];
    if (entityIsUnavailable(doorbell)) {
      warnings.push({
        kind: "doorbell",
        message: localize(hass, "warning.unavailable", {
          name: friendlyName(doorbell, config.doorbell_entity),
        }),
      });
    } else if (
      Array.isArray(doorbell?.attributes.event_types)
      && !doorbell.attributes.event_types.includes("ring")
    ) {
      warnings.push({
        kind: "doorbell",
        message: localize(hass, "warning.doorbell_event"),
      });
    }
  }

  if (config.door_entity) {
    const door = hass.states[config.door_entity];
    if (entityIsUnavailable(door)) {
      warnings.push({
        kind: "door",
        message: localize(hass, "warning.unavailable", {
          name: friendlyName(door, config.door_entity),
        }),
      });
    } else if (config.door_action === "open" && !supportsLockOpen(door)) {
      warnings.push({
        kind: "door",
        message: localize(hass, "warning.door_open_unsupported"),
      });
    }
  }

  if (config.door_contact_entity) {
    const contact = hass.states[config.door_contact_entity];
    if (entityIsUnavailable(contact)) {
      warnings.push({
        kind: "door_contact",
        message: localize(hass, "warning.unavailable", {
          name: friendlyName(contact, config.door_contact_entity),
        }),
      });
    }
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
