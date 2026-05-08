import { describe, expect, it } from "vitest";
import { onRequestPost as publishPage } from "../../functions/api/admin/pages/[id]/publish";

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

const validJwtPayload = {
  iss: "https://test-team.cloudflareaccess.com",
  aud: "cloudflare-web-admin",
  exp: Math.floor(Date.now() / 1000) + 3600,
  email: "admin@test.com",
  sub: "user-123"
};

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
  const validToken = makeJwt(validJwtPayload);

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
      env: { DB: makeMockD1({}) },
      request: new Request("http://localhost/api/admin/pages/home/publish", {
        method: "POST",
        headers: {
          "Cf-Access-Jwt-Assertion": validToken,
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
          "Cf-Access-Jwt-Assertion": validToken,
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
          "Cf-Access-Jwt-Assertion": validToken,
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
