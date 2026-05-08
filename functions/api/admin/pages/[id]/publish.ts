import { guardAdmin } from "../../../../shared/auth/admin-guard";
import { jsonResponse, notFound } from "../../../../shared/http/json";
import { publishPage } from "../../../../shared/services/publish-service";
import { assertLocale } from "../../../../shared/validators/locale";

export async function onRequestPost(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const locale = context.request.headers.get("x-locale") ?? "zh-CN";

  if (!assertLocale(locale)) {
    return notFound("Unsupported locale.");
  }

  try {
    const result = await publishPage(context.env, context.params.id, locale, auth.email);
    return jsonResponse(result);
  } catch (err: any) {
    if (err.message === "Page not found.") {
      return notFound(err.message);
    }
    return jsonResponse({ error: err.message }, { status: 400 });
  }
}
