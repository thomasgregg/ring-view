import type { HomeAssistant } from "../src/types";

interface ShowDialogDetail {
  dialogTag: string;
  dialogImport: () => Promise<unknown>;
  dialogParams?: unknown;
  addHistory?: boolean;
}

interface ManagedDialog extends HTMLElement {
  hass?: HomeAssistant;
  showDialog(params?: unknown): void;
  closeDialog(): boolean | void;
}

export interface DemoDialogManager {
  updateHass(hass: HomeAssistant): void;
}

/** A small browser-test stand-in for Home Assistant's application dialog manager. */
export function installDemoDialogManager(
  getHass: (event: Event) => HomeAssistant,
): DemoDialogManager {
  const dialogs = new Map<string, ManagedDialog>();
  let activeTag: string | undefined;

  const showDialog = async (rawEvent: Event): Promise<void> => {
    const event = rawEvent as CustomEvent<ShowDialogDetail>;
    const detail = event.detail;
    if (!detail?.dialogTag || !detail.dialogImport) return;
    const hass = getHass(rawEvent);
    if (detail.addHistory !== false) {
      if (history.state?.dialog) {
        history.replaceState({ dialog: detail.dialogTag }, "");
      } else {
        const base = history.state && typeof history.state === "object"
          ? history.state
          : {};
        history.replaceState({ ...base, opensDialog: true }, "");
        history.pushState({ dialog: detail.dialogTag }, "");
      }
    }
    await detail.dialogImport();
    await customElements.whenDefined(detail.dialogTag);
    let dialog = dialogs.get(detail.dialogTag);
    let shouldAppend = false;
    if (!dialog?.isConnected) {
      dialog = document.createElement(detail.dialogTag) as ManagedDialog;
      dialogs.set(detail.dialogTag, dialog);
      shouldAppend = true;
    }
    dialog.hass = hass;
    dialog.showDialog(detail.dialogParams);
    if (shouldAppend) document.body.append(dialog);
    activeTag = detail.dialogTag;
  };

  const dialogClosed = (rawEvent: Event): void => {
    const event = rawEvent as CustomEvent<{ dialog?: string }>;
    const tag = event.detail?.dialog;
    if (!tag) return;
    if (activeTag === tag) activeTag = undefined;
    if (history.state?.dialog === tag) history.back();
  };

  const popState = (): void => {
    if (!activeTag) return;
    const dialog = dialogs.get(activeTag);
    activeTag = undefined;
    dialog?.closeDialog();
  };

  document.addEventListener("show-dialog", (event) => void showDialog(event));
  document.addEventListener("dialog-closed", dialogClosed);
  window.addEventListener("popstate", popState);

  // Mirror Home Assistant's startup cleanup for a document that reloads while
  // a managed dialog is open. A dialog may provide a recoverable URL that the
  // newly loaded card can use to reconstruct itself.
  if (history.state?.dialog) {
    const refreshUrl = history.state.refreshUrl;
    if (typeof refreshUrl === "string") {
      history.replaceState(null, "", refreshUrl);
    } else {
      history.back();
    }
  }

  return {
    updateHass(hass): void {
      for (const dialog of dialogs.values()) {
        if (dialog.isConnected) dialog.hass = hass;
      }
    },
  };
}
