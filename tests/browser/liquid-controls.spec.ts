import { expect, test, type Locator, type Page } from "@playwright/test";

async function pseudoStyle(
  locator: Locator,
  pseudo: "::before" | "::after",
): Promise<Record<string, string>> {
  return locator.evaluate((element, target) => {
    const style = getComputedStyle(element, target);
    return {
      animationName: style.animationName,
      backgroundColor: style.backgroundColor,
      borderTopLeftRadius: style.borderTopLeftRadius,
      borderTopRightRadius: style.borderTopRightRadius,
      bottom: style.bottom,
      boxShadow: style.boxShadow,
      left: style.left,
      right: style.right,
      top: style.top,
      width: style.width,
    };
  }, pseudo);
}

async function openViewer(page: Page, query: string): Promise<void> {
  await page.goto(`/demo/?${query}`);
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
}

test("uses separate utility surfaces and always keeps dashboard enlarge", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live"
      + "&snapshot_button=1&live_platform=generic&name=1&activity=1",
  );
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();

  const card = page.locator("ring-view");
  const modes = card.getByRole("tablist", { name: "Camera view" });
  const actions = card.locator(".header-actions");
  const cameraActions = card.locator(".camera-actions");
  const recording = card.getByRole("tab", { name: "Last recording" });
  const live = card.getByRole("tab", { name: "Live" });
  const snapshot = card.getByRole("button", { name: "Take snapshot" });
  const enlarge = card.getByRole("button", {
    name: "Open fullscreen camera viewer",
  });
  const expectedSize = (page.viewportSize()?.width ?? 1280) <= 600 ? 48 : 44;

  await expect(modes).toHaveCSS("background-color", "rgba(0, 0, 0, 0.3)");
  await expect(actions).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(cameraActions).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  for (const rail of [modes, actions, cameraActions]) {
    await expect(rail).toHaveCSS("border-top-width", "0px");
    await expect(rail).toHaveCSS("box-shadow", "none");
  }
  for (const control of [snapshot, enlarge]) {
    await expect(control).toHaveCSS("background-color", "rgba(0, 0, 0, 0.3)");
  }
  for (const control of [recording, live, snapshot, enlarge]) {
    const box = await control.boundingBox();
    expect(box?.width).toBe(expectedSize);
    expect(box?.height).toBe(expectedSize);
  }

  const [cardBox, snapshotBox, enlargeBox] = await Promise.all([
    card.boundingBox(),
    snapshot.boundingBox(),
    enlarge.boundingBox(),
  ]);
  if (!cardBox || !snapshotBox || !enlargeBox) {
    throw new Error("Dashboard utility geometry unavailable");
  }
  expect(enlargeBox.x).toBeGreaterThan(cardBox.x + cardBox.width / 2);
  expect(enlargeBox.y - cardBox.y).toBeLessThanOrEqual(16);
  expect(Math.abs(snapshotBox.x + snapshotBox.width + 8 - enlargeBox.x))
    .toBeLessThanOrEqual(1);

  await enlarge.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("button", { name: "Close camera viewer" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter fullscreen" })).toHaveCount(0);
});

test("keeps selected, hover, and keyboard focus states inside their hit targets", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live&live_platform=generic",
  );
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
  const live = page.getByRole("tab", { name: "Live" });
  const recording = page.getByRole("tab", { name: "Last recording" });
  const dot = live.locator(".mode-icon-live");

  const selected = await pseudoStyle(live, "::before");
  expect(selected.top).toBe("4px");
  expect(selected.right).toBe("4px");
  expect(selected.bottom).toBe("4px");
  expect(selected.left).toBe("4px");
  expect(selected.backgroundColor).toBe("rgba(255, 255, 255, 0.17)");
  expect(selected.boxShadow).toBe("none");
  await expect(dot).toHaveCSS("width", "17px");
  await expect(dot).toHaveCSS("height", "17px");
  await expect(dot).toHaveCSS("background-color", "rgb(255, 59, 48)");
  await expect(live).toHaveCSS("border-top-width", "0px");

  await recording.hover();
  await page.waitForTimeout(180);
  expect((await pseudoStyle(recording, "::before")).backgroundColor)
    .toBe("rgba(255, 255, 255, 0.13)");
  await recording.click();
  await page.waitForTimeout(180);
  expect((await pseudoStyle(recording, "::before")).boxShadow).toBe("none");
  await page.keyboard.press("Tab");
  await recording.focus();
  await page.waitForTimeout(180);
  expect((await pseudoStyle(recording, "::before")).boxShadow)
    .toContain("rgba(255, 255, 255, 0.92)");
});

test("keeps the door target stable while a straight-edged hold fill advances", async ({
  page,
}) => {
  await openViewer(page, "mode=live&door=1&door_action=open&live_platform=generic");
  const door = page.getByRole("button", { name: "Hold to open" });
  const dock = page.locator(".visitor-action-dock");
  await expect(door).toBeEnabled();

  const initialBox = await door.boundingBox();
  expect(initialBox?.width).toBe(168);
  expect(initialBox?.height).toBe(48);
  expect((await dock.boundingBox())?.height).toBe(48);

  if (!initialBox) throw new Error("Door target geometry unavailable");
  await page.mouse.move(
    initialBox.x + initialBox.width / 2,
    initialBox.y + initialBox.height / 2,
  );
  await page.mouse.down();
  await page.waitForTimeout(650);
  const progress = await pseudoStyle(door, "::after");
  const progressWidth = Number.parseFloat(progress.width ?? "0");
  expect(progressWidth).toBeGreaterThan(30);
  expect(progressWidth).toBeLessThan(160);
  expect(progress.borderTopLeftRadius).toBe("20px");
  expect(progress.borderTopRightRadius).toBe("0px");
  expect((await door.boundingBox())?.width).toBe(168);
  await page.mouse.up();
  expect(await page.evaluate(() => window.demoDoorCalls ?? [])).toHaveLength(0);
});

test("uses a red Talk state without changing the native video controls", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/recovery.html");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  const video = page.locator("ring-view-ring-webrtc-player video");
  const talk = page.locator(".talk-action");
  await expect(talk).toHaveAttribute("aria-label", "Hold to talk");
  await expect(talk).toBeEnabled();
  await expect(video).toBeVisible();
  expect(await video.evaluate((element: HTMLVideoElement) => element.controls)).toBe(true);

  const box = await talk.boundingBox();
  if (!box) throw new Error("Talk target geometry unavailable");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(talk).toHaveAttribute("aria-pressed", "true");
  await expect(talk).toHaveAttribute("aria-label", "Release to stop");
  await expect(talk.locator("span")).toHaveText("Release");
  await page.waitForTimeout(180);
  expect((await pseudoStyle(talk, "::before")).backgroundColor)
    .toBe("rgba(255, 59, 48, 0.9)");
  expect((await talk.boundingBox())?.height).toBe(48);

  await page.mouse.up();
  await expect(talk).toHaveAttribute("aria-pressed", "false");
  expect(await video.evaluate((element: HTMLVideoElement) => element.controls)).toBe(true);
});

test("keeps an icon-only Talk action understandable through every state", async ({
  page,
}) => {
  await page.goto("/tests/fixtures/recovery.html");
  await page.locator("ring-view").evaluate((element) => {
    const card = element as HTMLElement & {
      setConfig(config: Record<string, unknown>): void;
    };
    card.setConfig({
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
      name: "Entrance",
      show_name: true,
      default_mode: "live",
      two_way_audio: true,
      live_muted: true,
      show_action_button_labels: false,
    });
  });
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();

  const talk = page.locator(".talk-action");
  await expect(talk).toHaveAttribute("aria-label", "Hold to talk");
  await expect(talk).toHaveAttribute("title", "Hold to talk");
  await expect(talk.locator("span")).toHaveCount(0);
  await expect(talk).toBeEnabled();
  expect((await talk.boundingBox())?.width).toBe(48);

  const box = await talk.boundingBox();
  if (!box) throw new Error("Icon-only Talk target geometry unavailable");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect(talk).toHaveAttribute("aria-label", "Release to stop");
  await expect(talk).toHaveAttribute("title", "Release to stop");
  await expect(talk.locator("span")).toHaveCount(0);
  await expect(talk).toHaveAttribute("aria-pressed", "true");
  await page.mouse.up();
  await expect(talk).toHaveAttribute("aria-label", "Hold to talk");
  await expect(talk).toHaveAttribute("aria-pressed", "false");
});

test("keeps portrait, landscape, and desktop controls in distinct stable zones", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openViewer(
    page,
    "mode=live&snapshot_button=1&live_platform=generic&door=1&door_action=open&name=1&activity=1",
  );
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();

  const viewports = [
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 1280, height: 800 },
  ];
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const modes = page.getByRole("tablist", { name: "Camera view" });
    const close = page.getByRole("button", { name: "Close camera viewer" });
    const snapshot = page.getByRole("button", { name: "Take snapshot" });
    const door = page.getByRole("button", { name: "Hold to open" });
    const expectedUtilitySize = viewport.width <= 600 ? 48 : 44;
    const [modeBox, closeBox, snapshotBox, doorBox] = await Promise.all([
      modes.boundingBox(),
      close.boundingBox(),
      snapshot.boundingBox(),
      door.boundingBox(),
    ]);
    if (!modeBox || !closeBox || !snapshotBox || !doorBox) {
      throw new Error(`Responsive geometry unavailable at ${viewport.width}x${viewport.height}`);
    }
    expect(modeBox.height).toBe(expectedUtilitySize);
    expect(closeBox.height).toBe(expectedUtilitySize);
    expect(snapshotBox.height).toBe(expectedUtilitySize);
    expect(doorBox.height).toBe(48);
    expect(closeBox.x + closeBox.width).toBeLessThanOrEqual(viewport.width);
    expect(doorBox.y + doorBox.height).toBeLessThanOrEqual(viewport.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewport.width);

    if (viewport.width <= 600) {
      expect(modeBox.x + modeBox.width).toBeLessThanOrEqual(closeBox.x - 8);
      expect(Math.abs(snapshotBox.y - closeBox.y)).toBeLessThanOrEqual(1);
      expect(Math.abs(snapshotBox.x + snapshotBox.width + 8 - closeBox.x))
        .toBeLessThanOrEqual(1);
    } else {
      expect(Math.abs(modeBox.y - closeBox.y)).toBeLessThanOrEqual(1);
    }
  }
});

test("anchors dashboard visitor actions to the bottom of a short card", async ({
  page,
}) => {
  await page.setViewportSize({ width: 423, height: 184 });
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live"
      + "&two_way_audio=1&door=1&dashboard_door=1&live_platform=ring",
  );
  const card = page.locator("ring-view");
  const dock = card.locator(".visitor-action-dock");
  const [cardBox, dockBox] = await Promise.all([card.boundingBox(), dock.boundingBox()]);
  if (!cardBox || !dockBox) throw new Error("Dashboard visitor geometry unavailable");
  expect(cardBox.y + cardBox.height - (dockBox.y + dockBox.height)).toBe(8);
});

test("keeps a short-card recording error readable and uses the shared Retry style", async ({
  page,
}) => {
  await page.setViewportSize({ width: 500, height: 420 });
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=recording"
      + "&recording_source=mqtt&name=1&activity=1",
  );
  const card = page.locator("ring-view");
  await card.evaluate((element) => {
    const host = element as HTMLElement;
    host.style.width = "423px";
    host.style.height = "184px";
  });
  const dialog = card.locator("ring-view-dialog");
  await dialog.evaluate((element) => {
    const viewer = element as HTMLElement & {
      mediaStatus: string;
      mode: string;
      recordingFailureDetail: string;
      requestUpdate(): void;
    };
    viewer.mode = "last_recording";
    viewer.mediaStatus = "error";
    viewer.recordingFailureDetail =
      "Ring-MQTT did not provide a fresh recording URL in time.";
    viewer.requestUpdate();
  });

  const header = dialog.locator(".header");
  const state = dialog.locator(".error-state .state-card");
  const detail = dialog.locator(".error-state .state-detail");
  const retry = dialog.getByRole("button", { name: "Retry", exact: true });
  await expect(dialog.getByText("Recording unavailable", { exact: true })).toBeVisible();
  await expect(detail).toHaveCSS("display", "none");
  await expect(retry).toHaveCSS("background-color", "rgba(0, 0, 0, 0.48)");
  await expect(retry).toHaveCSS("border-top-width", "0px");
  const [cardBox, headerBox, stateBox] = await Promise.all([
    card.boundingBox(),
    header.boundingBox(),
    state.boundingBox(),
  ]);
  if (!cardBox || !headerBox || !stateBox) {
    throw new Error("Compact error geometry unavailable");
  }
  expect(stateBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height);
  expect(stateBox.y + stateBox.height).toBeLessThanOrEqual(cardBox.y + cardBox.height);
});

test("wraps long transient feedback in one calm left-aligned message surface", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/tests/fixtures/recovery.html");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  const player = page.locator("ring-view-ring-webrtc-player");
  const video = player.locator("video");
  await expect(video).toBeVisible();
  await expect(page.getByRole("button", { name: "Hold to talk" })).toBeEnabled();
  await player.evaluate((element) => {
    element.dispatchEvent(new CustomEvent("ring-webrtc-status", {
      bubbles: true,
      composed: true,
      detail: {
        kind: "status",
        message: "The browser started live view muted. Use the video controls to enable sound.",
      },
    }));
  });

  const layer = page.locator(".session-message-layer");
  const card = layer.locator(".state-card");
  const copy = layer.locator(".state-title");
  await expect(layer).toHaveAttribute("role", "status");
  await expect(layer).toHaveAttribute("aria-live", "polite");
  await expect(card).toHaveCSS("background-color", "rgba(10, 10, 10, 0.78)");
  await expect(card).toHaveCSS("border-top-width", "0px");
  await expect(card).toHaveCSS("box-shadow", "none");
  await expect(copy).toHaveCSS("text-align", "left");
  const box = await card.boundingBox();
  if (!box) throw new Error("Transient message geometry unavailable");
  expect(box.x).toBeGreaterThanOrEqual(18);
  expect(box.x + box.width).toBeLessThanOrEqual(372);
  expect(box.height).toBeGreaterThan(44);
  expect(await video.evaluate((element: HTMLVideoElement) => element.controls)).toBe(true);
});

test("honors reduced motion while preserving complete hold feedback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openViewer(page, "mode=live&door=1&door_action=open&live_platform=generic");
  const door = page.getByRole("button", { name: "Hold to open" });
  const box = await door.boundingBox();
  if (!box) throw new Error("Reduced-motion door target unavailable");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  const progress = await pseudoStyle(door, "::after");
  expect(progress.animationName).toBe("none");
  expect(Number.parseFloat(progress.width ?? "0")).toBe(160);
  await page.mouse.up();
  expect(await page.evaluate(() => window.demoDoorCalls ?? [])).toHaveLength(0);
});

test("keeps controls distinguishable in forced-colour mode", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await openViewer(
    page,
    "mode=live&snapshot_button=1&live_platform=generic&door=1&door_action=open&doorbell=1",
  );
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();

  const modes = page.getByRole("tablist", { name: "Camera view" });
  const bell = page.locator("ring-view-dialog .ring-indicator");
  const snapshot = page.getByRole("button", { name: "Take snapshot" });
  const close = page.getByRole("button", { name: "Close camera viewer" });
  const door = page.getByRole("button", { name: "Hold to open" });
  const recording = page.getByRole("tab", { name: "Last recording" });

  await page.evaluate(() => window.demoSetEntityState("binary_sensor.front_door_ding", "on"));
  await expect(bell).toBeVisible();
  for (const rail of [modes, bell, snapshot, close, page.locator(".visitor-action-dock")]) {
    await expect(rail).toHaveCSS("border-top-width", "1px");
    await expect(rail).toHaveCSS("border-top-style", "solid");
  }

  await page.keyboard.press("Tab");
  await recording.focus();
  await expect(recording).toHaveCSS("outline-style", "solid");
  await expect(recording).toHaveCSS("outline-width", "3px");
  expect((await door.boundingBox())?.height).toBe(48);
});

test("retains accessible touch targets at an exceptionally narrow width", async ({ page }) => {
  await page.setViewportSize({ width: 280, height: 653 });
  await openViewer(page, "mode=live&two_way_audio=1&door=1");

  const dialog = page.locator("ring-view-dialog");
  const talk = dialog.locator(".talk-action");
  const door = dialog.locator(".door-action");
  const dock = dialog.locator(".visitor-action-dock");
  await expect(talk).toHaveAttribute("aria-label", /Connecting|Hold to talk/);
  await expect(door).toHaveAttribute(
    "aria-label",
    /Unlock available after live video connects|Hold to unlock/,
  );

  const [talkBox, doorBox, dockBox] = await Promise.all([
    talk.boundingBox(),
    door.boundingBox(),
    dock.boundingBox(),
  ]);
  if (!talkBox || !doorBox || !dockBox) {
    throw new Error("Narrow touch-target geometry unavailable");
  }
  expect(talkBox.width).toBe(48);
  expect(talkBox.height).toBe(48);
  expect(doorBox.width).toBe(48);
  expect(doorBox.height).toBe(48);
  expect(dockBox.width).toBe(96);
  expect(dockBox.x).toBeGreaterThanOrEqual(8);
  expect(dockBox.x + dockBox.width).toBeLessThanOrEqual(272);
  await expect(talk.locator("span")).toHaveCSS("display", "none");
  await expect(door.locator(".door-action-copy")).toHaveCSS("display", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(280);
});

test("uses compact icon-only visitor actions across viewer layouts and the dashboard", async ({
  page,
}) => {
  const viewports = [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
  ];

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await openViewer(
      page,
      "mode=live&two_way_audio=1&door=1&action_labels=0",
    );
    const dialog = page.locator("ring-view-dialog");
    const dock = dialog.locator(".visitor-action-dock");
    const talk = dialog.locator(".talk-action");
    const door = dialog.locator(".door-action");

    await expect(dock).toHaveClass(/icon-only/);
    await expect(talk.locator("span")).toHaveCount(0);
    await expect(door.locator(".door-action-copy")).toHaveCount(0);
    await expect(talk).toHaveAttribute("title", /Connecting|Hold to talk/);
    await expect(door).toHaveAttribute(
      "title",
      /Unlock available after live video connects|Hold to unlock/,
    );

    const [talkBox, doorBox, dockBox] = await Promise.all([
      talk.boundingBox(),
      door.boundingBox(),
      dock.boundingBox(),
    ]);
    if (!talkBox || !doorBox || !dockBox) {
      throw new Error("Icon-only visitor-action geometry unavailable");
    }
    expect(talkBox.width).toBe(48);
    expect(talkBox.height).toBe(48);
    expect(doorBox.width).toBe(48);
    expect(doorBox.height).toBe(48);
    expect(dockBox.width).toBe(96);
    expect(dockBox.x).toBeGreaterThanOrEqual(8);
    expect(dockBox.x + dockBox.width).toBeLessThanOrEqual(viewport.width - 8);
    expect(dockBox.y + dockBox.height).toBeLessThanOrEqual(viewport.height);
    const progress = await pseudoStyle(door, "::after");
    expect(progress.borderTopLeftRadius).toBe("20px");
    expect(progress.borderTopRightRadius).toBe("0px");
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(viewport.width);
  }

  await page.setViewportSize({ width: 423, height: 300 });
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live"
      + "&two_way_audio=1&door=1&dashboard_door=1&action_labels=0",
  );
  const card = page.locator("ring-view");
  await card.evaluate((element) => {
    const host = element as HTMLElement;
    host.style.height = "184px";
  });
  const dock = card.locator(".visitor-action-dock");
  const [cardBox, dockBox] = await Promise.all([
    card.boundingBox(),
    dock.boundingBox(),
  ]);
  if (!cardBox || !dockBox) {
    throw new Error("Icon-only dashboard geometry unavailable");
  }
  await expect(dock).toHaveClass(/icon-only/);
  await expect(card.locator(".talk-action span")).toHaveCount(0);
  await expect(card.locator(".door-action-copy")).toHaveCount(0);
  expect(dockBox.width).toBe(96);
  expect(cardBox.y + cardBox.height - (dockBox.y + dockBox.height)).toBe(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(423);
});
