import { expect, test, type Page } from "@playwright/test";

const videoSelector = "ring-view-ring-webrtc-player video";

async function expectMovingVideo(page: Page): Promise<void> {
  const video = page.locator(videoSelector);
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => ({
    playing: !element.paused,
    width: element.videoWidth,
    ready: element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA,
  }))).toEqual({ playing: true, width: 320, ready: true });
  const initialTime = await video.evaluate((element: HTMLVideoElement) => element.currentTime);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.currentTime))
    .toBeGreaterThan(initialTime + 0.3);
  const initialFrames = await video.evaluate((element: HTMLVideoElement) => element.getVideoPlaybackQuality().totalVideoFrames);
  await expect.poll(() => video.evaluate((element: HTMLVideoElement) => element.getVideoPlaybackQuality().totalVideoFrames))
    .toBeGreaterThan(initialFrames + 2);
  await expect(page.getByRole("button", { name: "Hold to talk" })).toBeEnabled();
  expect(await page.evaluate(() => window.recovery.state.errors)).toEqual([]);
}

test.beforeEach(async ({ page }) => {
  await page.goto("/tests/fixtures/recovery.html");
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach("media-diagnostics", {
      body: JSON.stringify(await page.evaluate(() => window.recovery.diagnostics()), null, 2),
      contentType: "application/json",
    });
  }
});

test("preserves a playing WebRTC peer when a responsive layout recreates its card", async ({ page }) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expectMovingVideo(page);
  const originalPlayer = await page.locator("ring-view-ring-webrtc-player").elementHandle();
  await page.setViewportSize({ width: 844, height: 390 });
  await page.evaluate(() => window.recovery.recreateCard());
  await expectMovingVideo(page);
  expect(await originalPlayer?.evaluate((element) => element.isConnected)).toBe(true);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
  expect(await page.evaluate(() => window.recovery.state.closed)).toBe(0);
});

test("automatically restores moving muted video in both orientations without a tap", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expectMovingVideo(page);

  for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.reload();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute("aria-selected", "true");
    await expectMovingVideo(page);
    expect(await page.locator(videoSelector).evaluate((element: HTMLVideoElement) => element.muted)).toBe(true);
    expect(await page.evaluate(() => window.recovery.state.getUserMediaCalls)).toBe(0);
    await expect(page.getByRole("button", { name: "Resume live view" })).toHaveCount(0);
    expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
    expect(await page.evaluate(() => window.recovery.state.active)).toBe(1);
    await expect(page.getByText("Live view could not be started.")).toHaveCount(0);
  }

  await page.getByRole("button", { name: "Close camera viewer" }).click();
  await expect.poll(() => page.evaluate(() => window.recovery.state.active)).toBe(0);
  await expect(page).not.toHaveURL(/ring-view-mode/);
  await page.reload();
  await expect(page.getByRole("button", { name: /Open Entrance viewer/ })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("automatically resumes after a page-cache return without restoring a talk press", async ({ page }) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expectMovingVideo(page);
  await page.getByRole("button", { name: "Hold to talk" }).focus();
  await page.keyboard.down("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
  await expect(page.getByRole("button", { name: "Resume live view" })).toBeVisible();
  expect(await page.evaluate(() => window.recovery.microphone)).toEqual({ enabled: false, readyState: "ended" });
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
  await expectMovingVideo(page);
  expect(await page.evaluate(() => window.recovery.state.getUserMediaCalls)).toBe(1);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(2);
  await page.keyboard.up("Space");
  await page.getByRole("button", { name: "Hold to talk" }).focus();
  await page.keyboard.down("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(true);
  await page.keyboard.up("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(false);
});

test("falls back to one centered Resume when automatic recovery is blocked by iOS", async ({ page }, testInfo) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expectMovingVideo(page);
  for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => {
      const url = new URL(location.href);
      url.searchParams.set("block_playback", "1");
      history.replaceState(history.state, "", url);
    });
    await page.reload();
    const resume = page.getByRole("button", { name: "Resume live view" });
    await expect(resume).toBeVisible();
    expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
    expect(await page.evaluate(() => window.recovery.state.closed)).toBe(0);
    await expect(page.getByRole("button", { name: "Hold to talk" })).toHaveCount(0);
    await expect(page.locator("ring-view-dialog .state-layer")).toHaveCount(0);
    const box = await resume.boundingBox();
    expect(Math.abs(box!.x + box!.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(Math.abs(box!.y + box!.height / 2 - viewport.height / 2)).toBeLessThan(2);
    await page.screenshot({ path: testInfo.outputPath(`resume-${viewport.width}.png`) });
    await resume.click();
    await expectMovingVideo(page);
    expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
    expect(await page.evaluate(() => window.recovery.state.closed)).toBe(0);
  }
});

test("lets a manual Resume recover after the automatic connection fails", async ({ page }) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expectMovingVideo(page);
  await page.evaluate(() => {
    const url = new URL(location.href);
    url.searchParams.set("fail_first_offer", "1");
    history.replaceState(history.state, "", url);
  });
  await page.reload();
  await expect(page.getByRole("button", { name: "Resume live view" })).toBeVisible();
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
  await expect(page.locator("ring-view-ring-webrtc-player")).toHaveCount(0);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page.getByRole("button", { name: "Resume live view" }).click();
  await expectMovingVideo(page);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(2);
  expect(await page.evaluate(() => window.recovery.state.active)).toBe(1);
});

test("does not replay a stale offer on websocket reconnect and releases active talkback", async ({ page }) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expectMovingVideo(page);
  const talk = page.getByRole("button", { name: "Hold to talk" });
  await talk.focus();
  await page.keyboard.down("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(true);
  await page.evaluate(() => window.recovery.disconnect());
  expect(await page.evaluate(() => window.recovery.state.disconnectNotifications)).toBe(1);
  await page.keyboard.up("Space");
  await expect(page.getByRole("button", { name: "Resume live view" })).toBeVisible();
  expect(await page.evaluate(() => window.recovery.microphone)).toEqual({ enabled: false, readyState: "ended" });
  await page.evaluate(() => window.recovery.reconnect());
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
  await page.getByRole("button", { name: "Resume live view" }).click();
  await expectMovingVideo(page);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(2);
  // The old hold cannot reactivate the microphone in the new player.
  expect(await page.evaluate(() => window.recovery.state.getUserMediaCalls)).toBe(1);
  await talk.focus();
  await page.keyboard.down("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(true);
  await page.keyboard.up("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(false);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(2);
});

test("keeps a connected stream when autoplay is blocked and plays the same peer on tap", async ({ page }) => {
  await page.goto("/tests/fixtures/recovery.html?block_playback=1");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  const resume = page.getByRole("button", { name: "Resume live view" });
  await expect(resume).toBeVisible();
  expect(await page.evaluate(() => window.recovery.state.blockedPlayCalls)).toBe(2);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
  expect(await page.evaluate(() => window.recovery.state.closed)).toBe(0);
  await expect(page.getByRole("button", { name: "Hold to talk" })).toHaveCount(0);
  await expect(page.locator("ring-view-dialog .state-layer")).toHaveCount(0);
  // Shift-Tab must reach the Play control inside the player's shadow root.
  await page.getByRole("button", { name: "Close camera viewer" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(resume).toBeFocused();
  await page.keyboard.press("Enter");
  await expectMovingVideo(page);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(1);
  expect(await page.evaluate(() => window.recovery.state.closed)).toBe(0);
});

test("offers Retry during stalled cleanup and keeps the replacement stream healthy", async ({ page }) => {
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expectMovingVideo(page);
  await page.reload();
  await expectMovingVideo(page);
  const talk = page.getByRole("button", { name: "Hold to talk" });
  await talk.focus();
  await page.keyboard.down("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(true);

  await page.evaluate(() => window.recovery.failWithStalledCleanup());
  await page.keyboard.up("Space");
  await expect(page.getByRole("button", { name: "Retry", exact: true })).toBeVisible();
  expect(await page.evaluate(() => window.recovery.microphone)).toEqual({ enabled: false, readyState: "ended" });
  expect(await page.evaluate(() => window.recovery.state.cleanupPending)).toBe(true);
  await expect(talk).toHaveCount(0);
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expectMovingVideo(page);
  const replacement = await page.locator("ring-view-ring-webrtc-player").elementHandle();
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(2);
  expect(await page.evaluate(() => window.recovery.state.getUserMediaCalls)).toBe(1);

  await page.evaluate(() => window.recovery.finishCleanup());
  await expectMovingVideo(page);
  expect(await replacement!.evaluate((element) => element.isConnected)).toBe(true);
  expect(await page.evaluate(() => window.recovery.state.cleanupPending)).toBe(false);
  expect(await page.evaluate(() => window.recovery.state.offers)).toBe(2);
  await expect(page.getByRole("alert")).toHaveCount(0);
  await talk.focus();
  await page.keyboard.down("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(true);
  await page.keyboard.up("Space");
  await expect.poll(() => page.evaluate(() => window.recovery.microphone?.enabled)).toBe(false);
});
