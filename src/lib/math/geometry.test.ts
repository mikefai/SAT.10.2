import { describe, expect, it } from "vitest";
import { hypotenuse, slopeRiseRun } from "./geometry";

it("hypotenuse marks exact triples", () => {
  expect(hypotenuse(3, 4)).toEqual({ cSquared: 25, c: 5, exact: true });
  expect(hypotenuse(6, 8)).toEqual({ cSquared: 100, c: 10, exact: true });
  expect(hypotenuse(2, 3)).toMatchObject({ cSquared: 13, exact: false });
});

describe("slopeRiseRun", () => {
  it.each([
    [2, 2, 1],
    [0.5, 1, 2],
    [-1.5, -3, 2],
    [0, 0, 1],
  ])("m=%s → rise %s over run %s", (m, rise, run) => expect(slopeRiseRun(m)).toEqual({ rise, run }));
});
