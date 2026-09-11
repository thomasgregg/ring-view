import { css, LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant } from "./types";
import {
  activityTimestamp,
  formatActivityTime,
} from "./utilities/activity-time";

const REFRESH_INTERVAL_MS = 30_000;

@customElement("ring-view-activity-time")
export class RingViewActivityTime extends LitElement {
  public static styles = css`
    :host {
      display: block;
      min-width: 0;
      overflow: hidden;
      color: var(--ring-view-activity-color, rgba(255, 255, 255, 0.84));
      font-size: var(--ring-view-activity-font-size, 12px);
      font-weight: 500;
      line-height: var(--ring-view-activity-line-height, 16px);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.82);
      white-space: nowrap;
      pointer-events: auto;
    }

    span {
      display: block;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @property({ attribute: "entity-id" }) public entityId?: string;
  private refreshTimer?: number;

  public disconnectedCallback(): void {
    this.clearRefreshTimer();
    super.disconnectedCallback();
  }

  protected render() {
    const timestamp = activityTimestamp(
      this.entityId ? this.hass?.states[this.entityId] : undefined,
    );
    if (timestamp === undefined) return nothing;
    const display = formatActivityTime(this.hass, timestamp);
    return html`
      <span aria-label=${display.accessible} title=${display.title}>
        ${display.relative}
      </span>
    `;
  }

  protected updated(): void {
    this.clearRefreshTimer();
    const timestamp = activityTimestamp(
      this.entityId ? this.hass?.states[this.entityId] : undefined,
    );
    if (timestamp === undefined) return;
    this.refreshTimer = window.setTimeout(() => {
      this.refreshTimer = undefined;
      this.requestUpdate();
      this.dispatchEvent(
        new CustomEvent("ring-view-activity-tick", {
          bubbles: true,
          composed: true,
        }),
      );
    }, REFRESH_INTERVAL_MS);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer === undefined) return;
    window.clearTimeout(this.refreshTimer);
    this.refreshTimer = undefined;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ring-view-activity-time": RingViewActivityTime;
  }
}
