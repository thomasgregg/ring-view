import type {
  HassEntity,
  HomeAssistant,
  PreviewSource,
} from "../src/types";

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
const live: HassEntity = {
  entity_id: "camera.live_view",
  state: "idle",
  attributes: {
    friendly_name: "Live camera",
    entity_picture: "/demo/camera-preview.svg",
    supported_features: 2,
  },
};

let hass: HomeAssistant = {
  language,
  locale: { language },
  states: {
    [recording.entity_id]: recording,
    [live.entity_id]: live,
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
  formatEntityName: (entity, override) => override || entity.attributes.friendly_name || entity.entity_id,
};

const card = document.createElement("ring-view");
const requestedPreview = query.get("preview");
const previewSource: PreviewSource =
  requestedPreview === "live" || requestedPreview === "default"
    ? requestedPreview
    : "last_recording";
card.setConfig({
  type: "custom:ring-view",
  recording_entity: recording.entity_id,
  live_entity: live.entity_id,
  name: "Entrance",
  default_mode: query.get("mode") === "live" ? "live" : "last_recording",
  remember_last_mode: query.get("remember") === "1",
  autoplay_recording: query.get("autoplay") !== "0",
  show_name: query.get("name") === "1",
  preview_source: previewSource,
  show_mode_icon: query.get("icon") !== "0",
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
};

declare global {
  interface Window {
    demoActiveStreams?: number;
    demoPeakStreams?: number;
    demoSetEntityState: (entityId: string, state: string) => void;
  }
}
