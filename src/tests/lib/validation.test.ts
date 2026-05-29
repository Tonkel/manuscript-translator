import { describe, it, expect } from "vitest";
import {
  isAllowedMimeType,
  isWithinSizeLimit,
  validateManuscriptFile,
} from "../../lib/validation";

describe("validation", () => {
  it("accepts known mime types", () => {
    expect(isAllowedMimeType("application/pdf")).toBe(true);
    expect(isAllowedMimeType("image/png")).toBe(true);
  });

  it("rejects unknown mime types", () => {
    expect(isAllowedMimeType("text/plain")).toBe(false);
  });

  it("enforces size bounds", () => {
    expect(isWithinSizeLimit(100, 1000)).toBe(true);
    expect(isWithinSizeLimit(0, 1000)).toBe(false);
    expect(isWithinSizeLimit(2000, 1000)).toBe(false);
  });

  describe("validateManuscriptFile", () => {
    it("accepts valid PDF files", () => {
      const result = validateManuscriptFile({
        type: "application/pdf",
        size: 1000,
      });
      expect(result).toEqual({ ok: true });
    });

    it("accepts valid PNG files", () => {
      const result = validateManuscriptFile({
        type: "image/png",
        size: 5000000,
      });
      expect(result).toEqual({ ok: true });
    });

    it("rejects unsupported file types", () => {
      const result = validateManuscriptFile({
        type: "text/plain",
        size: 1000,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("Unsupported file type");
      }
    });

    it("rejects files that are too large", () => {
      const result = validateManuscriptFile({
        type: "application/pdf",
        size: 20000000, // > 10MB
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("exceeds the maximum allowed size");
      }
    });

    it("rejects files with zero size", () => {
      const result = validateManuscriptFile({
        type: "application/pdf",
        size: 0,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("exceeds the maximum allowed size");
      }
    });
  });
});
