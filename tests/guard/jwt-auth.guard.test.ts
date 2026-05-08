import { describe, expect, it } from "vitest";
import { validateAccessJwt, authenticateAdmin } from "../../functions/shared/auth/require-admin";

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function makeJwt(payload: Record<string, unknown>): string {
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const signature = base64UrlEncode("fake-signature");
  return `${header}.${body}.${signature}`;
}

const validPayload = {
  iss: "https://test-team.cloudflareaccess.com",
  aud: "cloudflare-web-admin",
  exp: Math.floor(Date.now() / 1000) + 3600,
  email: "admin@test.com",
  sub: "user-123"
};

const AUD = "cloudflare-web-admin";
const ISS = "https://test-team.cloudflareaccess.com";

describe("guard/jwt-auth", () => {
  it("rejects missing token", () => {
    const result = authenticateAdmin(
      new Request("http://localhost/api/admin/pages"),
      AUD
    );
    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.response.status).toBe(403);
      expect(result.reason).toBe("missing_token");
    }
  });

  it("rejects invalid JWT format (not 3 parts)", () => {
    const result = authenticateAdmin(
      new Request("http://localhost/api/admin/pages", {
        headers: { "Cf-Access-Jwt-Assertion": "not-a-jwt" }
      }),
      AUD
    );
    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.response.status).toBe(403);
      expect(result.reason).toContain("Invalid JWT");
    }
  });

  it("rejects expired JWT", () => {
    const token = makeJwt({
      ...validPayload,
      exp: Math.floor(Date.now() / 1000) - 3600
    });

    const result = validateAccessJwt(token, AUD, ISS);
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toContain("expired");
    }
  });

  it("rejects wrong issuer", () => {
    const token = makeJwt({
      ...validPayload,
      iss: "https://wrong-team.cloudflareaccess.com"
    });

    const result = validateAccessJwt(token, AUD, ISS);
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toContain("issuer");
    }
  });

  it("rejects wrong audience", () => {
    const token = makeJwt({
      ...validPayload,
      aud: "wrong-audience"
    });

    const result = validateAccessJwt(token, AUD, ISS);
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toContain("audience");
    }
  });

  it("accepts valid JWT with correct claims", () => {
    const token = makeJwt(validPayload);

    const result = validateAccessJwt(token, AUD, ISS);
    expect("claims" in result).toBe(true);
    if ("claims" in result) {
      expect(result.claims.email).toBe("admin@test.com");
      expect(result.claims.sub).toBe("user-123");
      expect(result.claims.iss).toBe(ISS);
      expect(result.claims.aud).toContain(AUD);
    }
  });

  it("accepts JWT without issuer check when not specified", () => {
    const token = makeJwt({
      ...validPayload,
      iss: "https://any-team.cloudflareaccess.com"
    });

    const result = validateAccessJwt(token, AUD);
    expect("claims" in result).toBe(true);
  });

  it("authenticateAdmin returns email for valid token", () => {
    const token = makeJwt(validPayload);

    const result = authenticateAdmin(
      new Request("http://localhost/api/admin/pages", {
        headers: { "Cf-Access-Jwt-Assertion": token }
      }),
      AUD,
      ISS
    );

    expect(result.authorized).toBe(true);
    if (result.authorized) {
      expect(result.email).toBe("admin@test.com");
    }
  });

  it("authenticateAdmin returns 403 for invalid token", () => {
    const token = makeJwt({
      ...validPayload,
      exp: Math.floor(Date.now() / 1000) - 100
    });

    const result = authenticateAdmin(
      new Request("http://localhost/api/admin/pages", {
        headers: { "Cf-Access-Jwt-Assertion": token }
      }),
      AUD,
      ISS
    );

    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.response.status).toBe(403);
    }
  });

  it("rejects JWT with missing identity claims", () => {
    const token = makeJwt({
      iss: ISS,
      aud: AUD,
      exp: Math.floor(Date.now() / 1000) + 3600
    });

    const result = validateAccessJwt(token, AUD, ISS);
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toContain("identity");
    }
  });
});
