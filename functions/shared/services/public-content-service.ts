import {
  getPublishedPageBySlug,
  listPublishedPages,
  getSiteSettings,
  type PublishedPageData,
  type SiteSettingsRow
} from "../repositories/pages-repository";

export type { PublishedPageData, SiteSettingsRow };

export async function loadPublicSite(env: Record<string, unknown>, locale: string) {
  const [settings, pages] = await Promise.all([
    getSiteSettings(env),
    listPublishedPages(env, locale)
  ]);

  return {
    locale,
    settings,
    pages,
    generatedAt: new Date().toISOString()
  };
}

export async function loadPublishedPage(
  env: Record<string, unknown>,
  locale: string,
  slug: string
): Promise<PublishedPageData | null> {
  return getPublishedPageBySlug(env, locale, slug);
}

export { getSiteSettings };
