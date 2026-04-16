import { NextResponse } from "next/server";
import { getJob } from "@/services/jobQueue";

export const dynamic = "force-dynamic";

// Currently returns a JSON snapshot. The frontend polls this endpoint. See
// open issue "Replace polling progress with SSE streaming + optimistic UI"
// for converting this to a Server-Sent Events stream.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const job = await getJob(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    status: job.status,
    progress: job.progress,
    error: job.error,
  });
}
