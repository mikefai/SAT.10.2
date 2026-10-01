import type { AnchorMeta, DecoderQuestion, TrapId, TwinSet } from "@/content/types";
import type { ProgressState } from "./types";

export function decoderStats(state: ProgressState, questions: readonly DecoderQuestion[]) {
  let solved = 0;
  let firstTry = 0;
  for (const q of questions) {
    const p = state.decoder[q.id];
    if (p?.solved) {
      solved++;
      if (p.picks.length === 1) firstTry++;
    }
  }
  return { solved, firstTry, total: questions.length };
}

export interface JournalEntry {
  trapId: TrapId;
  count: number;
  questionIndexes: number[];
}

export function trapJournal(state: ProgressState, questions: readonly DecoderQuestion[]): JournalEntry[] {
  const entries = new Map<TrapId, JournalEntry>();
  questions.forEach((q, index) => {
    for (const letter of state.decoder[q.id]?.picks ?? []) {
      const trap = q.choices.find((c) => c.letter === letter)?.trap;
      if (!trap) continue;
      const entry = entries.get(trap.id) ?? { trapId: trap.id, count: 0, questionIndexes: [] };
      entry.count += 1;
      if (!entry.questionIndexes.includes(index)) entry.questionIndexes.push(index);
      entries.set(trap.id, entry);
    }
  });
  return [...entries.values()];
}

export const twinStats = (state: ProgressState, sets: readonly TwinSet[]) => ({
  completed: sets.filter((s) => (state.twins[s.id]?.stepsDone ?? 0) >= 3).length,
  total: sets.length,
});

export const anchorStats = (state: ProgressState, anchors: readonly AnchorMeta[]) => ({
  explored: anchors.filter((a) => state.anchorsExplored.includes(a.id)).length,
  total: anchors.length,
});

export function overallProgress(
  state: ProgressState,
  content: { questions: readonly DecoderQuestion[]; sets: readonly TwinSet[]; anchors: readonly AnchorMeta[] },
): number {
  const d = decoderStats(state, content.questions);
  const t = twinStats(state, content.sets);
  const a = anchorStats(state, content.anchors);
  return (d.solved / d.total + t.completed / t.total + a.explored / a.total) / 3;
}
