export interface Viewport {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  width: number;
  height: number;
}

export const toSvgX = (vp: Viewport, x: number) => ((x - vp.xMin) / (vp.xMax - vp.xMin)) * vp.width;
export const toSvgY = (vp: Viewport, y: number) => ((vp.yMax - y) / (vp.yMax - vp.yMin)) * vp.height;
const r2 = (n: number) => Math.round(n * 100) / 100;

// Points may overshoot the view by one span so the clipPath trims curves cleanly; beyond that the pen lifts.
export function functionPath(fn: (x: number) => number, vp: Viewport, samples = 240): string {
  const span = vp.yMax - vp.yMin;
  let d = "";
  let penDown = false;
  for (let i = 0; i <= samples; i++) {
    const x = vp.xMin + ((vp.xMax - vp.xMin) * i) / samples;
    const y = fn(x);
    if (!Number.isFinite(y) || y < vp.yMin - span || y > vp.yMax + span) {
      penDown = false;
      continue;
    }
    d += `${penDown ? "L" : "M"}${r2(toSvgX(vp, x))} ${r2(toSvgY(vp, y))}`;
    penDown = true;
  }
  return d;
}

export function lineSegment(m: number, b: number, vp: Viewport): [[number, number], [number, number]] | null {
  let lo = vp.xMin;
  let hi = vp.xMax;
  if (m === 0) {
    if (b < vp.yMin || b > vp.yMax) return null;
  } else {
    const xa = (vp.yMin - b) / m;
    const xb = (vp.yMax - b) / m;
    lo = Math.max(lo, Math.min(xa, xb));
    hi = Math.min(hi, Math.max(xa, xb));
    if (lo > hi) return null;
  }
  return [
    [lo, m * lo + b],
    [hi, m * hi + b],
  ];
}

export function linePath(m: number, b: number, vp: Viewport): string {
  const seg = lineSegment(m, b, vp);
  if (!seg) return "";
  const [[x1, y1], [x2, y2]] = seg;
  return `M${r2(toSvgX(vp, x1))} ${r2(toSvgY(vp, y1))}L${r2(toSvgX(vp, x2))} ${r2(toSvgY(vp, y2))}`;
}

export function ticks(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max + 1e-9; t += step) out.push(Number(t.toFixed(6)) + 0);
  return out;
}
