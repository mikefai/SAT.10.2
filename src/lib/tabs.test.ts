import { expect, it } from "vitest";
import { parseTab } from "./tabs";

it("parses known hashes and falls back to home", () => {
  expect(parseTab("#decoder")).toBe("decoder");
  expect(parseTab("twins")).toBe("twins");
  expect(parseTab("")).toBe("home");
  expect(parseTab("#nope")).toBe("home");
  expect(parseTab("#ANCHORS")).toBe("home");
});
