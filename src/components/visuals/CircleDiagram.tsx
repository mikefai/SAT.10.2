import { formatNumber } from "@/lib/math/numbers";
import type { Level } from "./levels";

export function CircleDiagram({ diameter, level }: { diameter: number; level: Level }) {
  const r = diameter / 2;
  const area = Math.PI * r * r;
  const label = `Circle with diameter ${diameter}${level >= 1 ? `, radius ${formatNumber(r)}` : ""}${
    level >= 2 ? `, and a square of side ${formatNumber(r)}` : ""
  }${level >= 3 ? `. Area is ${formatNumber(r * r)} pi, about ${formatNumber(area, 1)}` : ""}.`;
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label={label} className="mx-auto h-auto w-full max-w-sm">
      <circle cx={160} cy={100} r={80} strokeWidth={2.5} className={`stroke-axis ${level >= 3 ? "fill-v1/15" : "fill-none"}`} />
      {level >= 2 && (
        <>
          <rect x={160} y={20} width={80} height={80} strokeDasharray="5 4" strokeWidth={1.8} className="fill-v2/15 stroke-v2" />
          <text x={200} y={64} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-v2">
            r² = {formatNumber(r * r)}
          </text>
        </>
      )}
      <line x1={80} y1={100} x2={240} y2={100} strokeWidth={level >= 1 ? 1.5 : 3} className={level >= 1 ? "stroke-axis" : "stroke-v1"} />
      {level >= 1 && <line x1={160} y1={100} x2={240} y2={100} strokeWidth={4} strokeLinecap="round" className="stroke-v1" />}
      <circle cx={160} cy={100} r={3.5} className="fill-ink" />
      <text x={120} y={118} textAnchor="middle" fontSize={11} fontWeight={600} className="fill-ink">
        d = {diameter}
      </text>
      {level >= 1 && (
        <text x={200} y={118} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-v1">
          r = {formatNumber(r)}
        </text>
      )}
      {level >= 3 && (
        <text x={160} y={207} textAnchor="middle" fontSize={14} fontWeight={700} className="fill-ink">
          A = {formatNumber(r * r)}π ≈ {formatNumber(area, 1)}
        </text>
      )}
    </svg>
  );
}
