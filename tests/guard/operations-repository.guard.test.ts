import { describe, expect, it } from "vitest";
import { listAssets, getAssetById, insertAsset, deleteAsset } from "../../functions/shared/repositories/media-repository";
import { getSettings, updateSettings } from "../../functions/shared/repositories/settings-repository";
import { listNavigationItems, replaceNavigationItems } from "../../functions/shared/repositories/navigation-repository";
import { listRedirects, insertRedirect, deleteRedirect } from "../../functions/shared/repositories/redirects-repository";

function makeMockD1(handlers: Record<string, { first?: () => any; all?: () => any; run?: () => any }>) {
  return {
    prepare(sql: string) {
      const query = sql.toLowerCase();
      let matched: { first?: () => any; all?: () => any; run?: () => any } | undefined;

      for (const [key, handler] of Object.entries(handlers)) {
        if (query.includes(key)) {
          matched = handler;
          break;
        }
      }

      const defaultHandler = {
        first: async () => null,
        all: async () => ({ results: [] }),
        run: async () => ({ meta: { changes: 1 } })
      };

      const h = matched ?? defaultHandler;

      return {
        bind(..._args: unknown[]) {
          return {
            first: h.first ?? (() => null),
            all: h.all ?? (() => ({ results: [] })),
            run: h.run ?? (() => ({ meta: { changes: 1 } }))
          };
        },
        first: h.first ?? (() => null),
        all: h.all ?? (() => ({ results: [] })),
        run: h.run ?? (() => ({ meta: { changes: 1 } }))
      };
    }
  };
}

describe("guard/operations-repository: media", () => {
  it("listAssets returns all assets", async () => {
    const db = makeMockD1({
      "from assets": {
        all: async () => ({
          results: [
            { id: "a1", r2_key: "uploads/a1.png", mime_type: "image/png", alt_text: null, created_at: "2026-01-01" },
            { id: "a2", r2_key: "uploads/a2.jpg", mime_type: "image/jpeg", alt_text: "Logo", created_at: "2026-01-02" }
          ]
        })
      }
    });
    const results = await listAssets({ DB: db });
    expect(results).toHaveLength(2);
    expect(results[0].id).toBe("a1");
    expect(results[1].alt_text).toBe("Logo");
  });

  it("getAssetById returns single asset", async () => {
    const db = makeMockD1({
      "from assets where id": {
        first: async () => ({ id: "a1", r2_key: "uploads/a1.png", mime_type: "image/png", alt_text: null, created_at: "2026-01-01" })
      }
    });
    const asset = await getAssetById({ DB: db }, "a1");
    expect(asset).not.toBeNull();
    expect(asset!.id).toBe("a1");
  });

  it("getAssetById returns null when not found", async () => {
    const db = makeMockD1({
      "from assets where id": { first: async () => null }
    });
    const asset = await getAssetById({ DB: db }, "nonexistent");
    expect(asset).toBeNull();
  });

  it("insertAsset executes INSERT without error", async () => {
    let runCalled = false;
    const db = makeMockD1({
      "insert into assets": {
        run: async () => { runCalled = true; return { meta: { changes: 1 } }; }
      }
    });
    await insertAsset({ DB: db }, { id: "a1", r2Key: "uploads/a1.png", mimeType: "image/png" });
    expect(runCalled).toBe(true);
  });

  it("deleteAsset returns asset when row deleted", async () => {
    const db = makeMockD1({
      "from assets where id": {
        first: async () => ({ id: "a1", r2_key: "uploads/a1.png", mime_type: "image/png", alt_text: null, created_at: "2026-01-01" })
      },
      "delete from assets": {
        run: async () => ({ meta: { changes: 1 } })
      }
    });
    const result = await deleteAsset({ DB: db }, "a1");
    expect(result).not.toBeNull();
    expect(result!.r2_key).toBe("uploads/a1.png");
  });

  it("deleteAsset returns null when not found", async () => {
    const db = makeMockD1({
      "from assets where id": { first: async () => null },
      "delete from assets": {
        run: async () => ({ meta: { changes: 0 } })
      }
    });
    const result = await deleteAsset({ DB: db }, "nonexistent");
    expect(result).toBeNull();
  });
});

describe("guard/operations-repository: settings", () => {
  it("getSettings returns settings row", async () => {
    const db = makeMockD1({
      "from site_settings": {
        first: async () => ({
          id: 1, default_locale: "zh-CN",
          locales_json: '["zh-CN","en"]', cta_urls_json: '{}', seo_defaults_json: '{}'
        })
      }
    });
    const settings = await getSettings({ DB: db });
    expect(settings).not.toBeNull();
    expect(settings!.default_locale).toBe("zh-CN");
  });

  it("getSettings returns null when not configured", async () => {
    const db = makeMockD1({
      "from site_settings": { first: async () => null }
    });
    const settings = await getSettings({ DB: db });
    expect(settings).toBeNull();
  });

  it("updateSettings executes UPDATE", async () => {
    let runCalled = false;
    const db = makeMockD1({
      "update site_settings": {
        run: async () => { runCalled = true; return { meta: { changes: 1 } }; }
      }
    });
    await updateSettings({ DB: db }, {
      defaultLocale: "en",
      localesJson: '["en"]',
      ctaUrlsJson: '{}',
      seoDefaultsJson: '{}'
    });
    expect(runCalled).toBe(true);
  });
});

describe("guard/operations-repository: navigation", () => {
  it("listNavigationItems filters by locale and zone", async () => {
    const db = makeMockD1({
      "locale = ? and zone": {
        all: async () => ({
          results: [
            { id: "n1", locale: "zh-CN", zone: "main", label: "能力", href: "#features", sort_order: 0, updated_at: "2026-01-01" }
          ]
        })
      }
    });
    const items = await listNavigationItems({ DB: db }, "zh-CN", "main");
    expect(items).toHaveLength(1);
    expect(items[0].label).toBe("能力");
  });

  it("listNavigationItems returns all without filters", async () => {
    const db = makeMockD1({
      "order by locale": {
        all: async () => ({ results: [] })
      }
    });
    const items = await listNavigationItems({ DB: db });
    expect(items).toHaveLength(0);
  });

  it("replaceNavigationItems deletes then inserts", async () => {
    const ops: string[] = [];
    const db = makeMockD1({
      "delete from navigation_items": {
        run: async () => { ops.push("delete"); return { meta: { changes: 1 } }; }
      },
      "insert into navigation_items": {
        run: async () => { ops.push("insert"); return { meta: { changes: 1 } }; }
      }
    });
    await replaceNavigationItems({ DB: db }, "zh-CN", "main", [
      { id: "n1", label: "能力", href: "#features", sortOrder: 0 }
    ]);
    expect(ops).toContain("delete");
    expect(ops).toContain("insert");
  });
});

describe("guard/operations-repository: redirects", () => {
  it("listRedirects returns all redirects", async () => {
    const db = makeMockD1({
      "from redirects": {
        all: async () => ({
          results: [
            { id: "r1", source_path: "/old", target_path: "/new", status_code: 301, enabled: 1, updated_at: "2026-01-01" }
          ]
        })
      }
    });
    const results = await listRedirects({ DB: db });
    expect(results).toHaveLength(1);
    expect(results[0].source_path).toBe("/old");
  });

  it("insertRedirect creates redirect with default status 301", async () => {
    let runCalled = false;
    const db = makeMockD1({
      "insert into redirects": {
        run: async () => { runCalled = true; return { meta: { changes: 1 } }; }
      }
    });
    await insertRedirect({ DB: db }, { id: "r1", sourcePath: "/old", targetPath: "/new" });
    expect(runCalled).toBe(true);
  });

  it("deleteRedirect returns true when row exists", async () => {
    const db = makeMockD1({
      "delete from redirects": {
        run: async () => ({ meta: { changes: 1 } })
      }
    });
    const result = await deleteRedirect({ DB: db }, "r1");
    expect(result).toBe(true);
  });

  it("deleteRedirect returns false when row not found", async () => {
    const db = makeMockD1({
      "delete from redirects": {
        run: async () => ({ meta: { changes: 0 } })
      }
    });
    const result = await deleteRedirect({ DB: db }, "nonexistent");
    expect(result).toBe(false);
  });
});
