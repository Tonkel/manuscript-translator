import { systemClock, type Clock } from "@/lib/clock";
import type { PipelineStage } from "@/domain/types";

/** Lightweight in-process metrics for pipeline stage timings. */
export interface StageTiming {
  stage: PipelineStage;
  durationMs: number;
  at: Date;
}

export class MetricsRecorder {
  private timings: StageTiming[] = [];
  constructor(private clock: Clock = systemClock) {}

  record(stage: PipelineStage, durationMs: number): void {
    this.timings.push({ stage, durationMs, at: this.clock.now() });
  }

  /** Time an async stage and record its duration. */
  async time<T>(stage: PipelineStage, fn: () => Promise<T>): Promise<T> {
    const start = this.clock.now().getTime();
    const out = await fn();
    this.record(stage, this.clock.now().getTime() - start);
    return out;
  }

  totalMs(): number {
    return this.timings.reduce((s, t) => s + t.durationMs, 0);
  }

  byStage(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const t of this.timings) out[t.stage] = (out[t.stage] ?? 0) + t.durationMs;
    return out;
  }

  snapshot(): StageTiming[] {
    return this.timings.slice();
  }
}
