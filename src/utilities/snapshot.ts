import type { HomeAssistant, NormalizedConfig } from "../types";
import { entityIsUnavailable, friendlyName } from "./entity-validation";

export const DEFAULT_SNAPSHOT_DIRECTORY = "/media/ring-view";

export type SnapshotDirectoryProblem =
  | "required"
  | "absolute"
  | "root"
  | "unsafe";

export type SnapshotDirectoryWarning = "public" | "custom";

export function normalizeSnapshotDirectory(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > 1 ? trimmed.replace(/\/+$/, "") : trimmed;
}

export function snapshotDirectoryProblem(
  value: unknown,
): SnapshotDirectoryProblem | undefined {
  if (typeof value !== "string" || value.trim() === "") return "required";
  const normalized = normalizeSnapshotDirectory(value);
  if (!normalized.startsWith("/")) return "absolute";
  if (normalized === "/") return "root";
  if (
    /[\u0000-\u001f\u007f]/.test(normalized)
    || normalized.includes("{{")
    || normalized.includes("}}")
    || normalized.split("/").some((part) => part === "." || part === "..")
  ) {
    return "unsafe";
  }
  return undefined;
}

export function snapshotDirectoryWarning(
  value: string,
): SnapshotDirectoryWarning | undefined {
  const normalized = normalizeSnapshotDirectory(value);
  if (
    normalized === "/config/www"
    || normalized.startsWith("/config/www/")
  ) {
    return "public";
  }
  if (normalized === "/media" || normalized.startsWith("/media/")) {
    return undefined;
  }
  return "custom";
}

export function selectSnapshotEntityId(
  hass: HomeAssistant,
  config: NormalizedConfig,
): string | undefined {
  if (
    config.snapshot_entity
    && !entityIsUnavailable(hass.states[config.snapshot_entity])
  ) {
    return config.snapshot_entity;
  }
  return entityIsUnavailable(hass.states[config.live_entity])
    ? undefined
    : config.live_entity;
}

export function snapshotCameraSlug(
  hass: HomeAssistant,
  config: NormalizedConfig,
): string {
  const live = hass.states[config.live_entity];
  const source = config.name
    || friendlyName(live, config.live_entity.split(".", 2)[1] || "ring-camera");
  const ascii = source
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  return ascii
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    || "ring-camera";
}

function timestampPart(
  parts: Intl.DateTimeFormatPart[],
  type: Intl.DateTimeFormatPartTypes,
): string {
  return parts.find((part) => part.type === type)?.value ?? "00";
}

export function formatSnapshotTimestamp(
  date: Date,
  timeZone?: string,
): string {
  const safeDate = Number.isFinite(date.getTime()) ? date : new Date(0);
  const options: Intl.DateTimeFormatOptions = {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  };
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(safeDate);
  } catch {
    delete options.timeZone;
    parts = new Intl.DateTimeFormat("en-CA", options).formatToParts(safeDate);
  }
  const milliseconds = String(safeDate.getMilliseconds()).padStart(3, "0");
  return [
    `${timestampPart(parts, "year")}-${timestampPart(parts, "month")}-${timestampPart(parts, "day")}`,
    `${timestampPart(parts, "hour")}-${timestampPart(parts, "minute")}-${timestampPart(parts, "second")}-${milliseconds}`,
  ].join("_");
}

export function buildSnapshotFilename(
  hass: HomeAssistant,
  config: NormalizedConfig,
  date = new Date(),
): string {
  const directory = normalizeSnapshotDirectory(config.snapshot_directory);
  const timestamp = formatSnapshotTimestamp(date, hass.config?.time_zone);
  return `${directory}/${snapshotCameraSlug(hass, config)}_${timestamp}.jpg`;
}
