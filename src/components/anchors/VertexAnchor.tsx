"use client";
import { useState } from "react";
import { CoordinatePlane } from "@/components/visuals/CoordinatePlane";
import { tokensToText, vertexTokens, type Token } from "@/lib/math/expressions";
import { formatNumber, range } from "@/lib/math/numbers";
import { functionPath, linePath } from "@/lib/math/plot";
import { AnchorWorkspace } from "./AnchorWorkspace";
import { FormulaTokens } from "./FormulaTokens";
import { LabeledSlider } from "./LabeledSlider";

const A_VALUES = range(-3, 3, 0.5);
const HK_VALUES = range(-5, 5, 1);
const GENERAL: Token[] = [
  { text: "y", italic: true },
  { text: " = " },
  { text: "a", role: "a", italic: true },
  { text: "(" },
  { text: "x", italic: true },
  { text: " − " },
  { text: "h", role: "h", italic: true },
  { text: ")² + " },
  { text: "k", role: "k", italic: true },
];

export function VertexAnchor({ onExplore }: { onExplore: () => void }) {
  const [a, setA] = useState(1);
  const [h, setH] = useState(2);
  const [k, setK] = useState(-3);
  const f = formatNumber;

  const width = Math.abs(a) > 1 ? "narrower than" : Math.abs(a) < 1 ? "wider than" : "the same width as";
  const sentences =
    a === 0 ? (
      <p>a = 0 erases the squared part, leaving the flat line y = {f(k)}. That’s not a parabola.</p>
    ) : (
      <>
        <p>
          The vertex is ({f(h)}, {f(k)}).
        </p>
        <p>
          {a > 0
            ? "a is positive, so it opens up and the vertex is the minimum."
            : "a is negative, so it opens down and the vertex is the maximum."}
        </p>
        <p>It is {width} y = x².</p>
      </>
    );

  const trap =
    h !== 0
      ? `Right now (x ${h > 0 ? "−" : "+"} ${f(Math.abs(h))}) means h = ${f(h)}. Inside the parentheses the sign flips: (x + 3) means h = −3.`
      : "In y = (x + 3)² − 1 the vertex is (−3, −1), not (3, −1).";

  return (
    <AnchorWorkspace
      general={<FormulaTokens tokens={GENERAL} />}
      numbers={<FormulaTokens tokens={vertexTokens(a, h, k)} size="md" />}
      graph={
        <CoordinatePlane x={[-8, 8]} y={[-8, 8]} title={`Graph of ${tokensToText(vertexTokens(a, h, k))}`}>
          {({ vp, sx, sy, clip }) => (
            <>
              <g clipPath={`url(#${clip})`}>
                {a !== 0 && (
                  <line x1={sx(h)} y1={0} x2={sx(h)} y2={vp.height} strokeDasharray="4 4" strokeWidth={1.5} className="stroke-trap-line" />
                )}
                <path
                  d={a === 0 ? linePath(0, k, vp) : functionPath((x) => a * (x - h) ** 2 + k, vp)}
                  fill="none"
                  strokeWidth={3}
                  strokeLinecap="round"
                  className="stroke-v1"
                />
              </g>
              {a !== 0 && (
                <>
                  <circle cx={sx(h)} cy={sy(k)} r={5} className="fill-v3 stroke-surface" strokeWidth={2} />
                  <text x={Math.min(vp.width - 4, sx(h) + 8)} y={Math.max(11, sy(k) - 8)} fontSize={10} fontWeight={700} className="fill-v3">
                    ({f(h)}, {f(k)})
                  </text>
                </>
              )}
            </>
          )}
        </CoordinatePlane>
      }
      sliders={
        <>
          <LabeledSlider
            id="vertex-a"
            symbol="a"
            name="stretch & direction"
            colorClass="text-v1"
            values={A_VALUES}
            value={a}
            onChange={(v) => {
              setA(v);
              onExplore();
            }}
          />
          <LabeledSlider
            id="vertex-h"
            symbol="h"
            name="shift left / right"
            colorClass="text-v3"
            values={HK_VALUES}
            value={h}
            onChange={(v) => {
              setH(v);
              onExplore();
            }}
          />
          <LabeledSlider
            id="vertex-k"
            symbol="k"
            name="shift up / down"
            colorClass="text-v2"
            values={HK_VALUES}
            value={k}
            onChange={(v) => {
              setK(v);
              onExplore();
            }}
          />
        </>
      }
      sentences={sentences}
      trap={trap}
    />
  );
}
