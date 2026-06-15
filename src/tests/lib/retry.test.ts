import { describe, it, expect } from "vitest";
import { backoffDelay, withRetry } from "@/lib/retry";

const noSleep = (): Promise<void> => Promise.resolve();

describe("retry", () => {
  it("computes capped exponential backoff", () => {
    expect(backoffDelay(0, 50, 2000)).toBe(50);
    expect(backoffDelay(1, 50, 2000)).toBe(100);
    expect(backoffDelay(10, 50, 2000)).toBe(2000); // capped
  });

  it("returns on first success", async () => {
    let calls = 0;
    const r = await withRetry(async () => { calls++; return "ok"; }, { sleep: noSleep });
    expect(r).toBe("ok");
    expect(calls).toBe(1);
  });

  it("retries then succeeds", async () => {
    let calls = 0;
    const r = await withRetry(
      async () => {
        calls++;
        if (calls < 3) throw new Error("transient");
        return calls;
      },
      { attempts: 5, sleep: noSleep },
    );
    expect(r).toBe(3);
  });

  it("stops when shouldRetry is false", async () => {
    let calls = 0;
    await expect(
      withRetry(
        async () => { calls++; throw new Error("fatal"); },
        { attempts: 5, sleep: noSleep, shouldRetry: () => false },
      ),
    ).rejects.toThrow("fatal");
    expect(calls).toBe(1);
  });
});
