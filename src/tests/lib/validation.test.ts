import { describe, it, expect } from "vitest";
import { isAllowedMimeType, isWithinSizeLimit } from "../../lib/validation";

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
});
