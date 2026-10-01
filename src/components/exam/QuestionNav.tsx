import { Flag } from "lucide-react";
import type { ExamResponse } from "@/lib/progress/types";

export function QuestionNav({
  total,
  responses,
  flags,
  current,
  onGoTo,
}: {
  total: number;
  responses: Record<number, ExamResponse>;
  flags: number[];
  current: number;
  onGoTo: (index: number) => void;
}) {
  return (
    <nav aria-label="Questions" className="grid grid-cols-5 gap-1.5 sm:grid-cols-11">
      {Array.from({ length: total }, (_, i) => {
        const answered = i in responses;
        const flagged = flags.includes(i);
        const active = i === current;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onGoTo(i)}
            aria-current={active ? "step" : undefined}
            aria-label={`Question ${i + 1}${answered ? ", answered" : ", not answered"}${flagged ? ", flagged for review" : ""}`}
            className={`relative flex size-11 items-center justify-center rounded-lg border text-sm font-semibold transition ${
              active
                ? "border-accent bg-accent-soft text-accent"
                : answered
                  ? "border-ok bg-ok-soft text-ok"
                  : "border-line bg-surface text-muted"
            }`}
          >
            {i + 1}
            {flagged && <Flag aria-hidden="true" className="absolute -right-1 -top-1 size-3.5 fill-trap text-trap" />}
          </button>
        );
      })}
    </nav>
  );
}
