import { describe, expect, it } from "vitest";
import type { ExamDomain, ExamQuestion } from "@/content/exam/types";
import { countCorrect, domainBreakdown, isCorrect, mergeDomainTallies } from "./grading";

const mc = (id: string, domain: ExamDomain, correctLetter: "A" | "B" | "C" | "D" = "B"): ExamQuestion => ({
  id,
  domain,
  difficulty: "medium",
  type: "mc",
  prompt: "p",
  explanation: "e",
  choices: [
    { letter: "A", label: "a", value: 1 },
    { letter: "B", label: "b", value: 2 },
    { letter: "C", label: "c", value: 3 },
    { letter: "D", label: "d", value: 4 },
  ],
  correctLetter,
});
const spr = (id: string, domain: ExamDomain, correctValue = 7): ExamQuestion => ({
  id,
  domain,
  difficulty: "medium",
  type: "spr",
  prompt: "p",
  explanation: "e",
  correctValue,
});

describe("isCorrect", () => {
  it("grades multiple choice by letter", () => {
    const q = mc("q1", "algebra");
    expect(isCorrect(q, { letter: "B" })).toBe(true);
    expect(isCorrect(q, { letter: "A" })).toBe(false);
    expect(isCorrect(q, undefined)).toBe(false);
  });
  it("grades student-produced responses with the same forgiving parser as the Twin Drill", () => {
    const q = spr("q2", "advanced-math", 0.8);
    expect(isCorrect(q, { text: "4/5" })).toBe(true);
    expect(isCorrect(q, { text: "0.8" })).toBe(true);
    expect(isCorrect(q, { text: "−4/5" })).toBe(false); // wrong sign, a genuine mismatch
    expect(isCorrect(q, { text: "abc" })).toBe(false); // unparseable
    expect(isCorrect(q, { text: "" })).toBe(false);
    expect(isCorrect(q, undefined)).toBe(false);
  });
});

describe("countCorrect", () => {
  it("counts correct answers across a question list", () => {
    const questions = [mc("q1", "algebra", "B"), mc("q2", "algebra", "A"), spr("q3", "geometry-trig", 5)];
    const responses = { 0: { letter: "B" as const }, 1: { letter: "D" as const }, 2: { text: "5" } };
    expect(countCorrect(questions, responses)).toBe(2);
  });
  it("counts unanswered questions as incorrect", () => {
    expect(countCorrect([mc("q1", "algebra", "B")], {})).toBe(0);
  });
});

describe("domainBreakdown", () => {
  it("tallies correct/total per domain, including domains with zero questions", () => {
    const questions = [mc("q1", "algebra", "B"), mc("q2", "algebra", "A"), spr("q3", "geometry-trig", 5)];
    const responses = { 0: { letter: "B" as const }, 1: { letter: "A" as const }, 2: { text: "9" } };
    const tally = domainBreakdown(questions, responses);
    expect(tally.algebra).toEqual({ correct: 2, total: 2 });
    expect(tally["geometry-trig"]).toEqual({ correct: 0, total: 1 });
    expect(tally["advanced-math"]).toEqual({ correct: 0, total: 0 });
    expect(tally["data-analysis"]).toEqual({ correct: 0, total: 0 });
  });
});

describe("mergeDomainTallies", () => {
  it("adds two tallies domain by domain", () => {
    const a = {
      algebra: { correct: 2, total: 3 },
      "advanced-math": { correct: 0, total: 0 },
      "data-analysis": { correct: 1, total: 1 },
      "geometry-trig": { correct: 0, total: 2 },
    };
    const b = {
      algebra: { correct: 1, total: 1 },
      "advanced-math": { correct: 2, total: 2 },
      "data-analysis": { correct: 0, total: 0 },
      "geometry-trig": { correct: 1, total: 1 },
    };
    expect(mergeDomainTallies(a, b)).toEqual({
      algebra: { correct: 3, total: 4 },
      "advanced-math": { correct: 2, total: 2 },
      "data-analysis": { correct: 1, total: 1 },
      "geometry-trig": { correct: 1, total: 3 },
    });
  });
});
