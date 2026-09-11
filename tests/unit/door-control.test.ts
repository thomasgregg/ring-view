import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mdiAlertCircleOutline, mdiDoorClosed, mdiDoorOpen } from "@mdi/js";
import "../../src/ring-view-dialog";
import { normalizeConfig } from "../../src/config";
import type {
  CameraMode,
  DoorAction,
  DoorControlVisibility,
  HomeAssistant,
} from "../../src/types";

function dispatchPointer(
  target: Element,
  type: "pointerdown" | "pointerup" | "pointercancel",
  pointerId = 1,
): void {
  const event = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent;
  Object.defineProperties(event, {
    button: { value: 0 },
    isPrimary: { value: true },
    pointerId: { value: pointerId },
  });
  target.dispatchEvent(event);
}

async function mount({
  mode = "live",
  visibility = "live_only",
  action = "open",
  hold = true,
  doorState = "locked",
  features = 1,
  configureContact = false,
  contactState = "off",
}: {
  mode?: CameraMode;
  visibility?: DoorControlVisibility;
  action?: DoorAction;
  hold?: boolean;
  doorState?: string;
  features?: number;
  configureContact?: boolean;
  contactState?: string;
} = {}) {
  const callService = vi.fn(async () => undefined);
  const hass: HomeAssistant = {
    states: {
      "camera.live": {
        entity_id: "camera.live",
        state: "idle",
        attributes: { supported_features: 2, entity_picture: "/live.jpg" },
      },
      "camera.recording": {
        entity_id: "camera.recording",
        state: "idle",
        attributes: { entity_picture: "/recording.jpg" },
      },
      "lock.front_door": {
        entity_id: "lock.front_door",
        state: doorState,
        attributes: { friendly_name: "Front Door", supported_features: features },
      },
      "binary_sensor.front_door_contact": {
        entity_id: "binary_sensor.front_door_contact",
        state: contactState,
        attributes: { friendly_name: "Front Door Contact", device_class: "door" },
      },
    },
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
    callService,
  };
  const dialog = document.createElement("ring-view-dialog");
  dialog.hass = hass;
  document.body.append(dialog);
  dialog.showDialog({
    mode,
    config: normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
      door_entity: "lock.front_door",
      door_contact_entity: configureContact
        ? "binary_sensor.front_door_contact"
        : undefined,
      door_action: action,
      door_control_visibility: visibility,
      door_hold_to_activate: hold,
    }),
  });
  await vi.advanceTimersByTimeAsync(0);
  return { dialog, hass, callService };
}

describe("door control", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("uses a cancellable hold and calls lock.open exactly once", async () => {
    const { dialog, callService } = await mount();
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.textContent).toContain("Hold to open");

    dispatchPointer(button!, "pointerdown");
    await vi.advanceTimersByTimeAsync(899);
    dispatchPointer(button!, "pointerup");
    await vi.advanceTimersByTimeAsync(1_000);
    expect(callService).not.toHaveBeenCalled();

    dispatchPointer(button!, "pointerdown", 2);
    await vi.advanceTimersByTimeAsync(900);
    expect(callService).toHaveBeenCalledTimes(1);
    expect(callService).toHaveBeenCalledWith("lock", "open", {
      entity_id: "lock.front_door",
    });
    expect(dialog.shadowRoot?.textContent).toContain("Door opened");
  });

  it("can use an immediate single-tap unlock action", async () => {
    const { dialog, callService } = await mount({ action: "unlock", hold: false });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.textContent).toContain("Unlock");
    button?.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(callService).toHaveBeenCalledWith("lock", "unlock", {
      entity_id: "lock.front_door",
    });
  });

  it("ignores an unconfigured contact sensor", async () => {
    const { dialog } = await mount({ action: "open", contactState: "on" });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.disabled).toBe(false);
    expect(button?.textContent).toContain("Hold to open");
    expect(button?.textContent).not.toContain("Door open");
    expect(button?.querySelector("path")?.getAttribute("d")).toBe(mdiDoorOpen);
  });

  it("turns the configured action into Door open when the contact is open", async () => {
    const { dialog, callService } = await mount({
      action: "open",
      configureContact: true,
      contactState: "on",
    });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.disabled).toBe(true);
    expect(button?.textContent).toContain("Door open");
    expect(button?.classList.contains("contact-open")).toBe(true);
    expect(button?.querySelector("path")?.getAttribute("d")).toBe(mdiDoorOpen);
    button?.click();
    await vi.advanceTimersByTimeAsync(1_000);
    expect(callService).not.toHaveBeenCalled();
  });

  it("keeps the configured action available while the contact is closed", async () => {
    const { dialog } = await mount({
      action: "open",
      configureContact: true,
      contactState: "off",
    });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.disabled).toBe(false);
    expect(button?.textContent).toContain("Hold to open");
    expect(button?.querySelector("path")?.getAttribute("d")).toBe(mdiDoorClosed);
  });

  it("keeps the action available and marks an unknown contact state", async () => {
    const { dialog } = await mount({
      action: "unlock",
      configureContact: true,
      contactState: "unavailable",
    });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.disabled).toBe(false);
    expect(button?.textContent).toContain("Hold to unlock");
    expect(button?.textContent).toContain("Status unknown");
    expect(button?.querySelector("path")?.getAttribute("d"))
      .toBe(mdiAlertCircleOutline);
  });

  it("updates the action immediately when the contact opens", async () => {
    const { dialog, hass } = await mount({
      action: "open",
      configureContact: true,
      contactState: "off",
    });
    const entityId = "binary_sensor.front_door_contact";
    dialog.hass = {
      ...hass,
      states: {
        ...hass.states,
        [entityId]: { ...hass.states[entityId]!, state: "on" },
      },
    };
    await dialog.updateComplete;

    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.disabled).toBe(true);
    expect(button?.textContent).toContain("Door open");
  });

  it("shows a concise service error and keeps the action retryable", async () => {
    const { dialog, callService } = await mount({ action: "unlock", hold: false });
    callService.mockRejectedValueOnce(new Error("service failed"));
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");

    button?.click();
    await vi.advanceTimersByTimeAsync(0);
    await dialog.updateComplete;

    expect(dialog.shadowRoot?.querySelector('[role="alert"]')?.textContent)
      .toContain("unlock the door");
    expect(button?.disabled).toBe(false);

    button?.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(callService).toHaveBeenCalledTimes(2);
  });

  it("defaults to Live only but can remain visible over recordings", async () => {
    const liveOnly = await mount({ mode: "last_recording" });
    expect(liveOnly.dialog.shadowRoot?.querySelector(".door-action")).toBeNull();
    liveOnly.dialog.close();

    const allViews = await mount({
      mode: "last_recording",
      visibility: "all_views",
    });
    expect(allViews.dialog.shadowRoot?.querySelector(".door-action")).not.toBeNull();
  });

  it.each([
    { state: "unavailable", features: 1, label: "Door unavailable" },
    { state: "jammed", features: 1, label: "Lock jammed" },
    { state: "locked", features: 0, label: "Open unsupported" },
    { state: "open", features: 1, label: "Door opened" },
  ])("disables unsafe actions for $state", async ({ state, features, label }) => {
    const { dialog, callService } = await mount({ doorState: state, features });
    const button = dialog.shadowRoot?.querySelector<HTMLButtonElement>(".door-action");
    expect(button?.disabled).toBe(true);
    expect(button?.textContent).toContain(label);
    button?.click();
    await vi.advanceTimersByTimeAsync(1_000);
    expect(callService).not.toHaveBeenCalled();
  });
});
