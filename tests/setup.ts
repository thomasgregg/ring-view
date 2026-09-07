import { beforeEach } from "vitest";
import { installDemoDialogManager } from "../demo/dialog-manager";
import type { HomeAssistant } from "../src/types";

const storage = (() => {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, String(value)),
  } as Storage;
})();

Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: storage,
});

class TestHaCard extends HTMLElement {}

export class TestCameraStream extends HTMLElement {
  public static active = 0;
  public static autoLoad = true;
  public stateObj?: unknown;
  public muted = false;

  public constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  public connectedCallback(): void {
    TestCameraStream.active += 1;
    if (TestCameraStream.autoLoad) {
      queueMicrotask(() =>
        this.dispatchEvent(
          new CustomEvent("load", { bubbles: true, composed: true }),
        ),
      );
    }
  }

  public disconnectedCallback(): void {
    TestCameraStream.active -= 1;
  }
}

if (!customElements.get("ha-card")) customElements.define("ha-card", TestHaCard);
if (!customElements.get("ha-camera-stream")) {
  customElements.define("ha-camera-stream", TestCameraStream);
}

Object.defineProperty(window, "loadCardHelpers", {
  configurable: true,
  value: async () => ({ importMoreInfoControl: async () => undefined }),
});

installDemoDialogManager((event) => {
  const card = event
    .composedPath()
    .find(
      (node): node is HTMLElement & { hass?: HomeAssistant } =>
        node instanceof HTMLElement && node.localName === "ring-view",
    );
  return card?.hass ?? {
    states: {},
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
  };
});

beforeEach(() => {
  window.localStorage.clear();
  TestCameraStream.active = 0;
  TestCameraStream.autoLoad = true;
  document.documentElement.lang = "en";
  document.body.replaceChildren();
  history.replaceState({}, "", "/");
});
