import { describe, it, expect } from "vitest";
import { isAllowedMimeType, isWithinSizeLimit, validateManuscriptFile } from "../../lib/validation";
import { MAX_FILE_SIZE } from "../../lib/config";

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
    it("accepts valid files with allowed mime type and size", () => {
      const result = validateManuscriptFile({
        type: "application/pdf",
        size: 1000,
      });
      expect(result).toEqual({ ok: true });
    });

    it("rejects files with unsupported mime type", () => {
      const result = validateManuscriptFile({
        type: "text/plain",
        size: 1000,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("Unsupported file type");
      }
    });

    it("rejects files that exceed size limit", () => {
      const result = validateManuscriptFile({
        type: "application/pdf",
        size: MAX_FILE_SIZE + 1,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("exceeds maximum");
      }
    });

    it("rejects files with zero size", () => {
      const result = validateManuscriptFile({
        type: "application/pdf",
        size: 0,
      });
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.reason).toContain("exceeds maximum");
      }
    });

    it("accepts all allowed mime types", () => {
      const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/tiff"];
      allowedTypes.forEach((type) => {
        const result = validateManuscriptFile({
          type,
          size: 1000,
        });
        expect(result.ok).toBe(true);
      });
    });
  });
});
