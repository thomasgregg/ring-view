import { mdiMicrophone, mdiMicrophoneOff } from "@mdi/js";
import { LitElement, css, html, nothing, type PropertyValues } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement, property, state } from "lit/decorators.js";
import { localize } from "../localize";
import type { FitMode, HomeAssistant } from "../types";

type MicrophoneState =
  | "not-requested"
  | "requesting"
  | "ready"
  | "active"
  | "failed"
  | "unsupported";

type SignalMessage =
  | { type: "session"; session_id: string }
  | { type: "answer"; answer: string }
  | { type: "candidate"; candidate: RTCIceCandidateInit }
  | { type: "error"; message?: string; code?: string };

interface CameraWebRtcClientConfig {
  configuration?: RTCConfiguration;
  dataChannel?: string;
}

const STATUS_MESSAGE_DURATION_MS = 3_000;

function describeMicrophoneError(hass: HomeAssistant | undefined, error: unknown): string {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") return localize(hass, "talkback.permission_denied");
    if (error.name === "NotFoundError") return localize(hass, "talkback.no_microphone");
    if (error.name === "NotReadableError") return localize(hass, "talkback.microphone_busy");
  }
  return error instanceof Error ? error.message : String(error);
}

@customElement("ring-view-ring-webrtc-player")
export class RingViewRingWebRtcPlayer extends LitElement {
  public static styles = css`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
      background: #000;
    }

    video {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: var(--ring-view-talkback-fit-mode, cover);
      background: #000;
    }

    .talkback-controls {
      position: absolute;
      z-index: 4;
      inset: auto 16px 10px;
      display: flex;
      justify-content: center;
      pointer-events: none;
    }

    button {
      display: inline-flex;
      min-height: 46px;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 9px 16px;
      border: 1px solid rgba(255, 255, 255, 0.45);
      border-radius: 999px;
      color: #fff;
      background: rgba(18, 18, 18, 0.78);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.35);
      font: inherit;
      font-size: 14px;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      pointer-events: auto;
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-tap-highlight-color: transparent;
    }

    button:hover {
      background: rgba(36, 36, 36, 0.9);
    }

    button:focus-visible {
      outline: 3px solid var(--primary-color, #03a9f4);
      outline-offset: 3px;
    }

    button:disabled {
      cursor: wait;
      opacity: 0.7;
    }

    button.talk-button.active {
      border-color: var(--error-color, #db4437);
      background: var(--error-color, #db4437);
      transform: scale(0.98);
    }

    svg {
      width: 21px;
      height: 21px;
      flex: 0 0 auto;
      fill: currentColor;
    }

    .session-status {
      position: absolute;
      z-index: 4;
      inset: 50% auto auto 50%;
      max-width: min(560px, calc(100% - 32px));
      padding: 6px 10px;
      box-sizing: border-box;
      overflow: hidden;
      border-radius: 999px;
      color: rgba(255, 255, 255, 0.92);
      background: rgba(0, 0, 0, 0.66);
      font-size: 12px;
      line-height: 16px;
      text-align: center;
      transform: translate(-50%, -50%);
      white-space: normal;
      pointer-events: none;
    }

    @media (max-width: 600px) {
      .talkback-controls {
        inset-inline: max(12px, env(safe-area-inset-right))
          max(12px, env(safe-area-inset-left));
        bottom: 8px;
      }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .talkback-controls {
        bottom: max(8px, env(safe-area-inset-bottom));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      button.talk-button.active {
        transform: none;
      }
    }
  `;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public entityId = "";
  @property({ type: Boolean }) public muted = false;
  @property({ attribute: false }) public fitMode: FitMode = "cover";

  @state() private microphoneState: MicrophoneState = "not-requested";
  @state() private connectionState: RTCPeerConnectionState | "starting" = "starting";
  @state() private statusMessage = "";
  @state() private actualMuted = false;

  private connectionToken = 0;
  private startAttempted = false;
  private startedEntityId?: string;
  private peerConnection?: RTCPeerConnection;
  private audioSender?: RTCRtpSender;
  private remoteStream?: MediaStream;
  private localStream?: MediaStream;
  private sessionId?: string;
  private pendingLocalCandidates: RTCIceCandidateInit[] = [];
  private pendingRemoteCandidates: RTCIceCandidateInit[] = [];
  private unsubscribePromise?: Promise<() => void>;
  private microphoneRequest?: Promise<boolean>;
  private readyDispatched = false;
  private startQueued = false;
  private activePointerId?: number;
  private keyboardPressed = false;
  private pressToken = 0;
  private statusMessageTimeout?: number;

  public connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("blur", this.handleWindowBlur);
    window.addEventListener("pagehide", this.handlePageHide);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  }

  public disconnectedCallback(): void {
    window.removeEventListener("blur", this.handleWindowBlur);
    window.removeEventListener("pagehide", this.handlePageHide);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this.clearStatusMessageTimeout();
    this.connectionToken += 1;
    void this.disposeSession();
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (changed.has("muted")) {
      this.actualMuted = this.muted;
    }
  }

  protected updated(changed: PropertyValues<this>): void {
    if (changed.has("muted")) {
      const video = this.renderRoot.querySelector<HTMLVideoElement>("video");
      if (video) video.muted = this.actualMuted;
    }

    const entityChanged = changed.has("entityId") && this.startedEntityId !== this.entityId;
    const becameReady = changed.has("hass") && !this.startAttempted && Boolean(this.hass);
    if (entityChanged && this.startAttempted) {
      this.queueSessionStart(true);
    } else if ((entityChanged || becameReady) && this.hass && this.entityId) {
      this.queueSessionStart(false);
    }
  }

  private queueSessionStart(restart: boolean): void {
    if (this.startQueued) return;
    this.startQueued = true;
    queueMicrotask(() => {
      this.startQueued = false;
      if (!this.isConnected) return;
      if (restart) void this.restartSession();
      else void this.startSession();
    });
  }

  protected render() {
    const talking = this.microphoneState === "active";
    const requesting = this.microphoneState === "requesting";
    const connected = this.connectionState === "connected";
    const style = `--ring-view-talkback-fit-mode: ${this.fitMode}`;
    const buttonLabel = requesting
      ? localize(this.hass, "talkback.requesting_microphone")
      : talking
        ? localize(this.hass, "talkback.release_to_stop")
        : localize(this.hass, "talkback.hold_to_talk");

    return html`
      <video
        style=${style}
        autoplay
        playsinline
        controls
        .muted=${this.actualMuted}
        @playing=${this.handlePlaying}
      ></video>
      <div class="talkback-controls">
        <button
          class=${classMap({ "talk-button": true, active: talking })}
          type="button"
          aria-label=${buttonLabel}
          aria-pressed=${String(talking)}
          ?disabled=${!connected}
          @contextmenu=${(event: Event) => event.preventDefault()}
          @pointerdown=${this.handleTalkPointerDown}
          @pointerup=${this.handleTalkPointerEnd}
          @pointercancel=${this.handleTalkPointerEnd}
          @lostpointercapture=${this.handleTalkPointerEnd}
          @keydown=${this.handleTalkKeyDown}
          @keyup=${this.handleTalkKeyUp}
        >
          ${this.icon(talking ? mdiMicrophone : mdiMicrophoneOff)}
          <span>${buttonLabel}</span>
        </button>
      </div>
      ${this.statusMessage
        ? html`<div class="session-status" role="status" aria-live="polite">
            ${this.statusMessage}
          </div>`
        : nothing}
    `;
  }

  public stopTalking = (): void => {
    const track = this.localStream?.getAudioTracks()[0];
    if (track) track.enabled = false;
    if (this.microphoneState === "active") {
      this.microphoneState = "ready";
      this.showStatusMessage("");
    }
  };

  private async restartSession(): Promise<void> {
    this.connectionToken += 1;
    await this.disposeSession();
    this.startAttempted = false;
    await this.startSession();
  }

  private async startSession(): Promise<void> {
    if (this.startAttempted || !this.hass || !this.entityId) return;
    if (!this.hass.connection || typeof RTCPeerConnection === "undefined") {
      this.dispatchFailure(localize(this.hass, "talkback.webrtc_unavailable"));
      return;
    }

    this.startAttempted = true;
    this.startedEntityId = this.entityId;
    const token = ++this.connectionToken;
    this.connectionState = "starting";
    this.microphoneState = "not-requested";
    this.showStatusMessage(localize(this.hass, "talkback.connecting"));
    this.readyDispatched = false;
    this.pendingLocalCandidates = [];
    this.pendingRemoteCandidates = [];
    this.sessionId = undefined;

    try {
      const clientConfig = await this.hass.callWS<CameraWebRtcClientConfig>({
        type: "camera/webrtc/get_client_config",
        entity_id: this.entityId,
      });
      if (token !== this.connectionToken) return;

      const peerConnection = new RTCPeerConnection(clientConfig.configuration ?? {});
      this.peerConnection = peerConnection;
      this.remoteStream = new MediaStream();
      if (clientConfig.dataChannel) peerConnection.createDataChannel(clientConfig.dataChannel);

      peerConnection.ontrack = (event) => this.handleRemoteTrack(event, token);
      peerConnection.onicecandidate = (event) => {
        if (event.candidate?.candidate) void this.handleLocalCandidate(event.candidate, token);
      };
      peerConnection.onconnectionstatechange = () => this.handleConnectionState(token);

      const audioTransceiver = peerConnection.addTransceiver("audio", {
        direction: "sendrecv",
      });
      this.audioSender = audioTransceiver.sender;
      peerConnection.addTransceiver("video", { direction: "recvonly" });

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      if (token !== this.connectionToken || !peerConnection.localDescription?.sdp) return;

      this.unsubscribePromise = Promise.resolve(
        this.hass.connection.subscribeMessage<SignalMessage>(
          (message) => void this.handleSignalMessage(message, token),
          {
            type: "camera/webrtc/offer",
            entity_id: this.entityId,
            offer: peerConnection.localDescription.sdp,
          },
        ),
      );
      await this.unsubscribePromise;
    } catch (error) {
      if (token === this.connectionToken) {
        await this.fail(error instanceof Error ? error.message : String(error));
      }
    }
  }

  private ensureMicrophone = async (): Promise<boolean> => {
    if (
      this.connectionState !== "connected"
      || !this.audioSender
    ) {
      return false;
    }
    if (["ready", "active"].includes(this.microphoneState)) {
      return true;
    }
    if (this.microphoneRequest) {
      return this.microphoneRequest;
    }
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      this.microphoneState = "unsupported";
      this.showStatusMessage(localize(this.hass, "talkback.https_required"));
      return false;
    }

    const token = this.connectionToken;
    this.microphoneState = "requesting";
    this.showStatusMessage("");
    const request = (async (): Promise<boolean> => {
      let localStream: MediaStream | undefined;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        });
        if (token !== this.connectionToken || !this.audioSender) {
          localStream.getTracks().forEach((track) => track.stop());
          return false;
        }

        const track = localStream.getAudioTracks()[0];
        if (!track) throw new Error(localize(this.hass, "talkback.no_microphone"));
        track.enabled = false;
        track.addEventListener("ended", () => {
          if (token !== this.connectionToken || this.localStream !== localStream) return;
          this.cancelActivePress();
          this.localStream = undefined;
          this.microphoneState = "failed";
          this.showStatusMessage(localize(this.hass, "talkback.microphone_ended"));
        });
        await this.audioSender.replaceTrack(track);
        if (token !== this.connectionToken) {
          localStream.getTracks().forEach((item) => item.stop());
          return false;
        }

        this.localStream?.getTracks().forEach((item) => item.stop());
        this.localStream = localStream;
        this.microphoneState = "ready";
        this.showStatusMessage("");
        return true;
      } catch (error) {
        localStream?.getTracks().forEach((track) => track.stop());
        if (token !== this.connectionToken) return false;
        this.microphoneState = "failed";
        this.showStatusMessage(describeMicrophoneError(this.hass, error));
        return false;
      }
    })();

    this.microphoneRequest = request;
    try {
      return await request;
    } finally {
      if (this.microphoneRequest === request) this.microphoneRequest = undefined;
    }
  };

  private handleTalkPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !event.isPrimary || this.isTalkPressed()) return;
    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
    this.activePointerId = event.pointerId;
    const token = ++this.pressToken;
    void this.startTalkingForPress(token);
  };

  private handleTalkPointerEnd = (event: PointerEvent): void => {
    if (this.activePointerId !== event.pointerId) return;
    this.activePointerId = undefined;
    this.pressToken += 1;
    this.stopTalking();
  };

  private handleTalkKeyDown = (event: KeyboardEvent): void => {
    if (
      (event.key === " " || event.key === "Enter")
      && !event.repeat
      && !this.isTalkPressed()
    ) {
      event.preventDefault();
      this.keyboardPressed = true;
      const token = ++this.pressToken;
      void this.startTalkingForPress(token);
    }
  };

  private handleTalkKeyUp = (event: KeyboardEvent): void => {
    if ((event.key === " " || event.key === "Enter") && this.keyboardPressed) {
      event.preventDefault();
      this.keyboardPressed = false;
      this.pressToken += 1;
      this.stopTalking();
    }
  };

  private async startTalkingForPress(pressToken: number): Promise<void> {
    if (this.connectionState !== "connected") return;
    const microphoneReady = await this.ensureMicrophone();
    if (
      !microphoneReady
      || pressToken !== this.pressToken
      || !this.isTalkPressed()
      || document.hidden
    ) {
      return;
    }
    const track = this.localStream?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = true;
    this.microphoneState = "active";
    this.showStatusMessage("");
  }

  private isTalkPressed(): boolean {
    return this.activePointerId !== undefined || this.keyboardPressed;
  }

  private cancelActivePress(): void {
    this.activePointerId = undefined;
    this.keyboardPressed = false;
    this.pressToken += 1;
    this.stopTalking();
  }

  private handleWindowBlur = (): void => this.cancelActivePress();

  private handlePageHide = (): void => {
    this.clearStatusMessageTimeout();
    this.connectionToken += 1;
    void this.disposeSession();
  };

  private handleVisibilityChange = (): void => {
    if (document.hidden) this.cancelActivePress();
  };

  private async handleSignalMessage(message: SignalMessage, token: number): Promise<void> {
    if (token !== this.connectionToken || !this.peerConnection) return;
    try {
      if (message.type === "session") {
        this.sessionId = message.session_id;
        await this.flushLocalCandidates(token);
      } else if (message.type === "answer") {
        if (!this.peerConnection.remoteDescription && this.peerConnection.signalingState !== "closed") {
          await this.peerConnection.setRemoteDescription({ type: "answer", sdp: message.answer });
          await this.flushRemoteCandidates(token);
        }
      } else if (message.type === "candidate") {
        const candidate = message.candidate.sdpMid != null
          || message.candidate.sdpMLineIndex != null
          ? message.candidate
          : { ...message.candidate, sdpMid: "0" };
        if (this.peerConnection.remoteDescription) {
          await this.peerConnection.addIceCandidate(candidate);
        } else {
          this.pendingRemoteCandidates.push(candidate);
        }
      } else if (message.type === "error") {
        await this.fail(message.message || message.code || localize(this.hass, "viewer.live_failed"));
      }
    } catch (error) {
      if (token === this.connectionToken) {
        await this.fail(error instanceof Error ? error.message : String(error));
      }
    }
  }

  private async handleLocalCandidate(candidate: RTCIceCandidate, token: number): Promise<void> {
    if (token !== this.connectionToken) return;
    const data = candidate.toJSON();
    if (!this.sessionId) {
      this.pendingLocalCandidates.push(data);
      return;
    }
    try {
      await this.sendCandidate(data, token);
    } catch (error) {
      if (token === this.connectionToken) {
        await this.fail(error instanceof Error ? error.message : String(error));
      }
    }
  }

  private async sendCandidate(candidate: RTCIceCandidateInit, token: number): Promise<void> {
    if (token !== this.connectionToken || !this.sessionId || !this.hass) return;
    await this.hass.callWS({
      type: "camera/webrtc/candidate",
      entity_id: this.entityId,
      session_id: this.sessionId,
      candidate,
    });
  }

  private async flushLocalCandidates(token: number): Promise<void> {
    const candidates = this.pendingLocalCandidates.splice(0);
    for (const candidate of candidates) await this.sendCandidate(candidate, token);
  }

  private async flushRemoteCandidates(token: number): Promise<void> {
    const candidates = this.pendingRemoteCandidates.splice(0);
    for (const candidate of candidates) {
      if (token !== this.connectionToken || !this.peerConnection) return;
      await this.peerConnection.addIceCandidate(candidate);
    }
  }

  private handleRemoteTrack(event: RTCTrackEvent, token: number): void {
    if (token !== this.connectionToken || !this.remoteStream) return;
    if (!this.remoteStream.getTracks().includes(event.track)) {
      this.remoteStream.addTrack(event.track);
    }
    if (event.track.kind === "audio") {
      this.dispatchEvent(
        new CustomEvent("ring-webrtc-capabilities", {
          detail: { hasAudio: true, hasVideo: true },
          bubbles: true,
          composed: true,
        }),
      );
    }

    const video = this.renderRoot.querySelector<HTMLVideoElement>("video");
    if (!video) return;
    if (video.srcObject !== this.remoteStream) video.srcObject = this.remoteStream;
    // Ring may deliver audio before video. Starting an audio-only MediaStream
    // is rejected by the Companion app after its orientation reload because
    // that new Web View has no playback gesture. Let the video track make the
    // stream playable first, like Home Assistant's native camera component.
    if (event.track.kind !== "video") return;
    void video.play().catch(() => this.retryPlaybackMuted(video, token));
  }

  private retryPlaybackMuted(video: HTMLVideoElement, token: number): void {
    if (token !== this.connectionToken) return;
    this.actualMuted = true;
    video.muted = true;
    this.showStatusMessage(localize(this.hass, "talkback.playback_muted"));
    queueMicrotask(() => {
      if (token !== this.connectionToken || !video.isConnected) return;
      void video.play().catch(() => {
        if (token === this.connectionToken) {
          void this.fail(localize(this.hass, "viewer.live_failed"));
        }
      });
    });
  }

  private handlePlaying = (): void => {
    if (this.readyDispatched) return;
    this.readyDispatched = true;
    this.dispatchEvent(
      new CustomEvent("ring-webrtc-ready", { bubbles: true, composed: true }),
    );
  };

  private handleConnectionState(token: number): void {
    if (token !== this.connectionToken || !this.peerConnection) return;
    this.connectionState = this.peerConnection.connectionState;
    if (this.connectionState === "connected") {
      this.showStatusMessage("");
    } else if (this.connectionState === "disconnected") {
      this.cancelActivePress();
      this.showStatusMessage(localize(this.hass, "talkback.temporarily_disconnected"));
    } else if (this.connectionState === "failed") {
      void this.fail(localize(this.hass, "viewer.live_failed"));
    }
  }

  private async fail(message: string): Promise<void> {
    this.connectionToken += 1;
    await this.disposeSession();
    this.connectionState = "failed";
    this.showStatusMessage(message);
    this.dispatchFailure(message);
  }

  private showStatusMessage(message: string): void {
    this.clearStatusMessageTimeout();
    this.statusMessage = message;
    if (!message) return;
    this.statusMessageTimeout = window.setTimeout(() => {
      this.statusMessageTimeout = undefined;
      this.statusMessage = "";
    }, STATUS_MESSAGE_DURATION_MS);
  }

  private clearStatusMessageTimeout(): void {
    if (this.statusMessageTimeout === undefined) return;
    window.clearTimeout(this.statusMessageTimeout);
    this.statusMessageTimeout = undefined;
  }

  private dispatchFailure(message: string): void {
    this.dispatchEvent(
      new CustomEvent("ring-webrtc-error", {
        detail: { message },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private async disposeSession(): Promise<void> {
    this.cancelActivePress();
    this.microphoneRequest = undefined;
    const unsubscribePromise = this.unsubscribePromise;
    this.unsubscribePromise = undefined;

    if (this.peerConnection) {
      this.peerConnection.ontrack = null;
      this.peerConnection.onicecandidate = null;
      this.peerConnection.onconnectionstatechange = null;
      this.peerConnection.close();
      this.peerConnection = undefined;
    }
    this.localStream?.getTracks().forEach((track) => track.stop());
    this.remoteStream?.getTracks().forEach((track) => track.stop());
    this.localStream = undefined;
    this.remoteStream = undefined;
    this.audioSender = undefined;
    this.sessionId = undefined;
    this.pendingLocalCandidates = [];
    this.pendingRemoteCandidates = [];

    const video = this.renderRoot.querySelector<HTMLVideoElement>("video");
    if (video) {
      video.pause();
      video.srcObject = null;
      video.removeAttribute("src");
      video.load();
    }

    if (unsubscribePromise) {
      try {
        const unsubscribe = await unsubscribePromise;
        unsubscribe();
      } catch {
        // The WebSocket subscription either failed or was already closed.
      }
    }
  }

  private icon(path: string) {
    return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${path}></path></svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ring-view-ring-webrtc-player": RingViewRingWebRtcPlayer;
  }
}
