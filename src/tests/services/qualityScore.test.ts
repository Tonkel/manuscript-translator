import { describe, it, expect } from "vitest";
import { scoreUnit, scoreUnits, meanQuality } from "@/services/qualityScore";
import type { TranslationUnit } from "@/domain/types";

const unit = (sourceText: string, targetText: string): TranslationUnit => ({
  segmentId: "seg_x",
  sourceText,
  targetText,
  targetLanguage: "en",
});

describe("quality scoring", () => {
  it("penalizes untranslated leakage (target == source)", () => {
    const leaked = scoreUnit(unit("verbum deus", "verbum deus"));
    const translated = scoreUnit(unit("verbum deus", "word god"));
    expect(translated).toBeGreaterThan(leaked);
  });

  it("penalizes empty target", () => {
    expect(scoreUnit(unit("a b c", ""))).toBeLessThan(0.6);
  });

  it("scores in [0,1] and attaches to units", () => {
    const scored = scoreUnits([unit("a b", "c d")]);
    expect(scored[0].quality).toBeGreaterThanOrEqual(0);
    expect(scored[0].quality).toBeLessThanOrEqual(1);
  });

  it("means quality across units", () => {
    expect(meanQuality([])).toBe(0);
    expect(meanQuality(scoreUnits([unit("a", "b"), unit("c", "d")]))).toBeGreaterThan(0);
  });
});
