import { isValidElement } from "react";
import { expect, it } from "vitest";

it("compiles TSX in tests", () => {
  expect(isValidElement(<span>ok</span>)).toBe(true);
});
