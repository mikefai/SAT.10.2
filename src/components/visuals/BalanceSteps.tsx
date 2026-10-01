import { eq } from "@/components/math/MathText";
import { Pill } from "@/components/ui/Pill";
import type { VisualSpec } from "@/content/types";
import type { Level } from "./levels";

export function BalanceSteps({
  states,
  level,
}: {
  states: Extract<VisualSpec, { kind: "balance" }>["states"];
  level: Level;
}) {
  const now = states[level];
  return (
    <div className="w-full space-y-3" role="group" aria-label={`Balance: ${now.left} equals ${now.right}`}>
      <div className="min-h-7 text-center">
        {level > 0 && now.op && (
          <Pill tone="accent">
            <span>{eq(now.op)}</span> on both sides
          </Pill>
        )}
      </div>
      <div aria-hidden="true">
        <div className="flex items-center justify-center gap-3">
          <div className="flex-1 rounded-xl border-2 border-line bg-surface-2 px-2 py-4 text-center text-2xl">{eq(now.left)}</div>
          <span className="text-2xl font-semibold text-muted">=</span>
          <div className="flex-1 rounded-xl border-2 border-line bg-surface-2 px-2 py-4 text-center text-2xl">{eq(now.right)}</div>
        </div>
        <svg viewBox="0 0 40 16" className="mx-auto mt-1 h-4 w-10">
          <polygon points="20,0 36,16 4,16" className="fill-axis" />
        </svg>
      </div>
      {level > 0 && (
        <ol className="space-y-1 text-center text-sm text-muted">
          {states.slice(0, level).map((state, i) => (
            <li key={i} className="opacity-70">
              {eq(`${state.left} = ${state.right}`)}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
