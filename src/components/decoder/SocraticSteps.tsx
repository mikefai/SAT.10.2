import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { SocraticStep } from "@/content/types";
import type { Triple } from "@/lib/progress/types";

export function SocraticSteps({
  steps,
  revealed,
  onRevealNext,
}: {
  steps: Triple<SocraticStep>;
  revealed: number;
  onRevealNext: () => void;
}) {
  return (
    <div className="space-y-3">
      <ol className="space-y-3">
        {steps.slice(0, revealed).map((step, i) => (
          <li key={step.ask} className="motion-safe:animate-fade-up rounded-xl border border-line bg-surface-2 p-4">
            <p className="flex items-start gap-2 font-semibold">
              <span
                aria-hidden="true"
                className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-solid text-sm text-on-accent"
              >
                {i + 1}
              </span>
              {step.ask}
            </p>
            <p className="mt-2 text-muted">{step.move}</p>
            <div className="mt-1">{step.result}</div>
          </li>
        ))}
      </ol>
      {revealed < 3 ? (
        <Button onClick={onRevealNext}>Show step {revealed + 1}</Button>
      ) : (
        <p className="flex items-center gap-2 font-semibold text-ok">
          <CircleCheck aria-hidden="true" className="size-5" />
          Pattern locked in.
        </p>
      )}
    </div>
  );
}
