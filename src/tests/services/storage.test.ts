import { describe, it, expect } from "vitest";
import { InMemoryBlobStore } from "@/services/storage";

describe("InMemoryBlobStore", () => {
  it("puts and gets a blob", async () => {
    const s = new InMemoryBlobStore();
    await s.put("k", Buffer.from("hi"));
    const r = await s.get("k");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.toString()).toBe("hi");
  });

  it("returns a NotFoundError for a missing key", async () => {
    const s = new InMemoryBlobStore();
    const r = await s.get("missing");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.kind).toBe("not_found");
  });

  it("deletes and reports presence", async () => {
    const s = new InMemoryBlobStore();
    await s.put("k", Buffer.from("x"));
    expect(await s.has("k")).toBe(true);
    await s.delete("k");
    expect(await s.has("k")).toBe(false);
  });
});
