import { NextResponse } from "next/server";
import { glossaryRepository } from "@/repositories/glossaryRepository";
import type { GlossaryEntry } from "@/domain/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await glossaryRepository.all();
  return NextResponse.json({ entries });
}

export async function POST(req: Request) {
  const body = (await req.json()) as { entries?: GlossaryEntry[] };
  if (!Array.isArray(body.entries)) {
    return NextResponse.json({ error: "entries[] required" }, { status: 400 });
  }
  await glossaryRepository.addAll(body.entries);
  const all = await glossaryRepository.all();
  return NextResponse.json({ count: all.length }, { status: 201 });
}
