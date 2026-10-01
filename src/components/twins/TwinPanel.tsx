"use client";
import { ArrowRight, CircleCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { VisualAnchor } from "@/components/visuals/VisualAnchor";
import type { TwinSet } from "@/content/types";
import type { AnswerMode, StepIndex, TwinProgress } from "@/lib/progress/types";
import { useProgress } from "@/lib/progress/use-progress";
import { AnswerModeToggle } from "./AnswerModeToggle";
import { GuidedStep } from "./GuidedStep";

export function TwinPanel({
  set,
  progress,
  mode,
  onPeek,
  onNext,
  nextLabel,
}: {
  set: TwinSet;
  progress: TwinProgress;
  mode: AnswerMode;
  onPeek: (step: StepIndex) => void;
  onNext: () => void;
  nextLabel: string;
}) {
  const [, dispatch] = useProgress();
  const complete = progress.stepsDone >= 3;
  const anyAssisted = progress.assisted.some(Boolean);

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Your twin</p>
        <AnswerModeToggle mode={mode} onChange={(next) => dispatch({ type: "settings/answerMode", mode: next })} />
      </div>
      <div className="text-lg">{set.twin.prompt}</div>
      <div className="rounded-xl border border-line bg-surface p-3">
        <VisualAnchor spec={set.twin.visual} level={progress.stepsDone} />
      </div>
      <ol className="space-y-3">
        {set.twin.steps.map((step, i) => {
          const index = i as StepIndex;
          const status = progress.stepsDone > i ? "done" : progress.stepsDone === i ? "active" : "locked";
          return (
            <GuidedStep
              key={`${set.id}-${i}-${status === "done" ? "done" : "live"}`}
              setId={set.id}
              index={index}
              step={step}
              status={status}
              assisted={progress.assisted[i]}
              misses={progress.misses[i]}
              mode={mode}
              onPeek={() => onPeek(index)}
            />
          );
        })}
      </ol>
      {complete && (
        <Callout tone="ok" icon={CircleCheck} title={`Twin solved! Same 3 moves as the sample: ${set.pattern.join(" → ")}.`} className="motion-safe:animate-fade-up">
          <p>{set.twin.check}</p>
          {anyAssisted && <p className="mt-2">Try Practice again to do it solo.</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => dispatch({ type: "twin/restart", twinId: set.id })}>
              <RotateCcw aria-hidden="true" className="size-4" />
              Practice again
            </Button>
            <Button onClick={onNext}>
              {nextLabel}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </Callout>
      )}
    </Card>
  );
}
