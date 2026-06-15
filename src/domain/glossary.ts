import type { GlossaryEntry, LanguageCode } from "@/domain/types";

/** Pure glossary helpers. The glossary SERVICE applies these against
 *  translated text; this module just holds the matching logic. */

export function entriesForLanguage(entries: GlossaryEntry[], lang: LanguageCode): GlossaryEntry[] {
  return entries.filter((e) => e.language === lang);
}

/** Build a lookup keyed by the (optionally case-folded) term. Later entries
 *  win on collision. */
export function indexByTerm(entries: GlossaryEntry[]): Map<string, GlossaryEntry> {
  const map = new Map<string, GlossaryEntry>();
  for (const e of entries) {
    map.set(e.caseSensitive ? e.term : e.term.toLowerCase(), e);
  }
  return map;
}

/** Apply glossary entries to a string, replacing whole-word term matches with
 *  their translation. Returns the rewritten text + the terms that hit. */
export function applyGlossary(
  text: string,
  entries: GlossaryEntry[],
): { text: string; applied: string[] } {
  const applied: string[] = [];
  let out = text;
  for (const e of entries) {
    const flags = e.caseSensitive ? "g" : "gi";
    const re = new RegExp(`\\b${escapeRegExp(e.term)}\\b`, flags);
    if (re.test(out)) {
      out = out.replace(re, e.translation);
      applied.push(e.term);
    }
  }
  return { text: out, applied };
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
