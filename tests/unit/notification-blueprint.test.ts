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
});
