"use client";
import { Flag } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import type { ExamQuestion } from "@/content/exam/types";
import type { ChoiceLetter, ExamResponse } from "@/lib/progress/types";

export function ExamQuestionCard({
  question,
  index,
  total,
  response,
  flagged,
  onAnswerMc,
  onAnswerSpr,
  onToggleFlag,
}: {
  question: ExamQuestion;
  index: number;
  total: number;
  response: ExamResponse | undefined;
  flagged: boolean;
  onAnswerMc: (letter: ChoiceLetter) => void;
  onAnswerSpr: (text: string) => void;
  onToggleFlag: () => void;
}) {
  // The typed value is local so every keystroke doesn't fight the progress store.
  // The caller remounts this card with key={question.id} on navigation, which resets
  // this state automatically — the same pattern the Twin Drill's GuidedStep uses.
  const [text, setText] = useState(response?.text ?? "");

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Pill>
          Question {index + 1} of {total}
        </Pill>
        <button
          type="button"
          onClick={onToggleFlag}
          aria-pressed={flagged}
          className={`flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium ${
            flagged ? "bg-trap-soft text-trap" : "text-muted hover:bg-surface-2"
          }`}
        >
          <Flag aria-hidden="true" className={`size-4 ${flagged ? "fill-trap" : ""}`} />
          {flagged ? "Flagged" : "Mark for review"}
        </button>
      </div>

      <div className="text-lg">{question.prompt}</div>

      {question.type === "mc" ? (
        <div className="grid gap-2" role="group" aria-label="Answer choices">
          {question.choices.map((choice) => {
            const selected = response?.letter === choice.letter;
            return (
              <button
                key={choice.letter}
                type="button"
                onClick={() => onAnswerMc(choice.letter)}
                aria-pressed={selected}
                className={`flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 py-2 text-left text-lg transition ${
                  selected ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-accent"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full border border-current text-base font-semibold"
                >
                  {choice.letter}
                </span>
                <span className="flex-1">{choice.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <label htmlFor={`spr-${question.id}`} className="mb-2 block text-sm font-medium text-muted">
            Type your answer
          </label>
          <input
            id={`spr-${question.id}`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              onAnswerSpr(event.target.value);
            }}
            className="h-12 w-40 rounded-xl border-2 border-accent bg-surface px-3 text-xl font-math"
            placeholder="e.g. 7, −3, or 4/5"
          />
        </div>
      )}
    </Card>
  );
}
