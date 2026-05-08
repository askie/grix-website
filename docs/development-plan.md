# 官网项目后续开发计划（基于当前仓库状态）

## 1. 本次计划完成标准（交付前检查清单）

- [ ] 公开站点、后台站点、Functions API 边界不混用。
- [ ] `src` 与 `functions` 的职责分层清晰，依赖方向单向。
- [ ] 发布链路具备明确事务边界与审计要求。
- [ ] 每个阶段都有“可验证”的退出标准，不以代码量作为完成依据。
- [ ] 测试规划覆盖：单元、接口守卫、页面冒烟、发布回归。
- [ ] 已建立并执行守卫测试，能阻止核心边界回归。

## 2. 当前状态评估（2026-05-08）

### 2.1 已完成

- Astro + Cloudflare 运行骨架已完成。
- 公共页面与 `/admin` 路由骨架已完成。
- `functions/api/public/*` 与 `functions/api/admin/*` 路径已拆分。
- D1 migration/seed 占位已创建。
- 公开页面具备基础 i18n、SEO、CTA 结构。

### 2.2 未完成（后续主线）

- `functions/shared/repositories/*` 仍是占位，未真正接 D1。
- Access JWT 仅做“有无”判断，未做签名、`iss`、`aud` 完整校验。
- 发布流程尚未实现真实事务（`page_locales` + `publish_revisions` + `audit_logs`）。
- 后台表单未与真实 API / D1 连通。
- 缓存主动失效、发布后刷新策略未实现。

## 3. 单一路线开发主线

1. 先打通“公开只读链路”：D1 真读 + `published` 过滤 + locale 边界。
2. 再打通“后台写入链路”：页面编辑、草稿保存、发布、下线。
3. 完成“安全与审计链路”：Access JWT 完整校验、审计日志、发布记录。
4. 最后做“运营能力”：媒体管理、导航配置、重定向、SEO 默认项。

## 4. 分阶段执行计划

## 阶段 A：内容读取真链路（Public Read Path）

目标：公开站点只读已发布内容，且多语言边界正确。

任务：
- 实现 `functions/shared/repositories/pages-repository.ts` 的 D1 查询。
- 实现 locale + slug 查询，严格遵循 `pages.status != archived` 且 `page_locales.status = published`。
- 公共页面从 API / repository 读取真实数据，去掉硬编码样例。

退出标准：
- `/`、`/en/` 正常展示。
- 未发布语言或草稿页面返回 404。
- 守卫测试覆盖并通过。

## 阶段 B：后台编辑与发布（Admin Write Path）

目标：后台可保存草稿、发布、下线，公开站点实时受控。

任务：
- 完成 `/api/admin/pages` 的增改查。
- 完成 `/api/admin/pages/:id/publish` 与 `/archive`。
- 在一个事务中写入 `page_locales`、`publish_revisions`、`audit_logs`。

退出标准：
- 后台可编辑首页 Hero 文案并发布。
- 发布后公开页可见；下线后公开页不可见。
- 发布失败不会产生“半成功”状态。

## 阶段 C：安全与审计（Security + Audit）

目标：后台入口与写操作可追溯、可拒绝、可审计。

任务：
- 完成 Access JWT 签名与 claim 校验（`iss` / `aud` / 过期时间）。
- 操作日志写入 `audit_logs`，字段完整（操作者、动作、对象、时间）。
- 管理后台和 API 的拒绝访问都记录审计事件。

退出标准：
- 无 JWT / 无效 JWT / 错误 audience 全部 403。
- 管理写操作 100% 产生审计记录。

## 阶段 D：内容运营能力（Operations）

目标：可用于真实内容运营，不依赖开发改代码。

任务：
- 媒体库接 R2（上传、元数据、引用）。
- 导航、SEO 默认项、站点设置、重定向管理完成。
- 发布后缓存策略与主动清理策略落地。

退出标准：
- 运营人员可独立完成“改文案-发布-验证”。
- 公开站点无缓存串内容问题（locale + slug 缓存键有效）。

## 5. 每阶段统一质量闸门

- `npm run check`
- `npm run build`
- `npm run test:guard`
- 对应阶段的手工验收脚本（见 `docs/testing-plan.md`）

任何一项未通过，不进入下一阶段。

## 6. 变更控制规则

- 每次需求必须先写“影响边界”说明（页面层/API层/数据层）。
- 新增功能不得跨层临时调用，必须走既定层次。
- 线上问题修复必须追加守卫测试后才允许合并。
