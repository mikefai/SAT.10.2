import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function ModuleCard({
  step,
  icon: Icon,
  title,
  description,
  progressText,
  fraction,
  onOpen,
}: {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  progressText: string;
  fraction: number; // 0–1
  onOpen: () => void;
}) {
  const cta = fraction >= 1 ? "Review" : fraction > 0 ? "Continue" : "Start";
  return (
    <Card as="div" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent-soft font-semibold text-accent">
          {step}
        </span>
        <Icon aria-hidden="true" className="size-6 text-accent" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-muted">{description}</p>
      <div className="mt-auto space-y-2">
        <p className="text-sm font-medium">{progressText}</p>
        <div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full rounded-full bg-accent-solid transition-all" style={{ width: `${Math.round(fraction * 100)}%` }} />
        </div>
        <Button onClick={onOpen} className="w-full">
          {cta}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </Card>
  );
}
