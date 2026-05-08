import { requireAdmin } from "../../../../shared/auth/require-admin";
import { jsonResponse, notFound } from "../../../../shared/http/json";
import { publishPage } from "../../../../shared/services/publish-service";
import { assertLocale } from "../../../../shared/validators/locale";

export async function onRequestPost(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  const locale = context.request.headers.get("x-locale") ?? "zh-CN";

  if (!assertLocale(locale)) {
    return notFound("Unsupported locale.");
  }

  const actorEmail = context.request.headers.get("x-actor-email") ?? "unknown";

  try {
    const result = await publishPage(context.env, context.params.id, locale, actorEmail);
    return jsonResponse(result);
  } catch (err: any) {
    if (err.message === "Page not found.") {
      return notFound(err.message);
    }
    return jsonResponse({ error: err.message }, { status: 400 });
  }
}
