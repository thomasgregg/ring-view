import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/ring-view-dialog";
import { normalizeConfig } from "../../src/config";
import type { HomeAssistant } from "../../src/types";
import { TestCameraStream } from "../setup";

async function restore({ hidden = false, connected = true } = {}) {
  vi.useFakeTimers();
  const visibility = vi.spyOn(document, "hidden", "get").mockReturnValue(hidden);
  TestCameraStream.autoLoad = false;
  const events = new EventTarget();
  const connection = {
    connected,
    subscribeMessage: async () => () => undefined,
    addEventListener: vi.fn((event: string, callback: () => void) => events.addEventListener(event, callback)),
    removeEventListener: vi.fn((event: string, callback: () => void) => events.removeEventListener(event, callback)),
  };
  const camera = (entity_id: string) => ({ entity_id, state: "idle", attributes: { supported_features: 2 } });
  const hass: HomeAssistant = {
    states: { "camera.live": camera("camera.live"), "camera.recording": camera("camera.recording") },
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
    connection,
  };
  const dialog = document.createElement("ring-view-dialog");
  dialog.hass = hass;
  document.body.append(dialog);
  dialog.showDialog({
    config: normalizeConfig({ live_entity: "camera.live", recording_entity: "camera.recording", live_muted: false }),
    mode: "live", restored: true,
  });
  await vi.advanceTimersByTimeAsync(0);
  const adapter = () => dialog.shadowRoot?.querySelector("ring-view-native-camera-adapter");
  const resume = () => dialog.shadowRoot?.querySelector<HTMLButtonElement>(".resume-live");
  return { dialog, hass, connection, events, visibility, adapter, resume };
}

describe("automatic restored live recovery", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("makes one muted attempt and preserves successful playback", async () => {
    const { dialog, adapter, resume } = await restore();
    const player = adapter();
    expect(player).not.toBeNull();
    expect(player?.muted).toBe(true);
    player?.dispatchEvent(new CustomEvent("native-media-ready"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(adapter()).toBe(player);
    expect(TestCameraStream.active).toBe(1);
    expect(resume()).toBeNull();
    expect(dialog.shadowRoot?.querySelector(".state-layer")).toBeNull();
  });

  it.each(["error", "timeout"])("falls back to manual Resume after one automatic %s", async (failure) => {
    const { dialog, adapter, resume, events } = await restore();
    const oldPlayer = adapter();
    expect(oldPlayer).not.toBeNull();
    if (failure === "error") oldPlayer?.dispatchEvent(new CustomEvent("native-media-error", { detail: "media-error" }));
    else await vi.advanceTimersByTimeAsync(20_000);
    await vi.advanceTimersByTimeAsync(0);
    expect(adapter()).toBeNull();
    expect(resume()).not.toBeNull();
    expect(dialog.shadowRoot?.querySelector('[role="alert"]')).toBeNull();
    // Readiness from the discarded renderer and repeated HA updates cannot
    // revive it or re-arm automatic recovery after the attempt is exhausted.
    oldPlayer?.dispatchEvent(new CustomEvent("native-media-ready"));
    events.dispatchEvent(new Event("ready"));
    dialog.hass = { ...dialog.hass! };
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(adapter()).toBeNull();
    expect(TestCameraStream.active).toBe(0);
    const button = resume();
    button?.click();
    button?.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(TestCameraStream.active).toBe(1);
    // A failed manual attempt is still an honest error with explicit Retry.
    adapter()?.dispatchEvent(new CustomEvent("native-media-error", { detail: "media-error" }));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(dialog.shadowRoot?.querySelector('[role="alert"]')).not.toBeNull();
    expect(adapter()).toBeNull();
  });

  it.each(["hidden", "offline"])("waits while %s before consuming its one attempt", async (reason) => {
    const { adapter, connection, events, visibility } = await restore({ hidden: reason === "hidden", connected: reason !== "offline" });
    await vi.advanceTimersByTimeAsync(120_000);
    expect(adapter()).toBeNull();
    visibility.mockReturnValue(false);
    connection.connected = true;
    document.dispatchEvent(new Event("visibilitychange"));
    events.dispatchEvent(new Event("ready"));
    await vi.advanceTimersByTimeAsync(0);
    const player = adapter();
    expect(player).not.toBeNull();
    player?.dispatchEvent(new CustomEvent("native-media-ready"));
    document.dispatchEvent(new Event("visibilitychange"));
    events.dispatchEvent(new Event("ready"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(adapter()).toBe(player);
    expect(TestCameraStream.active).toBe(1);
  });

  it.each(["close", "recording", "unavailable"])("cancels queued recovery on %s", async (action) => {
    const { dialog, hass, adapter, connection, events } = await restore({ connected: false });
    if (action === "close") dialog.close();
    if (action === "recording") dialog.shadowRoot?.querySelector<HTMLButtonElement>("#ring-view-tab-recording")?.click();
    if (action === "unavailable") {
      dialog.hass = { ...hass, states: { ...hass.states, "camera.live": { ...hass.states["camera.live"]!, state: "unavailable" } } };
    }
    await vi.advanceTimersByTimeAsync(0);
    connection.connected = true;
    events.dispatchEvent(new Event("ready"));
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(0);
    expect(adapter()?.stateObj?.entity_id).not.toBe("camera.live");
    expect(connection.removeEventListener).toHaveBeenCalledWith("ready", expect.any(Function));
  });

  it("rebinds the readiness listener if HA replaces its connection while waiting", async () => {
    const { dialog, connection, events, adapter } = await restore({ connected: false });
    const newEvents = new EventTarget();
    const replacement = {
      ...connection, connected: false,
      addEventListener: vi.fn((event: string, callback: () => void) => newEvents.addEventListener(event, callback)),
      removeEventListener: vi.fn((event: string, callback: () => void) => newEvents.removeEventListener(event, callback)),
    };
    dialog.hass = { ...dialog.hass!, connection: replacement };
    await vi.advanceTimersByTimeAsync(0);
    expect(connection.removeEventListener).toHaveBeenCalledWith("ready", expect.any(Function));
    connection.connected = true;
    events.dispatchEvent(new Event("ready"));
    await vi.advanceTimersByTimeAsync(0);
    expect(adapter()).toBeNull();
    replacement.connected = true;
    newEvents.dispatchEvent(new Event("ready"));
    await vi.advanceTimersByTimeAsync(0);
    expect(adapter()).not.toBeNull();
    expect(replacement.removeEventListener).toHaveBeenCalledWith("ready", expect.any(Function));
  });

  it("cancels an automatic attempt if the app becomes hidden", async () => {
    const { adapter, visibility, resume } = await restore();
    expect(adapter()).not.toBeNull();
    visibility.mockReturnValue(true);
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(adapter()).toBeNull();
    expect(resume()).not.toBeNull();
    visibility.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(adapter()).toBeNull();
  });

  it("does not mutate HA's readiness listener list during its event dispatch", async () => {
    const { connection, events, adapter } = await restore({ connected: false });
    let removedDuringDispatch = -1;
    events.addEventListener("ready", () => { removedDuringDispatch = connection.removeEventListener.mock.calls.length; });
    connection.connected = true;
    events.dispatchEvent(new Event("ready"));
    expect(removedDuringDispatch).toBe(0);
    await vi.advanceTimersByTimeAsync(0);
    expect(adapter()).not.toBeNull();
    expect(connection.removeEventListener).toHaveBeenCalledWith("ready", expect.any(Function));
  });

  it("does not start during pagehide, but handles one persisted page return", async () => {
    const { adapter, connection, events } = await restore({ connected: false });
    window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));
    connection.connected = true;
    events.dispatchEvent(new Event("ready"));
    document.dispatchEvent(new Event("visibilitychange"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(adapter()).toBeNull();
    window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
    await vi.advanceTimersByTimeAsync(0);
    const player = adapter();
    expect(player).not.toBeNull();
    window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
    await vi.advanceTimersByTimeAsync(0);
    expect(adapter()).toBe(player);
  });
});
