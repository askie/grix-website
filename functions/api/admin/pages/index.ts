import { guardAdmin } from "../../../shared/auth/admin-guard";
import { jsonResponse, forbidden } from "../../../shared/http/json";
import { listAllPagesForAdmin, createPage, upsertPageLocale } from "../../../shared/repositories/pages-repository";
import { writeAuditLog } from "../../../shared/services/audit-service";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const items = await listAllPagesForAdmin(context.env);
  return jsonResponse({ items });
}

export async function onRequestPost(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const body = await context.request.json();
  const { slug, template, locale, title, summary, seoTitle, seoDescription } = body;

  if (!slug || !template || !title) {
    return forbidden("slug, template, and title are required.");
  }

  const pageId = crypto.randomUUID();
  const localeId = crypto.randomUUID();
  const safeLocale = locale || "zh-CN";

  await createPage(context.env, {
    id: pageId,
    slug,
    template,
    status: "draft",
    sortOrder: 0
  });

  await upsertPageLocale(context.env, {
    id: localeId,
    pageId,
    locale: safeLocale,
    title,
    summary,
    seoTitle,
    seoDescription,
    status: "draft"
  });

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "create_page",
    targetType: "page",
    targetId: pageId,
    payload: { slug, template, locale: safeLocale }
  });

  return jsonResponse({ id: pageId, slug, status: "draft" }, { status: 201 });
}
