import { describe, expect, it } from "vitest";
import { routeModule2 } from "./routing";

describe("routeModule2", () => {
  it("routes to the harder module at or above the threshold", () => {
    expect(routeModule2(13, 22)).toBe("harder");
    expect(routeModule2(22, 22)).toBe("harder");
  });
  it("routes to the easier module below the threshold", () => {
    expect(routeModule2(12, 22)).toBe("easier");
    expect(routeModule2(0, 22)).toBe("easier");
  });
  it("never throws on a zero-question module", () => {
    expect(routeModule2(0, 0)).toBe("easier");
  });
});
