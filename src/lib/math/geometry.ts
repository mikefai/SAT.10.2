import { isPerfectSquare } from "./numbers";

export function hypotenuse(a: number, b: number): { cSquared: number; c: number; exact: boolean } {
  const cSquared = a * a + b * b;
  return { cSquared, c: Math.sqrt(cSquared), exact: isPerfectSquare(cSquared) };
}

// Slope sliders move in steps of 0.5, so a run of 2 always gives an integer rise.
export function slopeRiseRun(m: number): { rise: number; run: number } {
  const run = Number.isInteger(m) ? 1 : 2;
  return { rise: m * run + 0, run };
}
