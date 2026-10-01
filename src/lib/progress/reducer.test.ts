import { describe, expect, it } from "vitest";
import { initialProgress as init, progressReducer as r } from "./reducer";
import type { ProgressAction, ProgressState } from "./types";

const run = (...actions: ProgressAction[]): ProgressState => actions.reduce(r, init);
const pick = (choice: "A" | "B" | "C" | "D", correct = false): ProgressAction => ({
  type: "decoder/pick",
  questionId: "q1",
  choice,
  correct,
});
const answer = (step: 0 | 1 | 2, correct: boolean): ProgressAction => ({ type: "twin/answer", twinId: "t1", step, correct });
const showMe = (step: 0 | 1 | 2): ProgressAction => ({ type: "twin/showMe", twinId: "t1", step });

describe("decoder", () => {
  it("records a wrong pick without solving", () => {
    expect(run(pick("A")).decoder.q1).toEqual({ picks: ["A"], solved: false, stepsRevealed: 0 });
  });
  it("ignores re-picking the same letter (same object back)", () => {
    const s = run(pick("A"));
    expect(r(s, pick("A"))).toBe(s);
  });
  it("solves on a correct pick and then ignores further picks", () => {
    const s = run(pick("A"), pick("B", true));
    expect(s.decoder.q1).toMatchObject({ picks: ["A", "B"], solved: true });
    expect(r(s, pick("C"))).toBe(s);
  });
  it("reveals walkthrough steps only after a pick, capped at 3", () => {
    const reveal: ProgressAction = { type: "decoder/revealStep", questionId: "q1" };
    expect(r(init, reveal)).toBe(init);
    expect(run(pick("A"), reveal, reveal, reveal, reveal).decoder.q1.stepsRevealed).toBe(3);
  });
  it("retry clears one question only", () => {
    const s = run(
      pick("A"),
      { type: "decoder/pick", questionId: "q2", choice: "C", correct: true },
      { type: "decoder/retry", questionId: "q1" },
    );
    expect(s.decoder.q1).toEqual({ picks: [], solved: false, stepsRevealed: 0 });
    expect(s.decoder.q2.solved).toBe(true);
  });
});

describe("twins", () => {
  it("advances on a correct answer to the current step", () => {
    expect(run(answer(0, true)).twins.t1.stepsDone).toBe(1);
  });
  it("counts misses on the current step", () => {
    expect(run(answer(0, false), answer(0, false)).twins.t1.misses).toEqual([2, 0, 0]);
  });
  it("ignores answers to locked or finished steps", () => {
    expect(r(init, answer(1, true))).toBe(init);
    const done = run(answer(0, true), answer(1, true), answer(2, true));
    expect(done.twins.t1.stepsDone).toBe(3);
    expect(r(done, answer(2, true))).toBe(done);
  });
  it("allows Show me only after 2 misses, then marks assisted and advances", () => {
    const once = run(answer(0, false));
    expect(r(once, showMe(0))).toBe(once);
    const s = run(answer(0, false), answer(0, false), showMe(0));
    expect(s.twins.t1).toMatchObject({ stepsDone: 1, assisted: [true, false, false] });
    expect(r(s, showMe(0))).toBe(s);
  });
  it("opening a sample step is idempotent", () => {
    const open: ProgressAction = { type: "twin/openSample", twinId: "t1", step: 1 };
    const s = run(open);
    expect(s.twins.t1.sampleOpened).toEqual([false, true, false]);
    expect(r(s, open)).toBe(s);
  });
  it("restart resets guided steps but keeps sample views", () => {
    const s = run({ type: "twin/openSample", twinId: "t1", step: 0 }, answer(0, true), { type: "twin/restart", twinId: "t1" });
    expect(s.twins.t1).toEqual({
      sampleOpened: [true, false, false],
      stepsDone: 0,
      misses: [0, 0, 0],
      assisted: [false, false, false],
    });
  });
});

describe("anchors, settings, cursor, reset", () => {
  it("adds each anchor once", () => {
    const explore: ProgressAction = { type: "anchor/explore", anchorId: "slope" };
    const s = run(explore);
    expect(s.anchorsExplored).toEqual(["slope"]);
    expect(r(s, explore)).toBe(s);
  });
  it("switches answer mode; the same mode is a no-op", () => {
    const s = run({ type: "settings/answerMode", mode: "choose" });
    expect(s.answerMode).toBe("choose");
    expect(r(s, { type: "settings/answerMode", mode: "choose" })).toBe(s);
  });
  it("merges the cursor, clamps negatives, and no-ops when unchanged", () => {
    const s = run({ type: "cursor/set", cursor: { decoder: 3, twin: -2 } });
    expect(s.cursor).toEqual({ decoder: 3, twin: 0, anchor: "slope" });
    expect(r(s, { type: "cursor/set", cursor: { decoder: 3 } })).toBe(s);
  });
  it("reset clears progress and cursor but keeps the answer mode", () => {
    const s = run(
      pick("A"),
      { type: "settings/answerMode", mode: "choose" },
      { type: "cursor/set", cursor: { decoder: 2 } },
      { type: "progress/reset" },
    );
    expect(s).toEqual({ ...init, answerMode: "choose" });
  });
});
