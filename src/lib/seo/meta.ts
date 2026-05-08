import { locales, type LocaleCode } from "@/i18n/config";
import { toLocalizedPath } from "@/i18n/routes";

export interface SeoAlternates {
  locale: LocaleCode;
  href: string;
}

export function buildAlternates(slug: string): SeoAlternates[] {
  return locales.map((current) => ({
    locale: current,
    href: toLocalizedPath(current, slug)
  }));

}
