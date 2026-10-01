import { describe, expect, it } from "vitest";
import { linearTokens, standardQuadraticTokens, tokensToText as t, vertexTokens } from "./expressions";

describe("linearTokens", () => {
  it.each([
    [2, 1, "y = 2x + 1"],
    [1, 0, "y = x"],
    [-1, -3, "y = −x − 3"],
    [0, 4, "y = 4"],
    [0, 0, "y = 0"],
    [0.5, -2, "y = 0.5x − 2"],
    [-0.5, 0, "y = −0.5x"],
  ])("m=%s b=%s → %s", (m, b, text) => expect(t(linearTokens(m, b))).toBe(text));
  it("tags slope and intercept roles for coloring", () => {
    expect(linearTokens(2, 1).filter((x) => x.role).map((x) => x.role)).toEqual(["m", "b"]);
  });
});

describe("vertexTokens", () => {
  it.each([
    [1, 2, -3, "y = (x − 2)² − 3"],
    [-1, -3, 0, "y = −(x + 3)²"],
    [2, 0, 1, "y = 2x² + 1"],
    [0, 4, 5, "y = 5"],
    [0.5, 0, 0, "y = 0.5x²"],
    [-2.5, 1, 4, "y = −2.5(x − 1)² + 4"],
  ])("a=%s h=%s k=%s → %s", (a, h, k, text) => expect(t(vertexTokens(a, h, k))).toBe(text));
});

describe("standardQuadraticTokens", () => {
  it.each([
    [1, -2, -3, "y = x² − 2x − 3"],
    [-2, 0, 5, "y = −2x² + 5"],
    [3, 1, 0, "y = 3x² + x"],
    [1, 0, 0, "y = x²"],
    [2, -1, -1, "y = 2x² − x − 1"],
  ])("a=%s b=%s c=%s → %s", (a, b, c, text) => expect(t(standardQuadraticTokens(a, b, c))).toBe(text));
});
