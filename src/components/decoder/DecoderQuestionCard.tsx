"use client";
import { ArrowRight, CircleCheck, RotateCcw } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { VisualAnchor } from "@/components/visuals/VisualAnchor";
import { TRAPS } from "@/content/traps";
import { TOPIC_LABEL, type DecoderChoice, type DecoderQuestion } from "@/content/types";
import type { DecoderProgress } from "@/lib/progress/types";
import { ChoiceButton, type ChoiceState } from "./ChoiceButton";
import { DodgedTraps } from "./DodgedTraps";
import { SocraticSteps } from "./SocraticSteps";
import { TrapReveal } from "./TrapReveal";

export function DecoderQuestionCard({
  question,
  index,
  progress,
  onPick,
  onReveal,
  onRetry,
  onNext,
}: {
  question: DecoderQuestion;
  index: number;
  progress: DecoderProgress | undefined;
  onPick: (choice: DecoderChoice) => void;
  onReveal: () => void;
  onRetry: () => void;
  onNext?: () => void;
}) {
  const firstOpenRef = useRef<HTMLButtonElement>(null);
  const picks = progress?.picks ?? [];
  const solved = progress?.solved ?? false;
  const stepsRevealed = progress?.stepsRevealed ?? 0;
  const lastChoice = question.choices.find((c) => c.letter === picks[picks.length - 1]);
  const showTrap = !solved && lastChoice?.trap !== undefined;
  const earlier = picks
    .slice(0, -1)
    .map((letter) => question.choices.find((c) => c.letter === letter))
    .filter((c): c is DecoderChoice => c?.trap !== undefined);

  const stateFor = (choice: DecoderChoice): ChoiceState => {
    if (solved && choice.correct) return "correct";
    if (picks.includes(choice.letter)) return "eliminated";
    return solved ? "locked" : "open";
  };
  const firstOpen = question.choices.find((c) => stateFor(c) === "open")?.letter;
  const dodged = question.choices.filter((c) => c.trap && !picks.includes(c.letter));

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Pill>
          Question {index + 1} · {TOPIC_LABEL[question.topic]}
        </Pill>
        {solved && <Pill tone="ok">Lesson: {question.lesson}</Pill>}
      </div>

      <div className="text-lg">{question.prompt}</div>

      <div className="grid gap-2" role="group" aria-label="Answer choices">
        {question.choices.map((choice) => (
          <ChoiceButton
            key={choice.letter}
            choice={choice}
            state={stateFor(choice)}
            onPick={() => onPick(choice)}
            buttonRef={choice.letter === firstOpen ? firstOpenRef : undefined}
          />
        ))}
      </div>

      {earlier.length > 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Earlier traps on this question">
          {earlier.map((choice) => (
            <Pill key={choice.letter} tone="trap">
              {choice.letter}: {TRAPS[choice.trap!.id].name}
            </Pill>
          ))}
        </div>
      )}

      {showTrap && lastChoice && (
        <TrapReveal choice={lastChoice} onTryAgain={() => firstOpenRef.current?.focus()} onWalkthrough={onReveal} />
      )}

      {solved && (
        <div className="space-y-4">
          <Callout tone="ok" icon={CircleCheck} title={picks.length === 1 ? "Decoded! First try!" : "Decoded!"} className="motion-safe:animate-fade-up">
            You saw the trap and found the answer.
          </Callout>
          <DodgedTraps choices={dodged} />
        </div>
      )}

      {stepsRevealed > 0 && (
        <div className="grid gap-5 lg:grid-cols-[1fr_minmax(0,22rem)]">
          <SocraticSteps steps={question.walkthrough} revealed={stepsRevealed} onRevealNext={onReveal} />
          <div className="rounded-xl border border-line bg-surface p-3">
            <VisualAnchor spec={question.visual} level={stepsRevealed} />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {solved && stepsRevealed === 0 && (
          <Button variant="secondary" onClick={onReveal}>
            Walk through it
          </Button>
        )}
        {solved && onNext && (
          <Button onClick={onNext}>
            Next question
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        )}
        {picks.length > 0 && (
          <Button variant="ghost" onClick={onRetry}>
            <RotateCcw aria-hidden="true" className="size-4" />
            Start this one over
          </Button>
        )}
      </div>
    </Card>
  );
}
