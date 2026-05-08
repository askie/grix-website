import {
  updatePageLocaleStatus,
  insertPublishRevision,
  getNextRevisionNo,
  updatePage,
  getPageByIdForAdmin
} from "../repositories/pages-repository";
import { writeAuditLog } from "./audit-service";

export async function publishPage(
  env: Record<string, unknown>,
  pageId: string,
  locale: string,
  actorEmail: string
): Promise<{ pageId: string; locale: string; revisionNo: number; publishedAt: string }> {
  const page = await getPageByIdForAdmin(env, pageId);
  if (!page) {
    throw new Error("Page not found.");
  }

  if (page.page.status === "archived") {
    throw new Error("Cannot publish an archived page. Restore it first.");
  }

  const revisionNo = await getNextRevisionNo(env, pageId, locale);
  const now = new Date().toISOString();

  await updatePageLocaleStatus(env, pageId, locale, "published");
  await insertPublishRevision(env, {
    id: crypto.randomUUID(),
    pageId,
    locale,
    revisionNo,
    publishedBy: actorEmail
  });
  await writeAuditLog(env, {
    actorEmail,
    action: "publish",
    targetType: "page_locale",
    targetId: `${pageId}:${locale}`,
    payload: { revisionNo }
  });

  return { pageId, locale, revisionNo, publishedAt: now };
}

export async function archivePage(
  env: Record<string, unknown>,
  pageId: string,
  actorEmail: string
): Promise<{ pageId: string; status: string }> {
  const page = await getPageByIdForAdmin(env, pageId);
  if (!page) {
    throw new Error("Page not found.");
  }

  await updatePage(env, pageId, { status: "archived" });
  await writeAuditLog(env, {
    actorEmail,
    action: "archive",
    targetType: "page",
    targetId: pageId
  });

  return { pageId, status: "archived" };
}
