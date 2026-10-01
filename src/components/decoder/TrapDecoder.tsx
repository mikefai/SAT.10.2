"use client";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { DECODER_QUESTIONS } from "@/content/decoder";
import { TRAPS } from "@/content/traps";
import { useProgress } from "@/lib/progress/use-progress";
import type { Tab } from "@/lib/tabs";
import { DecoderQuestionCard } from "./DecoderQuestionCard";

export function TrapDecoder({
  headingRef,
  onNavigate,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  onNavigate: (tab: Tab) => void;
}) {
  const [state, dispatch] = useProgress();
  const total = DECODER_QUESTIONS.length;
  const index = Math.min(state.cursor.decoder, total - 1);
  const question = DECODER_QUESTIONS[index];
  const progress = state.decoder[question.id];
  const done = DECODER_QUESTIONS.map((q) => state.decoder[q.id]?.solved ?? false);
  const allDone = done.every(Boolean);

  const lastLetter = progress?.picks[progress.picks.length - 1];
  const lastTrap = question.choices.find((c) => c.letter === lastLetter)?.trap;
  const announcement = progress?.solved ? "Decoded!" : lastTrap ? `Trap spotted: ${TRAPS[lastTrap.id].name}` : "";

  const go = (next: number) => dispatch({ type: "cursor/set", cursor: { decoder: next } });

  return (
    <div className="space-y-5">
      <ViewHeader
        title="Trap Decoder"
        intro="The SAT builds wrong answers from common slips. Pick an answer. If it’s a trap, you’ll see exactly how it caught you."
        headingRef={headingRef}
      />
      <p role="status" className="sr-only">
        {announcement}
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProgressDots
          total={total}
          current={index}
          done={done}
          label={(i) => `Question ${i + 1}${done[i] ? ", decoded" : ""}`}
          onSelect={go}
        />
        <div className="flex gap-2">
          <Button variant="secondary" disabled={index === 0} onClick={() => go(index - 1)}>
            <ChevronLeft aria-hidden="true" className="size-4" />
            Previous
          </Button>
          <Button variant="secondary" disabled={index === total - 1} onClick={() => go(index + 1)}>
            Next
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>

      <DecoderQuestionCard
        key={question.id}
        question={question}
        index={index}
        progress={progress}
        onPick={(choice) =>
          dispatch({ type: "decoder/pick", questionId: question.id, choice: choice.letter, correct: choice.correct === true })
        }
        onReveal={() => dispatch({ type: "decoder/revealStep", questionId: question.id })}
        onRetry={() => dispatch({ type: "decoder/retry", questionId: question.id })}
        onNext={index < total - 1 ? () => go(index + 1) : undefined}
      />

      {allDone && (
        <Callout tone="info" title="All five traps decoded">
          <p className="mb-3">Nice work. Now practice the same patterns on fresh numbers.</p>
          <Button onClick={() => onNavigate("twins")}>
            Next: Twin Drill
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </Callout>
      )}
    </div>
  );
}
