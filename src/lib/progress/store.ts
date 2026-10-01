import { EXAM_DOMAINS, MODULE_SIZE, type DomainTally, type ExamBranch, type ExamDomain } from "@/content/exam/types";
import { initialProgress, progressReducer } from "./reducer";
import type {
  ChoiceLetter,
  Cursor,
  DecoderProgress,
  ExamResponse,
  ExamResult,
  ExamState,
  ProgressAction,
  ProgressState,
  Triple,
  TwinProgress,
} from "./types";

export const PROGRESS_KEY = "oct1.2-math-lab/progress";
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const LETTERS: readonly string[] = ["A", "B", "C", "D"];
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const isBool = (v: unknown): v is boolean => typeof v === "boolean";
const isCount = (v: unknown): v is number => Number.isInteger(v) && (v as number) >= 0;
const isTriple = <T>(v: unknown, guard: (x: unknown) => x is T): v is Triple<T> =>
  Array.isArray(v) && v.length === 3 && v.every(guard);

function toDecoder(v: unknown): DecoderProgress | null {
  if (!isRecord(v) || !Array.isArray(v.picks) || !isBool(v.solved) || !isCount(v.stepsRevealed)) return null;
  const picks = [...new Set(v.picks.filter((p): p is ChoiceLetter => typeof p === "string" && LETTERS.includes(p)))];
  return { picks, solved: v.solved && picks.length > 0, stepsRevealed: Math.min(v.stepsRevealed, 3) };
}

function toTwin(v: unknown): TwinProgress | null {
  if (
    !isRecord(v) ||
    !isTriple(v.sampleOpened, isBool) ||
    !isCount(v.stepsDone) ||
    !isTriple(v.misses, isCount) ||
    !isTriple(v.assisted, isBool)
  )
    return null;
  return { sampleOpened: v.sampleOpened, stepsDone: Math.min(v.stepsDone, 3), misses: v.misses, assisted: v.assisted };
}

function toCursor(v: unknown): Cursor {
  const d = initialProgress.cursor;
  if (!isRecord(v)) return d;
  return {
    decoder: isCount(v.decoder) ? v.decoder : d.decoder,
    twin: isCount(v.twin) ? v.twin : d.twin,
    anchor: typeof v.anchor === "string" ? v.anchor : d.anchor,
  };
}

export function sanitizeProgress(value: unknown): ProgressState | null {
  if (!isRecord(value) || value.version !== 1) return null;
  const decoder: Record<string, DecoderProgress> = {};
  if (isRecord(value.decoder)) {
    for (const [id, entry] of Object.entries(value.decoder)) {
      const d = toDecoder(entry);
      if (d) decoder[id] = d;
    }
  }
  const twins: Record<string, TwinProgress> = {};
  if (isRecord(value.twins)) {
    for (const [id, entry] of Object.entries(value.twins)) {
      const t = toTwin(entry);
      if (t) twins[id] = t;
    }
  }
  const explored = Array.isArray(value.anchorsExplored)
    ? value.anchorsExplored.filter((a): a is string => typeof a === "string")
    : [];
  return {
    version: 1,
    decoder,
    twins,
    anchorsExplored: [...new Set(explored)],
    answerMode: value.answerMode === "choose" ? "choose" : "type",
    cursor: toCursor(value.cursor),
    exam: toExamState(value.exam),
  };
}

// Exam state is session-like, not long-term mastery data: on any corruption we drop
// the whole attempt to null (the student just starts over) rather than attempting a
// partial repair, which would risk silently producing a wrong score.
function toExamResponses(v: unknown): Record<number, ExamResponse> {
  if (!isRecord(v)) return {};
  const out: Record<number, ExamResponse> = {};
  for (const [key, entry] of Object.entries(v)) {
    const index = Number(key);
    if (!Number.isInteger(index) || index < 0 || index >= MODULE_SIZE || !isRecord(entry)) continue;
    const letter = typeof entry.letter === "string" && LETTERS.includes(entry.letter) ? (entry.letter as ChoiceLetter) : undefined;
    const text = typeof entry.text === "string" ? entry.text : undefined;
    if (letter !== undefined) out[index] = { letter };
    else if (text !== undefined) out[index] = { text };
  }
  return out;
}

function toExamFlags(v: unknown): number[] {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.filter((x): x is number => Number.isInteger(x) && x >= 0 && x < MODULE_SIZE))];
}

function toExamState(v: unknown): ExamState | null {
  if (!isRecord(v)) return null;
  const phase = v.phase;
  if (phase !== "module1" && phase !== "between" && phase !== "module2" && phase !== "report") return null;
  if (!isCount(v.cursor) || v.cursor >= MODULE_SIZE) return null;
  if (!isCount(v.startedAt)) return null;
  const deadline = isCount(v.deadline) ? v.deadline : null;

  const module2Branch: ExamBranch | null = v.module2Branch === "easier" || v.module2Branch === "harder" ? v.module2Branch : null;
  if (phase !== "module1" && module2Branch === null) return null;

  let module1Result: { correct: number; total: number } | null = null;
  if (phase !== "module1") {
    const r = v.module1Result;
    if (!isRecord(r) || !isCount(r.correct) || r.total !== MODULE_SIZE) return null;
    module1Result = { correct: Math.min(r.correct, MODULE_SIZE), total: MODULE_SIZE };
  }

  let result: ExamResult | null = null;
  if (phase === "report") {
    const r = v.result;
    if (!isRecord(r) || !isCount(r.rawCorrect) || !isCount(r.scaledScore) || r.rawTotal !== MODULE_SIZE * 2) return null;
    if (r.module2Branch !== "easier" && r.module2Branch !== "harder") return null;
    if (!isRecord(r.byDomain)) return null;
    const byDomain = {} as Record<ExamDomain, DomainTally>;
    for (const domain of EXAM_DOMAINS) {
      const tally = (r.byDomain as Record<string, unknown>)[domain];
      if (!isRecord(tally) || !isCount(tally.correct) || !isCount(tally.total)) return null;
      byDomain[domain] = { correct: tally.correct, total: tally.total };
    }
    result = { rawCorrect: r.rawCorrect, rawTotal: MODULE_SIZE * 2, scaledScore: r.scaledScore, module2Branch: r.module2Branch, byDomain };
  }

  return {
    phase,
    cursor: v.cursor,
    startedAt: v.startedAt,
    deadline,
    module1Responses: toExamResponses(v.module1Responses),
    module1Flags: toExamFlags(v.module1Flags),
    module1Result,
    module2Branch,
    module2Responses: toExamResponses(v.module2Responses),
    module2Flags: toExamFlags(v.module2Flags),
    result,
  };
}

export function parseProgress(raw: string | null): ProgressState | null {
  if (!raw) return null;
  try {
    return sanitizeProgress(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function createProgressStore(storage: StorageLike | null) {
  let state: ProgressState = initialProgress;
  let loaded = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((listener) => listener());
  const ensureLoaded = () => {
    if (loaded) return;
    loaded = true;
    try {
      state = parseProgress(storage?.getItem(PROGRESS_KEY) ?? null) ?? initialProgress;
    } catch {
      state = initialProgress;
    }
  };
  return {
    getSnapshot(): ProgressState {
      ensureLoaded();
      return state;
    },
    getServerSnapshot(): ProgressState {
      return initialProgress;
    },
    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    dispatch(action: ProgressAction): void {
      ensureLoaded();
      const next = progressReducer(state, action);
      if (next === state) return;
      state = next;
      try {
        storage?.setItem(PROGRESS_KEY, JSON.stringify(next));
      } catch {
        /* storage full or blocked: keep progress in memory */
      }
      emit();
    },
    syncFromStorage(raw: string | null): void {
      loaded = true;
      state = parseProgress(raw) ?? initialProgress;
      emit();
    },
  };
}

export type ProgressStore = ReturnType<typeof createProgressStore>;
