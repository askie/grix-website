import { defaultLocale, type LocaleCode } from "@/i18n/config";

export function toLocalizedPath(locale: LocaleCode, slug = ""): string {
  const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, "");

  if (locale === defaultLocale) {
    return normalizedSlug ? `/${normalizedSlug}` : "/";
  }

  return normalizedSlug ? `/${locale}/${normalizedSlug}` : `/${locale}/`;
}
