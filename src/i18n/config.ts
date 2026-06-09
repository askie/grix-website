export const defaultLocale = "en" as const;

export const locales = [defaultLocale, "zh-CN"] as const;

export type LocaleCode = (typeof locales)[number];

export const localeLabels: Record<LocaleCode, string> = {
  en: "English",
  "zh-CN": "中文"
};

export function isSupportedLocale(value: string): value is LocaleCode {
  return locales.includes(value as LocaleCode);
}
