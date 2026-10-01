"use client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MODULE_MINUTES } from "@/content/exam/types";
import { useProgress } from "@/lib/progress/use-progress";

export function BetweenModules() {
  const [, dispatch] = useProgress();
  return (
    <Card className="space-y-4 text-center">
      <h2 className="text-2xl font-semibold">Module 1 complete</h2>
      <p className="text-muted">
        Take a breath. Module 2 is {MODULE_MINUTES} minutes, and the timer starts as soon as you continue.
      </p>
      <Button size="lg" onClick={() => dispatch({ type: "exam/startModule2" })}>
        Continue to Module 2
      </Button>
    </Card>
  );
}
