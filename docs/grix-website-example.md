# Grix 官网架构使用说明

> 本文是 `cloudflare-product-website-architecture.md` 的实例化说明。核心架构以通用文档为准，本文件只说明 Grix 如何套用。

## 1. 使用目标

Grix 官网只做产品介绍、内容管理和用户引流。

它要让访客快速理解：

- Grix 是什么。
- Grix 适合谁。
- Grix 解决什么问题。
- 用户下一步应该去哪里注册和使用。

Grix 正式产品入口：

```text
https://grix.dhf.pub
```

所有注册、登录、开始使用按钮都指向这个地址。

## 2. 边界

Grix 官网管理后台只管理官网内容。

后台可以做：

- 编辑首页。
- 新增页面。
- 编辑中英文文案。
- 设置 SEO。
- 上传官网图片。
- 管理导航和 CTA。
- 发布或下线页面。

后台不做：

- Grix 产品用户注册。
- Grix 产品用户登录。
- 即时通讯页面。
- Agent 调度。
- 企业工作流。
- 产品后台。
- 产品 API。
- 产品数据库。
- 实时服务。
- 队列任务。

这些能力属于正式产品站点，不属于宣传官网。

## 3. Grix 技术配置

Grix 官网采用通用架构的完整 CMS 模式：

```text
前端框架：Astro
样式：Tailwind CSS
后台交互：React Islands
部署：Cloudflare Pages
后台 API：Pages Functions / Workers
内容数据库：D1
媒体存储：R2
管理员登录：Cloudflare Access
默认语言：zh-CN
支持语言：zh-CN, en
中文路径：/
英文路径：/en/
正式产品入口：https://grix.dhf.pub
```

通用配置：

```ts
export const siteConfig = {
  defaultLocale: "zh-CN",
  locales: ["zh-CN", "en"],
  productUrls: {
    "zh-CN": "https://grix.dhf.pub",
    en: "https://grix.dhf.pub",
  },
};
```

## 4. 初始内容配置

中文内容：

```ts
export const zhCN = {
  name: "Grix",
  tagline: "专业的人类和 Agent 混合即时通讯软件",
  description:
    "Grix 帮助企业把人、Agent 和工作流放在同一个即时通讯协作空间中，让 Agent 调度更可靠，让人可以参与关键决策。",
  primaryCta: "立即注册",
  secondaryCta: "登录使用",
  audience: "正在建设企业级 Agent 工作流的团队",
  category: "人类和 Agent 混合协作平台",
};
```

英文内容：

```ts
export const en = {
  name: "Grix",
  tagline: "Professional human-agent hybrid messaging",
  description:
    "Grix helps teams bring people, agents, and workflows into one collaborative messaging space.",
  primaryCta: "Get started",
  secondaryCta: "Sign in",
  audience: "Teams building reliable enterprise agent workflows",
  category: "Human-agent collaboration platform",
};
```

这些内容作为 D1 初始化数据。上线后，管理员通过后台修改内容，不再直接改代码。

## 5. 首页结构

Grix 第一版首页结构：

```text
/
  Header
  Language Switcher
  Hero
  Problem
  Solution
  Features
  Use Cases
  How It Works
  Trust
  FAQ
  CTA
  Footer
```

第一版可以只发布首页。等内容增加后，管理员通过后台新增：

```text
/use-cases
/security
/blog
/docs
```

## 6. 管理后台结构

Grix 官网后台路径：

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
/admin/seo                     SEO 设置
/admin/settings                站点设置
/admin/redirects               重定向管理
/admin/publish-history         发布记录
```

Grix 第一版后台必须能完成：

- 修改首页 Hero 文案。
- 修改中英文 CTA。
- 新增一个普通介绍页。
- 编辑页面中英文标题和正文。
- 设置页面 SEO 标题和描述。
- 上传一张产品截图或分享图。
- 发布页面。
- 下线页面。

## 7. 页面内容

### 7.1 Hero

首屏要直接表达：

```text
Grix
专业的人类和 Agent 混合即时通讯软件
让企业把人、Agent 和工作流放在同一个协作空间里。
```

按钮：

```text
立即注册 -> https://grix.dhf.pub
登录使用 -> https://grix.dhf.pub
了解能力 -> 页面内锚点
```

不要使用“下一代 AI 平台”这种空泛标题。

### 7.2 Problem

要讲清楚的问题：

```text
企业开始使用多个 Agent 后，真正的问题不是能不能调用模型，而是如何让人、Agent 和业务流程可靠协作。
```

### 7.3 Solution

Grix 的解决方案表达：

```text
Grix 把即时通讯、Agent 协作和人工参与放在同一个工作空间，让企业可以在真实会话中调度 Agent，并在关键节点由人做判断。
```

### 7.4 Features

第一版展示 5 个能力：

```text
人类和 Agent 混合会话
可靠的 Agent 调度
企业级 Agent 工作流
人工参与、审批和接管
协作过程可追踪
```

这些是宣传表达，不代表官网要实现这些能力。

### 7.5 Use Cases

第一版展示 4 个场景：

```text
企业内部 Agent 协作群
客服和售前辅助
研发、运营、市场跨角色流程协作
需要人工审批的 Agent 自动化流程
```

### 7.6 How It Works

用 5 步解释：

```text
创建协作空间
邀请人类成员和 Agent
在会话中触发任务
人类审批或接管关键动作
沉淀为可复用工作流
```

这里是用户理解层面的流程，不是后端架构。

### 7.7 FAQ

建议问题：

```text
Grix 是聊天工具还是 Agent 平台？
人可以参与 Agent 执行过程吗？
企业如何开始使用？
官网可以直接注册吗？
```

“官网可以直接注册吗”的回答：

```text
官网只负责介绍产品，注册和使用请前往 https://grix.dhf.pub。
```

## 8. 视觉方向

Grix 是企业级协作产品，视觉应该专业、稳定、清晰。

Tailwind CSS 配置重点：

- 主色使用冷静、专业的品牌色。
- 后台和官网共用基础按钮、输入框、标签、卡片样式。
- 官网首屏要突出产品名和产品定位。
- 后台页面要更像工具，不做营销式大图。

重点画面：

- 消息流。
- 人类成员和 Agent 成员并列。
- Agent 任务状态。
- 人工审批节点。
- 工作流沉淀。

避免：

- 纯装饰渐变大图。
- 过度科幻的 AI 风格。
- 没有产品信息的抽象图。
- 像营销口号页一样堆大词。

## 9. Grix SEO

中文首页标题：

```text
Grix - 专业的人类和 Agent 混合即时通讯软件
```

中文描述：

```text
Grix 帮助企业把人、Agent 和工作流放在同一个即时通讯协作空间中，让 Agent 调度更可靠，让人可以参与关键决策。
```

英文首页标题：

```text
Grix - Professional human-agent hybrid messaging
```

英文描述：

```text
Grix helps teams bring people, agents, and workflows into one collaborative messaging space for more reliable agent operations.
```

SEO 要求：

- `/` 使用中文 `html lang="zh-CN"`。
- `/en/` 使用英文 `html lang="en"`。
- 两个页面互相配置 `hreflang`。
- 后台页面设置 `noindex`。
- 草稿预览页面设置 `noindex`。
- CTA 链接都指向 `https://grix.dhf.pub`。

## 10. 文件落地方式

按通用架构创建文件后，Grix 主要修改：

```text
src/content/defaults/zh-CN.ts
src/content/defaults/en.ts
src/i18n/config.ts
src/styles/tailwind.css
tailwind.config.ts
public/images/
```

运行初始化脚本，把默认内容写入 D1。

上线后，Grix 内容通过后台维护：

```text
/admin/pages
/admin/media
/admin/seo
/admin/settings
```

组件结构不为 Grix 特殊定制。Grix 只是填入内容、图片、颜色和链接。

## 11. 验证标准

Grix 官网交付前必须验证：

- `/` 可以打开。
- `/en/` 可以打开。
- Header 有语言切换。
- 中英文 CTA 都指向 `https://grix.dhf.pub`。
- 管理员可以通过 Cloudflare Access 登录 `/admin`。
- 管理员可以修改首页内容。
- 管理员可以新增普通页面并发布。
- 已发布页面公开可访问。
- 草稿页面公开不可访问。
- 管理员可以上传图片到 R2。
- 页面没有产品登录表单。
- 页面没有产品注册表单。
- 页面没有调用 Grix 产品 API。
- 页面没有暗示官网本身可以完成即时通讯或 Agent 调度。
- 中文 SEO 正确。
- 英文 SEO 正确。
- `html lang`、canonical、`hreflang` 正确。
- 后台和草稿预览不被搜索引擎索引。
- 桌面端和移动端布局正常。

## 12. 和通用架构的关系

通用架构文件是主文档：

```text
docs/cloudflare-product-website-architecture.md
```

Grix 示例文件只回答：

```text
如果产品是 Grix，应该如何填内容、链接、页面、后台和验证标准。
```

后续复制给其他产品时，保留通用架构文件，再把本文件复制为对应产品的示例说明即可。
