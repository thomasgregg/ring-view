import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { recordingFingerprint, sourceFingerprint, sourceTiming } from "../../src/diagnostics/source";

const now = Date.parse("2026-09-07T12:00:00Z");
const link = (query: string) => `https://example.invalid/PRIVATE-CLIP?${query}`;
const query = "X-Amz-Date=20260907T115500Z&X-Amz-Expires=600&X-Amz-Signature=PRIVATE";

afterEach(() => vi.unstubAllGlobals());

describe("anonymous diagnostic source matching", () => {
  it("matches paths across signature changes without hashing credentials or query strings", async () => {
    vi.stubGlobal("crypto", { subtle: { digest: async (_: string, bytes: Uint8Array) => createHash("sha256").update(bytes).digest() } });
    const expected = createHash("sha256").update("ring-view-diagnostic-v2:source:https://example.invalid/PRIVATE-CLIP").digest("hex");
    expect(await sourceFingerprint(link(query))).toBe(expected);
    expect(await sourceFingerprint("https://user:password@example.invalid/PRIVATE-CLIP?token=other#private")).toBe(expected);
    expect(await sourceFingerprint("https://example.invalid/OTHER")).not.toBe(expected);
    expect(await recordingFingerprint("123")).toBe(await recordingFingerprint(123));
    expect(await recordingFingerprint(Number.MAX_SAFE_INTEGER + 1)).toBeUndefined();
  });

  it.each([undefined, "", "/relative", "data:video/mp4,PRIVATE", "blob:PRIVATE", "not a url"])("does not guess an unsupported source (%s)", async (value) => {
    expect(await sourceFingerprint(value)).toBeUndefined();
    expect(sourceTiming(value, now)).toEqual({});
  });

  it("reports unknown fingerprints when Web Crypto is unavailable or rejects", async () => {
    vi.stubGlobal("crypto", undefined);
    expect(await sourceFingerprint(link(query))).toBeUndefined();
    vi.stubGlobal("crypto", { subtle: { digest: async () => { throw new Error("PRIVATE"); } } });
    expect(await sourceFingerprint(link(query))).toBeUndefined();
  });

  it("captures age and nominal expiry, including a future signing time", () => {
    expect(sourceTiming(link(query), now)).toEqual({ linkAgeSeconds: 300, linkRemainingSeconds: 300, linkNominallyExpired: false, linkIssuedInFuture: false });
    expect(sourceTiming(link(query), now + 300_000).linkNominallyExpired).toBe(true);
    expect(sourceTiming(link(query), now - 600_000).linkIssuedInFuture).toBe(true);
  });

  it.each([
    "", "X-Amz-Date=20260907T115500Z", "X-Amz-Date=20260230T115500Z&X-Amz-Expires=60",
    "X-Amz-Date=20260907T255500Z&X-Amz-Expires=60", "X-Amz-Date=20260907T115500Z&X-Amz-Expires=-1",
    "X-Amz-Date=20260907T115500Z&X-Amz-Expires=999999", `${query}&X-Amz-Expires=60`, `${query}&X-Amz-Date=20260907T115500Z`,
  ])("does not invent expiry from missing, malformed or ambiguous metadata (%s)", (value) => {
    expect(sourceTiming(link(value), now)).toEqual({});
  });
});
