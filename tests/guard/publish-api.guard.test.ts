import { describe, expect, it } from "vitest";
import { onRequestPost as publishPage } from "../../functions/api/admin/pages/[id]/publish";

async function readJson(response: Response): Promise<any> {
  return JSON.parse(await response.text());
}

function makeMockD1(config: { page?: any; revisionMax?: number | null }) {
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
              all: async () => ({ results: [] }),
              run: async () => ({ meta: { changes: 1 } })
            };
          }
          if (query.includes("max(revision_no)")) {
            return {
              first: async () => ({ max_rev: config.revisionMax ?? null }),
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

describe("guard/publish-api", () => {
  it("returns 403 when Access token is missing", async () => {
    const response = await publishPage({
      params: { id: "home" },
      env: {},
      request: new Request("http://localhost/api/admin/pages/home/publish", {
        method: "POST"
      })
    });

    expect(response.status).toBe(403);
    expect(await readJson(response)).toEqual({ error: "Missing Access token." });
  });

  it("returns 404 when locale is unsupported", async () => {
    const response = await publishPage({
      params: { id: "home" },
      env: {},
      request: new Request("http://localhost/api/admin/pages/home/publish", {
        method: "POST",
        headers: {
          "Cf-Access-Jwt-Assertion": "token",
          "x-locale": "fr"
        }
      })
    });

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "Unsupported locale." });
  });

  it("returns 404 when page does not exist", async () => {
    const response = await publishPage({
      params: { id: "nonexistent" },
      env: { DB: makeMockD1({ page: null }) },
      request: new Request("http://localhost/api/admin/pages/nonexistent/publish", {
        method: "POST",
        headers: {
          "Cf-Access-Jwt-Assertion": "token",
          "x-locale": "en"
        }
      })
    });

    expect(response.status).toBe(404);
  });

  it("returns published result for valid request", async () => {
    const response = await publishPage({
      params: { id: "home" },
      env: { DB: makeMockD1({ page: { id: "home", status: "draft" }, revisionMax: 0 }) },
      request: new Request("http://localhost/api/admin/pages/home/publish", {
        method: "POST",
        headers: {
          "Cf-Access-Jwt-Assertion": "token",
          "x-locale": "en"
        }
      })
    });

    expect(response.status).toBe(200);

    const payload = await readJson(response);
    expect(payload.pageId).toBe("home");
    expect(payload.locale).toBe("en");
    expect(payload.revisionNo).toBe(1);
    expect(typeof payload.publishedAt).toBe("string");
  });
});
