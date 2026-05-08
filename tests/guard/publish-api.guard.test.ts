import { describe, expect, it } from "vitest";
import { onRequestPost as publishPage } from "../../functions/api/admin/pages/[id]/publish";

async function readJson(response: Response): Promise<any> {
  return JSON.parse(await response.text());
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

  it("returns published result for valid request", async () => {
    const response = await publishPage({
      params: { id: "home" },
      env: {},
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
    expect(payload.status).toBe("published");
    expect(typeof payload.publishedAt).toBe("string");
  });
});
