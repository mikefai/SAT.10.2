"use client";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useProgress } from "@/lib/progress/use-progress";

export function ResetProgress() {
  const [, dispatch] = useProgress();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(timer);
  }, [confirming]);

  return (
    <div className="flex justify-center pt-2">
      <Button
        variant="ghost"
        onClick={() => {
          if (!confirming) {
            setConfirming(true);
            return;
          }
          dispatch({ type: "progress/reset" });
          setConfirming(false);
        }}
      >
        <RotateCcw aria-hidden="true" className="size-4" />
        {confirming ? "Tap again to reset" : "Reset progress"}
      </Button>
    </div>
  );
}
