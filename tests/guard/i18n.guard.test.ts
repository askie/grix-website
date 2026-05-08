import { describe, expect, it } from "vitest";
import { isSupportedLocale } from "@/i18n/config";
import { toLocalizedPath } from "@/i18n/routes";

describe("guard/i18n", () => {
  it("keeps default locale root path without prefix", () => {
    expect(toLocalizedPath("zh-CN", "")).toBe("/");
    expect(toLocalizedPath("zh-CN", "use-cases")).toBe("/use-cases");
  });

  it("prefixes non-default locale path", () => {
    expect(toLocalizedPath("en", "")).toBe("/en/");
    expect(toLocalizedPath("en", "use-cases")).toBe("/en/use-cases");
  });

  it("accepts only configured locales", () => {
    expect(isSupportedLocale("zh-CN")).toBe(true);
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("fr")).toBe(false);
    expect(isSupportedLocale("")).toBe(false);
  });
});
