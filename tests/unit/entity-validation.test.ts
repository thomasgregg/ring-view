import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../../src/config";
import type { HassEntity, HomeAssistant } from "../../src/types";
import {
  entityIsUnavailable,
  recordingHasMedia,
  supportsStream,
  validateEntities,
} from "../../src/utilities/entity-validation";

const entity = (id: string, attributes: HassEntity["attributes"] = {}): HassEntity => ({
  entity_id: id,
  state: "idle",
  attributes,
});

describe("entity validation", () => {
  it("detects stream capability without inspecting URLs", () => {
    expect(supportsStream(entity("camera.live", { supported_features: 2 }))).toBe(true);
    expect(supportsStream(entity("camera.recording", { supported_features: 0 }))).toBe(false);
    expect(recordingHasMedia(entity("camera.recording", { video_url: "secret" }))).toBe(true);
  });

  it("detects missing and unavailable entities", () => {
    expect(entityIsUnavailable(undefined)).toBe(true);
    expect(entityIsUnavailable({ ...entity("camera.one"), state: "unavailable" })).toBe(true);
  });

  it("returns capability warnings without including the recording URL", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    const hass: HomeAssistant = {
      states: {
        "camera.recording": entity("camera.recording", { video_url: "top-secret-url" }),
        "camera.live": entity("camera.live", { supported_features: 0 }),
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    const warnings = validateEntities(hass, config);
    expect(warnings.some((warning) => /does not advertise/.test(warning.message))).toBe(true);
    expect(JSON.stringify(warnings)).not.toContain("top-secret-url");
  });

  it("returns warnings in the active Home Assistant language", () => {
    const config = normalizeConfig({
      recording_entity: "camera.recording",
      live_entity: "camera.live",
    });
    const hass: HomeAssistant = {
      language: "de-AT",
      states: {
        "camera.recording": entity("camera.recording", {
          entity_picture: "/camera.jpg",
        }),
        "camera.live": entity("camera.live", { supported_features: 0 }),
      },
      hassUrl: (path = "") => path,
      callWS: async () => ({}) as never,
    };
    expect(
      validateEntities(hass, config).map((warning) => warning.message),
    ).toContain(
      "Die Live-Kamera meldet keine Unterstützung für Kamera-Streaming.",
    );
  });
});
