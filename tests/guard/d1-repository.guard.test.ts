import { describe, expect, it } from "vitest";
import { getPublishedPageBySlug, listPublishedPages } from "../../functions/shared/repositories/pages-repository";

function makeMockD1WithQueryRouting(config: {
  page?: any;
  locale?: any;
  sections?: any[];
  listResults?: any[];
}) {
  return {
    prepare(sql: string) {
      const query = sql.toLowerCase();

      return {
        bind(..._args: unknown[]) {
          if (query.includes("join page_locales") && query.includes("where p.slug")) {
            return {
              first: async () => config.page ?? null,
              all: async () => ({ results: [] }),
              run: async () => ({ success: true })
            };
          }

          if (query.includes("from page_locales") && query.includes("where page_id")) {
            return {
              first: async () => config.locale ?? null,
              all: async () => ({ results: [] }),
              run: async () => ({ success: true })
            };
          }

          if (query.includes("page_sections")) {
            return {
              first: async () => null,
              all: async () => ({ results: config.sections ?? [] }),
              run: async () => ({ success: true })
            };
          }

          if (query.includes("order by p.sort_order")) {
            return {
              first: async () => null,
              all: async () => ({ results: config.listResults ?? [] }),
              run: async () => ({ success: true })
            };
          }

          return {
            first: async () => null,
            all: async () => ({ results: [] }),
            run: async () => ({ success: true })
          };
        },
        first: async () => null,
        all: async () => ({ results: config.listResults ?? [] }),
        run: async () => ({ success: true })
      };
    }
  };
}

describe("guard/d1-repository", () => {
  it("returns null when page is archived", async () => {
    const db = makeMockD1WithQueryRouting({ page: null });
    const result = await getPublishedPageBySlug({ DB: db }, "zh-CN", "home");
    expect(result).toBeNull();
  });

  it("returns null when locale is not published", async () => {
    const db = makeMockD1WithQueryRouting({
      page: { id: "1", slug: "home", template: "home", status: "draft", sort_order: 0 },
      locale: null
    });
    const result = await getPublishedPageBySlug({ DB: db }, "en", "home");
    expect(result).toBeNull();
  });

  it("returns full page data when published", async () => {
    const db = makeMockD1WithQueryRouting({
      page: { id: "1", slug: "", template: "home", status: "draft", sort_order: 0 },
      locale: {
        id: "l1", page_id: "1", locale: "zh-CN", title: "Grix",
        summary: "Test", seo_title: "SEO Title", seo_description: "SEO Desc",
        status: "published", published_at: "2026-01-01"
      },
      sections: [
        {
          id: "s1", page_locale_id: "l1", section_type: "hero",
          sort_order: 0, data_json: JSON.stringify({ title: "Hello", content: "World" })
        }
      ]
    });

    const result = await getPublishedPageBySlug({ DB: db }, "zh-CN", "");
    expect(result).not.toBeNull();
    expect(result!.page.slug).toBe("");
    expect(result!.locale.title).toBe("Grix");
    expect(result!.sections).toHaveLength(1);
    expect(result!.sections[0].section_type).toBe("hero");
  });

  it("listPublishedPages returns only published pages", async () => {
    const db = makeMockD1WithQueryRouting({
      listResults: [
        { slug: "", template: "home", title: "首页", summary: "Summary" },
        { slug: "about", template: "landing", title: "关于", summary: "About" }
      ]
    });

    const results = await listPublishedPages({ DB: db }, "zh-CN");
    expect(results).toHaveLength(2);
    expect(results[0].slug).toBe("");
    expect(results[1].slug).toBe("about");
  });

  it("listPublishedPages returns empty array when no published pages", async () => {
    const db = makeMockD1WithQueryRouting({ listResults: [] });
    const results = await listPublishedPages({ DB: db }, "en");
    expect(results).toHaveLength(0);
  });
});
