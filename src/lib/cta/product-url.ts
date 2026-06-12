import { getProductUrl, getProductUrls, type ProductUrls } from "@/lib/content-mapper/repository";

export function resolveProductEntryUrl(): string {
  return getProductUrl();
}

export function resolveProductEntryUrls(): ProductUrls {
  return getProductUrls();
}
