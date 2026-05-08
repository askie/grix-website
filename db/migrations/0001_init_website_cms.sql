CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  default_locale TEXT NOT NULL,
  locales_json TEXT NOT NULL,
  cta_urls_json TEXT NOT NULL,
  seo_defaults_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  template TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'archived')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS page_locales (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')),
  published_at TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE (page_id, locale),
  FOREIGN KEY (page_id) REFERENCES pages(id)
);

CREATE TABLE IF NOT EXISTS page_sections (
  id TEXT PRIMARY KEY,
  page_locale_id TEXT NOT NULL,
  section_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  data_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (page_locale_id) REFERENCES page_locales(id)
);

CREATE TABLE IF NOT EXISTS navigation_items (
  id TEXT PRIMARY KEY,
  locale TEXT NOT NULL,
  zone TEXT NOT NULL,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  r2_key TEXT NOT NULL,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS redirects (
  id TEXT PRIMARY KEY,
  source_path TEXT NOT NULL UNIQUE,
  target_path TEXT NOT NULL,
  status_code INTEGER NOT NULL DEFAULT 301,
  enabled INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS publish_revisions (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  revision_no INTEGER NOT NULL,
  published_by TEXT NOT NULL,
  published_at TEXT NOT NULL,
  FOREIGN KEY (page_id) REFERENCES pages(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  payload_json TEXT,
  created_at TEXT NOT NULL
);
