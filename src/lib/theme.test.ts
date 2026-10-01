import { describe, expect, it } from "vitest";
import { resolveTheme, THEME_KEY, themeInitScript } from "./theme";

describe("resolveTheme", () => {
  it("uses an explicit stored choice", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });
  it("falls back to the OS preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });
  it("ignores garbage", () => {
    expect(resolveTheme("purple", false)).toBe("light");
  });
  it("init script reads the same storage key", () => {
    expect(themeInitScript).toContain(JSON.stringify(THEME_KEY));
  });
});
