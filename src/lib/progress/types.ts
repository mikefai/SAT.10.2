import type { DomainTally, ExamBranch, ExamDomain } from "@/content/exam/types";

export type ChoiceLetter = "A" | "B" | "C" | "D";
export type StepIndex = 0 | 1 | 2;
export type Triple<T> = [T, T, T];
export type AnswerMode = "type" | "choose";

export interface DecoderProgress {
  picks: ChoiceLetter[]; // unique, in the order chosen; ends with the correct letter once solved
  solved: boolean;
  stepsRevealed: number; // 0–3 walkthrough steps shown
}

export interface TwinProgress {
  sampleOpened: Triple<boolean>;
  stepsDone: number; // 0–3 guided twin steps finished, strictly in order
  misses: Triple<number>;
  assisted: Triple<boolean>; // finished with “Show me”
}

export interface Cursor {
  decoder: number;
  twin: number;
  anchor: string;
}

// --- Mock Exam ---------------------------------------------------------
// A response the student has given to one exam question. Multiple-choice stores the
// letter chosen; a student-produced response stores the raw typed text (so revisiting
// the question shows exactly what was typed), graded at submit time.
export interface ExamResponse {
  letter?: ChoiceLetter;
  text?: string;
}
export type ExamPhase = "module1" | "between" | "module2" | "report";
export interface ExamResult {
  rawCorrect: number;
  rawTotal: number;
  scaledScore: number; // an estimated 200–800 practice score; real scoring tables are proprietary
  module2Branch: ExamBranch;
  byDomain: Record<ExamDomain, DomainTally>;
}
export interface ExamState {
  phase: ExamPhase;
  cursor: number; // index into the active module's 22 questions
  startedAt: number; // epoch ms
  deadline: number | null; // epoch ms; null while not in a timed module
  module1Responses: Record<number, ExamResponse>;
  module1Flags: number[];
  module1Result: { correct: number; total: number } | null; // set once Module 1 is submitted
  module2Branch: ExamBranch | null; // set once Module 1 is submitted
  module2Responses: Record<number, ExamResponse>;
  module2Flags: number[];
  result: ExamResult | null; // set once Module 2 is submitted
}
// Grading (isCorrect/domain tallies) happens where the content lives — in the exam
// components — and the computed numbers are passed in, the same way decoder/twin
// actions carry a pre-computed `correct`. The reducer itself never imports content.
export type ExamAction =
  | { type: "exam/start" }
  | { type: "exam/answerMc"; index: number; letter: ChoiceLetter }
  | { type: "exam/answerSpr"; index: number; text: string }
  | { type: "exam/clearAnswer"; index: number }
  | { type: "exam/toggleFlag"; index: number }
  | { type: "exam/goTo"; index: number }
  | { type: "exam/submitModule1"; correct: number }
  | { type: "exam/startModule2" }
  | { type: "exam/submitModule2"; correct: number; byDomain: Record<ExamDomain, DomainTally> }
  | { type: "exam/exit" };

export interface ProgressState {
  version: 1;
  decoder: Record<string, DecoderProgress>;
  twins: Record<string, TwinProgress>;
  anchorsExplored: string[];
  answerMode: AnswerMode;
  cursor: Cursor;
  exam: ExamState | null;
}

export type ProgressAction =
  | { type: "decoder/pick"; questionId: string; choice: ChoiceLetter; correct: boolean }
  | { type: "decoder/revealStep"; questionId: string }
  | { type: "decoder/retry"; questionId: string }
  | { type: "twin/openSample"; twinId: string; step: StepIndex }
  | { type: "twin/answer"; twinId: string; step: StepIndex; correct: boolean }
  | { type: "twin/showMe"; twinId: string; step: StepIndex }
  | { type: "twin/restart"; twinId: string }
  | { type: "anchor/explore"; anchorId: string }
  | { type: "settings/answerMode"; mode: AnswerMode }
  | { type: "cursor/set"; cursor: Partial<Cursor> }
  | { type: "progress/reset" }
  | ExamAction;
