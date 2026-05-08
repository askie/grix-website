# 分层规则与单一职责原则

## 1. 分层结构

- `src/pages`：路由入口层，仅做路由参数处理与渲染拼装。
- `src/layouts` / `src/templates` / `src/components`：视图层，仅做展示和交互。
- `src/lib/*`：前端领域层，仅做数据映射、路径规则、SEO/CTA 规则。
- `functions/api/*`：接口入口层，仅做协议适配、状态码、入参出参。
- `functions/shared/services/*`：用例层，负责组织业务动作。
- `functions/shared/repositories/*`：数据访问层，负责 D1/R2/KV 访问。
- `functions/shared/auth/*` / `validators/*`：横切层，负责认证与校验。

## 2. 依赖方向（必须遵守）

- 上层可以依赖下层，下层不能反向依赖上层。
- `pages -> lib` 可以；`lib -> pages` 不可以。
- `api -> services -> repositories` 可以；`repositories -> api` 不可以。

## 3. 各层单一职责定义

### 3.1 页面层（`src/pages`）

只做：
- 参数读取。
- 调用一个明确的数据入口。
- 根据结果返回页面或 404。

不做：
- 数据库查询。
- 权限校验细节。
- 复杂业务组合。

### 3.2 API 层（`functions/api`）

只做：
- 请求上下文解析。
- 调用鉴权与校验。
- 调用 service 并返回 HTTP 响应。

不做：
- SQL 拼装。
- 跨多表事务细节。

### 3.3 Service 层（`functions/shared/services`）

只做：
- 单个业务用例编排。
- 事务边界控制。
- 规则执行顺序管理。

不做：
- HTTP 状态码拼接。
- 页面展示逻辑。

### 3.4 Repository 层（`functions/shared/repositories`）

只做：
- 数据访问。
- 持久化模型与领域模型转换。

不做：
- 业务流程判断。
- 权限判断。

## 4. SRP 检查问题（PR 自检）

提交前逐项回答：

1. 我改的每个文件，职责是否可用一句话说清？
2. 我新增的函数，是否只有一个失败原因域？
3. 我是否把“鉴权、校验、业务、存储、响应”混在一个函数里？
4. 如果要删掉某个功能，是否能在单一层内完成而不连锁修改？

任一问题回答为“否”，需要拆分后再提交。
