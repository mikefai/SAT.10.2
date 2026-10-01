"use client";
import type { Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";

// Placeholder view; the full Twin Drill lands in Task 9.
export function TwinDrill({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  return (
    <ViewHeader
      title="Twin Question Drill"
      intro="Study a solved problem, then solve its twin: same steps, new numbers."
      headingRef={headingRef}
    />
  );
}
