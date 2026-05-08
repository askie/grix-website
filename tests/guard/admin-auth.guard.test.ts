import { describe, expect, it } from "vitest";
import { onRequestGet as getAdminPages, onRequestPost as createAdminPage } from "../../functions/api/admin/pages/index";
import { requireAdmin, extractActorEmail } from "../../functions/shared/auth/require-admin";

async function readJson(response: Response): Promise<any> {
  return JSON.parse(await response.text());
}

function makeMockD1(config: { pages?: any[]; locales?: any[] }) {
  return {
    prepare(sql: string) {
      const query = sql.toLowerCase();
      return {
        bind(..._args: unknown[]) {
          if (query.includes("from pages") && query.includes("order by")) {
            return {
              first: async () => null,
              all: async () => ({ results: config.pages ?? [] }),
              run: async () => ({ meta: { changes: 1 } })
            };
          }
          if (query.includes("from page_locales") && !query.includes("where")) {
            return {
              first: async () => null,
              all: async () => ({ results: config.locales ?? [] }),
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

describe("guard/admin-auth", () => {
  it("rejects request when Access header is missing", async () => {
    const response = requireAdmin(new Request("http://localhost/api/admin/pages"));

    expect(response).not.toBeNull();
    expect(response?.status).toBe(403);
    expect(await readJson(response as Response)).toEqual({ error: "Missing Access token." });
  });

  it("passes request when Access header exists", () => {
    const response = requireAdmin(
      new Request("http://localhost/api/admin/pages", {
        headers: {
          "Cf-Access-Jwt-Assertion": "token"
        }
      })
    );

    expect(response).toBeNull();
  });

  it("extracts actor email from x-actor-email header", () => {
    const email = extractActorEmail(
      new Request("http://localhost", { headers: { "x-actor-email": "admin@test.com" } })
    );
    expect(email).toBe("admin@test.com");
  });

  it("admin pages API returns 403 without Access token", async () => {
    const response = await getAdminPages({
      request: new Request("http://localhost/api/admin/pages"),
      env: {}
    });

    expect(response.status).toBe(403);
  });

  it("admin pages API returns list with Access token", async () => {
    const response = await getAdminPages({
      request: new Request("http://localhost/api/admin/pages", {
        headers: { "Cf-Access-Jwt-Assertion": "token" }
      }),
      env: { DB: makeMockD1({ pages: [], locales: [] }) }
    });

    expect(response.status).toBe(200);
    const payload = await readJson(response);
    expect(payload.items).toEqual([]);
  });

  it("admin create page returns 403 without Access token", async () => {
    const response = await createAdminPage({
      request: new Request("http://localhost/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: "test", template: "landing", title: "Test" })
      }),
      env: {}
    });

    expect(response.status).toBe(403);
  });
});
