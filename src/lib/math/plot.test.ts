import { describe, expect, it } from "vitest";
import { functionPath, linePath, lineSegment, ticks, toSvgX, toSvgY, type Viewport } from "./plot";

const vp: Viewport = { xMin: -8, xMax: 8, yMin: -8, yMax: 8, width: 320, height: 320 };

describe("plot", () => {
  it("maps world corners to SVG corners", () => {
    expect([toSvgX(vp, -8), toSvgX(vp, 8), toSvgY(vp, 8), toSvgY(vp, -8)]).toEqual([0, 320, 0, 320]);
  });
  it("draws a parabola with no NaN/Infinity", () => {
    const d = functionPath((x) => 3 * x * x, vp);
    expect(d.startsWith("M")).toBe(true);
    expect(d).not.toMatch(/NaN|Infinity/);
  });
  it("returns an empty path for non-finite or far-away functions", () => {
    expect(functionPath(() => NaN, vp)).toBe("");
    expect(functionPath(() => 1000, vp)).toBe("");
  });
  it("breaks the pen at an asymptote", () => {
    expect((functionPath((x) => 1 / x, vp).match(/M/g) ?? []).length).toBeGreaterThanOrEqual(2);
  });
  it("clips straight lines to the viewport", () => {
    expect(lineSegment(4, 6, vp)).toEqual([
      [-3.5, -8],
      [0.5, 8],
    ]); // steep
    expect(lineSegment(0, 3, vp)).toEqual([
      [-8, 3],
      [8, 3],
    ]); // flat, inside
    expect(lineSegment(0, 20, vp)).toBeNull(); // flat, outside
    expect(linePath(0, 20, vp)).toBe("");
  });
  it("builds tick lists", () => {
    expect(ticks(-8, 8, 2)).toEqual([-8, -6, -4, -2, 0, 2, 4, 6, 8]);
    expect(ticks(-2, 8, 1)).toHaveLength(11);
  });
});
