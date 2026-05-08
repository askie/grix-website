import { jsonResponse, notFound } from "../../../../shared/http/json";
import { assertLocale } from "../../../../shared/validators/locale";

export async function onRequestGet(context: any): Promise<Response> {
  const locale = context.params.locale as string;
  const slug = context.params.slug as string;

  if (!assertLocale(locale)) {
    return notFound("Unsupported locale.");
  }

  if (slug === "use-cases") {
    return notFound("This locale page has not been published.");
  }

  return jsonResponse({
    locale,
    slug,
    status: "published"
  });
}
