"use client";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import type { GuidedStep as GuidedStepContent } from "@/content/types";
import { formatNumber } from "@/lib/math/numbers";
import { answersMatch, parseNumericAnswer } from "@/lib/math/parse";
import { MISSES_BEFORE_SHOW_ME } from "@/lib/progress/reducer";
import type { AnswerMode, StepIndex } from "@/lib/progress/types";
import { useProgress } from "@/lib/progress/use-progress";

export function GuidedStep({
  setId,
  index,
  step,
  status,
  assisted,
  misses,
  mode,
  onPeek,
}: {
  setId: string;
  index: StepIndex;
  step: GuidedStepContent;
  status: "done" | "active" | "locked";
  assisted: boolean;
  misses: number;
  mode: AnswerMode;
  onPeek: () => void;
}) {
  const [, dispatch] = useProgress();
  const [text, setText] = useState("");
  const [lastValue, setLastValue] = useState<number | null>(null);
  const [formatHint, setFormatHint] = useState(false);

  const answerLabel = step.options.find((o) => o.value === step.answer)?.label ?? formatNumber(step.answer);

  function submit(value: number | null) {
    if (value === null) {
      setFormatHint(true); // not a number: hint only, nothing counts as a miss
      return;
    }
    setFormatHint(false);
    setLastValue(value);
    dispatch({ type: "twin/answer", twinId: setId, step: index, correct: answersMatch(value, step.answer) });
  }

  let blank: React.ReactNode;
  if (status === "done") {
    blank = <span className="font-semibold text-ok">{answerLabel}</span>;
  } else if (status === "active" && mode === "type") {
    blank = (
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        aria-label={step.ask}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="w-[5ch] rounded-md border-2 border-accent bg-surface px-1 text-center font-math text-xl"
      />
    );
  } else {
    blank = <span aria-label="blank" className="inline-block min-w-[3ch] border-b-2 border-dashed border-accent text-center">&nbsp;</span>;
  }

  let feedback: React.ReactNode = null;
  if (status === "active") {
    if (formatHint) {
      feedback = <Callout tone="info">Type a number, like 7, −3, or 4/5.</Callout>;
    } else if (lastValue !== null) {
      const mistake = step.mistakes.find((m) => answersMatch(m.value, lastValue));
      feedback = mistake ? (
        <Callout tone="trap" title="Not quite">
          {mistake.why}
        </Callout>
      ) : (
        <Callout tone="info" title="Not quite">
          {step.nudge}
        </Callout>
      );
    }
  }

  return (
    <li className={`rounded-xl border border-line p-4 ${status === "locked" ? "opacity-50" : ""} ${status === "active" ? "bg-surface-2" : ""}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Pill tone={status === "done" ? "ok" : "accent"}>Step {index + 1}</Pill>
        <span className="font-medium">{step.ask}</span>
        {status === "done" && <CircleCheck aria-hidden="true" className="size-5 text-ok" />}
        {status === "done" && assisted && <Pill tone="trap">shown</Pill>}
      </div>

      {status === "locked" ? (
        <p className="text-sm text-muted">Unlocks after step {index}</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit(parseNumericAnswer(text));
          }}
          className="space-y-3"
        >
          <div className="text-muted">{step.context}</div>
          <div className="text-xl">{step.line(blank)}</div>

          {status === "active" && mode === "type" && <Button type="submit">Check</Button>}

          {status === "active" && mode === "choose" && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Choose an answer">
              {step.options.map((option) => (
                <Button key={option.value} variant="secondary" size="lg" onClick={() => submit(option.value)}>
                  {option.label ?? formatNumber(option.value)}
                </Button>
              ))}
            </div>
          )}

          {feedback}

          {status === "active" && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {misses >= MISSES_BEFORE_SHOW_ME && (
                <>
                  <Button variant="secondary" onClick={() => dispatch({ type: "twin/showMe", twinId: setId, step: index })}>
                    Show me
                  </Button>
                  {mode === "type" && (
                    <Button variant="ghost" onClick={() => dispatch({ type: "settings/answerMode", mode: "choose" })}>
                      Pick from 3 choices
                    </Button>
                  )}
                </>
              )}
              <button
                type="button"
                className="min-h-11 font-medium text-accent underline underline-offset-4"
                onClick={() => dispatch({ type: "settings/answerMode", mode: mode === "type" ? "choose" : "type" })}
              >
                {mode === "type" ? "Show 3 choices" : "Type it instead"}
              </button>
              <button type="button" className="min-h-11 font-medium text-accent underline underline-offset-4" onClick={onPeek}>
                Peek at the sample
              </button>
            </div>
          )}
        </form>
      )}
    </li>
  );
}
