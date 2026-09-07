import type { CameraMode, NormalizedConfig } from "./types";
import {
  currentUrl,
  removeRingViewUrl,
  replaceCurrentUrl,
} from "./utilities/dialog-url";

export const RING_VIEW_DIALOG_TAG = "ring-view-dialog";
export const RING_ALERT_DURATION_MS = 12_000;

export interface RingViewDialogParams {
  config: NormalizedConfig;
  mode: CameraMode;
  opener?: HTMLElement;
  ringingUntil?: number;
  returnUrl?: string;
  restored?: boolean;
}

interface ActiveRingViewDialog {
  isOpenFor(params: RingViewDialogParams): boolean;
  adoptRestoredDialog(params: RingViewDialogParams): void;
}

let activeRingViewDialog: ActiveRingViewDialog | undefined;

export function registerActiveRingViewDialog(dialog: ActiveRingViewDialog): void {
  activeRingViewDialog = dialog;
}

export function unregisterActiveRingViewDialog(dialog: ActiveRingViewDialog): void {
  if (activeRingViewDialog === dialog) activeRingViewDialog = undefined;
}

function adoptActiveRingViewDialog(params: RingViewDialogParams): boolean {
  if (!params.restored || !activeRingViewDialog?.isOpenFor(params)) return false;
  activeRingViewDialog.adoptRestoredDialog(params);
  return true;
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
  // A sections layout can recreate the originating card while Home Assistant's
  // application-owned dialog remains connected. The replacement card sees the
  // recoverable URL too, but must adopt that dialog rather than show it again.
  // This module state intentionally resets on a genuine frontend reload.
  if (adoptActiveRingViewDialog(params)) return;

  // Home Assistant's native More info flow keeps the underlying history entry
  // clean, then puts recoverable dialog state on the dialog entry itself.
  const returnUrl = removeRingViewUrl(currentUrl());
  replaceCurrentUrl(returnUrl);
  source.dispatchEvent(
    new CustomEvent<ShowDialogDetail>("show-dialog", {
      detail: {
        dialogTag: RING_VIEW_DIALOG_TAG,
        dialogImport: () => import("./ring-view-dialog"),
        dialogParams: { ...params, returnUrl },
        addHistory: true,
      },
      bubbles: true,
      composed: true,
    }),
  );
}
