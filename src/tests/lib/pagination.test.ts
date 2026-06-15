import { describe, it, expect } from "vitest";
import { normalizeParams, paginate } from "@/lib/pagination";

describe("pagination", () => {
  it("clamps params to sane bounds", () => {
    expect(normalizeParams({})).toEqual({ offset: 0, limit: 50 });
    expect(normalizeParams({ offset: -5, limit: 0 })).toEqual({ offset: 0, limit: 1 });
    expect(normalizeParams({ limit: 9999 })).toEqual({ offset: 0, limit: 200 });
  });

  it("slices an array into a page with hasMore", () => {
    const all = Array.from({ length: 10 }, (_, i) => i);
    const p = paginate(all, { offset: 0, limit: 4 });
    expect(p.items).toEqual([0, 1, 2, 3]);
    expect(p.total).toBe(10);
    expect(p.hasMore).toBe(true);

    const last = paginate(all, { offset: 8, limit: 4 });
    expect(last.items).toEqual([8, 9]);
    expect(last.hasMore).toBe(false);
  });
});
