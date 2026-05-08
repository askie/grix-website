import { describe, expect, it } from "vitest";
import { onRequestGet as getAdminPages } from "../../functions/api/admin/pages/index";
import { requireAdmin } from "../../functions/shared/auth/require-admin";

async function readJson(response: Response): Promise<any> {
  return JSON.parse(await response.text());
}

function makeMockD1(results: any[] = []) {
  return {
    prepare() {
      return {
        bind() {
          return {
            first: async () => null,
            all: async () => ({ results }),
            run: async () => ({ success: true })
          };
        }
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
        headers: {
          "Cf-Access-Jwt-Assertion": "token"
        }
      }),
      env: { DB: makeMockD1([]) }
    });

    expect(response.status).toBe(200);
    const payload = await readJson(response);
    expect(payload.items).toEqual([]);
  });
});
