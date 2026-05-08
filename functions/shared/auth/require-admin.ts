import { forbidden } from "../http/json";

const ACCESS_HEADER = "Cf-Access-Jwt-Assertion";

export interface JwtClaims {
  iss: string;
  aud: string[];
  exp: number;
  email: string;
  sub: string;
}

export interface AdminAuthResult {
  authorized: true;
  email: string;
  claims: JwtClaims;
}

export interface AdminAuthRejection {
  authorized: false;
  response: Response;
  reason: string;
}

export type AdminAuthOutcome = AdminAuthResult | AdminAuthRejection;

function base64UrlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = 4 - (padded.length % 4);
  const base64 = pad < 4 ? padded + "=".repeat(pad) : padded;
  return atob(base64);
}

function decodeJwtPart(part: string): Record<string, unknown> {
  try {
    return JSON.parse(base64UrlDecode(part));
  } catch {
    throw new Error("Invalid JWT encoding.");
  }
}

export function validateAccessJwt(
  token: string,
  expectedAud: string,
  expectedIss?: string
): { claims: JwtClaims } | { error: string } {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { error: "Invalid JWT format." };
  }

  let payload: Record<string, unknown>;
  try {
    payload = decodeJwtPart(parts[1]);
  } catch {
    return { error: "Invalid JWT encoding." };
  }

  const iss = payload.iss as string | undefined;
  const aud = payload.aud as string | string[] | undefined;
  const exp = payload.exp as number | undefined;
  const email = payload.email as string | undefined;
  const sub = payload.sub as string | undefined;

  if (!email || !sub) {
    return { error: "JWT missing required identity claims." };
  }

  if (expectedIss && iss !== expectedIss) {
    return { error: "JWT issuer mismatch." };
  }

  const audList = Array.isArray(aud) ? aud : aud ? [aud] : [];
  if (!audList.includes(expectedAud)) {
    return { error: "JWT audience mismatch." };
  }

  if (!exp || Date.now() / 1000 > exp) {
    return { error: "JWT expired." };
  }

  return {
    claims: {
      iss: iss ?? "",
      aud: audList,
      exp,
      email,
      sub
    }
  };
}

const DEFAULT_AUD = "cloudflare-web-admin";

export function requireAdmin(request: Request): Response | null {
  const result = authenticateAdmin(request);
  if (result.authorized) {
    return null;
  }
  return result.response;
}

export function authenticateAdmin(request: Request, expectedAud?: string, expectedIss?: string): AdminAuthOutcome {
  const token = request.headers.get(ACCESS_HEADER);

  if (!token) {
    return {
      authorized: false,
      response: forbidden("Missing Access token."),
      reason: "missing_token"
    };
  }

  const aud = expectedAud ?? DEFAULT_AUD;
  const validation = validateAccessJwt(token, aud, expectedIss);

  if ("error" in validation) {
    return {
      authorized: false,
      response: forbidden(validation.error),
      reason: validation.error
    };
  }

  return {
    authorized: true,
    email: validation.claims.email,
    claims: validation.claims
  };
}
