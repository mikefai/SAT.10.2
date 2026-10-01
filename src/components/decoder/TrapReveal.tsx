import { Lightbulb, TriangleAlert } from "lucide-react";
import { eq } from "@/components/math/MathText";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Pill } from "@/components/ui/Pill";
import { TRAPS } from "@/content/traps";
import type { DecoderChoice } from "@/content/types";

export function TrapReveal({
  choice,
  onTryAgain,
  onWalkthrough,
}: {
  choice: DecoderChoice;
  onTryAgain: () => void;
  onWalkthrough: () => void;
}) {
  const trap = choice.trap;
  if (!trap) return null;
  const meta = TRAPS[trap.id];
  return (
    <Callout tone="trap" icon={TriangleAlert} title={`Trap spotted: ${meta.name}`} className="motion-safe:animate-fade-up">
      <div className="space-y-4">
        <p className="text-lg font-medium">{trap.headline}</p>
        <div>
          <p className="mb-2 font-semibold">How this answer happens:</p>
          <ol className="space-y-2">
            {trap.work.map((line, i) => (
              <li key={i} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {line.label && <span className="text-sm font-semibold">{line.label}</span>}
                <span className={line.slip ? "underline decoration-trap-line decoration-2 underline-offset-4" : ""}>
                  {eq(line.math)}
                </span>
                {line.slip && <Pill tone="trap">the slip</Pill>}
                {line.note && <span className="text-sm">{line.note}</span>}
              </li>
            ))}
          </ol>
        </div>
        <p>
          <span className="font-semibold">The fix: </span>
          {trap.fix}
        </p>
        <p className="flex gap-2">
          <Lightbulb aria-hidden="true" className="mt-1 size-5 shrink-0" />
          <span>
            <span className="font-semibold">Habit: </span>
            {meta.habit}
          </span>
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={onTryAgain}>
            Try again
          </Button>
          <Button onClick={onWalkthrough}>Walk me through it</Button>
        </div>
      </div>
    </Callout>
  );
}
