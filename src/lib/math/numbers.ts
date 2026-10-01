export const MINUS = "−";

export function formatNumber(n: number, maxDecimals = 2): string {
  const factor = 10 ** maxDecimals;
  const rounded = Math.round(n * factor) / factor;
  if (rounded === 0) return "0";
  const text = String(Math.abs(rounded));
  return rounded < 0 ? `${MINUS}${text}` : text;
}

export function range(min: number, max: number, step: number): number[] {
  const count = Math.round((max - min) / step) + 1;
  return Array.from({ length: count }, (_, i) => Number((min + i * step).toFixed(6)));
}

export function isPerfectSquare(n: number): boolean {
  if (!Number.isInteger(n) || n < 0) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

export function simplifySqrt(n: number): { outside: number; inside: number } {
  let outside = 1;
  let inside = n;
  for (let f = 2; f * f <= inside; f++) {
    while (inside % (f * f) === 0) {
      inside /= f * f;
      outside *= f;
    }
  }
  return { outside, inside };
}
