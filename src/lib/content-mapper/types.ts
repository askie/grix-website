import type { LocaleCode } from "@/i18n/config";

export type PageStatus = "draft" | "published" | "archived";

export type SectionType =
  | "hero"
  | "problem"
  | "solution"
  | "features"
  | "use_cases"
  | "how_it_works"
  | "proof"
  | "faq"
  | "cta"
  | "rich_text"
  | "media";

export interface PageSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  items?: string[];
}

export interface PageLocaleContent {
  locale: LocaleCode;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  sections: PageSection[];
  ctaPrimaryText: string;
  ctaSecondaryText: string;
}

export interface LocalizedPage {
  slug: string;
  template: "home" | "landing" | "article" | "legal" | "custom";
  status: PageStatus;
  locales: Record<LocaleCode, PageLocaleContent>;
}
