import { examReducer } from "./exam-reducer";
import type { DecoderProgress, ProgressAction, ProgressState, Triple, TwinProgress } from "./types";

export const MISSES_BEFORE_SHOW_ME = 2;

export const initialProgress: ProgressState = {
  version: 1,
  decoder: {},
  twins: {},
  anchorsExplored: [],
  answerMode: "type",
  cursor: { decoder: 0, twin: 0, anchor: "slope" },
  exam: null,
};

export const emptyDecoder = (): DecoderProgress => ({ picks: [], solved: false, stepsRevealed: 0 });
export const emptyTwin = (): TwinProgress => ({
  sampleOpened: [false, false, false],
  stepsDone: 0,
  misses: [0, 0, 0],
  assisted: [false, false, false],
});

const setAt = <T>(xs: Triple<T>, index: number, value: T): Triple<T> =>
  xs.map((x, i) => (i === index ? value : x)) as Triple<T>;
const withDecoder = (s: ProgressState, id: string, d: DecoderProgress): ProgressState => ({
  ...s,
  decoder: { ...s.decoder, [id]: d },
});
const withTwin = (s: ProgressState, id: string, t: TwinProgress): ProgressState => ({
  ...s,
  twins: { ...s.twins, [id]: t },
});
function assertNever(action: never): never {
  throw new Error(`Unknown action: ${JSON.stringify(action)}`);
}

export function progressReducer(state: ProgressState, action: ProgressAction): ProgressState {
  switch (action.type) {
    case "decoder/pick": {
      const q = state.decoder[action.questionId] ?? emptyDecoder();
      if (q.solved || q.picks.includes(action.choice)) return state;
      return withDecoder(state, action.questionId, { ...q, picks: [...q.picks, action.choice], solved: action.correct });
    }
    case "decoder/revealStep": {
      const q = state.decoder[action.questionId];
      if (!q || q.picks.length === 0 || q.stepsRevealed >= 3) return state;
      return withDecoder(state, action.questionId, { ...q, stepsRevealed: q.stepsRevealed + 1 });
    }
    case "decoder/retry":
      return state.decoder[action.questionId] ? withDecoder(state, action.questionId, emptyDecoder()) : state;
    case "twin/openSample": {
      const t = state.twins[action.twinId] ?? emptyTwin();
      if (t.sampleOpened[action.step]) return state;
      return withTwin(state, action.twinId, { ...t, sampleOpened: setAt(t.sampleOpened, action.step, true) });
    }
    case "twin/answer": {
      const t = state.twins[action.twinId] ?? emptyTwin();
      if (action.step !== t.stepsDone) return state;
      return withTwin(
        state,
        action.twinId,
        action.correct
          ? { ...t, stepsDone: t.stepsDone + 1 }
          : { ...t, misses: setAt(t.misses, action.step, t.misses[action.step] + 1) },
      );
    }
    case "twin/showMe": {
      const t = state.twins[action.twinId];
      if (!t || action.step !== t.stepsDone || t.misses[action.step] < MISSES_BEFORE_SHOW_ME) return state;
      return withTwin(state, action.twinId, {
        ...t,
        stepsDone: t.stepsDone + 1,
        assisted: setAt(t.assisted, action.step, true),
      });
    }
    case "twin/restart": {
      const t = state.twins[action.twinId];
      return t ? withTwin(state, action.twinId, { ...emptyTwin(), sampleOpened: t.sampleOpened }) : state;
    }
    case "anchor/explore":
      return state.anchorsExplored.includes(action.anchorId)
        ? state
        : { ...state, anchorsExplored: [...state.anchorsExplored, action.anchorId] };
    case "settings/answerMode":
      return state.answerMode === action.mode ? state : { ...state, answerMode: action.mode };
    case "cursor/set": {
      const merged = { ...state.cursor, ...action.cursor };
      const next = {
        ...merged,
        decoder: Math.max(0, Math.trunc(merged.decoder)),
        twin: Math.max(0, Math.trunc(merged.twin)),
      };
      const same =
        next.decoder === state.cursor.decoder && next.twin === state.cursor.twin && next.anchor === state.cursor.anchor;
      return same ? state : { ...state, cursor: next };
    }
    case "progress/reset":
      return { ...initialProgress, answerMode: state.answerMode };
    case "exam/start":
    case "exam/answerMc":
    case "exam/answerSpr":
    case "exam/clearAnswer":
    case "exam/toggleFlag":
    case "exam/goTo":
    case "exam/submitModule1":
    case "exam/startModule2":
    case "exam/submitModule2":
    case "exam/exit": {
      const nextExam = examReducer(state.exam, action);
      return nextExam === state.exam ? state : { ...state, exam: nextExam };
    }
    default:
      return assertNever(action);
  }
}
