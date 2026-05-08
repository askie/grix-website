import { defaultLocale, isSupportedLocale, type LocaleCode } from "@/i18n/config";

export function resolveLocale(rawLocale?: string): LocaleCode {
  if (rawLocale && isSupportedLocale(rawLocale)) {
    return rawLocale;
  }

  return defaultLocale;
}
