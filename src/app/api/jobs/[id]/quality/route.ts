import { NextResponse } from "next/server";
import { jobRepository } from "@/repositories/jobRepository";

export const dynamic = "force-dynamic";

/** Returns a job's stored quality summary. Placeholder until quality is
 *  persisted per job — currently derives a coarse value from status. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job = await jobRepository.findById(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    jobId: job.id,
    status: job.status,
    quality: job.status === "complete" ? 1 : 0,
  });
}
