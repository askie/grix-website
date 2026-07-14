---
title: "Grix 快速开始"
description: "从零到与 AI Agent 对话只需几分钟。本章帮助你用最快的方式开始使用 Grix。"
order: 2
---

本章帮助你用最快的方式开始使用 Grix，从零到与 AI Agent 对话只需几分钟。

## 两种使用方式

| 方式 | 适合场景 | 难度 |
|------|---------|------|
| 方式一：安装 Grix 桌面版 | 推荐，最简单 | ⭐ 简单 |
| 方式二：直接安装 grix-connector | 无 GUI 服务器、已有桌面环境不想装额外 App | ⭐⭐ 需手动配置 |

## 方式一：安装 Grix 桌面版（推荐）

这是最快的上手路径。安装桌面版后，Grix 会自动安装并管理 grix-connector，一切在界面内完成。

### 第 1 步：下载安装桌面版

| 平台 | 下载链接 |
|------|---------|
| macOS | [Grix-macOS.dmg](https://release.dhf.pub/latest/Grix-macOS.dmg) — 打开后将 Grix 拖入 Applications |
| Windows | [Grix-Windows.zip](https://release.dhf.pub/latest/Grix-Windows.zip) — 下载后解压，双击安装 |
| Linux | [Grix-Linux-x64.tar.gz](https://release.dhf.pub/latest/Grix-Linux-x64.tar.gz) — 下载后解压运行 |

> 💡 所有链接始终指向最新版本。

### 第 2 步：注册/登录 Grix 账号

打开 Grix 桌面版，注册新账号或使用已有账号登录。

### 第 3 步：自动安装 grix-connector

首次进入 Grix 桌面版的「系统」页面时：

- Grix **自动检测并安装** grix-connector
- 安装完成后自动启动
- 无需手动配置任何参数

### 第 4 步：一键添加 Agent

1. 进入「系统」页面，在 Agent 工具栏中选择你想使用的 Agent 类型（如 Claude、Gemini、Qwen 等）
2. 点击该类型图标 → 弹窗中点击「新增」
3. 输入名称 → 点击「创建」

Grix 自动完成：
- ✅ 在服务端注册 Agent
- ✅ 配置本地连接参数
- ✅ 启动 Agent 进程
- ✅ 打开与 Agent 的对话窗口

**此时你已经可以和 Agent 对话了。**

### 第 5 步：手机端同步使用

在手机上安装 Grix（iOS / Android），用同一账号登录后：

- 自动看到所有已创建的 Agent
- 可以直接与 Agent 对话
- 可以接收审批请求、语音来电等通知
- 手机上**无需安装任何 CLI 工具**，Agent 运行在你的电脑上

> 💡 **核心理解**：Agent 跑在电脑上，手机通过 Grix 平台远程交互。桌面版负责运行，手机负责随时随地使用。

## 方式二：直接安装 grix-connector

适用于不想安装桌面版 GUI，或需要在远程服务器上部署 Agent 的场景。

### 第 1 步：注册 Grix 账号

前往 [grix.dhf.pub](https://grix.dhf.pub)，注册账号并获取 API Key 和 Agent ID。

### 第 2 步：安装 grix-connector

```bash
# 需要 Node.js >= 18
npm install -g grix-connector
```

Windows 下 `grix-connector` 使用系统自带的任务计划程序，无需额外依赖。

### 第 3 步：创建 Agent 配置文件

创建 `~/.grix/config/agents.json`：

```json
{
  "agents": [
    {
      "name": "my-agent",
      "ws_url": "wss://grix.dhf.pub/v1/agent-api/ws",
      "agent_id": "你的-agent-id",
      "api_key": "你的-grix-api-key",
      "client_type": "claude"
    }
  ]
}
```

将 `client_type` 改为你想连接的 Agent 类型。你可以在同一文件中定义多个 Agent，也可以在 `~/.grix/config/` 下使用多个文件。

#### 支持的 Agent 类型

| `client_type` | Agent | 需要本地安装的 CLI |
|---|---|---|
| `claude` | Claude Code (Anthropic) | `claude` |
| `codex` | Codex (OpenAI) | `codex` |
| `copilot` | GitHub Copilot | `copilot` 或 `gh` |
| `gemini` | Gemini (Google) | `gemini` |
| `qwen` | Qwen (阿里) | `qwen` |
| `codewhale` | CodeWhale | `codewhale` |
| `cursor` | Cursor Agent | `agent` |
| `opencode` | OpenCode | `opencode` |
| `pi` | Pi | `pi` |
| `openhuman` | OpenHuman | `openhuman-core` |
| `reasonix` | Reasonix | `reasonix` |

> ⚠️ 连接 Agent 前需要确保本地已安装对应的 CLI 工具。grix-connector 会根据 `client_type` 自动查找并启动对应的 CLI。

#### 配置字段说明

| 字段 | 必填 | 说明 |
|---|---|---|
| `name` | 是 | Agent 显示名称 |
| `ws_url` | 是 | WebSocket 端点地址，如 `wss://grix.dhf.pub/v1/agent-api/ws` |
| `agent_id` | 是 | Grix 平台上的 Agent ID |
| `api_key` | 是 | 认证用的 API Key |
| `client_type` | 是 | 见上表支持的 Agent 类型 |
| `prompt_timeout_ms` | 否 | Prompt 执行超时时间（毫秒） |
| `pool.maxSize` | 否 | 最大适配器池大小（默认 20） |
| `pool.idleTimeoutMs` | 否 | 空闲适配器回收超时（默认 300000 = 5 分钟） |

#### 多 Agent 示例

```json
{
  "agents": [
    {
      "name": "my-claude",
      "ws_url": "wss://grix.dhf.pub/v1/agent-api/ws",
      "agent_id": "agent-id-1",
      "api_key": "your-api-key",
      "client_type": "claude"
    },
    {
      "name": "my-gemini",
      "ws_url": "wss://grix.dhf.pub/v1/agent-api/ws",
      "agent_id": "agent-id-2",
      "api_key": "your-api-key",
      "client_type": "gemini"
    }
  ]
}
```

### 第 4 步：启动 grix-connector

```bash
grix-connector start
```

启动后守护进程通过 WebSocket 连接到 Grix 平台，开始将聊天消息路由到你的 Agent。

### 常用命令

```bash
grix-connector start      # 启动为系统服务（首次运行自动安装）
grix-connector stop       # 停止服务
grix-connector restart    # 重启服务
grix-connector status     # 查看服务状态
```

## 两种方式的对比

| 对比项 | 桌面版（推荐） | 直接安装 connector |
|--------|--------------|-------------------|
| 安装复杂度 | 下载安装即可 | 需要命令行操作 |
| connector 管理 | 自动安装、启动、重启 | 手动管理 |
| 添加 Agent | 界面一键创建 | 编辑 JSON 配置文件 |
| Agent CLI 安装 | 自动检测和安装 | 需自行安装对应 CLI |
| 适合人群 | 所有用户 | 开发者、服务器部署 |
| 手机端使用 | ✅ 同账号即可 | ✅ 同账号即可 |
