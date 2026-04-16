import { NextResponse } from "next/server";
import { listJobs } from "@/services/jobQueue";

export const dynamic = "force-dynamic";

export async function GET() {
  const all = await listJobs();
  return NextResponse.json(all);
}
