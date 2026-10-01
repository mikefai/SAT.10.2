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

export interface ProgressState {
  version: 1;
  decoder: Record<string, DecoderProgress>;
  twins: Record<string, TwinProgress>;
  anchorsExplored: string[];
  answerMode: AnswerMode;
  cursor: Cursor;
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
  | { type: "progress/reset" };
