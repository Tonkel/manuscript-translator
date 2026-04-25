import { NextResponse } from "next/server";
import { enqueueJob } from "@/services/jobQueue";
import { isWithinSizeLimit } from "@/lib/validation";
import { runMigrations } from "@/db/migrate";

// Hardcoded inline. Should live in src/lib/config.ts. See open issue
// "Extract MAX_FILE_SIZE magic number to config".
const MAX_FILE_SIZE = 10485760;

export const dynamic = "force-dynamic";

// Duplicated from src/components/Dropzone.tsx - see "Extract shared validation
// helper" issue.
const ACCEPTED = ["application/pdf", "image/png", "image/jpeg", "image/tiff"];

let migrated = false;

export async function POST(req: Request) {
  if (!migrated) {
    runMigrations();
    migrated = true;
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400, statusText: "Bad Request", },
    );
  }
  if (!ACCEPTED.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}`, },
      { status: 415, statusText: "Unsupported Media Type", },
    );
  }

  // BUG: MAX_FILE_SIZE is imported via isWithinSizeLimit but never actually
  // checked here. See open issue "Enforce MAX_FILE_SIZE in upload route".
  void MAX_FILE_SIZE;
  void isWithinSizeLimit;

  const buf = Buffer.from(await file.arrayBuffer());
  const jobId = await enqueueJob(file.name, buf);
  return NextResponse.json({ jobId });
}
