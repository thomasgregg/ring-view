import type { HassEntity, HomeAssistant } from "../types";

const SIGNED_PATH_CACHE_MS = 9_000;

interface SignedPathResponse {
  path: string;
}

interface CachedSignedPath {
  expiresAt: number;
  promise: Promise<string>;
}

const signedPathCache = new WeakMap<
  HomeAssistant,
  Map<string, CachedSignedPath>
>();

export function posterUrl(
  hass: HomeAssistant,
  entity: HassEntity | undefined,
  entityId: string,
): string {
  const picture = entity?.attributes.entity_picture;
  if (typeof picture === "string" && picture.length > 0) {
    return hass.hassUrl(picture);
  }
  return hass.hassUrl(`/api/camera_proxy/${encodeURIComponent(entityId)}`);
}

/**
 * Match Home Assistant's still-camera preview path: obtain a short-lived signed
 * camera-proxy URL and ask the backend for the rendered size the card needs.
 * The signed URL is retained in memory for only the same short window used by
 * Home Assistant's frontend and is never written to configuration or storage.
 */
export async function sizedPosterUrl(
  hass: HomeAssistant,
  entityId: string,
  width: number,
  height: number,
): Promise<string> {
  const signedUrl = await signedCameraProxyUrl(hass, entityId);
  const separator = signedUrl.includes("?") ? "&" : "?";
  return `${signedUrl}${separator}width=${positiveInteger(width)}&height=${positiveInteger(height)}`;
}

function positiveInteger(value: number): number {
  return Math.max(1, Math.ceil(Number.isFinite(value) ? value : 1));
}

async function signedCameraProxyUrl(
  hass: HomeAssistant,
  entityId: string,
): Promise<string> {
  let cache = signedPathCache.get(hass);
  if (!cache) {
    cache = new Map();
    signedPathCache.set(hass, cache);
  }

  const now = Date.now();
  const cached = cache.get(entityId);
  if (cached && cached.expiresAt > now) return cached.promise;

  const promise = hass
    .callWS<SignedPathResponse>({
      type: "auth/sign_path",
      path: `/api/camera_proxy/${encodeURIComponent(entityId)}`,
    })
    .then((response) => {
      if (!response || typeof response.path !== "string" || response.path.length === 0) {
        throw new Error("Home Assistant did not return a signed camera path.");
      }
      return hass.hassUrl(response.path);
    });

  cache.set(entityId, {
    expiresAt: now + SIGNED_PATH_CACHE_MS,
    promise,
  });

  try {
    return await promise;
  } catch (error) {
    cache.delete(entityId);
    throw error;
  }
}
