import { expect, test, type Locator } from "@playwright/test";

async function scrollCardTo(card: Locator, top: number): Promise<void> {
  await card.evaluate((element, targetTop) => {
    window.scrollBy(0, element.getBoundingClientRect().top - targetTop);
  }, top);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/demo/?dashboard=interactive&dashboard_start=live&live_platform=generic");
  await page.addStyleTag({ content: `
    body { --header-height: 64px; min-height: 200vh; padding-top: var(--header-height); }
    .topbar { position: fixed; inset: 0 0 auto; height: var(--header-height); z-index: 4; }
    .topbar button { position: absolute; inset: 0; width: 100%; }
  ` });
  await page.locator(".topbar").evaluate((bar) => {
    const tab = document.createElement("button");
    tab.textContent = "Dashboard tab";
    tab.setAttribute("aria-pressed", "false");
    tab.addEventListener("click", () => tab.setAttribute("aria-pressed", "true"));
    bar.replaceChildren(tab);
  });
});

test("keeps dashboard tabs clickable over the scrolled inline viewer", async ({ page }) => {
  const card = page.locator("ring-view");
  const expand = card.getByRole("button", { name: "Open fullscreen camera viewer" });
  const dashboardTab = page.getByRole("button", { name: "Dashboard tab" });
  await expect(expand).toBeVisible();
  await scrollCardTo(card, 0);

  const [controlBox, tabBox] = await Promise.all([
    expand.boundingBox(),
    dashboardTab.boundingBox(),
  ]);
  if (!controlBox || !tabBox) throw new Error("The dashboard and camera controls must be laid out");
  const x = controlBox.x + controlBox.width / 2;
  const y = controlBox.y + controlBox.height / 2;
  expect(y).toBeGreaterThan(tabBox.y);
  expect(y).toBeLessThan(tabBox.y + tabBox.height);

  await page.mouse.click(x, y);
  await expect(dashboardTab).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await scrollCardTo(card, 100);
  const recording = card.getByRole("tab", { name: "Last recording" });
  await recording.click();
  await expect(recording).toHaveAttribute("aria-selected", "true");
  await expand.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  expect(await page.evaluate(() => document.elementFromPoint(10, 10)?.localName))
    .toBe("ring-view-dialog");
  await dialog.getByRole("button", { name: "Close camera viewer" }).click();
  await expect(expand).toBeVisible();
});

test("reveals inline controls focused by keyboard below the fixed dashboard tabs", async ({
  page,
  browserName,
}) => {
  const card = page.locator("ring-view");
  const expand = card.getByRole("button", { name: "Open fullscreen camera viewer" });
  const live = card.getByRole("tab", { name: "Live" });
  const dashboardTab = page.getByRole("button", { name: "Dashboard tab" });
  await expect(expand).toBeVisible();
  const tabBox = await dashboardTab.boundingBox();
  if (!tabBox) throw new Error("The dashboard tab must be laid out");
  const barBottom = tabBox.y + tabBox.height;
  // WebKit on macOS uses Option+Tab to include buttons in keyboard navigation.
  const tabKey = browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab";

  await dashboardTab.focus();
  for (const control of [expand, live]) {
    await scrollCardTo(card, 0);
    const controlBox = await control.boundingBox();
    if (!controlBox) throw new Error("The camera control must be laid out");
    expect(controlBox.y + controlBox.height).toBeLessThanOrEqual(barBottom);

    await page.keyboard.press(tabKey);
    await expect(control).toBeFocused();
    await expect.poll(async () => (await control.boundingBox())?.y ?? -1)
      .toBeGreaterThanOrEqual(barBottom);
  }
});

test("suspends Live when a short card scrolls beyond the viewport and resumes on return", async ({
  page,
}) => {
  await page.addStyleTag({ content: ".topbar { height: 160px; } ring-view { height: 120px; }" });
  const card = page.locator("ring-view");
  const dashboardTab = page.getByRole("button", { name: "Dashboard tab" });
  const streamCount = () => page.evaluate(() => window.demoActiveStreams ?? 0);
  await expect.poll(streamCount).toBe(1);
  await scrollCardTo(card, 8);

  const [cardBox, tabBox] = await Promise.all([
    card.boundingBox(),
    dashboardTab.boundingBox(),
  ]);
  if (!cardBox || !tabBox) throw new Error("The short card and dashboard tab must be laid out");
  expect(cardBox.y).toBeGreaterThanOrEqual(tabBox.y);
  expect(cardBox.y + cardBox.height).toBeLessThan(tabBox.y + tabBox.height);
  // A fixed bar can cover the card while it still intersects the viewport.
  expect(await streamCount()).toBe(1);

  await scrollCardTo(card, -cardBox.height - 8);
  await expect.poll(streamCount).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(streamCount).toBe(1);
});
