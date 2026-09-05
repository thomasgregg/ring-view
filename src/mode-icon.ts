import { mdiHistory } from "@mdi/js";
import { html, type TemplateResult } from "lit";
import type { CameraMode } from "./types";

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

export function modeLabel(mode: CameraMode): string {
  return mode === "live" ? "Live" : "Last recording";
}
