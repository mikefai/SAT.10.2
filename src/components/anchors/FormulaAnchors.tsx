"use client";
import type { Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";

// Placeholder view; the full Formula Anchors lands in Task 10.
export function FormulaAnchors({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  return (
    <ViewHeader
      title="Formula Anchors"
      intro="Move the sliders and watch the formula, the numbers and the picture change together."
      headingRef={headingRef}
    />
  );
}
