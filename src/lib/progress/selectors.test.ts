import { describe, expect, it } from "vitest";
import { ANCHORS } from "@/content/anchors";
import { DECODER_QUESTIONS as QS } from "@/content/decoder";
import { TWIN_SETS as SETS } from "@/content/twins";
import { initialProgress, progressReducer } from "./reducer";
import { anchorStats, decoderStats, overallProgress, trapJournal, twinStats } from "./selectors";
import type { ProgressAction } from "./types";

const run = (...a: ProgressAction[]) => a.reduce(progressReducer, initialProgress);
const pick = (questionId: string, choice: "A" | "B" | "C" | "D", correct = false): ProgressAction => ({
  type: "decoder/pick",
  questionId,
  choice,
  correct,
});
const content = { questions: QS, sets: SETS, anchors: ANCHORS };

describe("selectors", () => {
  it("counts decoded and first-try questions", () => {
    const s = run(pick("distribute-negative", "A"), pick("distribute-negative", "B", true), pick("hypotenuse", "B", true));
    expect(decoderStats(s, QS)).toEqual({ solved: 2, firstTry: 1, total: 5 });
  });
  it("groups the trap journal by trap, in content order", () => {
    const s = run(pick("eliminate-carefully", "B"), pick("answer-the-question", "B"), pick("distribute-negative", "A"));
    expect(trapJournal(s, QS)).toEqual([
      { trapId: "negative-distribution", count: 1, questionIndexes: [0] },
      { trapId: "wrong-target", count: 2, questionIndexes: [1, 2] },
    ]);
  });
  it("counts completed twins and explored anchors", () => {
    const id = SETS[0].id;
    const steps = [0, 1, 2].map(
      (step): ProgressAction => ({ type: "twin/answer", twinId: id, step: step as 0 | 1 | 2, correct: true }),
    );
    const s = run(...steps, { type: "anchor/explore", anchorId: "slope" });
    expect(twinStats(s, SETS)).toEqual({ completed: 1, total: 4 });
    expect(anchorStats(s, ANCHORS)).toEqual({ explored: 1, total: 4 });
  });
  it("computes overall progress from 0 to 1", () => {
    expect(overallProgress(initialProgress, content)).toBe(0);
    const all: ProgressAction[] = [
      ...QS.map((x) => pick(x.id, x.choices.find((c) => c.correct)!.letter, true)),
      ...SETS.flatMap((set) =>
        [0, 1, 2].map((step) => ({ type: "twin/answer", twinId: set.id, step: step as 0 | 1 | 2, correct: true }) as ProgressAction),
      ),
      ...ANCHORS.map((a) => ({ type: "anchor/explore", anchorId: a.id }) as ProgressAction),
    ];
    expect(overallProgress(run(...all), content)).toBe(1);
  });
});
