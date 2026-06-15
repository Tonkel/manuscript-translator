import { describe, it, expect } from "vitest";
import { applyGlossary, indexByTerm, entriesForLanguage } from "@/domain/glossary";
import type { GlossaryEntry } from "@/domain/types";

const entries: GlossaryEntry[] = [
  { term: "Verbum", translation: "Word", language: "en" },
  { term: "Deus", translation: "God", language: "en", caseSensitive: true },
];

describe("glossary helpers", () => {
  it("filters by language", () => {
    expect(entriesForLanguage(entries, "en")).toHaveLength(2);
    expect(entriesForLanguage(entries, "de")).toHaveLength(0);
  });

  it("indexes by term with case folding", () => {
    const idx = indexByTerm(entries);
    expect(idx.get("verbum")?.translation).toBe("Word");
    expect(idx.get("Deus")?.translation).toBe("God");
  });

  it("applies whole-word, case-insensitive replacement", () => {
    const res = applyGlossary("the verbum was here", entries);
    expect(res.text).toBe("the Word was here");
    expect(res.applied).toContain("Verbum");
  });

  it("respects case-sensitive entries", () => {
    expect(applyGlossary("deus lowercase", entries).text).toBe("deus lowercase");
    expect(applyGlossary("Deus uppercase", entries).text).toBe("God uppercase");
  });
});
