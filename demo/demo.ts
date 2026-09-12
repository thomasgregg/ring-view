import type {
  HassEntity,
  HomeAssistant,
  PreviewSource,
} from "../src/types";
import "../src/media/ring-webrtc-player";
import { installDemoDialogManager } from "./dialog-manager";

class HaCard extends HTMLElement {}

class DemoCameraStream extends HTMLElement {
  private entity?: HassEntity;
  private readyTimer?: number;
  private connected = false;

  public set stateObj(value: HassEntity | undefined) {
    this.entity = value;
    this.renderStream();
  }

  public get stateObj(): HassEntity | undefined {
    return this.entity;
  }

  public connectedCallback(): void {
    this.connected = true;
    window.demoActiveStreams = (window.demoActiveStreams ?? 0) + 1;
    window.demoPeakStreams = Math.max(
      window.demoPeakStreams ?? 0,
      window.demoActiveStreams,
    );
    this.renderStream();
  }

  public disconnectedCallback(): void {
    this.connected = false;
    if (this.readyTimer !== undefined) window.clearTimeout(this.readyTimer);
    window.demoActiveStreams = Math.max(0, (window.demoActiveStreams ?? 1) - 1);
  }

  private renderStream(): void {
    if (!this.connected || !this.entity) return;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    const live = this.entity.entity_id.endsWith("live_view");
    this.shadowRoot!.innerHTML = `
      <style>
        :host { display:block; width:100%; height:100%; background:#000; }
        .frame { position:relative; width:100%; height:100%; overflow:hidden; background:#000; }
        .camera-image { width:100%; height:100%; background:url('/demo/camera-preview.svg') center/cover no-repeat; ${live ? "filter:saturate(1.08) brightness(.96);" : ""} }
        .controls { position:absolute; inset:auto 0 0; height:46px; background:linear-gradient(transparent,rgba(0,0,0,.72)); }
      </style>
      <div class="frame">
        <div class="camera-image" role="img" aria-label="Synthetic demo camera media"></div>
        <span class="controls"></span>
      </div>
    `;
    if (this.readyTimer !== undefined) window.clearTimeout(this.readyTimer);
    const delay = Number(new URLSearchParams(location.search).get("delay") ?? 700);
    this.readyTimer = window.setTimeout(() => {
      this.shadowRoot?.dispatchEvent(
        new CustomEvent("streams", {
          detail: { hasVideo: true, hasAudio: live },
          bubbles: true,
          composed: true,
        }),
      );
      this.dispatchEvent(new CustomEvent("load"));
    }, delay);
  }
}

if (!customElements.get("ha-card")) customElements.define("ha-card", HaCard);
if (!customElements.get("ha-camera-stream")) {
  customElements.define("ha-camera-stream", DemoCameraStream);
}

const query = new URLSearchParams(location.search);
const language = query.get("lang") || "en";
const ringTeardownRaceMode = query.get("ring_teardown_race");
const emulateRingTeardownRace =
  ringTeardownRaceMode === "1" || ringTeardownRaceMode === "reload";
const ringReloadReservationKey = "demo-ring-reload-reserved-until";
document.documentElement.lang = language;

await import("../src/index");

if (query.get("theme") === "dark") document.documentElement.dataset.theme = "dark";

const recording: HassEntity = {
  entity_id: "camera.latest_recording",
  state: "idle",
  attributes: {
    friendly_name: "Latest recording",
    entity_picture: "/demo/camera-preview.svg",
    supported_features: 0,
  },
};
const mqttRecording: HassEntity = {
  entity_id: "select.front_door_event_select",
  state: "Ding 1",
  attributes: {
    friendly_name: "Front Door Event Select",
    eventId: "demo-event-1",
    recordingUrl: query.get("mqtt_recording") === "missing"
      ? "<Recording Not Found>"
      : "/demo/pending-recording.mp4?event=1",
  },
};
const live: HassEntity = {
  entity_id: "camera.live_view",
  state: "idle",
  attributes: {
    friendly_name: "Live camera",
    entity_picture: "/demo/camera-preview.svg",
    supported_features: 2,
  },
};
const snapshot: HassEntity = {
  entity_id: "camera.device_snapshot",
  state: "idle",
  attributes: {
    friendly_name: "Device snapshot",
    entity_picture: "/demo/camera-preview.svg?source=snapshot",
    supported_features: 0,
    timestamp: Date.parse("2026-09-06T12:01:00Z") / 1_000,
  },
};
const snapshotRefresh: HassEntity = {
  entity_id: "button.device_take_snapshot",
  state: "unknown",
  attributes: {
    friendly_name: "Device Take Snapshot",
  },
};
const activityAgeSeconds = Number(query.get("activity_age") ?? 125);
const activity: HassEntity = {
  entity_id: "sensor.front_door_last_activity",
  state: query.get("activity_value")
    ?? new Date(Date.now() - activityAgeSeconds * 1_000).toISOString(),
  attributes: {
    friendly_name: "Front Door Last Activity",
    device_class: "timestamp",
  },
};
const mqttActivity: HassEntity = {
  entity_id: "binary_sensor.front_door_activity",
  state: "off",
  attributes: {
    friendly_name: "Front Door Activity",
    lastDingTime: activity.state,
  },
};
const door: HassEntity = {
  entity_id: "lock.front_door",
  state: query.get("door_state") || "locked",
  attributes: {
    friendly_name: "Front Door",
    supported_features: 1,
  },
};
const doorContact: HassEntity = {
  entity_id: "binary_sensor.front_door_contact",
  state: query.get("door_contact_state") || "off",
  attributes: {
    friendly_name: "Front Door Contact",
    device_class: "door",
  },
};
const doorbell: HassEntity = {
  entity_id: "binary_sensor.front_door_ding",
  state: "off",
  attributes: {
    friendly_name: "Front Door Ding",
    device_class: "occupancy",
  },
};
recording.attributes.recorded_at = "2026-09-06T12:00:00Z";
if (query.get("recording_video") === "pending") {
  recording.attributes.video_url = "/demo/pending-recording.mp4";
}

let ringSubscriptions = 0;
let ringSessionSequence = 0;

let hass: HomeAssistant = {
  language,
  locale: { language },
  entities: {
    [recording.entity_id]: {
      entity_id: recording.entity_id,
      platform: "ring",
    },
    [mqttRecording.entity_id]: {
      entity_id: mqttRecording.entity_id,
      platform: "mqtt",
      device_id: "demo-ring-device",
      unique_id: "demo-ring-device_event_select",
      original_name: "Event Select",
    },
    [live.entity_id]: {
      entity_id: live.entity_id,
      platform: query.get("live_platform") || "ring",
    },
    [snapshot.entity_id]: {
      entity_id: snapshot.entity_id,
      platform: "mqtt",
      device_id: "demo-ring-device",
      unique_id: "demo-ring-device_snapshot",
      original_name: "Snapshot",
    },
    [snapshotRefresh.entity_id]: {
      entity_id: snapshotRefresh.entity_id,
      platform: "mqtt",
      device_id: "demo-ring-device",
      unique_id: "demo-ring-device_take_snapshot",
      original_name: "Take Snapshot",
    },
    [activity.entity_id]: {
      entity_id: activity.entity_id,
      platform: "demo",
    },
    [mqttActivity.entity_id]: {
      entity_id: mqttActivity.entity_id,
      platform: "mqtt",
      device_id: "demo-ring-device",
    },
    [door.entity_id]: {
      entity_id: door.entity_id,
      platform: "demo",
    },
    [doorContact.entity_id]: {
      entity_id: doorContact.entity_id,
      platform: "demo",
    },
    [doorbell.entity_id]: {
      entity_id: doorbell.entity_id,
      platform: "mqtt",
    },
  },
  states: {
    [recording.entity_id]: recording,
    [mqttRecording.entity_id]: mqttRecording,
    [live.entity_id]: live,
    [snapshot.entity_id]: snapshot,
    [snapshotRefresh.entity_id]: snapshotRefresh,
    [activity.entity_id]: activity,
    [mqttActivity.entity_id]: mqttActivity,
    [door.entity_id]: door,
    [doorContact.entity_id]: doorContact,
    [doorbell.entity_id]: doorbell,
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
  callService: async (domain, service, serviceData = {}, target) => {
    window.demoDoorCalls = [
      ...(window.demoDoorCalls ?? []),
      { domain, service, serviceData, target },
    ];
    if (
      domain === "button"
      && service === "press"
      && target?.entity_id === snapshotRefresh.entity_id
    ) {
      queueMicrotask(() => window.demoRefreshSnapshot());
    }
    if (
      domain === "select"
      && service === "select_option"
      && target?.entity_id === mqttRecording.entity_id
    ) {
      queueMicrotask(() => window.demoRefreshRecording());
    }
  },
  connection: {
    subscribeMessage: async <T>(callback: (message: T) => void) => {
      if (!emulateRingTeardownRace) return () => undefined;

      const reloadReservationActive =
        ringTeardownRaceMode === "reload"
        && Number(sessionStorage.getItem(ringReloadReservationKey) ?? 0) > Date.now();
      ringSubscriptions += 1;
      window.demoRingSubscriptions = ringSubscriptions;
      const sessionId = `demo-ring-session-${++ringSessionSequence}`;
      queueMicrotask(() => callback({ type: "session", session_id: sessionId } as T));
      if (ringSubscriptions > 1 || reloadReservationActive) {
        queueMicrotask(() => callback({
          type: "error",
          code: "session_in_use",
          message: "The previous Ring live session is still closing.",
        } as T));
      }

      return () => {
        // Ring's signaling websocket can outlive the frontend subscription
        // while its close handshake finishes. Keep it reserved long enough to
        // expose an incorrect second dialog open deterministically.
        if (ringTeardownRaceMode === "reload") {
          sessionStorage.setItem(
            ringReloadReservationKey,
            String(Date.now() + 10_000),
          );
        }
        window.setTimeout(() => {
          ringSubscriptions = Math.max(0, ringSubscriptions - 1);
          window.demoRingSubscriptions = ringSubscriptions;
        }, 10_000);
      };
    },
  },
  formatEntityName: (entity, override) => override || entity.attributes.friendly_name || entity.entity_id,
};

if (ringTeardownRaceMode === "reload") {
  window.addEventListener("pagehide", () => {
    if (ringSubscriptions === 0) return;
    sessionStorage.setItem(
      ringReloadReservationKey,
      String(Date.now() + 10_000),
    );
  });
}
const dialogManager = installDemoDialogManager(() => hass);

const card = document.createElement("ring-view");
const requestedPreview = query.get("preview");
const previewSource: PreviewSource =
  requestedPreview === "live"
  || requestedPreview === "default"
  || requestedPreview === "snapshot"
  || requestedPreview === "newest"
    ? requestedPreview
    : "last_recording";
card.setConfig({
  type: "custom:ring-view",
  recording_entity: query.get("recording_source") === "mqtt"
    ? mqttRecording.entity_id
    : recording.entity_id,
  live_entity: live.entity_id,
  snapshot_entity: snapshot.entity_id,
  last_activity_entity:
    query.get("activity") === "1"
      ? query.get("activity_source") === "mqtt"
        ? mqttActivity.entity_id
        : activity.entity_id
      : undefined,
  name: query.get("camera_name") || "Entrance",
  default_mode: query.get("mode") === "live" ? "live" : "last_recording",
  remember_last_mode: query.get("remember") === "1",
  autoplay_recording: query.get("autoplay") !== "0",
  show_name: query.get("name") === "1",
  preview_source: previewSource,
  preview_fallback: query.get("fallback") === "snapshot" ? "snapshot" : "last_recording",
  two_way_audio: query.get("two_way_audio") === "1",
  doorbell_entity: query.get("doorbell") === "1" ? doorbell.entity_id : undefined,
  door_entity: query.get("door") === "1" ? door.entity_id : undefined,
  door_contact_entity:
    query.get("door_contact") === "1" ? doorContact.entity_id : undefined,
  door_action: query.get("door_action") === "open" ? "open" : "unlock",
  door_control_visibility:
    query.get("door_visibility") === "all" ? "all_views" : "live_only",
  door_hold_to_activate: query.get("door_hold") !== "0",
  dashboard_behavior:
    query.get("dashboard") === "interactive" ? "interactive" : "open_viewer",
  dashboard_start:
    query.get("dashboard_start") === "recording"
      ? "last_recording"
      : query.get("dashboard_start") === "live"
        ? "live"
        : "on_demand",
  dashboard_live_muted: query.get("dashboard_muted") !== "0",
  door_control_location:
    query.get("dashboard_door") === "1"
      ? "dashboard_and_viewer"
      : "viewer_only",
  show_snapshot_button: query.get("snapshot_button") === "1",
  snapshot_directory: query.get("snapshot_directory") || "/media/ring-view",
});
card.hass = hass;
document.querySelector("#card-root")!.append(card);

window.demoSetEntityState = (entityId: string, state: string) => {
  const current = hass.states[entityId];
  if (!current) return;
  hass = {
    ...hass,
    states: { ...hass.states, [entityId]: { ...current, state } },
  };
  card.hass = hass;
  dialogManager.updateHass(hass);
};

window.demoRefreshSnapshot = () => {
  const current = hass.states[snapshot.entity_id];
  if (!current) return;
  const previousTimestamp = Number(current.attributes.timestamp ?? 0);
  hass = {
    ...hass,
    states: {
      ...hass.states,
      [snapshot.entity_id]: {
        ...current,
        attributes: {
          ...current.attributes,
          timestamp: Math.max(
            Math.floor(Date.now() / 1_000),
            previousTimestamp + 1,
          ),
        },
      },
    },
  };
  card.hass = hass;
  dialogManager.updateHass(hass);
};

window.demoRefreshRecording = () => {
  const current = hass.states[mqttRecording.entity_id];
  if (!current) return;
  hass = {
    ...hass,
    states: {
      ...hass.states,
      [mqttRecording.entity_id]: {
        ...current,
        attributes: {
          ...current.attributes,
          recordingUrl: `/demo/pending-recording.mp4?event=${Date.now()}`,
        },
      },
    },
  };
  card.hass = hass;
  dialogManager.updateHass(hass);
};

declare global {
  interface Window {
    demoActiveStreams?: number;
    demoPeakStreams?: number;
    demoRingSubscriptions?: number;
    demoDoorCalls?: Array<{
      domain: string;
      service: string;
      serviceData: Record<string, unknown>;
      target?: Record<string, unknown>;
    }>;
    demoSetEntityState: (entityId: string, state: string) => void;
    demoRefreshSnapshot: () => void;
    demoRefreshRecording: () => void;
  }
}
