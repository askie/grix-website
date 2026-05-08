import { requireAdmin } from "../../../../shared/auth/require-admin";
import { jsonResponse, notFound } from "../../../../shared/http/json";
import { archivePage } from "../../../../shared/services/publish-service";

export async function onRequestPost(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  const actorEmail = context.request.headers.get("x-actor-email") ?? "unknown";

  try {
    const result = await archivePage(context.env, context.params.id, actorEmail);
    return jsonResponse(result);
  } catch (err: any) {
    if (err.message === "Page not found.") {
      return notFound(err.message);
    }
    return jsonResponse({ error: err.message }, { status: 400 });
  }
}
