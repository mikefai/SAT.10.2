"use client";
import { ArrowRight, CircleCheck } from "lucide-react";
import { useState, type Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";
import { TWIN_SETS } from "@/content/twins";
import { emptyTwin } from "@/lib/progress/reducer";
import type { StepIndex, Triple } from "@/lib/progress/types";
import { useProgress } from "@/lib/progress/use-progress";
import type { Tab } from "@/lib/tabs";
import { SampleAccordion } from "./SampleAccordion";
import { TwinPanel } from "./TwinPanel";

const CLOSED: Triple<boolean> = [false, false, false];

export function TwinDrill({
  headingRef,
  onNavigate,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  onNavigate: (tab: Tab) => void;
}) {
  const [state, dispatch] = useProgress();
  const [expandedBySet, setExpandedBySet] = useState<Record<string, Triple<boolean>>>({});
  const total = TWIN_SETS.length;
  const index = Math.min(state.cursor.twin, total - 1);
  const set = TWIN_SETS[index];
  const progress = state.twins[set.id] ?? emptyTwin();
  const expanded = expandedBySet[set.id] ?? CLOSED;
  const mirrorStep = progress.stepsDone < 3 ? progress.stepsDone : null;

  const setOpen = (step: StepIndex, open: boolean) =>
    setExpandedBySet((prev) => {
      const current = prev[set.id] ?? CLOSED;
      const next = [...current] as Triple<boolean>;
      next[step] = open;
      return { ...prev, [set.id]: next };
    });

  const toggle = (step: StepIndex) => {
    const opening = !expanded[step];
    setOpen(step, opening);
    if (opening) dispatch({ type: "twin/openSample", twinId: set.id, step });
  };

  const peek = (step: StepIndex) => {
    setOpen(step, true);
    dispatch({ type: "twin/openSample", twinId: set.id, step });
    document.getElementById(`sample-${set.id}-${step}`)?.scrollIntoView({ block: "center" });
  };

  const go = (next: number) => dispatch({ type: "cursor/set", cursor: { twin: next } });
  const isLast = index === total - 1;

  return (
    <div className="space-y-5">
      <ViewHeader
        title="Twin Question Drill"
        intro="Study a solved problem, then solve its twin: same steps, new numbers."
        headingRef={headingRef}
      />

      <nav aria-label="Twin sets" className="flex flex-wrap gap-2">
        {TWIN_SETS.map((s, i) => {
          const done = (state.twins[s.id]?.stepsDone ?? 0) >= 3;
          return (
            <button
              key={s.id}
              type="button"
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 font-medium transition ${
                i === index ? "border-accent bg-accent-soft text-accent" : "border-line bg-surface hover:bg-surface-2"
              }`}
            >
              {done && <CircleCheck aria-hidden="true" className="size-4 text-ok" />}
              {s.title}
              {done && <span className="sr-only">(solved)</span>}
            </button>
          );
        })}
      </nav>

      <ol aria-label="The three moves" className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        {set.pattern.map((name, i) => (
          <li key={name} className="flex items-center gap-2">
            {i > 0 && <ArrowRight aria-hidden="true" className="size-4 text-muted" />}
            <span
              aria-current={progress.stepsDone === i ? "step" : undefined}
              className={`rounded-full px-3 py-1 ${progress.stepsDone === i ? "bg-accent-solid text-on-accent" : "bg-surface-2 text-muted"}`}
            >
              {name}
            </span>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 lg:grid-cols-2">
        <SampleAccordion key={`sample-${set.id}`} set={set} expanded={expanded} viewed={progress.sampleOpened} mirrorStep={mirrorStep} onToggle={toggle} />
        <TwinPanel
          key={`twin-${set.id}`}
          set={set}
          progress={progress}
          mode={state.answerMode}
          onPeek={peek}
          onNext={() => (isLast ? onNavigate("anchors") : go(index + 1))}
          nextLabel={isLast ? "Next: Formula Anchors" : "Next twin"}
        />
      </div>
    </div>
  );
}
