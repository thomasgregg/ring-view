import type { CameraMode, NormalizedConfig } from "../types";

const PREFIX = "ring-view:mode:";

export function storageKey(config: NormalizedConfig): string {
  return `${PREFIX}${config.recording_entity}|${config.live_entity}`;
}

export function loadMode(config: NormalizedConfig): CameraMode {
  if (!config.remember_last_mode) return config.default_mode;

  try {
    const saved = window.localStorage.getItem(storageKey(config));
    return saved === "live" || saved === "last_recording"
      ? saved
      : config.default_mode;
  } catch {
    return config.default_mode;
  }
}

export function saveMode(config: NormalizedConfig, mode: CameraMode): void {
  if (!config.remember_last_mode) return;

  try {
    window.localStorage.setItem(storageKey(config), mode);
  } catch {
    // Storage can be unavailable in private or hardened browser contexts.
  }
}
