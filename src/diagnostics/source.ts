// Diagnostic-only helpers: never fetch a link or change a media element.
function parseSource(value: unknown): URL | undefined {
  if (typeof value !== "string" || !value || value.length > 16_384) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url;
  } catch { /* Missing, relative and unsupported sources stay unknown. */ }
}

export async function sourceFingerprint(value: unknown): Promise<string | undefined> {
  const url = parseSource(value);
  return url ? fingerprint("source", url.origin + url.pathname) : undefined;
}

export async function recordingFingerprint(value: unknown): Promise<string | undefined> {
  // Do not coerce unsafe numeric IDs: rounding would create false matches.
  if (typeof value === "number" && Number.isSafeInteger(value)) value = String(value);
  return typeof value === "string" && value.length > 0 && value.length <= 256
    ? fingerprint("recording", value) : undefined;
}

async function fingerprint(kind: string, value: string): Promise<string | undefined> {
  try {
    const bytes = new TextEncoder().encode(`ring-view-diagnostic-v2:${kind}:${value}`);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  } catch { return undefined; }
}

export function sourceTiming(value: unknown, now = Date.now()): Record<string, number | boolean> {
  const url = parseSource(value);
  if (!url || !Number.isFinite(now)) return {};
  const dates = url.searchParams.getAll("X-Amz-Date");
  const lifetimes = url.searchParams.getAll("X-Amz-Expires");
  if (dates.length !== 1 || lifetimes.length !== 1) return {};
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(dates[0]!);
  if (!match || !/^\d{1,6}$/.test(lifetimes[0]!)) return {};
  const [, y, m, d, h, min, s] = match;
  const iso = `${y}-${m}-${d}T${h}:${min}:${s}.000Z`;
  const issued = Date.parse(iso);
  const lifetime = Number(lifetimes[0]);
  if (!Number.isFinite(issued) || new Date(issued).toISOString() !== iso || lifetime > 604_800) return {};
  const age = (now - issued) / 1_000;
  // Signed-link timing uses the device clock; nominal expiry is not proof of rejection.
  return { linkAgeSeconds: age, linkRemainingSeconds: lifetime - age,
    linkNominallyExpired: age >= lifetime, linkIssuedInFuture: age < 0 };
}
