import type { Segment, TranslationUnit, LanguageCode } from "@/domain/types";
import { wordCount } from "@/lib/text";

/** A fully-processed manuscript: the segments and their translations, plus
 *  derived stats used by the results UI and export. */
export interface Manuscript {
  id: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  segments: Segment[];
  units: TranslationUnit[];
}

export interface ManuscriptStats {
  segmentCount: number;
  sourceWords: number;
  targetWords: number;
  pages: number;
}

export function manuscriptStats(m: Manuscript): ManuscriptStats {
  const sourceWords = m.units.reduce((s, u) => s + wordCount(u.sourceText), 0);
  const targetWords = m.units.reduce((s, u) => s + wordCount(u.targetText), 0);
  const pages = new Set(m.segments.map((s) => s.pageIndex)).size;
  return { segmentCount: m.segments.length, sourceWords, targetWords, pages };
}
