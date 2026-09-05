import { localize, type TranslationKey } from "./localize";
import type { CameraMode, NormalizedConfig, RingViewConfig } from "./types";

export const CARD_TYPE = "custom:ring-view";
export const CARD_TAG = "ring-view";
export const CARD_NAME = "Ring View";

const DEFAULTS = {
  default_mode: "last_recording",
  live_muted: false,
  show_name: false,
  aspect_ratio: "16:9",
  fit_mode: "cover",
} as const;

const CAMERA_MODES = new Set(["last_recording", "live"]);
const ASPECT_RATIOS = new Set(["auto", "16:9", "4:3", "1:1"]);
const FIT_MODES = new Set(["cover", "contain"]);

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

  if (config.default_mode && !CAMERA_MODES.has(config.default_mode)) {
    throw new Error(localize(undefined, "config.default_mode"));
  }
  if (config.aspect_ratio && !ASPECT_RATIOS.has(config.aspect_ratio)) {
    throw new Error(localize(undefined, "config.aspect_ratio"));
  }
  if (config.fit_mode && !FIT_MODES.has(config.fit_mode)) {
    throw new Error(localize(undefined, "config.fit_mode"));
  }
}

export function normalizeConfig(config: RingViewConfig): NormalizedConfig {
  validateConfig(config);
  return {
    type: config.type ?? CARD_TYPE,
    recording_entity: config.recording_entity,
    live_entity: config.live_entity,
    name: config.name,
    default_mode: config.default_mode ?? DEFAULTS.default_mode,
    live_muted: config.live_muted ?? DEFAULTS.live_muted,
    show_name: config.show_name ?? DEFAULTS.show_name,
    aspect_ratio: config.aspect_ratio ?? DEFAULTS.aspect_ratio,
    fit_mode: config.fit_mode ?? DEFAULTS.fit_mode,
    grid_options: config.grid_options,
  };
}

export function initialMode(config: NormalizedConfig): CameraMode {
  return config.default_mode;
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
