import type { CameraMode, NormalizedConfig } from "./types";

export const RING_VIEW_DIALOG_TAG = "ring-view-dialog";
export const RING_ALERT_DURATION_MS = 12_000;

export interface RingViewDialogParams {
  config: NormalizedConfig;
  mode: CameraMode;
  opener?: HTMLElement;
  ringingUntil?: number;
}

interface ShowDialogDetail {
  dialogTag: typeof RING_VIEW_DIALOG_TAG;
  dialogImport: () => Promise<unknown>;
  dialogParams: RingViewDialogParams;
  addHistory: true;
}

/**
 * Ask Home Assistant's application-level dialog manager to own the viewer.
 * Keeping the viewer outside the card lets responsive dashboard layouts move
 * or recreate the card without interrupting an active camera session.
 */
export function showRingViewDialog(
  source: HTMLElement,
  params: RingViewDialogParams,
): void {
  source.dispatchEvent(
    new CustomEvent<ShowDialogDetail>("show-dialog", {
      detail: {
        dialogTag: RING_VIEW_DIALOG_TAG,
        dialogImport: () => import("./ring-view-dialog"),
        dialogParams: params,
        addHistory: true,
      },
      bubbles: true,
      composed: true,
    }),
  );
}
