import { randomUUID } from "node:crypto";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db/client";
import { jobs, type Job } from "@/db/schema";
import { ocrService } from "./ocr";
import { translationService } from "./translation";
import { layoutService } from "./layout";
import { DEFAULT_TARGET_LANGUAGE } from "@/lib/config";

const buffers = new Map<string, Buffer>();

export async function enqueueJob(filename: string, fileBuffer: Buffer): Promise<string> {
  const id = randomUUID();
  const now = new Date();
  await db.insert(jobs).values({
    id,
    filename,
    status: "queued",
    progress: 0,
    createdAt: now,
    updatedAt: now,
  });
  buffers.set(id, fileBuffer);
  // Fire-and-forget processing on the next tick. Small in-memory queue.
  setImmediate(() => {
    void processJob(id).catch((err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      void db
        .update(jobs)
        .set({ status: "failed", error: message, updatedAt: new Date() })
        .where(eq(jobs.id, id));
    });
  });
  return id;
}

async function processJob(id: string): Promise<void> {
  const buf = buffers.get(id);
  if (!buf) throw new Error(`No buffer found for job ${id}`);

  await db
    .update(jobs)
    .set({ status: "processing", progress: 10, updatedAt: new Date() })
    .where(eq(jobs.id, id));

  const regions = await ocrService.extractText(buf);
  await db.update(jobs).set({ progress: 50, updatedAt: new Date() }).where(eq(jobs.id, id));

  const translations = await Promise.all(
    regions.map((r) => translationService.translate(r.text, DEFAULT_TARGET_LANGUAGE)),
  );
  await db.update(jobs).set({ progress: 80, updatedAt: new Date() }).where(eq(jobs.id, id));

  const composed = await layoutService.compose(buf, regions, translations);
  const resultPath = `/tmp/manuscript-${id}.pdf`;
  // Note: we don't actually write to disk in the scaffold; we keep the bytes
  // in memory keyed by the job id. Good enough for the demo.
  buffers.set(`${id}:result`, composed);

  await db
    .update(jobs)
    .set({ status: "complete", progress: 100, resultPath, updatedAt: new Date() })
    .where(eq(jobs.id, id));
}

export async function getJob(id: string): Promise<Job | undefined> {
  const rows = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return rows[0];
}

export async function listJobs(): Promise<Job[]> {
  return db.select().from(jobs).orderBy(desc(jobs.createdAt)).limit(100);
}
