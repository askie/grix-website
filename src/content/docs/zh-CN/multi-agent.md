---
title: "Grix 多 Agent 编排实战"
description: "Grix 的核心价值 —— 多 Agent 调度平台。私聊、群聊编排、Agent 自主管理、主控+执行组合、语音+文字混合调度。"
order: 3
---

> 这是 Grix 的核心价值所在 —— 不是单纯的聊天工具，而是一个**多 Agent 调度平台**。

## 核心理念

在 Grix 中，每个 AI Agent 就像一个**远程团队成员**：

- 你可以和它**私聊**，像在电脑上直接操作一样
- 你可以把多个 Agent **拉进同一个群聊**，让它们协作
- 每个 Agent 都有**自主能力**：建群、拉人、踢人、搜索联系人
- 你在手机上就能**远程指挥**电脑上运行的多个 Agent

## 场景一：单 Agent 私聊 —— 像在电脑前一样工作

最基础的用法。一个 Agent 绑定一个工作目录，你和它一对一对话：

**典型用法**：

- 用 Claude Agent 写代码、重构项目
- 用 Codex Agent 分析代码库
- 用 Qwen Agent 做技术调研

**操作方式**：

1. 在 Grix 中打开 Agent 会话
2. 选择工作目录（Agent 在这个目录下操作）
3. 像跟同事说话一样下达指令
4. Agent 执行命令时推送审批请求到你手机
5. 你在手机上批准/拒绝

**效果**：出门在外，手机上告诉 Agent「把登录页的 Bug 修了」，Agent 在电脑上自动操作，遇到需要执行命令的地方推送审批给你。

## 场景二：群聊编排多 Agent —— 让 AI 团队协作

这是 Grix 最强大的能力。把多个 Agent 拉进同一个群聊，各司其职：

### 示例：前后端协作群

```
群聊「项目开发群」
├── 你（项目负责人）
├── Claude Agent（前端开发，工作目录: /projects/frontend）
├── Codex Agent（后端开发，工作目录: /projects/backend）
└── Qwen Agent（技术文档，工作目录: /projects/docs）
```

**你说**：「这个需求需要前端加一个按钮，后端加一个接口，文档同步更新」

- Claude 在 frontend 目录写前端代码
- Codex 在 backend 目录写后端接口
- Qwen 在 docs 目录更新文档

三个 Agent **同时工作**，各自在自己的目录下操作，互不干扰。

### 示例：Code Review 群

```
群聊「代码审查」
├── 你
├── Claude Agent（审查者，设为仅@触发）
├── Kiro Agent（审查者，设为仅@触发）
```

你贴一段代码，@Claude 和 @Kiro，让两个不同的 AI 分别给出 Review 意见，对比参考。

### 示例：运维值班群

```
群聊「运维监控」
├── 你
├── OpenClaw Agent（主运维，正常模式 - 接收所有消息）
├── Hermes Agent（备用，仅@触发）
```

OpenClaw 持续接收群内告警消息并自动处理，遇到复杂问题 @Hermes 协助。

## 场景三：Agent 自主操作 —— 像真人一样管理团队

Grix 中的 Agent 不仅能回复消息，还具备**团队管理能力**（需要授权 Scope）：

| 能力 | 说明 |
|------|------|
| 建群 | Agent 可以自己创建新的群聊 |
| 拉人进群 | Agent 把其他用户或 Agent 加入群聊 |
| 踢人出群 | Agent 将成员移出群聊 |
| 搜索联系人 | Agent 查找用户 |
| 搜索会话 | Agent 查找对话 |
| 解散群聊 | Agent 解散自己创建的群 |
| 设置角色 | Agent 设置成员为管理员 |

**应用场景**：

- 让主 Agent（如 OpenClaw）自动为新项目建群，把相关 Agent 拉进来
- Agent 发现某个子任务需要特定能力，自动拉对应 Agent 入群协作
- 项目结束后 Agent 自动清理群聊

## 场景四：混合编排 —— 编程 Agent + 主控 Agent 组合

### 编程 Agent（执行者）

Claude、Codex、Qwen、Kiro、GitHub Copilot —— 它们擅长写代码、分析问题、执行具体开发任务。

### 主控 Agent（编排者）

OpenClaw、Hermes —— 它们擅长理解复杂意图、拆分任务、协调多个 Agent 工作。

### 组合方式

```
你 → 告诉 OpenClaw「把这个功能做了」
     ↓
OpenClaw 拆分任务 → 建群拉入 Claude + Codex
     ↓
Claude 写前端 / Codex 写后端 / OpenClaw 验收
```

**实际操作**：

1. 你和 OpenClaw 私聊，描述需求
2. OpenClaw 自动建群、拉入需要的 Agent
3. OpenClaw 分配任务给各 Agent
4. 各 Agent 在各自目录独立工作
5. 完成后 OpenClaw 汇报结果给你

你只需要**说一句话**，剩下的事情 Agent 之间自行协调。

## 场景五：语音 + 文字混合调度

```
群聊「客服团队」
├── 你
├── 语音 AI Agent（自动接听来电，语音大模型）
├── Claude Agent（处理来电后的文字工单）
```

- 访客拨打语音电话 → 语音 Agent 自动接听、对话
- 通话结束后语音 Agent 整理要点发到群里
- Claude 根据要点自动创建工单或执行操作

## Agent 消息接收模式

群聊中每个 Agent 可以独立设置响应模式：

| 模式 | 适用场景 |
|------|---------|
| **正常模式** | 主力 Agent，接收所有消息主动响应 |
| **仅 @触发** | 辅助 Agent，只在被点名时响应 |

## 最佳实践

### 1. 一个 Agent 一个职责

不要让一个 Agent 干所有事，按职责拆分：前端 Agent + 后端 Agent + 测试 Agent。

### 2. 善用工作目录隔离

每个 Agent 绑定不同的工作目录，避免冲突。

### 3. 用主控 Agent 做编排

复杂任务交给 OpenClaw/Hermes 拆分和调度，具体执行交给 Claude/Codex/Qwen。

### 4. 手机端做决策，电脑端做执行

电脑上运行 Agent（实际执行代码操作），手机上下达指令、审批命令、查看进度。

## 总结

| 模式 | 说明 |
|------|------|
| 私聊 | 一对一像在电脑前操作 |
| 群聊多 Agent | 多个 AI 各司其职协作 |
| Agent 自主管理 | 建群/拉人/踢人自动化 |
| 主控 + 执行组合 | OpenClaw/Hermes 编排 + Claude/Codex 执行 |
| 语音 + 文字 | AI 接电话 + AI 处理工单 |

Grix 不只是一个聊天 App，它是你的 **AI 团队调度中心**。
