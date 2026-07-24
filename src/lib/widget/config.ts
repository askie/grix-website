/**
 * Grix widget pool configuration.
 *
 * One source code, multiple deploy targets (domains). Each pool resolves the
 * embedded grix widget script (host + site-key + locale) per page locale. The
 * active pool is chosen by the CF_POOL env var when set, otherwise by request
 * hostname.
 */

export interface WidgetScriptConfig {
  /** widget.js source URL */
  src: string;
  /** data-site-key attribute value */
  siteKey: string;
}

/** Resolved widget tag attributes including data-locale. */
export interface WidgetConfig extends WidgetScriptConfig {
  /** data-locale attribute value (e.g. en_US, zh_CN) */
  locale: string;
}

/** Per-pool widget configs, split by locale group. */
export interface PoolWidgets {
  /** Chinese locale (zh-CN) → domestic grix instance */
  zh: WidgetScriptConfig;
  /** All other locales → overseas grix instance */
  default: WidgetScriptConfig;
}

/** Pool key → widget configs. Pool keys are the public domains. */
export const WIDGET_POOLS: Record<string, PoolWidgets> = {
  "grix.im": {
    zh: {
      src: "https://grix.dhf.pub/public/widget/widget.js",
      siteKey: "wk_8mPOzKR8rU06nMI-qXQkWM18"
    },
    // Temporarily pointed at the zh (domestic) instance; original overseas
    // config kept below for restoring later.
    // default: {
    //   src: "https://gb.grix.im/public/widget/widget.js",
    //   siteKey: "wk_GWr9rwSjyBiXHxhQGGFJvBq3"
    // }
    default: {
      src: "https://grix.dhf.pub/public/widget/widget.js",
      siteKey: "wk_8mPOzKR8rU06nMI-qXQkWM18"
    }
  },
  "9rix.com": {
    zh: {
      src: "https://grix.dhf.pub/public/widget/widget.js",
      siteKey: "wk_zTRNW-kPqfD-V_wjmZaDDXNe"
    },
    // Temporarily pointed at the zh (domestic) instance; original overseas
    // config kept below for restoring later.
    // default: {
    //   src: "https://gb.grix.im/public/widget/widget.js",
    //   siteKey: "wk_RhCssDJBZb2nwvDvWooeHO5I"
    // }
    default: {
      src: "https://grix.dhf.pub/public/widget/widget.js",
      siteKey: "wk_zTRNW-kPqfD-V_wjmZaDDXNe"
    }
  }
};

/**
 * Pool key → Google Analytics 4 Measurement ID (G-XXXXXXXXXX).
 * Both streams live under the single "Grix" GA4 property. An empty string
 * disables analytics for that pool (no gtag tag is emitted).
 */
export const GA_MEASUREMENT_IDS: Record<string, string> = {
  "grix.im": "G-T6SQH4KGT5",
  "9rix.com": "G-ZB6TZ5YNZZ"
};

/** Resolve the GA4 Measurement ID for a given pool. Empty string = disabled. */
export function resolveGaId(pool: string): string {
  return GA_MEASUREMENT_IDS[pool] ?? "";
}

/** Fallback pool when neither env var nor hostname resolves a known pool. */
export const DEFAULT_POOL = "grix.im";

/** Hostname → pool key. Covers apex and www variants. */
const HOST_POOL_MAP: Record<string, string> = {
  "grix.im": "grix.im",
  "www.grix.im": "grix.im",
  "9rix.com": "9rix.com",
  "www.9rix.com": "9rix.com"
};

/**
 * Map site page locale → widget data-locale.
 * zh-CN → zh_CN; everything else → en_US.
 */
export function toWidgetLocale(locale: string): string {
  return locale === "zh-CN" ? "zh_CN" : "en_US";
}

/**
 * Resolve the active pool key.
 * Priority: explicit env var (CF_POOL) → request hostname → DEFAULT_POOL.
 */
export function resolvePool(opts: { envPool?: string | null; hostname?: string | null }): string {
  const envPool = opts.envPool?.trim();
  if (envPool && WIDGET_POOLS[envPool]) {
    return envPool;
  }
  const host = opts.hostname?.trim().toLowerCase();
  if (host && HOST_POOL_MAP[host]) {
    return HOST_POOL_MAP[host];
  }
  return DEFAULT_POOL;
}

/** Resolve the widget config for a given pool + locale. */
export function resolveWidget(pool: string, locale: string): WidgetConfig {
  const widgets = WIDGET_POOLS[pool] ?? WIDGET_POOLS[DEFAULT_POOL];
  const script = locale === "zh-CN" ? widgets.zh : widgets.default;
  return {
    ...script,
    locale: toWidgetLocale(locale)
  };
}

/**
 * Resolve the public site origin (scheme + host) for the active pool, so each
 * deploy target self-canonicalizes (grix.im → https://grix.im,
 * 9rix.com → https://9rix.com). Pool keys are the public domains.
 */
export function resolveSiteOrigin(opts: { envPool?: string | null; hostname?: string | null }): string {
  return `https://${resolvePool(opts)}`;
}
