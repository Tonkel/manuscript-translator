// MOCKED OCR service.
// TODO: replace with a real implementation backed by Tesseract.js. See open
// issue "Integrate real OCR via Tesseract.js (replace mock)". Until then this
// returns deterministic fake regions so the rest of the pipeline can be
// exercised end-to-end.

export interface OcrRegion {
  bbox: { x: number; y: number; width: number; height: number };
  text: string;
  confidence: number;
}

export const ocrService = {
  async extractText(fileBuffer: Buffer): Promise<OcrRegion[]> {
    // Use the buffer length as a tiny bit of pseudo-input so the output is at
    // least a function of the file. Still completely fake.
    const seed = fileBuffer.length % 3;
    const samples = [
      "In principio erat Verbum",
      "et Verbum erat apud Deum",
      "Beatus vir qui non abiit",
    ];
    return samples.slice(seed).map((text, i) => ({
      bbox: { x: 50, y: 80 + i * 60, width: 400, height: 40 },
      text,
      confidence: 0.92 - i * 0.05,
    }));
  },
};
