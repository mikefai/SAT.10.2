"use client";
import { useState, type ReactNode } from "react";
import { eq } from "@/components/math/MathText";
import { CoordinatePlane } from "@/components/visuals/CoordinatePlane";
import { standardQuadraticTokens, tokensToText, type Token } from "@/lib/math/expressions";
import { formatNumber, isPerfectSquare, range, simplifySqrt } from "@/lib/math/numbers";
import { functionPath } from "@/lib/math/plot";
import { solveQuadratic } from "@/lib/math/quadratic";
import { AnchorWorkspace } from "./AnchorWorkspace";
import { FormulaTokens } from "./FormulaTokens";
import { LabeledSlider } from "./LabeledSlider";

const A_VALUES = [-3, -2, -1, 1, 2, 3];
const BC_VALUES = range(-6, 6, 1);
const GENERAL: Token[] = [
  { text: "x", italic: true },
  { text: " = (−" },
  { text: "b", role: "b", italic: true },
  { text: " ± √(" },
  { text: "b", role: "b", italic: true },
  { text: "² − 4" },
  { text: "a", role: "a", italic: true },
  { text: "c", role: "c", italic: true },
  { text: ")) / 2" },
  { text: "a", role: "a", italic: true },
];

export function QuadraticAnchor({ onExplore }: { onExplore: () => void }) {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-2);
  const [c, setC] = useState(-3);
  const f = formatNumber;
  const p = (n: number) => `(${f(n)})`;
  const solution = solveQuadratic(a, b, c);
  const d = b * b - 4 * a * c;

  let roots: ReactNode;
  if (solution.kind === "none" || solution.kind === "not-quadratic") {
    roots = <p className="font-semibold">No real solutions</p>;
  } else if (isPerfectSquare(d)) {
    const r = Math.sqrt(d);
    roots = (
      <>
        {eq(`x = (${f(-b)} ± ${r}) / ${f(2 * a)}`, true)}
        <p className="text-center font-semibold">
          {solution.roots.map((root, i) => (
            <span key={i}>
              {i > 0 && " or "}
              {eq(`x = ${f(root)}`)}
            </span>
          ))}
        </p>
      </>
    );
  } else {
    const { outside, inside } = simplifySqrt(d);
    roots = (
      <>
        {eq(`x = (${f(-b)} ± ${outside > 1 ? outside : ""}√${inside}) / ${f(2 * a)}`, true)}
        <p className="text-center font-semibold">≈ {solution.roots.map((root) => f(root)).join(" or ")}</p>
      </>
    );
  }

  const meaning =
    d > 0
      ? "Two real solutions: the parabola crosses the x-axis twice."
      : d === 0
        ? "One real solution: the parabola just touches the x-axis."
        : "No real solutions: the parabola never reaches the x-axis.";

  return (
    <AnchorWorkspace
      general={<FormulaTokens tokens={GENERAL} />}
      numbers={
        <>
          <FormulaTokens tokens={standardQuadraticTokens(a, b, c)} size="md" />
          <div className="mt-2 overflow-x-auto text-ink">
            {eq(`x = (−${p(b)} ± √(${p(b)}² − 4${p(a)}${p(c)})) / (2${p(a)})`, true)}
          </div>
        </>
      }
      graph={
        <CoordinatePlane x={[-8, 8]} y={[-10, 10]} title={`Graph of ${tokensToText(standardQuadraticTokens(a, b, c))}`}>
          {({ vp, sx, sy, clip }) => (
            <>
              <g clipPath={`url(#${clip})`}>
                <path
                  d={functionPath((x) => a * x * x + b * x + c, vp)}
                  fill="none"
                  strokeWidth={3}
                  strokeLinecap="round"
                  className="stroke-v1"
                />
              </g>
              {(solution.kind === "one" || solution.kind === "two") &&
                solution.roots.map((root) => (
                  <circle key={root} cx={sx(root)} cy={sy(0)} r={5} className="fill-v3 stroke-surface" strokeWidth={2} />
                ))}
            </>
          )}
        </CoordinatePlane>
      }
      sliders={
        <>
          <LabeledSlider
            id="quad-a"
            symbol="a"
            name="opens up or down"
            colorClass="text-v1"
            values={A_VALUES}
            value={a}
            onChange={(v) => {
              setA(v);
              onExplore();
            }}
          />
          <LabeledSlider
            id="quad-b"
            symbol="b"
            name="middle term"
            colorClass="text-v2"
            values={BC_VALUES}
            value={b}
            onChange={(v) => {
              setB(v);
              onExplore();
            }}
          />
          <LabeledSlider
            id="quad-c"
            symbol="c"
            name="constant"
            colorClass="text-v3"
            values={BC_VALUES}
            value={c}
            onChange={(v) => {
              setC(v);
              onExplore();
            }}
          />
          <div className="rounded-xl border border-line bg-surface p-3">
            <p className="text-sm text-muted">Discriminant</p>
            {eq(`b² − 4ac = ${p(b)}² − 4${p(a)}${p(c)} = ${f(d)}`, true)}
          </div>
        </>
      }
      sentences={
        <>
          <p>{meaning}</p>
          {roots}
        </>
      }
      trap="−b means the opposite of b. If b = −2, then −b = 2."
    />
  );
}
