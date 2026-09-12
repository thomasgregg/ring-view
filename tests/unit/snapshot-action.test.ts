import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../../src/ring-view-dialog";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";

const camera = (entity_id: string, state = "idle"): HassEntity => ({
  entity_id,
  state,
  attributes: {
    friendly_name: entity_id,
    entity_picture: "/image.jpg",
    supported_features: entity_id === "camera.live" ? 2 : 0,
  },
});

async function mount({
  mode = "live",
  inline = false,
  start = "live",
  snapshotState = "idle",
  liveState = "idle",
  callService = vi.fn(async () => undefined),
}: {
  mode?: "live" | "last_recording";
  inline?: boolean;
  start?: "on_demand" | "live" | "last_recording";
  snapshotState?: string;
  liveState?: string;
  callService?: ReturnType<typeof vi.fn>;
} = {}) {
  const hass: HomeAssistant = {
    config: { time_zone: "UTC" },
    states: {
      "camera.recording": camera("camera.recording"),
      "camera.live": camera("camera.live", liveState),
      "camera.snapshot": camera("camera.snapshot", snapshotState),
    },
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
    callService,
  };
  const dialog = document.createElement("ring-view-dialog");
  dialog.hass = hass;
  document.body.append(dialog);
  const config = normalizeConfig({
    recording_entity: "camera.recording",
    live_entity: "camera.live",
    snapshot_entity: "camera.snapshot",
    name: "Entrance",
    show_snapshot_button: true,
    snapshot_directory: "/media/ring-view",
  });
  if (inline) {
    dialog.showInline({ config, mode, start });
  } else {
    dialog.showDialog({ config, mode });
  }
  await dialog.updateComplete;
  return { callService, dialog, hass };
}

describe("snapshot action", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-12T14:30:22.381Z"));
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("captures with the configured snapshot camera and generated filename", async () => {
    const { callService, dialog } = await mount();
    const messages: string[] = [];
    dialog.addEventListener("hass-notification", (event) => {
      messages.push((event as CustomEvent<{ message: string }>).detail.message);
    });

    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(
      ".snapshot-action",
    );
    expect(button?.getAttribute("aria-label")).toBe("Take snapshot");
    button?.click();
    await Promise.resolve();
    await dialog.updateComplete;

    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith(
      "camera",
      "snapshot",
      {
        filename:
          "/media/ring-view/entrance_2026-09-12_14-30-22-381.jpg",
      },
      { entity_id: "camera.snapshot" },
    );
    expect(messages).toEqual([]);
    expect(
      dialog.shadowRoot?.querySelector(".snapshot-action")?.getAttribute(
        "aria-label",
      ),
    ).toBe("Snapshot saved");
    expect(dialog.shadowRoot?.querySelector(".snapshot-feedback")).toBeNull();

    await vi.advanceTimersByTimeAsync(2_000);
    expect(
      dialog.shadowRoot?.querySelector(".snapshot-action")?.getAttribute(
        "aria-label",
      ),
    ).toBe("Take snapshot");
    expect(dialog.shadowRoot?.querySelector(".snapshot-feedback")).toBeNull();
  });

  it("falls back to the Live camera when the snapshot camera is unavailable", async () => {
    const { callService, dialog } = await mount({
      snapshotState: "unavailable",
    });
    dialog.shadowRoot?.querySelector<HTMLButtonElement>(".snapshot-action")?.click();
    await Promise.resolve();
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService.mock.calls[0]?.[3]).toEqual({ entity_id: "camera.live" });
  });

  it("disables the action when neither camera is available", async () => {
    const { dialog } = await mount({
      snapshotState: "unavailable",
      liveState: "unknown",
    });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(
      ".snapshot-action",
    );
    expect(button?.disabled).toBe(true);
    expect(button?.getAttribute("aria-label")).toBe(
      "Snapshot camera unavailable.",
    );
  });

  it("shows one localized failure and does not retry another camera", async () => {
    const callService = vi.fn(async () => {
      throw new Error("Cannot write image to file");
    });
    const { dialog } = await mount({ callService });
    const messages: string[] = [];
    dialog.addEventListener("hass-notification", (event) => {
      messages.push((event as CustomEvent<{ message: string }>).detail.message);
    });
    dialog.shadowRoot?.querySelector<HTMLButtonElement>(".snapshot-action")?.click();
    await Promise.resolve();
    await dialog.updateComplete;

    expect(callService).toHaveBeenCalledTimes(1);
    expect(messages).toEqual([]);
    expect(
      dialog.shadowRoot?.querySelector(".snapshot-action")?.getAttribute(
        "aria-label",
      ),
    ).toBe("Home Assistant cannot write to the snapshot folder.");
    expect(
      dialog.shadowRoot?.querySelector(".snapshot-error-layer .state-title")
        ?.textContent?.trim(),
    ).toBe("Home Assistant cannot write to the snapshot folder.");
  });

  it("prevents a second request while the first is pending", async () => {
    let resolveService: (() => void) | undefined;
    const callService = vi.fn(
      () => new Promise<void>((resolve) => {
        resolveService = resolve;
      }),
    );
    const { dialog } = await mount({ callService });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(
      ".snapshot-action",
    );
    button?.click();
    button?.click();
    await dialog.updateComplete;
    expect(callService).toHaveBeenCalledTimes(1);
    expect(
      dialog.shadowRoot?.querySelector<HTMLButtonElement>(".snapshot-action")
        ?.disabled,
    ).toBe(true);
    resolveService?.();
    await Promise.resolve();
  });

  it("is hidden for recordings and in the on-demand idle state", async () => {
    const recording = await mount({ mode: "last_recording" });
    expect(recording.dialog.shadowRoot?.querySelector(".snapshot-action")).toBeNull();
    recording.dialog.remove();

    const idle = await mount({ inline: true, mode: "last_recording", start: "on_demand" });
    const recordingTab = idle.dialog.shadowRoot?.querySelector(
      "#ring-view-tab-recording",
    );
    const liveTab = idle.dialog.shadowRoot?.querySelector<HTMLButtonElement>(
      "#ring-view-tab-live",
    );
    expect(recordingTab?.getAttribute("aria-selected")).toBe("true");
    expect(liveTab?.getAttribute("aria-selected")).toBe("false");
    expect(recordingTab?.getAttribute("aria-label")).toBe("Last recording");
    expect(liveTab?.getAttribute("aria-label")).toBe("Live");
    expect(idle.dialog.shadowRoot?.querySelector(".snapshot-action")).toBeNull();

    liveTab?.click();
    await idle.dialog.updateComplete;
    expect(liveTab?.getAttribute("aria-selected")).toBe("true");
    expect(idle.dialog.shadowRoot?.querySelector(".snapshot-action")).not.toBeNull();
  });
});
