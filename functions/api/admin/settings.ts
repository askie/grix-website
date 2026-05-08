import { guardAdmin } from "../../shared/auth/admin-guard";
import { jsonResponse } from "../../shared/http/json";
import { getSettings, updateSettings } from "../../shared/repositories/settings-repository";
import { writeAuditLog } from "../../shared/services/audit-service";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const settings = await getSettings(context.env);
  if (!settings) {
    return jsonResponse({ error: "Site settings not configured." }, { status: 404 });
  }

  return jsonResponse(settings);
}

export async function onRequestPut(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const body = await context.request.json();
  const { defaultLocale, localesJson, ctaUrlsJson, seoDefaultsJson } = body;

  await updateSettings(context.env, {
    defaultLocale,
    localesJson: typeof localesJson === "object" ? JSON.stringify(localesJson) : localesJson,
    ctaUrlsJson: typeof ctaUrlsJson === "object" ? JSON.stringify(ctaUrlsJson) : ctaUrlsJson,
    seoDefaultsJson: typeof seoDefaultsJson === "object" ? JSON.stringify(seoDefaultsJson) : seoDefaultsJson
  });

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "update_settings",
    targetType: "site_settings",
    targetId: "site-default"
  });

  const updated = await getSettings(context.env);
  return jsonResponse(updated);
}
