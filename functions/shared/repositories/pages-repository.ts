interface PageRow {
  id: string;
  slug: string;
  template: string;
  status: string;
}

export async function listPages(_env: Record<string, unknown>): Promise<PageRow[]> {
  return [];
}
