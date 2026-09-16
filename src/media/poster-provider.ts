import type { HassEntity, HomeAssistant } from "../types";

const SIGNED_PATH_CACHE_MS = 9_000;
const URL_COMPARISON_BASE = "http://ring-view.invalid";

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
  revision?: string,
): string {
  const picture = entity?.attributes.entity_picture;
  const url = typeof picture === "string" && picture.length > 0
    ? hass.hassUrl(picture)
    : hass.hassUrl(`/api/camera_proxy/${encodeURIComponent(entityId)}`);
  if (!revision) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}ring_view_media=${encodeURIComponent(revision)}`;
}

/**
 * Home Assistant changes the access token in camera-proxy entity pictures on a
 * timer. Treat that authentication refresh as the same poster resource while
 * retaining strict URL identity for every other path and query change.
 */
export function cameraProxyTokenIsOnlyUrlChange(
  previousUrl: string | undefined,
  nextUrl: string | undefined,
): boolean {
  if (!previousUrl || !nextUrl || previousUrl === nextUrl) return false;
  const previousResource = cameraProxyResourceWithoutToken(previousUrl);
  const nextResource = cameraProxyResourceWithoutToken(nextUrl);
  return previousResource !== undefined && previousResource === nextResource;
}

function cameraProxyResourceWithoutToken(url: string): string | undefined {
  try {
    const parsed = new URL(url, URL_COMPARISON_BASE);
    if (
      !parsed.pathname.includes("/api/camera_proxy/")
      || !parsed.searchParams.has("token")
    ) {
      return undefined;
    }
    parsed.searchParams.delete("token");
    return parsed.href;
  } catch {
    return undefined;
  }
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

/**
 * Request a target width without imposing a height. Home Assistant and camera
 * integrations can reduce the image when supported, while the returned image
 * retains its native ratio so Automatic can discover later orientation changes.
 */
export async function widthSizedPosterUrl(
  hass: HomeAssistant,
  entityId: string,
  width: number,
): Promise<string> {
  const signedUrl = await signedCameraProxyUrl(hass, entityId);
  const separator = signedUrl.includes("?") ? "&" : "?";
  return `${signedUrl}${separator}width=${positiveInteger(width)}`;
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
