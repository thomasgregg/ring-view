import { devices, expect, test } from "@playwright/test";

// Trace DOM snapshots evaluate scripts with a simulated gesture, so this file
// uses page-originated proof and deliberately disables automatic tracing.
test.use({ trace: "off" });

test("recovers in a fresh web view before any automation-generated user activation", async ({ browser, page }, testInfo) => {
  await page.goto("/tests/fixtures/recovery.html");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  await expect(page.getByRole("button", { name: "Hold to talk" })).toBeEnabled();
  const restoredUrl = new URL(page.url());
  restoredUrl.searchParams.set("autoplay_probe", "1");
  for (const viewport of [{ width: 844, height: 390 }, { width: 390, height: 844 }]) {
    const isolatedContext = await browser.newContext({
      ...devices[testInfo.project.name === "phone" ? "iPhone 13" : "Desktop Chrome"], viewport,
    });
    try {
      const freshPage = await isolatedContext.newPage();
      const proofEvent = freshPage.waitForEvent("console", {
        predicate: (message) => message.text().startsWith("RING_VIEW_AUTOPLAY_PROOF "), timeout: 15_000,
      });
      await freshPage.goto(restoredUrl.href);
      // Do not evaluate, query locators, or inspect this page until the fixture
      // itself has observed real moving frames without a user gesture.
      const proof = JSON.parse((await proofEvent).text().slice("RING_VIEW_AUTOPLAY_PROOF ".length));
      await testInfo.attach(`gesture-free-${viewport.width}`, {
        body: JSON.stringify(proof, null, 2), contentType: "application/json",
      });
      expect(proof).toMatchObject({
        initialUserActivation: false, activationAtPlay: false, activationAfterFrames: false,
        muted: true, frames: 6, offers: 1, getUserMediaCalls: 0,
      });
      expect(proof.elapsed).toBeGreaterThan(0.3);
      await expect(freshPage.getByRole("button", { name: "Hold to talk" })).toBeEnabled();
      await expect(freshPage.getByRole("button", { name: "Resume live view" })).toHaveCount(0);
    } finally {
      await isolatedContext.close();
    }
  }
});
