export const discriminant = (a: number, b: number, c: number): number => b * b - 4 * a * c;

export type QuadraticSolution =
  | { kind: "not-quadratic" }
  | { kind: "none"; d: number }
  | { kind: "one"; d: number; roots: [number] }
  | { kind: "two"; d: number; roots: [number, number] };

export function solveQuadratic(a: number, b: number, c: number): QuadraticSolution {
  if (a === 0) return { kind: "not-quadratic" };
  const d = discriminant(a, b, c);
  if (d < 0) return { kind: "none", d };
  if (d === 0) return { kind: "one", d, roots: [-b / (2 * a) + 0] };
  const r1 = (-b - Math.sqrt(d)) / (2 * a) + 0;
  const r2 = (-b + Math.sqrt(d)) / (2 * a) + 0;
  return { kind: "two", d, roots: r1 < r2 ? [r1, r2] : [r2, r1] };
}

export function vertexOfStandard(a: number, b: number, c: number): { x: number; y: number } {
  const x = -b / (2 * a) + 0;
  return { x, y: a * x * x + b * x + c };
}
