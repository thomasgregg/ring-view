import { expect, test } from "@playwright/test";
import { mdiDoorClosed, mdiDoorOpen } from "@mdi/js";
import type { HomeAssistant, RingViewConfig } from "../../src/types";

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
    initial: [
      { name: "dashboard_behavior", required: true },
      { name: "preview_source", required: true },
    ],
    snapshot: [
      { name: "dashboard_behavior", required: true },
      { name: "preview_source", required: true },
      { name: "snapshot_entity", required: true },
    ],
    newest: [
      { name: "dashboard_behavior", required: true },
      { name: "preview_source", required: true },
      { name: "snapshot_entity", required: true },
      { name: "preview_fallback", required: true },
    ],
  });
});

test("places the optional last activity source beside the name appearance controls", async ({
  page,
}) => {
  await expect(page.locator("ring-view")).toBeAttached();
  const appearance = await page.evaluate(async () => {
    type FormSchema = {
      name: string;
      schema?: FormSchema[];
      selector?: Record<string, unknown>;
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
      computeLabel: (schema: FormSchema) => string;
      computeHelper: (schema: FormSchema) => string;
    };
    const section = form.schema.find((field) => field.name === "card_appearance");
    const activity = section?.schema?.find(
      (field) => field.name === "last_activity_entity",
    );
    return {
      fields: section?.schema?.map((field) => field.name),
      selector: activity?.selector,
      label: activity ? form.computeLabel(activity) : undefined,
      helper: activity ? form.computeHelper(activity) : undefined,
    };
  });

  expect(appearance).toEqual({
    fields: ["name", "show_name", "last_activity_entity", ""],
    selector: {
      entity: {
        filter: [
          { domain: "sensor" },
          { domain: "event" },
          { domain: "input_datetime" },
          { domain: "binary_sensor" },
        ],
      },
    },
    label: "Last activity timestamp (optional)",
    helper:
      "Shows relative time at the top left, below the camera name when it is visible. Choose a timestamp sensor, event entity, Date and/or time helper, or a Ring-MQTT Ding or motion sensor.",
  });
});

test("keeps an interactive dashboard idle until the user chooses media", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&door=1&dashboard_door=1&live_platform=generic",
  );

  await expect(page.getByRole("region", { name: "Camera view" })).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("tab", { name: "Last recording" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tab", { name: "Live" })).toHaveAttribute(
    "aria-selected",
    "false",
  );
  await expect(page.getByRole("button", { name: "Play last recording" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play last recording" })).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  await expect(page.locator("ring-view ring-view-dialog .play-recording")).toHaveCount(0);
  expect(await page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(0);

  const mediaFrame = page.locator("ring-view ring-view-dialog .media-frame");
  const frameBox = await mediaFrame.boundingBox();
  if (!frameBox) throw new Error("Inline media surface was not visible");
  await page.mouse.click(frameBox.x + 18, frameBox.y + frameBox.height - 18);
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(1);
  await expect(page.getByRole("tab", { name: "Last recording" })).toHaveAttribute(
    "aria-selected",
    "true",
  );

  await page.getByRole("tab", { name: "Live" }).click();
  const door = page.getByRole("button", {
    name: "Unlock available after live video connects",
  });
  await expect(door).toBeVisible();
  await expect(door).toBeDisabled();
  await expect(door).toContainText("Unlock when ready");
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Hold to unlock" })).toBeEnabled();
});

test("shows one snapshot action only after Live starts", async ({ page }) => {
  await page.goto(
    "/demo/?dashboard=interactive&snapshot_button=1&live_platform=generic&door=1&dashboard_door=1",
  );

  await expect(page.getByRole("button", { name: "Take snapshot" })).toHaveCount(0);
  await page.getByRole("tab", { name: "Live" }).click();
  const snapshot = page.getByRole("button", { name: "Take snapshot" });
  await expect(snapshot).toBeVisible();
  await snapshot.click();
  await expect(page.getByRole("button", { name: "Snapshot saved" })).toBeVisible();
  await expect(page.locator(".snapshot-error-layer")).toHaveCount(0);

  await page.locator("ring-view").evaluate((element) => {
    const card = element as HTMLElement & {
      hass?: {
        callService?: (domain: string, service: string) => Promise<void>;
      };
    };
    if (!card.hass) throw new Error("Demo Home Assistant object unavailable");
    card.hass.callService = async (domain, service) => {
      if (domain === "button" && service === "press") {
        window.demoRefreshSnapshot();
        return;
      }
      throw new Error("Cannot write image to file");
    };
  });
  await page.getByRole("button", { name: "Open fullscreen camera viewer" }).click();
  await page.locator("ring-view-dialog .snapshot-action").click();
  const feedback = page.locator("ring-view-dialog .snapshot-error-layer .state-card");
  const mediaFrame = page.locator("ring-view-dialog .media-frame");
  const visitorDock = page.locator("ring-view-dialog .visitor-action-dock");
  await expect(feedback).toHaveText(
    "Home Assistant cannot write to the snapshot folder.",
  );
  await expect(visitorDock).toBeVisible();
  const [feedbackBox, frameBox, visitorBox] = await Promise.all([
    feedback.boundingBox(),
    mediaFrame.boundingBox(),
    visitorDock.boundingBox(),
  ]);
  if (!feedbackBox || !frameBox || !visitorBox) {
    throw new Error("Snapshot feedback geometry unavailable");
  }
  expect(
    Math.abs(
      feedbackBox.x + feedbackBox.width / 2
      - (frameBox.x + frameBox.width / 2),
    ),
  ).toBeLessThan(2);
  expect(
    Math.abs(
      feedbackBox.y + feedbackBox.height / 2
      - (frameBox.y + frameBox.height / 2),
    ),
  ).toBeLessThan(2);
  expect(feedbackBox.y + feedbackBox.height).toBeLessThan(visitorBox.y);

  const calls = await page.evaluate(() => window.demoDoorCalls ?? []);
  expect(calls).toHaveLength(2);
  expect(calls[0]).toMatchObject({
    domain: "button",
    service: "press",
    target: { entity_id: "button.device_take_snapshot" },
  });
  expect(calls[1]).toMatchObject({
    domain: "camera",
    service: "snapshot",
    target: { entity_id: "camera.device_snapshot" },
  });
  expect(calls[1]?.serviceData.filename).toMatch(
    /^\/media\/ring-view\/entrance_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}-\d{3}\.jpg$/,
  );

  await page.locator("ring-view-dialog").getByRole("tab", { name: "Last recording" }).click();
  await expect(page.getByRole("button", { name: /snapshot/i })).toHaveCount(0);
});

test("keeps viewer-only door access out of the dashboard", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live&door=1&live_platform=generic",
  );

  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
  await expect(page.locator("ring-view ring-view-dialog .door-action")).toHaveCount(0);
});

test("keeps the inline action dock consistently sized across card widths", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live&two_way_audio=1&door=1&dashboard_door=1&door_action=open",
  );

  const root = page.locator("#card-root");
  const dock = page.locator("ring-view ring-view-dialog .visitor-action-dock");
  const talk = dock.locator(".talk-action");
  await expect(dock).toBeVisible();

  const measureAt = async (width: number) => {
    await root.evaluate((element, value) => {
      (element as HTMLElement).style.width = `${value}px`;
    }, width);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    return talk.evaluate((element) => {
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      const icon = element.querySelector("svg")?.getBoundingClientRect();
      return {
        font: Number.parseFloat(style.fontSize),
        height: box.height,
        icon: icon?.width ?? 0,
      };
    });
  };

  const compact = await measureAt(360);
  const roomy = await measureAt(720);
  expect(compact.height).toBeGreaterThanOrEqual(44);
  expect(roomy.font).toBe(compact.font);
  expect(roomy.height).toBe(compact.height);
  expect(roomy.icon).toBe(compact.icon);

  const [cardBox, dockBox] = await Promise.all([
    page.locator("ring-view").boundingBox(),
    dock.boundingBox(),
  ]);
  if (!cardBox || !dockBox) throw new Error("Inline dock geometry unavailable");
  expect(dockBox.x).toBeGreaterThanOrEqual(cardBox.x);
  expect(dockBox.x + dockBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width);
});

test("keeps inline connection status clear of fixed visitor controls", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live&two_way_audio=1&door=1&dashboard_door=1&door_action=open&delay=8000",
  );

  const card = page.locator("ring-view");
  await card.evaluate((element) => {
    element.style.width = "420px";
    element.style.height = "180px";
  });

  const state = card.locator(".state-layer.with-visitor-controls .state-card");
  const dock = card.locator(".visitor-action-dock");
  const door = card.getByRole("button", {
    name: "Open door available after live video connects",
  });
  await expect(state).toBeVisible();
  await expect(dock).toBeVisible();
  await expect(door).toContainText("Open when ready");

  const [stateBox, dockBox] = await Promise.all([
    state.boundingBox(),
    dock.boundingBox(),
  ]);
  if (!stateBox || !dockBox) throw new Error("Inline loading geometry unavailable");

  expect(stateBox.y + stateBox.height).toBeLessThan(dockBox.y);
});

test("stops inline media before expanding and resumes it after fullscreen closes", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live&live_platform=generic",
  );
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(1);

  await page.getByRole("button", { name: "Open fullscreen camera viewer" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(1);
  expect(await page.evaluate(() => window.demoPeakStreams ?? 0)).toBe(1);

  await page.getByRole("button", { name: "Close camera viewer" }).click();
  await expect(page.getByRole("region", { name: "Camera view" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(1);
  expect(await page.evaluate(() => window.demoPeakStreams ?? 0)).toBe(1);
});

test("restores an interactive card immediately after its dashboard view reconnects", async ({
  page,
}) => {
  await page.goto("/demo/?dashboard=interactive&dashboard_start=recording");
  const inlineViewer = page.locator("ring-view ring-view-dialog[inline]");
  await expect(inlineViewer.getByRole("region", { name: "Camera view" })).toBeVisible();
  await expect(inlineViewer.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(1);

  await page.evaluate(() => {
    const viewState = window as Window & { detachedRingView?: HTMLElement };
    viewState.detachedRingView = document.querySelector("ring-view") ?? undefined;
    viewState.detachedRingView?.remove();
  });
  await expect.poll(() => page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(0);

  await page.evaluate(() => {
    const viewState = window as Window & { detachedRingView?: HTMLElement };
    const root = document.querySelector("#card-root");
    if (!root || !viewState.detachedRingView) throw new Error("Detached card unavailable");
    root.append(viewState.detachedRingView);
  });

  await expect(inlineViewer.getByRole("region", { name: "Camera view" })).toBeVisible({
    timeout: 1_000,
  });
  await expect(inlineViewer.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible({
    timeout: 1_000,
  });
  await expect.poll(
    () => page.evaluate(() => window.demoActiveStreams ?? 0),
    { timeout: 1_000 },
  ).toBe(1);
});

test("keeps one Live session when duplicate interactive cards share a camera", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&dashboard_start=live&live_platform=generic",
  );
  await expect(page.getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();

  await page.evaluate(() => {
    const first = document.querySelector("ring-view") as HTMLElement & {
      hass: HomeAssistant;
    };
    const root = document.querySelector<HTMLElement>("#card-root")!;
    root.style.display = "grid";
    root.style.gridTemplateColumns = "repeat(2, minmax(0, 1fr))";
    root.style.gap = "12px";
    const second = document.createElement("ring-view");
    second.setConfig({
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
      dashboard_behavior: "interactive",
      dashboard_start: "live",
    });
    second.hass = first.hass;
    root.append(second);
  });

  const cards = page.locator("ring-view");
  await expect(cards).toHaveCount(2);
  await expect(cards.nth(1).getByRole("button", { name: "Resume live view" })).toBeVisible();
  expect(await page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(1);
  expect(await page.evaluate(() => window.demoPeakStreams ?? 0)).toBe(1);

  await cards.nth(1).getByRole("button", { name: "Resume live view" }).click();
  await expect(cards.nth(0).getByRole("button", { name: "Resume live view" })).toBeVisible();
  await expect(cards.nth(1).getByRole("img", { name: "Synthetic demo camera media" })).toBeVisible();
  expect(await page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(1);
  expect(await page.evaluate(() => window.demoPeakStreams ?? 0)).toBe(1);
});

test("never connects or exposes actions in the Home Assistant edit preview", async ({
  page,
}) => {
  await expect(page.locator("ring-view")).toBeAttached();
  await page.evaluate(() => {
    const card = document.querySelector("ring-view") as HTMLElement & {
      preview: boolean;
      setConfig: (config: RingViewConfig) => void;
    };
    card.preview = true;
    card.setConfig({
      recording_entity: "camera.latest_recording",
      live_entity: "camera.live_view",
      dashboard_behavior: "interactive",
      dashboard_start: "live",
      two_way_audio: true,
      door_entity: "lock.front_door",
      door_control_location: "dashboard_and_viewer",
    });
  });

  await expect(page.locator("ring-view img")).toBeVisible();
  await expect(page.locator("ring-view ring-view-dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Open Entrance viewer/ })).toHaveCount(0);
  expect(await page.evaluate(() => window.demoActiveStreams ?? 0)).toBe(0);
  expect(await page.evaluate(() => window.demoDoorCalls ?? [])).toHaveLength(0);
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

test("shows only the Ring View loader while a direct recording is pending", async ({ page }) => {
  await page.route("**/pending-recording.mp4", async () => undefined);
  await page.goto("/demo/?recording_video=pending");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();

  const recording = page.locator("video.video-fallback.pending");
  await expect(recording).toBeAttached();
  await expect(recording).toHaveCSS("opacity", "0");
  await expect(page.locator(".state-layer .spinner")).toBeVisible();
  await expect(page.getByText("Loading last recording…")).toBeVisible();
});

test("dismisses idle direct-recording controls and resumes or replays from the video", async ({
  page,
}) => {
  await page.route("**/pending-recording.mp4", async () => undefined);
  await page.goto("/demo/?recording_video=pending");
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();

  const recording = page.locator("video.video-fallback");
  await recording.evaluate((element) => {
    const video = element as HTMLVideoElement;
    let currentTime = 0;
    Object.defineProperty(video, "currentTime", {
      configurable: true,
      get: () => currentTime,
      set: (value: number) => { currentTime = value; },
    });
    video.play = () => {
      video.dataset.playCount = String(Number(video.dataset.playCount ?? "0") + 1);
      video.dispatchEvent(new Event("play"));
      return Promise.resolve();
    };
    video.pause = () => video.dispatchEvent(new Event("pause"));
    video.dispatchEvent(new Event("canplay"));
  });
  await expect(recording).not.toHaveClass(/pending/);

  await recording.evaluate((element) => (element as HTMLVideoElement).pause());
  await expect.poll(
    () => recording.evaluate((element) => (element as HTMLVideoElement).controls),
    { timeout: 5_000 },
  ).toBe(false);
  await expect(recording).toHaveClass(/controls-hidden/);
  await expect(recording).toHaveAttribute("aria-label", "Play last recording");

  await recording.click({ position: { x: 30, y: 30 } });
  await expect.poll(
    () => recording.evaluate((element) => (element as HTMLVideoElement).controls),
  ).toBe(true);
  await expect(recording).toHaveAttribute("data-play-count", "2");

  await recording.evaluate((element) => {
    const video = element as HTMLVideoElement;
    video.currentTime = 24;
    video.dispatchEvent(new Event("ended"));
  });
  await expect.poll(
    () => recording.evaluate((element) => (element as HTMLVideoElement).controls),
    { timeout: 5_000 },
  ).toBe(false);
  await recording.focus();
  await page.keyboard.press("Space");
  await expect(recording).toHaveAttribute("data-play-count", "3");
  await expect.poll(
    () => recording.evaluate((element) => (element as HTMLVideoElement).currentTime),
  ).toBe(0);
  await expect.poll(
    () => recording.evaluate((element) => (element as HTMLVideoElement).controls),
  ).toBe(true);
});

test("merges Talk and door access into one divided action dock", async ({ page }) => {
  await page.goto(
    "/demo/?mode=live&two_way_audio=1&door=1&door_action=open",
  );
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();

  const dock = page.locator(".visitor-action-dock");
  const talk = dock.getByRole("button", { name: "Connecting…" });
  const door = dock.getByRole("button", { name: "Hold to open" });
  await expect(dock).toBeVisible();
  await expect(talk).toBeDisabled();
  await expect(door).toBeVisible();
  await expect(dock).toHaveCSS("padding-left", "6px");
  await expect(dock).toHaveCSS("padding-right", "6px");
  const divider = dock.locator(".visitor-action-divider");
  await expect(divider).toBeVisible();
  await expect(divider).toHaveCSS("margin-left", "6px");
  await expect(divider).toHaveCSS("margin-right", "6px");
  await expect(talk).toHaveCSS("border-top-left-radius", "999px");
  await expect(talk).toHaveCSS("border-top-right-radius", "0px");
  await expect(talk).toHaveCSS("border-bottom-right-radius", "0px");
  await expect(door).toHaveCSS("border-top-left-radius", "0px");
  await expect(door).toHaveCSS("border-bottom-left-radius", "0px");
  await expect(door).toHaveCSS("border-top-right-radius", "999px");

  const dockBox = await dock.boundingBox();
  const viewport = page.viewportSize();
  if (!dockBox || !viewport) throw new Error("Action dock geometry unavailable");
  expect(dockBox.x).toBeGreaterThanOrEqual(0);
  expect(dockBox.x + dockBox.width).toBeLessThanOrEqual(viewport.width);
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

test("shows door failures in the shared centered viewer message", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    "/demo/?mode=live&door=1&door_action=open&door_hold=0&live_platform=generic",
  );
  await page.getByRole("button", { name: /Open Entrance viewer/ }).click();
  const door = page.getByRole("button", { name: "Open door" });
  await expect(door).toBeEnabled();
  await page.locator("ring-view").evaluate((element) => {
    const card = element as HTMLElement & {
      hass?: { callService?: () => Promise<void> };
    };
    if (!card.hass) throw new Error("Demo Home Assistant object unavailable");
    card.hass.callService = async () => {
      throw new Error("service failed");
    };
  });

  await door.click();
  const feedback = page.locator(
    "ring-view-dialog .door-error-layer .state-card",
  );
  const mediaFrame = page.locator("ring-view-dialog .media-frame");
  const visitorDock = page.locator("ring-view-dialog .visitor-action-dock");
  await expect(feedback).toHaveText("Couldn’t open the door.");
  await expect(feedback.locator("xpath=..")).toHaveAttribute("role", "alert");

  const [feedbackBox, frameBox, visitorBox] = await Promise.all([
    feedback.boundingBox(),
    mediaFrame.boundingBox(),
    visitorDock.boundingBox(),
  ]);
  if (!feedbackBox || !frameBox || !visitorBox) {
    throw new Error("Door feedback geometry unavailable");
  }
  expect(
    Math.abs(
      feedbackBox.x + feedbackBox.width / 2
      - (frameBox.x + frameBox.width / 2),
    ),
  ).toBeLessThan(2);
  expect(
    Math.abs(
      feedbackBox.y + feedbackBox.height / 2
      - (frameBox.y + frameBox.height / 2),
    ),
  ).toBeLessThan(2);
  expect(feedbackBox.y + feedbackBox.height).toBeLessThan(visitorBox.y);
});

test("uses the shared centered viewer message for a Ding", async ({ page }) => {
  await page.goto(
    "/demo/?doorbell=1&dashboard=interactive&dashboard_start=recording"
      + "&door=1&door_visibility=all&dashboard_door=1&live_platform=generic",
  );
  await expect(page.locator("ring-view")).toBeAttached();
  await page.evaluate(() =>
    window.demoSetEntityState("binary_sensor.front_door_ding", "on"),
  );

  const alert = page.locator(
    "ring-view-dialog[inline] .doorbell-alert-layer .state-card",
  );
  const mediaFrame = page.locator("ring-view-dialog[inline] .media-frame");
  const visitorDock = page.locator("ring-view-dialog[inline] .visitor-action-dock");
  const openLive = alert.getByRole("button", { name: "Open live view" });
  await expect(alert).not.toContainText("Someone is at the door");
  await expect(openLive).toBeVisible();
  await expect(
    page.locator('ring-view-dialog[inline] .ring-indicator[aria-label="Someone is at the door"]'),
  ).toBeVisible();
  await expect(page.locator("ring-view-dialog .dialog-ring-alert")).toHaveCount(0);

  const [alertBox, frameBox, visitorBox] = await Promise.all([
    alert.boundingBox(),
    mediaFrame.boundingBox(),
    visitorDock.boundingBox(),
  ]);
  if (!alertBox || !frameBox || !visitorBox) {
    throw new Error("Doorbell alert geometry unavailable");
  }
  expect(
    Math.abs(
      alertBox.x + alertBox.width / 2
      - (frameBox.x + frameBox.width / 2),
    ),
  ).toBeLessThan(2);
  expect(
    Math.abs(
      alertBox.y + alertBox.height / 2
      - (frameBox.y + frameBox.height / 2),
    ),
  ).toBeLessThan(10);
  expect(alertBox.y + alertBox.height).toBeLessThan(visitorBox.y);

  await openLive.click();
  await expect(
    page.locator("ring-view-dialog[inline]").getByRole("tab", { name: "Live" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator("ring-view-dialog[inline] .doorbell-alert-layer")).toHaveCount(0);
  await expect(
    page.locator('ring-view-dialog[inline] .ring-indicator[aria-label="Someone is at the door"]'),
  ).toBeVisible();
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
  await expect(page.locator(".door-action"))
    .toHaveCSS("border-top-left-radius", "999px");
  await expect(page.locator(".door-action"))
    .toHaveCSS("border-top-right-radius", "999px");
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
  const cameraName = "Thomas Gregg Front Door Camera With A Long Name";
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    `/demo/?name=1&camera_name=${encodeURIComponent(cameraName)}`,
  );
  const root = page.locator("#card-root");
  await root.evaluate((element) => {
    element.style.width = "340px";
  });
  const card = page.locator("ring-view .preview");
  const name = page.locator("ring-view .name");
  await expect(name).toHaveText(cameraName);
  const cardBox = await card.boundingBox();
  const nameBox = await name.boundingBox();
  if (!cardBox || !nameBox) throw new Error("Card name geometry unavailable");
  expect((nameBox?.y ?? 0) - (cardBox?.y ?? 0)).toBeLessThan(32);
  expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(
    cardBox.x + cardBox.width - 12,
  );
  await expect(name).toHaveCSS("text-overflow", "ellipsis");

  await card.click();
  const heading = page.getByRole("heading", { name: cameraName });
  const modeSwitch = page.getByRole("tablist", { name: "Camera view" });
  const close = page.getByRole("button", { name: "Close camera viewer" });
  await expect(heading).toBeVisible();
  const [headingBox, modeBox, closeBox] = await Promise.all([
    heading.boundingBox(),
    modeSwitch.boundingBox(),
    close.boundingBox(),
  ]);
  if (!headingBox || !modeBox || !closeBox) {
    throw new Error("Viewer header geometry unavailable");
  }
  expect(headingBox.x + headingBox.width).toBeLessThanOrEqual(modeBox.x - 8);
  expect(modeBox.x + modeBox.width).toBeLessThanOrEqual(closeBox.x - 8);
  await expect(heading).toHaveCSS("font-size", "20px");
});

test("keeps a long inline camera name clear of header controls at every card width", async ({
  page,
}) => {
  const cameraName = "Thomas Gregg Front Door Camera With A Long Name";
  await page.goto(
    `/demo/?dashboard=interactive&name=1&camera_name=${encodeURIComponent(cameraName)}`,
  );

  const root = page.locator("#card-root");
  const card = page.locator("ring-view");
  const heading = card.getByRole("heading", { name: cameraName });
  const modeSwitch = card.getByRole("tablist", { name: "Camera view" });
  const expand = card.getByRole("button", {
    name: "Open fullscreen camera viewer",
  });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("font-size", "16px");
  await expect(heading).toHaveCSS("text-overflow", "ellipsis");

  for (const width of [320, 340, 360, 480, 720]) {
    await root.evaluate((element, value) => {
      element.style.width = `${value}px`;
    }, width);
    await page.evaluate(() => new Promise(requestAnimationFrame));

    const [cardBox, headingBox, modeBox, expandBox] = await Promise.all([
      card.boundingBox(),
      heading.boundingBox(),
      modeSwitch.boundingBox(),
      expand.boundingBox(),
    ]);
    if (!cardBox || !headingBox || !modeBox || !expandBox) {
      throw new Error(`Inline header geometry unavailable at ${width}px`);
    }

    expect(headingBox.x).toBeGreaterThanOrEqual(cardBox.x);
    expect(headingBox.x + headingBox.width).toBeLessThanOrEqual(modeBox.x - 8);
    expect(modeBox.x + modeBox.width).toBeLessThanOrEqual(expandBox.x - 8);
    expect(expandBox.x + expandBox.width).toBeLessThanOrEqual(
      cardBox.x + cardBox.width,
    );

    if (width <= 360) {
      const isTruncated = await heading.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      );
      expect(isTruncated).toBe(true);
    }
  }
});

test("shows accessible activity time below the name without overlapping controls", async ({
  page,
}) => {
  const cameraName = "Thomas Gregg Front Door Camera With A Long Name";
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    `/demo/?name=1&activity=1&activity_age=125&camera_name=${encodeURIComponent(cameraName)}`,
  );
  const root = page.locator("#card-root");
  await root.evaluate((element) => {
    element.style.width = "340px";
  });
  const preview = page.locator("ring-view .preview");
  const name = page.locator("ring-view .name");
  const activity = page.locator(
    "ring-view > ha-card ring-view-activity-time span",
  );
  await expect(activity).toHaveText(/2 min.*ago/i);
  await expect(activity).toHaveAttribute(
    "aria-label",
    "Last activity, 2 minutes ago",
  );
  await expect(activity).toHaveAttribute("title", /^Last activity: /);
  await expect(preview).toHaveAttribute(
    "aria-label",
    /Last activity, 2 minutes ago/,
  );
  const [previewBox, nameBox, activityBox] = await Promise.all([
    preview.boundingBox(),
    name.boundingBox(),
    activity.boundingBox(),
  ]);
  if (!previewBox || !nameBox || !activityBox) {
    throw new Error("Card activity geometry unavailable");
  }
  expect(nameBox.y + nameBox.height).toBeLessThanOrEqual(activityBox.y);
  expect(activityBox.x).toBe(nameBox.x);
  expect(activityBox.x + activityBox.width).toBeLessThanOrEqual(
    previewBox.x + previewBox.width - 12,
  );

  await preview.click();
  const dialog = page.locator("ring-view-dialog[open]:not([inline])");
  const heading = dialog.getByRole("heading", { name: cameraName });
  const dialogActivity = dialog.locator("ring-view-activity-time span");
  const modeSwitch = dialog.getByRole("tablist", { name: "Camera view" });
  const close = dialog.getByRole("button", { name: "Close camera viewer" });
  const [headingBox, dialogActivityBox, modeBox, closeBox] = await Promise.all([
    heading.boundingBox(),
    dialogActivity.boundingBox(),
    modeSwitch.boundingBox(),
    close.boundingBox(),
  ]);
  if (!headingBox || !dialogActivityBox || !modeBox || !closeBox) {
    throw new Error("Viewer activity geometry unavailable");
  }
  expect(headingBox.y + headingBox.height).toBeLessThanOrEqual(
    dialogActivityBox.y,
  );
  expect(dialogActivityBox.x + dialogActivityBox.width).toBeLessThanOrEqual(
    modeBox.x - 8,
  );
  expect(modeBox.x + modeBox.width).toBeLessThanOrEqual(closeBox.x - 8);
});

test("uses the top-left activity position when the camera name is hidden", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/demo/?activity=1&activity_age=125");
  const root = page.locator("#card-root");
  await root.evaluate((element) => {
    element.style.width = "320px";
  });
  const preview = page.locator("ring-view .preview");
  const activity = page.locator(
    "ring-view > ha-card ring-view-activity-time span",
  );
  await expect(page.locator("ring-view .name")).toHaveCount(0);
  await expect(activity).toBeVisible();
  const [previewBox, activityBox] = await Promise.all([
    preview.boundingBox(),
    activity.boundingBox(),
  ]);
  if (!previewBox || !activityBox) {
    throw new Error("Nameless card activity geometry unavailable");
  }
  expect(activityBox.x - previewBox.x).toBe(16);
  expect(activityBox.y - previewBox.y).toBe(12);

  await preview.click();
  const dialog = page.locator("ring-view-dialog[open]:not([inline])");
  const dialogActivity = dialog.locator("ring-view-activity-time span");
  const modeSwitch = dialog.getByRole("tablist", { name: "Camera view" });
  await expect(dialog.locator("h2")).toHaveCount(0);
  await expect(dialogActivity).toHaveCSS("font-size", "13px");
  const [dialogBox, dialogActivityBox, modeBox] = await Promise.all([
    dialog.locator(".dialog").boundingBox(),
    dialogActivity.boundingBox(),
    modeSwitch.boundingBox(),
  ]);
  if (!dialogBox || !dialogActivityBox || !modeBox) {
    throw new Error("Nameless viewer activity geometry unavailable");
  }
  expect(dialogActivityBox.x).toBeGreaterThanOrEqual(dialogBox.x + 16);
  expect(dialogActivityBox.x + dialogActivityBox.width).toBeLessThanOrEqual(
    modeBox.x - 8,
  );
});

test("keeps name, activity, modes, and fullscreen action separate at responsive widths", async ({
  page,
}) => {
  const cameraName = "Thomas Gregg Front Door Camera With A Long Name";
  await page.goto(
    `/demo/?dashboard=interactive&dashboard_start=live&snapshot_button=1&name=1&activity=1&activity_age=9000&camera_name=${encodeURIComponent(cameraName)}`,
  );
  const root = page.locator("#card-root");
  const card = page.locator("ring-view");
  const heading = card.getByRole("heading", { name: cameraName });
  const activity = card.locator("ring-view-activity-time span");
  const modeSwitch = card.getByRole("tablist", { name: "Camera view" });
  const expand = card.getByRole("button", {
    name: "Open fullscreen camera viewer",
  });
  const snapshot = card.getByRole("button", { name: "Take snapshot" });
  await expect(activity).toHaveText(/2 hr.*ago/i);
  await expect(activity).toHaveCSS("font-size", "12px");

  for (const width of [320, 340, 360, 480, 720]) {
    await root.evaluate((element, value) => {
      element.style.width = `${value}px`;
    }, width);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const [cardBox, headingBox, activityBox, modeBox, snapshotBox, expandBox] =
      await Promise.all([
        card.boundingBox(),
        heading.boundingBox(),
        activity.boundingBox(),
        modeSwitch.boundingBox(),
        snapshot.boundingBox(),
        expand.boundingBox(),
      ]);
    if (
      !cardBox
      || !headingBox
      || !activityBox
      || !modeBox
      || !snapshotBox
      || !expandBox
    ) {
      throw new Error(`Responsive activity geometry unavailable at ${width}px`);
    }
    expect(headingBox.y + headingBox.height).toBeLessThanOrEqual(activityBox.y);
    expect(headingBox.x + headingBox.width).toBeLessThanOrEqual(modeBox.x - 8);
    expect(activityBox.x + activityBox.width).toBeLessThanOrEqual(modeBox.x - 8);
    expect(modeBox.x + modeBox.width).toBeLessThanOrEqual(snapshotBox.x - 2);
    expect(snapshotBox.x + snapshotBox.width).toBeLessThanOrEqual(expandBox.x - 2);
    expect(expandBox.x + expandBox.width).toBeLessThanOrEqual(
      cardBox.x + cardBox.width,
    );
  }
});

test("hides invalid activity values and reacts when the entity becomes valid", async ({
  page,
}) => {
  await page.goto(
    `/demo/?activity=1&activity_value=${encodeURIComponent("not a timestamp")}`,
  );
  const preview = page.locator("ring-view .preview");
  const activity = page.locator(
    "ring-view > ha-card ring-view-activity-time span",
  );
  await expect(activity).toHaveCount(0);
  await expect(preview).not.toHaveAttribute("aria-label", /Last activity/);

  const unixSeconds = String(Math.floor(Date.now() / 1_000) - 125);
  await page.evaluate(
    (value) => window.demoSetEntityState("sensor.front_door_last_activity", value),
    unixSeconds,
  );
  await expect(activity).toHaveText(/2 min.*ago/i);
  await expect(preview).toHaveAttribute("aria-label", /Last activity/);

  await page.evaluate(() =>
    window.demoSetEntityState("sensor.front_door_last_activity", "unavailable"),
  );
  await expect(activity).toHaveCount(0);
  await expect(preview).not.toHaveAttribute("aria-label", /Last activity/);
});

test("localizes activity text without letting a longer format reach the controls", async ({
  page,
}) => {
  await page.goto(
    "/demo/?dashboard=interactive&activity=1&activity_age=9000&lang=de-DE",
  );
  const root = page.locator("#card-root");
  await root.evaluate((element) => {
    element.style.width = "320px";
  });
  const card = page.locator("ring-view");
  const activity = card.locator("ring-view-activity-time span");
  const modes = card.getByRole("tablist", { name: "Kameraansicht" });
  await expect(activity).toHaveText(/vor 2 Std/i);
  await expect(activity).toHaveAttribute(
    "aria-label",
    "Letzte Aktivität, vor 2 Stunden",
  );
  await expect(activity).toHaveAttribute("title", /^Letzte Aktivität: /);
  const [activityBox, modeBox] = await Promise.all([
    activity.boundingBox(),
    modes.boundingBox(),
  ]);
  if (!activityBox || !modeBox) {
    throw new Error("Localized activity geometry unavailable");
  }
  expect(activityBox.x + activityBox.width).toBeLessThanOrEqual(modeBox.x - 8);
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
  const startSurface = page.getByRole("button", { name: "Play last recording" });
  await expect(startSurface).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(startSurface).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(page.locator("ring-view-dialog .play-recording")).toHaveCount(0);
  await expect
    .poll(() => page.evaluate(() => window.demoActiveStreams ?? 0))
    .toBe(0);
  await startSurface.click({ position: { x: 30, y: 30 } });
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
