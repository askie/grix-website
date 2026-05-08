import { forbidden } from "../http/json";

const ACCESS_HEADER = "Cf-Access-Jwt-Assertion";

export function requireAdmin(request: Request): Response | null {
  const token = request.headers.get(ACCESS_HEADER);

  if (!token) {
    return forbidden("Missing Access token.");
  }

  return null;
}

export function extractActorEmail(request: Request): string {
  const email = request.headers.get("x-actor-email");
  if (email) return email;

  // Phase C will decode JWT claims here
  return "admin@unknown";
}
