import { NextResponse } from "next/server";
import { runPipeline } from "@/services/pipeline";
import { glossaryRepository } from "@/repositories/glossaryRepository";
import { newId } from "@/lib/ids";
import { DEFAULT_TARGET_LANGUAGE } from "@/lib/config";
import type { PipelineContext } from "@/domain/types";

export const dynamic = "force-dynamic";

/** v2 synchronous translate endpoint — runs the full layered pipeline and
 *  returns the translated units + quality + stage metrics in one call. */
export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  const sourceLanguage = (form.get("sourceLanguage") as string) || "auto";
  const targetLanguage = (form.get("targetLanguage") as string) || DEFAULT_TARGET_LANGUAGE;

  const buf = Buffer.from(await file.arrayBuffer());
  const ctx: PipelineContext = {
    jobId: newId("job"),
    sourceLanguage,
    targetLanguage,
    glossary: await glossaryRepository.forLanguage(targetLanguage),
  };
  const result = await runPipeline(buf, ctx);
  return NextResponse.json({
    jobId: result.jobId,
    units: result.units,
    meanQuality: result.meanQuality,
    metrics: result.metrics,
  });
}
