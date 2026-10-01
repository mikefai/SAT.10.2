import { TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Callout } from "@/components/ui/Callout";
import { Card } from "@/components/ui/Card";

export function AnchorWorkspace({
  general,
  numbers,
  graph,
  sliders,
  sentences,
  trap,
}: {
  general: ReactNode;
  numbers: ReactNode;
  graph: ReactNode;
  sliders: ReactNode;
  sentences: ReactNode;
  trap: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <Card className="space-y-3 overflow-x-auto">
        <div>{general}</div>
        <div className="border-t border-line pt-3 text-muted">{numbers}</div>
      </Card>
      <div className="grid items-start gap-4 md:grid-cols-2">
        <Card className="p-3 sm:p-3">{graph}</Card>
        <div className="space-y-3">{sliders}</div>
      </div>
      <Card>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">What changed</p>
        <div aria-live="polite" className="space-y-1">
          {sentences}
        </div>
      </Card>
      <Callout tone="trap" icon={TriangleAlert} title="SAT trap">
        {trap}
      </Callout>
    </div>
  );
}
