import type { APIRoute } from "astro";
import { resolveSiteOrigin } from "@/lib/widget/config";

export const GET: APIRoute = (context) => {
  // Self-reference the active deploy domain (grix.im / 9rix.com).
  let envPool: string | null = null;
  try {
    envPool = (context.locals as any)?.runtime?.env?.CF_POOL ?? import.meta.env.CF_POOL ?? null;
  } catch {
    envPool = null;
  }
  const domain = resolveSiteOrigin({ envPool, hostname: context.url?.hostname });

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Host: ${domain}
Sitemap: ${domain}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
