import type { TranslationUnit } from "@/domain/types";
import { tokenize, jaccardSimilarity } from "@/lib/text";

/** Heuristic translation-quality scoring in [0, 1]. Combines:
 *   - length ratio sanity (target shouldn't be empty or wildly longer/shorter)
 *   - untranslated leakage penalty (target still equals source)
 *  Pure; the quality value is attached to each TranslationUnit. */
export interface QualityWeights {
  lengthRatio: number;
  leakage: number;
}

const DEFAULT_WEIGHTS: QualityWeights = { lengthRatio: 0.5, leakage: 0.5 };

export function scoreUnit(unit: TranslationUnit, weights: QualityWeights = DEFAULT_WEIGHTS): number {
  const srcTokens = tokenize(unit.sourceText).length;
  const tgtTokens = tokenize(unit.targetText).length;

  // Length-ratio score: 1 when ratio ~1, decaying as it diverges.
  let lengthScore = 0;
  if (srcTokens > 0 && tgtTokens > 0) {
    const ratio = tgtTokens / srcTokens;
    lengthScore = Math.max(0, 1 - Math.abs(Math.log(ratio)));
  }

  // Leakage: penalize when the target is identical to the source.
  const leakage = jaccardSimilarity(unit.sourceText, unit.targetText);
  const leakageScore = 1 - leakage;

  const score = weights.lengthRatio * lengthScore + weights.leakage * leakageScore;
  return Math.min(1, Math.max(0, score));
}

export function scoreUnits(units: TranslationUnit[]): TranslationUnit[] {
  return units.map((u) => ({ ...u, quality: scoreUnit(u) }));
}

export function meanQuality(units: TranslationUnit[]): number {
  if (units.length === 0) return 0;
  return units.reduce((s, u) => s + (u.quality ?? scoreUnit(u)), 0) / units.length;
}
