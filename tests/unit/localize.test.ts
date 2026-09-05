import { describe, expect, it } from "vitest";
import { languageCode, localize } from "../../src/localize";
import type { HomeAssistant } from "../../src/types";

function hass(language: string): HomeAssistant {
  return {
    language,
    states: {},
    hassUrl: (path = "") => path,
    callWS: async () => ({}) as never,
  };
}

describe("localization", () => {
  it("normalizes German BCP 47 locales", () => {
    expect(languageCode(hass("de-DE"))).toBe("de");
    expect(languageCode(hass("de_CH"))).toBe("de");
  });

  it("falls back to English for unsupported languages", () => {
    expect(languageCode(hass("fr-FR"))).toBe("en");
    expect(localize(hass("fr-FR"), "common.last_recording")).toBe(
      "Last recording",
    );
  });

  it("interpolates translated values", () => {
    expect(
      localize(hass("de-DE"), "card.open_viewer", {
        name: "Eingang",
        mode: "Letzte Aufnahme",
      }),
    ).toBe("Kameraansicht „Eingang“ öffnen — Letzte Aufnahme");
  });
});
