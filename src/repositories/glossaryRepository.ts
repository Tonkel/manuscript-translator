import type { GlossaryEntry, LanguageCode } from "@/domain/types";
import { entriesForLanguage } from "@/domain/glossary";

/** In-memory glossary store (the demo doesn't persist glossaries yet). Keeps
 *  the same async shape a DB-backed repository would have. */
class GlossaryRepository {
  private entries: GlossaryEntry[] = [];

  async addAll(entries: GlossaryEntry[]): Promise<void> {
    this.entries.push(...entries);
  }

  async all(): Promise<GlossaryEntry[]> {
    return this.entries.slice();
  }

  async forLanguage(lang: LanguageCode): Promise<GlossaryEntry[]> {
    return entriesForLanguage(this.entries, lang);
  }

  async clear(): Promise<void> {
    this.entries = [];
  }
}

export const glossaryRepository = new GlossaryRepository();
