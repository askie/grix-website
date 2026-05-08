import { describe, expect, it } from "vitest";
import { getPublishedPageBySlug } from "@/lib/content-mapper/repository";

describe("guard/content-repository", () => {
  it("returns published homepage for zh-CN", () => {
    const page = getPublishedPageBySlug("zh-CN", "");

    expect(page).not.toBeNull();
    expect(page?.locale).toBe("zh-CN");
    expect(page?.seoTitle).toContain("Grix");
  });

  it("normalizes slug before lookup", () => {
    const page = getPublishedPageBySlug("en", "///");

    expect(page).not.toBeNull();
    expect(page?.locale).toBe("en");
  });

  it("does not expose draft page to public renderer", () => {
    const page = getPublishedPageBySlug("zh-CN", "use-cases");

    expect(page).toBeNull();
  });

  it("returns null for unknown slug", () => {
    const page = getPublishedPageBySlug("zh-CN", "unknown-page");

    expect(page).toBeNull();
  });
});
