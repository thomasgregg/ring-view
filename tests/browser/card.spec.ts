import { expect, test } from "@playwright/test";
import { mdiDoorClosed, mdiDoorOpen } from "@mdi/js";
import type { HomeAssistant } from "../../src/types";

test.beforeEach(async ({ page }) => {
  await page.goto("/demo/");
});

test("uses a privacy-safe synthetic image in the card picker", async ({ page }) => {
  await expect(page.locator("ring-view")).toBeAttached();
  await page.evaluate(() => {
    const demoCard = document.querySelector("ring-view") as HTMLElement & {
      hass: unknown;
    };
    const picker = document.createElement("hui-card-picker");
    const card = document.createElement("ring-view");
    card.setConfig({
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
    });
    card.hass = demoCard.hass as HomeAssistant;
    picker.append(card);
    demoCard.replaceWith(picker);
  });

  const image = page.locator("hui-card-picker ring-view img");
  await expect(image).toBeVisible();
  await expect(image).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await expect(image).not.toHaveAttribute("src", /camera-preview\.svg/);
  await expect(page.locator("hui-card-picker ring-view .mode-indicator")).toHaveCount(0);
});

test("uses the newest device snapshot without adding a viewer mode", async ({ page }) => {
  await page.goto("/demo/?preview=newest");
  const preview = page.locator("ring-view img");
  await expect(preview).toHaveAttribute("src", /source=snapshot/);
  await page.evaluate(() =>
    window.demoSetEntityState("camera.device_snapshot", "unavailable"),
  );
  await expect(preview).not.toHaveAttribute("src", /source=snapshot/);
  await page.evaluate(() =>
    window.demoSetEntityState("camera.device_snapshot", "idle"),
  );
  await expect(preview).toHaveAttribute("src", /source=snapshot/);
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  await expect(page.getByRole("tab", { name: "Last recording" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("progressively reveals related dashboard preview settings", async ({ page }) => {
  await expect(page.locator("ring-view")).toBeAttached();
  const states = await page.evaluate(async () => {
    type FormSchema = {
      name: string;
      required?: boolean;
      schema?: FormSchema[];
    };
    type Editor = HTMLElement & {
      hass: HomeAssistant;
      setConfig: (config: Record<string, unknown>) => void;
      updateComplete: Promise<unknown>;
    };
    const demoCard = document.querySelector("ring-view") as HTMLElement & {
      hass: HomeAssistant;
    };
    const cardClass = customElements.get("ring-view") as CustomElementConstructor & {
      getConfigElement: () => Promise<Editor>;
    };
    const editor = await cardClass.getConfigElement();
    editor.hass = demoCard.hass;
    editor.setConfig({
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
    });
    document.body.replaceChildren(editor);
    await editor.updateComplete;

    const form = editor.shadowRoot?.querySelector("ha-form") as HTMLElement & {
      schema: FormSchema[];
    };
    const visiblePreviewFields = () =>
      form.schema
        .find((field) => field.name === "dashboard_preview")
        ?.schema?.map((field) => ({
          name: field.name,
          required: field.required ?? false,
        }));
    const result = { initial: visiblePreviewFields() } as Record<
      string,
      ReturnType<typeof visiblePreviewFields>
    >;

    for (const source of ["snapshot", "newest"]) {
      form.dispatchEvent(
        new CustomEvent("value-changed", {
          detail: {
            value: {
              recording_entity: "camera.latest_recording",
              live_entity: "camera.live_view",
              preview_source: source,
            },
          },
          bubbles: true,
          composed: true,
        }),
      );
      await editor.updateComplete;
      result[source] = visiblePreviewFields();
    }
    return result;
  });

  expect(states).toEqual({
    initial: [{ name: "preview_source", required: true }],
    snapshot: [
      { name: "preview_source", required: true },
      { name: "snapshot_entity", required: true },
    ],
    newest: [
      { name: "preview_source", required: true },
      { name: "snapshot_entity", required: true },
      { name: "preview_fallback", required: true },
    ],
  });
});

test("falls back to native live playback without talkback for a generic camera", async ({
  page,
}) => {
  await page.goto(
    "/demo/?mode=live&two_way_audio=1&live_platform=generic",
  );
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();

  await expect(page.locator("ring-view-native-camera-adapter")).toBeVisible();
  await expect(page.locator("ring-view-ring-webrtc-player")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Hold to talk" })).toHaveCount(0);
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
});

test("merges Talk and door access into one divided action dock", async ({ page }) => {
  await page.goto(
    "/demo/?mode=live&two_way_audio=1&door=1&door_action=open",
  );
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();

  const dock = page.locator(".visitor-action-dock");
  await expect(dock).toBeVisible();
  await expect(dock.getByRole("button", { name: "Connecting…" })).toBeDisabled();
  await expect(dock.getByRole("button", { name: "Hold to open" })).toBeVisible();
  await expect(dock.locator(".visitor-action-divider")).toBeVisible();
});

test("requires a complete hold before opening the configured door", async ({ page }) => {
  await page.goto("/demo/?mode=live&door=1&door_action=open");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  const door = page.getByRole("button", { name: "Hold to open" });
  const box = await door.boundingBox();
  if (!box) throw new Error("Door control was not visible");

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(350);
  await page.mouse.up();
  expect(await page.evaluate(() => window.demoDoorCalls ?? [])).toHaveLength(0);

  await page.mouse.down();
  await page.waitForTimeout(950);
  await page.mouse.up();
  await expect.poll(() => page.evaluate(() => window.demoDoorCalls?.length ?? 0)).toBe(1);
  expect(await page.evaluate(() => window.demoDoorCalls?.[0])).toEqual({
    domain: "lock",
    service: "open",
    serviceData: { entity_id: "lock.front_door" },
  });
  await expect(page.getByRole("button", { name: "Door opened" })).toBeVisible();
});

test("uses an optional contact sensor to turn the action into live door status", async ({
  page,
}) => {
  await page.goto(
    "/demo/?mode=live&door=1&door_action=open&door_contact=1&door_contact_state=on",
  );
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();

  const door = page.getByRole("button", { name: "Door open" });
  await expect(door).toBeVisible();
  await expect(door).toBeDisabled();
  await expect(door.locator("path")).toHaveAttribute("d", mdiDoorOpen);

  await page.evaluate(() => {
    window.demoSetEntityState("binary_sensor.front_door_contact", "off");
  });
  const closedDoor = page.getByRole("button", { name: "Hold to open" });
  await expect(closedDoor).toBeEnabled();
  await expect(closedDoor.locator("path")).toHaveAttribute("d", mdiDoorClosed);
});

test("configures door visibility and collapses automatically without Talk", async ({ page }) => {
  await page.goto("/demo/?door=1");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.locator(".door-action")).toHaveCount(0);
  await page.getByRole("tab", { name: "Live" }).click();
  await expect(page.locator(".door-action")).toBeVisible();

  await page.goto(
    "/demo/?door=1&door_visibility=all&two_way_audio=1&live_platform=generic",
  );
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.locator(".door-action")).toBeVisible();
  await expect(page.locator(".talk-action")).toHaveCount(0);
  await expect(page.locator(".visitor-action-divider")).toHaveCount(0);
});

test("opens, switches recording → live → recording, and tears down", async ({ page }) => {
  await expect(page.getByRole("button", { name: /Open Entrance viewer/ })).toBeVisible();
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Last recording" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("tab", { name: "Live" }).click();
  await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("tab", { name: "Last recording" }).click();
  await expect(page.getByRole("tab", { name: "Last recording" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect.poll(() => page.evaluate(() => window.demoPeakStreams)).toBe(1);
  await page.getByRole("button", { name: "Close camera viewer" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect
    .poll(() => page.evaluate(() => window.demoActiveStreams ?? 0))
    .toBe(0);
});

test("supports keyboard opening, tab selection, focus return, and Escape", async ({ page }) => {
  const card = page.getByRole("button", { name: /Open Entrance viewer/ });
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("tab", { name: "Last recording" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(card).toBeFocused();
});

test("browser Back closes the viewer and removes the stream", async ({ page }) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  await page.goBack();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(0);
});

test("shows an immediate unavailable state if the active entity changes", async ({ page }) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  await page.evaluate(() =>
    window.demoSetEntityState("camera.live_view", "unavailable"),
  );
  await expect(
    page.getByRole("status").getByText("Camera entity is unavailable."),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(0);
});

test("keeps the camera and controls visible after orientation changes", async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1280, height: 800 },
    { width: 1920, height: 1080 },
  ];
  await page.setViewportSize(viewports[1]!);
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const liveTab = page.getByRole("tab", { name: "Live" });
    const closeButton = page.getByRole("button", { name: "Close camera viewer" });
    const dialog = page.getByRole("dialog");
    const mediaFrame = page.locator(".media-frame");
    const cameraRenderer = page.locator("ring-view-native-camera-adapter");
    await expect(liveTab).toBeVisible();
    await expect(closeButton).toBeVisible();
    await expect(mediaFrame).toBeVisible();
    await expect(cameraRenderer).toBeVisible();
    expect((await liveTab.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    expect((await closeButton.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    const liveBox = await liveTab.boundingBox();
    const closeBox = await closeButton.boundingBox();
    expect(Math.abs((liveBox?.y ?? 0) - (closeBox?.y ?? 0))).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      viewport.width,
    );
    const mediaBox = await mediaFrame.boundingBox();
    expect(mediaBox?.width).toBeGreaterThan(viewport.width * 0.55);
    expect(mediaBox?.height).toBeGreaterThan(150);

    if (viewport.width > viewport.height && viewport.height <= 500) {
      const dialogBox = await dialog.boundingBox();
      expect(dialogBox?.width).toBeGreaterThanOrEqual(viewport.width - 2);
      expect(dialogBox?.height).toBeGreaterThanOrEqual(viewport.height - 2);
      expect(mediaBox?.height).toBeGreaterThanOrEqual(viewport.height - 2);
    }
  }
});

test("keeps the global viewer open when a responsive layout removes the card", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  await expect(page.locator("body > ring-view-dialog")).toBeVisible();
  await expect(page.locator("ring-view ring-view-dialog")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(1);

  await page.evaluate(() => document.querySelector("ring-view")?.remove());
  await page.setViewportSize({ width: 844, height: 390 });

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("ring-view-native-camera-adapter")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(1);

  await page.evaluate(() =>
    window.demoSetEntityState("camera.live_view", "unavailable"),
  );
  await expect(
    page.getByRole("status").getByText("Camera entity is unavailable."),
  ).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(0);
  await page.getByRole("button", { name: "Close camera viewer" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("does not restart the open viewer when a responsive layout recreates the card", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(1);

  await page.evaluate(() => {
    const current = document.querySelector("ring-view") as HTMLElement & {
      hass: HomeAssistant;
    };
    const replacement = document.createElement("ring-view");
    replacement.setConfig({
      type: "custom:ring-view",
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
    });
    replacement.hass = current.hass;
    current.replaceWith(replacement);
  });

  // Home Assistant may recreate a card while reflowing the dashboard, but the
  // application-owned dialog and its media session must remain untouched.
  await page.waitForTimeout(100);
  expect(await page.evaluate(() => window.demoActiveStreams)).toBe(1);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator(".state-title", { hasText: "Reconnecting live view…" })).toHaveCount(0);
  await page.getByRole("button", { name: "Close camera viewer" }).click();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(0);
});

test("does not overlap the previous Ring session when the card is recreated", async ({
  page,
}) => {
  await page.goto("/demo/?mode=live&two_way_audio=1&ring_teardown_race=1");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect.poll(() => page.evaluate(() => window.demoRingSubscriptions)).toBe(1);
  const player = page.locator("ring-view-ring-webrtc-player");
  const originalPlayer = await player.elementHandle();
  await expect(player).toBeAttached();

  await page.evaluate(() => {
    const current = document.querySelector("ring-view") as HTMLElement & {
      hass: HomeAssistant;
    };
    const replacement = document.createElement("ring-view");
    replacement.setConfig({
      type: "custom:ring-view",
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
      default_mode: "live",
      two_way_audio: true,
    });
    replacement.hass = current.hass;
    current.replaceWith(replacement);
  });

  // The replacement card must adopt the existing application-owned viewer;
  // opening it again creates a second Ring signaling subscription while the
  // first is still closing and eventually produces the reported error screen.
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForTimeout(6_000);
  await expect(page.getByText("Live view could not be started.")).toHaveCount(0);
  expect(await originalPlayer?.evaluate((element) => element.isConnected)).toBe(true);
  await expect(player).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Hold to talk" })).toHaveCount(0);
  expect(await page.evaluate(() => window.demoRingSubscriptions)).toBe(1);
});

test("falls back to Resume if a discarded Ring session prevents automatic recovery", async ({
  page,
}) => {
  await page.goto("/demo/?mode=live&two_way_audio=1&ring_teardown_race=reload");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect.poll(() => page.evaluate(() => window.demoRingSubscriptions)).toBe(1);
  await expect(page).toHaveURL(/ring-view-mode=live/);

  // A Companion frontend reload destroys the old document before restoring the
  // URL-owned dialog. The Ring backend can still be closing that document's
  // signaling session when the restored viewer requests another one.
  await page.setViewportSize({ width: 844, height: 390 });
  await page.reload();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForTimeout(6_000);
  await expect(page.getByText("Live view could not be started.")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Resume live view" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hold to talk" })).toHaveCount(0);
  expect(await page.evaluate(() => window.demoRingSubscriptions ?? 0)).toBe(1);
  await expect(page.locator("ring-view-ring-webrtc-player")).toHaveCount(0);
  await page.getByRole("button", { name: "Resume live view" }).click();
  // This synthetic backend still owns the previous stream. The explicit
  // attempt fails once; it must not enter the old automatic recovery loop.
  await expect(page.getByRole("alert").getByText("Live view could not be started.")).toBeVisible();
  await page.waitForTimeout(3_000);
  await expect(page.getByText("Reconnecting live view…", { exact: true })).toHaveCount(0);
  await expect(page.locator("ring-view-ring-webrtc-player")).toHaveCount(0);
  expect(await page.evaluate(() => window.demoRingSubscriptions)).toBe(2);
});

test("restores the open camera viewer after a Companion-style frontend reload", async ({
  page,
}) => {
  await page.goto("/demo/?two_way_audio=1");
  await page.setViewportSize({ width: 430, height: 932 });
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("ring-view-ring-webrtc-player")).toBeAttached();
  await expect(page).toHaveURL(/ring-view-mode=live/);

  await page.reload();

  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.locator("ring-view-ring-webrtc-player")).toHaveCount(1);
  await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("button", { name: "Close camera viewer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hold to talk" })).toHaveCount(0);
  await expect(page.locator("ring-view-ring-webrtc-player")).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator("ring-view-ring-webrtc-player")
        .evaluate((element) => (element as HTMLElement & { muted: boolean }).muted),
    )
    .toBe(true);

  await page.setViewportSize({ width: 932, height: 430 });
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.getByRole("button", { name: "Close camera viewer" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).not.toHaveURL(/ring-view-/);
  await expect(page.locator("ring-view-ring-webrtc-player")).toHaveCount(0);
});

test("does not overlap a failed live session with reconnecting controls", async ({
  page,
}) => {
  await page.goto("/demo/?two_way_audio=1");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  const player = page.locator("ring-view-ring-webrtc-player");
  await expect(player).toBeVisible();
  await expect.poll(() => player.evaluate((element) =>
    (element as HTMLElement & { muted: boolean }).muted
  )).toBe(false);

  await player.evaluate((element) => {
    element.dispatchEvent(
      new CustomEvent("ring-webrtc-error", {
        detail: { message: "Previous session is still closing" },
        bubbles: true,
        composed: true,
      }),
    );
  });

  await expect(page.locator(".state-title", { hasText: "Reconnecting live view…" })).toBeVisible();
  await expect(page.getByText("Connecting video and incoming audio.")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Hold to talk" })).toHaveCount(0);
  await expect(player).toHaveCount(0);
});

test("keeps hold to talk near the video edge on desktop and mobile", async ({ page }) => {
  await page.evaluate(() => {
    const frame = document.createElement("div");
    frame.id = "talkback-frame";
    Object.assign(frame.style, {
      position: "fixed",
      inset: "0",
      overflow: "hidden",
      background: "black",
    });
    const player = document.createElement(
      "ring-view-ring-webrtc-player",
    ) as unknown as HTMLElement & { statusMessage: string; readyDispatched: boolean; connectionState: string };
    player.statusMessage = "Microphone access requires HTTPS.";
    player.readyDispatched = true;
    player.connectionState = "connected";
    frame.append(player);
    document.body.replaceChildren(frame);
  });
  const viewports = [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 1280, height: 800 },
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    const frame = page.locator("#talkback-frame");
    const controls = page.locator("ring-view-ring-webrtc-player .talkback-controls");
    const talkButton = page.locator("ring-view-ring-webrtc-player .talk-button");
    const status = page.locator("ring-view-ring-webrtc-player .session-status");
    await expect(frame).toBeVisible();
    await expect(controls).toBeVisible();
    await expect(status).toBeVisible();
    const frameBox = await frame.boundingBox();
    const controlsBox = await controls.boundingBox();
    expect((frameBox?.y ?? 0) + (frameBox?.height ?? 0) - ((controlsBox?.y ?? 0) + (controlsBox?.height ?? 0))).toBeLessThanOrEqual(24);
    const buttonBox = await talkButton.boundingBox();
    const statusBox = await status.boundingBox();
    expect(Math.abs(
      (statusBox?.x ?? 0) + (statusBox?.width ?? 0) / 2
        - ((frameBox?.x ?? 0) + (frameBox?.width ?? 0) / 2),
    )).toBeLessThanOrEqual(1);
    expect(Math.abs(
      (statusBox?.y ?? 0) + (statusBox?.height ?? 0) / 2
        - ((frameBox?.y ?? 0) + (frameBox?.height ?? 0) / 2),
    )).toBeLessThanOrEqual(1);
    expect((statusBox?.y ?? 0) + (statusBox?.height ?? 0)).toBeLessThanOrEqual(
      (buttonBox?.y ?? 0) - 6,
    );
    expect(statusBox?.x).toBeGreaterThanOrEqual(0);
    expect((statusBox?.x ?? 0) + (statusBox?.width ?? 0)).toBeLessThanOrEqual(
      viewport.width,
    );
  }
});

test("renders native-style header controls without duplicate media actions", async ({ page }) => {
  await page.goto("/demo/?theme=dark");
  const previewIndicator = page.locator("ring-view .mode-indicator");
  await expect(previewIndicator).toHaveCount(0);
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("button", { name: "Close camera viewer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter fullscreen" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Mute|Unmute/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Last recording" })).toHaveAttribute(
    "title",
    "Last recording",
  );
  await expect(page.getByRole("tab", { name: "Last recording" }).locator(".mode-icon-recording")).toBeVisible();
  await expect(page.getByRole("tab", { name: "Live" }).locator(".mode-icon-live")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCSS("color", "rgb(242, 243, 244)");
});

test("places the optional camera name at the top left in both views", async ({
  page,
}) => {
  await page.goto("/demo/?name=1");
  const card = page.getByRole("button", { name: /Open Entrance viewer/ });
  const name = page.locator("ring-view .name");
  await expect(name).toHaveText("Entrance");
  const cardBox = await card.boundingBox();
  const nameBox = await name.boundingBox();
  expect((nameBox?.y ?? 0) - (cardBox?.y ?? 0)).toBeLessThan(32);

  await card.click();
  await expect(page.getByRole("heading", { name: "Entrance" })).toBeVisible();
});

test("hides the camera name from both views when disabled", async ({ page }) => {
  await expect(page.locator("ring-view .name")).toHaveCount(0);
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("dialog", { name: "Camera view" })).toBeVisible();
  await expect(page.locator("ring-view-dialog h2")).toHaveCount(0);
});

test("supports restored playback and card appearance choices", async ({ page }) => {
  await page.goto("/demo/?autoplay=0&remember=1");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("button", { name: "Play last recording" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.demoActiveStreams ?? 0))
    .toBe(0);
  await page.getByRole("button", { name: "Play last recording" }).click();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(1);
  await page.getByRole("tab", { name: "Live" }).click();
  await page.getByRole("button", { name: "Close camera viewer" }).click();
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("keeps the live image passive without covering native hover controls", async ({
  page,
}) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();

  const adapter = page.locator("ring-view-native-camera-adapter");
  await expect(adapter).toBeVisible();
  const clickResults = await adapter.evaluate((element) => {
    const nativeAdapter = element as HTMLElement & { passiveSurface?: boolean };
    const stream = nativeAdapter.shadowRoot?.querySelector("ha-camera-stream");
    if (!stream) return null;
    const rect = stream.getBoundingClientRect();
    const dispatchClick = (clientY: number) => {
      const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        clientY,
        composed: true,
        detail: 1,
      });
      stream.dispatchEvent(event);
      return event.defaultPrevented;
    };
    return {
      passiveSurface: nativeAdapter.passiveSurface,
      surfacePrevented: dispatchClick(rect.top + 10),
      controlsPrevented: dispatchClick(rect.bottom - 10),
    };
  });
  expect(clickResults).toEqual({
    passiveSurface: true,
    surfacePrevented: true,
    controlsPrevented: false,
  });
  await expect(page.locator(".live-surface-guard")).toHaveCount(0);
});

test("shows a stable loading shell on a slow connection", async ({ page }) => {
  await page.goto("/demo/?delay=8000");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  await expect(page.getByText("Connecting to Ring live view…")).toBeVisible();
  const frame = page.locator(".media-frame");
  expect((await frame.boundingBox())?.height).toBeGreaterThan(150);
});

test("uses Home Assistant's German locale throughout the card and viewer", async ({
  page,
}) => {
  await page.goto("/demo/?lang=de-DE&delay=8000");
  const card = page.getByRole("button", {
    name: "Kameraansicht „Entrance“ öffnen — Letzte Aufnahme",
  });
  await expect(card).toHaveAttribute("title", "Letzte Aufnahme öffnen");
  await card.click();
  await expect(page.getByRole("tab", { name: "Letzte Aufnahme" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Kameraansicht schließen" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Live" }).click();
  await expect(page.getByText("Ring-Live-Ansicht wird verbunden…")).toBeVisible();
});
