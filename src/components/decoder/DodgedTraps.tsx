import { TRAPS } from "@/content/traps";
import type { DecoderChoice } from "@/content/types";

export function DodgedTraps({ choices }: { choices: DecoderChoice[] }) {
  const dodged = choices.filter((choice) => choice.trap);
  if (dodged.length === 0) return null;
  return (
    <details className="rounded-xl border border-line bg-surface-2 p-4">
      <summary className="min-h-6 cursor-pointer font-semibold">Traps you dodged ({dodged.length})</summary>
      <ul className="mt-3 space-y-2">
        {dodged.map((choice) => (
          <li key={choice.letter}>
            <span className="font-semibold">
              {choice.letter}: {TRAPS[choice.trap!.id].name}
            </span>
            <span className="block text-muted">{choice.trap!.headline}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}
