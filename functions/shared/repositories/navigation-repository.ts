import { getD1 } from "../db/client";

export interface NavigationItemRow {
  id: string;
  locale: string;
  zone: string;
  label: string;
  href: string;
  sort_order: number;
  updated_at: string;
}

export async function listNavigationItems(
  env: Record<string, unknown>,
  locale?: string,
  zone?: string
): Promise<NavigationItemRow[]> {
  const db = getD1(env);

  if (locale && zone) {
    const { results } = await db
      .prepare(`SELECT id, locale, zone, label, href, sort_order, updated_at FROM navigation_items WHERE locale = ? AND zone = ? ORDER BY sort_order ASC`)
      .bind(locale, zone)
      .all<NavigationItemRow>();
    return results;
  }

  if (locale) {
    const { results } = await db
      .prepare(`SELECT id, locale, zone, label, href, sort_order, updated_at FROM navigation_items WHERE locale = ? ORDER BY zone ASC, sort_order ASC`)
      .bind(locale)
      .all<NavigationItemRow>();
    return results;
  }

  const { results } = await db
    .prepare(`SELECT id, locale, zone, label, href, sort_order, updated_at FROM navigation_items ORDER BY locale ASC, zone ASC, sort_order ASC`)
    .all<NavigationItemRow>();
  return results;
}

export async function replaceNavigationItems(
  env: Record<string, unknown>,
  locale: string,
  zone: string,
  items: Array<{ id: string; label: string; href: string; sortOrder: number }>
): Promise<void> {
  const db = getD1(env);
  const now = new Date().toISOString();

  await db
    .prepare(`DELETE FROM navigation_items WHERE locale = ? AND zone = ?`)
    .bind(locale, zone)
    .run();

  for (const item of items) {
    await db
      .prepare(`INSERT INTO navigation_items (id, locale, zone, label, href, sort_order, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .bind(item.id, locale, zone, item.label, item.href, item.sortOrder, now)
      .run();
  }
}
