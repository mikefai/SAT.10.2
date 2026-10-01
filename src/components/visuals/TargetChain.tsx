import { ArrowRight, Target } from "lucide-react";
import { eq } from "@/components/math/MathText";
import type { Level } from "./levels";

export function TargetChain({ chain, level }: { chain: [string, string, string, string]; level: Level }) {
  const shown = chain.slice(0, level + 1);
  return (
    <ol className="flex flex-wrap items-center gap-2" aria-label="Chain of steps toward the target">
      {shown.map((item, i) => {
        const tone =
          i === 0
            ? "border-trap-line bg-trap-soft text-trap"
            : i === 3
              ? "border-transparent bg-ok-soft text-ok"
              : "border-transparent bg-accent-soft text-accent";
        return (
          <li key={item} className="flex items-center gap-2">
            {i > 0 && <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted" />}
            <span className={`flex flex-col items-center rounded-xl border px-3 py-2 text-lg ${tone}`}>
              {i === 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide">
                  <Target aria-hidden="true" className="size-3.5" />
                  Asked for
                </span>
              )}
              {eq(item)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
