import { version } from "../../package.json";

// Temporary, opt-in diagnostics. No URLs, entity identifiers, error messages,
// credentials, media content, persistence or network calls enter this recorder.
const LIMIT = 200;
const TEST_DURATION_MS = 120_000;
const booleanKeys = new Set([
  "muted", "controls", "paused", "ended", "hasRecordingUrl", "restored",
  "currentAttempt", "blocked", "trusted", "userActive", "imageReady", "hidden",
  "secureContext", "pointerEvents", "connected", "recordingFailed",
]);
const numberKeys = new Set([
  "readyState", "networkState", "mediaError", "time", "duration", "seekableRanges",
  "width", "height", "opacity", "xPercent", "yPercent", "videos", "images",
  "volume", "attempt", "viewportWidth", "viewportHeight",
]);
const stringValues = new Set([
  "live", "last_recording", "idle", "awaiting-resume", "playback-blocked", "pending",
  "retrying", "ready", "error", "compatibility", "mp4", "native", "poster",
  "NotAllowedError", "AbortError", "NotSupportedError", "SecurityError", "NetworkError",
  "UnknownError", "media-element-error", "play-rejected", "muted-play-rejected",
  "none", "pointerdown", "click", "loadedmetadata", "canplay", "play", "playing",
  "pause", "volumechange", "seeking", "seeked", "waiting", "stalled", "ended",
  "portrait", "landscape", "closed", "sample", "manual", "expired",
]);
const stringKeys = new Set(["mode", "status", "player", "errorName", "reason", "event", "orientation"]);
type Value = boolean | number | string;
type Entry = { ms: number; event: string; data: Record<string, Value> };
type ViewerContext = {
  mode: "live" | "last_recording";
  status: string;
  hasRecordingUrl: boolean;
  recordingFailed: boolean;
};
const eventNames = new Set([
  "test-start", "test-stop", "viewer-open", "viewer-close", "viewer-state",
  "media-event", "viewer-tap", "play-attempt", "play-resolved", "play-rejected",
  "recording-fallback", "native-click-guard", "visibility",
]);

let enabled = false;
let started = 0;
let dropped = 0;
let entries: Entry[] = [];
let expiry: number | undefined;
const cleanups = new Set<() => void>();
const subscribers = new Set<() => void>();

function notify(): void {
  for (const callback of subscribers) {
    try { callback(); } catch { /* Diagnostics must never affect playback. */ }
  }
}

export function subscribeDiagnostics(callback: () => void): () => void {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

export function diagnosticsActive(): boolean { return enabled; }
export function diagnosticsHaveEvents(): boolean { return entries.length > 0; }

export function startDiagnostics(): void {
  stopDiagnostics();
  entries = [];
  dropped = 0;
  started = performance.now();
  enabled = true;
  recordDiagnostic("test-start", {
    secureContext: window.isSecureContext,
    viewportWidth: window.innerWidth, viewportHeight: window.innerHeight,
  });
  expiry = window.setTimeout(() => stopDiagnostics("expired"), TEST_DURATION_MS);
}

export function stopDiagnostics(reason: "manual" | "expired" = "manual"): void {
  if (!enabled) return;
  // Take one final snapshot while collection is still enabled.
  for (const cleanup of [...cleanups]) cleanup();
  recordDiagnostic("test-stop", { reason });
  enabled = false;
  window.clearTimeout(expiry);
  expiry = undefined;
  notify();
}

export function recordDiagnostic(event: string, input: Record<string, unknown> = {}): void {
  if (!enabled || !eventNames.has(event)) return;
  const data: Record<string, Value> = {};
  for (const [key, value] of Object.entries(input)) {
    if (booleanKeys.has(key) && typeof value === "boolean") data[key] = value;
    if (numberKeys.has(key) && typeof value === "number" && Number.isFinite(value)) {
      data[key] = Math.round(value * 10) / 10;
    }
    if (stringKeys.has(key) && typeof value === "string" && stringValues.has(value)) data[key] = value;
  }
  if (entries.length >= LIMIT) { entries.splice(1, 1); dropped++; }
  entries.push({ ms: Math.round(performance.now() - started), event, data });
  notify();
}

export function safePlaybackError(error: unknown): string {
  const name = error instanceof Error || error instanceof DOMException ? error.name : undefined;
  return name && ["NotAllowedError", "AbortError", "NotSupportedError", "SecurityError", "NetworkError"].includes(name)
    ? name : "UnknownError";
}

export function videoDiagnostic(video: HTMLVideoElement): Record<string, unknown> {
  return {
    controls: video.controls, muted: video.muted, paused: video.paused, ended: video.ended,
    readyState: video.readyState, networkState: video.networkState, mediaError: video.error?.code ?? 0,
    time: video.currentTime, duration: video.duration, seekableRanges: video.seekable.length,
    volume: video.volume, connected: video.isConnected,
  };
}

function mediaElements(root: ShadowRoot): Element[] {
  const found: Element[] = [];
  // Only traverse the viewer's own media subtree, never the HA application.
  for (const element of root.querySelectorAll("*")) {
    if (element.matches("video, img")) found.push(element);
    if (element.shadowRoot) found.push(...mediaElements(element.shadowRoot));
  }
  return found;
}

export function watchDiagnosticViewer(host: HTMLElement, context: () => ViewerContext): () => void {
  if (!enabled || !host.shadowRoot) return () => undefined;
  const root = host.shadowRoot;
  let last = "";
  let disposed = false;
  const sample = (reason: "sample" | "closed" = "sample") => {
    const media = mediaElements(root);
    const videos = media.filter((element): element is HTMLVideoElement => element instanceof HTMLVideoElement);
    const images = media.filter((element): element is HTMLImageElement => element instanceof HTMLImageElement);
    const video = videos[0];
    const frame = root.querySelector(".media-frame");
    const rect = (video ?? frame)?.getBoundingClientRect();
    const style = video ? getComputedStyle(video) : undefined;
    const data = {
      ...context(), reason, player: root.querySelector(".video-fallback") ? "mp4"
        : root.querySelector("ring-view-native-camera-adapter") ? "native" : "poster",
      videos: videos.length, images: images.length,
      imageReady: images.some((image) => image.complete && image.naturalWidth > 0),
      ...(video ? videoDiagnostic(video) : {}), width: rect?.width, height: rect?.height,
      opacity: style ? Number(style.opacity) : undefined, pointerEvents: style?.pointerEvents !== "none",
      hidden: document.hidden, orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
    };
    const key = JSON.stringify(data);
    if (key !== last) { recordDiagnostic("viewer-state", data); last = key; }
  };
  const guardedSample = (reason: "sample" | "closed" = "sample") => {
    try { sample(reason); } catch { /* Read-only introspection is best effort. */ }
  };
  const onMedia = (event: Event) => {
    if (event.composedPath().some((node) => node instanceof HTMLVideoElement)) {
      recordDiagnostic("media-event", { event: event.type });
      guardedSample();
    }
  };
  const onTap = (event: Event) => {
    if (!(event instanceof MouseEvent)) return;
    const frame = root.querySelector(".media-frame");
    if (!frame || !event.composedPath().includes(frame)) return;
    const rect = frame.getBoundingClientRect();
    recordDiagnostic("viewer-tap", {
      event: event.type, trusted: event.isTrusted,
      xPercent: rect.width ? (event.clientX - rect.left) / rect.width * 100 : 0,
      yPercent: rect.height ? (event.clientY - rect.top) / rect.height * 100 : 0,
    });
    guardedSample();
  };
  const onVisibility = () => { recordDiagnostic("visibility", { hidden: document.hidden }); guardedSample(); };
  const events = ["loadedmetadata", "canplay", "play", "playing", "pause", "volumechange", "seeking", "seeked", "waiting", "stalled", "ended", "error"];
  events.forEach((event) => root.addEventListener(event, onMedia, { capture: true, passive: true }));
  root.addEventListener("pointerdown", onTap, { capture: true, passive: true });
  root.addEventListener("click", onTap, { capture: true, passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  const timer = window.setInterval(guardedSample, 1_000);
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    guardedSample();
    window.clearInterval(timer);
    events.forEach((event) => root.removeEventListener(event, onMedia, true));
    root.removeEventListener("pointerdown", onTap, true);
    root.removeEventListener("click", onTap, true);
    document.removeEventListener("visibilitychange", onVisibility);
    cleanups.delete(cleanup);
  };
  cleanups.add(cleanup);
  guardedSample();
  return cleanup;
}

export function diagnosticReport(): string {
  return JSON.stringify({
    report: "Ring View playback diagnostic", version, active: enabled, dropped,
    note: "Native control visibility is not exposed by the browser; a controls=true value alone does not prove controls are visible or tappable. No URLs, credentials or media included. Report is memory-only and is lost on a full page reload.",
    events: entries,
  }, null, 2);
}
