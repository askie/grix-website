export const defaultLocale = "zh-CN" as const;

export const locales = [defaultLocale, "en"] as const;

export type LocaleCode = (typeof locales)[number];

export const localeLabels: Record<LocaleCode, string> = {
  "zh-CN": "中文",
  en: "English"
};

export function isSupportedLocale(value: string): value is LocaleCode {
  return locales.includes(value as LocaleCode);
}
