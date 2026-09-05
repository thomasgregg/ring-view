import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/demo/");
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
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams)).toBe(0);
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

test("keeps controls usable after phone orientation change", async ({ page }) => {
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
    await expect(liveTab).toBeVisible();
    await expect(closeButton).toBeVisible();
    expect((await liveTab.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    expect((await closeButton.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    const liveBox = await liveTab.boundingBox();
    const closeBox = await closeButton.boundingBox();
    expect(Math.abs((liveBox?.y ?? 0) - (closeBox?.y ?? 0))).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      viewport.width,
    );
  }
});

test("renders native-style header controls without duplicate media actions", async ({ page }) => {
  await page.goto("/demo/?theme=dark");
  const previewIndicator = page.locator("ring-view .mode-indicator");
  await expect(previewIndicator).toBeVisible();
  await expect(previewIndicator).toHaveText("");
  await expect(previewIndicator.locator(".mode-icon-recording")).toBeVisible();
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

test("shows a stable loading shell on a slow connection", async ({ page }) => {
  await page.goto("/demo/?delay=8000");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await page.getByRole("tab", { name: "Live" }).click();
  await expect(page.getByText("Connecting to Ring live view…")).toBeVisible();
  const frame = page.locator(".media-frame");
  expect((await frame.boundingBox())?.height).toBeGreaterThan(150);
});
