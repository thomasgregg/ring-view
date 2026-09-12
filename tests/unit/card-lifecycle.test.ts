import { afterEach, describe, expect, it, vi } from "vitest";
import "../../src/index";
import type { HomeAssistant, HassEntity } from "../../src/types";
import type { RingView } from "../../src/ring-view";
import { RingViewDialog } from "../../src/ring-view-dialog";
import type { RingViewNativeCameraAdapter } from "../../src/media/native-camera-adapter";
import { TestCameraStream } from "../setup";

const camera = (id: string, features: number): HassEntity => ({
  entity_id: id,
  state: "idle",
  attributes: {
    friendly_name: id,
    entity_picture: "/image.jpg",
    supported_features: features,
  },
});

const hass: HomeAssistant = {
  entities: {
    "camera.recording": {
      entity_id: "camera.recording",
      platform: "ring",
    },
    "camera.live": { entity_id: "camera.live", platform: "ring" },
  },
  states: {
    "camera.recording": camera("camera.recording", 0),
    "camera.live": camera("camera.live", 2),
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
};

async function mount(): Promise<RingView> {
  const card = document.createElement("ring-view");
  card.setConfig({ recording_entity: "camera.recording", live_entity: "camera.live" });
  card.hass = hass;
  document.body.append(card);
  await card.updateComplete;
  return card;
}

async function flush(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function getDialog(): RingViewDialog | null {
  return document.body.querySelector<RingViewDialog>("ring-view-dialog");
}

describe("card stream lifecycle", () => {
  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("never mounts a camera stream for the dashboard preview", async () => {
    const card = await mount();
    expect(card.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
    expect(card.shadowRoot?.querySelector(".mode-indicator")).toBeNull();
    expect(TestCameraStream.active).toBe(0);
  });

  it("creates an equivalent Ring-MQTT stub from renamed registry entities", () => {
    const mqttHass: HomeAssistant = {
      ...hass,
      entities: {
        "select.renamed_events": {
          entity_id: "select.renamed_events",
          platform: "mqtt",
          device_id: "front-door",
          unique_id: "083a8804c4c5_event_select",
          original_name: "Event Select",
        },
        "camera.renamed_snapshot": {
          entity_id: "camera.renamed_snapshot",
          platform: "mqtt",
          device_id: "front-door",
          unique_id: "083a8804c4c5_snapshot",
          original_name: "Snapshot",
        },
        "camera.front_door_stream": {
          entity_id: "camera.front_door_stream",
          platform: "generic",
        },
      },
      states: {
        "select.renamed_events": {
          entity_id: "select.renamed_events",
          state: "Ding 1",
          attributes: {
            eventId: "event-1",
            recordingUrl: "https://example.test/event.mp4",
          },
        },
        "camera.renamed_snapshot": camera("camera.renamed_snapshot", 0),
        "camera.front_door_stream": camera("camera.front_door_stream", 2),
      },
    };
    const cardClass = customElements.get("ring-view") as typeof RingView;

    expect(cardClass.getStubConfig(mqttHass)).toMatchObject({
      recording_entity: "select.renamed_events",
      live_entity: "camera.front_door_stream",
      snapshot_entity: "camera.renamed_snapshot",
    });
    expect(cardClass.getStubConfig(hass)).toMatchObject({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
  });

  it("enforces a 12-column by 3-row minimum in both dashboard modes", () => {
    for (const dashboardBehavior of ["open_viewer", "interactive"] as const) {
      const card = document.createElement("ring-view");
      card.setConfig({
        recording_entity: "camera.recording",
        live_entity: "camera.live",
        dashboard_behavior: dashboardBehavior,
        grid_options: {
          columns: 6,
          rows: 2,
          min_columns: 4,
          min_rows: 1,
          max_columns: 6,
          max_rows: 2,
        },
      });
      expect(card.getGridOptions()).toMatchObject({
        columns: 12,
        rows: 3,
        min_columns: 12,
        min_rows: 3,
        max_columns: 12,
        max_rows: 3,
      });
    }
  });

  it("restores an interactive card immediately when the same element reconnects", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      dashboard_behavior: "interactive",
      dashboard_start: "last_recording",
    });
    card.hass = hass;
    const recordingState = card.hass.states["camera.recording"];
    document.body.append(card);
    await card.updateComplete;
    await flush();

    const viewer = card.shadowRoot?.querySelector<RingViewDialog>("ring-view-dialog[inline]");
    expect(viewer?.open).toBe(true);
    expect(viewer?.config?.recording_entity).toBe("camera.recording");
    expect(TestCameraStream.active).toBe(1);

    card.remove();
    await flush();
    expect(viewer?.open).toBe(false);
    expect(TestCameraStream.active).toBe(0);

    document.body.append(card);
    await flush();
    expect(card.hass.states["camera.recording"]).toBe(recordingState);
    expect(viewer?.open).toBe(true);
    expect(viewer?.config?.recording_entity).toBe("camera.recording");
    expect(TestCameraStream.active).toBe(1);
  });

  it("shows the freshest configured still without adding a third viewer tab", async () => {
    const snapshot = {
      ...camera("camera.snapshot", 0),
      attributes: {
        ...camera("camera.snapshot", 0).attributes,
        entity_picture: "/snapshot.jpg",
        timestamp: Date.parse("2026-09-06T12:01:00Z") / 1_000,
      },
    };
    const recording = {
      ...hass.states["camera.recording"]!,
      attributes: {
        ...hass.states["camera.recording"]!.attributes,
        recorded_at: "2026-09-06T12:00:00Z",
      },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: recording.entity_id,
      live_entity: "camera.live",
      snapshot_entity: snapshot.entity_id,
      preview_source: "newest",
    });
    card.hass = {
      ...hass,
      states: { ...hass.states, [recording.entity_id]: recording, [snapshot.entity_id]: snapshot },
    };
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/snapshot.jpg",
    );
    expect(card.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    expect(dialog?.shadowRoot?.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(
      dialog?.shadowRoot
        ?.querySelector("#ring-view-tab-recording")
        ?.getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("follows snapshot timestamp and recording ID changes received after load", async () => {
    const recording = {
      ...camera("camera.recording", 0),
      attributes: {
        ...camera("camera.recording", 0).attributes,
        entity_picture: "/recording.jpg",
        last_video_id: "recording-1",
      },
    };
    const snapshot = {
      ...camera("camera.snapshot", 0),
      attributes: {
        ...camera("camera.snapshot", 0).attributes,
        entity_picture: "/snapshot.jpg",
        timestamp: 1_780_000_000,
      },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: recording.entity_id,
      live_entity: "camera.live",
      snapshot_entity: snapshot.entity_id,
      preview_source: "newest",
      preview_fallback: "last_recording",
    });
    const initialHass = {
      ...hass,
      states: { ...hass.states, [recording.entity_id]: recording, [snapshot.entity_id]: snapshot },
    };
    card.hass = initialHass;
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/recording.jpg",
    );

    const newerSnapshot = {
      ...snapshot,
      attributes: { ...snapshot.attributes, timestamp: 1_780_000_060 },
    };
    card.hass = {
      ...initialHass,
      states: { ...initialHass.states, [snapshot.entity_id]: newerSnapshot },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/snapshot.jpg",
    );

    const newerRecording = {
      ...recording,
      attributes: { ...recording.attributes, last_video_id: "recording-2" },
    };
    card.hass = {
      ...initialHass,
      states: {
        ...initialHass.states,
        [recording.entity_id]: newerRecording,
        [snapshot.entity_id]: newerSnapshot,
      },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector<HTMLImageElement>("img")?.getAttribute("src")).toBe(
      "/recording.jpg",
    );
  });

  it("uses the synthetic scene in the card picker without requesting a camera", async () => {
    const callWS = vi.fn(async (_message: Record<string, unknown>) => ({
      path: "/api/camera_proxy/camera.recording?authSig=temporary",
    }));
    const picker = document.createElement("hui-card-picker");
    const card = document.createElement("ring-view");
    card.setConfig({ recording_entity: "camera.recording", live_entity: "camera.live" });
    card.hass = {
      ...hass,
      callWS: <T>(message: Record<string, unknown>) =>
        callWS(message) as unknown as Promise<T>,
    };
    picker.append(card);
    document.body.append(picker);
    await card.updateComplete;
    await Promise.resolve();

    const image = card.shadowRoot?.querySelector<HTMLImageElement>("img");
    expect(image?.src).toMatch(/^data:image\/svg\+xml/);
    expect(image?.src).not.toContain("image.jpg");
    expect(card.shadowRoot?.querySelector(".mode-indicator")).toBeNull();
    expect(callWS).not.toHaveBeenCalled();
  });

  it("uses one name setting for a top-left card label and the viewer title", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      name: "Entrance",
      show_name: true,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;

    expect(card.shadowRoot?.querySelector(".name")?.textContent).toBe("Entrance");
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    expect(dialog?.shadowRoot?.querySelector("h2")?.textContent).toBe("Entrance");
  });

  it("shows a fresh doorbell event without starting a stream and opens Live on tap", async () => {
    const doorbell: HassEntity = {
      entity_id: "event.front_door_ding",
      state: "2026-09-06T12:00:00Z",
      attributes: { event_type: "ring", event_types: ["ring"] },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      doorbell_entity: doorbell.entity_id,
    });
    card.hass = { ...hass, states: { ...hass.states, [doorbell.entity_id]: doorbell } };
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".ring-alert")).toBeNull();
    expect(TestCameraStream.active).toBe(0);

    card.hass = {
      ...hass,
      states: {
        ...hass.states,
        [doorbell.entity_id]: { ...doorbell, state: "2026-09-06T12:01:00Z" },
      },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".ring-alert")?.textContent).toContain(
      "Someone is at the door",
    );
    expect(TestCameraStream.active).toBe(0);

    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    expect(
      dialog?.shadowRoot?.querySelector("#ring-view-tab-live")?.getAttribute("aria-selected"),
    ).toBe("true");
    expect(TestCameraStream.active).toBe(1);
  });

  it("shows a Ring-MQTT Ding only for an off-to-on transition", async () => {
    const doorbell: HassEntity = {
      entity_id: "binary_sensor.front_door_ding",
      state: "on",
      attributes: { device_class: "occupancy" },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      doorbell_entity: doorbell.entity_id,
    });
    card.hass = { ...hass, states: { ...hass.states, [doorbell.entity_id]: doorbell } };
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".ring-alert")).toBeNull();

    card.hass = {
      ...card.hass,
      states: {
        ...card.hass.states,
        [doorbell.entity_id]: { ...doorbell, state: "off" },
      },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".ring-alert")).toBeNull();

    card.hass = {
      ...card.hass,
      states: {
        ...card.hass.states,
        [doorbell.entity_id]: {
          ...doorbell,
          state: "on",
          attributes: { ...doorbell.attributes, lastDingTime: "2026-09-12T14:19:13Z" },
        },
      },
    };
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".ring-alert")?.textContent).toContain(
      "Someone is at the door",
    );
  });

  it("updates Ring-MQTT activity when a same-device motion sibling changes", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.parse("2026-09-12T10:30:30Z"));
    const ding: HassEntity = {
      entity_id: "binary_sensor.renamed_ding",
      state: "off",
      attributes: { lastDingTime: "2026-09-12T10:15:30Z" },
    };
    const motion: HassEntity = {
      entity_id: "binary_sensor.renamed_motion",
      state: "off",
      attributes: { lastMotionTime: "2026-09-12T10:17:30Z" },
    };
    const mqttHass: HomeAssistant = {
      ...hass,
      states: {
        ...hass.states,
        [ding.entity_id]: ding,
        [motion.entity_id]: motion,
      },
      entities: {
        ...hass.entities,
        [ding.entity_id]: {
          entity_id: ding.entity_id,
          platform: "mqtt",
          device_id: "front-door",
        },
        [motion.entity_id]: {
          entity_id: motion.entity_id,
          platform: "mqtt",
          device_id: "front-door",
        },
      },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      last_activity_entity: ding.entity_id,
    });
    card.hass = mqttHass;
    document.body.append(card);
    await card.updateComplete;
    let activity = card.shadowRoot?.querySelector("ring-view-activity-time");
    await activity?.updateComplete;
    expect(activity?.shadowRoot?.textContent).toContain("13 min ago");

    card.hass = {
      ...mqttHass,
      states: {
        ...mqttHass.states,
        [motion.entity_id]: {
          ...motion,
          attributes: { lastMotionTime: "2026-09-12T10:25:30Z" },
        },
      },
    };
    await card.updateComplete;
    activity = card.shadowRoot?.querySelector("ring-view-activity-time");
    await activity?.updateComplete;
    expect(activity?.shadowRoot?.textContent).toContain("5 min ago");
  });

  it("keeps the card and viewer name hidden while preserving a dialog label", async () => {
    const card = await mount();
    expect(card.shadowRoot?.querySelector(".name")).toBeNull();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    const section = dialog?.shadowRoot?.querySelector<HTMLElement>(".dialog");
    expect(dialog?.shadowRoot?.querySelector("h2")).toBeNull();
    expect(section?.getAttribute("aria-label")).toBe("Camera view");
    expect(section?.hasAttribute("aria-labelledby")).toBe(false);
  });

  it("starts from the unobstructed image when recording autoplay is disabled", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      autoplay_recording: false,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();

    const dialog = getDialog();
    const play = dialog?.shadowRoot?.querySelector<HTMLElement>(".initial-start-surface");
    expect(play?.getAttribute("aria-label")).toBe("Play last recording");
    expect(dialog?.shadowRoot?.querySelector(".play-recording")).toBeNull();
    expect(TestCameraStream.active).toBe(0);
    play?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);
  });

  it("can remember the selected view", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      remember_last_mode: true,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    expect(card.shadowRoot?.querySelector(".mode-indicator")).toBeNull();

    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    let dialog = getDialog();
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    dialog?.close();
    await flush();

    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    dialog = getDialog();
    expect(
      dialog?.shadowRoot
        ?.querySelector("#ring-view-tab-live")
        ?.getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("refreshes a native-sized still only while the preview is visible", async () => {
    vi.useFakeTimers();
    let intersectionCallback: IntersectionObserverCallback | undefined;
    class TestIntersectionObserver {
      public constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }
      public observe(): void {}
      public unobserve(): void {}
      public disconnect(): void {}
      public takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
      public readonly root = null;
      public readonly rootMargin = "0px";
      public readonly thresholds = [0];
    }
    vi.stubGlobal("IntersectionObserver", TestIntersectionObserver);

    const callWS = vi.fn(async (_message: Record<string, unknown>) => ({
      path: "/api/camera_proxy/camera.recording?authSig=temporary",
    }));
    const card = document.createElement("ring-view");
    card.setConfig({ recording_entity: "camera.recording", live_entity: "camera.live" });
    card.hass = {
      ...hass,
      callWS: <T>(message: Record<string, unknown>) =>
        callWS(message) as unknown as Promise<T>,
    };
    document.body.append(card);
    await card.updateComplete;
    await Promise.resolve();
    expect(callWS).not.toHaveBeenCalled();

    intersectionCallback?.(
      [{ isIntersecting: true, intersectionRatio: 1 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(0);
    await card.updateComplete;
    expect(callWS).toHaveBeenCalledTimes(1);
    expect(callWS).toHaveBeenCalledWith({
      type: "auth/sign_path",
      path: "/api/camera_proxy/camera.recording",
    });
    const image = card.shadowRoot?.querySelector<HTMLImageElement>("img");
    expect(image?.getAttribute("src")).toContain("width=640&height=360");
    expect(card.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();

    await vi.advanceTimersByTimeAsync(10_000);
    await Promise.resolve();
    expect(callWS).toHaveBeenCalledTimes(2);

    intersectionCallback?.(
      [{ isIntersecting: false, intersectionRatio: 0 } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    await vi.advanceTimersByTimeAsync(20_000);
    expect(callWS).toHaveBeenCalledTimes(2);
  });

  it("keeps exactly one renderer while switching and removes it on close", async () => {
    const card = await mount();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);

    const dialog = getDialog();
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);

    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-recording")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);

    dialog?.close();
    await flush();
    expect(TestCameraStream.active).toBe(0);
  });

  it("keeps the global viewer and renderer when the card disconnects", async () => {
    const card = await mount();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    expect(TestCameraStream.active).toBe(1);
    const dialog = getDialog();
    expect(card.shadowRoot?.querySelector("ring-view-dialog")).toBeNull();
    expect(dialog?.parentElement).toBe(document.body);
    card.remove();
    await flush();
    expect(dialog?.open).toBe(true);
    expect(dialog?.shadowRoot?.querySelector('[role="dialog"]')).not.toBeNull();
    expect(TestCameraStream.active).toBe(1);
    dialog?.close();
    await flush();
    expect(TestCameraStream.active).toBe(0);
  });

  it("restores the matching viewer after Home Assistant rebuilds the frontend", async () => {
    const card = await mount();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    getDialog()?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();

    expect(location.search).toContain("ring-view-live-entity=camera.live");
    expect(location.search).toContain("ring-view-mode=live");
    expect(history.state.refreshUrl).toContain("ring-view-mode=live");

    document.body.replaceChildren();
    history.replaceState(null, "", history.state.refreshUrl);
    vi.useFakeTimers();
    const restoredCard = await mount();
    await vi.advanceTimersByTimeAsync(0);
    await restoredCard.updateComplete;

    const restoredDialog = getDialog();
    expect(restoredCard.shadowRoot?.querySelector("ring-view-dialog")).toBeNull();
    expect(restoredDialog?.open).toBe(true);
    expect(
      restoredDialog?.shadowRoot
        ?.querySelector("#ring-view-tab-live")
        ?.getAttribute("aria-selected"),
    ).toBe("true");
    expect(TestCameraStream.active).toBe(1);
    const restoredPlayer = restoredDialog?.shadowRoot?.querySelector("ring-view-native-camera-adapter");
    expect(restoredPlayer?.muted).toBe(true);
    // Successful automatic recovery keeps the same renderer with no retries.
    await vi.advanceTimersByTimeAsync(120_000);
    await restoredDialog?.updateComplete;
    expect(TestCameraStream.active).toBe(1);
    expect(restoredDialog?.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBe(restoredPlayer);

    vi.useRealTimers();
    restoredDialog?.close();
    await flush();
    expect(location.search).not.toContain("ring-view-");
    expect(TestCameraStream.active).toBe(0);
  });

  it("replaces a failed talkback session with one reconnecting surface", async () => {
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      two_way_audio: true,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();

    expect(dialog?.shadowRoot?.textContent).toContain("Reconnecting live view…");
    expect(dialog?.shadowRoot?.textContent).not.toContain(
      "Connecting video and incoming audio.",
    );
    expect(dialog?.shadowRoot?.querySelector("ring-view-ring-webrtc-player")).toBeNull();
    expect(
      dialog?.shadowRoot?.querySelector('button[aria-label="Hold to talk"]'),
    ).toBeNull();
  });

  it("does not restore a viewer into a card for another camera pair", async () => {
    history.replaceState(
      null,
      "",
      "/?ring-view-live-entity=camera.entrance_live"
        + "&ring-view-recording-entity=camera.entrance_recording"
        + "&ring-view-mode=live",
    );
    const card = await mount();
    await flush();

    expect(card.shadowRoot?.querySelector("ring-view-dialog")).toBeNull();
    expect(getDialog()?.open).not.toBe(true);
    expect(TestCameraStream.active).toBe(0);
  });

  it("restores the viewer with the normal unavailable-camera state", async () => {
    history.replaceState(
      null,
      "",
      "/?ring-view-live-entity=camera.live"
        + "&ring-view-recording-entity=camera.recording"
        + "&ring-view-mode=live",
    );
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    card.hass = {
      ...hass,
      states: {
        ...hass.states,
        "camera.live": { ...hass.states["camera.live"]!, state: "unavailable" },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    await flush();

    const dialog = getDialog();
    expect(dialog?.open).toBe(true);
    expect(dialog?.shadowRoot?.textContent).toContain("Camera entity is unavailable.");
    expect(dialog?.shadowRoot?.querySelector("ring-view-native-camera-adapter")).toBeNull();
    expect(TestCameraStream.active).toBe(0);
  });

  it("keeps a still-active doorbell notice when restoring the viewer", async () => {
    const ringingUntil = Date.now() + 10_000;
    history.replaceState(
      null,
      "",
      "/?ring-view-live-entity=camera.live"
        + "&ring-view-recording-entity=camera.recording"
        + "&ring-view-mode=last_recording"
        + `&ring-view-ringing-until=${ringingUntil}`,
    );
    await mount();
    await flush();

    const alert = getDialog()?.shadowRoot?.querySelector(".doorbell-alert-layer");
    expect(alert?.textContent).toContain("Open live view");
    expect(alert?.textContent).not.toContain("Someone is at the door");
    expect(
      getDialog()?.shadowRoot?.querySelector(".ring-indicator")?.getAttribute("aria-label"),
    ).toBe("Someone is at the door");
    expect(getDialog()?.shadowRoot?.querySelector(".dialog-ring-alert")).toBeNull();
  });

  it.each([2_000, 20_000])("preserves the original doorbell alert expiry after %i ms detached", async (detachedFor) => {
    vi.useFakeTimers();
    const doorbell: HassEntity = {
      entity_id: "event.doorbell", state: "2026-09-07T12:00:00Z", attributes: { event_type: "ring" },
    };
    const card = document.createElement("ring-view");
    card.setConfig({ recording_entity: "camera.recording", live_entity: "camera.live", doorbell_entity: doorbell.entity_id });
    card.hass = { ...hass, states: { ...hass.states, [doorbell.entity_id]: doorbell } };
    document.body.append(card);
    await vi.advanceTimersByTimeAsync(0);
    card.hass = {
      ...card.hass, states: { ...card.hass.states, [doorbell.entity_id]: { ...doorbell, state: "2026-09-07T12:00:30Z" } },
    };
    await vi.advanceTimersByTimeAsync(0);
    expect(card.shadowRoot!.querySelector(".ring-alert")).not.toBeNull();
    await vi.advanceTimersByTimeAsync(1_000);
    card.remove();
    await vi.advanceTimersByTimeAsync(detachedFor);
    document.body.append(card);
    await vi.advanceTimersByTimeAsync(0);
    if (detachedFor < 11_000) {
      expect(card.shadowRoot!.querySelector(".ring-alert")).not.toBeNull();
      await vi.advanceTimersByTimeAsync(11_000 - detachedFor);
    }
    expect(card.shadowRoot!.querySelector(".ring-alert")).toBeNull();
    // An expired ring must not force Live when the configured default is Recording.
    card.shadowRoot!.querySelector<HTMLElement>(".preview")!.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(getDialog()?.shadowRoot?.querySelector("#ring-view-tab-recording")?.getAttribute("aria-selected")).toBe("true");
  });

  it("reuses the managed dialog safely when another card opens it", async () => {
    const first = await mount();
    first.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    expect(TestCameraStream.active).toBe(1);

    const secondRecording = camera("camera.garden_recording", 0);
    const secondLive = camera("camera.garden_live", 2);
    const second = document.createElement("ring-view");
    second.setConfig({
      recording_entity: secondRecording.entity_id,
      live_entity: secondLive.entity_id,
      name: "Garden",
      show_name: true,
      default_mode: "live",
    });
    second.hass = {
      ...hass,
      entities: {
        ...hass.entities,
        [secondRecording.entity_id]: {
          entity_id: secondRecording.entity_id,
          platform: "ring",
        },
        [secondLive.entity_id]: {
          entity_id: secondLive.entity_id,
          platform: "ring",
        },
      },
      states: {
        ...hass.states,
        [secondRecording.entity_id]: secondRecording,
        [secondLive.entity_id]: secondLive,
      },
    };
    document.body.append(second);
    await second.updateComplete;
    second.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();

    expect(getDialog()).toBe(dialog);
    expect(dialog?.shadowRoot?.querySelector("h2")?.textContent).toBe("Garden");
    expect(
      dialog?.shadowRoot?.querySelector("#ring-view-tab-live")?.getAttribute("aria-selected"),
    ).toBe("true");
    expect(TestCameraStream.active).toBe(1);
    dialog?.close();
    await flush();
    expect(TestCameraStream.active).toBe(0);
  });

  it("shows a temporary Ding indicator while Live is running", async () => {
    const doorbell: HassEntity = {
      entity_id: "event.front_door_ding",
      state: "2026-09-07T08:00:00Z",
      attributes: { event_type: "ring" },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      doorbell_entity: doorbell.entity_id,
      default_mode: "live",
    });
    card.hass = {
      ...hass,
      states: { ...hass.states, [doorbell.entity_id]: doorbell },
    };
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();

    const dialog = getDialog();
    expect(TestCameraStream.active).toBe(1);
    dialog!.hass = {
      ...hass,
      states: {
        ...hass.states,
        [doorbell.entity_id]: {
          ...doorbell,
          state: "2026-09-07T08:01:00Z",
        },
      },
    };
    await dialog!.updateComplete;
    await flush();

    expect(dialog?.shadowRoot?.querySelector(".doorbell-alert-layer")).toBeNull();
    const indicator = dialog?.shadowRoot?.querySelector(".ring-indicator");
    expect(indicator?.getAttribute("aria-label")).toBe("Someone is at the door");
    expect(TestCameraStream.active).toBe(1);
    dialog?.close();
  });

  it("keeps a global camera error primary when a Ding arrives in Live", async () => {
    const doorbell: HassEntity = {
      entity_id: "event.front_door_ding",
      state: "2026-09-07T08:00:00Z",
      attributes: { event_type: "ring" },
    };
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      doorbell_entity: doorbell.entity_id,
      default_mode: "live",
    });
    card.hass = {
      ...hass,
      states: { ...hass.states, [doorbell.entity_id]: doorbell },
    };
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();

    const dialog = getDialog();
    expect(TestCameraStream.active).toBe(1);
    card.remove();
    dialog!.hass = {
      ...hass,
      states: {
        ...hass.states,
        "camera.live": { ...hass.states["camera.live"]!, state: "unavailable" },
        [doorbell.entity_id]: {
          ...doorbell,
          state: "2026-09-07T08:01:00Z",
        },
      },
    };
    await dialog!.updateComplete;
    await flush();

    expect(dialog?.open).toBe(true);
    expect(dialog?.shadowRoot?.textContent).toContain("Camera entity is unavailable.");
    expect(dialog?.shadowRoot?.querySelector(".doorbell-alert-layer")).toBeNull();
    expect(
      dialog?.shadowRoot?.querySelector(".ring-indicator")?.getAttribute("aria-label"),
    ).toBe("Someone is at the door");
    expect(TestCameraStream.active).toBe(0);
    dialog?.close();
  });

  it("starts the temporary recording with audio and falls back muted if blocked", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    card.hass = {
      ...hass,
      states: {
        ...hass.states,
        "camera.recording": {
          ...hass.states["camera.recording"]!,
          attributes: {
            ...hass.states["camera.recording"]!.attributes,
            video_url: "https://example.test/latest-recording.mp4",
          },
        },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();

    const dialog = getDialog();
    const video = dialog?.shadowRoot?.querySelector<HTMLVideoElement>("video");
    expect(video?.src).toBe("https://example.test/latest-recording.mp4");
    expect(video?.muted).toBe(false);
    expect(TestCameraStream.active).toBe(0);
    const play = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new DOMException("Autoplay blocked", "NotAllowedError"))
      .mockResolvedValueOnce(undefined);
    Object.defineProperty(video, "play", { configurable: true, value: play });
    video?.dispatchEvent(new Event("canplay"));
    await flush();
    expect(play).toHaveBeenCalledTimes(2);
    expect(video?.muted).toBe(true);
    expect(dialog?.shadowRoot?.textContent).toContain(
      "Audio is muted because the browser blocked audible autoplay.",
    );
    expect(video?.controls).toBe(true);
    expect(dialog?.shadowRoot?.querySelector(".audio-button")).toBeNull();
    expect(play).toHaveBeenCalledTimes(2);

    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    expect(dialog?.shadowRoot?.querySelector("video")).toBeNull();
    expect(TestCameraStream.active).toBe(1);
  });

  it("announces when Home Assistant reports live audio", async () => {
    const card = await mount();
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();
    const stream = dialog?.shadowRoot
      ?.querySelector("ring-view-native-camera-adapter")
      ?.shadowRoot?.querySelector<TestCameraStream>("ha-camera-stream");
    expect(stream?.muted).toBe(false);
    const player = document.createElement("span");
    stream?.shadowRoot?.append(player);
    player.dispatchEvent(
      new CustomEvent("streams", {
        detail: { hasAudio: true, hasVideo: true },
        bubbles: true,
        composed: true,
      }),
    );
    await flush();
    expect(dialog?.shadowRoot?.textContent).toContain(
      "Live view connected. Audio is available.",
    );

    expect(dialog?.shadowRoot?.querySelector(".audio-button")).toBeNull();
    expect(stream?.muted).toBe(false);
    expect(TestCameraStream.active).toBe(1);
  });

  it("uses native playback without a talk button for an unsupported live platform", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      two_way_audio: true,
    });
    card.hass = {
      ...hass,
      entities: {
        ...hass.entities,
        "camera.live": { entity_id: "camera.live", platform: "generic" },
      },
    };
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();

    expect(
      dialog?.shadowRoot?.querySelector("ring-view-ring-webrtc-player"),
    ).toBeNull();
    expect(
      dialog?.shadowRoot?.querySelector("ring-view-native-camera-adapter"),
    ).not.toBeNull();
    expect(dialog?.shadowRoot?.textContent).not.toContain("Hold to talk");
  });

  it("leaves fullscreen and audio to the native media controls", async () => {
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      live_muted: true,
    });
    card.hass = hass;
    document.body.append(card);
    await card.updateComplete;
    card.shadowRoot?.querySelector<HTMLElement>(".preview")?.click();
    await flush();
    const dialog = getDialog();
    expect(
      dialog?.shadowRoot?.querySelector("#ring-view-tab-recording .mode-icon-recording"),
    ).not.toBeNull();
    expect(
      dialog?.shadowRoot?.querySelector("#ring-view-tab-live .mode-icon-live"),
    ).not.toBeNull();
    dialog?.shadowRoot?.querySelector<HTMLElement>("#ring-view-tab-live")?.click();
    await flush();

    const adapter =
      dialog?.shadowRoot?.querySelector<RingViewNativeCameraAdapter>(
        "ring-view-native-camera-adapter",
      );
    const stream = adapter?.shadowRoot?.querySelector<
      TestCameraStream & { controls?: boolean }
    >(
      "ha-camera-stream",
    );
    expect(stream?.controls).toBe(true);
    expect(stream?.muted).toBe(true);
    expect(adapter?.passiveSurface).toBe(true);
    expect(dialog?.shadowRoot?.querySelector(".audio-button")).toBeNull();
    expect(
      dialog?.shadowRoot?.querySelector('[aria-label="Enter fullscreen"]'),
    ).toBeNull();
    expect(TestCameraStream.active).toBe(1);
  });
});
