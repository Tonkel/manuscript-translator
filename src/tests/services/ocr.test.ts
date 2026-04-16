import { describe, it, expect } from "vitest";
import { ocrService } from "../../services/ocr";

describe("ocrService", () => {
  it("returns at least one region", async () => {
    const regions = await ocrService.extractText(Buffer.from("hello"));
    expect(regions.length).toBeGreaterThan(0);
    expect(regions[0]).toHaveProperty("bbox");
    expect(regions[0]).toHaveProperty("text");
    expect(regions[0]).toHaveProperty("confidence");
  });

  it("returns regions whose confidence is between 0 and 1", async () => {
    const regions = await ocrService.extractText(Buffer.from("anything"));
    for (const r of regions) {
      expect(r.confidence).toBeGreaterThan(0);
      expect(r.confidence).toBeLessThanOrEqual(1);
    }
  });
});
