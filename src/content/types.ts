import type { ReactNode } from "react";
import type { ChoiceLetter, Triple } from "@/lib/progress/types";

export type Topic = "linear" | "systems" | "data" | "geometry";
export const TOPIC_LABEL: Record<Topic, string> = {
  linear: "Linear Equations",
  systems: "Systems of Equations",
  data: "Data Analysis",
  geometry: "Geometry",
};

export type TrapId =
  | "negative-distribution"
  | "multiply-before-subtract"
  | "sign-flip"
  | "wrong-target"
  | "partial-division"
  | "subtract-negative"
  | "stopped-early"
  | "raw-change"
  | "wrong-base"
  | "ratio-not-change"
  | "added-legs"
  | "forgot-root"
  | "wrong-side";
export interface Trap {
  id: TrapId;
  name: string;
  habit: string;
}

export interface WorkLine {
  math: string; // goes through eq()
  label?: string;
  slip?: true;
  note?: string;
}
export interface SocraticStep {
  ask: string;
  move: ReactNode;
  result: ReactNode;
}

export interface DecoderChoice {
  letter: ChoiceLetter;
  label: ReactNode;
  value: number | null; // numeric value, re-derived in tests; null = "There is no solution."
  correct?: true;
  trap?: { id: TrapId; headline: ReactNode; work: WorkLine[]; fix: ReactNode };
}

export interface LineSpec {
  m: number;
  b: number;
  label: string;
}
export interface BalanceState {
  left: string;
  right: string;
  op?: string;
}
export type VisualSpec =
  | { kind: "distribution"; factor: string; terms: [string, string]; products: [string, string] }
  | { kind: "target"; chain: [string, string, string, string] }
  | { kind: "lines"; x: [number, number]; y: [number, number]; lines: [LineSpec, LineSpec]; point: [number, number] }
  | {
      kind: "fraction-bar";
      parts: number;
      partValue: number;
      prefix: string;
      highlight: number;
      extra?: number;
      caption: string;
    }
  | { kind: "right-triangle"; a: number; b: number }
  | { kind: "circle"; diameter: number }
  | { kind: "balance"; states: [BalanceState, BalanceState, BalanceState, BalanceState] };

export interface DecoderQuestion {
  id: string;
  topic: Topic;
  lesson: string;
  prompt: ReactNode;
  choices: [DecoderChoice, DecoderChoice, DecoderChoice, DecoderChoice];
  walkthrough: Triple<SocraticStep>;
  visual: VisualSpec;
}

export interface TwinOption {
  value: number;
  label?: ReactNode;
}
export interface TwinMistake {
  value: number;
  why: ReactNode;
}
export interface GuidedStep {
  ask: string;
  context: ReactNode; // the previous line, shown above the step
  line: (blank: ReactNode) => ReactNode; // the step's line with exactly one blank
  answer: number;
  options: Triple<TwinOption>; // ascending; includes the answer
  mistakes: TwinMistake[]; // one per wrong option, at minimum
  nudge: ReactNode;
}
export interface TwinSet {
  id: string;
  topic: Topic;
  title: string;
  pattern: Triple<string>;
  sample: { prompt: ReactNode; steps: Triple<SocraticStep>; answer: ReactNode; visual: VisualSpec };
  twin: { prompt: ReactNode; steps: Triple<GuidedStep>; check: ReactNode; visual: VisualSpec };
}

export type AnchorId = "slope" | "vertex" | "quadratic" | "pythagorean";
export interface AnchorMeta {
  id: AnchorId;
  name: string;
  formula: string;
  useFor: string;
}
