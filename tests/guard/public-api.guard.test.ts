import { describe, expect, it } from "vitest";
import { onRequestGet as getLocalePage } from "../../functions/api/public/[locale]/pages/[slug]";
import { onRequestGet as getPublicSite } from "../../functions/api/public/[locale]/site";

async function readJson(response: Response): Promise<any> {
  return JSON.parse(await response.text());
}

function makeMockD1(config: { pages?: any[]; siteSettings?: any; page?: any }) {
  return {
    prepare(sql: string) {
      const query = sql.toLowerCase();

      return {
        bind(..._args: unknown[]) {
          if (query.includes("order by p.sort_order")) {
            return {
              first: async () => null,
              all: async () => ({ results: config.pages ?? [] }),
              run: async () => ({ success: true })
            };
          }

          if (query.includes("site_settings")) {
            return {
              first: async () => config.siteSettings ?? null,
              all: async () => ({ results: [] }),
              run: async () => ({ success: true })
            };
          }

          if (query.includes("join page_locales") && query.includes("p.slug")) {
            return {
              first: async () => config.page ?? null,
              all: async () => ({ results: [] }),
              run: async () => ({ success: true })
            };
          }

          return {
            first: async () => null,
            all: async () => ({ results: [] }),
            run: async () => ({ success: true })
          };
        },
        first: async () => config.siteSettings ?? null,
        all: async () => ({ results: config.pages ?? [] }),
        run: async () => ({ success: true })
      };
    }
  };
}

const mockSiteSettings = {
  id: "site-default",
  default_locale: "zh-CN",
  locales_json: '["zh-CN","en"]',
  cta_urls_json: '{"zh-CN":"https://grix.dhf.pub","en":"https://grix.dhf.pub"}',
  seo_defaults_json: '{}'
};

describe("guard/public-api", () => {
  it("returns 404 for unsupported locale", async () => {
    const response = await getPublicSite({
      params: { locale: "fr" },
      env: { DB: makeMockD1({}) },
      request: new Request("http://localhost/api/public/fr/site")
    });

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "Unsupported locale." });
  });

  it("returns cache headers for valid locale", async () => {
    const response = await getPublicSite({
      params: { locale: "en" },
      env: { DB: makeMockD1({ pages: [], siteSettings: mockSiteSettings }) },
      request: new Request("http://localhost/api/public/en/site")
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age=60");

    const payload = await readJson(response);
    expect(payload.locale).toBe("en");
    expect(Array.isArray(payload.pages)).toBe(true);
  });

  it("returns 404 for draft page slug (no D1 data)", async () => {
    const response = await getLocalePage({
      params: { locale: "zh-CN", slug: "use-cases" },
      env: { DB: makeMockD1({ page: null }) },
      request: new Request("http://localhost/api/public/zh-CN/pages/use-cases")
    });

    expect(response.status).toBe(404);
  });

  it("returns 404 for any slug without D1 data", async () => {
    const response = await getLocalePage({
      params: { locale: "en", slug: "security" },
      env: { DB: makeMockD1({ page: null }) },
      request: new Request("http://localhost/api/public/en/pages/security")
    });

    expect(response.status).toBe(404);
  });
});
