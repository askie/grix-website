import { guardAdmin } from "../../../../shared/auth/admin-guard";
import { jsonResponse, notFound } from "../../../../shared/http/json";
import { archivePage } from "../../../../shared/services/publish-service";

export async function onRequestPost(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  try {
    const result = await archivePage(context.env, context.params.id, auth.email);
    return jsonResponse(result);
  } catch (err: any) {
    if (err.message === "Page not found.") {
      return notFound(err.message);
    }
    return jsonResponse({ error: err.message }, { status: 400 });
  }
}
