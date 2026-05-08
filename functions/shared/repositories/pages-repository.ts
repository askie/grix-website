import { getD1 } from "../db/client";

export interface PageRow {
  id: string;
  slug: string;
  template: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
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
  updated_at: string;
}

export interface PageSectionRow {
  id: string;
  page_locale_id: string;
  section_type: string;
  sort_order: number;
  data_json: string;
  updated_at: string;
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

export interface AdminPageListItem {
  id: string;
  slug: string;
  template: string;
  status: string;
  sort_order: number;
  locales: Array<{
    locale: string;
    title: string;
    status: string;
  }>;
}

export interface AdminPageDetail {
  page: PageRow;
  locales: PageLocaleRow[];
  sections: Record<string, PageSectionRow[]>;
}

// ── Public read queries ──

export async function getPublishedPageBySlug(
  env: Record<string, unknown>,
  locale: string,
  slug: string
): Promise<PublishedPageData | null> {
  const db = getD1(env);

  const normalizedSlug = slug.trim().replace(/^\/+|\/+$/g, "") || "";

  const page = await db
    .prepare(
      `SELECT p.id, p.slug, p.template, p.status, p.sort_order, p.created_at, p.updated_at
       FROM pages p
       JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = ?
       WHERE p.slug = ? AND p.status != 'archived' AND pl.status = 'published'`
    )
    .bind(locale, normalizedSlug)
    .first<PageRow>();

  if (!page) return null;

  const pageLocale = await db
    .prepare(
      `SELECT id, page_id, locale, title, summary, seo_title, seo_description, status, published_at, updated_at
       FROM page_locales
       WHERE page_id = ? AND locale = ? AND status = 'published'`
    )
    .bind(page.id, locale)
    .first<PageLocaleRow>();

  if (!pageLocale) return null;

  const { results: sections } = await db
    .prepare(
      `SELECT id, page_locale_id, section_type, sort_order, data_json, updated_at
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

// ── Admin CRUD queries ──

export async function listAllPagesForAdmin(
  env: Record<string, unknown>
): Promise<AdminPageListItem[]> {
  const db = getD1(env);

  const { results: pages } = await db
    .prepare(
      `SELECT id, slug, template, status, sort_order, created_at, updated_at
       FROM pages
       ORDER BY sort_order ASC`
    )
    .all<PageRow>();

  const { results: locales } = await db
    .prepare(
      `SELECT id, page_id, locale, title, status
       FROM page_locales`
    )
    .all<{ id: string; page_id: string; locale: string; title: string; status: string }>();

  const localeMap = new Map<string, AdminPageListItem["locales"]>();
  for (const loc of locales) {
    if (!localeMap.has(loc.page_id)) {
      localeMap.set(loc.page_id, []);
    }
    localeMap.get(loc.page_id)!.push({ locale: loc.locale, title: loc.title, status: loc.status });
  }

  return pages.map((p) => ({
    id: p.id,
    slug: p.slug,
    template: p.template,
    status: p.status,
    sort_order: p.sort_order,
    locales: localeMap.get(p.id) ?? []
  }));
}

export async function getPageByIdForAdmin(
  env: Record<string, unknown>,
  pageId: string
): Promise<AdminPageDetail | null> {
  const db = getD1(env);

  const page = await db
    .prepare(
      `SELECT id, slug, template, status, sort_order, created_at, updated_at
       FROM pages WHERE id = ?`
    )
    .bind(pageId)
    .first<PageRow>();

  if (!page) return null;

  const { results: locales } = await db
    .prepare(
      `SELECT id, page_id, locale, title, summary, seo_title, seo_description, status, published_at, updated_at
       FROM page_locales WHERE page_id = ?`
    )
    .bind(pageId)
    .all<PageLocaleRow>();

  const { results: sections } = await db
    .prepare(
      `SELECT id, page_locale_id, section_type, sort_order, data_json, updated_at
       FROM page_sections WHERE page_locale_id IN (${locales.map(() => "?").join(",")})
       ORDER BY sort_order ASC`
    )
    .bind(...locales.map((l) => l.id))
    .all<PageSectionRow>();

  const sectionMap: Record<string, PageSectionRow[]> = {};
  for (const s of sections) {
    if (!sectionMap[s.page_locale_id]) {
      sectionMap[s.page_locale_id] = [];
    }
    sectionMap[s.page_locale_id].push(s);
  }

  return { page, locales, sections: sectionMap };
}

export async function createPage(
  env: Record<string, unknown>,
  data: {
    id: string;
    slug: string;
    template: string;
    status: string;
    sortOrder: number;
  }
): Promise<string> {
  const db = getD1(env);
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO pages (id, slug, template, status, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(data.id, data.slug, data.template, data.status, data.sortOrder, now, now)
    .run();

  return data.id;
}

export async function updatePage(
  env: Record<string, unknown>,
  pageId: string,
  data: {
    slug?: string;
    template?: string;
    status?: string;
    sortOrder?: number;
  }
): Promise<boolean> {
  const db = getD1(env);
  const now = new Date().toISOString();

  const sets: string[] = ["updated_at = ?"];
  const values: unknown[] = [now];

  if (data.slug !== undefined) {
    sets.push("slug = ?");
    values.push(data.slug);
  }
  if (data.template !== undefined) {
    sets.push("template = ?");
    values.push(data.template);
  }
  if (data.status !== undefined) {
    sets.push("status = ?");
    values.push(data.status);
  }
  if (data.sortOrder !== undefined) {
    sets.push("sort_order = ?");
    values.push(data.sortOrder);
  }

  values.push(pageId);

  const result = await db
    .prepare(`UPDATE pages SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return (result as { meta?: { changes?: number } }).meta?.changes !== 0;
}

export async function upsertPageLocale(
  env: Record<string, unknown>,
  data: {
    id: string;
    pageId: string;
    locale: string;
    title: string;
    summary?: string;
    seoTitle?: string;
    seoDescription?: string;
    status: string;
  }
): Promise<void> {
  const db = getD1(env);
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO page_locales (id, page_id, locale, title, summary, seo_title, seo_description, status, published_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)
       ON CONFLICT (page_id, locale) DO UPDATE SET
         title = excluded.title,
         summary = excluded.summary,
         seo_title = excluded.seo_title,
         seo_description = excluded.seo_description,
         status = excluded.status,
         updated_at = excluded.updated_at`
    )
    .bind(data.id, data.pageId, data.locale, data.title, data.summary ?? null, data.seoTitle ?? null, data.seoDescription ?? null, data.status, now)
    .run();
}

export async function updatePageLocaleStatus(
  env: Record<string, unknown>,
  pageId: string,
  locale: string,
  status: string
): Promise<void> {
  const db = getD1(env);
  const now = new Date().toISOString();
  const publishedAt = status === "published" ? now : null;

  await db
    .prepare(
      `UPDATE page_locales SET status = ?, published_at = COALESCE(?, published_at), updated_at = ? WHERE page_id = ? AND locale = ?`
    )
    .bind(status, publishedAt, now, pageId, locale)
    .run();
}

export async function replaceSections(
  env: Record<string, unknown>,
  pageLocaleId: string,
  sections: Array<{ id: string; sectionType: string; sortOrder: number; dataJson: string }>
): Promise<void> {
  const db = getD1(env);

  await db
    .prepare(`DELETE FROM page_sections WHERE page_locale_id = ?`)
    .bind(pageLocaleId)
    .run();

  for (const section of sections) {
    const now = new Date().toISOString();
    await db
      .prepare(
        `INSERT INTO page_sections (id, page_locale_id, section_type, sort_order, data_json, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .bind(section.id, pageLocaleId, section.sectionType, section.sortOrder, section.dataJson, now)
      .run();
  }
}

export async function insertPublishRevision(
  env: Record<string, unknown>,
  data: {
    id: string;
    pageId: string;
    locale: string;
    revisionNo: number;
    publishedBy: string;
  }
): Promise<void> {
  const db = getD1(env);
  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO publish_revisions (id, page_id, locale, revision_no, published_by, published_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(data.id, data.pageId, data.locale, data.revisionNo, data.publishedBy, now)
    .run();
}

export async function getNextRevisionNo(
  env: Record<string, unknown>,
  pageId: string,
  locale: string
): Promise<number> {
  const db = getD1(env);

  const row = await db
    .prepare(
      `SELECT MAX(revision_no) as max_rev FROM publish_revisions WHERE page_id = ? AND locale = ?`
    )
    .bind(pageId, locale)
    .first<{ max_rev: number | null }>();

  return (row?.max_rev ?? 0) + 1;
}
