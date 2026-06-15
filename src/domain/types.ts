/** Core domain types for the manuscript-translation platform. This module is
 *  the type hub — services, repositories, and routes import from here, so it
 *  sits near the top of the import-rank map. */

export type LanguageCode = string; // ISO-639-1-ish, e.g. "la", "en", "de"

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A recognized text region on a page (compatible with services/ocr.ts). */
export interface Region {
  bbox: BoundingBox;
  text: string;
  confidence: number; // [0, 1]
  language?: LanguageCode;
}

/** A unit of text to translate — one or more regions grouped after
 *  segmentation. */
export interface Segment {
  id: string;
  pageIndex: number;
  sourceText: string;
  sourceLanguage: LanguageCode;
  regions: Region[];
}

export interface TranslationUnit {
  segmentId: string;
  sourceText: string;
  targetText: string;
  targetLanguage: LanguageCode;
  /** Quality score in [0, 1], filled by the quality service. */
  quality?: number;
}

export interface GlossaryEntry {
  term: string;
  translation: string;
  language: LanguageCode;
  caseSensitive?: boolean;
}

export type JobStatus = "queued" | "processing" | "complete" | "failed";

export interface PipelineContext {
  jobId: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  glossary: GlossaryEntry[];
}

export type PipelineStage =
  | "ocr"
  | "segmentation"
  | "language_detection"
  | "translation"
  | "glossary"
  | "quality"
  | "layout";

export interface StageResult<T> {
  stage: PipelineStage;
  output: T;
  durationMs: number;
}
