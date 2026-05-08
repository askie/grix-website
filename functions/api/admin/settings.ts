import { requireAdmin } from "../../shared/auth/require-admin";
import { jsonResponse } from "../../shared/http/json";

export async function onRequestGet(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ defaultLocale: "zh-CN", locales: ["zh-CN", "en"] });
}

export async function onRequestPut(context: any): Promise<Response> {
  const guard = requireAdmin(context.request);
  if (guard) {
    return guard;
  }

  return jsonResponse({ updated: true });
}
