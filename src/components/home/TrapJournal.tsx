"use client";
import { NotebookPen, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { DECODER_QUESTIONS } from "@/content/decoder";
import { TRAPS } from "@/content/traps";
import { TOPIC_LABEL } from "@/content/types";
import { trapJournal } from "@/lib/progress/selectors";
import { useProgress } from "@/lib/progress/use-progress";
import type { Tab } from "@/lib/tabs";

export function TrapJournal({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const [state, dispatch] = useProgress();
  const entries = trapJournal(state, DECODER_QUESTIONS);

  return (
    <section aria-labelledby="journal-heading">
      <h2 id="journal-heading" className="mb-3 flex items-center gap-2 text-2xl font-semibold tracking-tight">
        <NotebookPen aria-hidden="true" className="size-6 text-accent" />
        Trap Journal
      </h2>
      {entries.length === 0 ? (
        <Card as="div">
          <p className="text-muted">No traps yet. When one catches you, it lands here so you’ll spot it next time.</p>
        </Card>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {entries.map((entry) => (
            <li key={entry.trapId}>
              <Card as="div" className="h-full space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <TriangleAlert aria-hidden="true" className="size-5 text-trap" />
                  <h3 className="font-semibold">{TRAPS[entry.trapId].name}</h3>
                  <Pill tone="trap">Caught you ×{entry.count}</Pill>
                </div>
                <p className="text-muted">{TRAPS[entry.trapId].habit}</p>
                <div className="flex flex-wrap gap-2">
                  {entry.questionIndexes.map((index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        dispatch({ type: "cursor/set", cursor: { decoder: index } });
                        onNavigate("decoder");
                      }}
                      className="min-h-11 rounded-xl border border-line px-3 text-sm font-medium hover:bg-surface-2"
                    >
                      Q{index + 1} · {TOPIC_LABEL[DECODER_QUESTIONS[index].topic]}
                    </button>
                  ))}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
