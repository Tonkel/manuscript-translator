"use client";

import { useEffect, useState } from "react";

interface ProgressPayload {
  status: string;
  progress: number;
  error?: string | null;
}

// Polls the progress endpoint at a fixed interval. The endpoint currently
// returns a JSON snapshot; this should become an SSE stream. See open issue
// "Replace polling progress with SSE streaming + optimistic UI".
export default function JobProgress({ jobId }: { jobId: string }) {
  const [data, setData] = useState<ProgressPayload | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function tick() {
      try {
        const res = await fetch(`/api/jobs/${jobId}/progress`);
        const json = (await res.json()) as ProgressPayload;
        if (!cancelled) setData(json);
        if (!cancelled && json.status !== "complete" && json.status !== "failed") {
          setTimeout(tick, 1000);
        }
      } catch {
        if (!cancelled) setTimeout(tick, 2000);
      }
    }
    void tick();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  if (!data) return <p>Loading...</p>;
  return (
    <div>
      <p>Status: {data.status}</p>
      <progress value={data.progress} max={100} />
      <p>{data.progress}%</p>
      {data.error ? <p style={{ color: "crimson" }}>Error: {data.error}</p> : null}
    </div>
  );
}
