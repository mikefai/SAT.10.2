import { hypotenuse } from "@/lib/math/geometry";
import { formatNumber, simplifySqrt } from "@/lib/math/numbers";
import type { Level } from "./levels";

type Pt = [number, number];

export function cValueText(a: number, b: number): string {
  const { cSquared, c, exact } = hypotenuse(a, b);
  if (exact) return `c = ${formatNumber(c)}`;
  const { outside, inside } = simplifySqrt(cSquared);
  return outside > 1 ? `c = ${outside}√${inside}` : `c = √${cSquared}`;
}

export function RightTriangleSquares({ a, b, level }: { a: number; b: number; level: Level }) {
  const { cSquared } = hypotenuse(a, b);
  // World coordinates: the right angle sits at (0,0); leg b runs along +x and leg a along +y.
  const width = 2 * a + b;
  const height = a + 2 * b;
  const s = Math.min(280 / width, 280 / height);
  const px = (x: number) => 20 + (x + a) * s;
  const py = (y: number) => 20 + (a + b - y) * s;
  const poly = (pts: Pt[]) => pts.map(([x, y]) => `${px(x)},${py(y)}`).join(" ");
  const triangle: Pt[] = [
    [0, 0],
    [b, 0],
    [0, a],
  ];
  const squareB: Pt[] = [
    [0, 0],
    [b, 0],
    [b, -b],
    [0, -b],
  ];
  const squareA: Pt[] = [
    [0, 0],
    [0, a],
    [-a, a],
    [-a, 0],
  ];
  const squareC: Pt[] = [
    [b, 0],
    [0, a],
    [a, a + b],
    [a + b, b],
  ];
  const label = `Right triangle with legs ${a} and ${b}${level >= 1 ? " and hypotenuse c" : ""}${
    level >= 2 ? ", with squares on the legs" : ""
  }${level >= 3 ? " and on the hypotenuse" : ""}.`;

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${width * s + 40} ${height * s + 40}`}
        role="img"
        aria-label={label}
        className="mx-auto h-auto w-full max-w-sm"
      >
        {level >= 3 && (
          <>
            <polygon points={poly(squareC)} className="fill-v3/15 stroke-v3" strokeWidth={1.5} />
            <text x={px((a + b) / 2)} y={py((a + b) / 2)} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-v3">
              c² = {cSquared}
            </text>
          </>
        )}
        {level >= 2 && (
          <>
            <polygon points={poly(squareA)} className="fill-v1/15 stroke-v1" strokeWidth={1.5} />
            <text x={px(-a / 2)} y={py(a / 2)} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-v1">
              a² = {a * a}
            </text>
            <polygon points={poly(squareB)} className="fill-v2/15 stroke-v2" strokeWidth={1.5} />
            <text x={px(b / 2)} y={py(-b / 2)} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-v2">
              b² = {b * b}
            </text>
          </>
        )}
        <polygon points={poly(triangle)} className="fill-surface-2 stroke-ink" strokeWidth={2} strokeLinejoin="round" />
        <rect x={px(0)} y={py(0) - 10} width={10} height={10} className="fill-none stroke-ink" strokeWidth={1.2} />
        <text x={px(b / 2)} y={py(0) + 14} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-ink">
          {b}
        </text>
        <text x={px(0) - 6} y={py(a / 2)} textAnchor="end" fontSize={11} fontWeight={600} className="fill-ink">
          {a}
        </text>
        {level >= 1 && (
          <>
            <line x1={px(b)} y1={py(0)} x2={px(0)} y2={py(a)} className="stroke-v3" strokeWidth={3.5} strokeLinecap="round" />
            <text x={px(b / 2) + 10} y={py(a / 2) - 6} fontSize={14} fontWeight={700} fontStyle="italic" className="fill-v3">
              c
            </text>
          </>
        )}
      </svg>
      {level >= 3 && <figcaption className="mt-1 text-center text-sm text-muted">{cValueText(a, b)}</figcaption>}
    </figure>
  );
}
