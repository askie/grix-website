import type { APIRoute } from "astro";

const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

Host: https://grix.pub
Sitemap: https://grix.pub/sitemap.xml
`;

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
