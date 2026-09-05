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
    inset-inline: 0;
    bottom: 0;
    padding: 24px 16px 14px;
    overflow: hidden;
    color: var(--ha-picture-card-text-color, #fff);
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.72));
    font-size: var(--ha-font-size-l, 16px);
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
  }

  .badge {
    position: absolute;
    inset-inline-end: 12px;
    top: 12px;
    min-height: 28px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: calc(100% - 24px);
    padding: 5px 10px;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 999px;
    color: #fff;
    background: rgba(20, 24, 28, 0.68);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    white-space: nowrap;
    pointer-events: none;
  }

  .badge-dot {
    width: 7px;
    height: 7px;
    flex: 0 0 auto;
    border: 2px solid currentColor;
    border-radius: 50%;
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
    color: #ff8a80;
    background: rgba(255, 138, 128, 0.14);
  }

  .mode-button svg {
    width: 20px;
    height: 20px;
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

  ring-view-native-camera-adapter.pending {
    opacity: 0.01;
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
  }

  @media (max-height: 500px) and (orientation: landscape) {
    .body {
      position: relative;
      flex: 1 1 auto;
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

  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      border-color: rgba(255, 255, 255, 0.7);
    }
  }
`;

export const editorStyles = css`
  :host {
    display: block;
    min-width: 0;
    container-type: inline-size;
    color: var(--primary-text-color, #212121);
  }

  .editor-layout {
    display: grid;
    grid-template-columns: minmax(320px, 1.1fr) minmax(280px, 0.9fr);
    align-items: start;
    gap: 24px;
    min-width: 0;
    padding: 4px 0 16px;
  }

  .settings-pane {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  .settings-group {
    min-width: 0;
    margin: 0;
    padding: 16px;
    box-sizing: border-box;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    border-radius: var(--ha-card-border-radius, 14px);
    background: var(--card-background-color, var(--ha-card-background, #fff));
  }

  h3 {
    margin: 0 0 12px;
    color: var(--primary-text-color, #212121);
    font-size: 14px;
    font-weight: 650;
    line-height: 20px;
    letter-spacing: 0.01em;
  }

  details {
    padding-block: 0;
  }

  summary {
    min-height: 52px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    color: var(--primary-text-color, #212121);
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
  }

  .details-content {
    padding: 0 16px 16px;
  }

  .form-stack {
    display: grid;
    gap: 8px;
  }

  ha-form {
    display: block;
    min-width: 0;
  }

  .warnings {
    display: grid;
    gap: 8px;
    margin: 0;
  }

  .warning {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px;
    border-radius: var(--ha-card-border-radius, 12px);
    color: var(--primary-text-color, #212121);
    background: color-mix(
      in srgb,
      var(--warning-color, #ff9800) 14%,
      var(--card-background-color, #fff)
    );
    font-size: 13px;
    line-height: 18px;
  }

  .warning svg {
    width: 20px;
    height: 20px;
    flex: 0 0 auto;
    fill: var(--warning-color, #ff9800);
  }

  .preview-pane {
    min-width: 0;
  }

  .preview-sticky {
    position: sticky;
    top: 16px;
  }

  .preview-heading {
    margin: 0 0 10px;
    color: var(--secondary-text-color, #6b6b6b);
    font-size: 12px;
    font-weight: 650;
    line-height: 18px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .preview-card {
    position: relative;
    width: 100%;
    min-height: 160px;
    aspect-ratio: var(--ring-view-editor-aspect-ratio, 16 / 9);
    overflow: hidden;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.2));
    border-radius: var(--ha-card-border-radius, 14px);
    background: #000;
    box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.14));
  }

  .preview-card img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: var(--ring-view-editor-fit-mode, cover);
    background: #000;
  }

  .preview-name {
    position: absolute;
    inset: auto 0 0;
    padding: 28px 14px 12px;
    overflow: hidden;
    color: #fff;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.76));
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    text-overflow: ellipsis;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
    white-space: nowrap;
    pointer-events: none;
  }

  .preview-badge {
    position: absolute;
    top: 10px;
    inset-inline-end: 10px;
    min-height: 28px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    max-width: calc(100% - 20px);
    padding: 5px 10px;
    box-sizing: border-box;
    border: 1px solid rgba(255, 255, 255, 0.22);
    border-radius: 999px;
    color: #fff;
    background: rgba(14, 18, 22, 0.66);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.24);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    font-size: 12px;
    font-weight: 650;
    line-height: 16px;
    white-space: nowrap;
    pointer-events: none;
  }

  .preview-badge-dot {
    width: 7px;
    height: 7px;
    flex: 0 0 auto;
    border: 2px solid currentColor;
    border-radius: 50%;
    box-sizing: border-box;
  }

  @container (max-width: 720px) {
    .editor-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 18px;
    }

    .preview-pane {
      order: -1;
    }

    .preview-sticky {
      position: static;
    }
  }

  @media (max-width: 600px) {
    .editor-layout {
      grid-template-columns: minmax(0, 1fr);
      gap: 16px;
    }

    .preview-pane {
      order: -1;
    }

    .preview-sticky {
      position: static;
    }

    .settings-group {
      padding: 14px;
    }

    details.settings-group {
      padding: 0;
    }
  }
`;
