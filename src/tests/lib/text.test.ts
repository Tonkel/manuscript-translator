import { describe, it, expect } from "vitest";
import { normalize, tokenize, jaccardSimilarity, truncate, wordCount } from "@/lib/text";

describe("text utils", () => {
  it("normalizes whitespace, case, and edge punctuation", () => {
    expect(normalize("  Hello,   WORLD!  ")).toBe("hello,   world".replace(/\s+/g, " "));
    expect(normalize("...Verbum...")).toBe("verbum");
  });

  it("tokenizes into words", () => {
    expect(tokenize("In principio, erat!")).toEqual(["in", "principio", "erat"]);
    expect(tokenize("")).toEqual([]);
  });

  it("computes jaccard similarity", () => {
    expect(jaccardSimilarity("a b c", "a b c")).toBe(1);
    expect(jaccardSimilarity("", "")).toBe(1);
    expect(jaccardSimilarity("a b", "")).toBe(0);
    expect(jaccardSimilarity("a b c d", "a b")).toBeCloseTo(0.5, 5);
  });

  it("truncates with ellipsis", () => {
    expect(truncate("short", 10)).toBe("short");
    expect(truncate("abcdefgh", 5)).toBe("abcd…");
  });

  it("counts words", () => {
    expect(wordCount("one two three")).toBe(3);
  });
});
