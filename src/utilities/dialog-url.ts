import type { CameraMode, NormalizedConfig } from "../types";

const LIVE_ENTITY_PARAM = "ring-view-live-entity";
const RECORDING_ENTITY_PARAM = "ring-view-recording-entity";
const MODE_PARAM = "ring-view-mode";
const RINGING_UNTIL_PARAM = "ring-view-ringing-until";

export interface RingViewUrlState {
  liveEntity: string;
  recordingEntity: string;
  mode: CameraMode;
  ringingUntil?: number;
}

export function currentUrl(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function decodeRingViewUrl(
  source: string | URLSearchParams = window.location.search,
): RingViewUrlState | undefined {
  const params = source instanceof URLSearchParams
    ? source
    : new URLSearchParams(source);
  const liveEntity = params.get(LIVE_ENTITY_PARAM);
  const recordingEntity = params.get(RECORDING_ENTITY_PARAM);
  const mode = params.get(MODE_PARAM);
  if (
    !liveEntity?.startsWith("camera.")
    || !recordingEntity?.startsWith("camera.")
    || (mode !== "live" && mode !== "last_recording")
  ) {
    return undefined;
  }

  const rawRingingUntil = params.get(RINGING_UNTIL_PARAM);
  const ringingUntil = rawRingingUntil === null
    ? undefined
    : Number(rawRingingUntil);
  return {
    liveEntity,
    recordingEntity,
    mode,
    ringingUntil:
      ringingUntil !== undefined && Number.isFinite(ringingUntil)
        ? ringingUntil
        : undefined,
  };
}

export function ringViewUrlMatchesConfig(
  state: RingViewUrlState | undefined,
  config: NormalizedConfig,
): state is RingViewUrlState {
  return state?.liveEntity === config.live_entity
    && state.recordingEntity === config.recording_entity;
}

export function createRingViewUrl(
  base: string,
  state: RingViewUrlState,
): string {
  const url = new URL(base, window.location.origin);
  url.searchParams.set(LIVE_ENTITY_PARAM, state.liveEntity);
  url.searchParams.set(RECORDING_ENTITY_PARAM, state.recordingEntity);
  url.searchParams.set(MODE_PARAM, state.mode);
  if (state.ringingUntil !== undefined && state.ringingUntil > Date.now()) {
    url.searchParams.set(RINGING_UNTIL_PARAM, String(state.ringingUntil));
  } else {
    url.searchParams.delete(RINGING_UNTIL_PARAM);
  }
  return `${url.pathname}${url.search}${url.hash}`;
}

export function removeRingViewUrl(base: string): string {
  const url = new URL(base, window.location.origin);
  url.searchParams.delete(LIVE_ENTITY_PARAM);
  url.searchParams.delete(RECORDING_ENTITY_PARAM);
  url.searchParams.delete(MODE_PARAM);
  url.searchParams.delete(RINGING_UNTIL_PARAM);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function replaceCurrentUrl(
  url: string,
  refreshUrl?: string | null,
): void {
  try {
    const state = window.history.state && typeof window.history.state === "object"
      ? window.history.state
      : {};
    let nextState = state;
    if (refreshUrl === null) {
      const { refreshUrl: _discarded, ...rest } = state;
      nextState = rest;
    } else if (refreshUrl !== undefined) {
      nextState = { ...state, refreshUrl };
    }
    window.history.replaceState(
      nextState,
      "",
      url,
    );
  } catch {
    // A hardened or embedded browser may prevent History API updates.
  }
}
