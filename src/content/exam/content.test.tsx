import { describe, expect, it } from "vitest";
import { EXAM_DOMAIN_COUNT, EXAM_DOMAINS, MODULE_SIZE } from "./types";
import { EXAM_MODULE_1 } from "./module1";
import { EXAM_MODULE_2_EASIER } from "./module2-easier";
import { EXAM_MODULE_2_HARDER } from "./module2-harder";
import type { ExamQuestion } from "./types";

const MODULES = {
  "Module 1": EXAM_MODULE_1,
  "Module 2 — easier": EXAM_MODULE_2_EASIER,
  "Module 2 — harder": EXAM_MODULE_2_HARDER,
};

describe.each(Object.entries(MODULES))("%s structure", (_name, questions) => {
  it(`has exactly ${MODULE_SIZE} questions`, () => {
    expect(questions).toHaveLength(MODULE_SIZE);
  });
  it("has unique IDs", () => {
    expect(new Set(questions.map((q) => q.id)).size).toBe(questions.length);
  });
  it("matches the official domain-weighting blueprint", () => {
    for (const domain of EXAM_DOMAINS) {
      expect(questions.filter((q) => q.domain === domain)).toHaveLength(EXAM_DOMAIN_COUNT[domain]);
    }
  });
  it("gives every multiple-choice question exactly 4 distinct choices and a valid key", () => {
    for (const q of questions) {
      if (q.type !== "mc") continue;
      expect(q.choices).toHaveLength(4);
      expect(q.choices.map((c) => c.letter)).toEqual(["A", "B", "C", "D"]);
      expect(q.choices.some((c) => c.letter === q.correctLetter)).toBe(true);
    }
  });
  it("gives every student-produced-response question a finite numeric answer", () => {
    for (const q of questions) {
      if (q.type !== "spr") continue;
      expect(Number.isFinite(q.correctValue)).toBe(true);
    }
  });
  it("includes a mix of multiple-choice and student-produced-response items", () => {
    const sprCount = questions.filter((q) => q.type === "spr").length;
    expect(sprCount).toBeGreaterThan(0);
    expect(sprCount).toBeLessThan(MODULE_SIZE);
  });
});

const find = (questions: ExamQuestion[], id: string): ExamQuestion => {
  const q = questions.find((x) => x.id === id);
  if (!q) throw new Error(`missing question ${id}`);
  return q;
};
const spr = (questions: ExamQuestion[], id: string) => {
  const q = find(questions, id);
  if (q.type !== "spr") throw new Error(`${id} is not spr`);
  return q.correctValue;
};
function mcKey(questions: ExamQuestion[], id: string): string {
  const q = find(questions, id);
  if (q.type !== "mc") throw new Error(`${id} is not mc`);
  return q.correctLetter;
}

// Each assertion below re-derives the keyed answer from the question's stated givens
// using a plain arithmetic expression, independent of how the content file phrases it —
// the same cross-check pattern used for the Trap Decoder and Twin Drill content.

describe("Module 1 math", () => {
  const Q = EXAM_MODULE_1;
  it("m1-alg-1", () => expect(mcKey(Q, "m1-alg-1")).toBe("B")); // (20-5)/3 = 5
  it("m1-alg-2", () => expect(mcKey(Q, "m1-alg-2")).toBe("C")); // 2(x-3)=x+4 -> x=10
  it("m1-alg-3", () => expect(spr(Q, "m1-alg-3")).toBe(Math.floor((13 + 7) / 4)));
  it("m1-alg-4", () => {
    const x = (9 + 1) / 5; // 2x + (3x - 1) = 9
    expect(mcKey(Q, "m1-alg-4")).toBe("C");
    expect(x + (3 * x - 1)).toBe(7);
  });
  it("m1-alg-5", () => {
    const x = 12 / 3; // (2x+y)+(x-y)=11+1
    const y = 11 - 2 * x;
    expect(spr(Q, "m1-alg-5")).toBe(x * y);
  });
  it("m1-alg-6", () => expect(mcKey(Q, "m1-alg-6")).toBe("C"));
  it("m1-alg-7", () => expect(spr(Q, "m1-alg-7")).toBe((13 - 5) / (6 - 2)));

  it("m1-am-1", () => {
    const roots = [2, 3]; // x^2-5x+6=(x-2)(x-3)
    expect(roots[0] * roots[1]).toBe(6);
    expect(roots[0] + roots[1]).toBe(5);
    expect(spr(Q, "m1-am-1")).toBe(Math.max(...roots));
  });
  it("m1-am-2", () => {
    const t = 6 / 2;
    expect(mcKey(Q, "m1-am-2")).toBe("C");
    expect(-(t * t) + 6 * t).toBe(9);
  });
  it("m1-am-3", () => expect(mcKey(Q, "m1-am-3")).toBe("A"));
  it("m1-am-4", () => expect(mcKey(Q, "m1-am-4")).toBe("B")); // (2/3)*3 = 2
  it("m1-am-5", () => {
    const roots = [5, -3]; // x^2-2x-15=(x-5)(x+3)
    expect(roots[0] * roots[1]).toBe(-15);
    expect(spr(Q, "m1-am-5")).toBe(roots[0] + roots[1]);
  });
  it("m1-am-6", () => {
    expect(mcKey(Q, "m1-am-6")).toBe("C");
    expect(2 * (-2) ** 2 - 3).toBe(5);
  });
  it("m1-am-7", () => {
    // x^2 = 2x+3 -> x^2-2x-3=0 -> (x-3)(x+1)=0
    const roots = [3, -1];
    expect(roots[0] * roots[0]).toBe(2 * roots[0] + 3);
    expect(roots[1] * roots[1]).toBe(2 * roots[1] + 3);
    expect(spr(Q, "m1-am-7")).toBe(roots[0] + roots[1]);
  });

  it("m1-da-1", () => expect(spr(Q, "m1-da-1")).toBeCloseTo(((92 - 80) / 80) * 100));
  it("m1-da-2", () => expect(spr(Q, "m1-da-2")).toBe((3 * 5) / 2));
  it("m1-da-3", () => expect(mcKey(Q, "m1-da-3")).toBe("B"));
  it("m1-da-4", () => expect(spr(Q, "m1-da-4")).toBeCloseTo(3 / 10));

  it("m1-geo-1", () => expect(mcKey(Q, "m1-geo-1")).toBe("B"));
  it("m1-geo-2", () => expect(spr(Q, "m1-geo-2")).toBe(4 * 3 * 5));
  it("m1-geo-3", () => {
    expect(mcKey(Q, "m1-geo-3")).toBe("A");
    expect(Math.sqrt(9 * 9 + 12 * 12)).toBe(15);
  });
  it("m1-geo-4", () => expect(spr(Q, "m1-geo-4")).toBeCloseTo(6 / 10));
});

describe("Module 2 easier math", () => {
  const Q = EXAM_MODULE_2_EASIER;
  it("m2e-alg-1", () => expect(mcKey(Q, "m2e-alg-1")).toBe("B"));
  it("m2e-alg-2", () => expect(spr(Q, "m2e-alg-2")).toBe(21 / 3 - 2));
  it("m2e-alg-3", () => expect(spr(Q, "m2e-alg-3")).toBe(Math.ceil((11 - 1) / 2) - 1));
  it("m2e-alg-4", () => {
    const x = (13 - 1) / 3;
    const y = 2 * x + 1;
    expect(mcKey(Q, "m2e-alg-4")).toBe("C");
    expect(y - x).toBe(5);
  });
  it("m2e-alg-5", () => {
    const y = 14 - 3 * 2;
    expect(spr(Q, "m2e-alg-5")).toBe(2 + y);
  });
  it("m2e-alg-6", () => expect(mcKey(Q, "m2e-alg-6")).toBe("B"));
  it("m2e-alg-7", () => expect(mcKey(Q, "m2e-alg-7")).toBe("B")); // (11-2)/(3-0)=3

  it("m2e-am-1", () => expect(spr(Q, "m2e-am-1")).toBe(Math.sqrt(9)));
  it("m2e-am-2", () => expect(mcKey(Q, "m2e-am-2")).toBe("B")); // (4-2)^2+1=5
  it("m2e-am-3", () => expect(spr(Q, "m2e-am-3")).toBe(Math.log2(8)));
  it("m2e-am-4", () => expect(mcKey(Q, "m2e-am-4")).toBe("B")); // x^(5-2)
  it("m2e-am-5", () => {
    const roots = [2, 5]; // x^2-7x+10=(x-2)(x-5)
    expect(roots[0] + roots[1]).toBe(7);
    expect(spr(Q, "m2e-am-5")).toBe(roots[0] * roots[1]);
  });
  it("m2e-am-6", () => {
    expect(mcKey(Q, "m2e-am-6")).toBe("C");
    expect(3 ** 2 + 2 * 3).toBe(15);
  });
  it("m2e-am-7", () => expect(spr(Q, "m2e-am-7")).toBe(Math.sqrt(49)));

  it("m2e-da-1", () => expect(spr(Q, "m2e-da-1")).toBe(0.2 * 150));
  it("m2e-da-2", () => expect(mcKey(Q, "m2e-da-2")).toBe("B"));
  it("m2e-da-3", () => expect(mcKey(Q, "m2e-da-3")).toBe("B"));
  it("m2e-da-4", () => expect(spr(Q, "m2e-da-4")).toBe(3 / 6));

  it("m2e-geo-1", () => expect(mcKey(Q, "m2e-geo-1")).toBe("C"));
  it("m2e-geo-2", () => expect(mcKey(Q, "m2e-geo-2")).toBe("B"));
  it("m2e-geo-3", () => {
    expect(spr(Q, "m2e-geo-3")).toBe(Math.sqrt(3 * 3 + 4 * 4));
  });
  it("m2e-geo-4", () => expect(mcKey(Q, "m2e-geo-4")).toBe("B"));
});

describe("Module 2 harder math", () => {
  const Q = EXAM_MODULE_2_HARDER;
  it("m2h-alg-1", () => expect(spr(Q, "m2h-alg-1")).toBe(10 / (2 / 3)));
  it("m2h-alg-2", () => expect(spr(Q, "m2h-alg-2")).toBe(Math.ceil(12 / 2)));
  it("m2h-alg-3", () => {
    const x = 24 / 6;
    const y = (25 - 4 * x) / 3;
    expect(spr(Q, "m2h-alg-3")).toBe(x * y);
  });
  it("m2h-alg-4", () => {
    const c = (3 * 31 - 78) / (3 - 2);
    const a = 31 - c;
    expect(mcKey(Q, "m2h-alg-4")).toBe("B");
    expect(a - c).toBe(1);
    expect(3 * a + 2 * c).toBe(78);
  });
  it("m2h-alg-5", () => expect(spr(Q, "m2h-alg-5")).toBe(5 / 0.5));
  it("m2h-alg-6", () => {
    const sol1 = (9 + 5) / 2;
    const sol2 = (-9 + 5) / 2;
    expect(spr(Q, "m2h-alg-6")).toBe(sol1 + sol2);
  });
  it("m2h-alg-7", () => expect(spr(Q, "m2h-alg-7")).toBe(4 / (12 / 6)));

  it("m2h-am-1", () => {
    const roots = [-7, 3];
    expect(roots[0] * roots[1]).toBe(-21);
    expect(spr(Q, "m2h-am-1")).toBe(Math.max(...roots));
  });
  it("m2h-am-2", () => expect(spr(Q, "m2h-am-2")).toBe(6 / 2));
  it("m2h-am-3", () => expect(spr(Q, "m2h-am-3")).toBe(Math.sqrt(4 * 1 * 9)));
  it("m2h-am-4", () => expect(spr(Q, "m2h-am-4")).toBe(800 * 0.5 ** (9 / 3)));
  it("m2h-am-5", () => expect(spr(Q, "m2h-am-5")).toBe((2 + 3) ** 2));
  it("m2h-am-6", () => {
    // (x+2)/(x-1)=3 -> x+2=3x-3 -> 5=2x
    expect(spr(Q, "m2h-am-6")).toBe(5 / 2);
  });
  it("m2h-am-7", () => {
    const x = 40 / 4;
    expect(spr(Q, "m2h-am-7")).toBe(-2 * x * x + 40 * x - 150);
  });

  it("m2h-da-1", () => expect(spr(Q, "m2h-da-1")).toBe((20 * 80 + 30 * 90) / 50));
  it("m2h-da-2", () => expect(spr(Q, "m2h-da-2")).toBeCloseTo((1.2 * 0.9 - 1) * 100));
  it("m2h-da-3", () => expect(spr(Q, "m2h-da-3")).toBeCloseTo((4 / 10) * (3 / 9)));
  it("m2h-da-4", () => expect(mcKey(Q, "m2h-da-4")).toBe("A"));

  it("m2h-geo-1", () => expect(spr(Q, "m2h-geo-1")).toBe(8 * (5 / 2) ** 2));
  it("m2h-geo-2", () => expect(mcKey(Q, "m2h-geo-2")).toBe("B"));
  it("m2h-geo-3", () => expect(mcKey(Q, "m2h-geo-3")).toBe("C"));
  it("m2h-geo-4", () => {
    expect(5 * 5 + 12 * 12).toBe(13 * 13);
    expect(spr(Q, "m2h-geo-4")).toBeCloseTo(12 / 13);
  });
});
