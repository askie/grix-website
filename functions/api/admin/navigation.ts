import { guardAdmin } from "../../shared/auth/admin-guard";
import { jsonResponse } from "../../shared/http/json";
import { listNavigationItems, replaceNavigationItems } from "../../shared/repositories/navigation-repository";
import { writeAuditLog } from "../../shared/services/audit-service";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const url = new URL(context.request.url);
  const locale = url.searchParams.get("locale") ?? undefined;
  const zone = url.searchParams.get("zone") ?? undefined;

  const items = await listNavigationItems(context.env, locale, zone);
  return jsonResponse({ items });
}

export async function onRequestPut(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const body = await context.request.json();
  const { locale, zone, items } = body;

  if (!locale || !zone || !Array.isArray(items)) {
    return jsonResponse({ error: "locale, zone, and items are required." }, { status: 400 });
  }

  await replaceNavigationItems(
    context.env,
    locale,
    zone,
    items.map((item: any, i: number) => ({
      id: item.id ?? crypto.randomUUID(),
      label: item.label,
      href: item.href,
      sortOrder: item.sortOrder ?? i
    }))
  );

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "update_navigation",
    targetType: "navigation",
    targetId: `${locale}:${zone}`,
    payload: { itemCount: items.length }
  });

  const updated = await listNavigationItems(context.env, locale, zone);
  return jsonResponse({ items: updated });
}
