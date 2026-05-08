import { jsonResponse, notFound } from "../../../shared/http/json";
import { assertLocale } from "../../../shared/validators/locale";

export async function onRequestGet(context: any): Promise<Response> {
  const locale = context.params.locale as string;

  if (!assertLocale(locale)) {
    return notFound("Unsupported locale.");
  }

  return jsonResponse({
    locale,
    items: [
      { label: locale === "zh-CN" ? "能力" : "Features", href: "#features" },
      { label: locale === "zh-CN" ? "常见问题" : "FAQ", href: "#faq" }
    ]
  });
}
