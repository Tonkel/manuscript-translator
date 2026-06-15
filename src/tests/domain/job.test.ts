import { describe, it, expect } from "vitest";
import { canTransition, isTerminal, progressFor } from "@/domain/job";

describe("job state machine", () => {
  it("allows legal transitions only", () => {
    expect(canTransition("queued", "processing")).toBe(true);
    expect(canTransition("processing", "complete")).toBe(true);
    expect(canTransition("failed", "queued")).toBe(true); // retry
    expect(canTransition("complete", "processing")).toBe(false);
    expect(canTransition("queued", "complete")).toBe(false);
  });

  it("identifies terminal states", () => {
    expect(isTerminal("complete")).toBe(true);
    expect(isTerminal("failed")).toBe(true);
    expect(isTerminal("queued")).toBe(false);
  });

  it("maps status to progress", () => {
    expect(progressFor("queued")).toBe(0);
    expect(progressFor("processing")).toBe(50);
    expect(progressFor("complete")).toBe(100);
  });
});
