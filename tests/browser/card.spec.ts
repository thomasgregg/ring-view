import { expect, test } from "@playwright/test";
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
  await page.goto("/demo/?autoplay=0&icon=0&remember=1");
  await expect(page.locator("ring-view .mode-indicator")).toHaveCount(0);
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
