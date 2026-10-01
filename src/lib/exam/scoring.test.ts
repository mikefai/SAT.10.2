import { describe, expect, it } from "vitest";
import { scaleScore } from "./scoring";

describe("scaleScore", () => {
  it("returns the floor score for zero correct on either branch", () => {
    expect(scaleScore(0, 44, "easier")).toBe(200);
    expect(scaleScore(0, 44, "harder")).toBe(200);
  });
  it("reaches the real SAT ceiling only on the harder branch with a perfect score", () => {
    expect(scaleScore(44, 44, "harder")).toBe(800);
    expect(scaleScore(44, 44, "easier")).toBeLessThan(800);
  });
  it("always rounds to the nearest 10, matching real score reporting", () => {
    for (const raw of [5, 11, 17, 23, 29, 35, 40]) {
      expect(scaleScore(raw, 44, "harder") % 10).toBe(0);
      expect(scaleScore(raw, 44, "easier") % 10).toBe(0);
    }
  });
  it("never decreases as raw score increases, on either branch", () => {
    for (const branch of ["easier", "harder"] as const) {
      let prev = 0;
      for (let raw = 0; raw <= 44; raw++) {
        const s = scaleScore(raw, 44, branch);
        expect(s).toBeGreaterThanOrEqual(prev);
        prev = s;
      }
    }
  });
  it("scores the harder branch at or above the easier branch for the same raw score", () => {
    for (let raw = 0; raw <= 44; raw++) {
      expect(scaleScore(raw, 44, "harder")).toBeGreaterThanOrEqual(scaleScore(raw, 44, "easier"));
    }
  });
  it("floors at 200 when there are no questions", () => {
    expect(scaleScore(0, 0, "harder")).toBe(200);
  });
});
