import { describe, it, expect } from "vitest";
import { detectLanguage } from "@/services/languageDetection";

describe("language detection", () => {
  it("detects Latin from stopwords", () => {
    const res = detectLanguage("et in principio erat verbum et deus");
    expect(res.language).toBe("la");
    expect(res.confidence).toBeGreaterThan(0);
  });

  it("detects English", () => {
    expect(detectLanguage("the word was with the god and the light").language).toBe("en");
  });

  it("falls back when there is no signal", () => {
    const res = detectLanguage("xyzzy plugh", "la");
    expect(res.language).toBe("la");
    expect(res.confidence).toBe(0);
  });

  it("returns fallback for empty text", () => {
    expect(detectLanguage("", "en").language).toBe("en");
  });
});
