import type { LocalizedPage } from "@/lib/content-mapper/types";

export function resolveTemplate(page: LocalizedPage["template"]): LocalizedPage["template"] {
  return page;
}
