import { requireAdmin } from "../../../shared/auth/require-admin";
import { jsonResponse } from "../../../shared/http/json";

export async function onRequestGet(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ id: context.params.id });
}

export async function onRequestPut(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ updated: context.params.id });
}

export async function onRequestDelete(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ archived: context.params.id });
}
