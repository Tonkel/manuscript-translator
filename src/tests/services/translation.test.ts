import { describe, it, expect } from "vitest";
import { translationService } from "../../services/translation";

describe("translationService", () => {
  it("translates known Latin to English via the dictionary", async () => {
    const out = await translationService.translate("In principio erat Verbum", "en");
    expect(out).toBe("In the beginning was the Word");
  });

  it("falls back to a tagged passthrough for unknown text", async () => {
    const out = await translationService.translate("xyzzy", "en");
    expect(out).toBe("xyzzy [EN]");
  });
});
