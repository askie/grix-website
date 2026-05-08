import { getD1 } from "../db/client";

export interface RedirectRow {
  id: string;
  source_path: string;
  target_path: string;
  status_code: number;
  enabled: number;
  updated_at: string;
}

export async function listRedirects(env: Record<string, unknown>): Promise<RedirectRow[]> {
  const db = getD1(env);
  const { results } = await db
    .prepare(`SELECT id, source_path, target_path, status_code, enabled, updated_at FROM redirects ORDER BY source_path ASC`)
    .all<RedirectRow>();
  return results;
}

export async function insertRedirect(
  env: Record<string, unknown>,
  data: {
    id: string;
    sourcePath: string;
    targetPath: string;
    statusCode?: number;
  }
): Promise<void> {
  const db = getD1(env);
  const now = new Date().toISOString();
  await db
    .prepare(`INSERT INTO redirects (id, source_path, target_path, status_code, enabled, updated_at) VALUES (?, ?, ?, ?, 1, ?)`)
    .bind(data.id, data.sourcePath, data.targetPath, data.statusCode ?? 301, now)
    .run();
}

export async function deleteRedirect(
  env: Record<string, unknown>,
  id: string
): Promise<boolean> {
  const db = getD1(env);
  const result = await db
    .prepare(`DELETE FROM redirects WHERE id = ?`)
    .bind(id)
    .run();
  return (result as { meta?: { changes?: number } }).meta?.changes !== 0;
}
