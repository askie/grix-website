INSERT INTO site_settings (id, default_locale, locales_json, cta_urls_json, seo_defaults_json, created_at, updated_at)
VALUES (
  'site-default',
  'zh-CN',
  '["zh-CN","en"]',
  '{"zh-CN":"https://grix.dhf.pub","en":"https://grix.dhf.pub"}',
  '{"zh-CN":{"title":"Grix - 专业的人类和 Agent 混合即时通讯软件","description":"Grix 帮助企业把人、Agent 和工作流放在同一个即时通讯协作空间中。"},"en":{"title":"Grix - Professional human-agent hybrid messaging","description":"Grix helps teams bring people, agents, and workflows into one collaborative messaging space."}}',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);
