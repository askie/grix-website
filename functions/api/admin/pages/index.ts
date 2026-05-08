import { requireAdmin } from "../../../shared/auth/require-admin";
import { jsonResponse } from "../../../shared/http/json";
import { listPublishedPages } from "../../../shared/repositories/pages-repository";

export async function onRequestGet(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  const items = await listPublishedPages(context.env, "zh-CN");
  return jsonResponse({ items });
}

export async function onRequestPost(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ created: true }, { status: 201 });
}
