import { describe, expect, it, vi } from "vitest";
import { StreamLifecycle } from "../../src/utilities/stream-lifecycle";

describe("stream lifecycle", () => {
  it("invalidates old sessions and cancels their timeout", () => {
    vi.useFakeTimers();
    const lifecycle = new StreamLifecycle();
    const callback = vi.fn();
    expect(lifecycle.next()).toBe(1);
    lifecycle.scheduleTimeout(callback, 1_000);
    expect(lifecycle.next()).toBe(2);
    vi.advanceTimersByTime(1_000);
    expect(callback).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("fires the current session timeout once", () => {
    vi.useFakeTimers();
    const lifecycle = new StreamLifecycle();
    const callback = vi.fn();
    lifecycle.next();
    lifecycle.scheduleTimeout(callback, 500);
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
