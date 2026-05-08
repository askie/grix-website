import { jsonResponse, notFound } from "../../../../shared/http/json";
import { loadPublishedPage } from "../../../../shared/services/public-content-service";
import { assertLocale } from "../../../../shared/validators/locale";

export async function onRequestGet(context: any): Promise<Response> {
  const locale = context.params.locale as string;
  const slug = context.params.slug as string;

  if (!assertLocale(locale)) {
    return notFound("Unsupported locale.");
  }

  const page = await loadPublishedPage(context.env, locale, slug);
  if (!page) {
    return notFound("This page has not been published or does not exist.");
  }

  return jsonResponse(page, {
    headers: {
      "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=120"
    }
  });
}
