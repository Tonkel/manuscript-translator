"use client";

import { useState, type ChangeEvent } from "react";
import { validateManuscriptFile } from "@/lib/validation";

export default function Dropzone() {
  const [status, setStatus] = useState<string>("Idle");

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateManuscriptFile({
      type: file.type,
      size: file.size,
    });
    if (!validation.ok) {
      setStatus(`Error: ${validation.reason}`);
      return;
    }
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = (await res.json()) as { jobId?: string; error?: string };
    if (json.jobId) {
      setStatus(`Job created: ${json.jobId}`);
      window.location.href = `/jobs/${json.jobId}`;
    } else {
      setStatus(`Error: ${json.error ?? "unknown"}`);
    }
  }

  return (
    <div
      style={{
        border: "2px dashed #8a6a3a",
        padding: "3rem",
        textAlign: "center",
        borderRadius: 8,
        background: "#fffaf0",
      }}
    >
      <p>Drop a single manuscript file here, or click to choose.</p>
      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff"
        onChange={handleChange}
      />
      <p style={{ marginTop: "1rem" }}>{status}</p>
    </div>
  );
}
