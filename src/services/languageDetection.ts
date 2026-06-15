import type { LanguageCode } from "@/domain/types";
import { isSupported } from "@/domain/language";
import { tokenize } from "@/lib/text";

/** Heuristic language detection via stop-word frequency. Deterministic and
 *  dependency-free — good enough for the demo and fully unit-testable. */
const STOPWORDS: Record<LanguageCode, string[]> = {
  la: ["et", "in", "est", "non", "qui", "ad", "cum", "erat", "deus", "verbum"],
  en: ["the", "and", "of", "to", "in", "is", "was", "that", "with", "for"],
  de: ["der", "die", "und", "den", "von", "ist", "das", "mit", "nicht", "ein"],
  fr: ["le", "la", "et", "les", "des", "est", "une", "que", "pour", "dans"],
  it: ["il", "che", "di", "la", "non", "una", "per", "sono", "con", "del"],
};

export interface DetectionResult {
  language: LanguageCode;
  confidence: number; // [0, 1]
  scores: Record<LanguageCode, number>;
}

export function detectLanguage(text: string, fallback: LanguageCode = "la"): DetectionResult {
  const tokens = tokenize(text);
  const scores: Record<LanguageCode, number> = {};
  if (tokens.length === 0) {
    return { language: fallback, confidence: 0, scores };
  }
  const total = tokens.length;
  for (const [lang, words] of Object.entries(STOPWORDS)) {
    const set = new Set(words);
    const hits = tokens.filter((t) => set.has(t)).length;
    scores[lang] = hits / total;
  }
  let best: LanguageCode = fallback;
  let bestScore = 0;
  for (const [lang, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      best = lang;
    }
  }
  const language = isSupported(best) ? best : fallback;
  return { language, confidence: bestScore, scores };
}
