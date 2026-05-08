import { getD1 } from "../db/client";

export interface PageRow {
  id: string;
  slug: string;
  template: string;
  status: string;
  sort_order: number;
}

export interface PageLocaleRow {
  id: string;
  page_id: string;
  locale: string;
  title: string;
  summary: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
  published_at: string | null;
}

export interface PageSectionRow {
  id: string;
  page_locale_id: string;
  section_type: string;
  sort_order: number;
  data_json: string;
}

export interface SiteSettingsRow {
  id: string;
  default_locale: string;
  locales_json: string;
  cta_urls_json: string;
  seo_defaults_json: string;
}

export interface PublishedPageData {
  page: PageRow;
  locale: PageLocaleRow;
  sections: PageSectionRow[];
}

export async function getPublishedPageBySlug(
  env: Record<string, unknown>,
  locale: string,
  slug: string
): Promise<PublishedPageData | null> {
  const db = getD1(env);

  const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, "") || "";

  const page = await db
    .prepare(
      `SELECT p.id, p.slug, p.template, p.status, p.sort_order
       FROM pages p
       JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = ?
       WHERE p.slug = ? AND p.status != 'archived' AND pl.status = 'published'`
    )
    .bind(locale, normalizedSlug)
    .first<PageRow>();

  if (!page) return null;

  const pageLocale = await db
    .prepare(
      `SELECT id, page_id, locale, title, summary, seo_title, seo_description, status, published_at
       FROM page_locales
       WHERE page_id = ? AND locale = ? AND status = 'published'`
    )
    .bind(page.id, locale)
    .first<PageLocaleRow>();

  if (!pageLocale) return null;

  const { results: sections } = await db
    .prepare(
      `SELECT id, page_locale_id, section_type, sort_order, data_json
       FROM page_sections
       WHERE page_locale_id = ?
       ORDER BY sort_order ASC`
    )
    .bind(pageLocale.id)
    .all<PageSectionRow>();

  return { page, locale: pageLocale, sections };
}

export async function listPublishedPages(
  env: Record<string, unknown>,
  locale: string
): Promise<Array<{ slug: string; template: string; title: string; summary: string | null }>> {
  const db = getD1(env);

  const { results } = await db
    .prepare(
      `SELECT p.slug, p.template, pl.title, pl.summary
       FROM pages p
       JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = ?
       WHERE p.status != 'archived' AND pl.status = 'published'
       ORDER BY p.sort_order ASC`
    )
    .bind(locale)
    .all<{ slug: string; template: string; title: string; summary: string | null }>();

  return results;
}

export async function getSiteSettings(
  env: Record<string, unknown>
): Promise<SiteSettingsRow | null> {
  const db = getD1(env);

  return db
    .prepare(
      `SELECT id, default_locale, locales_json, cta_urls_json, seo_defaults_json
       FROM site_settings
       LIMIT 1`
    )
    .first<SiteSettingsRow>();
}
