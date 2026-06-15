import { describe, it, expect } from "vitest";
import { segmentRegions } from "@/services/segmentation";
import type { Region } from "@/domain/types";

const r = (x: number, y: number, text: string): Region => ({
  bbox: { x, y, width: 10, height: 10 },
  text,
  confidence: 0.9,
});

describe("segmentation", () => {
  it("merges nearby rows into one segment and splits on large gaps", () => {
    const regions = [r(0, 0, "alpha"), r(0, 12, "beta"), r(0, 200, "gamma")];
    const segs = segmentRegions(regions, { sourceLanguage: "la", rowGap: 24 });
    expect(segs).toHaveLength(2);
    expect(segs[0].sourceText).toBe("alpha beta");
    expect(segs[1].sourceText).toBe("gamma");
  });

  it("tags segments with the source language and a page index", () => {
    const segs = segmentRegions([r(0, 0, "x")], { sourceLanguage: "la", pageIndex: 3 });
    expect(segs[0].sourceLanguage).toBe("la");
    expect(segs[0].pageIndex).toBe(3);
    expect(segs[0].id).toMatch(/^seg_/);
  });

  it("returns no segments for empty input", () => {
    expect(segmentRegions([], { sourceLanguage: "la" })).toHaveLength(0);
  });
});
