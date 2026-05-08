export async function publishPage(_env: Record<string, unknown>, pageId: string, locale: string) {
  return {
    pageId,
    locale,
    status: "published",
    publishedAt: new Date().toISOString()
  };
}
