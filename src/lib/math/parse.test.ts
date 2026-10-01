import { describe, expect, it } from "vitest";
import { answersMatch, parseNumericAnswer as p } from "./parse";

describe("parseNumericAnswer", () => {
  it("accepts forgiving number formats", () => {
    expect(p("7")).toBe(7);
    expect(p(" 7 ")).toBe(7);
    expect(p("+3")).toBe(3);
    expect(p("-3")).toBe(-3);
    expect(p("−3")).toBe(-3);
    expect(p("– 3")).toBe(-3);
    expect(p("0.8")).toBe(0.8);
    expect(p(".8")).toBe(0.8);
    expect(p("3.")).toBe(3);
    expect(p("4/5")).toBe(0.8);
    expect(p("−4/5")).toBe(-0.8);
    expect(p("8/10")).toBe(0.8);
    expect(p("49π")).toBe(49);
    expect(p("49 pi")).toBe(49);
    expect(p("1,000")).toBe(1000);
  });
  it("rejects things that are not numbers", () => {
    for (const bad of ["", "   ", "abc", "4/0", "--3", "3-", "1/2/3", ".", "π", "0,8"]) expect(p(bad)).toBeNull();
  });
});

describe("answersMatch", () => {
  it("tolerates float noise only", () => {
    expect(answersMatch(0.1 + 0.2, 0.3)).toBe(true);
    expect(answersMatch(-0, 0)).toBe(true);
    expect(answersMatch(64.01, 64)).toBe(false);
  });
});
