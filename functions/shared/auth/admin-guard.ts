import { authenticateAdmin } from "./require-admin";
import { writeAuthRejection } from "../services/audit-service";

export async function guardAdmin(
  request: Request,
  env: Record<string, unknown>
): Promise<{ authorized: true; email: string } | Response> {
  const result = authenticateAdmin(request);

  if (!result.authorized) {
    try {
      await writeAuthRejection(env, result.reason, request);
    } catch {
      // audit write failure should not block the rejection
    }
    return result.response;
  }

  return { authorized: true, email: result.email };
}
