"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MODULE_MINUTES, MODULE_SIZE } from "@/content/exam/types";
import { useProgress } from "@/lib/progress/use-progress";

export function ExamIntro() {
  const [, dispatch] = useProgress();
  return (
    <div className="space-y-5">
      <Card className="space-y-4">
        <h2 className="text-xl font-semibold">How this works</h2>
        <ul className="list-disc space-y-2 pl-5 text-muted">
          <li>
            Two modules, {MODULE_SIZE} questions each, {MODULE_MINUTES} minutes per module — the same structure as the real
            Digital SAT Math section.
          </li>
          <li>
            Once you submit Module 1 you can’t go back to it. Your Module 1 score decides whether Module 2 is a bit easier
            or a bit harder — that’s how the real test adapts too.
          </li>
          <li>Within a module you can skip around, flag questions, and change answers freely.</li>
          <li>At the end you’ll get an estimated 200–800 score, a breakdown by skill area, and a clear next step.</li>
        </ul>
      </Card>
      <Button size="lg" onClick={() => dispatch({ type: "exam/start" })}>
        Start Module 1
      </Button>
    </div>
  );
}
