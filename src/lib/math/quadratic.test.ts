import { describe, expect, it } from "vitest";
import { discriminant, solveQuadratic, vertexOfStandard } from "./quadratic";

describe("quadratic", () => {
  it("computes the discriminant", () => expect(discriminant(1, -2, -3)).toBe(16));
  it("finds two ascending roots", () => {
    expect(solveQuadratic(1, -2, -3)).toEqual({ kind: "two", d: 16, roots: [-1, 3] });
    expect(solveQuadratic(2, 3, -2)).toEqual({ kind: "two", d: 25, roots: [-2, 0.5] });
    expect(solveQuadratic(-1, 0, 4)).toEqual({ kind: "two", d: 16, roots: [-2, 2] });
  });
  it("handles one, none, and not-quadratic", () => {
    expect(solveQuadratic(1, -2, 1)).toEqual({ kind: "one", d: 0, roots: [1] });
    expect(solveQuadratic(1, 0, 1)).toEqual({ kind: "none", d: -4 });
    expect(solveQuadratic(0, 2, 1)).toEqual({ kind: "not-quadratic" });
  });
  it("never returns −0", () => {
    const s = solveQuadratic(1, 0, 0);
    expect(s.kind === "one" && Object.is(s.roots[0], -0)).toBe(false);
  });
  it("finds the vertex", () => expect(vertexOfStandard(1, -2, -3)).toEqual({ x: 1, y: -4 }));
});
