import { describe, expect, it } from "vitest";
import { onRequestGet as getPage, onRequestDelete as deletePage } from "../../functions/api/admin/pages/[id]";
import { onRequestPost as archivePage } from "../../functions/api/admin/pages/[id]/archive";

async function readJson(response: Response): Promise<any> {
  return JSON.parse(await response.text());
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeJwt(payload: Record<string, unknown>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode("fake-signature");
  return `${header}.${body}.${signature}`;
}

const validToken = makeJwt({
  iss: "https://test-team.cloudflareaccess.com",
  aud: "cloudflare-web-admin",
  exp: Math.floor(Date.now() / 1000) + 3600,
  email: "admin@test.com",
  sub: "user-123"
});

function makeFullMockD1(config: {
  page?: any;
  locales?: any[];
  sections?: any[];
}) {
  return {
    prepare(sql: string) {
      const query = sql.toLowerCase();
      return {
        bind(..._args: unknown[]) {
          if (query.includes("from pages where id =")) {
            return {
              first: async () => config.page ?? null,
              all: async () => ({ results: [] }),
              run: async () => ({ meta: { changes: 1 } })
            };
          }
          if (query.includes("from page_locales where page_id =")) {
            return {
              first: async () => null,
              all: async () => ({ results: config.locales ?? [] }),
              run: async () => ({ meta: { changes: 1 } })
            };
          }
          if (query.includes("from page_sections where page_locale_id in")) {
            return {
              first: async () => null,
              all: async () => ({ results: config.sections ?? [] }),
              run: async () => ({ meta: { changes: 1 } })
            };
          }
          if (query.includes("max(revision_no)")) {
            return {
              first: async () => ({ max_rev: null }),
              all: async () => ({ results: [] }),
              run: async () => ({ meta: { changes: 1 } })
            };
          }
          return {
            first: async () => null,
            all: async () => ({ results: [] }),
            run: async () => ({ meta: { changes: 1 } })
          };
        },
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ meta: { changes: 1 } })
      };
    }
  };
}

const adminHeaders = {
  "Cf-Access-Jwt-Assertion": validToken
};

const samplePage = {
  id: "page-1",
  slug: "home",
  template: "home",
  status: "draft",
  sort_order: 0,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z"
};

const sampleLocale = {
  id: "loc-1",
  page_id: "page-1",
  locale: "zh-CN",
  title: "首页",
  summary: "Test",
  seo_title: "SEO",
  seo_description: "Desc",
  status: "draft",
  published_at: null,
  updated_at: "2026-01-01T00:00:00Z"
};

describe("guard/admin-crud", () => {
  it("GET returns 404 for nonexistent page", async () => {
    const response = await getPage({
      params: { id: "nonexistent" },
      env: { DB: makeFullMockD1({ page: null }) },
      request: new Request("http://localhost/api/admin/pages/nonexistent", { headers: adminHeaders })
    });

    expect(response.status).toBe(404);
  });

  it("GET returns page detail with locales", async () => {
    const response = await getPage({
      params: { id: "page-1" },
      env: { DB: makeFullMockD1({ page: samplePage, locales: [sampleLocale], sections: [] }) },
      request: new Request("http://localhost/api/admin/pages/page-1", { headers: adminHeaders })
    });

    expect(response.status).toBe(200);
    const payload = await readJson(response);
    expect(payload.page.id).toBe("page-1");
    expect(payload.locales).toHaveLength(1);
    expect(payload.locales[0].locale).toBe("zh-CN");
  });

  it("DELETE returns 404 for nonexistent page", async () => {
    const response = await deletePage({
      params: { id: "nonexistent" },
      env: { DB: makeFullMockD1({ page: null }) },
      request: new Request("http://localhost/api/admin/pages/nonexistent", {
        method: "DELETE",
        headers: adminHeaders
      })
    });

    expect(response.status).toBe(404);
  });

  it("DELETE archives existing page", async () => {
    const response = await deletePage({
      params: { id: "page-1" },
      env: { DB: makeFullMockD1({ page: samplePage, locales: [] }) },
      request: new Request("http://localhost/api/admin/pages/page-1", {
        method: "DELETE",
        headers: adminHeaders
      })
    });

    expect(response.status).toBe(200);
    const payload = await readJson(response);
    expect(payload.status).toBe("archived");
  });

  it("archive endpoint returns 403 without auth", async () => {
    const response = await archivePage({
      params: { id: "page-1" },
      env: { DB: makeFullMockD1({ page: samplePage }) },
      request: new Request("http://localhost/api/admin/pages/page-1/archive", {
        method: "POST"
      })
    });

    expect(response.status).toBe(403);
  });

  it("archive endpoint archives page with auth", async () => {
    const response = await archivePage({
      params: { id: "page-1" },
      env: { DB: makeFullMockD1({ page: samplePage }) },
      request: new Request("http://localhost/api/admin/pages/page-1/archive", {
        method: "POST",
        headers: adminHeaders
      })
    });

    expect(response.status).toBe(200);
    const payload = await readJson(response);
    expect(payload.pageId).toBe("page-1");
    expect(payload.status).toBe("archived");
  });
});
