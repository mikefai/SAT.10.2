import { useId } from "react";
import type { VisualSpec } from "@/content/types";
import type { Level } from "./levels";

type Props = Omit<Extract<VisualSpec, { kind: "distribution" }>, "kind"> & { level: Level };

const inner = (term: string) => (term.startsWith("−") ? `− ${term.slice(1)}` : `+ ${term}`);

export function DistributionArrows({ factor, terms, products, level }: Props) {
  const marker = `arrow-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const label =
    level >= 1
      ? `${factor} multiplies both terms inside the parentheses, giving ${products[0]} and ${products[1]}.`
      : `${factor} times the quantity ${terms[0]} ${inner(terms[1])}.`;
  return (
    <svg viewBox="0 0 320 150" role="img" aria-label={label} className="mx-auto h-auto w-full max-w-sm">
      <defs>
        <marker id={marker} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={7} markerHeight={7} orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" className="fill-v1" />
        </marker>
      </defs>
      <g fontSize={26} className="fill-ink" style={{ fontFamily: "var(--font-math)" }}>
        <text x={36} y={80}>
          {factor}
        </text>
        <text x={88} y={80}>
          (
        </text>
        <text x={104} y={80} fontStyle="italic">
          {terms[0]}
        </text>
        <text x={152} y={80}>
          {inner(terms[1])}
        </text>
        <text x={226} y={80}>
          )
        </text>
      </g>
      {level >= 1 && (
        <>
          <path d="M52 56 Q84 20 112 56" fill="none" strokeWidth={2.5} markerEnd={`url(#${marker})`} className="stroke-v1" />
          <path d="M52 56 Q130 -8 178 56" fill="none" strokeWidth={2.5} markerEnd={`url(#${marker})`} className="stroke-v1" />
          <g fontSize={22} fontWeight={700} textAnchor="middle" className="fill-v1" style={{ fontFamily: "var(--font-math)" }}>
            <text x={112} y={125}>
              {products[0]}
            </text>
            <text x={186} y={125}>
              {products[1]}
            </text>
          </g>
        </>
      )}
    </svg>
  );
}
