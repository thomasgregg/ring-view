import type {
  HassEntity,
  HassEntityRegistryEntry,
  HomeAssistant,
  NormalizedConfig,
} from "../types";

export type EntityProvider = "official_ring" | "mqtt" | "other";
export type EntitySourceRole =
  | "recording"
  | "live"
  | "snapshot"
  | "doorbell"
  | "activity";

export interface EntitySource {
  role: EntitySourceRole;
  entityId: string;
  entity?: HassEntity;
  registry?: HassEntityRegistryEntry;
  provider: EntityProvider;
  deviceId?: string;
}

export type ResolvedEntitySources = Record<"recording" | "live", EntitySource> &
  Partial<Record<"snapshot" | "doorbell" | "activity", EntitySource>>;

export function entityProvider(
  registry?: HassEntityRegistryEntry,
): EntityProvider {
  if (registry?.platform === "ring") return "official_ring";
  if (registry?.platform === "mqtt") return "mqtt";
  return "other";
}

export function resolveEntitySource(
  hass: HomeAssistant,
  role: EntitySourceRole,
  entityId: string,
): EntitySource {
  const registry = hass.entities?.[entityId];
  return {
    role,
    entityId,
    entity: hass.states[entityId],
    registry,
    provider: entityProvider(registry),
    deviceId: registry?.device_id ?? undefined,
  };
}

export function resolveEntitySources(
  hass: HomeAssistant,
  config: NormalizedConfig,
): ResolvedEntitySources {
  const sources: ResolvedEntitySources = {
    recording: resolveEntitySource(
      hass,
      "recording",
      config.recording_entity,
    ),
    live: resolveEntitySource(hass, "live", config.live_entity),
  };
  if (config.snapshot_entity) {
    sources.snapshot = resolveEntitySource(
      hass,
      "snapshot",
      config.snapshot_entity,
    );
  }
  if (config.doorbell_entity) {
    sources.doorbell = resolveEntitySource(
      hass,
      "doorbell",
      config.doorbell_entity,
    );
  }
  if (config.last_activity_entity) {
    sources.activity = resolveEntitySource(
      hass,
      "activity",
      config.last_activity_entity,
    );
  }
  return sources;
}

export function sameDeviceEntityIds(
  hass: HomeAssistant,
  anchorEntityId: string,
): string[] {
  const deviceId = hass.entities?.[anchorEntityId]?.device_id;
  if (!deviceId) return [];
  return Object.values(hass.entities ?? {})
    .filter((entry) =>
      entry.device_id === deviceId
      && entry.disabled_by == null
      && Boolean(hass.states[entry.entity_id]))
    .map((entry) => entry.entity_id)
    .sort();
}

export function findSameDeviceEntityId(
  hass: HomeAssistant,
  anchorEntityId: string,
  predicate: (
    entityId: string,
    entity: HassEntity,
    registry: HassEntityRegistryEntry,
  ) => boolean,
): string | undefined {
  const matches = sameDeviceEntityIds(hass, anchorEntityId).filter((entityId) => {
    const entity = hass.states[entityId];
    const registry = hass.entities?.[entityId];
    return Boolean(entity && registry && predicate(entityId, entity, registry));
  });
  return matches.length === 1 ? matches[0] : undefined;
}
