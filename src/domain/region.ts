import type { Region, BoundingBox } from "@/domain/types";

/** Pure helpers over OCR regions. */

export function regionArea(r: Region): number {
  return Math.max(0, r.bbox.width) * Math.max(0, r.bbox.height);
}

/** Reading order: top-to-bottom, then left-to-right, with a row tolerance so
 *  regions on roughly the same line sort by x. */
export function sortReadingOrder(regions: Region[], rowTolerance = 12): Region[] {
  return regions.slice().sort((a, b) => {
    const dy = a.bbox.y - b.bbox.y;
    if (Math.abs(dy) > rowTolerance) return dy;
    return a.bbox.x - b.bbox.x;
  });
}

export function boundingBoxOf(regions: Region[]): BoundingBox | null {
  if (regions.length === 0) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const r of regions) {
    minX = Math.min(minX, r.bbox.x);
    minY = Math.min(minY, r.bbox.y);
    maxX = Math.max(maxX, r.bbox.x + r.bbox.width);
    maxY = Math.max(maxY, r.bbox.y + r.bbox.height);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function meanConfidence(regions: Region[]): number {
  if (regions.length === 0) return 0;
  return regions.reduce((s, r) => s + r.confidence, 0) / regions.length;
}
