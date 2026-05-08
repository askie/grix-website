import { listPages } from "../repositories/pages-repository";

export async function loadPublicSite(env: Record<string, unknown>, locale: string) {
  const pages = await listPages(env);

  return {
    locale,
    pages,
    generatedAt: new Date().toISOString()
  };
}
