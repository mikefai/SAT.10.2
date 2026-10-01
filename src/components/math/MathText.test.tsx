import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { eq, V } from "./MathText";

const kids = (el: ReactElement) => (el.props as { children: ReactNode[] }).children;

describe("eq", () => {
  it("wraps single letters in V and keeps everything else as text", () => {
    const parts = kids(eq("3x + 6"));
    expect(parts[0]).toBe("3");
    expect(isValidElement(parts[1]) && parts[1].type === V).toBe(true);
    expect(parts[2]).toBe(" + 6");
  });
  it("leaves numbers, symbols and π alone", () => {
    expect(kids(eq("10% of π")).filter((p) => isValidElement(p))).toHaveLength(2); // o, f
    expect(kids(eq("25%")).some((p) => isValidElement(p))).toBe(false);
  });
});
