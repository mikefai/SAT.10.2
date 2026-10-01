import type { ReactNode } from "react";
import type { ChoiceLetter } from "@/lib/progress/types";

export type ExamDomain = "algebra" | "advanced-math" | "data-analysis" | "geometry-trig";
export const EXAM_DOMAINS: readonly ExamDomain[] = ["algebra", "advanced-math", "data-analysis", "geometry-trig"];
export const EXAM_DOMAIN_LABEL: Record<ExamDomain, string> = {
  algebra: "Algebra",
  "advanced-math": "Advanced Math",
  "data-analysis": "Problem-Solving & Data Analysis",
  "geometry-trig": "Geometry & Trigonometry",
};
// Per-module question counts, matching the official Digital SAT Math blueprint weighting
// (Algebra ~35%, Advanced Math ~35%, Problem-Solving & Data Analysis ~15%, Geometry & Trig ~15%).
export const EXAM_DOMAIN_COUNT: Record<ExamDomain, number> = {
  algebra: 7,
  "advanced-math": 7,
  "data-analysis": 4,
  "geometry-trig": 4,
};

export type ExamDifficulty = "easy" | "medium" | "hard";
export interface DomainTally {
  correct: number;
  total: number;
}
export type ExamBranch = "easier" | "harder";

export const MODULE_SIZE = 22; // questions per module, matching the real Digital SAT Math section
export const MODULE_MINUTES = 35; // timed minutes per module, matching the real Digital SAT Math section

export interface ExamMcChoice {
  letter: ChoiceLetter;
  label: ReactNode;
}
interface ExamQuestionBase {
  id: string;
  domain: ExamDomain;
  difficulty: ExamDifficulty;
  prompt: ReactNode;
  explanation: ReactNode;
}
export interface ExamMcQuestion extends ExamQuestionBase {
  type: "mc";
  choices: [ExamMcChoice, ExamMcChoice, ExamMcChoice, ExamMcChoice];
  correctLetter: ChoiceLetter;
}
export interface ExamSprQuestion extends ExamQuestionBase {
  type: "spr"; // student-produced response: a typed numeric answer, as on the real test
  correctValue: number;
}
export type ExamQuestion = ExamMcQuestion | ExamSprQuestion;
