import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/ring-view-dialog";
import { normalizeConfig } from "../../src/config";
import type { HomeAssistant } from "../../src/types";
import { TestCameraStream } from "../setup";

const config = normalizeConfig({ live_entity: "camera.live", recording_entity: "camera.recording" });
const hass: HomeAssistant = {
  states: {
    "camera.live": { entity_id: "camera.live", state: "idle", attributes: { supported_features: 2 } },
    "camera.recording": {
      entity_id: "camera.recording", state: "idle",
      attributes: { video_url: "https://example.test/recording.mp4" },
    },
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
};
const flush = () => vi.advanceTimersByTimeAsync(0);

async function mount() {
  const dialog = document.createElement("ring-view-dialog");
  dialog.hass = hass;
  document.body.append(dialog);
  dialog.showDialog({ mode: "last_recording", config });
  await flush();
  const video = () => dialog.shadowRoot!.querySelector<HTMLVideoElement>(".video-fallback")!;
  return { dialog, video };
}

function ringMqttHass(recordingUrl?: string): HomeAssistant {
  return {
    ...hass,
    states: {
      ...hass.states,
      "select.front_door_events": {
        entity_id: "select.front_door_events",
        state: "Ding 1",
        attributes: {
          eventId: "event-1",
          ...(recordingUrl === undefined ? {} : { recordingUrl }),
        },
      },
      "camera.snapshot": {
        entity_id: "camera.snapshot",
        state: "idle",
        attributes: { entity_picture: "/snapshot.jpg" },
      },
    },
    entities: {
      "select.front_door_events": {
        entity_id: "select.front_door_events",
        platform: "mqtt",
        device_id: "front-door",
        unique_id: "083a8804c4c5_event_select",
        original_name: "Event Select",
      },
      "camera.snapshot": {
        entity_id: "camera.snapshot",
        platform: "mqtt",
        device_id: "front-door",
      },
    },
    callService: vi.fn(async () => undefined),
  };
}

async function mountRingMqtt(recordingUrl?: string) {
  const dialog = document.createElement("ring-view-dialog");
  const mqttHass = ringMqttHass(recordingUrl);
  dialog.hass = mqttHass;
  document.body.append(dialog);
  dialog.showDialog({
    mode: "last_recording",
    config: normalizeConfig({
      recording_entity: "select.front_door_events",
      live_entity: "camera.live",
      snapshot_entity: "camera.snapshot",
    }),
  });
  await flush();
  return { dialog, hass: mqttHass };
}

describe("recording player lifecycle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    TestCameraStream.autoLoad = false;
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("hides native video chrome until the recording can play", async () => {
    const { dialog, video } = await mount();
    expect(video().classList.contains("pending")).toBe(true);
    expect(dialog.shadowRoot!.querySelector(".spinner")).not.toBeNull();

    video().dispatchEvent(new Event("canplay"));
    await flush();

    expect(video().classList.contains("pending")).toBe(false);
    expect(dialog.shadowRoot!.querySelector(".spinner")).toBeNull();
  });

  it("plays a ready Ring-MQTT recording URL with a camera poster", async () => {
    const { dialog, hass: mqttHass } = await mountRingMqtt(
      "https://example.test/mqtt-recording.mp4",
    );
    const video = dialog.shadowRoot?.querySelector<HTMLVideoElement>(".video-fallback");
    expect(video?.src).toBe("https://example.test/mqtt-recording.mp4");
    expect(video?.poster).toContain("/snapshot.jpg");
    expect(dialog.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
    expect(mqttHass.callService).not.toHaveBeenCalled();
  });

  it("requests and waits for a fresh Ring-MQTT URL before mounting playback", async () => {
    const { dialog, hass: mqttHass } = await mountRingMqtt("<Recording Not Found>");
    expect(mqttHass.callService).toHaveBeenCalledWith(
      "select",
      "select_option",
      { option: "Ding 1" },
      { entity_id: "select.front_door_events" },
    );
    expect(dialog.shadowRoot?.querySelector(".video-fallback")).toBeNull();
    expect(dialog.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
    expect(dialog.shadowRoot?.textContent).toContain("Loading last recording");

    dialog.hass = {
      ...mqttHass,
      states: {
        ...mqttHass.states,
        "select.front_door_events": {
          ...mqttHass.states["select.front_door_events"]!,
          attributes: {
            eventId: "event-1",
            recordingUrl: "https://example.test/fresh-recording.mp4",
          },
        },
      },
    };
    await flush();

    expect(
      dialog.shadowRoot?.querySelector<HTMLVideoElement>(".video-fallback")?.src,
    ).toBe("https://example.test/fresh-recording.mp4");
  });

  it("reports a refresh timeout without trying to render a select as a camera", async () => {
    const { dialog } = await mountRingMqtt("<Transcoding in Progress>");
    await vi.advanceTimersByTimeAsync(15_000);
    await dialog.updateComplete;
    expect(dialog.shadowRoot?.textContent).toContain(
      "Ring-MQTT did not provide a fresh recording URL in time.",
    );
    expect(dialog.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
  });

  it("refreshes one failed Ring-MQTT video and reports a second playback failure", async () => {
    const { dialog, hass: mqttHass } = await mountRingMqtt(
      "https://example.test/first-recording.mp4",
    );
    dialog.shadowRoot?.querySelector<HTMLVideoElement>(".video-fallback")
      ?.dispatchEvent(new Event("error"));
    await flush();
    expect(mqttHass.callService).toHaveBeenCalledTimes(1);
    expect(dialog.shadowRoot?.querySelector(".video-fallback")).toBeNull();

    dialog.hass = {
      ...mqttHass,
      states: {
        ...mqttHass.states,
        "select.front_door_events": {
          ...mqttHass.states["select.front_door_events"]!,
          attributes: {
            eventId: "event-1",
            recordingUrl: "https://example.test/refreshed-recording.mp4",
          },
        },
      },
    };
    await flush();
    dialog.shadowRoot?.querySelector<HTMLVideoElement>(".video-fallback")
      ?.dispatchEvent(new Event("error"));
    await flush();

    expect(mqttHass.callService).toHaveBeenCalledTimes(1);
    expect(dialog.shadowRoot?.textContent).toContain(
      "The selected Ring-MQTT recording could not be played.",
    );
    expect(dialog.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
  });

  it("refreshes an expired signed Ring-MQTT URL before trying playback", async () => {
    const { dialog, hass: mqttHass } = await mountRingMqtt(
      "https://example.test/expired.mp4?X-Amz-Date=20200101T000000Z&X-Amz-Expires=60",
    );
    expect(mqttHass.callService).toHaveBeenCalledTimes(1);
    expect(dialog.shadowRoot?.querySelector(".video-fallback")).toBeNull();
  });

  it("surfaces a Ring-MQTT refresh service failure immediately", async () => {
    const mqttHass = ringMqttHass();
    mqttHass.callService = vi.fn().mockRejectedValue(new Error("service failed"));
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = mqttHass;
    document.body.append(dialog);
    dialog.showDialog({
      mode: "last_recording",
      config: normalizeConfig({
        recording_entity: "select.front_door_events",
        live_entity: "camera.live",
      }),
    });
    await flush();

    expect(dialog.shadowRoot?.textContent).toContain(
      "Home Assistant could not refresh the Ring-MQTT recording URL.",
    );
  });

  it("times out even when the Home Assistant service promise never settles", async () => {
    const mqttHass = ringMqttHass();
    mqttHass.callService = vi.fn(() => new Promise(() => undefined));
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = mqttHass;
    document.body.append(dialog);
    dialog.showDialog({
      mode: "last_recording",
      config: normalizeConfig({
        recording_entity: "select.front_door_events",
        live_entity: "camera.live",
      }),
    });
    await flush();
    await vi.advanceTimersByTimeAsync(15_000);
    await dialog.updateComplete;

    expect(dialog.shadowRoot?.textContent).toContain(
      "Ring-MQTT did not provide a fresh recording URL in time.",
    );
  });

  it("never passes an unrecognized select source to the camera renderer", async () => {
    const mqttHass = ringMqttHass();
    mqttHass.entities = {
      ...mqttHass.entities,
      "select.front_door_events": {
        entity_id: "select.front_door_events",
        platform: "template",
      },
    };
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = mqttHass;
    document.body.append(dialog);
    dialog.showDialog({
      mode: "last_recording",
      config: normalizeConfig({
        recording_entity: "select.front_door_events",
        live_entity: "camera.live",
      }),
    });
    await flush();

    expect(dialog.shadowRoot?.textContent).toContain(
      "This select entity does not expose a playable recording URL",
    );
    expect(dialog.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
  });

  it("cancels a pending recording refresh when switching to Live", async () => {
    const { dialog, hass: mqttHass } = await mountRingMqtt();
    dialog.shadowRoot?.querySelector<HTMLButtonElement>("#ring-view-tab-live")?.click();
    await flush();

    dialog.hass = {
      ...mqttHass,
      states: {
        ...mqttHass.states,
        "select.front_door_events": {
          ...mqttHass.states["select.front_door_events"]!,
          attributes: {
            eventId: "event-2",
            recordingUrl: "https://example.test/late-recording.mp4",
          },
        },
      },
    };
    await flush();
    expect(dialog.shadowRoot?.querySelector(".video-fallback")).toBeNull();
    expect(dialog.shadowRoot?.querySelector("ring-view-native-camera-adapter")).not.toBeNull();
  });

  it("does not mount a late recording while hidden and resumes from fresh state", async () => {
    const visibility = vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    const { dialog, hass: mqttHass } = await mountRingMqtt();
    document.dispatchEvent(new Event("visibilitychange"));
    await flush();

    dialog.hass = {
      ...mqttHass,
      states: {
        ...mqttHass.states,
        "select.front_door_events": {
          ...mqttHass.states["select.front_door_events"]!,
          attributes: {
            eventId: "event-2",
            recordingUrl: "https://example.test/while-hidden.mp4",
          },
        },
      },
    };
    await flush();
    expect(dialog.shadowRoot?.querySelector(".video-fallback")).toBeNull();

    visibility.mockReturnValue(false);
    document.dispatchEvent(new Event("visibilitychange"));
    await flush();
    expect(
      dialog.shadowRoot?.querySelector<HTMLVideoElement>(".video-fallback")?.src,
    ).toBe("https://example.test/while-hidden.mp4");
  });

  it("dismisses paused recording controls after inactivity and resumes from the video surface", async () => {
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();

    video().dispatchEvent(new Event("pause"));
    await vi.advanceTimersByTimeAsync(2_499);
    expect(video().controls).toBe(true);

    await vi.advanceTimersByTimeAsync(1);
    await dialog.updateComplete;
    expect(video().controls).toBe(false);
    expect(video().classList.contains("controls-hidden")).toBe(true);
    expect(video().getAttribute("aria-label")).toBe("Play last recording");

    video().click();
    await dialog.updateComplete;
    expect(video().controls).toBe(true);
    expect(video().classList.contains("controls-hidden")).toBe(false);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(3_000);
    expect(video().controls).toBe(true);
  });

  it("keeps paused controls available while the user is interacting with them", async () => {
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();
    video().dispatchEvent(new Event("pause"));

    await vi.advanceTimersByTimeAsync(2_000);
    video().dispatchEvent(new Event("pointermove"));
    await vi.advanceTimersByTimeAsync(2_000);
    expect(video().controls).toBe(true);

    await vi.advanceTimersByTimeAsync(500);
    await dialog.updateComplete;
    expect(video().controls).toBe(false);
  });

  it("dismisses ended recording controls and restarts from the beginning", async () => {
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();
    video().currentTime = 24;

    video().dispatchEvent(new Event("ended"));
    await dialog.updateComplete;
    expect(
      dialog.shadowRoot!.querySelector("#ring-view-tab-recording")?.getAttribute("aria-selected"),
    ).toBe("true");
    await vi.advanceTimersByTimeAsync(2_500);
    await dialog.updateComplete;
    expect(video().controls).toBe(false);

    video().dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    await dialog.updateComplete;
    expect(video().currentTime).toBe(0);
    expect(video().controls).toBe(true);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(2);
  });

  it("cannot let an old pause timer hide controls after changing modes", async () => {
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();
    const previous = video();
    previous.dispatchEvent(new Event("pause"));

    dialog.shadowRoot!.querySelector<HTMLButtonElement>("#ring-view-tab-live")!.click();
    await vi.advanceTimersByTimeAsync(3_000);
    dialog.shadowRoot!.querySelector<HTMLButtonElement>("#ring-view-tab-recording")!.click();
    await flush();

    expect(previous.isConnected).toBe(false);
    expect(video()).not.toBe(previous);
    expect(video().controls).toBe(true);
  });

  it("recognizes each replacement recording after repeated app backgrounding", async () => {
    const visibility = vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();
    expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();

    for (let cycle = 0; cycle < 2; cycle += 1) {
      const previous = video();
      visibility.mockReturnValue(true);
      document.dispatchEvent(new Event("visibilitychange"));
      await flush();
      expect(previous.isConnected).toBe(false);
      visibility.mockReturnValue(false);
      document.dispatchEvent(new Event("visibilitychange"));
      await flush();
      const replacement = video();
      expect(replacement).not.toBe(previous);
      replacement.dispatchEvent(new Event("canplay"));
      replacement.dispatchEvent(new Event("canplay"));
      await vi.advanceTimersByTimeAsync(25_000);
      expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();
      expect(video()).toBe(replacement);
    }
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(3);
  });

  it.each(["resolve", "reject"] as const)("ignores a late recording %s after switching to Live", async (settlement) => {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    vi.mocked(HTMLMediaElement.prototype.play).mockReturnValueOnce(new Promise<void>((yes, no) => {
      resolve = yes;
      reject = no;
    }));
    const { dialog, video } = await mount();
    const previous = video();
    previous.dispatchEvent(new Event("canplay"));
    dialog.shadowRoot!.querySelector<HTMLButtonElement>("#ring-view-tab-live")!.click();
    await flush();
    const live = dialog.shadowRoot!.querySelector("ring-view-native-camera-adapter")!;
    expect(previous.isConnected).toBe(false);
    if (settlement === "resolve") resolve();
    else reject(new Error("Old recording stopped"));
    await flush();
    expect(live.classList.contains("pending")).toBe(true);
    // The old promise must not cancel Live's timeout or mark it ready.
    await vi.advanceTimersByTimeAsync(45_000);
    expect(dialog.shadowRoot!.querySelector('[role="alert"]')).not.toBeNull();
  });

  it.each(["resolve", "reject"] as const)("ignores an old muted-playback %s after reopening the dialog", async (settlement) => {
    let resolve!: () => void;
    let reject!: (reason: Error) => void;
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockRejectedValueOnce(new DOMException("Autoplay blocked", "NotAllowedError"));
    play.mockReturnValueOnce(new Promise<void>((yes, no) => { resolve = yes; reject = no; }));
    const { dialog, video } = await mount();
    video().dispatchEvent(new Event("canplay"));
    await flush();
    expect(play).toHaveBeenCalledTimes(2);
    dialog.close();
    await flush();
    dialog.showDialog({ mode: "last_recording", config });
    await flush();
    const replacement = video();
    if (settlement === "resolve") resolve();
    else reject(new Error("Old muted playback stopped"));
    await flush();
    expect(video()).toBe(replacement);
    replacement.dispatchEvent(new Event("canplay"));
    await vi.advanceTimersByTimeAsync(25_000);
    expect(play).toHaveBeenCalledTimes(3);
    expect(video()).toBe(replacement);
    expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();
  });
});
