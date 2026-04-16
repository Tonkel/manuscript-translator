import type { OcrRegion } from "./ocr";

// MOCKED layout composer.
// Only the first page is considered. See open issue "Preserve layout across
// multi-page PDFs". Returns a tiny fake "PDF" buffer (not a real PDF) - good
// enough to round-trip through the pipeline for testing.

export const layoutService = {
  async compose(
    originalFile: Buffer,
    regions: OcrRegion[],
    translations: string[],
  ): Promise<Buffer> {
    const header = Buffer.from("%PDF-1.4\n% manuscript-translator stub\n", "utf8");
    const body = Buffer.from(
      regions
        .map((r, i) => `${r.bbox.x},${r.bbox.y}: ${translations[i] ?? ""}`)
        .join("\n"),
      "utf8",
    );
    const footer = Buffer.from(`\n%%EOF originalSize=${originalFile.length}`, "utf8");
    return Buffer.concat([header, body, footer]);
  },
};
