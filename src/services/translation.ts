// MOCKED translation service.
// If USE_REAL_TRANSLATION=1 is set, this would proxy to Anthropic. The real
// path is intentionally not wired up here (no SDK dependency) - the env flag
// is a hook for a future issue.

const DICTIONARY: Record<string, string> = {
  "In principio erat Verbum": "In the beginning was the Word",
  "et Verbum erat apud Deum": "and the Word was with God",
  "Beatus vir qui non abiit": "Blessed is the man who walks not",
};

export const translationService = {
  async translate(text: string, targetLang: string): Promise<string> {
    if (process.env.USE_REAL_TRANSLATION === "1") {
      // Placeholder for a real Anthropic-backed call.
      return `${text} [${targetLang.toUpperCase()}]`;
    }
    if (DICTIONARY[text]) return DICTIONARY[text];
    return `${text} [${targetLang.toUpperCase()}]`;
  },
};
