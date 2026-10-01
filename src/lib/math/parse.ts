const DASHES = /[−‒–—]/g;

export function parseNumericAnswer(raw: string): number | null {
  let s = raw.trim().toLowerCase().replace(DASHES, "-").replace(/\s+/g, "");
  s = s.replace(/(π|pi)$/, "");
  if (/^[+-]?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g, "");
  const fraction = /^([+-]?)(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s);
  if (fraction) {
    const denominator = Number(fraction[3]);
    if (denominator === 0) return null;
    const magnitude = Number(fraction[2]) / denominator;
    return fraction[1] === "-" ? -magnitude : magnitude;
  }
  return /^[+-]?(\d+\.?\d*|\.\d+)$/.test(s) ? Number(s) : null;
}

export const answersMatch = (value: number, expected: number): boolean => Math.abs(value - expected) < 1e-9;
