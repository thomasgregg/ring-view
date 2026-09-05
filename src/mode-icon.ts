import { mdiHistory } from "@mdi/js";
import { html, type TemplateResult } from "lit";
import { localize } from "./localize";
import type { CameraMode, HomeAssistant } from "./types";

export function renderModeIcon(mode: CameraMode): TemplateResult {
  if (mode === "live") {
    return html`<span class="mode-icon mode-icon-live" aria-hidden="true"></span>`;
  }

  return html`
    <svg class="mode-icon mode-icon-recording" viewBox="0 0 24 24" aria-hidden="true">
      <path d=${mdiHistory}></path>
    </svg>
  `;
}

export function modeLabel(mode: CameraMode, hass?: HomeAssistant): string {
  return localize(
    hass,
    mode === "live" ? "common.live" : "common.last_recording",
  );
}
