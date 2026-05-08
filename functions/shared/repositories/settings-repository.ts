import { getD1 } from "../db/client";

export interface SiteSettingsFull {
  id: string;
  default_locale: string;
  locales_json: string;
  cta_urls_json: string;
  seo_defaults_json: string;
}

export async function getSettings(env: Record<string, unknown>): Promise<SiteSettingsFull | null> {
  const db = getD1(env);
  return db
    .prepare(`SELECT id, default_locale, locales_json, cta_urls_json, seo_defaults_json FROM site_settings LIMIT 1`)
    .first<SiteSettingsFull>();
}

export async function updateSettings(
  env: Record<string, unknown>,
  data: {
    defaultLocale?: string;
    localesJson?: string;
    ctaUrlsJson?: string;
    seoDefaultsJson?: string;
  }
): Promise<void> {
  const db = getD1(env);
  const now = new Date().toISOString();

  const sets: string[] = ["updated_at = ?"];
  const values: unknown[] = [now];

  if (data.defaultLocale !== undefined) { sets.push("default_locale = ?"); values.push(data.defaultLocale); }
  if (data.localesJson !== undefined) { sets.push("locales_json = ?"); values.push(data.localesJson); }
  if (data.ctaUrlsJson !== undefined) { sets.push("cta_urls_json = ?"); values.push(data.ctaUrlsJson); }
  if (data.seoDefaultsJson !== undefined) { sets.push("seo_defaults_json = ?"); values.push(data.seoDefaultsJson); }

  await db
    .prepare(`UPDATE site_settings SET ${sets.join(", ")}`)
    .bind(...values)
    .run();
}
