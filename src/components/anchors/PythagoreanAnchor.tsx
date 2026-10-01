"use client";
import { useState } from "react";
import { eq, V } from "@/components/math/MathText";
import { Pill } from "@/components/ui/Pill";
import { RightTriangleSquares } from "@/components/visuals/RightTriangleSquares";
import type { Token } from "@/lib/math/expressions";
import { hypotenuse } from "@/lib/math/geometry";
import { formatNumber, range, simplifySqrt } from "@/lib/math/numbers";
import { AnchorWorkspace } from "./AnchorWorkspace";
import { FormulaTokens } from "./FormulaTokens";
import { LabeledSlider } from "./LabeledSlider";

const LEG_VALUES = range(1, 12, 1);
const GENERAL: Token[] = [
  { text: "a", role: "a", italic: true },
  { text: "² + " },
  { text: "b", role: "b", italic: true },
  { text: "² = " },
  { text: "c", role: "c", italic: true },
  { text: "²" },
];

export function PythagoreanAnchor({ onExplore }: { onExplore: () => void }) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const f = formatNumber;
  const { cSquared, c, exact } = hypotenuse(a, b);
  const { outside, inside } = simplifySqrt(cSquared);
  const cLine = exact
    ? `c = ${f(c)}`
    : `c = √${cSquared}${outside > 1 ? ` = ${outside}√${inside}` : ""} ≈ ${f(c)}`;

  return (
    <AnchorWorkspace
      general={<FormulaTokens tokens={GENERAL} />}
      numbers={eq(`${a}² + ${b}² = c²`, true)}
      graph={<RightTriangleSquares a={a} b={b} level={3} />}
      sliders={
        <>
          <LabeledSlider
            id="pyth-a"
            symbol="a"
            name="one leg"
            colorClass="text-v1"
            values={LEG_VALUES}
            value={a}
            onChange={(v) => {
              setA(v);
              onExplore();
            }}
          />
          <LabeledSlider
            id="pyth-b"
            symbol="b"
            name="other leg"
            colorClass="text-v2"
            values={LEG_VALUES}
            value={b}
            onChange={(v) => {
              setB(v);
              onExplore();
            }}
          />
        </>
      }
      sentences={
        <>
          {eq(`c² = a² + b² = ${a * a} + ${b * b} = ${cSquared}`, true)}
          <p className="flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="font-math text-xl">{eq(cLine)}</span>
            {exact && <Pill tone="ok">Pythagorean triple!</Pill>}
          </p>
        </>
      }
      trap={
        <>
          <V>a</V> + <V>b</V> is never <V>c</V>: {a} + {b} = {a + b}, but <V>c</V> ≈ {f(c)}.
        </>
      }
    />
  );
}
