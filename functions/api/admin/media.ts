import { guardAdmin } from "../../shared/auth/admin-guard";
import { jsonResponse } from "../../shared/http/json";
import { listAssets, getAssetById, insertAsset, deleteAsset } from "../../shared/repositories/media-repository";
import { writeAuditLog } from "../../shared/services/audit-service";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const asset = await getAssetById(context.env, id);
    if (!asset) return jsonResponse({ error: "Asset not found." }, { status: 404 });
    return jsonResponse(asset);
  }

  const assets = await listAssets(context.env);
  return jsonResponse({ assets });
}

export async function onRequestPost(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const formData = await context.request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return jsonResponse({ error: "file is required." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const ext = file.name.split(".").pop() ?? "bin";
  const r2Key = `uploads/${id}.${ext}`;

  const R2 = (context.env as Record<string, unknown>).BUCKET;
  if (R2 && typeof R2 === "object" && "put" in (R2 as object)) {
    const buffer = await file.arrayBuffer();
    await (R2 as any).put(r2Key, buffer, { httpMetadata: { contentType: file.type } });
  }

  await insertAsset(context.env, {
    id,
    r2Key,
    mimeType: file.type,
    altText: (formData.get("alt_text") as string) ?? null
  });

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "upload_asset",
    targetType: "asset",
    targetId: id,
    payload: { r2Key, mimeType: file.type }
  });

  return jsonResponse({ id, r2Key, mimeType: file.type }, { status: 201 });
}

export async function onRequestDelete(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return jsonResponse({ error: "id is required." }, { status: 400 });
  }

  const asset = await deleteAsset(context.env, id);
  if (!asset) {
    return jsonResponse({ error: "Asset not found." }, { status: 404 });
  }

  const R2 = (context.env as Record<string, unknown>).BUCKET;
  if (R2 && typeof R2 === "object" && "delete" in (R2 as object)) {
    await (R2 as any).delete(asset.r2_key);
  }

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "delete_asset",
    targetType: "asset",
    targetId: id
  });

  return jsonResponse({ deleted: true });
}
