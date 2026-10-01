import { describe, expect, it } from "vitest";
import { formatNumber, isPerfectSquare, range, simplifySqrt } from "./numbers";

describe("formatNumber", () => {
  it("uses a true minus and trims zeros", () => {
    expect(formatNumber(-3)).toBe("−3");
    expect(formatNumber(2)).toBe("2");
    expect(formatNumber(0.5)).toBe("0.5");
    expect(formatNumber(1 / 3)).toBe("0.33");
  });
  it("never prints −0", () => {
    expect(formatNumber(-0)).toBe("0");
    expect(formatNumber(-0.001)).toBe("0");
  });
});

describe("range", () => {
  it("is float-safe", () => {
    const r = range(-4, 4, 0.5);
    expect(r).toHaveLength(17);
    expect(r[0]).toBe(-4);
    expect(r[16]).toBe(4);
    expect(r).toContain(0.5);
  });
});

describe("radicals", () => {
  it("detects perfect squares", () => {
    expect(isPerfectSquare(25)).toBe(true);
    expect([26, -4, 2.25].map(isPerfectSquare)).toEqual([false, false, false]);
  });
  it("simplifies square roots", () => {
    expect(simplifySqrt(28)).toEqual({ outside: 2, inside: 7 });
    expect(simplifySqrt(72)).toEqual({ outside: 6, inside: 2 });
    expect(simplifySqrt(49)).toEqual({ outside: 7, inside: 1 });
    expect(simplifySqrt(13)).toEqual({ outside: 1, inside: 13 });
  });
});
