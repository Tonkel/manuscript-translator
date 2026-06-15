import { describe, it, expect } from "vitest";
import { exportUnits } from "@/services/exportService";
import type { TranslationUnit } from "@/domain/types";

const units: TranslationUnit[] = [
  { segmentId: "s1", sourceText: "verbum", targetText: "word", targetLanguage: "en", quality: 0.8 },
  { segmentId: "s2", sourceText: "deus", targetText: "god", targetLanguage: "en", quality: 0.9 },
];

describe("exportService", () => {
  it("exports txt as target lines", () => {
    expect(exportUnits(units, "txt")).toBe("word\n\ngod");
  });

  it("exports json with source/target/quality", () => {
    const parsed = JSON.parse(exportUnits(units, "json"));
    expect(parsed).toHaveLength(2);
    expect(parsed[0]).toEqual({ source: "verbum", target: "word", quality: 0.8 });
  });

  it("exports tsv with a header", () => {
    const lines = exportUnits(units, "tsv").split("\n");
    expect(lines[0]).toBe("source\ttarget\tquality");
    expect(lines[1]).toBe("verbum\tword\t0.8");
  });
});
