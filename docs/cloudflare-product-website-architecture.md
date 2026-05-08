# Cloudflare 通用产品官网架构体系

## 1. 定位

本文定义一套可以复用的产品宣传官网架构。

它适用于：

- SaaS 产品官网。
- AI 产品官网。
- 开发者工具官网。
- 企业服务官网。
- App 或平台的介绍官网。

这套架构包含两部分：

- 公开官网：负责展示、解释、SEO 和转化。
- 官网管理后台：负责管理员登录、内容配置、页面新增、媒体管理和发布。

这套后台只管理官网内容，不管理产品本体。

默认不做：

- 产品用户登录。
- 产品用户注册。
- 产品业务后台。
- 产品业务 API。
- 产品核心数据管理。
- 产品实时通讯。
- 产品任务调度。
- 产品复杂工作流。

产品真正的注册、登录、下载、购买、联系销售等动作，应跳转到正式产品入口，或者跳转到已有产品系统。

## 2. 完成标准

一套合格的通用官网架构需要满足：

- 能部署到 Cloudflare Pages。
- 官网首页首屏能讲清产品名称、产品类型和核心价值。
- 官网主要 CTA 链接统一配置。
- 使用 Tailwind CSS 建立统一视觉系统。
- 支持 i18n 多语言路由。
- 支持桌面端和移动端。
- 支持基础 SEO、分享卡片、sitemap、robots。
- 支持 Cloudflare Web Analytics。
- 管理员可以登录官网后台。
- 管理员可以编辑首页内容。
- 管理员可以新增、编辑、下线页面。
- 管理员可以设置 SEO、导航、CTA 和站点基础配置。
- 管理员可以上传和管理官网媒体资源。
- 公开页面只读取已发布内容。
- 后台草稿、预览、发布有清晰边界。
- 结构足够通用，复制到其他产品时主要改内容配置，不需要重写架构。

## 3. 主线技术方案

推荐主线：

```text
前端框架：Astro
语言：TypeScript
样式：Tailwind CSS
交互：Astro Islands，后台复杂控件使用少量 React
部署：Cloudflare Pages
后端：Pages Functions / Workers
数据库：D1
媒体存储：R2
缓存配置：KV，可选
管理员登录：Cloudflare Access
域名：Cloudflare DNS
HTTPS：Cloudflare Universal SSL
加速：Cloudflare CDN
统计：Cloudflare Web Analytics
国际化：Astro i18n routing + typed locale content
```

核心判断：

- Astro 负责官网页面、SEO 和静态优先渲染。
- Tailwind CSS 负责官网和后台的统一 UI 风格。
- Pages Functions / Workers 只负责官网内容管理 API，不承载产品业务 API。
- D1 保存官网页面、区块、SEO、导航、发布记录。
- R2 保存官网图片、分享图、下载文件等媒体资源。
- Cloudflare Access 负责管理员登录和后台访问控制。
- 公开官网只展示已发布内容，后台可查看草稿和预览。

## 4. Cloudflare 技术分工

| Cloudflare 技术 | 官网用途 | 默认是否需要 |
| --- | --- | --- |
| Cloudflare Pages | 托管官网和后台前端 | 需要 |
| Pages Functions / Workers | 官网内容管理 API、公开内容读取 API | 需要 |
| D1 | 页面、区块、SEO、导航、发布记录 | 需要 |
| R2 | 图片、分享图、附件、下载资源 | 需要 |
| Cloudflare Access | 管理后台登录和保护 | 需要 |
| Cloudflare DNS | 管理官网域名 | 需要 |
| Universal SSL | 自动 HTTPS | 需要 |
| Cloudflare CDN | 静态资源和公开页面加速 | 需要 |
| Web Analytics | 官网访问统计 | 建议 |
| Turnstile | 公开表单防刷 | 可选 |
| KV | 发布配置、低频缓存、功能开关 | 可选 |
| Durable Objects | 官网不做实时协作 | 不需要 |
| Queues | 官网不做异步业务任务 | 不需要 |

判断规则：

- 如果官网完全不需要后台，可以删掉 D1、R2、Access、Functions，只保留静态内容。
- 如果需要管理员新增页面和改内容，必须启用 D1、Functions 和 Access。
- 如果需要上传图片或文件，必须启用 R2。
- 如果只是联系表单，增加 Turnstile 和一条表单 API 即可，不要扩大成产品后端。

## 5. 总体架构

```text
访客
  -> Cloudflare CDN
  -> Cloudflare Pages 官网
  -> Pages Functions / Workers 读取已发布内容
  -> D1
  -> R2 媒体资源

管理员
  -> Cloudflare Access 登录
  -> /admin 管理后台
  -> /api/admin/* 内容管理 API
  -> D1 页面和配置
  -> R2 媒体资源
```

公开站点和管理后台共用一个官网项目，但权限边界必须分开：

- `/`、`/en/`、`/[slug]` 是公开访问。
- `/admin/*` 只允许管理员访问。
- `/api/public/*` 只返回已发布内容。
- `/api/admin/*` 只允许通过 Access 的管理员访问。

## 6. 公开官网信息架构

第一版公开官网建议以首页为主。

标准结构：

```text
/
  Header 导航
  Language Switcher 语言切换
  Hero 首屏
  Problem 用户问题
  Solution 产品方案
  Features 核心能力
  Use Cases 使用场景
  How It Works 工作方式
  Proof 信任依据
  FAQ 常见问题
  CTA 转化区
  Footer 页脚
```

内容变多后，通过后台新增页面：

```text
/features
/use-cases
/pricing
/docs
/blog
/security
/about
```

扩展原则：

- 第一版优先把首页讲清楚。
- 多页面通过后台新增，不手工复制组件。
- 页面模板要少，内容区块要可复用。

## 7. 管理后台信息架构

后台路径：

```text
/admin
```

后台页面：

```text
/admin                         仪表盘
/admin/pages                   页面列表
/admin/pages/new               新建页面
/admin/pages/:id               编辑页面
/admin/navigation              导航管理
/admin/media                   媒体库
/admin/seo                     全站 SEO 默认配置
/admin/settings                站点设置
/admin/redirects               重定向管理
/admin/publish-history         发布记录
```

后台核心能力：

- 登录后才能访问。
- 查看页面列表。
- 新建普通页面。
- 编辑首页内容。
- 编辑页面 slug、标题、模板、状态。
- 编辑多语言内容。
- 编辑 SEO 标题、描述、分享图。
- 上传和选择图片。
- 管理导航菜单。
- 设置全站 CTA 链接。
- 草稿预览。
- 发布页面。
- 下线页面。
- 查看发布记录。

后台不做：

- 产品用户管理。
- 产品订单管理。
- 产品权限管理。
- 产品业务数据管理。
- Agent、工作流、即时通讯等产品功能管理。

## 8. 内容模型

D1 是官网内容的事实来源。

推荐表：

```text
site_settings
pages
page_locales
page_sections
navigation_items
assets
redirects
publish_revisions
audit_logs
```

表职责：

```text
site_settings       站点名、默认语言、支持语言、全站 CTA、默认 SEO
pages               页面基本信息：slug、模板、生命周期状态、排序
page_locales        页面多语言标题、摘要、SEO、语言发布状态
page_sections       页面区块内容，使用结构化 JSON
navigation_items    顶部导航、页脚导航
assets              R2 文件元数据、alt、尺寸、类型
redirects           旧 URL 到新 URL 的跳转
publish_revisions   发布版本记录
audit_logs          后台关键操作记录
```

页面生命周期状态（`pages.status`）：

```text
draft       编辑中
archived    已下线
```

语言发布状态（`page_locales.status`）：

```text
draft       语言草稿
published   语言已发布
```

页面模板：

```text
home        首页
landing     通用落地页
article     文章页
legal       法律和政策页
custom      特殊页面
```

区块类型：

```text
hero
problem
solution
features
use_cases
how_it_works
proof
faq
cta
rich_text
media
```

设计原则：

- 页面结构由模板控制。
- 页面内容由区块配置。
- 区块内容用结构化 JSON，不把整页 HTML 直接存数据库。
- `published` 的真相源是 `page_locales.status`。
- `pages.status` 只控制页面生命周期，不单独决定公开可见性。
- 发布动作用 D1 事务写入 `page_locales`、`publish_revisions` 和 `audit_logs`；如果同时写入发布内容快照，也必须同事务写 `page_sections`。
- 任一写入失败必须回滚，不允许半发布。
- 公开站点只读取 `pages.status != archived` 且 `page_locales.status = published` 的内容。
- 草稿和预览只在后台可见。

## 9. i18n 前端架构

推荐 URL 方案：

```text
默认语言：/
其他语言：/[locale]/
示例：
  中文：/
  英文：/en/
```

多语言页面规则：

- 每个页面有一个全局 slug。
- 每个语言有自己的标题、正文、SEO 和图片 alt。
- 默认语言可以使用无前缀路径。
- 非默认语言使用语言前缀路径。
- 如果某个页面缺少某个语言版本，该语言路径不展示或返回 404。

Astro 配置示例：

```ts
import { defineConfig } from "astro/config";

export default defineConfig({
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

语言切换要求：

- Header 有语言切换入口。
- 当前语言有明确状态。
- 切换语言时跳到同一页面的对应语言路径。
- 某个语言页面不存在时，不展示该语言入口。
- 不自动跳转覆盖用户选择。

## 10. 推荐代码目录

单官网项目推荐结构：

```text
src/
  pages/
    index.astro
    [...slug].astro
    [locale]/
      index.astro
      [...slug].astro
    admin/
      index.astro
      pages/
        index.astro
        new.astro
        [id].astro
      navigation.astro
      media.astro
      seo.astro
      settings.astro
      redirects.astro
      publish-history.astro
  layouts/
    PublicLayout.astro
    AdminLayout.astro
  templates/
    HomePage.astro
    LandingPage.astro
    ArticlePage.astro
  components/
    public/
      SiteHeader.astro
      LanguageSwitcher.astro
      Hero.astro
      FeatureGrid.astro
      FAQSection.astro
      CTASection.astro
      SiteFooter.astro
    admin/
      AdminShell.tsx
      PageEditor.tsx
      SectionEditor.tsx
      MediaLibrary.tsx
      PublishActions.tsx
  i18n/
    config.ts
    routes.ts
    translate.ts
  content/
    defaults/
      zh-CN.ts
      en.ts
  styles/
    global.css
    tailwind.css
public/
  favicon.svg
functions/
  api/
    public/
      pages/
        [[path]].ts
    admin/
      pages/
        index.ts
        [id].ts
      media.ts
      settings.ts
      redirects.ts
      publish.ts
astro.config.mjs
tailwind.config.ts
package.json
wrangler.toml
```

说明：

- `public` 组件只负责官网展示。
- `admin` 组件只负责后台交互。
- `functions/api/public` 只读已发布内容。
- `functions/api/admin` 需要管理员身份。
- `content/defaults` 只放初始化内容，不作为发布后的唯一内容来源。

## 11. API 边界

本架构允许官网内容管理 API，但不允许混入产品业务 API。

公开 API：

```text
GET /api/public/:locale/site
GET /api/public/:locale/pages/:slug
GET /api/public/:locale/navigation
GET /api/public/assets/:id
```

后台 API：

```text
GET    /api/admin/pages
POST   /api/admin/pages
GET    /api/admin/pages/:id
PUT    /api/admin/pages/:id
DELETE /api/admin/pages/:id
POST   /api/admin/pages/:id/publish
POST   /api/admin/pages/:id/archive

GET    /api/admin/media
POST   /api/admin/media
DELETE /api/admin/media/:id

GET    /api/admin/settings
PUT    /api/admin/settings

GET    /api/admin/navigation
PUT    /api/admin/navigation

GET    /api/admin/redirects
POST   /api/admin/redirects
DELETE /api/admin/redirects/:id
```

API 规则：

- `/api/public/:locale/*` 必须显式带 locale，且 locale 必须在 `site_settings.locales` 中。
- `/api/public/:locale/*` 只返回已发布内容。
- 页面已下线或该语言未发布时返回 `404`。
- `/api/admin/*` 必须校验 Cloudflare Access 身份。
- 所有后台写操作必须写 `audit_logs`。
- 发布动作必须生成 `publish_revisions`。
- 删除页面默认做下线，不直接物理删除。
- 不提供任何产品业务数据接口。

## 12. 管理员登录与权限

默认使用 Cloudflare Access 作为管理员登录层。

推荐规则：

- 使用 `admin.example.com` 或 `/admin/*` 保护后台。
- `/api/admin/*` 和 `/admin/*` 使用同一组 Access 策略。
- 只允许指定邮箱、邮箱域名或身份提供商用户访问。
- 后台应用仍然要读取 Access 用户身份，并记录操作人。

服务端校验要求：

- 从请求头 `Cf-Access-Jwt-Assertion` 读取 Access JWT，不依赖前端传参判断身份。
- 服务端必须校验 JWT 签名、`iss`（团队域名）和 `aud`（应用 Audience）。
- 校验通过后再读取 `email`、`sub` 等身份字段，并按 allowlist / 角色规则授权。
- 校验失败返回 `403`，并记录拒绝事件日志。

不建议第一版自研密码登录。

如果未来需要更细粒度权限，可以在 D1 增加：

```text
admin_users
admin_roles
admin_role_permissions
```

第一版权限可以简单分为：

```text
owner       管理设置和发布
editor      编辑页面和媒体
viewer      只读查看
```

## 13. 发布与渲染策略

推荐策略：

- 后台编辑草稿。
- 后台预览草稿。
- 管理员点击发布。
- 发布时把目标语言写为 `page_locales.status = published`。
- 公开官网只读取已发布语言内容。
- 公开页面通过 Cloudflare CDN 缓存。

发布动作事务边界：

- 一次发布必须在一个事务内完成：更新 `page_locales`、写入 `publish_revisions`、写入 `audit_logs`。
- 任一写入失败即整次发布失败，不允许保留部分成功状态。
- `publish_revisions` 要记录页面 id、locale、版本号、发布时间和发布人。

渲染方式：

```text
首页和动态页面：Astro SSR on Cloudflare Pages
后台页面：Astro + React Islands
公开内容读取：Pages Functions / Workers + D1
媒体资源：R2 公开或签名读取
```

为什么不每次发布都触发重新构建：

- 管理员新增页面后应该立即生效。
- 多语言和页面数量增加后，构建触发会变慢。
- D1 + SSR + CDN 缓存更适合轻量 CMS。

缓存规则：

- 后台 API 不缓存。
- 草稿预览不缓存。
- 公开页面默认短缓存（建议 `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=120`）。
- 缓存键必须包含 `locale + slug`，避免多语言内容串缓存。
- 发布后优先主动清理对应页面缓存；若无法主动清理，依赖短 TTL 自然过期。

## 14. Tailwind CSS 规范

Tailwind CSS 是主线样式方案。

要求：

- 官网和后台共用设计 token。
- 颜色、字号、间距、圆角、阴影在 `tailwind.config.ts` 中统一。
- 页面组件不要写散乱的内联样式。
- 后台表单、表格、按钮、弹窗、标签要形成稳定组件。
- 移动端和桌面端都按 Tailwind responsive class 设计。

建议基础组件：

```text
Button
IconButton
Input
Textarea
Select
Tabs
Modal
Toast
Table
Badge
Card
FormField
```

视觉原则：

- 官网首屏产品名明显。
- 标题直接，不使用空泛概念。
- CTA 明显但克制。
- 后台信息密度更高，布局更工具化。
- 后台不要做营销页式大卡片堆叠。

## 15. SEO 规范

每个语言版本至少配置：

- `title`
- `description`
- `canonical`
- `alternates`
- `hreflang`
- `openGraph.title`
- `openGraph.description`
- `openGraph.image`
- `openGraph.locale`
- `twitter.card`
- `favicon`
- `robots.txt`
- `sitemap.xml`

SEO 原则：

- 标题包含产品名。
- 描述说明产品类型和核心价值。
- 每个语言页面有当前语言的标题和描述。
- 每个语言页面有正确的 `html lang`。
- 每个语言页面有指向其他语言版本的 `hreflang`。
- 默认语言 `/` 和其他语言 `/en/` 不要互相抢 canonical。
- 后台页面必须设置 `noindex`。
- 草稿预览页面必须设置 `noindex`。
- 不堆关键词。
- 不写未验证承诺。

## 16. 部署方案

Cloudflare Pages 配置：

```text
Framework preset: Astro
Build command: npm run build
Build output directory: dist
```

需要绑定：

```text
D1 database
R2 bucket
KV namespace，可选
```

环境隔离要求：

```text
local       本地开发环境，使用本地变量和本地/测试资源
preview     预发环境，使用独立 D1、R2、Access 策略
production  生产环境，使用独立 D1、R2、Access 策略
```

- 生产和预发必须使用不同的 D1 数据库与 R2 bucket。
- 生产和预发必须使用不同的 Access 应用 `aud`。
- 通过 Wrangler 配置 `env.preview` / `env.production` 覆盖 bindings 和 vars，不混用资源。

部署步骤：

1. 创建官网项目。
2. 配置 Tailwind CSS。
3. 推送到 Git 仓库。
4. Cloudflare Pages 连接仓库。
5. 配置构建命令和输出目录。
6. 创建 D1 数据库并执行 migration。
7. 创建 R2 bucket。
8. 配置 Pages Functions / Workers bindings。
9. 配置 Cloudflare Access 保护 `/admin/*` 和 `/api/admin/*`，并完成服务端 JWT 校验。
10. 绑定自定义域名。
11. 开启 HTTPS。
12. 接入 Web Analytics。
13. 验证公开页面、后台登录、内容发布、多语言路径和环境隔离。

## 17. 复制改造流程

把这套架构复制给其他产品时，按这个顺序改：

1. 修改产品名。
2. 修改一句话定位和产品描述。
3. 修改默认语言和支持语言。
4. 修改产品入口链接。
5. 修改 Tailwind 品牌色和基础视觉。
6. 修改首页默认区块内容。
7. 修改每个语言的核心能力。
8. 修改每个语言的使用场景。
9. 修改每个语言的 SEO 标题和描述。
10. 配置管理员邮箱或 Access 策略。
11. 初始化 D1 内容表。
12. 上传产品截图和分享图。
13. 检查语言切换链接。
14. 检查所有 CTA 链接。
15. 本地构建和预览。
16. 登录后台新增一页并发布验证。

不要一开始就改组件结构。优先通过内容配置和后台内容完成替换。

## 18. 验证标准

交付前必须验证：

- 首页可以本地打开。
- 构建命令可以成功。
- 默认语言 `/` 可以打开。
- 非默认语言路径可以打开，例如 `/en/`。
- 语言切换可以在支持的语言之间切换。
- 首屏能看到产品名、定位和核心价值。
- 所有 CTA 都指向正确产品入口。
- 管理员可以通过 Access 登录后台。
- `/api/admin/*` 未携带或携带无效 Access JWT 时会返回 `403`。
- 管理员可以编辑首页内容。
- 管理员可以新增页面并发布。
- 已发布页面公开可访问。
- 草稿页面公开不可访问。
- 页面已下线或语言未发布时公开接口返回 `404`。
- 管理员可以上传图片到 R2。
- 每个语言的导航、CTA、FAQ、SEO 文案完整。
- 页面没有无效链接。
- 页面没有不存在的产品 API 请求。
- 页面没有产品登录表单或产品注册表单，除非明确要做。
- 桌面端布局正常。
- 移动端布局正常。
- `html lang`、canonical、`hreflang` 正确。
- 后台和草稿预览不被搜索引擎索引。
- 分享图和 favicon 正常。
- preview 与 production 使用不同的 D1、R2、Access 配置。

## 19. 后续扩展

通用官网后续可以扩展：

- 更多语言和地区版本。
- 博客。
- 文档。
- 案例页。
- 定价页。
- 安全页。
- 更新日志。
- 下载页。
- 联系表单。
- 审批流发布。
- 内容版本对比。
- 多管理员角色。

扩展仍然保持边界：

```text
官网负责展示、内容管理和转化，产品本体负责注册、登录和使用。
```

## 20. 官方参考

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare DNS: https://developers.cloudflare.com/dns/
- Cloudflare SSL: https://developers.cloudflare.com/ssl/
- Cloudflare Web Analytics: https://developers.cloudflare.com/web-analytics/
- Cloudflare D1: https://developers.cloudflare.com/d1/
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Cloudflare Access: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/
- Astro: https://docs.astro.build/
- Astro i18n routing: https://docs.astro.build/en/guides/internationalization/
- Tailwind CSS: https://tailwindcss.com/docs
