import { guardAdmin } from "../../shared/auth/admin-guard";
import { jsonResponse } from "../../shared/http/json";
import { listRedirects, insertRedirect, deleteRedirect } from "../../shared/repositories/redirects-repository";
import { writeAuditLog } from "../../shared/services/audit-service";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const items = await listRedirects(context.env);
  return jsonResponse({ items });
}

export async function onRequestPost(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const body = await context.request.json();
  const { sourcePath, targetPath, statusCode } = body;

  if (!sourcePath || !targetPath) {
    return jsonResponse({ error: "sourcePath and targetPath are required." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  await insertRedirect(context.env, { id, sourcePath, targetPath, statusCode });

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "create_redirect",
    targetType: "redirect",
    targetId: id,
    payload: { sourcePath, targetPath }
  });

  return jsonResponse({ id, sourcePath, targetPath }, { status: 201 });
}

export async function onRequestDelete(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return jsonResponse({ error: "id is required." }, { status: 400 });
  }

  const deleted = await deleteRedirect(context.env, id);
  if (!deleted) {
    return jsonResponse({ error: "Redirect not found." }, { status: 404 });
  }

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "delete_redirect",
    targetType: "redirect",
    targetId: id
  });

  return jsonResponse({ deleted: true });
}
