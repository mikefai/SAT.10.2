import { CircleCheck, TriangleAlert } from "lucide-react";
import type { Ref } from "react";
import type { DecoderChoice } from "@/content/types";

export type ChoiceState = "open" | "eliminated" | "correct" | "locked";

const STYLES: Record<ChoiceState, string> = {
  open: "border-line bg-surface hover:border-accent hover:bg-accent-soft",
  eliminated: "border-line bg-surface-2 text-muted",
  correct: "border-transparent bg-ok-soft text-ok",
  locked: "border-line bg-surface text-muted opacity-70",
};

export function ChoiceButton({
  choice,
  state,
  onPick,
  buttonRef,
}: {
  choice: DecoderChoice;
  state: ChoiceState;
  onPick: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={state !== "open"}
      onClick={onPick}
      className={`flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-4 py-2 text-left text-lg transition ${STYLES[state]}`}
    >
      <span
        aria-hidden="true"
        className="flex size-8 shrink-0 items-center justify-center rounded-full border border-current text-base font-semibold"
      >
        {choice.letter}
      </span>
      <span className={`flex-1 ${state === "eliminated" ? "line-through" : ""}`}>
        <span className="sr-only">Choice {choice.letter}: </span>
        {choice.label}
      </span>
      {state === "eliminated" && (
        <>
          <TriangleAlert aria-hidden="true" className="size-5 shrink-0" />
          <span className="sr-only">trap</span>
        </>
      )}
      {state === "correct" && (
        <>
          <CircleCheck aria-hidden="true" className="size-5 shrink-0" />
          <span className="sr-only">correct</span>
        </>
      )}
    </button>
  );
}
