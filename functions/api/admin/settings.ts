import { guardAdmin } from "../../shared/auth/admin-guard";
import { jsonResponse } from "../../shared/http/json";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  return jsonResponse({ defaultLocale: "zh-CN", locales: ["zh-CN", "en"] });
}

export async function onRequestPut(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  return jsonResponse({ updated: true });
}
