import { describe, expect, it } from "vitest";
import { onRequestGet as getLocalePage } from "../../functions/api/public/[locale]/pages/[slug]";
import { onRequestGet as getPublicSite } from "../../functions/api/public/[locale]/site";

async function readJson(response: Response): Promise<any> {
  return JSON.parse(await response.text());
}

describe("guard/public-api", () => {
  it("returns 404 for unsupported locale", async () => {
    const response = await getPublicSite({
      params: { locale: "fr" },
      env: {},
      request: new Request("http://localhost/api/public/fr/site")
    });

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "Unsupported locale." });
  });

  it("returns cache headers for valid locale", async () => {
    const response = await getPublicSite({
      params: { locale: "en" },
      env: {},
      request: new Request("http://localhost/api/public/en/site")
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("max-age=60");

    const payload = await readJson(response);
    expect(payload.locale).toBe("en");
    expect(Array.isArray(payload.pages)).toBe(true);
  });

  it("returns 404 for draft page slug", async () => {
    const response = await getLocalePage({
      params: { locale: "zh-CN", slug: "use-cases" },
      env: {},
      request: new Request("http://localhost/api/public/zh-CN/pages/use-cases")
    });

    expect(response.status).toBe(404);
    expect(await readJson(response)).toEqual({ error: "This locale page has not been published." });
  });

  it("returns published payload for non-draft page slug", async () => {
    const response = await getLocalePage({
      params: { locale: "en", slug: "security" },
      env: {},
      request: new Request("http://localhost/api/public/en/pages/security")
    });

    expect(response.status).toBe(200);
    expect(await readJson(response)).toEqual({
      locale: "en",
      slug: "security",
      status: "published"
    });
  });
});
