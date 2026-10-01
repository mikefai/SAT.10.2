"use client";
import { useState } from "react";
import { eq } from "@/components/math/MathText";
import { CoordinatePlane } from "@/components/visuals/CoordinatePlane";
import { linearTokens, tokensToText, type Token } from "@/lib/math/expressions";
import { slopeRiseRun } from "@/lib/math/geometry";
import { formatNumber, range } from "@/lib/math/numbers";
import { linePath } from "@/lib/math/plot";
import { AnchorWorkspace } from "./AnchorWorkspace";
import { FormulaTokens } from "./FormulaTokens";
import { LabeledSlider } from "./LabeledSlider";

const M_VALUES = range(-4, 4, 0.5);
const B_VALUES = range(-6, 6, 1);
const GENERAL: Token[] = [
  { text: "y", italic: true },
  { text: " = " },
  { text: "m", role: "m", italic: true },
  { text: "x", italic: true },
  { text: " + " },
  { text: "b", role: "b", italic: true },
];
const inView = (x: number, y: number) => Math.abs(x) <= 8 && Math.abs(y) <= 8;

export function SlopeAnchor({ onExplore }: { onExplore: () => void }) {
  const [m, setM] = useState(2);
  const [b, setB] = useState(1);
  const { rise, run } = slopeRiseRun(m);
  const f = formatNumber;

  const signSentence =
    m > 0
      ? "Positive slope: the line rises as you move right."
      : m < 0
        ? "Negative slope: the line falls as you move right."
        : "Zero slope: a flat line.";
  const stepSentence =
    m === 0
      ? "Every 1 step right, y stays the same."
      : `Every ${run} step${run > 1 ? "s" : ""} right, y goes ${rise > 0 ? "up" : "down"} ${f(Math.abs(rise))}.`;

  return (
    <AnchorWorkspace
      general={<FormulaTokens tokens={GENERAL} />}
      numbers={<FormulaTokens tokens={linearTokens(m, b)} size="md" />}
      graph={
        <CoordinatePlane x={[-8, 8]} y={[-8, 8]} title={`Graph of ${tokensToText(linearTokens(m, b))}`}>
          {({ vp, sx, sy, clip }) => (
            <>
              <g clipPath={`url(#${clip})`}>
                <path d={linePath(m, b, vp)} fill="none" strokeWidth={3} strokeLinecap="round" className="stroke-v1" />
                <polyline
                  points={`${sx(0)},${sy(b)} ${sx(run)},${sy(b)} ${sx(run)},${sy(b + rise)}`}
                  fill="none"
                  strokeDasharray="4 3"
                  strokeWidth={2}
                  className="stroke-trap-line"
                />
              </g>
              {inView(0, b) && (
                <>
                  <circle cx={sx(0)} cy={sy(b)} r={5} className="fill-v2 stroke-surface" strokeWidth={2} />
                  <text x={sx(0) + 8} y={sy(b) - 8} fontSize={10} fontWeight={700} className="fill-v2">
                    (0, {f(b)})
                  </text>
                </>
              )}
              {inView(run / 2, b) && (
                <text x={sx(run / 2)} y={sy(b) + 13} textAnchor="middle" fontSize={10} fontWeight={600} className="fill-trap">
                  run {run}
                </text>
              )}
              {rise !== 0 && inView(run, b + rise / 2) && (
                <text x={sx(run) + 5} y={sy(b + rise / 2) + 3} fontSize={10} fontWeight={600} className="fill-trap">
                  rise {f(rise)}
                </text>
              )}
            </>
          )}
        </CoordinatePlane>
      }
      sliders={
        <>
          <LabeledSlider
            id="slope-m"
            symbol="m"
            name="slope"
            colorClass="text-v1"
            values={M_VALUES}
            value={m}
            onChange={(v) => {
              setM(v);
              onExplore();
            }}
          />
          <LabeledSlider
            id="slope-b"
            symbol="b"
            name="y-intercept"
            colorClass="text-v2"
            values={B_VALUES}
            value={b}
            onChange={(v) => {
              setB(v);
              onExplore();
            }}
          />
          <div className="rounded-xl border border-line bg-surface p-3 text-sm">
            <p className="mb-1 text-muted">Slope from two points:</p>
            {eq("m = (y₂ − y₁) / (x₂ − x₁)", true)}
            {eq(`= (${f(b + rise)} − ${f(b)}) / (${run} − 0) = ${f(m)}`, true)}
          </div>
        </>
      }
      sentences={
        <>
          <p>{signSentence}</p>
          <p>{stepSentence}</p>
          <p>
            b = {f(b)}: the line crosses the y-axis at (0, {f(b)}).
          </p>
        </>
      }
      trap="Slope is rise over run: the y-change goes on top."
    />
  );
}
