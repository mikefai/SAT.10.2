import { describe, expect, it, vi } from "vitest";
import { initialProgress, progressReducer } from "./reducer";
import { createProgressStore, PROGRESS_KEY, type StorageLike } from "./store";
import type { ProgressAction } from "./types";

const memory = (seed?: string): StorageLike & { data: Map<string, string> } => {
  const data = new Map<string, string>(seed === undefined ? [] : [[PROGRESS_KEY, seed]]);
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
};
const pick: ProgressAction = { type: "decoder/pick", questionId: "q1", choice: "A", correct: false };
const saved = JSON.stringify(progressReducer(initialProgress, pick));

describe("createProgressStore", () => {
  it("starts from the initial state when storage is empty or missing", () => {
    expect(createProgressStore(memory()).getSnapshot()).toEqual(initialProgress);
    expect(createProgressStore(null).getSnapshot()).toEqual(initialProgress);
  });
  it("loads a valid saved state", () => {
    expect(createProgressStore(memory(saved)).getSnapshot().decoder.q1.picks).toEqual(["A"]);
  });
  it("ignores corrupted JSON and other schema versions", () => {
    expect(createProgressStore(memory("{bad json")).getSnapshot()).toEqual(initialProgress);
    expect(createProgressStore(memory(JSON.stringify({ ...initialProgress, version: 2 }))).getSnapshot()).toEqual(
      initialProgress,
    );
  });
  it("drops malformed entries but keeps valid ones", () => {
    const messy = JSON.stringify({
      ...initialProgress,
      decoder: { good: { picks: ["B", "Z", "B"], solved: false, stepsRevealed: 9 }, bad: { picks: "A" } },
      twins: { bad: { sampleOpened: [true], stepsDone: 1 } },
      anchorsExplored: ["slope", 7, "slope"],
      answerMode: "weird",
      cursor: { decoder: -1, twin: 2, anchor: 5 },
    });
    const s = createProgressStore(memory(messy)).getSnapshot();
    expect(s.decoder).toEqual({ good: { picks: ["B"], solved: false, stepsRevealed: 3 } });
    expect(s.twins).toEqual({});
    expect(s.anchorsExplored).toEqual(["slope"]);
    expect(s.answerMode).toBe("type");
    expect(s.cursor).toEqual({ decoder: 0, twin: 2, anchor: "slope" });
  });
  it("works in memory when storage throws on read and write", () => {
    const throwing: StorageLike = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    const store = createProgressStore(throwing);
    expect(store.getSnapshot()).toEqual(initialProgress);
    store.dispatch(pick);
    expect(store.getSnapshot().decoder.q1.picks).toEqual(["A"]);
  });
  it("persists, notifies on change, and stays silent on no-ops", () => {
    const storage = memory();
    const store = createProgressStore(storage);
    const listener = vi.fn();
    store.subscribe(listener);
    store.dispatch(pick);
    store.dispatch(pick); // same pick again → no-op
    expect(listener).toHaveBeenCalledTimes(1);
    expect(JSON.parse(storage.data.get(PROGRESS_KEY)!).decoder.q1.picks).toEqual(["A"]);
  });
  it("applies changes from another tab", () => {
    const store = createProgressStore(memory());
    const listener = vi.fn();
    store.subscribe(listener);
    store.syncFromStorage(saved);
    expect(store.getSnapshot().decoder.q1.picks).toEqual(["A"]);
    expect(listener).toHaveBeenCalledTimes(1);
  });
  it("always serves the initial state as the server snapshot", () => {
    expect(createProgressStore(memory(saved)).getServerSnapshot()).toBe(initialProgress);
  });

  describe("exam state", () => {
    it("loads a valid in-progress exam", () => {
      const withExam = JSON.stringify({
        ...initialProgress,
        exam: {
          phase: "module2",
          cursor: 3,
          startedAt: 1000,
          deadline: 2_000_000,
          module1Responses: { 0: { letter: "B" }, 2: { text: "4/5" } },
          module1Flags: [1, 5],
          module1Result: { correct: 15, total: 22 },
          module2Branch: "harder",
          module2Responses: { 0: { letter: "A" } },
          module2Flags: [],
          result: null,
        },
      });
      const exam = createProgressStore(memory(withExam)).getSnapshot().exam;
      expect(exam?.phase).toBe("module2");
      expect(exam?.module1Responses).toEqual({ 0: { letter: "B" }, 2: { text: "4/5" } });
      expect(exam?.module2Branch).toBe("harder");
    });
    it("drops the whole attempt — rather than guessing — on any corruption", () => {
      const bad = JSON.stringify({ ...initialProgress, exam: { phase: "module2", cursor: 0, startedAt: 1000 } }); // missing module2Branch
      expect(createProgressStore(memory(bad)).getSnapshot().exam).toBeNull();
    });
    it("defaults to no exam when the field is absent entirely", () => {
      expect(createProgressStore(memory(saved)).getSnapshot().exam).toBeNull();
    });
    it("ignores out-of-range response indexes and flags", () => {
      const messy = JSON.stringify({
        ...initialProgress,
        exam: {
          phase: "module1",
          cursor: 0,
          startedAt: 1000,
          deadline: 2000,
          module1Responses: { 0: { letter: "B" }, 99: { letter: "A" }, "-1": { letter: "C" } },
          module1Flags: [1, 99, -1, 1],
          module1Result: null,
          module2Branch: null,
          module2Responses: {},
          module2Flags: [],
          result: null,
        },
      });
      const exam = createProgressStore(memory(messy)).getSnapshot().exam;
      expect(exam?.module1Responses).toEqual({ 0: { letter: "B" } });
      expect(exam?.module1Flags).toEqual([1]);
    });
  });
});
