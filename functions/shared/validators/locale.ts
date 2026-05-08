const supported = new Set(["zh-CN", "en"]);

export function assertLocale(locale: string): boolean {
  return supported.has(locale);
}

export function validateLocaleOrThrow(locale: string): string {
  if (!supported.has(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }
  return locale;
}
