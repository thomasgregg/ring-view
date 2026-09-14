import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const blueprint = readFileSync(
  resolve(
    process.cwd(),
    "blueprints/automation/ring_view/doorbell_notification.yaml",
  ),
  "utf8",
);

describe("doorbell notification blueprint", () => {
  it("keeps authenticated camera previews as the default", () => {
    expect(blueprint).toContain("notification_image_base_url:");
    expect(blueprint).toContain('default: ""');
    expect(blueprint).toContain("/api/camera_proxy/{{ preview_camera_id }}");
  });

  it("supports an opt-in absolute public snapshot for iOS thumbnails", () => {
    expect(blueprint).toContain("/config/www/ring-view-");
    expect(blueprint).toContain("action: camera.snapshot");
    expect(blueprint).toContain("{{ base.rstrip('/') }}/local/ring-view-");
    expect(blueprint).toMatch(
      /publicly\s+accessible to anyone who knows its URL/,
    );
  });

  it("adds two-stage Ring View notification actions", () => {
    expect(blueprint).toContain("viewer_live_camera:");
    expect(blueprint).toContain("viewer_recording_source:");
    expect(blueprint).toContain("ring-view-mode=live");
    expect(blueprint).toContain("ring-view-mode=last_recording");
    expect(blueprint).toContain("title: View Live");
    expect(blueprint).toContain("message: Recording ready");
    expect(blueprint).toContain("title: Watch Recording");
  });

  it("requires viewer sources and has no dashboard-only fallback", () => {
    const viewerInputs = blueprint.slice(
      blueprint.indexOf("viewer_live_camera:"),
      blueprint.indexOf("notification_image_base_url:"),
    );
    expect(viewerInputs).not.toContain("default:");
    expect(blueprint).not.toContain("viewer_actions_enabled");
    expect(blueprint).not.toContain("Tap to open Ring View");
    expect(blueprint).not.toContain("dashboard fallback");
  });
});
