import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MODULE_SIZE } from "@/content/exam/types";
import { examReducer } from "./exam-reducer";
import type { ExamAction, ExamState } from "./types";

const NOW = 1_700_000_000_000;
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
});
afterEach(() => {
  vi.useRealTimers();
});

const run = (exam: ExamState | null, ...actions: ExamAction[]) => actions.reduce(examReducer, exam);
const start = (): ExamState => examReducer(null, { type: "exam/start" })!;

describe("exam/start", () => {
  it("creates a fresh module1 attempt with a 35-minute deadline", () => {
    const exam = start();
    expect(exam.phase).toBe("module1");
    expect(exam.cursor).toBe(0);
    expect(exam.startedAt).toBe(NOW);
    expect(exam.deadline).toBe(NOW + 35 * 60_000);
    expect(exam.module1Responses).toEqual({});
    expect(exam.module1Flags).toEqual([]);
    expect(exam.module1Result).toBeNull();
    expect(exam.module2Branch).toBeNull();
    expect(exam.result).toBeNull();
  });
  it("is a no-op while an attempt is already in progress (double-click safe)", () => {
    const exam = start();
    expect(examReducer(exam, { type: "exam/start" })).toBe(exam);
  });
  it("starts a brand new attempt from a finished report", () => {
    const reported: ExamState = { ...start(), phase: "report" };
    const next = examReducer(reported, { type: "exam/start" });
    expect(next).not.toBe(reported);
    expect(next!.phase).toBe("module1");
  });
});

describe("exam/exit", () => {
  it("clears the attempt", () => {
    expect(examReducer(start(), { type: "exam/exit" })).toBeNull();
  });
  it("is a no-op when there is nothing to exit", () => {
    expect(examReducer(null, { type: "exam/exit" })).toBeNull();
  });
});

describe("exam/answerMc", () => {
  it("records a choice for the current module", () => {
    const exam = run(start(), { type: "exam/answerMc", index: 0, letter: "C" })!;
    expect(exam.module1Responses[0]).toEqual({ letter: "C" });
  });
  it("re-choosing the same letter is a no-op", () => {
    const exam = run(start(), { type: "exam/answerMc", index: 0, letter: "C" })!;
    expect(examReducer(exam, { type: "exam/answerMc", index: 0, letter: "C" })).toBe(exam);
  });
  it("overwrites a different choice at the same index", () => {
    const exam = run(start(), { type: "exam/answerMc", index: 0, letter: "C" }, { type: "exam/answerMc", index: 0, letter: "D" })!;
    expect(exam.module1Responses[0]).toEqual({ letter: "D" });
  });
  it("ignores an out-of-range index", () => {
    const exam = start();
    expect(examReducer(exam, { type: "exam/answerMc", index: MODULE_SIZE, letter: "A" })).toBe(exam);
    expect(examReducer(exam, { type: "exam/answerMc", index: -1, letter: "A" })).toBe(exam);
  });
  it("is a no-op on a null exam", () => {
    expect(examReducer(null, { type: "exam/answerMc", index: 0, letter: "A" })).toBeNull();
  });
  it("does nothing outside an active module (between/report)", () => {
    const between: ExamState = { ...start(), phase: "between", module2Branch: "easier" };
    expect(examReducer(between, { type: "exam/answerMc", index: 0, letter: "A" })).toBe(between);
  });
});

describe("exam/answerSpr", () => {
  it("records typed text, and re-typing the same text is a no-op", () => {
    const exam = run(start(), { type: "exam/answerSpr", index: 2, text: "4/5" })!;
    expect(exam.module1Responses[2]).toEqual({ text: "4/5" });
    expect(examReducer(exam, { type: "exam/answerSpr", index: 2, text: "4/5" })).toBe(exam);
  });
  it("overwrites previously typed text", () => {
    const exam = run(start(), { type: "exam/answerSpr", index: 2, text: "4/5" }, { type: "exam/answerSpr", index: 2, text: "0.8" })!;
    expect(exam.module1Responses[2]).toEqual({ text: "0.8" });
  });
});

describe("exam/clearAnswer", () => {
  it("removes a recorded response", () => {
    const exam = run(start(), { type: "exam/answerMc", index: 0, letter: "C" }, { type: "exam/clearAnswer", index: 0 })!;
    expect(exam.module1Responses[0]).toBeUndefined();
  });
  it("is a no-op when there is nothing to clear", () => {
    const exam = start();
    expect(examReducer(exam, { type: "exam/clearAnswer", index: 0 })).toBe(exam);
  });
});

describe("exam/toggleFlag", () => {
  it("adds then removes a flag", () => {
    const flagged = run(start(), { type: "exam/toggleFlag", index: 5 })!;
    expect(flagged.module1Flags).toEqual([5]);
    const unflagged = examReducer(flagged, { type: "exam/toggleFlag", index: 5 })!;
    expect(unflagged.module1Flags).toEqual([]);
  });
});

describe("exam/goTo", () => {
  it("moves the cursor within the active module", () => {
    const exam = run(start(), { type: "exam/goTo", index: 7 })!;
    expect(exam.cursor).toBe(7);
  });
  it("is a no-op for the same index, an out-of-range index, or outside an active module", () => {
    const exam = start();
    expect(examReducer(exam, { type: "exam/goTo", index: 0 })).toBe(exam);
    expect(examReducer(exam, { type: "exam/goTo", index: MODULE_SIZE })).toBe(exam);
    const between: ExamState = { ...exam, phase: "between", module2Branch: "easier" };
    expect(examReducer(between, { type: "exam/goTo", index: 3 })).toBe(between);
  });
});

describe("exam/submitModule1", () => {
  it("scores module 1, routes to the harder module, and clears the deadline", () => {
    const exam = run(start(), { type: "exam/submitModule1", correct: 15 })!;
    expect(exam.phase).toBe("between");
    expect(exam.module1Result).toEqual({ correct: 15, total: MODULE_SIZE });
    expect(exam.module2Branch).toBe("harder");
    expect(exam.deadline).toBeNull();
  });
  it("routes to the easier module on a weaker score", () => {
    const exam = run(start(), { type: "exam/submitModule1", correct: 5 })!;
    expect(exam.module2Branch).toBe("easier");
  });
  it("is a no-op outside module 1 (prevents double-submit re-scoring)", () => {
    const exam = run(start(), { type: "exam/submitModule1", correct: 15 })!;
    expect(examReducer(exam, { type: "exam/submitModule1", correct: 3 })).toBe(exam);
  });
});

describe("exam/startModule2", () => {
  it("opens module 2 with a fresh deadline and cursor", () => {
    const between = run(start(), { type: "exam/submitModule1", correct: 15 })!;
    vi.setSystemTime(NOW + 60_000);
    const module2 = examReducer(between, { type: "exam/startModule2" })!;
    expect(module2.phase).toBe("module2");
    expect(module2.cursor).toBe(0);
    expect(module2.deadline).toBe(NOW + 60_000 + 35 * 60_000);
  });
  it("is a no-op when not in the between phase", () => {
    const exam = start();
    expect(examReducer(exam, { type: "exam/startModule2" })).toBe(exam);
  });
});

describe("exam/submitModule2", () => {
  const BY_DOMAIN = {
    algebra: { correct: 5, total: 7 },
    "advanced-math": { correct: 4, total: 7 },
    "data-analysis": { correct: 2, total: 4 },
    "geometry-trig": { correct: 3, total: 4 },
  };
  it("combines both modules into a final scored result", () => {
    const module2 = run(
      start(),
      { type: "exam/submitModule1", correct: 15 },
      { type: "exam/startModule2" },
    )!;
    const final = examReducer(module2, { type: "exam/submitModule2", correct: 14, byDomain: BY_DOMAIN })!;
    expect(final.phase).toBe("report");
    expect(final.deadline).toBeNull();
    expect(final.result).not.toBeNull();
    expect(final.result!.rawCorrect).toBe(29); // 15 + 14
    expect(final.result!.rawTotal).toBe(MODULE_SIZE * 2);
    expect(final.result!.module2Branch).toBe("harder");
    expect(final.result!.byDomain).toEqual(BY_DOMAIN);
  });
  it("is a no-op outside module 2", () => {
    const exam = start();
    expect(examReducer(exam, { type: "exam/submitModule2", correct: 10, byDomain: BY_DOMAIN })).toBe(exam);
  });
});

it("runs a full attempt end to end", () => {
  const final = run(
    start(),
    { type: "exam/answerMc", index: 0, letter: "B" },
    { type: "exam/toggleFlag", index: 3 },
    { type: "exam/submitModule1", correct: 10 },
    { type: "exam/startModule2" },
    {
      type: "exam/submitModule2",
      correct: 8,
      byDomain: {
        algebra: { correct: 3, total: 7 },
        "advanced-math": { correct: 2, total: 7 },
        "data-analysis": { correct: 1, total: 4 },
        "geometry-trig": { correct: 2, total: 4 },
      },
    },
  )!;
  expect(final.phase).toBe("report");
  expect(final.module2Branch).toBe("easier"); // 10/22 < 55% threshold
  expect(final.result!.rawCorrect).toBe(18);
  expect(final.result!.scaledScore).toBeGreaterThanOrEqual(200);
  expect(final.result!.scaledScore).toBeLessThanOrEqual(800);
});
