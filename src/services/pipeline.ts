import type { PipelineContext, Region, Segment, TranslationUnit } from "@/domain/types";
import { ocrService, type OcrRegion } from "@/services/ocr";
import { translationService } from "@/services/translation";
import { layoutService } from "@/services/layout";
import { segmentRegions } from "@/services/segmentation";
import { detectLanguage } from "@/services/languageDetection";
import { scoreUnits, meanQuality } from "@/services/qualityScore";
import { applyGlossaryToUnits } from "@/services/glossaryService";
import { TtlCache } from "@/services/cache";
import { MetricsRecorder } from "@/services/metrics";
import { blobStore } from "@/services/storage";
import { createLogger } from "@/lib/logger";

const log = createLogger("pipeline");

export interface PipelineResult {
  jobId: string;
  units: TranslationUnit[];
  meanQuality: number;
  resultKey: string;
  metrics: Record<string, number>;
}

/** End-to-end manuscript translation pipeline. This is the orchestration hub:
 *  OCR → segmentation → language detection → translation (cached) → glossary
 *  → quality scoring → layout composition. Each stage is timed. */
export async function runPipeline(fileBuffer: Buffer, ctx: PipelineContext): Promise<PipelineResult> {
  const metrics = new MetricsRecorder();
  const cache = new TtlCache<string, string>(60_000);

  const regions: OcrRegion[] = await metrics.time("ocr", () => ocrService.extractText(fileBuffer));
  const asRegions: Region[] = regions.map((r) => ({ ...r }));

  const segments: Segment[] = await metrics.time("segmentation", async () =>
    segmentRegions(asRegions, { sourceLanguage: ctx.sourceLanguage }),
  );

  await metrics.time("language_detection", async () => {
    for (const seg of segments) {
      if (!seg.sourceLanguage || seg.sourceLanguage === "auto") {
        seg.sourceLanguage = detectLanguage(seg.sourceText, ctx.sourceLanguage).language;
      }
    }
  });

  let units: TranslationUnit[] = await metrics.time("translation", async () => {
    const result: TranslationUnit[] = [];
    for (const seg of segments) {
      const cacheKey = `${ctx.targetLanguage}:${seg.sourceText}`;
      let targetText = cache.get(cacheKey);
      if (targetText === undefined) {
        targetText = await translationService.translate(seg.sourceText, ctx.targetLanguage);
        cache.set(cacheKey, targetText);
      }
      result.push({
        segmentId: seg.id,
        sourceText: seg.sourceText,
        targetText,
        targetLanguage: ctx.targetLanguage,
      });
    }
    return result;
  });

  units = await metrics.time("glossary", async () =>
    applyGlossaryToUnits(units, ctx.glossary, ctx.targetLanguage),
  );

  units = await metrics.time("quality", async () => scoreUnits(units));

  const composed: Buffer = await metrics.time("layout", () =>
    layoutService.compose(fileBuffer, asRegions, units.map((u) => u.targetText)),
  );

  const resultKey = `result:${ctx.jobId}`;
  await blobStore.put(resultKey, composed);

  const quality = meanQuality(units);
  log.info(`pipeline done for ${ctx.jobId}: ${units.length} units, quality ${quality.toFixed(2)}`);
  return { jobId: ctx.jobId, units, meanQuality: quality, resultKey, metrics: metrics.byStage() };
}
