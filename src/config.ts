import type {
  CameraMode,
  NormalizedConfig,
  RingViewConfig,
} from "./types";

export const CARD_TYPE = "custom:ring-view";
export const CARD_TAG = "ring-view";
export const CARD_NAME = "Ring View";

const DEFAULTS = {
  default_mode: "last_recording",
  remember_last_mode: false,
  autoplay_recording: true,
  preview: {
    source: "last_recording",
    show_name: false,
    show_mode_badge: true,
  },
  appearance: {
    aspect_ratio: "16:9",
    fit_mode: "cover",
  },
  viewer: {
    show_controls: true,
    live_muted: false,
    close_on_escape: true,
  },
  performance: {
    suspend_when_hidden: true,
    live_timeout_seconds: 20,
    retry_live_once: true,
    debug: false,
  },
} as const;

const CAMERA_MODES = new Set(["last_recording", "live"]);
const PREVIEW_SOURCES = new Set(["last_recording", "live", "default"]);
const ASPECT_RATIOS = new Set(["auto", "16:9", "4:3", "1:1"]);
const FIT_MODES = new Set(["cover", "contain", "fill"]);

function assertCameraEntity(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || !value.startsWith("camera.")) {
    throw new Error(`${label} must be a camera entity.`);
  }
}

export function validateConfig(config: RingViewConfig): void {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid card configuration.");
  }
  assertCameraEntity(config.recording_entity, "Last recording entity");
  assertCameraEntity(config.live_entity, "Live camera entity");

  if (config.default_mode && !CAMERA_MODES.has(config.default_mode)) {
    throw new Error("default_mode must be last_recording or live.");
  }
  if (config.preview?.source && !PREVIEW_SOURCES.has(config.preview.source)) {
    throw new Error("preview.source is invalid.");
  }
  if (
    config.appearance?.aspect_ratio &&
    !ASPECT_RATIOS.has(config.appearance.aspect_ratio)
  ) {
    throw new Error("appearance.aspect_ratio is invalid.");
  }
  if (
    config.appearance?.fit_mode &&
    !FIT_MODES.has(config.appearance.fit_mode)
  ) {
    throw new Error("appearance.fit_mode is invalid.");
  }
  const timeout = config.performance?.live_timeout_seconds;
  if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 10 || timeout > 60)) {
    throw new Error("performance.live_timeout_seconds must be between 10 and 60.");
  }
}

export function normalizeConfig(
  config: RingViewConfig,
): NormalizedConfig {
  validateConfig(config);
  return {
    type: config.type ?? CARD_TYPE,
    recording_entity: config.recording_entity,
    live_entity: config.live_entity,
    name: config.name,
    default_mode: config.default_mode ?? DEFAULTS.default_mode,
    remember_last_mode:
      config.remember_last_mode ?? DEFAULTS.remember_last_mode,
    autoplay_recording:
      config.autoplay_recording ?? DEFAULTS.autoplay_recording,
    preview: { ...DEFAULTS.preview, ...config.preview },
    appearance: {
      aspect_ratio:
        config.appearance?.aspect_ratio ?? DEFAULTS.appearance.aspect_ratio,
      fit_mode: config.appearance?.fit_mode ?? DEFAULTS.appearance.fit_mode,
    },
    viewer: {
      show_controls:
        config.viewer?.show_controls ?? DEFAULTS.viewer.show_controls,
      live_muted: config.viewer?.live_muted ?? DEFAULTS.viewer.live_muted,
      close_on_escape:
        config.viewer?.close_on_escape ?? DEFAULTS.viewer.close_on_escape,
    },
    performance: { ...DEFAULTS.performance, ...config.performance },
    grid_options: config.grid_options,
  };
}

export function initialMode(config: NormalizedConfig): CameraMode {
  return config.default_mode;
}

export function aspectRatioNumber(
  ratio: NormalizedConfig["appearance"]["aspect_ratio"],
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
  ratio: NormalizedConfig["appearance"]["aspect_ratio"],
): string {
  return ratio === "auto" ? "16 / 9" : ratio.replace(":", " / ");
}
