import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/media/ring-webrtc-player";
import type { HomeAssistant } from "../../src/types";
import type { RingViewRingWebRtcPlayer } from "../../src/media/ring-webrtc-player";

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

  async function mount(getUserMedia: () => Promise<MediaStream>): Promise<{
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
      connection: { subscribeMessage },
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
      "Microphone permission was denied. Video remains connected.",
    );
  });
});
