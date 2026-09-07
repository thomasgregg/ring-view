import { version } from "../../package.json";
import type { LitElement, ReactiveController } from "lit";
import { recordingFingerprint, sourceFingerprint, sourceTiming } from "./source";

// Temporary, opt-in diagnostics. No raw URLs, IDs, error messages, credentials
// or media enter the report. No persistence or diagnostic network calls.
const LIMIT = 200;
const TEST_DURATION_MS = 120_000;
const booleanKeys = new Set([
  "muted", "controls", "paused", "ended", "hasRecordingUrl", "restored",
  "currentAttempt", "blocked", "trusted", "userActive", "imageReady", "hidden",
  "secureContext", "pointerEvents", "connected", "recordingFailed",
  "hasCurrentSource", "assignedMatchesEntity", "currentMatchesAssigned",
  "linkNominallyExpired", "linkIssuedInFuture", "fingerprintsAvailable",
]);
const numberKeys = new Set([
  "readyState", "networkState", "mediaError", "time", "duration", "seekableRanges",
  "width", "height", "opacity", "xPercent", "yPercent", "videos", "images",
  "volume", "attempt", "viewportWidth", "viewportHeight",
  "observation", "observedMs", "linkAgeSeconds", "linkRemainingSeconds", "epochMs",
]);
const stringValues = new Set([
  "live", "last_recording", "idle", "awaiting-resume", "playback-blocked", "pending",
  "retrying", "ready", "error", "compatibility", "mp4", "native", "poster",
  "NotAllowedError", "AbortError", "NotSupportedError", "SecurityError", "NetworkError",
  "UnknownError", "media-element-error", "play-rejected", "muted-play-rejected",
  "none", "pointerdown", "click", "loadedmetadata", "canplay", "play", "playing",
  "pause", "volumechange", "seeking", "seeked", "waiting", "stalled", "ended",
  "portrait", "landscape", "closed", "sample", "manual", "expired",
  "loadstart", "emptied", "source-change",
]);
const stringKeys = new Set(["mode", "status", "player", "errorName", "reason", "event", "orientation"]);
type Value = boolean | number | string;
type Entry = { ms: number; event: string; data: Record<string, Value> };
type ViewerContext = {
  mode: "live" | "last_recording";
  status: string;
  hasRecordingUrl: boolean;
  recordingFailed: boolean;
  recordingUrl?: unknown;
  recordingId?: unknown;
};
const eventNames = new Set([
  "test-start", "test-stop", "viewer-open", "viewer-close", "viewer-state",
  "media-event", "viewer-tap", "play-attempt", "play-resolved", "play-rejected",
  "recording-fallback", "native-click-guard", "visibility",
  "recording-source", "source-fingerprints",
]);

let enabled = false;
let started = 0;
let dropped = 0;
let entries: Entry[] = [];
let expiry: number | undefined;
let generation = 0;
let observations = 0;
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
  generation++;
  observations = 0;
  enabled = true;
  recordDiagnostic("test-start", {
    secureContext: window.isSecureContext,
    viewportWidth: window.innerWidth, viewportHeight: window.innerHeight,
    epochMs: Date.now(),
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
    if (["currentSourceFingerprint", "assignedSourceFingerprint", "entitySourceFingerprint", "entityRecordingFingerprint"].includes(key)
      && typeof value === "string" && /^[a-f0-9]{64}$/.test(value)) data[key] = value;
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

export function watchDiagnosticViewer(host: LitElement, context: () => ViewerContext): () => void {
  if (!enabled) return () => undefined;
  // HA calls showDialog before appendChild. Lit creates its root before calling
  // hostConnected, so this attaches before the first render/media event.
  let root: ShadowRoot | undefined;
  let timer: number | undefined;
  let observer: MutationObserver | undefined;
  let last = "";
  let lastSource = "";
  let disposed = false;
  const observeSource = (video: HTMLVideoElement, reason: string) => {
    const { recordingUrl, recordingId } = context();
    const current = video.currentSrc;
    const assigned = video.getAttribute("src") ?? "";
    const sourceKey = JSON.stringify([current, assigned, recordingUrl, recordingId]);
    if (reason === "source-change" && sourceKey === lastSource) return;
    lastSource = sourceKey;
    if (observations >= 50) return;
    const observation = ++observations;
    const session = generation;
    const observedMs = Math.round(performance.now() - started);
    recordDiagnostic("recording-source", {
      observation, reason, hasCurrentSource: Boolean(current),
      assignedMatchesEntity: Boolean(assigned) && assigned === recordingUrl,
      currentMatchesAssigned: Boolean(current) && current === assigned,
      ...videoDiagnostic(video), ...sourceTiming(current || assigned),
    });
    // Snapshot before fallback removes the element. No promise is awaited by
    // playback, and late results cannot leak into a stopped/restarted test.
    void Promise.all([sourceFingerprint(current), sourceFingerprint(assigned),
      sourceFingerprint(recordingUrl), recordingFingerprint(recordingId)])
      .then(([currentSourceFingerprint, assignedSourceFingerprint, entitySourceFingerprint, entityRecordingFingerprint]) => {
        if (!enabled || session !== generation) return;
        recordDiagnostic("source-fingerprints", { observation, observedMs,
          fingerprintsAvailable: Boolean(assignedSourceFingerprint), currentSourceFingerprint,
          assignedSourceFingerprint, entitySourceFingerprint, entityRecordingFingerprint });
      }).catch(() => { /* Diagnostics never interrupt playback. */ });
  };
  const sample = (reason: "sample" | "closed" = "sample") => {
    if (!root) return;
    const media = mediaElements(root);
    const videos = media.filter((element): element is HTMLVideoElement => element instanceof HTMLVideoElement);
    const images = media.filter((element): element is HTMLImageElement => element instanceof HTMLImageElement);
    const video = videos[0];
    const frame = root.querySelector(".media-frame");
    const rect = (video ?? frame)?.getBoundingClientRect();
    const style = video ? getComputedStyle(video) : undefined;
    const { recordingUrl: _url, recordingId: _id, ...state } = context();
    const data = {
      ...state, reason, player: root.querySelector(".video-fallback") ? "mp4"
        : root.querySelector("ring-view-native-camera-adapter") ? "native" : "poster",
      videos: videos.length, images: images.length,
      imageReady: images.some((image) => image.complete && image.naturalWidth > 0),
      ...(video ? videoDiagnostic(video) : {}), width: rect?.width, height: rect?.height,
      opacity: style ? Number(style.opacity) : undefined, pointerEvents: style?.pointerEvents !== "none",
      hidden: document.hidden, orientation: window.innerWidth > window.innerHeight ? "landscape" : "portrait",
    };
    const key = JSON.stringify(data);
    if (key !== last) { recordDiagnostic("viewer-state", data); last = key; }
    const recording = root.querySelector<HTMLVideoElement>("video.video-fallback");
    if (recording) observeSource(recording, "source-change");
  };
  const guardedSample = (reason: "sample" | "closed" = "sample") => {
    try { sample(reason); } catch { /* Read-only introspection is best effort. */ }
  };
  const onMedia = (event: Event) => {
    if (event.composedPath().some((node) => node instanceof HTMLVideoElement)) {
      recordDiagnostic("media-event", { event: event.type });
      const video = event.composedPath().find((node) => node instanceof HTMLVideoElement) as HTMLVideoElement;
      if (video.matches(".video-fallback") && ["error", "loadedmetadata", "loadstart"].includes(event.type)) {
        try { observeSource(video, event.type); } catch { /* Best effort. */ }
      }
      guardedSample();
    }
  };
  const onTap = (event: Event) => {
    if (!(event instanceof MouseEvent)) return;
    const frame = root?.querySelector(".media-frame");
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
  const events = ["loadstart", "emptied", "loadedmetadata", "canplay", "play", "playing", "pause", "volumechange", "seeking", "seeked", "waiting", "stalled", "ended", "error"];
  const attach = () => {
    if (disposed || root || !host.shadowRoot) return;
    root = host.shadowRoot;
    events.forEach((event) => root!.addEventListener(event, onMedia, { capture: true, passive: true }));
    root.addEventListener("pointerdown", onTap, { capture: true, passive: true });
    root.addEventListener("click", onTap, { capture: true, passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    observer = new MutationObserver(() => { if (!disposed) guardedSample(); });
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    timer = window.setInterval(guardedSample, 1_000);
    guardedSample();
  };
  const controller: ReactiveController = { hostConnected: attach };
  const cleanup = () => {
    if (disposed) return;
    disposed = true;
    guardedSample();
    window.clearInterval(timer);
    observer?.disconnect();
    events.forEach((event) => root?.removeEventListener(event, onMedia, true));
    root?.removeEventListener("pointerdown", onTap, true);
    root?.removeEventListener("click", onTap, true);
    document.removeEventListener("visibilitychange", onVisibility);
    cleanups.delete(cleanup);
    host.removeController(controller);
  };
  cleanups.add(cleanup);
  host.addController(controller);
  return cleanup;
}

export function diagnosticReport(): string {
  return JSON.stringify({
    report: "Ring View playback diagnostic", version, active: enabled, dropped,
    note: "Native control visibility is not exposed by the browser; controls=true does not prove visibility or tappability. Fingerprints match source paths and the entity recording ID, not media bytes. Link timing uses the device clock and nominal signed-link expiry. No raw URLs, IDs, credentials or media included. Memory-only; lost on reload.",
    events: entries,
  }, null, 2);
}
