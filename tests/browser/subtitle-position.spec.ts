import { expect, test } from "@playwright/test";

for (const inline of [true, false]) {
  test(`camera title stays pixel-identical across subtitle states (${inline ? "inline" : "fullscreen"})`, async ({ page }) => {
    await page.goto(`/demo/?name=1&activity=1&delay=60000${inline ? "&dashboard=interactive" : ""}`);
    if (!inline) await page.locator("ring-view .preview").click();
    const dialog = page.locator(inline ? "ring-view ring-view-dialog[inline]" : "ring-view-dialog[open]");
    await expect(dialog.locator("h2")).toBeVisible();
    // Isolate title pixels from changing camera imagery behind the overlay.
    await dialog.locator("h2").evaluate((element) => { (element as HTMLElement).style.background = "#222"; });
    const measure = () => dialog.evaluate((element) => {
      const root = element.shadowRoot!;
      const title = root.querySelector("h2")!.getBoundingClientRect();
      const slot = root.querySelector(".subtitle-slot")!.getBoundingClientRect();
      return { x: title.x, y: title.y, height: title.height, subtitleHeight: slot.height };
    });
    const recording = await measure();
    const subtitleMetrics = () => dialog.evaluate((element) => {
      const root = element.shadowRoot!;
      const title = root.querySelector("h2")!.getBoundingClientRect();
      const text = root.querySelector(".live-subtitle")
        ?? root.querySelector("ring-view-activity-time")!.shadowRoot!.querySelector("span")!;
      const range = document.createRange();
      range.selectNodeContents(text);
      const box = range.getBoundingClientRect();
      const style = getComputedStyle(text);
      return { gap: box.y - title.bottom, height: box.height, fontSize: style.fontSize, lineHeight: style.lineHeight, fontFamily: style.fontFamily, fontWeight: style.fontWeight };
    });
    const recordingSubtitle = await subtitleMetrics();
    const titlePixels = async () => {
      // Subtitle shadows are changing content, not title movement. Preserve
      // their layout while hiding them for the isolated title raster check.
      await dialog.locator(".subtitle-slot").evaluate((element) => { (element as HTMLElement).style.visibility = "hidden"; });
      const pixels = await page.screenshot({ clip: { x: recording.x, y: recording.y, width: 80, height: recording.height }, animations: "disabled" });
      await dialog.locator(".subtitle-slot").evaluate((element) => { (element as HTMLElement).style.visibility = ""; });
      return pixels;
    };
    const recordingPixels = await titlePixels();
    await dialog.getByRole("tab", { name: "Live", exact: true }).click();
    await expect(dialog.locator(".live-subtitle")).toHaveCount(0);
    const connecting = await measure();
    const connectingPixels = await titlePixels();
    await dialog.evaluate(async (element) => {
      const viewer = element as HTMLElement & { mediaStatus: string; updateComplete: Promise<unknown> };
      viewer.mediaStatus = "ready";
      await viewer.updateComplete;
    });
    await expect(dialog.locator(".live-subtitle")).toHaveText("Live");
    const live = await measure();
    const liveSubtitle = await subtitleMetrics();
    const livePixels = await titlePixels();
    console.log(JSON.stringify({ inline, recording, connecting, live }));
    expect(connecting).toEqual(recording);
    expect(live).toEqual(recording);
    expect(liveSubtitle).toEqual(recordingSubtitle);
    expect(connectingPixels.equals(recordingPixels)).toBe(true);
    expect(livePixels.equals(recordingPixels)).toBe(true);
  });
}
