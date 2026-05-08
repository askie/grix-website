const supported = new Set(["zh-CN", "en"]);

export function assertLocale(locale: string): boolean {
  return supported.has(locale);
}
