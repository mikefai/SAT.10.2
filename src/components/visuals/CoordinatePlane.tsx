import { useId, type ReactNode } from "react";
import { ticks, toSvgX, toSvgY, type Viewport } from "@/lib/math/plot";

export interface PlotApi {
  vp: Viewport;
  sx: (x: number) => number;
  sy: (y: number) => number;
  clip: string;
}

const WIDTH = 320;

export function CoordinatePlane({
  x,
  y,
  title,
  tickStep,
  children,
}: {
  x: [number, number];
  y: [number, number];
  title: string;
  tickStep?: number;
  children: (plot: PlotApi) => ReactNode;
}) {
  const clip = `clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const height = Math.round((WIDTH * (y[1] - y[0])) / (x[1] - x[0]));
  const vp: Viewport = { xMin: x[0], xMax: x[1], yMin: y[0], yMax: y[1], width: WIDTH, height };
  const sx = (v: number) => toSvgX(vp, v);
  const sy = (v: number) => toSvgY(vp, v);
  const step = tickStep ?? (Math.max(x[1] - x[0], y[1] - y[0]) <= 12 ? 1 : 2);
  const hasXAxis = y[0] <= 0 && y[1] >= 0;
  const hasYAxis = x[0] <= 0 && x[1] >= 0;
  const labelY = Math.min(height - 2, (hasXAxis ? sy(0) : height) + 11);
  const labelX = Math.max(12, hasYAxis ? sx(0) - 3 : 12);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={title} className="mx-auto h-auto w-full max-w-sm">
      <defs>
        <clipPath id={clip}>
          <rect x={0} y={0} width={WIDTH} height={height} />
        </clipPath>
      </defs>
      <rect x={0} y={0} width={WIDTH} height={height} className="fill-surface" />
      {ticks(x[0], x[1], 1).map((t) => (
        <line key={`gx${t}`} x1={sx(t)} y1={0} x2={sx(t)} y2={height} className="stroke-grid" strokeWidth={0.6} />
      ))}
      {ticks(y[0], y[1], 1).map((t) => (
        <line key={`gy${t}`} x1={0} y1={sy(t)} x2={WIDTH} y2={sy(t)} className="stroke-grid" strokeWidth={0.6} />
      ))}
      {hasYAxis && <line x1={sx(0)} y1={0} x2={sx(0)} y2={height} className="stroke-axis" strokeWidth={1.2} />}
      {hasXAxis && <line x1={0} y1={sy(0)} x2={WIDTH} y2={sy(0)} className="stroke-axis" strokeWidth={1.2} />}
      <g aria-hidden="true" className="fill-muted" fontSize={9}>
        {ticks(x[0], x[1], step)
          .filter((t) => t !== 0)
          .map((t) => (
            <text key={`tx${t}`} x={sx(t)} y={labelY} textAnchor="middle">
              {t}
            </text>
          ))}
        {ticks(y[0], y[1], step)
          .filter((t) => t !== 0)
          .map((t) => (
            <text key={`ty${t}`} x={labelX} y={sy(t) + 3} textAnchor="end">
              {t}
            </text>
          ))}
      </g>
      <g aria-hidden="true">{children({ vp, sx, sy, clip })}</g>
    </svg>
  );
}
