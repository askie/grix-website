import { requireAdmin } from "../../shared/auth/require-admin";
import { jsonResponse } from "../../shared/http/json";

export async function onRequestGet(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ items: [] });
}

export async function onRequestPost(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ created: true }, { status: 201 });
}

export async function onRequestDelete(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ deleted: true });
}
