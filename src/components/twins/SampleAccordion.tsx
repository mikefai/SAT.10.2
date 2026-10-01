import { ChevronDown, Eye } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { VisualAnchor } from "@/components/visuals/VisualAnchor";
import type { TwinSet } from "@/content/types";
import type { StepIndex, Triple } from "@/lib/progress/types";

export function SampleAccordion({
  set,
  expanded,
  viewed,
  mirrorStep,
  onToggle,
}: {
  set: TwinSet;
  expanded: Triple<boolean>;
  viewed: Triple<boolean>;
  mirrorStep: number | null;
  onToggle: (step: StepIndex) => void;
}) {
  const highestViewed = viewed.lastIndexOf(true);
  return (
    <Card className="min-w-0 space-y-4">
      <div>
        <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-muted">Sample (solved)</p>
        <div className="text-lg">{set.sample.prompt}</div>
      </div>
      <div className="rounded-xl border border-line bg-surface p-3">
        <VisualAnchor spec={set.sample.visual} level={highestViewed + 1} />
      </div>
      <ol className="space-y-2">
        {set.sample.steps.map((step, i) => {
          const open = expanded[i];
          const mirror = mirrorStep === i;
          const index = i as StepIndex;
          return (
            <li key={step.ask} className={`rounded-xl border border-line ${mirror ? "ring-2 ring-accent" : ""}`}>
              <h3>
                <button
                  type="button"
                  id={`sample-${set.id}-${i}`}
                  aria-expanded={open}
                  aria-controls={`sample-panel-${set.id}-${i}`}
                  onClick={() => onToggle(index)}
                  className="flex min-h-12 w-full flex-wrap items-center gap-2 rounded-xl px-3 py-2 text-left"
                >
                  <Pill tone="accent">Step {i + 1}</Pill>
                  <span className="min-w-[10ch] flex-1 font-medium">{step.ask}</span>
                  {mirror && <Pill tone="accent">Mirror step</Pill>}
                  {viewed[i] && (
                    <>
                      <Eye aria-hidden="true" className="size-4 text-muted" />
                      <span className="sr-only">viewed</span>
                    </>
                  )}
                  <ChevronDown aria-hidden="true" className={`size-5 shrink-0 transition ${open ? "rotate-180" : ""}`} />
                </button>
              </h3>
              {open && (
                <div id={`sample-panel-${set.id}-${i}`} role="region" aria-labelledby={`sample-${set.id}-${i}`} className="px-3 pb-3">
                  <p className="text-muted">{step.move}</p>
                  <div className="mt-1">{step.result}</div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
