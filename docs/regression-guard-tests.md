# 回归守卫测试清单（当前版本）

## 1. 已实现用例

对应目录：`tests/guard`

1. `content-repository.guard.test.ts`
- 守卫点：仅发布内容可被公开读取。
- 防回归：草稿页面误公开。

2. `i18n.guard.test.ts`
- 守卫点：默认语言无前缀，非默认语言带前缀。
- 防回归：语言路由串路径。

3. `admin-auth.guard.test.ts`
- 守卫点：无 Access token 必须 403。
- 防回归：后台接口被匿名访问。

4. `public-api.guard.test.ts`
- 守卫点：非法 locale 404；草稿 slug 404；有效 locale 返回缓存头。
- 防回归：公开 API 边界松动。

5. `publish-api.guard.test.ts`
- 守卫点：发布接口必须鉴权；locale 非法必须拒绝。
- 防回归：发布入口绕过鉴权或跨语言错误发布。

## 2. 执行方式

```bash
npm run test:guard
```

## 3. 下一批建议守卫

1. Access JWT claim 校验（`iss` / `aud` / exp）失败路径。
2. 发布事务一致性（模拟任一步失败应整体回滚）。
3. `pages.status` 与 `page_locales.status` 组合可见性矩阵。
4. 缓存键必须包含 `locale + slug` 的响应验证。
