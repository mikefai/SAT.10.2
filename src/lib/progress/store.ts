import { initialProgress, progressReducer } from "./reducer";
import type {
  ChoiceLetter,
  Cursor,
  DecoderProgress,
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
