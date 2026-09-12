import { localize, type TranslationKey } from "./localize";
import type { NormalizedConfig, RingViewConfig } from "./types";
import {
  DEFAULT_SNAPSHOT_DIRECTORY,
  normalizeSnapshotDirectory,
  snapshotDirectoryProblem,
} from "./utilities/snapshot";

export const CARD_TYPE = "custom:ring-view";
export const CARD_TAG = "ring-view";
export const CARD_NAME = "Ring View";

const DEFAULTS = {
  default_mode: "last_recording",
  remember_last_mode: false,
  autoplay_recording: true,
  live_muted: false,
  two_way_audio: false,
  door_action: "unlock",
  door_control_visibility: "live_only",
  door_control_location: "viewer_only",
  door_hold_to_activate: true,
  dashboard_behavior: "open_viewer",
  dashboard_start: "on_demand",
  dashboard_live_muted: true,
  show_name: false,
  preview_source: "last_recording",
  preview_fallback: "last_recording",
  show_snapshot_button: false,
  snapshot_directory: DEFAULT_SNAPSHOT_DIRECTORY,
  aspect_ratio: "16:9",
  fit_mode: "cover",
} as const;

const CAMERA_MODES = new Set(["last_recording", "live"]);
const PREVIEW_SOURCES = new Set([
  "last_recording",
  "live",
  "default",
  "snapshot",
  "newest",
]);
const PREVIEW_FALLBACKS = new Set(["last_recording", "snapshot"]);
const ASPECT_RATIOS = new Set(["auto", "16:9", "4:3", "1:1"]);
const FIT_MODES = new Set(["cover", "contain"]);
const DOOR_ACTIONS = new Set(["unlock", "open"]);
const DOOR_CONTROL_VISIBILITIES = new Set(["live_only", "all_views"]);
const DOOR_CONTROL_LOCATIONS = new Set([
  "viewer_only",
  "dashboard_and_viewer",
]);
const DASHBOARD_BEHAVIORS = new Set(["open_viewer", "interactive"]);
const DASHBOARD_STARTS = new Set(["on_demand", "last_recording", "live"]);

function assertCameraEntity(
  value: unknown,
  labelKey: TranslationKey,
): asserts value is string {
  if (typeof value !== "string" || !value.startsWith("camera.")) {
    throw new Error(
      localize(undefined, "config.entity_required", {
        label: localize(undefined, labelKey),
      }),
    );
  }
}

export function validateConfig(config: RingViewConfig): void {
  if (!config || typeof config !== "object") {
    throw new Error(localize(undefined, "config.invalid"));
  }
  assertCameraEntity(config.recording_entity, "config.recording_entity");
  assertCameraEntity(config.live_entity, "config.live_entity");
  if (config.snapshot_entity !== undefined && config.snapshot_entity !== "") {
    assertCameraEntity(config.snapshot_entity, "config.snapshot_entity");
  }
  if (
    config.last_activity_entity !== undefined
    && config.last_activity_entity !== ""
    && (typeof config.last_activity_entity !== "string"
      || !/^[a-z0-9_]+\.[a-z0-9_]+$/i.test(config.last_activity_entity))
  ) {
    throw new Error(localize(undefined, "config.last_activity_entity"));
  }

  if (config.default_mode && !CAMERA_MODES.has(config.default_mode)) {
    throw new Error(localize(undefined, "config.default_mode"));
  }
  if (config.preview_source && !PREVIEW_SOURCES.has(config.preview_source)) {
    throw new Error(localize(undefined, "config.preview_source"));
  }
  if (
    config.preview_fallback
    && !PREVIEW_FALLBACKS.has(config.preview_fallback)
  ) {
    throw new Error(localize(undefined, "config.preview_fallback"));
  }
  if (config.snapshot_directory !== undefined) {
    const problem = snapshotDirectoryProblem(config.snapshot_directory);
    if (problem) {
      throw new Error(
        localize(undefined, `config.snapshot_directory_${problem}`),
      );
    }
  }
  if (config.aspect_ratio && !ASPECT_RATIOS.has(config.aspect_ratio)) {
    throw new Error(localize(undefined, "config.aspect_ratio"));
  }
  if (config.fit_mode && !FIT_MODES.has(config.fit_mode)) {
    throw new Error(localize(undefined, "config.fit_mode"));
  }
  if (
    config.doorbell_entity !== undefined
    && config.doorbell_entity !== ""
    && (typeof config.doorbell_entity !== "string"
      || !config.doorbell_entity.startsWith("event."))
  ) {
    throw new Error(localize(undefined, "config.doorbell_entity"));
  }
  if (
    config.door_entity !== undefined
    && config.door_entity !== ""
    && (typeof config.door_entity !== "string"
      || !config.door_entity.startsWith("lock."))
  ) {
    throw new Error(localize(undefined, "config.door_entity"));
  }
  if (
    config.door_contact_entity !== undefined
    && config.door_contact_entity !== ""
    && (typeof config.door_contact_entity !== "string"
      || !config.door_contact_entity.startsWith("binary_sensor."))
  ) {
    throw new Error(localize(undefined, "config.door_contact_entity"));
  }
  if (config.door_action && !DOOR_ACTIONS.has(config.door_action)) {
    throw new Error(localize(undefined, "config.door_action"));
  }
  if (
    config.door_control_visibility
    && !DOOR_CONTROL_VISIBILITIES.has(config.door_control_visibility)
  ) {
    throw new Error(localize(undefined, "config.door_control_visibility"));
  }
  if (
    config.door_control_location
    && !DOOR_CONTROL_LOCATIONS.has(config.door_control_location)
  ) {
    throw new Error(localize(undefined, "config.door_control_location"));
  }
  if (
    config.dashboard_behavior
    && !DASHBOARD_BEHAVIORS.has(config.dashboard_behavior)
  ) {
    throw new Error(localize(undefined, "config.dashboard_behavior"));
  }
  if (config.dashboard_start && !DASHBOARD_STARTS.has(config.dashboard_start)) {
    throw new Error(localize(undefined, "config.dashboard_start"));
  }
}

export function normalizeConfig(config: RingViewConfig): NormalizedConfig {
  validateConfig(config);
  return {
    type: config.type ?? CARD_TYPE,
    recording_entity: config.recording_entity,
    live_entity: config.live_entity,
    snapshot_entity: config.snapshot_entity || undefined,
    last_activity_entity: config.last_activity_entity || undefined,
    name: config.name,
    default_mode: config.default_mode ?? DEFAULTS.default_mode,
    remember_last_mode:
      config.remember_last_mode ?? DEFAULTS.remember_last_mode,
    autoplay_recording:
      config.autoplay_recording ?? DEFAULTS.autoplay_recording,
    live_muted: config.live_muted ?? DEFAULTS.live_muted,
    two_way_audio: config.two_way_audio ?? DEFAULTS.two_way_audio,
    doorbell_entity: config.doorbell_entity || undefined,
    door_entity: config.door_entity || undefined,
    door_contact_entity: config.door_contact_entity || undefined,
    door_action: config.door_action ?? DEFAULTS.door_action,
    door_control_visibility:
      config.door_control_visibility ?? DEFAULTS.door_control_visibility,
    door_control_location:
      config.door_control_location ?? DEFAULTS.door_control_location,
    door_hold_to_activate:
      config.door_hold_to_activate ?? DEFAULTS.door_hold_to_activate,
    dashboard_behavior:
      config.dashboard_behavior ?? DEFAULTS.dashboard_behavior,
    dashboard_start: config.dashboard_start ?? DEFAULTS.dashboard_start,
    dashboard_live_muted:
      config.dashboard_live_muted ?? DEFAULTS.dashboard_live_muted,
    show_name: config.show_name ?? DEFAULTS.show_name,
    preview_source: config.preview_source ?? DEFAULTS.preview_source,
    preview_fallback: config.preview_fallback ?? DEFAULTS.preview_fallback,
    show_snapshot_button:
      config.show_snapshot_button ?? DEFAULTS.show_snapshot_button,
    snapshot_directory: normalizeSnapshotDirectory(
      config.snapshot_directory ?? DEFAULTS.snapshot_directory,
    ),
    aspect_ratio: config.aspect_ratio ?? DEFAULTS.aspect_ratio,
    fit_mode: config.fit_mode ?? DEFAULTS.fit_mode,
    grid_options: config.grid_options,
  };
}

export function aspectRatioNumber(
  ratio: NormalizedConfig["aspect_ratio"],
): number | undefined {
  switch (ratio) {
    case "16:9":
      return 16 / 9;
    case "4:3":
      return 4 / 3;
    case "1:1":
      return 1;
    default:
      return undefined;
  }
}

export function aspectRatioCss(
  ratio: NormalizedConfig["aspect_ratio"],
): string {
  return ratio === "auto" ? "16 / 9" : ratio.replace(":", " / ");
}
