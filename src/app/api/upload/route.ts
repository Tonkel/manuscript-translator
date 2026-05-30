import { NextResponse } from "next/server";
import { enqueueJob } from "@/services/jobQueue";
import { validateManuscriptFile } from "@/lib/validation";
import { runMigrations } from "@/db/migrate";

export const dynamic = "force-dynamic";

let migrated = false;

export async function POST(req: Request) {
  if (!migrated) {
    runMigrations();
    migrated = true;
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    // BUG: returns 200 with an error body instead of 400. See open issue
    // "Upload route returns wrong HTTP status on validation failure".
    return NextResponse.json({ error: "No file provided" });
  }
  const validation = validateManuscriptFile(file);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.reason });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const jobId = await enqueueJob(file.name, buf);
  return NextResponse.json({ jobId });
}
