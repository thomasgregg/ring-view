import { css } from "lit";

export const cardStyles = css`
  :host {
    --ring-view-focus-color: rgba(255, 255, 255, 0.92);
    display: block;
    min-width: 0;
    height: 100%;
  }

  ha-card {
    display: block;
    position: relative;
    height: 100%;
    min-height: 120px;
    min-width: 0;
    overflow: hidden;
    border-radius: var(--ha-card-border-radius, 12px);
    background: var(--ha-card-background, var(--card-background-color, #fff));
    box-shadow: var(--ha-card-box-shadow, none);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  ha-card.interactive {
    cursor: default;
  }

  ha-card.safe-preview {
    cursor: default;
  }

  .inline-shell {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 120px;
    aspect-ratio: var(--ring-view-aspect-ratio, 16 / 9);
    overflow: hidden;
    background: #000;
  }

  :host([layout="grid"]):not([intrinsic-grid-height]) .inline-shell {
    aspect-ratio: auto;
  }

  :host([layout="grid"][intrinsic-grid-height]),
  :host([layout="grid"][intrinsic-grid-height]) ha-card,
  :host([layout="grid"][intrinsic-grid-height]) .inline-shell {
    height: auto;
  }

  .preview {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 120px;
    aspect-ratio: var(--ring-view-aspect-ratio, 16 / 9);
    overflow: hidden;
    outline: none;
    background: #000;
  }

  :host([layout="grid"]):not([intrinsic-grid-height]) .preview {
    aspect-ratio: auto;
  }

  :host([layout="grid"][intrinsic-grid-height]) .preview {
    height: auto;
  }

  .preview:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
    outline-offset: -3px;
  }

  .preview:active::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.08);
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: var(--ring-view-fit-mode, cover);
    display: block;
    background: #000;
  }

  .placeholder {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    color: rgba(255, 255, 255, 0.88);
    background: linear-gradient(145deg, #202a31, #11171b);
    text-align: center;
    font-size: 14px;
  }

  .header-copy {
    position: absolute;
    inset: 12px auto auto 16px;
    display: grid;
    min-width: 0;
    max-width: calc(100% - 76px);
    overflow: hidden;
    --ring-view-activity-color: rgba(255, 255, 255, 0.84);
    --ring-view-activity-font-size: 12px;
    --ring-view-activity-line-height: 16px;
  }

  .name {
    min-width: 0;
    padding: 0;
    overflow: hidden;
    color: var(--ha-picture-card-text-color, #fff);
    background: none;
    font-size: var(--ha-font-size-l, 16px);
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.82);
    white-space: nowrap;
    pointer-events: none;
  }

  .ring-alert {
    position: absolute;
    inset: auto 12px 12px;
    display: flex;
    min-height: 42px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 7px 13px;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.42);
    border-radius: 999px;
    color: #fff;
    background: rgba(198, 40, 40, 0.9);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    pointer-events: none;
  }

  .ring-alert svg {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    fill: currentColor;
  }

  @media (prefers-reduced-motion: reduce) {
    .preview:active::after {
      display: none;
    }
  }
`;

export const dialogStyles = css`
  :host {
    --ring-view-control-size: 44px;
    --ring-view-primary-size: 48px;
    --ring-view-control-surface: rgba(0, 0, 0, 0.3);
    --ring-view-control-lift-top: rgba(255, 255, 255, 0.08);
    --ring-view-control-lift-bottom: rgba(255, 255, 255, 0.045);
    --ring-view-action-surface: rgba(0, 0, 0, 0.48);
    --ring-view-message-surface: rgba(10, 10, 10, 0.78);
    --ring-view-focus-color: rgba(255, 255, 255, 0.92);
    --ring-view-live-color: #ff3b30;
    --ring-view-ring-color: #ffb020;
    --ring-view-success-color: #50d890;
    --ring-view-error-color: #ff6b6b;
    position: fixed;
    inset: 0;
    z-index: 999;
    display: none;
    min-width: 0;
    color: var(--primary-text-color, #212121);
    font-family: var(--ha-font-family-body, Roboto, sans-serif);
  }

  :host([open]) {
    display: block;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.58);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  .dialog {
    position: absolute;
    inset: 50% auto auto 50%;
    display: flex;
    width: min(
      1180px,
      calc(100vw - 32px),
      var(--ring-view-dialog-height-limited-width, 1180px)
    );
    max-height: calc(100dvh - 32px);
    min-width: 0;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: var(--ha-dialog-border-radius, var(--ha-card-border-radius, 20px));
    background: #000;
    box-shadow: var(--ha-dialog-box-shadow, 0 24px 72px rgba(0, 0, 0, 0.48));
    transform: translate(-50%, -50%);
  }

  .header {
    position: absolute;
    inset: 0 0 auto;
    z-index: 5;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    min-height: 72px;
    padding: 14px 16px 18px 20px;
    box-sizing: border-box;
    gap: 12px;
    background: linear-gradient(rgba(0, 0, 0, 0.7), transparent);
    pointer-events: none;
  }

  .header-copy {
    grid-column: 1;
    grid-row: 1;
    display: grid;
    align-content: center;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    --ring-view-activity-color: rgba(255, 255, 255, 0.84);
    --ring-view-activity-font-size: 13px;
    --ring-view-activity-line-height: 18px;
  }

  h2 {
    min-width: 0;
    margin: 0;
    max-width: 100%;
    overflow: hidden;
    color: #fff;
    font-size: var(--ha-font-size-xl, 20px);
    font-weight: 500;
    line-height: 28px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.72);
    white-space: nowrap;
  }

  .header-actions {
    grid-column: 3;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-self: end;
    min-height: var(--ring-view-control-size);
    gap: 8px;
    overflow: visible;
    background: transparent;
    pointer-events: auto;
  }

  .camera-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ring-indicator {
    width: var(--ring-view-control-size);
    height: var(--ring-view-control-size);
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    border-radius: 50%;
    color: var(--ring-view-ring-color);
    background: var(--ring-view-control-surface);
    box-shadow: none;
    pointer-events: none;
  }

  .ring-indicator svg {
    width: 22px;
    height: 22px;
    animation: ring-once 550ms ease-out 1;
  }

  button {
    font: inherit;
  }

  .icon-button {
    position: relative;
    width: var(--ring-view-control-size);
    height: var(--ring-view-control-size);
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    transition: color 140ms ease, opacity 140ms ease;
  }

  .snapshot-action,
  .chrome-action {
    background: var(--ring-view-control-surface);
  }

  .icon-button::before,
  .mode-button::before {
    content: "";
    position: absolute;
    inset: 4px;
    z-index: 0;
    border-radius: 50%;
    background: transparent;
    transition: background 140ms ease, box-shadow 140ms ease, transform 100ms ease;
  }

  .icon-button > svg,
  .mode-button > svg,
  .mode-button > .mode-icon-live {
    position: relative;
    z-index: 1;
  }

  .icon-button:hover:not(:disabled)::before,
  .mode-button:hover::before {
    background: rgba(255, 255, 255, 0.13);
  }

  .icon-button:active:not(:disabled)::before,
  .mode-button:active::before {
    background: rgba(255, 255, 255, 0.18);
    transform: scale(0.92);
  }

  .icon-button:disabled {
    color: rgba(255, 255, 255, 0.38);
    cursor: default;
  }

  .icon-button:disabled:hover {
    background: transparent;
  }

  .icon-button:disabled::before {
    background: transparent;
  }

  .snapshot-action.working svg {
    animation: spin 0.85s linear infinite;
  }

  .snapshot-action.success {
    color: var(--ring-view-success-color);
  }

  .snapshot-action.success::before {
    background: rgba(22, 128, 75, 0.28);
  }

  .snapshot-action.error {
    color: var(--ring-view-error-color);
  }

  .snapshot-action.error::before {
    background: rgba(166, 35, 35, 0.34);
  }

  .icon-button:focus-visible,
  .mode-button:focus-visible,
  .action-button:focus-visible {
    outline: none;
  }

  .icon-button:focus-visible::before,
  .mode-button:focus-visible::before {
    box-shadow: 0 0 0 3px var(--ring-view-focus-color);
  }

  svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }

  .body {
    position: relative;
    display: block;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    background: #000;
  }

  .mode-switch {
    grid-column: 2;
    grid-row: 1;
    display: flex;
    align-items: center;
    justify-self: center;
    min-height: var(--ring-view-control-size);
    gap: 0;
    overflow: visible;
    border-radius: 28px;
    background: var(--ring-view-control-surface);
    pointer-events: auto;
  }

  .mode-button {
    position: relative;
    display: inline-grid;
    width: var(--ring-view-control-size);
    height: var(--ring-view-control-size);
    flex: 0 0 auto;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .mode-button:hover {
    color: #fff;
    background: transparent;
  }

  .mode-button[aria-selected="true"] {
    color: #fff;
    background: transparent;
  }

  .mode-button[aria-selected="true"]::before {
    background: rgba(255, 255, 255, 0.17);
  }

  .mode-button[aria-selected="true"]:hover::before {
    background: rgba(255, 255, 255, 0.22);
  }

  .mode-button.live[aria-selected="true"] {
    color: #fff;
    background: transparent;
  }

  .mode-button svg {
    width: 20px;
    height: 20px;
  }

  .mode-button .mode-icon-live {
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background: var(--ring-view-live-color);
    box-shadow: none;
  }

  .media-frame {
    position: relative;
    width: 100%;
    min-width: 0;
    min-height: min(56.25vw, 360px);
    max-height: calc(100dvh - 32px);
    aspect-ratio: var(--ring-view-aspect-ratio, 16 / 9);
    overflow: hidden;
    background: #000;
  }

  .poster,
  ring-view-native-camera-adapter,
  ring-view-ring-webrtc-player,
  .video-fallback {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: var(--ring-view-fit-mode, cover);
  }

  .poster,
  .video-fallback {
    background: #000;
  }

  ring-view-native-camera-adapter {
    background: transparent;
  }

  ring-view-native-camera-adapter.pending,
  ring-view-ring-webrtc-player.pending {
    opacity: 0.01;
  }

  .video-fallback.pending {
    opacity: 0;
  }

  .video-fallback.controls-hidden {
    cursor: pointer;
  }

  .video-fallback.controls-hidden:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
    outline-offset: -3px;
  }

  .initial-start-surface {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .initial-start-surface:hover {
    background: rgba(255, 255, 255, 0.035);
  }

  .initial-start-surface:active {
    background: rgba(255, 255, 255, 0.07);
  }

  .initial-start-surface:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
    outline-offset: -4px;
  }

  .visitor-controls {
    position: absolute;
    z-index: 7;
    inset: auto 16px 72px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }

  .visitor-action-dock {
    display: flex;
    height: var(--ring-view-primary-size);
    max-width: 100%;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 28px;
    color: #fff;
    background: var(--ring-view-control-surface);
    box-shadow: none;
    pointer-events: auto;
  }

  .visitor-action {
    position: relative;
    height: var(--ring-view-primary-size);
    min-height: var(--ring-view-primary-size);
    display: inline-flex;
    min-width: 112px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 15px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: transparent;
    font-size: 15px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition: color 140ms ease, opacity 140ms ease, transform 100ms ease;
  }

  .visitor-action::before {
    content: "";
    position: absolute;
    inset: 4px;
    z-index: 0;
    border-radius: calc((var(--ring-view-primary-size) - 8px) / 2);
    background: transparent;
    transition: background 140ms ease, box-shadow 140ms ease, transform 100ms ease;
  }

  .visitor-action > * {
    position: relative;
    z-index: 2;
  }

  .visitor-action > span {
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .visitor-action:hover:not(:disabled)::before {
    background: rgba(255, 255, 255, 0.13);
  }

  .visitor-action:active:not(:disabled)::before {
    transform: scale(0.97);
  }

  .door-action:active::before {
    transform: none;
  }

  .visitor-action:focus-visible {
    z-index: 2;
    outline: none;
  }

  .visitor-action:focus-visible::before {
    box-shadow: 0 0 0 3px var(--ring-view-focus-color);
  }

  .visitor-action:disabled {
    color: rgba(255, 255, 255, 0.4);
    cursor: default;
  }

  .visitor-action:disabled::before {
    background: transparent;
  }

  .visitor-action svg {
    width: 23px;
    height: 23px;
    flex: 0 0 auto;
  }

  .talk-action.active {
    background: transparent;
  }

  .talk-action.active::before {
    background: rgba(255, 59, 48, 0.82);
  }

  .talk-action.active:hover::before {
    background: rgba(255, 59, 48, 0.9);
  }

  .talk-action {
    width: 142px;
    max-width: 142px;
  }

  .door-action svg {
    color: #fff;
  }

  .door-action {
    width: 168px;
    min-width: 168px;
    max-width: 168px;
  }

  .visitor-action-dock.icon-only .visitor-action {
    width: var(--ring-view-primary-size);
    min-width: var(--ring-view-primary-size);
    max-width: var(--ring-view-primary-size);
    gap: 0;
    padding: 0;
  }

  .door-action-copy {
    display: inline-flex;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
    overflow: hidden;
  }

  .door-action-copy > span {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .door-contact-state {
    color: rgba(255, 255, 255, 0.58);
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
  }

  .door-action.contact-open {
    color: var(--ring-view-ring-color);
    background: transparent;
  }

  .door-action.contact-open::before {
    background: rgba(255, 176, 32, 0.2);
  }

  .door-action.contact-open:disabled {
    color: #fff;
  }

  .door-action::after {
    content: "";
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    z-index: 1;
    width: 0;
    border-radius: calc((var(--ring-view-primary-size) - 8px) / 2) 0 0
      calc((var(--ring-view-primary-size) - 8px) / 2);
    background: rgba(255, 176, 32, 0.58);
    pointer-events: none;
  }

  .visitor-action-dock.icon-only .door-action::after {
    right: 4px;
    width: auto;
    border-radius: calc((var(--ring-view-primary-size) - 8px) / 2);
    clip-path: inset(0 100% 0 0);
  }

  .door-action.holding::after {
    animation: door-hold 1600ms linear forwards;
  }

  .visitor-action-dock.icon-only .door-action.holding::after {
    animation-name: door-hold-icon-only;
  }

  .door-action.working {
    color: #ffe0a4;
    background: transparent;
  }

  .door-action.working svg {
    animation: spin 0.85s linear infinite;
  }

  .door-action.success {
    color: var(--ring-view-success-color);
    background: transparent;
  }

  .door-action.success::before {
    background: rgba(38, 145, 91, 0.24);
  }

  .door-action.success svg {
    color: currentColor;
  }

  .door-action.error {
    color: #fff;
    background: transparent;
  }

  .door-action.error::before {
    background: rgba(199, 51, 51, 0.62);
  }

  .state-layer {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    color: #fff;
    background: rgba(0, 0, 0, 0.28);
    text-align: center;
    z-index: 2;
  }

  .state-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: min(440px, 100%);
  }

  .viewer-feedback-layer {
    z-index: 6;
    padding: 76px 24px;
    background: transparent;
    pointer-events: none;
  }

  .viewer-feedback-layer .state-card {
    width: auto;
    max-width: min(430px, 100%);
    min-height: 44px;
    justify-content: center;
    padding: 11px 15px;
    box-sizing: border-box;
    border-radius: 22px;
    background: var(--ring-view-message-surface);
    pointer-events: auto;
  }

  .viewer-feedback-layer .state-title {
    font-size: 14px;
    line-height: 19px;
    text-align: left;
  }

  .doorbell-alert-layer {
    z-index: 6;
    background: transparent;
    pointer-events: none;
  }

  .doorbell-alert-layer .state-actions {
    pointer-events: auto;
  }

  .loading-state .state-card {
    width: auto;
    flex-direction: row;
    gap: 11px;
  }

  .spinner {
    width: 26px;
    height: 26px;
    flex: 0 0 auto;
    border: 2.5px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.85s linear infinite;
  }

  .state-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
  }

  .state-detail {
    color: rgba(255, 255, 255, 0.78);
    font-size: 13px;
    line-height: 19px;
  }

  .state-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .action-button {
    min-height: var(--ring-view-control-size);
    padding: 0 16px;
    border: 0;
    border-radius: calc(var(--ring-view-control-size) / 2);
    color: #fff;
    background: var(--ring-view-action-surface);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  .action-button:hover {
    background-color: rgba(0, 0, 0, 0.64);
  }

  .action-button:focus-visible {
    outline: 3px solid var(--ring-view-focus-color);
    outline-offset: 3px;
  }

  .play-recording {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .play-recording svg {
    width: 20px;
    height: 20px;
  }

  .play-layer {
    background: rgba(0, 0, 0, 0.18);
  }

  .action-button.primary {
    background: var(--ring-view-action-surface);
  }

  .mode-switch,
  .ring-indicator,
  .snapshot-action,
  .chrome-action,
  .visitor-action-dock,
  .viewer-feedback-layer .state-card,
  .action-button {
    background-image: linear-gradient(
      180deg,
      var(--ring-view-control-lift-top),
      var(--ring-view-control-lift-bottom)
    );
    backdrop-filter: blur(16px) saturate(120%);
    -webkit-backdrop-filter: blur(16px) saturate(120%);
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes door-hold {
    from {
      width: 0;
    }
    to {
      width: calc(100% - 8px);
    }
  }

  @keyframes door-hold-icon-only {
    from {
      clip-path: inset(0 100% 0 0);
    }
    to {
      clip-path: inset(0);
    }
  }

  @keyframes ring-once {
    0%,
    100% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(10deg);
    }
    55% {
      transform: rotate(-9deg);
    }
    80% {
      transform: rotate(4deg);
    }
  }

  @media (max-width: 600px) {
    :host {
      --ring-view-control-size: 48px;
    }

    .dialog {
      inset: 0;
      width: 100vw;
      height: 100dvh;
      max-height: none;
      border-radius: 0;
      transform: none;
      border: 0;
    }

    .header {
      --ring-view-camera-action-offset: 0px;
      display: block;
      min-height: calc(64px + env(safe-area-inset-top));
      padding: calc(10px + env(safe-area-inset-top))
        calc(10px + env(safe-area-inset-right)) 14px
        calc(16px + env(safe-area-inset-left));
    }

    .header.camera-actions-one {
      --ring-view-camera-action-offset: calc(var(--ring-view-control-size) + 8px);
    }

    .header.camera-actions-two {
      --ring-view-camera-action-offset: calc(2 * var(--ring-view-control-size) + 16px);
    }

    .header-copy {
      position: absolute;
      top: calc(12px + env(safe-area-inset-top));
      right: calc(
        176px + var(--ring-view-camera-action-offset)
        + env(safe-area-inset-right)
      );
      left: calc(16px + env(safe-area-inset-left));
    }

    .mode-switch {
      position: absolute;
      top: calc(10px + env(safe-area-inset-top));
      right: calc(
        68px + var(--ring-view-camera-action-offset)
        + env(safe-area-inset-right)
      );
      transform: none;
    }

    .header-actions {
      position: absolute;
      top: calc(10px + env(safe-area-inset-top));
      right: calc(10px + env(safe-area-inset-right));
      display: flex;
      min-height: var(--ring-view-control-size);
      gap: 8px;
      background: transparent;
    }

    .camera-actions {
      display: flex;
    }

    .header-actions .chrome-action {
      position: relative;
      inset: auto;
      background-color: var(--ring-view-control-surface);
    }

    .body {
      width: 100%;
      height: 100%;
    }

    .media-frame {
      top: 50%;
      min-height: 180px;
      max-height: none;
      transform: translateY(-50%);
    }

    .visitor-controls {
      right: max(8px, env(safe-area-inset-right));
      bottom: max(64px, calc(56px + env(safe-area-inset-bottom)));
      left: max(8px, env(safe-area-inset-left));
    }

    .visitor-action {
      gap: 7px;
      font-size: 14px;
    }
  }

  @media (max-width: 600px) and (orientation: portrait) {
    :host(:not([inline])) {
      --ring-view-control-lift-top: rgba(255, 255, 255, 0.14);
      --ring-view-control-lift-bottom: rgba(255, 255, 255, 0.09);
    }

    :host(:not([inline])) .header-copy {
      right: calc(
        50% + var(--ring-view-control-size) + 8px
      );
    }

    :host(:not([inline])) .mode-switch {
      right: auto;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  @media (max-width: 452px) and (orientation: portrait) {
    :host(:not([inline])) .header.camera-actions-two {
      min-height: calc(124px + env(safe-area-inset-top));
    }

    :host(:not([inline])) .header.camera-actions-two .mode-switch {
      top: calc(66px + env(safe-area-inset-top));
    }
  }

  @media (max-width: 340px) and (orientation: portrait) {
    :host(:not([inline])) .header.camera-actions-one {
      min-height: calc(124px + env(safe-area-inset-top));
    }

    :host(:not([inline])) .header.camera-actions-one .mode-switch {
      top: calc(66px + env(safe-area-inset-top));
    }
  }

  @media (max-height: 500px) and (orientation: landscape) {
    .dialog {
      inset: 0;
      width: 100vw;
      height: 100dvh;
      max-height: none;
      border: 0;
      border-radius: 0;
      transform: none;
    }

    .header {
      min-height: calc(64px + env(safe-area-inset-top));
      padding: calc(10px + env(safe-area-inset-top))
        calc(10px + env(safe-area-inset-right)) 14px
        calc(16px + env(safe-area-inset-left));
    }

    .body {
      position: relative;
      flex: 1 1 auto;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .media-frame {
      top: 0;
      height: 100%;
      min-height: 0;
      max-height: none;
      aspect-ratio: auto;
      transform: none;
    }

    .visitor-controls {
      right: max(8px, env(safe-area-inset-right));
      bottom: max(72px, calc(64px + env(safe-area-inset-bottom)));
      left: max(8px, env(safe-area-inset-left));
    }
  }

  @media (max-width: 340px) {
    .visitor-action {
      gap: 6px;
      padding-inline: 10px;
      font-size: 13px;
    }
  }

  @media (max-width: 360px) {
    .header.camera-actions-two .header-copy {
      display: none;
    }
  }

  @media (max-width: 290px) {
    .visitor-action {
      min-width: var(--ring-view-control-size);
      padding-inline: 8px;
    }

    .visitor-action > span {
      display: none;
    }

    .talk-action,
    .door-action {
      width: var(--ring-view-control-size);
      min-width: var(--ring-view-control-size);
      max-width: var(--ring-view-control-size);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-color: rgba(255, 255, 255, 0.7);
    }

    .talk-action.active {
      transform: none;
    }

    .ring-indicator svg {
      animation: none;
    }

    .icon-button,
    .icon-button::before,
    .mode-button::before,
    .visitor-action,
    .visitor-action::before {
      transition: none;
    }

    .door-action.holding::after,
    .door-action.working svg,
    .snapshot-action.working svg {
      animation: none;
    }

    .door-action.holding::after {
      width: calc(100% - 8px);
    }

    .visitor-action-dock.icon-only .door-action.holding::after {
      width: auto;
      animation: none;
      clip-path: inset(0);
    }
  }

  @media (forced-colors: active) {
    .mode-switch,
    .ring-indicator,
    .snapshot-action,
    .chrome-action,
    .visitor-action-dock,
    .viewer-feedback-layer .state-card,
    .action-button {
      border: 1px solid ButtonText;
      color: ButtonText;
      background: ButtonFace;
      forced-color-adjust: none;
    }

    .icon-button:focus-visible::before,
    .mode-button:focus-visible::before,
    .visitor-action:focus-visible::before {
      box-shadow: 0 0 0 3px Highlight;
    }

    .icon-button:focus-visible,
    .mode-button:focus-visible,
    .visitor-action:focus-visible {
      outline: 3px solid Highlight;
      outline-offset: -4px;
      forced-color-adjust: none;
    }

    .mode-button[aria-selected="true"] {
      color: HighlightText;
    }

    .mode-button[aria-selected="true"]::before,
    .talk-action.active::before,
    .door-action.holding::after {
      background: Highlight;
      forced-color-adjust: none;
    }

    .mode-button .mode-icon-live {
      background: LinkText;
      forced-color-adjust: none;
    }

    .ring-indicator {
      color: LinkText;
      forced-color-adjust: none;
    }
  }

  :host([inline]) {
    position: relative;
    inset: auto;
    z-index: auto;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 120px;
  }

  :host([inline]) .dialog {
    position: relative;
    inset: auto;
    width: 100%;
    height: 100%;
    max-height: none;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    transform: none;
  }

  :host([inline]) .body {
    width: 100%;
    height: 100%;
    container-name: ring-view-inline;
    container-type: size;
  }

  :host([inline]) .media-frame {
    top: auto;
    width: 100%;
    height: 100%;
    min-height: 120px;
    max-height: none;
    transform: none;
  }

  :host([inline]) .header {
    --ring-view-header-actions-width: var(--ring-view-control-size);
    display: grid;
    grid-template-columns:
      minmax(0, 1fr) auto
      minmax(var(--ring-view-header-actions-width), 1fr);
    min-height: 64px;
    padding: 10px 10px 14px 16px;
  }

  :host([inline]) .header.camera-actions-one {
    --ring-view-header-actions-width: calc(
      2 * var(--ring-view-control-size) + 8px
    );
  }

  :host([inline]) .header.camera-actions-two {
    --ring-view-header-actions-width: calc(
      3 * var(--ring-view-control-size) + 16px
    );
  }

  :host([inline]) .header-copy {
    position: static;
  }

  :host([inline]) .mode-switch {
    position: static;
    transform: none;
  }

  :host([inline]) .header-actions {
    position: static;
    display: flex;
    width: auto;
    min-height: var(--ring-view-control-size);
    flex-direction: row;
    gap: 8px;
    background: transparent;
    transform: none;
  }

  :host([inline]) .camera-actions {
    display: flex;
  }

  :host([inline]) .header-actions .expand {
    position: relative;
    inset: auto;
    background-color: var(--ring-view-control-surface);
  }

  :host([inline]) h2 {
    font-size: var(--ha-font-size-l, 16px);
    line-height: 20px;
  }

  :host([inline]) .header-copy {
    --ring-view-activity-font-size: 12px;
    --ring-view-activity-line-height: 16px;
  }

  :host([inline]) .visitor-controls {
    right: 8px;
    bottom: 8px;
    left: 8px;
  }

  :host([inline]) .state-layer.with-visitor-controls {
    padding: 64px 16px;
  }

  :host([inline]) .state-layer.with-visitor-controls .state-card {
    width: auto;
    max-width: 100%;
    flex-direction: row;
    justify-content: center;
    gap: 10px;
  }

  :host([inline]) .doorbell-alert-layer.with-visitor-controls .state-card {
    flex-direction: column;
    gap: 8px;
  }

  :host([inline]) .state-layer.with-visitor-controls .spinner {
    flex: 0 0 auto;
  }

  @container ring-view-inline (max-height: 220px) {
    :host([inline]) .blocking-state {
      place-items: center;
      padding: 64px 12px 8px;
    }

    :host([inline]) .blocking-state .state-card {
      gap: 6px;
    }

    :host([inline]) .blocking-state .state-title {
      font-size: 14px;
      line-height: 18px;
    }

    :host([inline]) .blocking-state .state-detail {
      display: none;
    }

    :host([inline]) .blocking-state .action-button {
      min-height: 40px;
      padding-inline: 14px;
    }

    :host([inline]) .body:has(.state-layer.with-visitor-controls) .visitor-controls {
      visibility: hidden;
      pointer-events: none;
    }
  }
`;

export const editorStyles = css`
  :host {
    display: block;
    min-width: 0;
    color: var(--primary-text-color, #212121);
  }

  ha-form {
    display: block;
    min-width: 0;
  }

  .warnings {
    display: grid;
    gap: 8px;
    margin: 0 0 12px;
  }
`;
