"use client";
import { CircleCheck } from "lucide-react";
import type { Ref } from "react";
import { ViewHeader } from "@/components/shell/ViewHeader";
import { ANCHORS } from "@/content/anchors";
import type { AnchorId } from "@/content/types";
import { useProgress } from "@/lib/progress/use-progress";
import { PythagoreanAnchor } from "./PythagoreanAnchor";
import { QuadraticAnchor } from "./QuadraticAnchor";
import { SlopeAnchor } from "./SlopeAnchor";
import { VertexAnchor } from "./VertexAnchor";

export function FormulaAnchors({ headingRef }: { headingRef: Ref<HTMLHeadingElement> }) {
  const [state, dispatch] = useProgress();
  const selected: AnchorId = ANCHORS.find((a) => a.id === state.cursor.anchor)?.id ?? "slope";
  const onExplore = () => dispatch({ type: "anchor/explore", anchorId: selected });

  return (
    <div className="space-y-5">
      <ViewHeader
        title="Formula Anchors"
        intro="Move the sliders and watch the formula, the numbers and the picture change together."
        headingRef={headingRef}
      />
      <div className="grid gap-5 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <nav aria-label="Formulas" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {ANCHORS.map((anchor) => {
            const active = anchor.id === selected;
            const explored = state.anchorsExplored.includes(anchor.id);
            return (
              <button
                key={anchor.id}
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => dispatch({ type: "cursor/set", cursor: { anchor: anchor.id } })}
                className={`min-h-11 shrink-0 rounded-xl border px-3 py-2 text-left transition lg:w-full ${
                  active ? "border-accent bg-accent-soft" : "border-line bg-surface hover:bg-surface-2"
                }`}
              >
                <span className="flex items-center gap-2 font-semibold">
                  {anchor.name}
                  {explored && (
                    <>
                      <CircleCheck aria-hidden="true" className="size-4 text-ok" />
                      <span className="sr-only">(explored)</span>
                    </>
                  )}
                </span>
                <span className="hidden font-math text-sm text-muted lg:block">{anchor.formula}</span>
              </button>
            );
          })}
        </nav>
        <div className="min-w-0">
          {selected === "slope" && <SlopeAnchor key="slope" onExplore={onExplore} />}
          {selected === "vertex" && <VertexAnchor key="vertex" onExplore={onExplore} />}
          {selected === "quadratic" && <QuadraticAnchor key="quadratic" onExplore={onExplore} />}
          {selected === "pythagorean" && <PythagoreanAnchor key="pythagorean" onExplore={onExplore} />}
        </div>
      </div>
    </div>
  );
}
