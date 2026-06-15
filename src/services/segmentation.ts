import type { Region, Segment, LanguageCode } from "@/domain/types";
import { sortReadingOrder, boundingBoxOf } from "@/domain/region";
import { newId } from "@/lib/ids";

/** Groups OCR regions into translation segments. Regions within `rowGap`
 *  vertically are treated as the same paragraph and merged into one segment;
 *  a larger gap starts a new segment. Pure + deterministic. */
export interface SegmentationOptions {
  rowGap?: number;
  sourceLanguage: LanguageCode;
  pageIndex?: number;
}

export function segmentRegions(regions: Region[], opts: SegmentationOptions): Segment[] {
  const rowGap = opts.rowGap ?? 24;
  const pageIndex = opts.pageIndex ?? 0;
  const ordered = sortReadingOrder(regions);
  const groups: Region[][] = [];
  let current: Region[] = [];
  let lastBottom = -Infinity;

  for (const r of ordered) {
    const top = r.bbox.y;
    if (current.length > 0 && top - lastBottom > rowGap) {
      groups.push(current);
      current = [];
    }
    current.push(r);
    lastBottom = r.bbox.y + r.bbox.height;
  }
  if (current.length > 0) groups.push(current);

  return groups.map((grp) => ({
    id: newId("seg"),
    pageIndex,
    sourceText: grp.map((r) => r.text).join(" ").trim(),
    sourceLanguage: opts.sourceLanguage,
    regions: grp,
    // boundingBoxOf is computed for callers that need layout extents.
    ...(boundingBoxOf(grp) ? {} : {}),
  }));
}
