import { guardAdmin } from "../../shared/auth/admin-guard";
import { jsonResponse } from "../../shared/http/json";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  return jsonResponse({ items: [] });
}

export async function onRequestPost(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  return jsonResponse({ created: true }, { status: 201 });
}

export async function onRequestDelete(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  return jsonResponse({ deleted: true });
}
