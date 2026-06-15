import { describe, it, expect } from "vitest";
import { regionArea, sortReadingOrder, boundingBoxOf, meanConfidence } from "@/domain/region";
import type { Region } from "@/domain/types";

const r = (x: number, y: number, text: string, confidence = 0.9): Region => ({
  bbox: { x, y, width: 10, height: 10 },
  text,
  confidence,
});

describe("region helpers", () => {
  it("computes area", () => {
    expect(regionArea(r(0, 0, "a"))).toBe(100);
  });

  it("sorts in reading order with row tolerance", () => {
    const regions = [r(50, 0, "b"), r(0, 2, "a"), r(0, 100, "c")];
    expect(sortReadingOrder(regions).map((x) => x.text)).toEqual(["a", "b", "c"]);
  });

  it("computes the union bounding box", () => {
    const bb = boundingBoxOf([r(0, 0, "a"), r(20, 30, "b")]);
    expect(bb).toEqual({ x: 0, y: 0, width: 30, height: 40 });
    expect(boundingBoxOf([])).toBeNull();
  });

  it("averages confidence", () => {
    expect(meanConfidence([r(0, 0, "a", 0.4), r(0, 0, "b", 0.6)])).toBeCloseTo(0.5, 5);
    expect(meanConfidence([])).toBe(0);
  });
});
