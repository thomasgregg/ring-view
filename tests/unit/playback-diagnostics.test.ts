import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";
import "../../src/ring-view-dialog";
import "../../src/diagnostics/card";
import { normalizeConfig } from "../../src/config";
import { diagnosticReport, diagnosticsActive, recordDiagnostic, safePlaybackError, startDiagnostics, stopDiagnostics, watchDiagnosticViewer } from "../../src/diagnostics/recorder";
import type { HomeAssistant } from "../../src/types";

const config = normalizeConfig({ recording_entity: "camera.recording", live_entity: "camera.live" });
const hass: HomeAssistant = {
  states: {
    "camera.recording": { entity_id: "camera.recording", state: "idle", attributes: {
      video_url: "https://secret.invalid/PRIVATE-RECORDING?token=PRIVATE-TOKEN", supported_features: 0,
    } },
    "camera.live": { entity_id: "camera.live", state: "idle", attributes: { supported_features: 2 } },
  }, hassUrl: (path = "") => path, callWS: async () => ({}) as never,
};
const flush = () => vi.advanceTimersByTimeAsync(0);
const report = () => JSON.parse(diagnosticReport());

async function mount() {
  const dialog = document.createElement("ring-view-dialog");
  dialog.hass = hass;
  dialog.showDialog({ mode: "last_recording", config });
  // Match HA's manager: showDialog runs before the new element is connected.
  document.body.append(dialog);
  await flush();
  return { dialog, video: dialog.shadowRoot!.querySelector<HTMLVideoElement>("video")! };
}

describe("temporary playback diagnostics", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stopDiagnostics();
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.stubGlobal("crypto", { subtle: { digest: vi.fn(async (_: string, bytes: Uint8Array) => createHash("sha256").update(bytes).digest()) } });
  });
  afterEach(() => {
    document.body.replaceChildren();
    stopDiagnostics();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("collects nothing before the user starts a test", async () => {
    const before = diagnosticReport();
    const { video } = await mount();
    video.dispatchEvent(new Event("canplay"));
    await flush();
    expect(diagnosticReport()).toBe(before);
    expect(video.controls).toBe(true);
  });

  it.each([false, true])("observes successful playback without changing mute policy (audible blocked=%s)", async (blocked) => {
    startDiagnostics();
    if (blocked) vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValueOnce(new DOMException("private message", "NotAllowedError"));
    const { video, dialog } = await mount();
    video.dispatchEvent(new Event("canplay"));
    await vi.advanceTimersByTimeAsync(1_000);
    expect(dialog.shadowRoot!.querySelector("video")).toBe(video);
    expect(video.controls).toBe(true);
    expect(video.muted).toBe(blocked);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(blocked ? 2 : 1);
    expect(report().events).toEqual(expect.arrayContaining([
      expect.objectContaining({ event: "play-resolved", data: expect.objectContaining({ currentAttempt: true }) }),
      expect.objectContaining({ event: "viewer-state", data: expect.objectContaining({ player: "mp4", controls: true }) }),
    ]));
  });

  it("identifies two policy rejections and observes the existing image fallback without fixing it", async () => {
    startDiagnostics();
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new DOMException("PRIVATE-TOKEN", "NotAllowedError"));
    const { video, dialog } = await mount();
    video.dispatchEvent(new Event("canplay"));
    await vi.advanceTimersByTimeAsync(1_000);
    expect(dialog.shadowRoot!.querySelector("video")).toBeNull();
    expect(report().events.filter((entry: {event: string}) => entry.event === "play-rejected")).toHaveLength(2);
    expect(report().events).toEqual(expect.arrayContaining([
      expect.objectContaining({ event: "play-rejected", data: expect.objectContaining({ errorName: "NotAllowedError", currentAttempt: true }) }),
      expect.objectContaining({ event: "viewer-state", data: expect.objectContaining({ player: "native", recordingFailed: true, videos: 0 }) }),
    ]));
    expect(diagnosticReport()).not.toMatch(/PRIVATE|secret\.invalid|camera\.recording/);
  });

  it("distinguishes a media-element failure from autoplay refusal", async () => {
    startDiagnostics();
    const { video } = await mount();
    Object.defineProperty(video, "error", { value: { code: 2, message: "PRIVATE-TOKEN" } });
    video.dispatchEvent(new Event("error"));
    await flush();
    expect(report().events).toEqual(expect.arrayContaining([
      expect.objectContaining({ event: "recording-fallback", data: expect.objectContaining({ reason: "media-element-error", mediaError: 2 }) }),
    ]));
    expect(report().events.some((entry: {event: string}) => entry.event === "play-rejected")).toBe(false);
    expect(diagnosticReport()).not.toContain("PRIVATE-TOKEN");
  });

  it("captures the first-open error before the first polling interval", async () => {
    startDiagnostics();
    const { video } = await mount();
    video.dispatchEvent(new Event("error"));
    expect(report().events).toEqual(expect.arrayContaining([
      expect.objectContaining({ event: "media-event", data: { event: "error" } }),
    ]));
  });

  it("captures a failed source separately from a newly assigned and current HA recording", async () => {
    startDiagnostics();
    const { video, dialog } = await mount();
    const selected = video.getAttribute("src")!;
    Object.defineProperty(video, "currentSrc", { value: selected });
    video.setAttribute("src", "https://secret.invalid/NEW-ASSIGNED?token=PRIVATE");
    dialog.hass = { ...hass, states: { ...hass.states, "camera.recording": {
      ...hass.states["camera.recording"]!, attributes: {
        video_url: "https://secret.invalid/NEW-ENTITY?token=PRIVATE", last_video_id: "PRIVATE-ID",
      },
    } } };
    video.dispatchEvent(new Event("error"));
    await flush();
    const observed = report().events.find((entry: any) => entry.event === "recording-source" && entry.data.reason === "error");
    expect(observed.data).toMatchObject({ hasCurrentSource: true, assignedMatchesEntity: false, currentMatchesAssigned: false });
    const hashes = report().events.find((entry: any) => entry.event === "source-fingerprints" && entry.data.observation === observed.data.observation).data;
    expect(new Set([hashes.currentSourceFingerprint, hashes.assignedSourceFingerprint, hashes.entitySourceFingerprint, hashes.entityRecordingFingerprint]).size).toBe(4);
    expect(hashes.currentSourceFingerprint).toBe(createHash("sha256").update("ring-view-diagnostic-v2:source:https://secret.invalid/PRIVATE-RECORDING").digest("hex"));
    expect(diagnosticReport()).not.toMatch(/PRIVATE|secret\.invalid|NEW-ENTITY|NEW-ASSIGNED/);
  });

  it.each([false, true])("cancels delayed first attachment on stop/dispose (dispose=%s)", async (dispose) => {
    startDiagnostics();
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = hass;
    const cleanup = watchDiagnosticViewer(dialog, () => ({ mode: "last_recording", status: "idle", hasRecordingUrl: false, recordingFailed: false }));
    if (dispose) cleanup(); else stopDiagnostics();
    const before = report().events.length;
    document.body.append(dialog);
    await vi.advanceTimersByTimeAsync(2_000);
    expect(report().events).toHaveLength(before);
  });

  it.each([false, true])("does not append late fingerprints after stopping or restarting (restart=%s)", async (restart) => {
    const resolves: Array<(value: ArrayBuffer) => void> = [];
    vi.stubGlobal("crypto", { subtle: { digest: () => new Promise((resolve) => resolves.push(resolve)) } });
    startDiagnostics();
    await mount();
    expect(resolves.length).toBeGreaterThan(0);
    stopDiagnostics();
    if (restart) startDiagnostics();
    const before = diagnosticReport();
    resolves.forEach((resolve) => resolve(new ArrayBuffer(32)));
    await flush();
    expect(diagnosticReport()).toBe(before);
  });

  it("limits source fingerprint work and rejects arbitrary fingerprint strings", async () => {
    startDiagnostics();
    const { video } = await mount();
    for (let i = 0; i < 100; i++) video.dispatchEvent(new Event("loadstart"));
    await flush();
    expect(crypto.subtle.digest).toHaveBeenCalledTimes(100); // two nonempty source URLs × 50 observations
    recordDiagnostic("source-fingerprints", { assignedSourceFingerprint: "PRIVATE-TOKEN" });
    expect(report().events.at(-1).data).toEqual({});
  });

  it("does not cancel viewer taps and detaches observers on close", async () => {
    startDiagnostics();
    const { dialog, video } = await mount();
    const click = new MouseEvent("click", { bubbles: true, composed: true, cancelable: true });
    video.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(false);
    expect(report().events.some((entry: {event: string}) => entry.event === "viewer-tap")).toBe(true);
    dialog.close();
    await flush();
    const count = report().events.length;
    await vi.advanceTimersByTimeAsync(5_000);
    expect(report().events).toHaveLength(count);
  });

  it("rejects unknown fields, values, event names and error messages", () => {
    startDiagnostics();
    recordDiagnostic("PRIVATE-EVENT", { controls: true });
    recordDiagnostic("viewer-state", { src: "PRIVATE-URL", token: "PRIVATE-TOKEN", mode: "PRIVATE-MODE", errorName: "PRIVATE-ERROR", width: Infinity, controls: true });
    expect(safePlaybackError(new Error("PRIVATE-TOKEN"))).toBe("UnknownError");
    expect(safePlaybackError({ name: "PRIVATE-NAME" })).toBe("UnknownError");
    expect(report().events.at(-1).data).toEqual({ controls: true });
    expect(diagnosticReport()).not.toContain("PRIVATE");
  });

  it("bounds the report and automatically stops all sampling after two minutes", async () => {
    startDiagnostics();
    await mount();
    for (let i = 0; i < 250; i++) recordDiagnostic("viewer-tap", { event: "click" });
    expect(report().events).toHaveLength(200);
    expect(report().events[0].event).toBe("test-start");
    expect(report().dropped).toBeGreaterThan(0);
    await vi.advanceTimersByTimeAsync(120_000);
    expect(diagnosticsActive()).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
    const final = diagnosticReport();
    recordDiagnostic("play-attempt", { attempt: 1 });
    expect(diagnosticReport()).toBe(final);
  });

  it("offers manual copy when clipboard permission is unavailable", async () => {
    const panel = document.createElement("ring-view-diagnostics");
    document.body.append(panel);
    await flush();
    panel.shadowRoot!.querySelector<HTMLButtonElement>("button")!.click();
    await flush();
    panel.shadowRoot!.querySelectorAll<HTMLButtonElement>("button")[1]!.click();
    await flush();
    expect(panel.shadowRoot!.querySelector("textarea")!.value).toContain("Ring View playback diagnostic");
    expect(panel.shadowRoot!.textContent).toContain("copy it manually");
    expect(diagnosticsActive()).toBe(false);
  });
});
