import { describe, expect, it } from "vitest";
import { isSupportedLocale } from "@/i18n/config";
import { toLocalizedPath } from "@/i18n/routes";

describe("guard/i18n", () => {
  it("keeps default locale root path without prefix", () => {
    expect(toLocalizedPath("en", "")).toBe("/");
    expect(toLocalizedPath("en", "use-cases")).toBe("/use-cases");
  });

  it("prefixes non-default locale path", () => {
    expect(toLocalizedPath("zh-CN", "")).toBe("/zh-CN/");
    expect(toLocalizedPath("zh-CN", "use-cases")).toBe("/zh-CN/use-cases");
  });

  it("accepts only configured locales", () => {
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("zh-CN")).toBe(true);
    expect(isSupportedLocale("fr")).toBe(false);
    expect(isSupportedLocale("")).toBe(false);
  });
});
