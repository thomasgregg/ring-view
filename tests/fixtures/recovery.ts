// A local camera endpoint with real browser WebRTC peers and moving frames.
// Only HA signaling and microphone capture are substituted; the card's SDP,
// ICE, media element, decoding, playback and talk sender run normally.
import "../../src/index";
import { installDemoDialogManager } from "../../demo/dialog-manager";
import type { HomeAssistant } from "../../src/types";

type Signal = Record<string, unknown>;
type Session = {
  peer: RTCPeerConnection;
  candidates: RTCIceCandidateInit[];
  stream: MediaStream;
  timer: number;
  closed: boolean;
};
type Subscription = {
  callback: (message: Signal) => void;
  message: Record<string, unknown>;
  options?: { resubscribe?: boolean; preCheck?: () => boolean };
  sessionId: string;
};

customElements.define("ha-card", class extends HTMLElement {});
const sessions = new Map<string, Session>();
const subscriptions = new Set<Subscription>();
const disconnectedListeners = new Set<() => void>();
const audioContext = new AudioContext();
let nextSession = 0;
let reconnectSubscriptions: Subscription[] = [];
let microphone: MediaStreamTrack | undefined;
const state = {
  offers: 0,
  active: 0,
  closed: 0,
  candidateMessages: 0,
  getUserMediaCalls: 0,
  blockedPlayCalls: 0,
  initialUserActivation: navigator.userActivation.hasBeenActive,
  failNextOffer: new URLSearchParams(location.search).has("fail_first_offer"),
  blockPlayback: new URLSearchParams(location.search).has("block_playback"),
  errors: [] as string[],
};

function makeAudio(): MediaStream {
  const destination = audioContext.createMediaStreamDestination();
  // A synthetic silent source avoids accessing any physical microphone.
  const source = audioContext.createConstantSource();
  source.offset.value = 0;
  source.connect(destination);
  source.start();
  destination.stream.getAudioTracks()[0]!.addEventListener("ended", () => source.stop());
  return destination.stream;
}

Object.defineProperty(Object.getPrototypeOf(navigator.mediaDevices), "getUserMedia", {
  configurable: true,
  value: async () => {
    state.getUserMediaCalls += 1;
    const stream = makeAudio();
    microphone = stream.getAudioTracks()[0];
    return stream;
  },
});

// Deterministically exercise WKWebView's gesture-required outcome while still
// decoding actual frames through a real peer connection.
const originalPlay = HTMLMediaElement.prototype.play;
let autoplayProbeStarted = false;
HTMLMediaElement.prototype.play = function () {
  if (state.blockPlayback) {
    state.blockedPlayCalls += 1;
    this.autoplay = false;
    this.pause();
    return Promise.reject(new DOMException("Gesture required", "NotAllowedError"));
  }
  const activationAtPlay = navigator.userActivation.hasBeenActive;
  const result = originalPlay.call(this);
  if (new URLSearchParams(location.search).has("autoplay_probe") && !autoplayProbeStarted && this instanceof HTMLVideoElement) {
    autoplayProbeStarted = true;
    const video = this;
    // Report from the page itself before Playwright inspects anything: its
    // evaluate/locator helpers can otherwise grant a simulated user gesture.
    void result.then(() => {
      let frames = 0;
      const firstTime = video.currentTime;
      const sample = () => {
        if (++frames < 6) { video.requestVideoFrameCallback(sample); return; }
        console.info(`RING_VIEW_AUTOPLAY_PROOF ${JSON.stringify({
          initialUserActivation: state.initialUserActivation,
          activationAtPlay, activationAfterFrames: navigator.userActivation.hasBeenActive,
          muted: video.muted, frames, elapsed: video.currentTime - firstTime,
          offers: state.offers, getUserMediaCalls: state.getUserMediaCalls,
        })}`);
      };
      video.requestVideoFrameCallback(sample);
    }).catch(() => undefined);
  }
  return result;
};
document.addEventListener("click", (event) => {
  void audioContext.resume();
  if (event.composedPath().some((target) =>
    target instanceof HTMLElement && target.classList.contains("playback-resume"))) {
    state.blockPlayback = false;
  }
}, true);

function closeSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (!session || session.closed) return;
  session.closed = true;
  session.peer.close();
  session.stream.getTracks().forEach((track) => track.stop());
  clearInterval(session.timer);
  state.active -= 1;
  state.closed += 1;
}

async function signal(subscription: Subscription): Promise<void> {
  const { callback, sessionId, message } = subscription;
  if (state.failNextOffer) {
    state.failNextOffer = false;
    callback({ type: "error", message: "Test camera unavailable" });
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = 320;
  canvas.height = 180;
  const context = canvas.getContext("2d")!;
  let frame = 0;
  const paint = () => {
    context.fillStyle = `hsl(${frame * 9 % 360}, 65%, 35%)`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "white";
    context.font = "22px sans-serif";
    context.fillText(`Test camera · ${++frame}`, 25, 90);
  };
  paint();
  const stream = canvas.captureStream(10);
  const audio = makeAudio();
  stream.addTrack(audio.getAudioTracks()[0]!);
  const peer = new RTCPeerConnection();
  const session: Session = {
    peer, stream, candidates: [], closed: false,
    timer: window.setInterval(paint, 100),
  };
  sessions.set(sessionId, session);
  state.active += 1;
  callback({ type: "session", session_id: sessionId });
  peer.onicecandidate = (event) => {
    if (event.candidate && !session.closed && connection.connected) {
      callback({ type: "candidate", candidate: event.candidate.toJSON() });
    }
  };
  await peer.setRemoteDescription({ type: "offer", sdp: String(message.offer) });
  if (session.closed) return;
  for (const candidate of session.candidates.splice(0)) await peer.addIceCandidate(candidate);
  for (const track of stream.getTracks()) peer.addTrack(track, stream);
  await peer.setLocalDescription(await peer.createAnswer());
  if (!session.closed && connection.connected) {
    callback({ type: "answer", answer: peer.localDescription!.sdp });
  }
}

const connection = {
  connected: true,
  addEventListener: (_event: "disconnected", listener: () => void) => disconnectedListeners.add(listener),
  removeEventListener: (_event: "disconnected", listener: () => void) => disconnectedListeners.delete(listener),
  async subscribeMessage<T>(
    callback: (message: T) => void,
    message: Record<string, unknown>,
    options?: Subscription["options"],
  ) {
    if (options?.preCheck && !options.preCheck()) throw new Error("Pre-check failed");
    const subscription: Subscription = {
      callback: callback as (message: Signal) => void,
      message, options, sessionId: `test-session-${++nextSession}`,
    };
    state.offers += 1;
    subscriptions.add(subscription);
    queueMicrotask(() => void signal(subscription).catch((error: Error) => {
      if (!sessions.get(subscription.sessionId)?.closed) {
        state.errors.push(error.message);
        callback({ type: "error", message: error.message } as T);
      }
    }));
    return () => {
      subscriptions.delete(subscription);
      closeSession(subscription.sessionId);
    };
  },
};

const camera = (entity_id: string) => ({
  entity_id, state: "idle",
  attributes: { friendly_name: "Entrance", entity_picture: "/demo/camera-preview.svg", supported_features: 2 },
});
let hass: HomeAssistant = {
  language: "en",
  states: { "camera.live_view": camera("camera.live_view"), "camera.latest_recording": camera("camera.latest_recording") },
  entities: { "camera.live_view": { entity_id: "camera.live_view", platform: "ring" } },
  hassUrl: (path = "") => path,
  connection,
  callWS: async <T>(message: Record<string, unknown>): Promise<T> => {
    if (message.type === "camera/webrtc/get_client_config") return { configuration: {} } as T;
    if (message.type === "camera/webrtc/candidate") {
      state.candidateMessages += 1;
      const session = sessions.get(String(message.session_id));
      if (session && !session.closed) {
        const candidate = message.candidate as RTCIceCandidateInit;
        if (session.peer.remoteDescription) await session.peer.addIceCandidate(candidate);
        else session.candidates.push(candidate);
      }
    }
    return {} as T;
  },
};
const manager = installDemoDialogManager(() => hass);
const config = {
  recording_entity: "camera.latest_recording", live_entity: "camera.live_view",
  name: "Entrance", show_name: true, default_mode: "live" as const, two_way_audio: true, live_muted: true,
};
function createCard() {
  const card = document.createElement("ring-view");
  card.setConfig(config);
  card.hass = hass;
  return card;
}
let card = createCard();
document.body.append(card);

const recovery = {
  state,
  async diagnostics() {
    const video = document.querySelector("ring-view-dialog")?.shadowRoot
      ?.querySelector("ring-view-ring-webrtc-player")?.shadowRoot?.querySelector("video");
    return {
      state, visibility: document.visibilityState, audio: audioContext.state,
      video: video && { paused: video.paused, readyState: video.readyState, time: video.currentTime },
      sessions: await Promise.all([...sessions.values()].map(async (session) => ({
        closed: session.closed,
        connection: session.peer.connectionState,
        ice: session.peer.iceConnectionState,
        outbound: [...(await session.peer.getStats()).values()]
          .filter((stat) => stat.type === "outbound-rtp")
          .map((stat) => ({ kind: stat.kind, bytesSent: stat.bytesSent, framesSent: stat.framesSent })),
      }))),
    };
  },
  get microphone() { return microphone ? { enabled: microphone.enabled, readyState: microphone.readyState } : undefined; },
  disconnect() {
    connection.connected = false;
    reconnectSubscriptions = [...subscriptions];
    for (const sessionId of sessions.keys()) closeSession(sessionId);
    for (const listener of [...disconnectedListeners]) listener();
  },
  async reconnect() {
    connection.connected = true;
    // HA normally replays subscriptions with the original offer and callback.
    for (const subscription of reconnectSubscriptions) {
      if (subscription.options?.resubscribe === false) continue;
      if (subscription.options?.preCheck && !subscription.options.preCheck()) continue;
      await connection.subscribeMessage(subscription.callback, subscription.message, subscription.options);
    }
    reconnectSubscriptions = [];
    hass = { ...hass };
    card.hass = hass;
    manager.updateHass(hass);
  },
  recreateCard() {
    const replacement = createCard();
    card.replaceWith(replacement);
    card = replacement;
  },
};
window.recovery = recovery;
declare global { interface Window { recovery: typeof recovery } }
