import type { JobStatus } from "@/domain/types";

/** Pure job-status state machine. The repository persists; this decides what
 *  transitions are legal and what progress each status implies. */
const TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  queued: ["processing", "failed"],
  processing: ["complete", "failed"],
  complete: [],
  failed: ["queued"], // retry re-queues
};

export function canTransition(from: JobStatus, to: JobStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminal(status: JobStatus): boolean {
  return status === "complete" || status === "failed";
}

export function progressFor(status: JobStatus): number {
  switch (status) {
    case "queued":
      return 0;
    case "processing":
      return 50;
    case "complete":
      return 100;
    case "failed":
      return 0;
  }
}
