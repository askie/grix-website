import { enHome } from "@/content/defaults/en";
import { zhCNHome } from "@/content/defaults/zh-CN";
import type { LocaleCode } from "@/i18n/config";
import type { LocalizedPage, PageLocaleContent } from "@/lib/content-mapper/types";

const productUrl = "https://grix.dhf.pub";

const pages: LocalizedPage[] = [
  {
    slug: "",
    template: "home",
    status: "published",
    locales: {
      "zh-CN": zhCNHome,
      en: enHome
    }
  },
  {
    slug: "use-cases",
    template: "landing",
    status: "draft",
    locales: {
      "zh-CN": {
        locale: "zh-CN",
        title: "使用场景",
        description: "Grix 的典型企业协作场景",
        seoTitle: "Grix 使用场景",
        seoDescription: "企业如何用 Grix 组织人类与 Agent 协作。",
        ctaPrimaryText: "立即注册",
        ctaSecondaryText: "登录使用",
        sections: [
          {
            id: "rich-1",
            type: "rich_text",
            title: "场景建设中",
            content: "此页面为草稿示例，公开站点不会返回。"
          }
        ]
      },
      en: {
        locale: "en",
        title: "Use Cases",
        description: "Enterprise collaboration scenarios for Grix",
        seoTitle: "Grix Use Cases",
        seoDescription: "How teams use Grix for human-agent collaboration.",
        ctaPrimaryText: "Get started",
        ctaSecondaryText: "Sign in",
        sections: [
          {
            id: "rich-1",
            type: "rich_text",
            title: "Draft content",
            content: "This page is intentionally draft and should not be public."
          }
        ]
      }
    }
  }
];

export function getProductUrl(): string {
  return productUrl;
}

export function getPublishedPageBySlug(locale: LocaleCode, slug: string): PageLocaleContent | null {
  const normalized = slug.trim().replace(/^\/+|\/+$/g, "");
  const page = pages.find((item) => item.slug === normalized);

  if (!page || page.status === "archived") {
    return null;
  }

  const localized = page.locales[locale];
  if (!localized) {
    return null;
  }

  if (page.status !== "published") {
    return null;
  }

  return localized;
}

export function listAdminPages(): LocalizedPage[] {
  return pages;
}
