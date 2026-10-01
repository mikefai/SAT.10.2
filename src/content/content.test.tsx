import { describe, expect, it } from "vitest";
import { ANCHORS } from "./anchors";
import { DECODER_QUESTIONS as QS } from "./decoder";
import { TRAPS } from "./traps";
import { TWIN_SETS as SETS } from "./twins";

const q = (id: string) => {
  const found = QS.find((x) => x.id === id);
  if (!found) throw new Error(id);
  return found;
};
const val = (id: string, letter: string) => q(id).choices.find((c) => c.letter === letter)!.value;
const keyed = (id: string) => q(id).choices.find((c) => c.correct)!.value;

describe("decoder structure", () => {
  it("has 5 unique questions covering all four topics", () => {
    expect(QS).toHaveLength(5);
    expect(new Set(QS.map((x) => x.id)).size).toBe(5);
    expect(new Set(QS.map((x) => x.topic))).toEqual(new Set(["linear", "systems", "data", "geometry"]));
  });
  it("gives each question A–D, one correct choice, and ascending numeric values", () => {
    for (const x of QS) {
      expect(x.choices.map((c) => c.letter)).toEqual(["A", "B", "C", "D"]);
      expect(x.choices.filter((c) => c.correct)).toHaveLength(1);
      const nums = x.choices.map((c) => c.value).filter((v): v is number => v !== null);
      expect([...nums].sort((a, b) => a - b)).toEqual(nums);
      expect(new Set(nums).size).toBe(nums.length);
      const nullIndex = x.choices.findIndex((c) => c.value === null);
      expect(nullIndex === -1 || nullIndex === 3).toBe(true);
    }
  });
  it("gives every wrong choice a catalogued trap, 2–3 work lines and exactly one slip", () => {
    for (const x of QS)
      for (const c of x.choices.filter((c) => !c.correct)) {
        expect(c.trap && TRAPS[c.trap.id]).toBeTruthy();
        expect(c.trap!.work.length).toBeGreaterThanOrEqual(2);
        expect(c.trap!.work.length).toBeLessThanOrEqual(3);
        expect(c.trap!.work.filter((w) => w.slip)).toHaveLength(1);
      }
  });
});

describe("decoder math (re-derived)", () => {
  it("D1: 5 − 2(x − 4) = 3x − 7", () => {
    const lhs = (x: number) => 5 - 2 * (x - 4);
    const rhs = (x: number) => 3 * x - 7;
    expect(keyed("distribute-negative")).toBe(4);
    expect(lhs(4)).toBe(rhs(4));
    expect(val("distribute-negative", "A")).toBeCloseTo((5 - 8 + 7) / 5); // −2 applied to x only
    expect(val("distribute-negative", "C")).toBe(13 + 7); // −2x moved without a sign flip
    expect(val("distribute-negative", "D")).toBeNull(); // (5 − 2)(x − 4): 3x − 12 = 3x − 7
  });
  it("D2: 3x + 6 = 21 → x + 2", () => {
    const x = (21 - 6) / 3;
    expect(keyed("answer-the-question")).toBe(x + 2);
    expect(val("answer-the-question", "A")).toBe(21 / 3 - 6 + 2); // 6 not divided
    expect(val("answer-the-question", "B")).toBe(x); // answered x
    expect(val("answer-the-question", "D")).toBe((21 + 6) / 3 + 2); // added 6
  });
  it("D3: 2x + 3y = 12, 2x − y = 4 → y", () => {
    const det = 2 * -1 - 3 * 2;
    const x = (12 * -1 - 3 * 4) / det;
    const y = (2 * 4 - 12 * 2) / det;
    expect([x, y]).toEqual([3, 2]);
    expect(keyed("eliminate-carefully")).toBe(y);
    expect(val("eliminate-carefully", "B")).toBe(x); // answered x
    expect(val("eliminate-carefully", "C")).toBe((12 - 4) / (3 - 1)); // 3y − (−y) taken as 2y
    expect(val("eliminate-carefully", "D")).toBe(12 - 4); // stopped at 4y
  });
  it("D4: $40 → $50", () => {
    expect(keyed("percent-change")).toBe(((50 - 40) / 40) * 100);
    expect(val("percent-change", "A")).toBe(50 - 40);
    expect(val("percent-change", "B")).toBeCloseTo(((50 - 40) / 50) * 100); // 0.2 × 100 is not exact in floating point
    expect(val("percent-change", "D")).toBe((50 / 40) * 100);
  });
  it("D5: legs 6 and 8", () => {
    expect(keyed("hypotenuse")).toBe(Math.hypot(6, 8));
    expect(val("hypotenuse", "A")).toBeCloseTo(Math.sqrt(64 - 36));
    expect(val("hypotenuse", "C")).toBe(6 + 8);
    expect(val("hypotenuse", "D")).toBe(36 + 64);
  });
  it("puts every lines-visual point on both of its lines", () => {
    const specs = [...QS.map((x) => x.visual), ...SETS.flatMap((s) => [s.sample.visual, s.twin.visual])];
    for (const v of specs)
      if (v.kind === "lines") for (const l of v.lines) expect(l.m * v.point[0] + l.b).toBeCloseTo(v.point[1]);
  });
});

describe("twin sets", () => {
  const answers = (id: string) => SETS.find((s) => s.id === id)!.twin.steps.map((s) => s.answer);
  it("has 4 unique sets covering all four topics", () => {
    expect(SETS.map((s) => s.id)).toEqual(["both-sides", "substitution", "percent-off", "circle-area"]);
    expect(new Set(SETS.map((s) => s.topic)).size).toBe(4);
  });
  it("re-derives every guided answer", () => {
    expect(answers("both-sides")).toEqual([5 - 2, 11 + 4, (11 + 4) / (5 - 2)]);
    const x = (19 - 4) / 3;
    expect(answers("substitution")).toEqual([2 + 1, x, x + 4]);
    expect(2 * x + (x + 4)).toBe(19);
    expect(answers("percent-off")).toEqual([100 / 20, 80 / 5, 80 - 80 / 5]);
    expect(answers("circle-area")).toEqual([14 / 2, 7 * 7, 7 * 7]);
  });
  it("gives each step 3 distinct ascending options, including the answer, with a message per wrong option", () => {
    for (const s of SETS)
      for (const step of s.twin.steps) {
        const values = step.options.map((o) => o.value);
        expect([...values].sort((a, b) => a - b)).toEqual(values);
        expect(new Set(values).size).toBe(3);
        expect(values).toContain(step.answer);
        for (const v of values.filter((v) => v !== step.answer)) expect(step.mistakes.some((m) => m.value === v)).toBe(true);
        expect(step.mistakes.every((m) => m.value !== step.answer)).toBe(true);
      }
  });
});

it("has the 4 anchors in order", () => {
  expect(ANCHORS.map((a) => a.id)).toEqual(["slope", "vertex", "quadratic", "pythagorean"]);
});
