import { Keyboard, ListChecks } from "lucide-react";
import type { AnswerMode } from "@/lib/progress/types";

const OPTIONS: { mode: AnswerMode; label: string; icon: typeof Keyboard }[] = [
  { mode: "type", label: "Type it", icon: Keyboard },
  { mode: "choose", label: "Choose", icon: ListChecks },
];

export function AnswerModeToggle({ mode, onChange }: { mode: AnswerMode; onChange: (mode: AnswerMode) => void }) {
  return (
    <div role="group" aria-label="How do you want to answer?" className="inline-flex rounded-xl border border-line bg-surface-2 p-1">
      {OPTIONS.map(({ mode: id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={mode === id}
          onClick={() => onChange(id)}
          className={`flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition ${
            mode === id ? "bg-surface text-accent shadow-sm" : "text-muted hover:text-ink"
          }`}
        >
          <Icon aria-hidden="true" className="size-4" />
          {label}
        </button>
      ))}
    </div>
  );
}
