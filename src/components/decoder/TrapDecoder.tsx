"use client";
import type { Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";

// Placeholder view; the full Trap Decoder lands in Task 8.
export function TrapDecoder({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  return (
    <ViewHeader
      title="Trap Decoder"
      intro="The SAT builds wrong answers from common slips. Pick an answer. If it’s a trap, you’ll see exactly how it caught you."
      headingRef={headingRef}
    />
  );
}
