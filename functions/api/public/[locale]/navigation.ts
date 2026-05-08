import { jsonResponse, notFound } from "../../../shared/http/json";
import { assertLocale } from "../../../shared/validators/locale";
import { listNavigationItems } from "../../../shared/repositories/navigation-repository";

const FALLBACK_ITEMS: Record<string, Array<{ label: string; href: string }>> = {
  "zh-CN": [
    { label: "能力", href: "#features" },
    { label: "常见问题", href: "#faq" }
  ],
  "en": [
    { label: "Features", href: "#features" },
    { label: "FAQ", href: "#faq" }
  ]
};

export async function onRequestGet(context: any): Promise<Response> {
  const locale = context.params.locale as string;

  if (!assertLocale(locale)) {
    return notFound("Unsupported locale.");
  }

  try {
    const rows = await listNavigationItems(context.env, locale, "main");
    if (rows.length > 0) {
      return jsonResponse({
        locale,
        items: rows.map((r) => ({ label: r.label, href: r.href }))
      });
    }
  } catch {
    // D1 not available (local dev) — fall through to hardcoded
  }

  const items = FALLBACK_ITEMS[locale] ?? FALLBACK_ITEMS["en"];
  return jsonResponse({ locale, items });
}
