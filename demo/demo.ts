import type { HassEntity, HomeAssistant } from "../src/types";

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
        .live { position:absolute; inset:14px auto auto 14px; display:flex; align-items:center; gap:7px; padding:6px 10px; border-radius:7px; color:#fff; background:rgba(0,0,0,.62); font:600 12px system-ui; }
        .live::before { content:""; width:8px; height:8px; border-radius:50%; background:#ff453a; }
        .controls { position:absolute; inset:auto 0 0; height:46px; background:linear-gradient(transparent,rgba(0,0,0,.72)); }
      </style>
      <div class="frame">
        <div class="camera-image" role="img" aria-label="Synthetic demo camera media"></div>
        ${live ? '<span class="live">LIVE</span>' : ""}
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

await import("../src/index");

const query = new URLSearchParams(location.search);
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
  states: {
    [recording.entity_id]: recording,
    [live.entity_id]: live,
  },
  hassUrl: (path = "") => path,
  callWS: async () => ({}) as never,
  formatEntityName: (entity, override) => override || entity.attributes.friendly_name || entity.entity_id,
};

const card = document.createElement("ring-view");
card.setConfig({
  type: "custom:ring-view",
  recording_entity: recording.entity_id,
  live_entity: live.entity_id,
  name: "Entrance",
  preview: { show_name: query.get("name") === "1", show_mode_badge: true },
  performance: { live_timeout_seconds: 10, retry_live_once: true },
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
