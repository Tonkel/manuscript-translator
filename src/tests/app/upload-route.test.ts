import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  enqueueJob: vi.fn(async () => "job_test"),
  runMigrations: vi.fn(),
}));

vi.mock("@/db/migrate", () => ({
  runMigrations: mocks.runMigrations,
}));

vi.mock("@/services/jobQueue", () => ({
  enqueueJob: mocks.enqueueJob,
}));

async function postUpload(form: FormData) {
  const { POST } = await import("@/app/api/upload/route");

  return POST(
    new Request("http://localhost/api/upload", {
      method: "POST",
      body: form,
    }),
  );
}

describe("upload route", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.enqueueJob.mockClear();
    mocks.runMigrations.mockClear();
  });

  it("returns 400 when the upload has no file", async () => {
    const response = await postUpload(new FormData());

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "No file provided" });
    expect(mocks.enqueueJob).not.toHaveBeenCalled();
  });

  it("returns 400 when the file type is unsupported", async () => {
    const form = new FormData();
    form.set("file", new File(["plain text"], "notes.txt", { type: "text/plain" }));

    const response = await postUpload(form);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Unsupported file type: text/plain",
    });
    expect(mocks.enqueueJob).not.toHaveBeenCalled();
  });

  it("keeps accepted uploads on the 200 success path", async () => {
    const form = new FormData();
    form.set("file", new File(["%PDF-1.7"], "scan.pdf", { type: "application/pdf" }));

    const response = await postUpload(form);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ jobId: "job_test" });
    expect(mocks.enqueueJob).toHaveBeenCalledOnce();
  });
});
