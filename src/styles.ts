import { css } from "lit";

export const cardStyles = css`
  :host {
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

  :host([layout="grid"]) .preview {
    aspect-ratio: auto;
  }

  .preview:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
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

  .name {
    position: absolute;
    inset: 12px auto auto 16px;
    max-width: calc(100% - 76px);
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
    width: min(1180px, calc(100vw - 32px));
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
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    min-height: 72px;
    padding: 14px 16px 18px 20px;
    box-sizing: border-box;
    gap: 12px;
    background: linear-gradient(rgba(0, 0, 0, 0.7), transparent);
    pointer-events: none;
  }

  h2 {
    margin: 0;
    max-width: calc(50% - 72px);
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
    grid-column: 2;
    display: flex;
    align-items: center;
    gap: 2px;
    pointer-events: auto;
  }

  button {
    font: inherit;
  }

  .icon-button {
    width: 44px;
    height: 44px;
    display: inline-grid;
    place-items: center;
    flex: 0 0 auto;
    padding: 0;
    border: 0;
    border-radius: 50%;
    color: #fff;
    background: transparent;
    cursor: pointer;
  }

  .icon-button:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .icon-button:focus-visible,
  .mode-button:focus-visible,
  .action-button:focus-visible {
    outline: 3px solid var(--primary-color, #03a9f4);
    outline-offset: 3px;
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
    position: absolute;
    z-index: 5;
    top: 14px;
    inset-inline-start: 50%;
    display: flex;
    align-items: center;
    gap: 2px;
    transform: translateX(-50%);
    pointer-events: auto;
  }

  .mode-button {
    display: inline-grid;
    width: 44px;
    height: 44px;
    flex: 0 0 auto;
    padding: 0;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: rgba(255, 255, 255, 0.72);
    background: transparent;
    cursor: pointer;
  }

  .mode-button:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  .mode-button[aria-selected="true"] {
    color: #fff;
    background: rgba(255, 255, 255, 0.14);
  }

  .mode-button.live[aria-selected="true"] {
    color: #fff;
    background: rgba(219, 68, 55, 0.16);
    background: color-mix(in srgb, var(--error-color, #db4437) 16%, transparent);
  }

  .mode-button svg {
    width: 20px;
    height: 20px;
  }

  .mode-button .mode-icon-live {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--error-color, #db4437);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
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

  .media-frame.auto-ratio {
    aspect-ratio: 16 / 9;
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

  .dialog-ring-alert {
    position: absolute;
    z-index: 6;
    inset: 68px auto auto 50%;
    display: inline-flex;
    min-height: 42px;
    max-width: calc(100% - 32px);
    align-items: center;
    gap: 8px;
    padding: 8px 13px;
    border: 1px solid rgba(255, 255, 255, 0.42);
    border-radius: 999px;
    color: #fff;
    background: rgba(198, 40, 40, 0.92);
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.38);
    font-size: 14px;
    font-weight: 600;
    line-height: 18px;
    transform: translateX(-50%);
    cursor: pointer;
  }

  .dialog-ring-alert:disabled {
    opacity: 1;
    cursor: default;
  }

  .dialog-ring-alert svg {
    width: 20px;
    height: 20px;
  }

  .ring-action {
    padding-inline-start: 4px;
    color: rgba(255, 255, 255, 0.78);
    font-size: 12px;
  }

  .visitor-controls {
    position: absolute;
    z-index: 7;
    inset: auto 16px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
  }

  .visitor-action-dock {
    display: flex;
    max-width: 100%;
    align-items: center;
    justify-content: center;
    gap: 0;
    padding: 3px 6px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.42);
    border-radius: 999px;
    color: #fff;
    background: rgba(18, 18, 18, 0.8);
    box-shadow: 0 5px 22px rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(14px) saturate(1.2);
    -webkit-backdrop-filter: blur(14px) saturate(1.2);
    pointer-events: auto;
  }

  .visitor-action {
    position: relative;
    min-height: 44px;
    display: inline-flex;
    min-width: 0;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 9px 15px;
    overflow: hidden;
    border: 0;
    border-radius: 999px;
    color: #fff;
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    white-space: nowrap;
    cursor: pointer;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .visitor-action-dock:not(.door-only):not(.talk-only) .talk-action {
    border-radius: 999px 0 0 999px;
  }

  .visitor-action-dock:not(.door-only):not(.talk-only) .door-action {
    border-radius: 0 999px 999px 0;
  }

  .visitor-action:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }

  .visitor-action:disabled {
    color: rgba(255, 255, 255, 0.68);
    cursor: default;
  }

  .visitor-action svg {
    width: 21px;
    height: 21px;
    flex: 0 0 auto;
  }

  .visitor-action-divider {
    width: 1px;
    height: 26px;
    flex: 0 0 auto;
    margin: 0 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.38);
    box-shadow: 1px 0 rgba(0, 0, 0, 0.32);
    pointer-events: none;
  }

  .talk-action.active {
    background: var(--error-color, #db4437);
    transform: scale(0.98);
  }

  .door-action svg {
    color: var(--warning-color, #f2b544);
  }

  .door-action-copy {
    display: inline-flex;
    min-width: 0;
    flex-direction: column;
    align-items: flex-start;
  }

  .door-contact-state {
    color: rgba(255, 255, 255, 0.58);
    font-size: 10px;
    font-weight: 500;
    line-height: 12px;
  }

  .door-action.contact-open {
    color: #fff;
    background: color-mix(
      in srgb,
      var(--warning-color, #f2b544) 16%,
      transparent
    );
  }

  .door-action.contact-open:disabled {
    color: #fff;
  }

  .door-action::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 0;
    background: color-mix(
      in srgb,
      var(--warning-color, #f2b544) 28%,
      transparent
    );
    pointer-events: none;
  }

  .door-action > * {
    position: relative;
    z-index: 1;
  }

  .door-action.holding::before {
    width: 100%;
    animation: door-hold 900ms linear forwards;
  }

  .door-action.working {
    background: rgba(10, 10, 10, 0.94);
  }

  .door-action.working svg {
    animation: spin 0.85s linear infinite;
  }

  .door-action.success {
    background: rgba(32, 112, 68, 0.92);
  }

  .door-action.success svg {
    color: #fff;
  }

  .door-action.error {
    background: color-mix(
      in srgb,
      var(--error-color, #db4437) 24%,
      transparent
    );
  }

  .door-feedback {
    min-height: 30px;
    display: inline-flex;
    max-width: min(480px, calc(100% - 16px));
    align-items: center;
    gap: 7px;
    padding: 5px 11px;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.94);
    background: rgba(0, 0, 0, 0.68);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.32);
    font-size: 12px;
    line-height: 18px;
    text-align: center;
    pointer-events: none;
  }

  .door-feedback svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
  }

  .door-feedback.error svg {
    color: #ff8a80;
  }

  .state-layer {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 24px;
    box-sizing: border-box;
    color: #fff;
    background: rgba(0, 0, 0, 0.42);
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

  .spinner {
    width: 30px;
    height: 30px;
    border: 3px solid rgba(255, 255, 255, 0.3);
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
    min-height: 44px;
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.56);
    border-radius: 10px;
    color: #fff;
    background: rgba(0, 0, 0, 0.38);
    font-weight: 600;
    cursor: pointer;
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
    border-color: var(--primary-color, #03a9f4);
    background: var(--primary-color, #03a9f4);
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
      width: 100%;
    }
  }

  @media (max-width: 600px) {
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
      min-height: calc(64px + env(safe-area-inset-top));
      padding: calc(10px + env(safe-area-inset-top))
        calc(10px + env(safe-area-inset-right)) 14px
        calc(16px + env(safe-area-inset-left));
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

    .mode-switch {
      top: calc(10px + env(safe-area-inset-top));
    }

    .visitor-controls {
      right: max(8px, env(safe-area-inset-right));
      bottom: max(8px, env(safe-area-inset-bottom));
      left: max(8px, env(safe-area-inset-left));
    }

    .visitor-action {
      gap: 7px;
      padding-inline: 11px;
      font-size: 13px;
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

    .mode-switch {
      top: calc(10px + env(safe-area-inset-top));
    }

    .visitor-controls {
      right: max(8px, env(safe-area-inset-right));
      bottom: max(8px, env(safe-area-inset-bottom));
      left: max(8px, env(safe-area-inset-left));
    }
  }

  @media (max-width: 340px) {
    .visitor-action {
      gap: 6px;
      padding-inline: 8px;
      font-size: 12px;
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

    .door-action.holding::before,
    .door-action.working svg {
      animation: none;
    }

    .door-action.holding::before {
      width: 100%;
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
