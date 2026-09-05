import de from "./translations/de.json";
import en from "./translations/en.json";
import type { HomeAssistant } from "./types";

export type TranslationKey = keyof typeof en;
export type TranslationValues = Record<string, string | number>;
type TranslationDictionary = Record<TranslationKey, string>;
type SupportedLanguage = "de" | "en";

const translations: Record<SupportedLanguage, TranslationDictionary> = {
  de,
  en,
};

function detectedLanguage(hass?: HomeAssistant): string {
  const documentLanguage =
    typeof document === "undefined" ? undefined : document.documentElement.lang;
  const browserLanguage =
    typeof navigator === "undefined" ? undefined : navigator.language;
  return (
    hass?.language ||
    hass?.locale?.language ||
    documentLanguage ||
    browserLanguage ||
    "en"
  );
}

export function languageCode(hass?: HomeAssistant): SupportedLanguage {
  return detectedLanguage(hass).trim().toLowerCase().split(/[-_]/)[0] === "de"
    ? "de"
    : "en";
}

export function localize(
  hass: HomeAssistant | undefined,
  key: TranslationKey,
  values: TranslationValues = {},
): string {
  const template = translations[languageCode(hass)][key] ?? translations.en[key];
  return template.replace(/\{([a-z_]+)\}/gi, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}

export function localizeHaOrFallback(
  hass: HomeAssistant | undefined,
  homeAssistantKey: string,
  fallbackKey: TranslationKey,
): string {
  return hass?.localize?.(homeAssistantKey) || localize(hass, fallbackKey);
}
