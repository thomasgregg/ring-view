import {
  mdiAlertCircleOutline,
  mdiBellRingOutline,
  mdiCameraOutline,
  mdiCheckCircleOutline,
  mdiClose,
  mdiDoorClosed,
  mdiDoorOpen,
  mdiFullscreen,
  mdiLoading,
  mdiLockOpenVariantOutline,
  mdiMicrophone,
  mdiMicrophoneOff,
  mdiPlay,
} from "@mdi/js";
import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { keyed } from "lit/directives/keyed.js";
import { styleMap } from "lit/directives/style-map.js";
import { customElement, property, state } from "lit/decorators.js";
import "./activity-time";
import { aspectRatioNumber } from "./config";
import {
  RING_ALERT_DURATION_MS,
  RING_VIEW_DIALOG_TAG,
  registerActiveRingViewDialog,
  type RingViewDialogParams,
  unregisterActiveRingViewDialog,
} from "./dialog-controller";
import {
  localize,
  localizeHaOrFallback,
  type TranslationKey,
} from "./localize";
import "./media/native-camera-adapter";
import "./media/ring-webrtc-player";
import type {
  NativeAdapterFailure,
  NativeMediaCapabilities,
} from "./media/native-camera-adapter";
import type {
  RingTalkbackState,
  RingWebRtcStatus,
  RingViewRingWebRtcPlayer,
} from "./media/ring-webrtc-player";
import { posterUrl } from "./media/poster-provider";
import { renderModeIcon } from "./mode-icon";
import { dialogStyles } from "./styles";
import type {
  CameraMode,
  DashboardStart,
  HassEntity,
  HomeAssistant,
  NormalizedConfig,
} from "./types";
import { activityTimestamp } from "./utilities/activity-time";
import {
  entityIsUnavailable,
  friendlyName,
  supportsLockOpen,
  supportsRingTalkback,
} from "./utilities/entity-validation";
import { saveMode } from "./utilities/mode-storage";
import {
  buildSnapshotFilename,
  selectSnapshotEntityId,
} from "./utilities/snapshot";
import {
  createRingViewUrl,
  currentUrl,
  decodeRingViewUrl,
  removeRingViewUrl,
  replaceCurrentUrl,
  ringViewUrlMatchesConfig,
} from "./utilities/dialog-url";
import { StreamLifecycle } from "./utilities/stream-lifecycle";

type MediaStatus =
  | "idle"
  | "awaiting-resume"
  | "playback-blocked"
  | "pending"
  | "retrying"
  | "ready"
  | "error"
  | "compatibility";
type DoorActionStatus = "idle" | "holding" | "working" | "success" | "error";
type SnapshotActionStatus = "idle" | "working" | "success" | "error";
type DoorContactState = "open" | "closed" | "unknown";
type ViewerFeedbackSource = "door" | "snapshot" | "session";
interface ViewerFeedback {
  source: ViewerFeedbackSource;
  message: string;
  kind: "status" | "error";
}
const LIVE_TIMEOUT_SECONDS = 20;
const LIVE_RETRY_DELAY_MS = 2_500;
const RECORDING_CONTROLS_HIDE_DELAY_MS = 2_500;
const DOOR_HOLD_DURATION_MS = 900;
const DOOR_SUCCESS_DURATION_MS = 2_000;
const DOOR_ERROR_DURATION_MS = 3_000;
const SNAPSHOT_SUCCESS_DURATION_MS = 2_000;
const SNAPSHOT_ERROR_DURATION_MS = 3_000;

function snapshotErrorKey(error: unknown): TranslationKey {
  const message = error instanceof Error
    ? error.message.toLowerCase()
    : String(error).toLowerCase();
  if (/timeout|timed out/.test(message)) return "snapshot.timeout";
  if (/unauthorized|forbidden|permission denied/.test(message)) {
    return "snapshot.permission_failed";
  }
  if (
    /cannot write|can't write|no access to path|read-only|readonly/.test(message)
  ) {
    return "snapshot.write_failed";
  }
  if (/connection|websocket|service api unavailable/.test(message)) {
    return "snapshot.connection_failed";
  }
  if (/no image|could not provide|not supported|snapshot unavailable/.test(message)) {
    return "snapshot.camera_failed";
  }
  return "snapshot.failed";
}

@customElement(RING_VIEW_DIALOG_TAG)
export class RingViewDialog extends LitElement {
  public static styles = dialogStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: false }) public config?: NormalizedConfig;
  @property({ type: Boolean, reflect: true }) public open = false;
  @property({ type: Boolean, reflect: true }) public inline = false;

  @state() private ringing = false;
  @state() private mode: CameraMode = "last_recording";
  @state() private mediaStatus: MediaStatus = "idle";
  @state() private session = 0;
  @state() private suspended = false;
  @state() private recordingMuted = false;
  @state() private recordingStarted = true;
  @state() private recordingControlsVisible = true;
  @state() private recordingEnded = false;
  @state() private liveMuted = true;
  @state() private liveHasAudio?: boolean;
  @state() private recordingVideoFailed = false;
  @state() private retryCount = 0;
  @state() private statusAnnouncement = "";
  @state() private talkbackReady = false;
  @state() private talkbackRequesting = false;
  @state() private talkbackTalking = false;
  @state() private doorActionStatus: DoorActionStatus = "idle";
  @state() private snapshotActionStatus: SnapshotActionStatus = "idle";
  @state() private snapshotFeedbackMessage?: string;
  @state() private viewerFeedback?: ViewerFeedback;
  @state() private inlineStarted = true;

  private lifecycle = new StreamLifecycle();
  private opener?: HTMLElement;
  private returnUrl?: string;
  private ringAlertTimer?: number;
  private ringingUntil?: number;
  private lastDoorbellState?: string;
  // Playback belongs to an element, not the dialog: every replacement video
  // needs its own attempt, while repeated canplay events must not replay it.
  private readonly recordingPlayback = new WeakSet<HTMLVideoElement>();
  private recordingControlsTimer?: number;
  private recordingPaused = false;
  private automaticLiveRetry = true;
  private automaticLiveRecovery?: "waiting" | "attempting";
  private recoveryConnection?: HomeAssistant["connection"];
  private pageUnloading = false;
  private talkPointerId?: number;
  private talkKeyboardPressed = false;
  private doorPointerId?: number;
  private doorKeyboardPressed = false;
  private doorHoldTimer?: number;
  private doorFeedbackTimer?: number;
  private doorActionToken = 0;
  private snapshotFeedbackTimer?: number;
  private snapshotActionToken = 0;
  private inlineVisible = false;
  private inlineActive = false;

  public showDialog(params: RingViewDialogParams): void {
    if (!this.hass) return;
    // Defend against matching cards that dispatch restore requests before the
    // first asynchronous Home Assistant show-dialog request finishes.
    if (params.restored && this.isOpenFor(params)) {
      this.adoptRestoredDialog(params);
      this.syncUrl();
      return;
    }
    if (this.open) this.finishClose(false, false);
    this.inline = false;
    this.config = params.config;
    this.opener = params.opener;
    this.returnUrl = params.returnUrl ?? removeRingViewUrl(currentUrl());
    this.mode = params.mode;
    // The Companion app's replacement Web View has no fresh user gesture, and
    // its default WebKit policy requires one for audible autoplay. Match the
    // native camera recovery path by restoring the picture muted; a normal
    // user-opened Live view still follows the configured audio preference.
    this.liveMuted = params.restored && this.mode === "live"
      ? true
      : this.config.live_muted;
    this.recordingStarted = this.mode === "live" || this.config.autoplay_recording;
    this.resetMediaAttempt();
    this.automaticLiveRetry = !params.restored;
    this.pageUnloading = false;
    this.suspended = false;
    this.statusAnnouncement = "";
    this.resetVisitorActions();
    this.resetSnapshotAction();
    this.lastDoorbellState = this.config.doorbell_entity
      ? this.hass.states[this.config.doorbell_entity]?.state
      : undefined;
    this.setRingingUntil(params.ringingUntil);
    this.open = true;
    registerActiveRingViewDialog(this);
    this.syncUrl();
    this.attachGlobalListeners();
    if (params.restored && this.mode === "live") {
      this.prepareAutomaticLiveResume();
    } else {
      this.startMedia();
    }
    void this.updateComplete.then(() => this.focusInitialControl());
  }

  public showInline(params: {
    config: NormalizedConfig;
    mode: CameraMode;
    start: DashboardStart;
    ringingUntil?: number;
  }): void {
    if (!this.hass) return;
    if (this.inline && this.open && this.config === params.config) {
      this.setRingingUntil(params.ringingUntil);
      return;
    }
    if (this.open) this.finishClose(false, false);
    this.inline = true;
    this.config = params.config;
    this.mode = params.start === "live"
      ? "live"
      : params.start === "last_recording"
        ? "last_recording"
        : params.mode;
    this.liveMuted = this.config.dashboard_live_muted;
    this.inlineStarted = params.start !== "on_demand";
    this.recordingStarted = this.mode === "live" || this.inlineStarted;
    this.resetMediaAttempt();
    this.automaticLiveRetry = true;
    this.pageUnloading = false;
    this.suspended = !this.inlineActive;
    this.statusAnnouncement = "";
    this.resetVisitorActions();
    this.resetSnapshotAction();
    this.lastDoorbellState = this.config.doorbell_entity
      ? this.hass.states[this.config.doorbell_entity]?.state
      : undefined;
    this.setRingingUntil(params.ringingUntil);
    this.open = true;
    this.attachGlobalListeners();
    if (this.inlineStarted && this.inlineActive) this.startMedia();
  }

  public setInlineVisible(visible: boolean): void {
    this.inlineVisible = visible;
    this.updateInlineActivity();
  }

  public stopInline(): void {
    if (this.inline) this.finishClose(false, false);
  }

  public isOpenFor(params: RingViewDialogParams): boolean {
    return Boolean(
      this.open
      && this.config
      && this.config.live_entity === params.config.live_entity
      && this.config.recording_entity === params.config.recording_entity
      && this.mode === params.mode,
    );
  }

  public adoptRestoredDialog(params: RingViewDialogParams): void {
    if (params.opener) this.opener = params.opener;
    if (
      params.ringingUntil !== undefined
      && params.ringingUntil > Date.now()
      && (this.ringingUntil === undefined || params.ringingUntil > this.ringingUntil)
    ) {
      this.setRingingUntil(params.ringingUntil);
    }
  }

  public closeDialog(): boolean {
    this.finishClose();
    return true;
  }

  public close(): void {
    this.closeDialog();
  }

  public disconnectedCallback(): void {
    this.finishClose(false, false);
    super.disconnectedCallback();
  }

  protected willUpdate(changed: PropertyValues<this>): void {
    if (!this.open || !this.config) return;
    if (changed.has("hass")) {
      this.detectDoorbellEvent(changed.get("hass") as HomeAssistant | undefined);
    }
    if (!changed.has("hass")) return;
    if (this.config.door_entity && this.doorActionDisabled()) {
      this.cancelDoorHold();
    }
    const entity = this.activeEntity();
    if (entityIsUnavailable(entity) && this.mediaStatus !== "error") {
      this.clearAutomaticLiveRecovery();
      this.lifecycle.dispose();
      this.releaseInlineLive();
      this.session = this.lifecycle.current();
      this.mediaStatus = "error";
      this.statusAnnouncement = localize(this.hass, "viewer.entity_unavailable");
    }
    this.tryAutomaticLiveResume();
  }

  protected render() {
    if (!this.open || !this.hass || !this.config) return nothing;
    const title = this.dialogTitle();
    const showTitle = this.config.show_name;
    const showActivity = activityTimestamp(
      this.config.last_activity_entity
        ? this.hass.states[this.config.last_activity_entity]
        : undefined,
    ) !== undefined;
    const ratio = this.config.aspect_ratio;
    const style = {
      "--ring-view-aspect-ratio":
        ratio === "auto" ? "16 / 9" : ratio.replace(":", " / "),
      "--ring-view-fit-mode": this.config.fit_mode,
    };

    return html`
      ${this.inline
        ? nothing
        : html`<div class="backdrop" @pointerdown=${this.handleBackdrop}></div>`}
      <section
        class="dialog"
        style=${styleMap(style)}
        role=${this.inline ? "region" : "dialog"}
        aria-modal=${this.inline ? nothing : "true"}
        aria-labelledby=${showTitle ? "ring-view-dialog-title" : nothing}
        aria-label=${showTitle
          ? nothing
          : localize(this.hass, "viewer.camera_view")}
        @keydown=${this.handleKeyDown}
      >
        <div class="body">
          ${this.renderMedia()}
          ${this.renderRingAlert()}
          <header class="header">
            ${showTitle || showActivity
              ? html`
                  <div class="header-copy">
                    ${showTitle
                      ? html`<h2 id="ring-view-dialog-title">${title}</h2>`
                      : nothing}
                    ${showActivity
                      ? html`
                          <ring-view-activity-time
                            .hass=${this.hass}
                            .entityId=${this.config.last_activity_entity}
                          ></ring-view-activity-time>
                        `
                      : nothing}
                  </div>
                `
              : nothing}
            <div class="header-actions">
              ${this.renderSnapshotAction()}
              <button
                class=${this.inline ? "icon-button expand" : "icon-button close"}
                type="button"
                aria-label=${localize(
                  this.hass,
                  this.inline ? "viewer.expand_aria" : "viewer.close_aria",
                )}
                title=${this.inline
                  ? localize(this.hass, "viewer.expand_aria")
                  : localizeHaOrFallback(
                      this.hass,
                      "ui.common.close",
                      "common.close",
                    )}
                @click=${this.inline ? this.expand : this.close}
              >
                ${this.icon(this.inline ? mdiFullscreen : mdiClose)}
              </button>
            </div>
            ${this.renderModeSwitch()}
          </header>
          ${this.renderVisitorActions()}
        </div>
        <div class="sr-only" aria-live="polite" aria-atomic="true">
          ${this.statusAnnouncement}
        </div>
      </section>
    `;
  }

  private renderModeSwitch(): TemplateResult {
    const recordingSelected = this.mode === "last_recording";
    const liveSelected = this.mode === "live";
    const recordingLabel = localize(this.hass, "common.last_recording");
    const liveLabel = localize(this.hass, "common.live");
    return html`
      <div
        class="mode-switch"
        role="tablist"
        aria-label=${localize(this.hass, "viewer.camera_view")}
      >
        <button
          id="ring-view-tab-recording"
          class="mode-button recording"
          type="button"
          role="tab"
          aria-label=${recordingLabel}
          title=${recordingLabel}
          aria-selected=${String(recordingSelected)}
          tabindex=${this.mode === "last_recording" ? "0" : "-1"}
          @click=${() => this.selectMode("last_recording")}
          @keydown=${this.handleTabKeyDown}
        >
          ${renderModeIcon("last_recording")}
        </button>
        <button
          id="ring-view-tab-live"
          class="mode-button live"
          type="button"
          role="tab"
          aria-label=${liveLabel}
          title=${liveLabel}
          aria-selected=${String(liveSelected)}
          tabindex=${this.mode === "live" ? "0" : "-1"}
          @click=${() => this.selectMode("live")}
          @keydown=${this.handleTabKeyDown}
        >
          ${renderModeIcon("live")}
        </button>
      </div>
    `;
  }

  private renderSnapshotAction(): TemplateResult | typeof nothing {
    if (!this.shouldShowSnapshotAction()) return nothing;
    const entityId = this.snapshotEntityId();
    const connected = this.hass?.connection?.connected !== false;
    const working = this.snapshotActionStatus === "working";
    const disabled = working || !entityId || !connected;
    const labelKey: TranslationKey | undefined = !connected
      ? "snapshot.connection_failed"
      : !entityId
        ? "snapshot.unavailable"
        : this.snapshotActionStatus === "working"
          ? "snapshot.saving"
          : this.snapshotActionStatus === "success"
            ? "snapshot.saved"
            : this.snapshotActionStatus === "error"
              ? this.snapshotFeedbackMessage
                ? undefined
                : "snapshot.failed"
              : "snapshot.take";
    const label = labelKey
      ? localize(this.hass, labelKey)
      : this.snapshotFeedbackMessage!;
    const icon = this.snapshotActionStatus === "working"
      ? mdiLoading
      : this.snapshotActionStatus === "success"
        ? mdiCheckCircleOutline
        : this.snapshotActionStatus === "error"
          ? mdiAlertCircleOutline
          : mdiCameraOutline;
    return html`
      <button
        class=${classMap({
          "icon-button": true,
          "snapshot-action": true,
          working,
          success: this.snapshotActionStatus === "success",
          error: this.snapshotActionStatus === "error",
        })}
        type="button"
        aria-label=${label}
        aria-busy=${String(working)}
        title=${label}
        ?disabled=${disabled}
        @click=${this.takeSnapshot}
      >
        ${this.icon(icon)}
      </button>
    `;
  }

  private shouldShowSnapshotAction(): boolean {
    return Boolean(
      this.config?.show_snapshot_button
      && this.mode === "live"
      && (!this.inline || this.inlineStarted),
    );
  }

  private snapshotEntityId(): string | undefined {
    return this.hass && this.config
      ? selectSnapshotEntityId(this.hass, this.config)
      : undefined;
  }

  private takeSnapshot = async (): Promise<void> => {
    const hass = this.hass;
    const config = this.config;
    const entityId = this.snapshotEntityId();
    if (
      !hass
      || !config
      || !entityId
      || !this.shouldShowSnapshotAction()
      || this.snapshotActionStatus === "working"
    ) {
      return;
    }

    this.clearSnapshotFeedback();
    this.snapshotActionStatus = "working";
    const token = ++this.snapshotActionToken;

    try {
      if (hass.connection?.connected === false || !hass.callService) {
        throw new Error("Home Assistant service API unavailable");
      }
      await hass.callService(
        "camera",
        "snapshot",
        { filename: buildSnapshotFilename(hass, config) },
        { entity_id: entityId },
      );
      if (token !== this.snapshotActionToken || !this.open) return;
      const message = localize(this.hass, "snapshot.saved");
      this.snapshotActionStatus = "success";
      this.snapshotFeedbackMessage = message;
      this.clearViewerFeedback("snapshot");
      this.statusAnnouncement = message;
      this.snapshotFeedbackTimer = window.setTimeout(() => {
        if (token !== this.snapshotActionToken) return;
        this.snapshotFeedbackTimer = undefined;
        this.snapshotFeedbackMessage = undefined;
        this.snapshotActionStatus = "idle";
      }, SNAPSHOT_SUCCESS_DURATION_MS);
    } catch (error) {
      if (token !== this.snapshotActionToken || !this.open) return;
      const message = localize(this.hass, snapshotErrorKey(error));
      this.snapshotActionStatus = "error";
      this.snapshotFeedbackMessage = message;
      this.setViewerFeedback("snapshot", message, "error");
      this.statusAnnouncement = message;
      this.snapshotFeedbackTimer = window.setTimeout(() => {
        if (token !== this.snapshotActionToken) return;
        this.snapshotFeedbackTimer = undefined;
        this.snapshotFeedbackMessage = undefined;
        this.snapshotActionStatus = "idle";
      }, SNAPSHOT_ERROR_DURATION_MS);
    }
  };

  private clearSnapshotFeedback(): void {
    if (this.snapshotFeedbackTimer !== undefined) {
      window.clearTimeout(this.snapshotFeedbackTimer);
      this.snapshotFeedbackTimer = undefined;
    }
    this.snapshotFeedbackMessage = undefined;
    this.clearViewerFeedback("snapshot");
    if (["success", "error"].includes(this.snapshotActionStatus)) {
      this.snapshotActionStatus = "idle";
    }
  }

  private resetSnapshotAction(): void {
    this.clearSnapshotFeedback();
    this.snapshotActionToken += 1;
    this.snapshotActionStatus = "idle";
  }

  private renderRingAlert(): TemplateResult | typeof nothing {
    if (!this.ringing) return nothing;
    return html`
      <button
        class="dialog-ring-alert"
        type="button"
        ?disabled=${this.mode === "live"}
        @click=${() => this.selectMode("live")}
      >
        ${this.icon(mdiBellRingOutline)}
        <span>${localize(this.hass, "ring.alert")}</span>
        ${this.mode === "live"
          ? nothing
          : html`<span class="ring-action">${localize(this.hass, "ring.open_live")}</span>`}
      </button>
    `;
  }

  private renderVisitorActions(): TemplateResult | typeof nothing {
    const showDoor = this.shouldShowDoorControl();
    const showTalk = this.shouldShowTalkControl();
    if (!showDoor && !showTalk) return nothing;

    const doorDisabled = showDoor ? this.doorActionDisabled() : true;
    const doorLabel = this.doorActionLabel();
    const doorAriaLabel = this.doorActionAriaLabel(doorLabel);
    const doorIcon = this.doorActionIcon();
    const doorContactState = showDoor ? this.doorContactState() : undefined;
    const contactOpen = doorContactState === "open";
    const contactUnknown = doorContactState === "unknown";
    const contactUnknownLabel = localize(this.hass, "door.contact_unknown");
    const talkLabel = this.talkbackRequesting
      ? localize(this.hass, "talkback.requesting_microphone")
      : this.talkbackTalking
        ? localize(this.hass, "talkback.release_to_stop")
        : this.talkbackReady
          ? localize(this.hass, "talkback.hold_to_talk")
          : localize(this.hass, "talkback.connecting_short");

    return html`
      <div class="visitor-controls">
        <div
          class=${classMap({
            "visitor-action-dock": true,
            "door-only": showDoor && !showTalk,
            "talk-only": showTalk && !showDoor,
          })}
          role="group"
          aria-label=${localize(this.hass, "door.actions")}
        >
          ${showTalk
            ? html`
                <button
                  class=${classMap({
                    "visitor-action": true,
                    "talk-action": true,
                    active: this.talkbackTalking,
                  })}
                  type="button"
                  aria-label=${talkLabel}
                  aria-pressed=${String(this.talkbackTalking)}
                  ?disabled=${!this.talkbackReady}
                  @contextmenu=${(event: Event) => event.preventDefault()}
                  @pointerdown=${this.handleTalkPointerDown}
                  @pointerup=${this.handleTalkPointerEnd}
                  @pointercancel=${this.handleTalkPointerEnd}
                  @lostpointercapture=${this.handleTalkPointerEnd}
                  @keydown=${this.handleTalkKeyDown}
                  @keyup=${this.handleTalkKeyUp}
                >
                  ${this.icon(this.talkbackTalking ? mdiMicrophone : mdiMicrophoneOff)}
                  <span>${talkLabel}</span>
                </button>
              `
            : nothing}
          ${showDoor && showTalk
            ? html`<span class="visitor-action-divider" aria-hidden="true"></span>`
            : nothing}
          ${showDoor
            ? html`
                <button
                  class=${classMap({
                    "visitor-action": true,
                    "door-action": true,
                    "contact-open": contactOpen,
                    "contact-unknown": contactUnknown,
                    holding: !contactOpen && this.doorActionStatus === "holding",
                    working: !contactOpen && this.doorActionStatus === "working",
                    success: !contactOpen && this.doorActionStatus === "success",
                    error: !contactOpen && this.doorActionStatus === "error",
                  })}
                  type="button"
                  aria-label=${contactUnknown
                    ? `${doorAriaLabel}. ${contactUnknownLabel}`
                    : doorAriaLabel}
                  aria-busy=${String(this.doorActionStatus === "working")}
                  aria-describedby=${this.viewerFeedback?.source === "door"
                    ? "ring-view-door-feedback"
                    : nothing}
                  ?disabled=${doorDisabled}
                  @contextmenu=${(event: Event) => event.preventDefault()}
                  @click=${this.handleDoorClick}
                  @pointerdown=${this.handleDoorPointerDown}
                  @pointerup=${this.handleDoorPointerEnd}
                  @pointercancel=${this.handleDoorPointerEnd}
                  @lostpointercapture=${this.handleDoorPointerEnd}
                  @keydown=${this.handleDoorKeyDown}
                  @keyup=${this.handleDoorKeyUp}
                >
                  ${this.icon(doorIcon)}
                  <span class="door-action-copy">
                    <span>${doorLabel}</span>
                    ${contactUnknown
                      ? html`<span class="door-contact-state">${contactUnknownLabel}</span>`
                      : nothing}
                  </span>
                </button>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private shouldShowDoorControl(): boolean {
    return Boolean(
      this.config?.door_entity
      && (
        !this.inline
        || this.config.door_control_location === "dashboard_and_viewer"
      )
      && (
        !this.inline
        || this.config.door_control_visibility === "all_views"
        || ["pending", "retrying", "ready", "playback-blocked"].includes(
          this.mediaStatus,
        )
      )
      && (
        this.mode === "live"
        || this.config.door_control_visibility === "all_views"
      ),
    );
  }

  private shouldShowTalkControl(): boolean {
    return Boolean(
      this.mode === "live"
      && this.config?.two_way_audio
      && this.hass
      && supportsRingTalkback(this.hass, this.config.live_entity)
      && ["pending", "ready", "playback-blocked"].includes(this.mediaStatus),
    );
  }

  private doorEntity(): HassEntity | undefined {
    const entityId = this.config?.door_entity;
    return entityId ? this.hass?.states[entityId] : undefined;
  }

  private doorContactState(): DoorContactState | undefined {
    const entityId = this.config?.door_contact_entity;
    if (!entityId) return undefined;
    const state = this.hass?.states[entityId]?.state;
    if (state === "on" || state === "open") return "open";
    if (state === "off" || state === "closed") return "closed";
    return "unknown";
  }

  private doorActionDisabled(): boolean {
    const entity = this.doorEntity();
    if (
      !this.config?.door_entity
      || this.doorContactState() === "open"
      || entityIsUnavailable(entity)
      || entity?.state === "jammed"
      || this.doorActionStatus === "working"
      || this.doorActionStatus === "success"
    ) {
      return true;
    }
    if (this.doorWaitingForLiveVideo()) {
      return true;
    }
    if (this.config.door_action === "open") {
      return !supportsLockOpen(entity) || ["open", "opening"].includes(entity?.state ?? "");
    }
    return ["unlocked", "unlocking", "open", "opening"].includes(entity?.state ?? "");
  }

  private doorActionLabel(): string {
    const entity = this.doorEntity();
    if (this.doorContactState() === "open") {
      return localize(this.hass, "door.contact_open");
    }
    if (entityIsUnavailable(entity)) return localize(this.hass, "door.unavailable");
    if (entity?.state === "jammed") return localize(this.hass, "door.jammed");
    if (this.config?.door_action === "open" && !supportsLockOpen(entity)) {
      return localize(this.hass, "door.open_unsupported");
    }
    if (this.doorWaitingForLiveVideo()) {
      return localize(
        this.hass,
        this.config?.door_action === "open"
          ? "door.open_when_ready"
          : "door.unlock_when_ready",
      );
    }
    if (
      this.doorActionStatus === "working"
      || (this.config?.door_action === "unlock" && entity?.state === "unlocking")
      || (this.config?.door_action === "open" && entity?.state === "opening")
    ) {
      return localize(
        this.hass,
        this.config?.door_action === "open" ? "door.opening" : "door.unlocking",
      );
    }
    if (this.doorActionStatus === "success") {
      return localize(
        this.hass,
        this.config?.door_action === "open" ? "door.opened" : "door.unlocked",
      );
    }
    if (this.config?.door_action === "open" && entity?.state === "open") {
      return localize(this.hass, "door.opened");
    }
    if (
      this.config?.door_action === "unlock"
      && ["unlocked", "open"].includes(entity?.state ?? "")
    ) {
      return localize(this.hass, "door.unlocked");
    }
    if (this.config?.door_hold_to_activate) {
      return localize(
        this.hass,
        this.config.door_action === "open"
          ? "door.hold_to_open"
          : "door.hold_to_unlock",
      );
    }
    return localize(
      this.hass,
      this.config?.door_action === "open" ? "door.open" : "door.unlock",
    );
  }

  private doorActionAriaLabel(visualLabel: string): string {
    if (!this.doorWaitingForLiveVideo()) return visualLabel;
    return localize(
      this.hass,
      this.config?.door_action === "open"
        ? "door.open_when_ready_aria"
        : "door.unlock_when_ready_aria",
    );
  }

  private doorWaitingForLiveVideo(): boolean {
    return Boolean(
      this.inline
      && this.config?.door_control_visibility === "live_only"
      && this.mode === "live"
      && this.mediaStatus !== "ready"
    );
  }

  private doorActionIcon(): string {
    const entity = this.doorEntity();
    const contactState = this.doorContactState();
    if (contactState === "open") return mdiDoorOpen;
    if (contactState === "closed") return mdiDoorClosed;
    if (contactState === "unknown") return mdiAlertCircleOutline;
    if (
      entityIsUnavailable(entity)
      || entity?.state === "jammed"
      || (this.config?.door_action === "open" && !supportsLockOpen(entity))
      || this.doorActionStatus === "error"
    ) {
      return mdiAlertCircleOutline;
    }
    if (this.doorActionStatus === "working") return mdiLoading;
    if (this.doorActionStatus === "success") return mdiCheckCircleOutline;
    return this.config?.door_action === "open"
      ? mdiDoorOpen
      : mdiLockOpenVariantOutline;
  }

  private handleTalkbackState = (
    event: CustomEvent<RingTalkbackState>,
  ): void => {
    if (
      event.currentTarget
      !== this.renderRoot.querySelector("ring-view-ring-webrtc-player")
    ) {
      return;
    }
    if (!event.detail.ready) {
      this.cancelTalkPress(event.currentTarget as RingViewRingWebRtcPlayer);
    }
    this.talkbackReady = event.detail.ready;
    this.talkbackRequesting = event.detail.requesting;
    this.talkbackTalking = event.detail.talking;
  };

  private talkbackPlayer(): RingViewRingWebRtcPlayer | null {
    return this.shadowRoot?.querySelector("ring-view-ring-webrtc-player") ?? null;
  }

  private cancelTalkPress(
    player: RingViewRingWebRtcPlayer | null = this.talkbackPlayer(),
  ): void {
    this.talkPointerId = undefined;
    this.talkKeyboardPressed = false;
    player?.stopTalking();
  }

  private handleTalkPointerDown = (event: PointerEvent): void => {
    if (
      event.button !== 0
      || !event.isPrimary
      || this.talkPointerId !== undefined
      || !this.talkbackReady
    ) {
      return;
    }
    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
    this.talkPointerId = event.pointerId;
    this.talkbackPlayer()?.startTalking();
  };

  private handleTalkPointerEnd = (event: PointerEvent): void => {
    if (this.talkPointerId !== event.pointerId) return;
    this.talkPointerId = undefined;
    this.talkbackPlayer()?.stopTalking();
  };

  private handleTalkKeyDown = (event: KeyboardEvent): void => {
    if (
      ![" ", "Enter"].includes(event.key)
      || event.repeat
      || this.talkKeyboardPressed
      || !this.talkbackReady
    ) {
      return;
    }
    event.preventDefault();
    this.talkKeyboardPressed = true;
    this.talkbackPlayer()?.startTalking();
  };

  private handleTalkKeyUp = (event: KeyboardEvent): void => {
    if (![" ", "Enter"].includes(event.key) || !this.talkKeyboardPressed) return;
    event.preventDefault();
    this.talkKeyboardPressed = false;
    this.talkbackPlayer()?.stopTalking();
  };

  private handleDoorPointerDown = (event: PointerEvent): void => {
    if (
      !this.config?.door_hold_to_activate
      || event.button !== 0
      || !event.isPrimary
      || this.doorPointerId !== undefined
      || this.doorActionDisabled()
    ) {
      return;
    }
    event.preventDefault();
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
    this.doorPointerId = event.pointerId;
    this.beginDoorHold();
  };

  private handleDoorPointerEnd = (event: PointerEvent): void => {
    if (this.doorPointerId !== event.pointerId) return;
    this.doorPointerId = undefined;
    this.cancelDoorHold();
  };

  private handleDoorKeyDown = (event: KeyboardEvent): void => {
    if (
      !this.config?.door_hold_to_activate
      || ![" ", "Enter"].includes(event.key)
      || event.repeat
      || this.doorKeyboardPressed
      || this.doorActionDisabled()
    ) {
      return;
    }
    event.preventDefault();
    this.doorKeyboardPressed = true;
    this.beginDoorHold();
  };

  private handleDoorKeyUp = (event: KeyboardEvent): void => {
    if (![" ", "Enter"].includes(event.key) || !this.doorKeyboardPressed) return;
    event.preventDefault();
    this.doorKeyboardPressed = false;
    this.cancelDoorHold();
  };

  private handleDoorClick = (): void => {
    if (this.config?.door_hold_to_activate || this.doorActionDisabled()) return;
    void this.executeDoorAction();
  };

  private beginDoorHold(): void {
    if (this.doorHoldTimer !== undefined || this.doorActionDisabled()) return;
    this.clearDoorFeedback();
    this.doorActionStatus = "holding";
    this.doorHoldTimer = window.setTimeout(() => {
      this.doorHoldTimer = undefined;
      this.doorPointerId = undefined;
      this.doorKeyboardPressed = false;
      void this.executeDoorAction();
    }, DOOR_HOLD_DURATION_MS);
  }

  private cancelDoorHold(): void {
    if (this.doorHoldTimer !== undefined) {
      window.clearTimeout(this.doorHoldTimer);
      this.doorHoldTimer = undefined;
    }
    this.doorPointerId = undefined;
    this.doorKeyboardPressed = false;
    if (this.doorActionStatus === "holding") this.doorActionStatus = "idle";
  }

  private async executeDoorAction(): Promise<void> {
    const hass = this.hass;
    const entityId = this.config?.door_entity;
    const action = this.config?.door_action;
    if (
      !hass
      || !entityId
      || !action
      || this.doorActionDisabled()
      || document.hidden
    ) {
      this.cancelDoorHold();
      return;
    }

    this.cancelDoorHold();
    this.clearDoorFeedback();
    this.doorActionStatus = "working";
    const token = ++this.doorActionToken;

    try {
      if (!hass.callService) throw new Error("Home Assistant service API unavailable");
      await hass.callService("lock", action, { entity_id: entityId });
      if (token !== this.doorActionToken || !this.open) return;
      const message = localize(
        this.hass,
        action === "open" ? "door.opened" : "door.unlocked",
      );
      this.doorActionStatus = "success";
      this.clearViewerFeedback("door");
      this.statusAnnouncement = message;
      this.doorFeedbackTimer = window.setTimeout(() => {
        if (token !== this.doorActionToken) return;
        this.doorFeedbackTimer = undefined;
        this.clearViewerFeedback("door");
        this.doorActionStatus = "idle";
      }, DOOR_SUCCESS_DURATION_MS);
    } catch {
      if (token !== this.doorActionToken || !this.open) return;
      const message = localize(
        this.hass,
        action === "open" ? "door.open_failed" : "door.unlock_failed",
      );
      this.doorActionStatus = "error";
      this.setViewerFeedback("door", message, "error");
      this.statusAnnouncement = message;
      this.doorFeedbackTimer = window.setTimeout(() => {
        if (token !== this.doorActionToken) return;
        this.doorFeedbackTimer = undefined;
        this.clearViewerFeedback("door");
        this.doorActionStatus = "idle";
      }, DOOR_ERROR_DURATION_MS);
    }
  }

  private clearDoorFeedback(): void {
    if (this.doorFeedbackTimer !== undefined) {
      window.clearTimeout(this.doorFeedbackTimer);
      this.doorFeedbackTimer = undefined;
    }
    this.clearViewerFeedback("door");
    if (["success", "error"].includes(this.doorActionStatus)) {
      this.doorActionStatus = "idle";
    }
  }

  private resetVisitorActions(): void {
    this.cancelTalkPress();
    this.cancelDoorHold();
    this.clearDoorFeedback();
    this.doorActionToken += 1;
    this.doorActionStatus = "idle";
    this.talkbackReady = false;
    this.talkbackRequesting = false;
    this.talkbackTalking = false;
    this.clearViewerFeedback("session");
  }

  private setViewerFeedback(
    source: ViewerFeedbackSource,
    message: string,
    kind: ViewerFeedback["kind"],
  ): void {
    this.viewerFeedback = { source, message, kind };
  }

  private clearViewerFeedback(source: ViewerFeedbackSource): void {
    if (this.viewerFeedback?.source === source) this.viewerFeedback = undefined;
  }

  private renderMedia(): TemplateResult {
    const entity = this.activeEntity();
    const entityId = this.activeEntityId();
    const unavailable = entityIsUnavailable(entity);
    const canRender =
      !unavailable &&
      !this.suspended &&
      (this.mode === "live" || this.recordingStarted);
    const ratio = aspectRatioNumber(this.config!.aspect_ratio);
    const poster = posterUrl(this.hass!, entity, entityId);
    const fallbackUrl =
      this.mode === "last_recording" && typeof entity?.attributes.video_url === "string"
        ? entity.attributes.video_url
        : undefined;
    const renderActiveMedia =
      canRender && ["pending", "ready", "playback-blocked"].includes(this.mediaStatus);
    const useRecordingVideo = Boolean(
      renderActiveMedia && fallbackUrl && !this.recordingVideoFailed,
    );
    const useTalkbackPlayer = Boolean(
      canRender
      && this.mode === "live"
      && this.config!.two_way_audio
      && supportsRingTalkback(this.hass!, entityId),
    );
    const waitingForInitialStart = Boolean(
      (this.inline && !this.inlineStarted)
      || (this.mode === "last_recording" && !this.recordingStarted),
    );

    return html`
      <div
        class=${classMap({
          "media-frame": true,
          "auto-ratio": this.config!.aspect_ratio === "auto",
        })}
        role="tabpanel"
        aria-labelledby=${
          this.mode === "live" ? "ring-view-tab-live" : "ring-view-tab-recording"
        }
      >
        <img class="poster" src=${poster} alt="" aria-hidden="true" />
        ${waitingForInitialStart
          ? html`
              <button
                class="initial-start-surface"
                type="button"
                aria-label=${localize(
                  this.hass,
                  this.mode === "live"
                    ? "viewer.start_live"
                    : "viewer.play_recording",
                )}
                title=${localize(
                  this.hass,
                  this.mode === "live"
                    ? "viewer.start_live"
                    : "viewer.play_recording",
                )}
                @click=${this.mode === "live"
                  ? this.startInlineLive
                  : this.startRecording}
              ></button>
            `
          : nothing}
        ${renderActiveMedia && !useRecordingVideo
          ? keyed(
              `${entityId}:${this.session}`,
              html`
                ${useTalkbackPlayer
                  ? html`
                      <ring-view-ring-webrtc-player
                        class=${this.mediaStatus === "pending" ? "pending" : ""}
                        .hass=${this.hass}
                        .entityId=${entityId}
                        .muted=${this.liveMuted}
                        .fitMode=${this.config!.fit_mode}
                        .poster=${poster}
                        .externalControls=${true}
                        @ring-webrtc-ready=${this.handleMediaReady}
                        @ring-webrtc-error=${this.handleRingWebRtcError}
                        @ring-webrtc-resume=${this.handleLiveResumeRequired}
                        @ring-webrtc-playback-blocked=${this.handlePlaybackBlocked}
                        @ring-webrtc-capabilities=${this.handleMediaCapabilities}
                        @ring-talkback-state=${this.handleTalkbackState}
                        @ring-webrtc-status=${this.handleRingWebRtcStatus}
                      ></ring-view-ring-webrtc-player>
                    `
                  : html`
                      <ring-view-native-camera-adapter
                        class=${this.mediaStatus === "pending" ? "pending" : ""}
                        .stateObj=${entity}
                        .controls=${true}
                        .muted=${this.mode === "live" ? this.liveMuted : this.recordingMuted}
                        .allowExoPlayer=${true}
                        .aspectRatio=${ratio}
                        .fitMode=${this.config!.fit_mode}
                        .passiveSurface=${this.mode === "live"}
                        @native-media-ready=${this.handleMediaReady}
                        @native-media-error=${this.handleMediaError}
                        @native-media-capabilities=${this.handleMediaCapabilities}
                      ></ring-view-native-camera-adapter>
                    `}
              `,
            )
          : nothing}
        ${useRecordingVideo
          ? keyed(
              `${entityId}:${this.session}:recording-video`,
              html`
              <video
                class=${classMap({
                  "video-fallback": true,
                  pending: this.mediaStatus === "pending",
                  "controls-hidden": !this.recordingControlsVisible,
                })}
                src=${fallbackUrl}
                poster=${poster}
                playsinline
                autoplay
                preload="auto"
                .controls=${this.recordingControlsVisible}
                .muted=${this.recordingMuted}
                tabindex="0"
                aria-label=${this.recordingControlsVisible
                  ? nothing
                  : localize(this.hass, "viewer.play_recording")}
                @canplay=${this.handleRecordingCanPlay}
                @error=${this.handleRecordingVideoError}
                @play=${this.handleRecordingPlay}
                @pause=${this.handleRecordingPause}
                @ended=${this.handleRecordingEnded}
                @click=${this.handleRecordingSurfaceClick}
                @keydown=${this.handleRecordingSurfaceKeyDown}
                @pointerdown=${this.handleRecordingControlsInteraction}
                @pointermove=${this.handleRecordingControlsInteraction}
                @focus=${this.handleRecordingControlsInteraction}
              ></video>
            `,
            )
          : nothing}
        ${this.renderStateLayer(unavailable, useRecordingVideo)}
      </div>
    `;
  }

  private renderStateLayer(
    unavailable: boolean,
    hasRecordingFallback: boolean,
  ): TemplateResult | typeof nothing {
    if (unavailable) {
      const entity = this.activeEntity();
      return html`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">${friendlyName(entity, this.activeEntityId())}</div>
            <div class="state-detail">
              ${localize(this.hass, "viewer.entity_unavailable")}
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                ${localize(this.hass, "common.retry")}
              </button>
              ${this.inline ? nothing : this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }

    if (this.suspended) {
      return html`
        <div class="state-layer" role="status">
          <div class="state-card">
            <div class="state-title">
              ${localize(this.hass, "viewer.suspended")}
            </div>
          </div>
        </div>
      `;
    }

    if (this.inline && !this.inlineStarted) return nothing;

    if (this.mode === "live" && this.mediaStatus === "awaiting-resume") {
      return html`
        <div class="state-layer play-layer">
          <button class="action-button primary play-recording resume-live" type="button"
            @click=${this.resumeLive}>
            ${this.icon(mdiPlay)}
            <span>${localize(this.hass, "viewer.resume_live")}</span>
          </button>
        </div>
      `;
    }

    if (this.mediaStatus === "pending" || this.mediaStatus === "retrying") {
      const hasVisitorControls =
        this.shouldShowDoorControl() || this.shouldShowTalkControl();
      return html`
        <div
          class=${classMap({
            "state-layer": true,
            "with-visitor-controls": hasVisitorControls,
          })}
          role="status"
        >
          <div class="state-card">
            <div class="spinner" aria-hidden="true"></div>
            <div class="state-title">
              ${this.mediaStatus === "retrying"
                ? localize(this.hass, "viewer.retrying_live")
                : this.mode === "live"
                ? localize(this.hass, "viewer.connecting_live")
                : localize(this.hass, "viewer.loading_recording")}
            </div>
          </div>
        </div>
      `;
    }

    if (this.mediaStatus === "compatibility" && !hasRecordingFallback) {
      return html`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${localize(this.hass, "viewer.native_unavailable_title")}
            </div>
            <div class="state-detail">
              ${localize(this.hass, "viewer.native_unavailable_detail")}
            </div>
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.openMoreInfo}>
                ${localize(this.hass, "viewer.open_ha_camera")}
              </button>
              ${this.inline ? nothing : this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }

    if (this.mediaStatus === "error") {
      return html`
        <div class="state-layer" role="alert">
          <div class="state-card">
            <div class="state-title">
              ${this.mode === "live"
                ? localize(this.hass, "viewer.live_failed")
                : localize(this.hass, "viewer.recording_unavailable")}
            </div>
            ${this.mode === "last_recording"
              ? html`<div class="state-detail">
                  ${localize(this.hass, "viewer.ring_protect")}
                </div>`
              : nothing}
            <div class="state-actions">
              <button class="action-button primary" type="button" @click=${this.retry}>
                ${localize(this.hass, "common.retry")}
              </button>
              ${this.inline ? nothing : this.renderAlternateModeButton()}
            </div>
          </div>
        </div>
      `;
    }

    if (this.viewerFeedback) {
      const feedbackId = this.viewerFeedback.source === "door"
        ? "ring-view-door-feedback"
        : undefined;
      return html`
        <div
          class=${classMap({
            "state-layer": true,
            "viewer-feedback-layer": true,
            "snapshot-error-layer": this.viewerFeedback.source === "snapshot",
            "door-error-layer": this.viewerFeedback.source === "door",
            "session-message-layer": this.viewerFeedback.source === "session",
          })}
          role=${this.viewerFeedback.kind === "error" ? "alert" : "status"}
          aria-live=${this.viewerFeedback.kind === "error" ? "assertive" : "polite"}
        >
          <div class="state-card">
            <div id=${feedbackId ?? nothing} class="state-title">
              ${this.viewerFeedback.message}
            </div>
          </div>
        </div>
      `;
    }

    return nothing;
  }

  private renderAlternateModeButton(): TemplateResult {
    const alternate = this.mode === "live" ? "last_recording" : "live";
    return html`
      <button class="action-button" type="button" @click=${() => this.selectMode(alternate)}>
        ${localize(
          this.hass,
          alternate === "live" ? "viewer.switch_live" : "viewer.switch_recording",
        )}
      </button>
    `;
  }

  private selectMode(mode: CameraMode): void {
    if (!this.config) return;
    if (mode === this.mode) {
      if (this.inline && !this.inlineStarted) {
        this.inlineStarted = true;
        this.recordingStarted = true;
        this.resetMediaAttempt();
        this.startMedia();
      }
      return;
    }
    this.resetVisitorActions();
    this.resetSnapshotAction();
    this.clearAutomaticLiveRecovery();
    this.lifecycle.dispose();
    this.releaseInlineLive();
    this.automaticLiveRetry = true;
    this.mode = mode;
    saveMode(this.config, mode);
    this.liveMuted = this.inline
      ? this.config.dashboard_live_muted
      : this.config.live_muted;
    this.inlineStarted = true;
    this.recordingStarted = this.inline
      ? true
      : mode === "live" || this.config.autoplay_recording;
    this.resetMediaAttempt();
    this.statusAnnouncement = localize(
      this.hass,
      mode === "live"
        ? "viewer.mode_selected_live"
        : "viewer.mode_selected_recording",
    );
    this.syncUrl();
    this.startMedia();
  }

  private startMedia(): void {
    if (!this.open || this.suspended) {
      this.mediaStatus = "idle";
      return;
    }
    if (this.mode === "last_recording" && !this.recordingStarted) {
      this.mediaStatus = "idle";
      return;
    }
    if (this.inline && !this.inlineStarted) {
      this.mediaStatus = "idle";
      return;
    }
    if (entityIsUnavailable(this.activeEntity())) {
      this.mediaStatus = "error";
      this.statusAnnouncement = localize(this.hass, "viewer.entity_unavailable");
      return;
    }
    if (this.inline && this.mode === "live" && !this.claimInlineLive()) {
      this.waitForLiveResume();
      return;
    }
    if (this.mode === "last_recording") this.resetRecordingControls();
    this.mediaStatus = "pending";
    this.session = this.lifecycle.next();
    this.lifecycle.scheduleTimeout(
      () => this.failMedia(),
      LIVE_TIMEOUT_SECONDS * 1_000,
    );
  }

  private resetMediaAttempt(): void {
    this.cancelTalkPress();
    this.resetRecordingControls();
    this.retryCount = 0;
    this.recordingMuted = false;
    this.liveHasAudio = undefined;
    this.recordingVideoFailed = false;
    this.talkbackReady = false;
    this.talkbackRequesting = false;
    this.talkbackTalking = false;
  }

  private acceptsMediaEvent(event?: Event): boolean {
    return this.open
      && ["pending", "ready", "playback-blocked"].includes(this.mediaStatus)
      && (!event || (event.currentTarget instanceof HTMLElement && event.currentTarget.isConnected));
  }

  private handleMediaReady = (event?: Event): void => {
    if (!this.acceptsMediaEvent(event)) return;
    this.clearAutomaticLiveRecovery();
    this.lifecycle.clearTimeout();
    this.mediaStatus = "ready";
    this.statusAnnouncement =
      this.mode === "live"
        ? this.liveAudioStatus()
        : this.recordingMuted
          ? localize(this.hass, "viewer.recording_loaded_muted")
          : localize(this.hass, "viewer.recording_loaded_audio");
  };

  private handleMediaCapabilities = (
    event: CustomEvent<NativeMediaCapabilities>,
  ): void => {
    if (this.mode !== "live" || typeof event.detail?.hasAudio !== "boolean") return;
    // Home Assistant's WebRTC player intentionally drops an arriving audio
    // track when it starts muted. In that state, hasAudio=false means "audio
    // was not attached", not necessarily "the camera has no audio".
    if (this.liveMuted && event.detail.hasAudio === false) return;
    // Multiple native candidates can report capabilities. A positive audio
    // result wins because Home Assistant can select that candidate when sound
    // is requested.
    this.liveHasAudio = this.liveHasAudio === true || event.detail.hasAudio;
    if (this.mediaStatus === "ready" && this.liveHasAudio) {
      this.statusAnnouncement = localize(this.hass, "viewer.live_connected_audio");
    } else if (this.mediaStatus === "ready" && this.liveHasAudio === false) {
      this.statusAnnouncement = localize(this.hass, "viewer.live_connected_no_audio");
    }
  };

  private liveAudioStatus(): string {
    if (this.liveMuted) return localize(this.hass, "viewer.live_connected_muted");
    if (this.liveHasAudio === true) {
      return localize(this.hass, "viewer.live_connected_audio");
    }
    if (this.liveHasAudio === false) {
      return localize(this.hass, "viewer.live_connected_no_audio");
    }
    return localize(this.hass, "viewer.live_detecting_audio");
  }

  private handleRecordingVideoError = (event?: Event): void => {
    if (this.mode !== "last_recording" || !this.acceptsMediaEvent(event)) return;
    // The Ring URL is temporary and can expire between state refreshes. Fall
    // back to Home Assistant's authenticated MJPEG renderer for this attempt.
    this.recordingVideoFailed = true;
    this.statusAnnouncement = localize(this.hass, "viewer.trying_ha");
    this.startMedia();
  };

  private handleRecordingCanPlay = (event: Event): void => {
    const video = event.currentTarget;
    const session = this.session;
    if (
      !(video instanceof HTMLVideoElement)
      || this.recordingPlayback.has(video)
      || !this.isCurrentRecording(video, session)
    ) {
      return;
    }

    this.recordingPlayback.add(video);
    void this.playRecording(video, session);
  };

  private handleRecordingPlay = (event: Event): void => {
    const video = event.currentTarget;
    if (!(video instanceof HTMLVideoElement) || !this.isCurrentRecording(video, this.session)) {
      return;
    }
    this.clearRecordingControlsTimer();
    this.recordingEnded = false;
    this.recordingPaused = false;
    this.recordingControlsVisible = true;
    video.controls = true;
  };

  private handleRecordingPause = (event: Event): void => {
    const video = event.currentTarget;
    if (!(video instanceof HTMLVideoElement) || !this.isCurrentRecording(video, this.session)) {
      return;
    }
    this.recordingPaused = true;
    if (!video.ended) this.recordingEnded = false;
    this.scheduleRecordingControlsHide(video, this.session);
  };

  private handleRecordingEnded = (event: Event): void => {
    const video = event.currentTarget;
    if (!(video instanceof HTMLVideoElement) || !this.isCurrentRecording(video, this.session)) {
      return;
    }
    this.recordingPaused = true;
    this.recordingEnded = true;
    this.scheduleRecordingControlsHide(video, this.session);
  };

  private handleRecordingSurfaceClick = (event: MouseEvent): void => {
    const video = event.currentTarget;
    if (!(video instanceof HTMLVideoElement) || video.controls) return;
    event.preventDefault();
    event.stopPropagation();
    this.resumeRecordingFromSurface(video);
  };

  private handleRecordingSurfaceKeyDown = (event: KeyboardEvent): void => {
    const video = event.currentTarget;
    if (!(video instanceof HTMLVideoElement)) return;
    if (video.controls) {
      this.handleRecordingControlsInteraction(event);
      return;
    }
    if (!["Enter", " "].includes(event.key)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.resumeRecordingFromSurface(video);
  };

  private handleRecordingControlsInteraction = (event: Event): void => {
    const video = event.currentTarget;
    if (
      !(video instanceof HTMLVideoElement)
      || !video.controls
      || !this.recordingPaused
      || !this.isCurrentRecording(video, this.session)
    ) {
      return;
    }
    this.scheduleRecordingControlsHide(video, this.session);
  };

  private resumeRecordingFromSurface(video: HTMLVideoElement): void {
    if (!this.isCurrentRecording(video, this.session)) return;
    this.clearRecordingControlsTimer();
    if (this.recordingEnded || video.ended) {
      try {
        video.currentTime = 0;
      } catch {
        // A newly refreshed temporary URL may not be seekable yet; play() can
        // still restart it once the browser has loaded enough media.
      }
    }
    this.recordingEnded = false;
    this.recordingPaused = false;
    this.recordingControlsVisible = true;
    video.controls = true;
    void video.play().catch(() => undefined);
  }

  private scheduleRecordingControlsHide(
    video: HTMLVideoElement,
    session: number,
  ): void {
    this.clearRecordingControlsTimer();
    this.recordingControlsTimer = window.setTimeout(() => {
      this.recordingControlsTimer = undefined;
      if (!this.isCurrentRecording(video, session)) return;
      video.controls = false;
      this.recordingControlsVisible = false;
    }, RECORDING_CONTROLS_HIDE_DELAY_MS);
  }

  private resetRecordingControls(): void {
    this.clearRecordingControlsTimer();
    this.recordingControlsVisible = true;
    this.recordingEnded = false;
    this.recordingPaused = false;
  }

  private clearRecordingControlsTimer(): void {
    if (this.recordingControlsTimer === undefined) return;
    window.clearTimeout(this.recordingControlsTimer);
    this.recordingControlsTimer = undefined;
  }

  private isCurrentRecording(video: HTMLVideoElement, session: number): boolean {
    return this.acceptsMediaEvent()
      && this.mode === "last_recording"
      && session === this.lifecycle.current()
      && video.isConnected
      && video === this.renderRoot.querySelector(".video-fallback");
  }

  private async playRecording(video: HTMLVideoElement, session: number): Promise<void> {
    try {
      await video.play();
    } catch {
      if (!this.isCurrentRecording(video, session)) return;
      if (this.recordingMuted) {
        this.handleRecordingVideoError();
        return;
      }
      // Keep the same recording and retry audible-autoplay rejection muted.
      // Native controls can enable sound afterward.
      this.recordingMuted = true;
      video.muted = true;
      this.statusAnnouncement = localize(this.hass, "viewer.recording_audio_blocked");
      try {
        await video.play();
      } catch {
        if (this.isCurrentRecording(video, session)) this.handleRecordingVideoError();
        return;
      }
    }
    // A resolved/rejected promise from a removed player must never update a
    // reopened dialog or cancel the timeout belonging to a newer Live session.
    if (this.isCurrentRecording(video, session)) this.handleMediaReady();
  }

  private handleMediaError = (event: CustomEvent<NativeAdapterFailure>): void => {
    if (!this.acceptsMediaEvent(event) || event.detail !== "component-unavailable") return;
    // Native candidate/autoplay fallback is owned by HA. This adapter only
    // reports component availability; stalled playback uses our session timer.
    this.clearAutomaticLiveRecovery();
    this.lifecycle.clearTimeout();
    this.mediaStatus = "compatibility";
    this.statusAnnouncement = localize(this.hass, "viewer.native_unavailable_title");
  };

  private handleRingWebRtcError = (event: Event): void => {
    if (!this.acceptsMediaEvent(event) || this.mode !== "live" || !this.config?.two_way_audio) return;
    this.failMedia();
  };

  private handleRingWebRtcStatus = (
    event: CustomEvent<RingWebRtcStatus>,
  ): void => {
    if (
      event.currentTarget
        !== this.renderRoot.querySelector("ring-view-ring-webrtc-player")
      || this.mode !== "live"
      || !this.config?.two_way_audio
    ) {
      return;
    }
    if (event.detail.message) {
      this.setViewerFeedback(
        "session",
        event.detail.message,
        event.detail.kind,
      );
    } else {
      this.clearViewerFeedback("session");
    }
  };

  private handleLiveResumeRequired = (event: Event): void => {
    if (!this.acceptsMediaEvent(event) || this.mode !== "live") return;
    this.waitForLiveResume();
  };

  private waitForLiveResume(): void {
    this.cancelTalkPress();
    this.clearAutomaticLiveRecovery();
    this.lifecycle.dispose();
    this.releaseInlineLive();
    this.session = this.lifecycle.current();
    this.automaticLiveRetry = false;
    this.mediaStatus = "awaiting-resume";
    this.talkbackReady = false;
    this.talkbackRequesting = false;
    this.talkbackTalking = false;
    this.statusAnnouncement = localize(this.hass, "viewer.resume_live");
  }

  private prepareAutomaticLiveResume(): void {
    this.waitForLiveResume();
    this.automaticLiveRecovery = "waiting";
    this.tryAutomaticLiveResume();
  }

  private tryAutomaticLiveResume = (): void => {
    if (
      this.automaticLiveRecovery !== "waiting"
      || !this.open || !this.isConnected || this.mode !== "live"
      || this.mediaStatus !== "awaiting-resume" || this.pageUnloading
    ) return;
    const connection = this.hass?.connection;
    if (this.recoveryConnection !== connection) {
      this.recoveryConnection?.removeEventListener?.("ready", this.handleRecoveryConnectionReady);
      this.recoveryConnection = connection;
      connection?.addEventListener?.("ready", this.handleRecoveryConnectionReady);
    }
    if (
      document.hidden || connection?.connected === false
      || (this.config?.two_way_audio && !connection)
      || entityIsUnavailable(this.activeEntity())
    ) return;
    this.clearAutomaticLiveRecovery();
    // Consume the single attempt before mounting any renderer. Readiness,
    // visibility and repeated HA updates cannot create another session.
    this.automaticLiveRecovery = "attempting";
    this.liveMuted = true;
    this.statusAnnouncement = localize(this.hass, "viewer.connecting_live");
    this.startMedia();
  };

  private handleRecoveryConnectionReady = (): void => {
    // HA iterates its live listener array. Unregistering in that callback can
    // skip another consumer; defer consumption and cleanup until dispatch ends.
    queueMicrotask(this.tryAutomaticLiveResume);
  };

  private clearAutomaticLiveRecovery(): void {
    this.automaticLiveRecovery = undefined;
    this.recoveryConnection?.removeEventListener?.("ready", this.handleRecoveryConnectionReady);
    this.recoveryConnection = undefined;
  }

  private resumeLive = (): void => {
    if (!this.open || this.mode !== "live" || this.mediaStatus !== "awaiting-resume") return;
    if (this.inline) this.claimInlineLive(true);
    this.clearAutomaticLiveRecovery();
    this.resetMediaAttempt();
    this.startMedia();
    void this.updateComplete.then(() => this.focusInitialControl());
  };

  private handlePlaybackBlocked = (event: Event): void => {
    if (!this.acceptsMediaEvent(event) || this.mode !== "live") return;
    // A connected stream waiting for Play is not a failed connection. Keep
    // that player mounted, expose its Play button, and stop the failure timer.
    this.lifecycle.clearTimeout();
    this.mediaStatus = "playback-blocked";
    this.statusAnnouncement = localize(this.hass, "viewer.resume_live");
  };

  private failMedia(): void {
    this.cancelTalkPress();
    if (this.automaticLiveRecovery === "attempting") {
      // Keep v0.5.8's proven manual path if this one attempt cannot recover.
      // Autoplay rejection uses playback-blocked instead and retains the peer.
      this.waitForLiveResume();
      return;
    }
    if (
      this.automaticLiveRetry
      && this.mode === "live"
      && this.retryCount < 1
    ) {
      this.retryCount += 1;
      this.scheduleLiveReconnect(LIVE_RETRY_DELAY_MS);
      return;
    }
    this.lifecycle.dispose();
    this.releaseInlineLive();
    this.session = this.lifecycle.current();
    this.mediaStatus = "error";
    this.statusAnnouncement =
      this.mode === "live"
        ? localize(this.hass, "viewer.live_failed")
        : localize(this.hass, "viewer.recording_unavailable");
  }

  private scheduleLiveReconnect(delay: number): void {
    this.lifecycle.dispose();
    this.session = this.lifecycle.current();
    this.mediaStatus = "retrying";
    this.statusAnnouncement = localize(this.hass, "viewer.retrying_live");
    this.lifecycle.scheduleTimeout(() => this.startMedia(), delay);
  }

  private retry = (): void => {
    this.clearAutomaticLiveRecovery();
    this.resetMediaAttempt();
    this.startMedia();
  };

  private startRecording = (): void => {
    if (this.mode !== "last_recording" || this.recordingStarted) return;
    this.inlineStarted = true;
    this.recordingStarted = true;
    this.startMedia();
  };

  private startInlineLive = (): void => {
    if (!this.inline || this.mode !== "live" || this.inlineStarted) return;
    this.inlineStarted = true;
    this.startMedia();
  };

  private openMoreInfo = (): void => {
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: this.activeEntityId() },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private activeEntityId(): string {
    return this.mode === "live"
      ? this.config!.live_entity
      : this.config!.recording_entity;
  }

  private activeEntity(): HassEntity | undefined {
    return this.hass?.states[this.activeEntityId()];
  }

  private dialogTitle(): string {
    if (this.config?.name) return this.config.name;
    return friendlyName(
      this.hass?.states[this.config!.recording_entity],
      localize(this.hass, "common.camera"),
    );
  }

  private handleBackdrop = (event: PointerEvent): void => {
    if (event.target === event.currentTarget) this.close();
  };

  private expand = (): void => {
    if (!this.inline || !this.config) return;
    this.dispatchEvent(
      new CustomEvent("ring-view-expand", {
        detail: { mode: this.mode, ringingUntil: this.ringingUntil },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (this.inline) return;
    if (event.key === "Escape") {
      if (document.fullscreenElement) return;
      event.preventDefault();
      event.stopPropagation();
      this.close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = this.focusableElements();
    if (focusable.length === 0) return;
    const first = focusable[0]!;
    const last = focusable[focusable.length - 1]!;
    let activeElement = this.shadowRoot?.activeElement;
    while (activeElement?.shadowRoot?.activeElement) activeElement = activeElement.shadowRoot.activeElement;
    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  private handleTabKeyDown = (event: KeyboardEvent): void => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next: CameraMode =
      event.key === "ArrowLeft" || event.key === "Home" ? "last_recording" : "live";
    this.selectMode(next);
    void this.updateComplete.then(() => {
      const selector = next === "live" ? ".mode-button.live" : ".mode-button.recording";
      this.renderRoot.querySelector<HTMLElement>(selector)?.focus();
    });
  };

  private focusableElements(): HTMLElement[] {
    const selector = 'button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])';
    return Array.from(
      this.renderRoot.querySelectorAll<HTMLElement>(
        `${selector}, ring-view-ring-webrtc-player`,
      ),
    ).flatMap((element) => element.localName === "ring-view-ring-webrtc-player"
      ? element.classList.contains("pending") ? [] : Array.from(element.shadowRoot?.querySelectorAll<HTMLElement>(selector) ?? [])
      : [element]
    ).filter((element) => element.offsetParent !== null);
  }

  private focusInitialControl(): void {
    if (this.inline) return;
    this.renderRoot.querySelector<HTMLElement>(".close")?.focus();
  }

  private attachGlobalListeners(): void {
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    window.addEventListener("pagehide", this.handlePageHide);
    window.addEventListener("pageshow", this.handlePageShow);
    window.addEventListener("blur", this.handleWindowBlur);
  }

  private detachGlobalListeners(): void {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    window.removeEventListener("pagehide", this.handlePageHide);
    window.removeEventListener("pageshow", this.handlePageShow);
    window.removeEventListener("blur", this.handleWindowBlur);
  }

  private handleWindowBlur = (): void => {
    this.cancelDoorHold();
    this.cancelTalkPress();
  };

  private handlePageHide = (): void => {
    this.pageUnloading = true;
    this.resetVisitorActions();
    this.resetSnapshotAction();
    if (this.inline) {
      this.suspendInline();
      return;
    }
    if (!this.open || this.mode !== "live") return;
    this.renderRoot.querySelector<RingViewRingWebRtcPlayer>("ring-view-ring-webrtc-player")?.stopTalking();
    this.waitForLiveResume();
  };

  private handlePageShow = (event: PageTransitionEvent): void => {
    const returning = this.pageUnloading;
    this.pageUnloading = false;
    if (this.inline) {
      this.updateInlineActivity();
      return;
    }
    if (returning && event.persisted && this.open && this.mode === "live") {
      this.prepareAutomaticLiveResume();
    }
  };

  private handleVisibilityChange = (): void => {
    if (!this.open) return;
    if (this.inline) {
      this.updateInlineActivity();
      return;
    }
    if (document.hidden) this.cancelDoorHold();
    if (this.automaticLiveRecovery === "waiting") {
      this.tryAutomaticLiveResume();
      return;
    }
    if (document.hidden && this.automaticLiveRecovery === "attempting") {
      this.waitForLiveResume();
      return;
    }
    if (this.mediaStatus === "awaiting-resume") return;
    if (this.mode === "live" && this.config?.two_way_audio) {
      if (document.hidden) {
        this.renderRoot
          .querySelector<RingViewRingWebRtcPlayer>("ring-view-ring-webrtc-player")
          ?.stopTalking();
      }
      return;
    }
    if (document.hidden) {
      this.lifecycle.dispose();
      this.session = this.lifecycle.current();
      this.suspended = true;
      this.mediaStatus = "idle";
    } else if (this.suspended) {
      this.suspended = false;
      this.startMedia();
    }
  };

  private updateInlineActivity(): void {
    const active = Boolean(
      this.inlineVisible
      && document.visibilityState !== "hidden"
      && !this.pageUnloading,
    );
    if (active === this.inlineActive) return;
    this.inlineActive = active;
    if (!this.inline || !this.open) return;
    if (!active) {
      this.suspendInline();
      return;
    }
    this.suspended = false;
    if (this.inlineStarted) this.startMedia();
  }

  private suspendInline(): void {
    this.inlineActive = false;
    if (!this.inline || !this.open) return;
    this.resetVisitorActions();
    this.clearAutomaticLiveRecovery();
    this.lifecycle.dispose();
    this.releaseInlineLive();
    this.session = this.lifecycle.current();
    this.suspended = true;
    this.mediaStatus = "idle";
  }

  private detectDoorbellEvent(previous?: HomeAssistant): void {
    const entityId = this.config?.doorbell_entity;
    if (!entityId || !this.hass) return;
    const after = this.hass.states[entityId];
    const beforeState = previous?.states[entityId]?.state ?? this.lastDoorbellState;
    this.lastDoorbellState = after?.state;
    if (
      !after
      || beforeState === undefined
      || beforeState === after.state
      || ["unknown", "unavailable"].includes(after.state)
      || (after.attributes.event_type !== undefined
        && after.attributes.event_type !== "ring")
    ) {
      return;
    }
    this.setRingingUntil(Date.now() + RING_ALERT_DURATION_MS);
  }

  private setRingingUntil(until?: number): void {
    if (this.ringAlertTimer !== undefined) {
      window.clearTimeout(this.ringAlertTimer);
      this.ringAlertTimer = undefined;
    }
    const remaining = until === undefined ? 0 : until - Date.now();
    this.ringingUntil = remaining > 0 ? until : undefined;
    this.ringing = remaining > 0;
    if (!this.ringing) {
      this.syncUrl();
      return;
    }
    this.ringAlertTimer = window.setTimeout(() => {
      this.ringing = false;
      this.ringingUntil = undefined;
      this.ringAlertTimer = undefined;
      this.syncUrl();
    }, remaining);
  }

  private syncUrl(): void {
    if (this.inline || !this.open || !this.config || !this.returnUrl) return;
    const viewerUrl = createRingViewUrl(this.returnUrl, {
      liveEntity: this.config.live_entity,
      recordingEntity: this.config.recording_entity,
      mode: this.mode,
      ringingUntil: this.ringingUntil,
    });
    // `refreshUrl` is the same Home Assistant history convention used to
    // recover a useful URL when a dialog-owning document is rebuilt.
    replaceCurrentUrl(viewerUrl, viewerUrl);
  }

  private finishClose(restoreFocus = true, notifyManager = true): void {
    if (!this.open) return;
    const wasInline = this.inline;
    this.clearAutomaticLiveRecovery();
    const opener = this.opener;
    const returnUrl = this.returnUrl;
    const config = this.config;
    this.renderRoot
      .querySelector<RingViewRingWebRtcPlayer>("ring-view-ring-webrtc-player")
      ?.stopTalking();
    this.lifecycle.dispose();
    this.releaseInlineLive();
    this.session = this.lifecycle.current();
    this.mediaStatus = "idle";
    this.open = false;
    unregisterActiveRingViewDialog(this);
    this.suspended = false;
    this.resetMediaAttempt();
    this.automaticLiveRetry = true;
    this.recordingStarted = true;
    this.statusAnnouncement = "";
    this.resetVisitorActions();
    this.resetSnapshotAction();
    this.setRingingUntil();
    this.lastDoorbellState = undefined;
    this.detachGlobalListeners();
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => undefined);
    if (
      notifyManager
      && returnUrl
      && config
      && ringViewUrlMatchesConfig(decodeRingViewUrl(), config)
    ) {
      replaceCurrentUrl(returnUrl, null);
    }
    if (!wasInline) {
      this.dispatchEvent(
        new CustomEvent("viewer-closed", { bubbles: true, composed: true }),
      );
    }
    if (notifyManager) {
      this.dispatchEvent(
        new CustomEvent("dialog-closed", {
          detail: { dialog: RING_VIEW_DIALOG_TAG },
          bubbles: true,
          composed: true,
        }),
      );
    }
    this.config = undefined;
    this.returnUrl = undefined;
    this.inlineStarted = true;
    if (restoreFocus && opener?.isConnected) opener.focus();
    this.opener = undefined;
  }

  private icon(path: string): TemplateResult {
    return html`<svg viewBox="0 0 24 24" aria-hidden="true"><path d=${path}></path></svg>`;
  }

  private claimInlineLive(takeOver = false): boolean {
    const entityId = this.config?.live_entity;
    if (!this.inline || !entityId) return true;
    const current = inlineLiveOwners.get(entityId);
    if (current && current !== this) {
      if (!takeOver) return false;
      current.pauseForInlineTakeover();
    }
    inlineLiveOwners.set(entityId, this);
    return true;
  }

  private releaseInlineLive(): void {
    const entityId = this.config?.live_entity;
    if (entityId && inlineLiveOwners.get(entityId) === this) {
      inlineLiveOwners.delete(entityId);
    }
  }

  private pauseForInlineTakeover(): void {
    if (!this.inline || !this.open || this.mode !== "live") return;
    this.resetVisitorActions();
    this.clearAutomaticLiveRecovery();
    this.lifecycle.dispose();
    this.releaseInlineLive();
    this.session = this.lifecycle.current();
    this.automaticLiveRetry = false;
    this.mediaStatus = "awaiting-resume";
    this.statusAnnouncement = localize(this.hass, "viewer.resume_live");
  }

}

const inlineLiveOwners = new Map<string, RingViewDialog>();

declare global {
  interface HTMLElementTagNameMap {
    "ring-view-dialog": RingViewDialog;
  }
}
