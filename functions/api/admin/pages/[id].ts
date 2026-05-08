import { guardAdmin } from "../../../shared/auth/admin-guard";
import { jsonResponse, notFound } from "../../../shared/http/json";
import { getPageByIdForAdmin, updatePage, upsertPageLocale, replaceSections } from "../../../shared/repositories/pages-repository";
import { writeAuditLog } from "../../../shared/services/audit-service";

export async function onRequestGet(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const page = await getPageByIdForAdmin(context.env, context.params.id);
  if (!page) {
    return notFound("Page not found.");
  }

  return jsonResponse(page);
}

export async function onRequestPut(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const pageId = context.params.id;
  const existing = await getPageByIdForAdmin(context.env, pageId);
  if (!existing) {
    return notFound("Page not found.");
  }

  const body = await context.request.json();
  const { slug, template, status, sortOrder, locales: localeUpdates } = body;

  if (slug || template || status || sortOrder !== undefined) {
    await updatePage(context.env, pageId, { slug, template, status, sortOrder });
  }

  if (Array.isArray(localeUpdates)) {
    for (const loc of localeUpdates) {
      const existingLocale = existing.locales.find((l) => l.locale === loc.locale);

      await upsertPageLocale(context.env, {
        id: existingLocale?.id ?? crypto.randomUUID(),
        pageId,
        locale: loc.locale,
        title: loc.title,
        summary: loc.summary,
        seoTitle: loc.seoTitle,
        seoDescription: loc.seoDescription,
        status: loc.status ?? existingLocale?.status ?? "draft"
      });

      if (Array.isArray(loc.sections) && (existingLocale || loc.status !== "draft")) {
        const targetLocale = existing.locales.find((l) => l.locale === loc.locale);
        if (targetLocale) {
          await replaceSections(
            context.env,
            targetLocale.id,
            loc.sections.map((s: any, i: number) => ({
              id: s.id ?? crypto.randomUUID(),
              sectionType: s.type,
              sortOrder: s.sortOrder ?? i,
              dataJson: JSON.stringify({ title: s.title, content: s.content, items: s.items })
            }))
          );
        }
      }
    }
  }

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "update_page",
    targetType: "page",
    targetId: pageId,
    payload: { slug, template, updatedLocales: localeUpdates?.map((l: any) => l.locale) }
  });

  const updated = await getPageByIdForAdmin(context.env, pageId);
  return jsonResponse(updated);
}

export async function onRequestDelete(context: any): Promise<Response> {
  const auth = await guardAdmin(context.request, context.env);
  if (auth instanceof Response) return auth;

  const pageId = context.params.id;
  const existing = await getPageByIdForAdmin(context.env, pageId);
  if (!existing) {
    return notFound("Page not found.");
  }

  await updatePage(context.env, pageId, { status: "archived" });

  await writeAuditLog(context.env, {
    actorEmail: auth.email,
    action: "archive_page",
    targetType: "page",
    targetId: pageId
  });

  return jsonResponse({ id: pageId, status: "archived" });
}
