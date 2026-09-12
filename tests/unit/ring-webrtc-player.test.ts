import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/media/ring-webrtc-player";
import type { HomeAssistant } from "../../src/types";
import type { RingViewRingWebRtcPlayer } from "../../src/media/ring-webrtc-player";
import "../../src/ring-view-dialog";
import { normalizeConfig } from "../../src/config";

class MockTrack extends EventTarget {
  public enabled = true;
  public readonly kind: "audio" | "video";
  public readyState: MediaStreamTrackState = "live";
  public stop = vi.fn(() => {
    this.readyState = "ended";
  });

  public constructor(kind: "audio" | "video") {
    super();
    this.kind = kind;
  }
}

class MockMediaStream {
  private tracks: MockTrack[];

  public constructor(tracks: MockTrack[] = []) {
    this.tracks = [...tracks];
  }

  public addTrack(track: MockTrack): void {
    this.tracks.push(track);
  }

  public getTracks(): MockTrack[] {
    return [...this.tracks];
  }

  public getAudioTracks(): MockTrack[] {
    return this.tracks.filter((track) => track.kind === "audio");
  }
}

class MockPeerConnection {
  public static instances: MockPeerConnection[] = [];
  public connectionState: RTCPeerConnectionState = "new";
  public signalingState: RTCSignalingState = "stable";
  public localDescription: RTCSessionDescriptionInit | null = null;
  public remoteDescription: RTCSessionDescriptionInit | null = null;
  public ontrack: ((event: RTCTrackEvent) => void) | null = null;
  public onicecandidate: ((event: RTCPeerConnectionIceEvent) => void) | null = null;
  public onconnectionstatechange: ((event: Event) => void) | null = null;
  public readonly transceivers: Array<{ kind: string; direction?: RTCRtpTransceiverDirection }> = [];
  public readonly replaceTrack = vi.fn<(track: MediaStreamTrack | null) => Promise<void>>(
    async () => undefined,
  );
  public readonly close = vi.fn();
  public readonly setRemoteDescription = vi.fn(async (description: RTCSessionDescriptionInit) => {
    this.remoteDescription = description;
  });
  public readonly addIceCandidate = vi.fn(async () => undefined);

  public constructor() {
    MockPeerConnection.instances.push(this);
  }

  public createDataChannel(): RTCDataChannel {
    return {} as RTCDataChannel;
  }

  public addTransceiver(
    kind: string,
    init?: RTCRtpTransceiverInit,
  ): RTCRtpTransceiver {
    this.transceivers.push({ kind, direction: init?.direction });
    return {
      sender: { replaceTrack: this.replaceTrack } as unknown as RTCRtpSender,
    } as RTCRtpTransceiver;
  }

  public async createOffer(): Promise<RTCSessionDescriptionInit> {
    return { type: "offer", sdp: "v=0\r\n" };
  }

  public async setLocalDescription(description: RTCSessionDescriptionInit): Promise<void> {
    this.localDescription = description;
  }
}

async function flush(): Promise<void> {
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  await new Promise<void>((resolve) => setTimeout(resolve, 0));
}

function dispatchPointer(
  target: Element,
  type: "pointerdown" | "pointerup" | "pointercancel",
  pointerId = 1,
): void {
  const event = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent;
  Object.defineProperties(event, {
    button: { value: 0 },
    isPrimary: { value: true },
    pointerId: { value: pointerId },
  });
  target.dispatchEvent(event);
}

describe("Ring WebRTC player", () => {
  const originalMediaDevices = Object.getOwnPropertyDescriptor(navigator, "mediaDevices");
  const originalSecureContext = Object.getOwnPropertyDescriptor(window, "isSecureContext");

  beforeEach(() => {
    MockPeerConnection.instances = [];
    vi.stubGlobal("RTCPeerConnection", MockPeerConnection);
    vi.stubGlobal("MediaStream", MockMediaStream);
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    if (originalMediaDevices) {
      Object.defineProperty(navigator, "mediaDevices", originalMediaDevices);
    } else {
      Reflect.deleteProperty(navigator, "mediaDevices");
    }
    if (originalSecureContext) {
      Object.defineProperty(window, "isSecureContext", originalSecureContext);
    } else {
      Reflect.deleteProperty(window, "isSecureContext");
    }
  });

  async function mount(
    getUserMedia: () => Promise<MediaStream>,
    playing = true,
    connectionOverrides: Partial<NonNullable<HomeAssistant["connection"]>> = {},
  ): Promise<{
    player: RingViewRingWebRtcPlayer;
    peer: MockPeerConnection;
    subscribeMessage: ReturnType<typeof vi.fn>;
  }> {
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: { getUserMedia: vi.fn(getUserMedia) },
    });
    const subscribeMessage = vi.fn(async () => vi.fn());
    const hass: HomeAssistant = {
      states: {},
      hassUrl: (path = "") => path,
      callWS: async () => ({ configuration: {} }) as never,
      connection: { subscribeMessage, ...connectionOverrides },
    };
    const player = document.createElement("ring-view-ring-webrtc-player");
    player.hass = hass;
    player.entityId = "camera.front_door_live_view";
    document.body.append(player);
    await player.updateComplete;
    await flush();
    const peer = MockPeerConnection.instances[0];
    if (!peer) throw new Error("Peer connection was not created");
    peer.connectionState = "connected";
    peer.onconnectionstatechange?.(new Event("connectionstatechange"));
    if (playing) player.shadowRoot?.querySelector("video")?.dispatchEvent(new Event("playing"));
    await player.updateComplete;
    return { player, peer, subscribeMessage };
  }

  it("negotiates one sendrecv audio offer before microphone permission", async () => {
    const localStream = new MockMediaStream([new MockTrack("audio")]);
    const { player, peer, subscribeMessage } = await mount(
      async () => localStream as unknown as MediaStream,
    );

    expect(peer.transceivers).toEqual([
      { kind: "audio", direction: "sendrecv" },
      { kind: "video", direction: "recvonly" },
    ]);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    expect(subscribeMessage.mock.calls[0]?.[1]).toMatchObject({
      type: "camera/webrtc/offer",
      entity_id: "camera.front_door_live_view",
    });
    expect(peer.replaceTrack).not.toHaveBeenCalled();
    expect(player.shadowRoot?.textContent).toContain("Hold to talk");
    expect(player.shadowRoot?.textContent).not.toContain("Connected and listening");
  });

  it("waits for video before playback and retries an iOS rejection muted", async () => {
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockRejectedValueOnce(new DOMException("Gesture required", "NotAllowedError"));
    play.mockResolvedValueOnce(undefined);
    const { player, peer } = await mount(
      async () => new MockMediaStream([]) as unknown as MediaStream,
    );
    const audio = new MockTrack("audio");
    const videoTrack = new MockTrack("video");

    peer.ontrack?.({ track: audio } as unknown as RTCTrackEvent);
    await flush();
    expect(play).not.toHaveBeenCalled();

    peer.ontrack?.({ track: videoTrack } as unknown as RTCTrackEvent);
    await flush();
    await player.updateComplete;

    expect(play).toHaveBeenCalledTimes(2);
    expect(player.shadowRoot?.querySelector<HTMLVideoElement>("video")?.muted).toBe(true);
    expect(player.shadowRoot?.textContent).toContain(
      "The browser started live view muted.",
    );
  });

  it("keeps connected media available for a user tap when both autoplay attempts are blocked", async () => {
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockRejectedValue(new DOMException("Gesture required", "NotAllowedError"));
    const { player, peer, subscribeMessage } = await mount(
      async () => new MockMediaStream([]) as unknown as MediaStream, false,
    );
    const failed = vi.fn();
    const blocked = vi.fn();
    player.addEventListener("ring-webrtc-error", failed);
    player.addEventListener("ring-webrtc-playback-blocked", blocked);
    peer.ontrack?.({ track: new MockTrack("video") } as unknown as RTCTrackEvent);
    await flush();

    expect(play).toHaveBeenCalledTimes(2);
    expect(peer.close).not.toHaveBeenCalled();
    expect(failed).not.toHaveBeenCalled();
    expect(blocked).toHaveBeenCalledTimes(1);
    expect(player.shadowRoot?.querySelector(".talk-button")).toBeNull();
    const resume = player.shadowRoot?.querySelector<HTMLButtonElement>(".playback-resume");
    expect(resume?.textContent).toContain("Resume live view");

    play.mockResolvedValue(undefined);
    resume?.click();
    await flush();
    expect(play).toHaveBeenCalledTimes(3);
    const video = player.shadowRoot?.querySelector("video");
    video?.dispatchEvent(new Event("playing"));
    await player.updateComplete;
    expect(player.shadowRoot?.querySelector(".playback-resume")).toBeNull();
    expect(player.shadowRoot?.querySelector(".talk-button")).not.toBeNull();
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    expect(peer.close).not.toHaveBeenCalled();
  });

  it("never replays an old camera offer after a Home Assistant socket reconnect", async () => {
    const { player, peer, subscribeMessage } = await mount(
      async () => new MockMediaStream([]) as unknown as MediaStream,
    );
    const options = subscribeMessage.mock.calls[0]?.[2];
    expect(options).toMatchObject({ resubscribe: false });
    expect(await options.preCheck()).toBe(true);
    player.remove();
    await flush();
    expect(await options.preCheck()).toBe(false);
    expect(peer.close).toHaveBeenCalledTimes(1);
  });

  it("rejects a replacement session ID instead of applying its answer to the old peer", async () => {
    const { player, peer, subscribeMessage } = await mount(
      async () => new MockMediaStream([]) as unknown as MediaStream,
    );
    const resume = vi.fn();
    player.addEventListener("ring-webrtc-resume", resume);
    const signal = subscribeMessage.mock.calls[0]?.[0];
    signal({ type: "session", session_id: "original" });
    signal({ type: "answer", answer: "first answer" });
    await flush();
    signal({ type: "session", session_id: "replacement" });
    signal({ type: "answer", answer: "second answer" });
    await flush();
    expect(peer.setRemoteDescription).toHaveBeenCalledTimes(1);
    expect(peer.close).toHaveBeenCalledTimes(1);
    expect(resume).toHaveBeenCalledTimes(1);
  });

  it("keeps blocked automatic playback indefinitely without a failure timer or extra offer", async () => {
    vi.useFakeTimers();
    const subscribeMessage = vi.fn(async () => vi.fn());
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = {
      states: { "camera.live": { entity_id: "camera.live", state: "idle", attributes: { supported_features: 2 } } },
      entities: { "camera.live": { entity_id: "camera.live", platform: "ring" } },
      hassUrl: (path = "") => path,
      callWS: async () => ({ configuration: {} }) as never,
      connection: { subscribeMessage },
    };
    document.body.append(dialog);
    dialog.showDialog({
      config: normalizeConfig({ live_entity: "camera.live", recording_entity: "camera.recording", two_way_audio: true }),
      mode: "live", restored: true,
    });
    await dialog.updateComplete;
    await vi.advanceTimersByTimeAsync(0);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    expect(MockPeerConnection.instances).toHaveLength(1);
    const peer = MockPeerConnection.instances[0]!;
    const player = dialog.shadowRoot?.querySelector("ring-view-ring-webrtc-player");
    expect(player?.muted).toBe(true);
    vi.mocked(HTMLMediaElement.prototype.play).mockRejectedValue(new DOMException("Gesture required", "NotAllowedError"));
    peer.ontrack?.({ track: new MockTrack("video") } as unknown as RTCTrackEvent);
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(120_000);
    expect(dialog.shadowRoot?.querySelector(".state-layer")).toBeNull();
    expect(player?.shadowRoot?.querySelector(".playback-resume")).not.toBeNull();
    expect(dialog.shadowRoot?.querySelector("ring-view-ring-webrtc-player")).toBe(player);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    expect(peer.close).not.toHaveBeenCalled();
    dialog.close();
    await vi.advanceTimersByTimeAsync(0);
    expect(peer.close).toHaveBeenCalledTimes(1);
    // Even a queued readiness event from the discarded player cannot revive it.
    player?.dispatchEvent(new CustomEvent("ring-webrtc-ready"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(dialog.open).toBe(false);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
  });

  it("returns to Resume when Home Assistant replaces the connection object", async () => {
    const { player, peer, subscribeMessage } = await mount(
      async () => new MockMediaStream([]) as unknown as MediaStream,
    );
    const resume = vi.fn();
    player.addEventListener("ring-webrtc-resume", resume);
    const newSubscribe = vi.fn(async () => vi.fn());
    player.hass = { ...player.hass!, connection: { subscribeMessage: newSubscribe } };
    await flush();
    expect(resume).toHaveBeenCalledTimes(1);
    expect(peer.close).toHaveBeenCalledTimes(1);
    expect(newSubscribe).not.toHaveBeenCalled();
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
  });

  it("releases talkback immediately without skipping HA's next disconnect listener", async () => {
    // HA dispatches a live array with forEach; DOM EventTarget and Set mocks
    // hide the skipped-listener bug caused by splicing this array mid-dispatch.
    const listeners: Array<() => void> = [];
    const microphone = new MockTrack("audio");
    const { player, peer } = await mount(
      async () => new MockMediaStream([microphone]) as unknown as MediaStream,
      true,
      {
        addEventListener: (_event, callback) => listeners.push(callback),
        removeEventListener: (_event, callback) => {
          const index = listeners.indexOf(callback);
          if (index !== -1) listeners.splice(index, 1);
        },
      },
    );
    dispatchPointer(player.shadowRoot!.querySelector(".talk-button")!, "pointerdown");
    await flush();
    expect(microphone.enabled).toBe(true);
    const nextConsumer = vi.fn();
    listeners.push(nextConsumer);
    listeners.forEach((callback) => callback());
    expect(microphone.enabled).toBe(false);
    expect(microphone.stop).toHaveBeenCalledTimes(1);
    expect(peer.close).toHaveBeenCalledTimes(1);
    expect(nextConsumer).toHaveBeenCalledTimes(1);
    await flush();
    expect(listeners).toEqual([nextConsumer]);
  });

  it.each(["subscription", "unsubscribe"] as const)("reports peer failure without waiting for a stalled %s", async (stage) => {
    let finishCleanup!: () => void;
    const cleanup = new Promise<void>((resolve) => { finishCleanup = resolve; });
    const unsubscribe = vi.fn(() => stage === "unsubscribe" ? cleanup : Promise.resolve());
    const { player, peer } = await mount(
      async () => new MockMediaStream([]) as unknown as MediaStream,
      true,
      { subscribeMessage: () => stage === "subscription" ? cleanup.then(() => unsubscribe) : Promise.resolve(unsubscribe) },
    );
    const failed = vi.fn();
    player.addEventListener("ring-webrtc-error", failed);
    peer.connectionState = "failed";
    peer.onconnectionstatechange?.(new Event("connectionstatechange"));
    expect(peer.close).toHaveBeenCalledTimes(1);
    await flush();
    expect(failed).toHaveBeenCalledTimes(1);
    player.remove();
    finishCleanup();
    await flush();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(failed).toHaveBeenCalledTimes(1);
  });

  it("recovers the dialog without waiting for the failed session's cleanup acknowledgment", async () => {
    vi.useFakeTimers();
    let finishCleanup!: () => void;
    const cleanup = new Promise<void>((resolve) => { finishCleanup = resolve; });
    const unsubscribe = vi.fn(() => cleanup);
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = {
      states: { "camera.live": { entity_id: "camera.live", state: "idle", attributes: { supported_features: 2 } } },
      entities: { "camera.live": { entity_id: "camera.live", platform: "ring" } },
      hassUrl: (path = "") => path,
      callWS: async () => ({ configuration: {} }) as never,
      connection: { subscribeMessage: async () => unsubscribe },
    };
    document.body.append(dialog);
    dialog.showDialog({
      config: normalizeConfig({ live_entity: "camera.live", recording_entity: "camera.recording", two_way_audio: true }),
      mode: "live", restored: true,
    });
    await vi.advanceTimersByTimeAsync(0);
    const peer = MockPeerConnection.instances[0]!;
    const player = dialog.shadowRoot!.querySelector("ring-view-ring-webrtc-player")!;
    peer.connectionState = "connected";
    peer.onconnectionstatechange?.(new Event("connectionstatechange"));
    player.shadowRoot!.querySelector("video")!.dispatchEvent(new Event("playing"));
    await vi.advanceTimersByTimeAsync(0);
    expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();
    peer.connectionState = "failed";
    peer.onconnectionstatechange?.(new Event("connectionstatechange"));
    await vi.advanceTimersByTimeAsync(120_000);
    expect(peer.close).toHaveBeenCalledTimes(1);
    expect(dialog.shadowRoot!.querySelector('[role="alert"]')).not.toBeNull();
    dialog.shadowRoot!.querySelector<HTMLButtonElement>(".state-actions .primary")!.click();
    await vi.advanceTimersByTimeAsync(0);
    const replacement = dialog.shadowRoot!.querySelector("ring-view-ring-webrtc-player")!;
    expect(replacement).not.toBe(player);
    replacement.shadowRoot!.querySelector("video")!.dispatchEvent(new Event("playing"));
    await vi.advanceTimersByTimeAsync(0);
    finishCleanup();
    await vi.advanceTimersByTimeAsync(120_000);
    expect(dialog.shadowRoot!.querySelector("ring-view-ring-webrtc-player")).toBe(replacement);
    expect(dialog.shadowRoot!.querySelector(".state-layer")).toBeNull();
    expect(MockPeerConnection.instances).toHaveLength(2);
  });

  it("routes external session messages through the shared viewer state layer", async () => {
    const subscribeMessage = vi.fn(async () => vi.fn());
    const dialog = document.createElement("ring-view-dialog");
    dialog.hass = {
      states: {
        "camera.live": {
          entity_id: "camera.live",
          state: "idle",
          attributes: { supported_features: 2 },
        },
      },
      entities: {
        "camera.live": { entity_id: "camera.live", platform: "ring" },
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({ configuration: {} }) as never,
      connection: { subscribeMessage },
    };
    document.body.append(dialog);
    dialog.showDialog({
      config: normalizeConfig({
        live_entity: "camera.live",
        recording_entity: "camera.recording",
        two_way_audio: true,
      }),
      mode: "live",
    });
    await flush();

    const player = dialog.shadowRoot?.querySelector(
      "ring-view-ring-webrtc-player",
    );
    const peer = MockPeerConnection.instances[0]!;
    peer.connectionState = "connected";
    peer.onconnectionstatechange?.(new Event("connectionstatechange"));
    player?.shadowRoot?.querySelector("video")?.dispatchEvent(new Event("playing"));
    await flush();

    player?.dispatchEvent(new CustomEvent("ring-webrtc-status", {
      detail: { message: "Microphone permission denied.", kind: "error" },
      bubbles: true,
      composed: true,
    }));
    await dialog.updateComplete;

    const feedback = dialog.shadowRoot?.querySelector(
      ".session-message-layer .state-card",
    );
    expect(feedback?.textContent).toContain("Microphone permission denied.");
    expect(feedback?.parentElement?.getAttribute("role")).toBe("alert");
    expect(player?.shadowRoot?.querySelector(".session-status")).toBeNull();

    player?.dispatchEvent(new CustomEvent("ring-webrtc-status", {
      detail: { message: "", kind: "status" },
      bubbles: true,
      composed: true,
    }));
    await dialog.updateComplete;
    expect(dialog.shadowRoot?.querySelector(".session-message-layer")).toBeNull();
    dialog.close();
  });

  it("requests the microphone on hold without another offer and stops on release", async () => {
    const microphone = new MockTrack("audio");
    const localStream = new MockMediaStream([microphone]);
    const { player, peer, subscribeMessage } = await mount(
      async () => localStream as unknown as MediaStream,
    );

    const button = player.shadowRoot?.querySelector<HTMLButtonElement>("button");
    if (!button) throw new Error("Talk button was not rendered");
    dispatchPointer(button, "pointerdown");
    await flush();
    await player.updateComplete;

    expect(peer.replaceTrack).toHaveBeenCalledTimes(1);
    expect(peer.replaceTrack).toHaveBeenCalledWith(microphone);
    expect(microphone.enabled).toBe(true);
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    expect(peer.close).not.toHaveBeenCalled();
    expect(player.shadowRoot?.textContent).toContain("Release to stop");

    dispatchPointer(button, "pointerup");
    await player.updateComplete;

    expect(microphone.enabled).toBe(false);
    expect(player.shadowRoot?.textContent).toContain("Hold to talk");
  });

  it("releases the microphone and peer connection when the frontend is rebuilt", async () => {
    const microphone = new MockTrack("audio");
    const localStream = new MockMediaStream([microphone]);
    const { player, peer } = await mount(
      async () => localStream as unknown as MediaStream,
    );
    const button = player.shadowRoot?.querySelector<HTMLButtonElement>("button");
    if (!button) throw new Error("Talk button was not rendered");
    dispatchPointer(button, "pointerdown");
    await flush();

    player.remove();
    await flush();

    expect(peer.close).toHaveBeenCalledTimes(1);
    expect(microphone.stop).toHaveBeenCalledTimes(1);
    expect(microphone.enabled).toBe(false);
  });

  it("closes the peer connection as soon as the page is discarded", async () => {
    const { player, peer } = await mount(async () => new MockMediaStream([]) as unknown as MediaStream);

    window.dispatchEvent(new Event("pagehide"));
    await flush();

    expect(player.isConnected).toBe(true);
    expect(peer.close).toHaveBeenCalledTimes(1);
  });

  it("does not transmit after a permission prompt interrupts the original hold", async () => {
    const microphone = new MockTrack("audio");
    const localStream = new MockMediaStream([microphone]);
    let resolvePermission: ((stream: MediaStream) => void) | undefined;
    const { player, peer } = await mount(
      () => new Promise<MediaStream>((resolve) => {
        resolvePermission = resolve;
      }),
    );

    const button = player.shadowRoot?.querySelector<HTMLButtonElement>("button");
    if (!button) throw new Error("Talk button was not rendered");
    dispatchPointer(button, "pointerdown");
    dispatchPointer(button, "pointerup");
    resolvePermission?.(localStream as unknown as MediaStream);
    await flush();
    await player.updateComplete;

    expect(peer.replaceTrack).toHaveBeenCalledWith(microphone);
    expect(microphone.enabled).toBe(false);
    expect(player.shadowRoot?.textContent).toContain("Hold to talk");
  });

  it("keeps the peer connection open when microphone permission fails", async () => {
    const { player, peer, subscribeMessage } = await mount(async () => {
      throw new DOMException("Denied", "NotAllowedError");
    });

    const button = player.shadowRoot?.querySelector<HTMLButtonElement>("button");
    if (!button) throw new Error("Talk button was not rendered");
    dispatchPointer(button, "pointerdown");
    await flush();
    await player.updateComplete;

    expect(peer.replaceTrack).not.toHaveBeenCalled();
    expect(peer.close).not.toHaveBeenCalled();
    expect(subscribeMessage).toHaveBeenCalledTimes(1);
    expect(player.shadowRoot?.textContent).toContain(
      "Microphone permission denied.",
    );
  });

  it("explains that an insecure Home Assistant connection blocks two-way audio", async () => {
    const getUserMedia = vi.fn(async () => new MockMediaStream([]) as unknown as MediaStream);
    const { player, peer } = await mount(getUserMedia);
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: false });
    vi.useFakeTimers();

    const button = player.shadowRoot?.querySelector<HTMLButtonElement>("button");
    if (!button) throw new Error("Talk button was not rendered");
    dispatchPointer(button, "pointerdown");
    await Promise.resolve();
    await player.updateComplete;

    expect(getUserMedia).not.toHaveBeenCalled();
    expect(peer.replaceTrack).not.toHaveBeenCalled();
    expect(peer.close).not.toHaveBeenCalled();
    expect(player.shadowRoot?.textContent).toContain("Microphone access requires HTTPS.");

    await vi.advanceTimersByTimeAsync(3_000);
    await player.updateComplete;

    expect(player.shadowRoot?.textContent).not.toContain("Microphone access requires HTTPS.");
  });
});
