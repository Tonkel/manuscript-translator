/** Pure text utilities used by segmentation, glossary, and quality scoring.
 *  Deliberately dependency-free and unit-tested. */

/** Lowercase + collapse whitespace + strip surrounding punctuation. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^[\s\p{P}]+|[\s\p{P}]+$/gu, "")
    .trim();
}

/** Split into word tokens (unicode-aware, drops punctuation). */
export function tokenize(text: string): string[] {
  const matches = normalize(text).match(/[\p{L}\p{N}]+/gu);
  return matches ? matches : [];
}

/** Jaccard similarity of the token SETS of two strings, in [0, 1]. */
export function jaccardSimilarity(a: string, b: string): number {
  const sa = new Set(tokenize(a));
  const sb = new Set(tokenize(b));
  if (sa.size === 0 && sb.size === 0) return 1;
  if (sa.size === 0 || sb.size === 0) return 0;
  let inter = 0;
  for (const t of sa) if (sb.has(t)) inter++;
  const union = sa.size + sb.size - inter;
  return inter / union;
}

/** Truncate to maxChars, appending an ellipsis if cut. */
export function truncate(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, Math.max(0, maxChars - 1)).trimEnd() + "…";
}

export function wordCount(text: string): number {
  return tokenize(text).length;
}
