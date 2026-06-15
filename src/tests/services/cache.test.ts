import { describe, it, expect } from "vitest";
import { TtlCache } from "@/services/cache";
import { fixedClock } from "@/lib/clock";

describe("TtlCache", () => {
  it("stores and retrieves before expiry", () => {
    const c = new TtlCache<string, number>(1000, fixedClock(new Date(0)));
    c.set("a", 1);
    expect(c.get("a")).toBe(1);
    expect(c.has("a")).toBe(true);
    expect(c.size).toBe(1);
  });

  it("expires entries past the TTL", () => {
    let t = 0;
    const clock = { now: () => new Date(t) };
    const c = new TtlCache<string, number>(1000, clock);
    c.set("a", 1);
    t = 1500;
    expect(c.get("a")).toBeUndefined();
  });

  it("clear empties the cache", () => {
    const c = new TtlCache<string, number>(1000, fixedClock(new Date(0)));
    c.set("a", 1);
    c.clear();
    expect(c.size).toBe(0);
  });
});
