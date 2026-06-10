import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { defaultLocale, locales } from "@/i18n/config";
import { listServerPublishedPages } from "@/lib/server/content-loader";

const domain = "https://grix.pub";

interface SitemapUrl {
  loc: string;
  alternates: Array<{
    hreflang: string;
    href: string;
  }>;
}

export const GET: APIRoute = async () => {
  const sitemapUrls: SitemapUrl[] = [];

  // Helper to add URL with multi-language alternates
  const addUrl = (pathWithoutLocale: string) => {
    const cleanPath = pathWithoutLocale.trim().replace(/^\/+|\/+$/g, "");

    locales.forEach((locale) => {
      const isDefault = locale === defaultLocale;
      const currentLoc = isDefault
        ? `${domain}/${cleanPath}`.replace(/\/$/, "")
        : `${domain}/${locale}/${cleanPath}`.replace(/\/$/, "");

      const alternates: Array<{ hreflang: string; href: string }> = locales.map((altLocale) => {
        const isAltDefault = altLocale === defaultLocale;
        const href = isAltDefault
          ? `${domain}/${cleanPath}`.replace(/\/$/, "")
          : `${domain}/${altLocale}/${cleanPath}`.replace(/\/$/, "");
        return {
          hreflang: altLocale as string,
          href,
        };
      });

      // Also add default x-default alternate pointing to defaultLocale
      const xDefaultHref = `${domain}/${cleanPath}`.replace(/\/$/, "");
      alternates.push({
        hreflang: "x-default",
        href: xDefaultHref,
      });

      sitemapUrls.push({
        loc: currentLoc,
        alternates,
      });
    });
  };

  // 1. Home Page
  addUrl("");

  // 2. Database Pages (if any page status is published)
  const dbSlugsSet = new Set<string>();
  for (const locale of locales) {
    const pages = await listServerPublishedPages(locale);
    pages.forEach((p) => {
      if (p.slug) {
        dbSlugsSet.add(p.slug);
      }
    });
  }
  dbSlugsSet.forEach((slug) => {
    addUrl(slug);
  });

  // 3. Docs Main Page
  addUrl("docs");

  // 4. Docs Sub-pages
  try {
    const docs = await getCollection("docs");
    const docSlugsSet = new Set<string>();
    docs.forEach((doc) => {
      const docIdClean = doc.id.replace(/^(en|zh-cn|zh-CN)\//i, "");
      if (docIdClean) {
        docSlugsSet.add(docIdClean);
      }
    });

    docSlugsSet.forEach((docSlug) => {
      addUrl(`docs/${docSlug}`);
    });
  } catch {
    // Fail-safe if collection read fails
  }

  // XML Construction
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  sitemapUrls.forEach((entry) => {
    xml += `
  <url>
    <loc>${entry.loc}</loc>`;
    entry.alternates.forEach((alt) => {
      xml += `
    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}" />`;
    });
    xml += `
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
