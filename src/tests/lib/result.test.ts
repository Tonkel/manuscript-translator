import { describe, it, expect } from "vitest";
import { ok, err, isOk, isErr, mapResult, unwrapOr } from "@/lib/result";

describe("result", () => {
  it("constructs and narrows ok/err", () => {
    expect(isOk(ok(1))).toBe(true);
    expect(isErr(err("x"))).toBe(true);
    expect(isOk(err("x"))).toBe(false);
  });

  it("maps only the success value", () => {
    expect(mapResult(ok(2), (n) => n * 3)).toEqual(ok(6));
    expect(mapResult(err<string>("bad"), (n: number) => n * 3)).toEqual(err("bad"));
  });

  it("unwrapOr returns fallback on error", () => {
    expect(unwrapOr(ok(5), 0)).toBe(5);
    expect(unwrapOr(err<string>("nope"), 42)).toBe(42);
  });
});
