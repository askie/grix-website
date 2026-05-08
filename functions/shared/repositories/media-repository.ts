import { getD1 } from "../db/client";

export interface AssetRow {
  id: string;
  r2_key: string;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  created_at: string;
}

export async function listAssets(
  env: Record<string, unknown>,
  limit = 50,
  offset = 0
): Promise<AssetRow[]> {
  const db = getD1(env);
  const { results } = await db
    .prepare(`SELECT id, r2_key, mime_type, width, height, alt_text, created_at FROM assets ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .bind(limit, offset)
    .all<AssetRow>();
  return results;
}

export async function getAssetById(
  env: Record<string, unknown>,
  id: string
): Promise<AssetRow | null> {
  const db = getD1(env);
  return db
    .prepare(`SELECT id, r2_key, mime_type, width, height, alt_text, created_at FROM assets WHERE id = ?`)
    .bind(id)
    .first<AssetRow>();
}

export async function insertAsset(
  env: Record<string, unknown>,
  data: {
    id: string;
    r2Key: string;
    mimeType: string;
    width?: number;
    height?: number;
    altText?: string;
  }
): Promise<void> {
  const db = getD1(env);
  const now = new Date().toISOString();
  await db
    .prepare(`INSERT INTO assets (id, r2_key, mime_type, width, height, alt_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(data.id, data.r2Key, data.mimeType, data.width ?? null, data.height ?? null, data.altText ?? null, now)
    .run();
}

export async function deleteAsset(
  env: Record<string, unknown>,
  id: string
): Promise<AssetRow | null> {
  const db = getD1(env);
  const asset = await getAssetById(env, id);
  if (!asset) return null;

  await db.prepare(`DELETE FROM assets WHERE id = ?`).bind(id).run();
  return asset;
}
