import type { LocaleCode } from "@/i18n/config";
import type { SectionType } from "@/lib/content-mapper/types";
import { getProductUrl } from "@/lib/content-mapper/repository";

interface D1Prepared {
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

interface D1DatabaseLike {
  prepare(sql: string): D1Prepared & {
    bind(...args: unknown[]): D1Prepared;
  };
}

export interface ServerPageData {
  slug: string;
  template: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  sections: Array<{
    id: string;
    type: SectionType;
    title: string;
    content: string;
    items?: string[];
  }>;
}

let cachedEnv: CloudflareEnv | null = null;

async function getD1(): Promise<D1DatabaseLike | null> {
  try {
    if (!cachedEnv) {
      const mod = await import("cloudflare:workers");
      cachedEnv = mod.env;
    }
    const db = cachedEnv.DB;
    if (db && typeof db === "object" && "prepare" in (db as object)) {
      return db as unknown as D1DatabaseLike;
    }
    return null;
  } catch {
    return null;
  }
}

export { getProductUrl };

export async function loadServerPublishedPage(
  locale: LocaleCode,
  slug: string
): Promise<ServerPageData | null> {
  const db = await getD1();
  if (!db) return null;

  const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, "") || "";

  const pageRow = await db
    .prepare(
      `SELECT p.id, p.slug, p.template
       FROM pages p
       JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = ?
       WHERE p.slug = ? AND p.status != 'archived' AND pl.status = 'published'`
    )
    .bind(locale, normalizedSlug)
    .first();

  if (!pageRow) return null;

  const pageId = pageRow.id as string;
  const pageTemplate = pageRow.template as string;

  const localeRow = await db
    .prepare(
      `SELECT id, title, summary, seo_title, seo_description
       FROM page_locales
       WHERE page_id = ? AND locale = ? AND status = 'published'`
    )
    .bind(pageId, locale)
    .first();

  if (!localeRow) return null;

  const pageLocaleId = localeRow.id as string;

  const { results: sectionRows } = await db
    .prepare(
      `SELECT id, section_type, sort_order, data_json
       FROM page_sections
       WHERE page_locale_id = ?
       ORDER BY sort_order ASC`
    )
    .bind(pageLocaleId)
    .all();

  const sections = sectionRows.map((row) => {
    const data = typeof row.data_json === "string" ? JSON.parse(row.data_json) : {};
    return {
      id: row.id as string,
      type: row.section_type as SectionType,
      title: (data.title ?? "") as string,
      content: (data.content ?? "") as string,
      items: data.items as string[] | undefined
    };
  });

  const defaultCta =
    locale === "zh-CN"
      ? { primary: "立即注册", secondary: "登录使用" }
      : { primary: "Get started", secondary: "Sign in" };

  return {
    slug: normalizedSlug,
    template: pageTemplate,
    title: (localeRow.title ?? "") as string,
    description: (localeRow.summary ?? "") as string,
    seoTitle: (localeRow.seo_title ?? localeRow.title ?? "") as string,
    seoDescription: (localeRow.seo_description ?? localeRow.summary ?? "") as string,
    ctaPrimaryText: defaultCta.primary,
    ctaSecondaryText: defaultCta.secondary,
    sections
  };
}

export async function loadServerSiteSettings(): Promise<{
  locales: string[];
  defaultLocale: string;
  ctaUrls: Record<string, string>;
} | null> {
  const db = await getD1();
  if (!db) return null;

  const row = await db
    .prepare(
      `SELECT default_locale, locales_json, cta_urls_json FROM site_settings LIMIT 1`
    )
    .first();

  if (!row) return null;

  return {
    defaultLocale: row.default_locale as string,
    locales: JSON.parse(row.locales_json as string),
    ctaUrls: JSON.parse(row.cta_urls_json as string)
  };
}
