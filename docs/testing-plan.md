# 测试规划与回归守卫策略

## 1. 测试目标

- 防止核心边界回归：发布边界、鉴权边界、多语言边界、状态码边界。
- 保证每次迭代都能快速验证“是否破坏主链路”。

## 2. 测试层次

## 2.1 守卫单元测试（必须）

命令：`npm run test:guard`

覆盖范围：
- `src/lib/*` 规则函数。
- `functions/shared/*` 鉴权/校验函数。
- `functions/api/*` 关键端点行为（403/404/200）。

## 2.2 类型与构建测试（必须）

命令：
- `npm run check`
- `npm run build`

目标：
- 阻止类型回归。
- 阻止部署构建回归。

## 2.3 页面冒烟测试（阶段性）

阶段 B 起启用（建议 Playwright）：
- `/`、`/en/`、`/admin` 可打开。
- `lang`、`robots`、主要 CTA 与预期一致。
- 草稿页面不可公开访问。

## 3. 守卫测试失败处理规则

1. 先修复代码，不跳过测试。
2. 确认是规则变更时，先更新文档，再调整测试。
3. 线上回归 bug 必须沉淀为新增守卫测试。

## 4. CI 质量闸门

统一命令：`npm run ci:guard`

执行顺序：
1. `npm run check`
2. `npm run build`
3. `npm run test:guard`

任意步骤失败都禁止合并。

## 5. 测试数据与环境

- 本地：使用仓库默认 seed 与样例数据。
- preview：使用独立 D1/R2/Access，禁止和 production 混用。
- production：仅跑非破坏性验证与健康检查。

## 6. 当前已落地守卫范围

见 `docs/regression-guard-tests.md`。
