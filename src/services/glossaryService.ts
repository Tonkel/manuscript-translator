import type { GlossaryEntry, TranslationUnit, LanguageCode } from "@/domain/types";
import { applyGlossary, entriesForLanguage } from "@/domain/glossary";
import { createLogger } from "@/lib/logger";

const log = createLogger("glossary-service");

/** Applies glossary term overrides to translated units, after the base
 *  translation but before quality scoring, so preferred terminology wins. */
export function applyGlossaryToUnits(
  units: TranslationUnit[],
  glossary: GlossaryEntry[],
  targetLanguage: LanguageCode,
): TranslationUnit[] {
  const relevant = entriesForLanguage(glossary, targetLanguage);
  if (relevant.length === 0) return units;

  let totalApplied = 0;
  const out = units.map((u) => {
    const { text, applied } = applyGlossary(u.targetText, relevant);
    totalApplied += applied.length;
    return applied.length > 0 ? { ...u, targetText: text } : u;
  });
  if (totalApplied > 0) log.debug(`applied ${totalApplied} glossary overrides`);
  return out;
}
