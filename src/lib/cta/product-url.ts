import { getProductUrl } from "@/lib/content-mapper/repository";

export function resolveProductEntryUrl(): string {
  return getProductUrl();
}
