import { formatNumber } from "@/lib/math/numbers";
import { linePath, lineSegment } from "@/lib/math/plot";
import type { VisualSpec } from "@/content/types";
import { CoordinatePlane } from "./CoordinatePlane";
import type { Level } from "./levels";

export function LinesGraph({ spec, level }: { spec: Extract<VisualSpec, { kind: "lines" }>; level: Level }) {
  const [l1, l2] = spec.lines;
  const [px, py] = spec.point;
  const title = `Graph of ${l1.label} and ${l2.label}, crossing at (${formatNumber(px)}, ${formatNumber(py)}).`;
  return (
    <CoordinatePlane x={spec.x} y={spec.y} title={title}>
      {({ vp, sx, sy, clip }) => (
        <>
          <g clipPath={`url(#${clip})`}>
            {spec.lines.map((line, i) => (
              <path
                key={line.label}
                d={linePath(line.m, line.b, vp)}
                fill="none"
                strokeWidth={2.5}
                strokeLinecap="round"
                opacity={level === 0 ? 0.35 : 1}
                className={i === 0 ? "stroke-v1" : "stroke-v2"}
              />
            ))}
            {level >= 2 && (
              <line
                x1={sx(px)}
                y1={sy(vp.yMin)}
                x2={sx(px)}
                y2={sy(vp.yMax)}
                strokeDasharray="4 4"
                strokeWidth={1.5}
                className="stroke-trap-line"
              />
            )}
          </g>
          {level >= 1 &&
            spec.lines.map((line, i) => {
              const seg = lineSegment(line.m, line.b, vp);
              if (!seg) return null;
              const [x2, y2] = seg[1];
              const ty = Math.min(vp.height - 4, Math.max(11, sy(y2) + (i === 0 ? -7 : 14)));
              return (
                <text
                  key={`label-${line.label}`}
                  x={Math.min(vp.width - 4, sx(x2) - 4)}
                  y={ty}
                  textAnchor="end"
                  fontSize={10}
                  fontWeight={600}
                  className={i === 0 ? "fill-v1" : "fill-v2"}
                >
                  {line.label}
                </text>
              );
            })}
          {level >= 3 && (
            <>
              <circle cx={sx(px)} cy={sy(py)} r={5} className="fill-trap-line stroke-surface" strokeWidth={2} />
              <text x={sx(px) + 8} y={sy(py) - 8} fontSize={10} fontWeight={700} className="fill-ink">
                ({formatNumber(px)}, {formatNumber(py)})
              </text>
            </>
          )}
        </>
      )}
    </CoordinatePlane>
  );
}
