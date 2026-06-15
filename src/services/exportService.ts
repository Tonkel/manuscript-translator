import type { TranslationUnit } from "@/domain/types";
import { UnsupportedError } from "@/lib/errors";

/** Serializes translated units to a downloadable text representation. */
export type ExportFormat = "txt" | "json" | "tsv";

export function exportUnits(units: TranslationUnit[], format: ExportFormat): string {
  switch (format) {
    case "txt":
      return units.map((u) => u.targetText).join("\n\n");
    case "json":
      return JSON.stringify(
        units.map((u) => ({ source: u.sourceText, target: u.targetText, quality: u.quality ?? null })),
        null,
        2,
      );
    case "tsv":
      return [
        "source\ttarget\tquality",
        ...units.map((u) => `${tsvCell(u.sourceText)}\t${tsvCell(u.targetText)}\t${u.quality ?? ""}`),
      ].join("\n");
    default:
      throw new UnsupportedError(`unknown export format: ${format as string}`);
  }
}

function tsvCell(s: string): string {
  return s.replace(/\t/g, " ").replace(/\n/g, " ");
}
