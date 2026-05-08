import { jsonResponse, notFound } from "../../../shared/http/json";
import { loadPublicSite } from "../../../shared/services/public-content-service";
import { assertLocale } from "../../../shared/validators/locale";

export async function onRequestGet(context: any): Promise<Response> {
  const locale = context.params.locale as string;

  if (!assertLocale(locale)) {
    return notFound("Unsupported locale.");
  }

  const payload = await loadPublicSite(context.env, locale);
  return jsonResponse(payload, {
    headers: {
      "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=120"
    }
  });
}
