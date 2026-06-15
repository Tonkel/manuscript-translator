import type { LanguageCode } from "@/domain/types";

/** Supported languages + display metadata. Kept small and pure. */
export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  /** RTL scripts need mirrored layout downstream. */
  rtl: boolean;
}

export const LANGUAGES: Record<string, LanguageInfo> = {
  la: { code: "la", name: "Latin", rtl: false },
  en: { code: "en", name: "English", rtl: false },
  de: { code: "de", name: "German", rtl: false },
  fr: { code: "fr", name: "French", rtl: false },
  it: { code: "it", name: "Italian", rtl: false },
  el: { code: "el", name: "Greek", rtl: false },
  he: { code: "he", name: "Hebrew", rtl: true },
  ar: { code: "ar", name: "Arabic", rtl: true },
};

export function isSupported(code: LanguageCode): boolean {
  return code in LANGUAGES;
}

export function languageName(code: LanguageCode): string {
  return LANGUAGES[code]?.name ?? code;
}

export function isRtl(code: LanguageCode): boolean {
  return LANGUAGES[code]?.rtl ?? false;
}
