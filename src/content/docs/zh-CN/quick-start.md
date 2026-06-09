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

| 平台 | 下载说明 |
|------|---------|
| macOS | 下载 `.dmg`，拖入 Applications |
| Windows | 下载 `.exe` 安装包，双击安装 |
| Linux | 下载 `.AppImage` 或对应包格式 |

### 第 2 步：注册/登录 Grix 账号

打开 Grix 桌面版，注册新账号或使用已有账号登录。

### 第 3 步：自动安装 grix-connector

首次进入 Grix 桌面版的「系统」页面时：

- Grix **自动检测并安装** grix-connector
- 安装完成后自动启动
- 无需手动配置任何参数

### 第 4 步：一键添加 Agent

1. 进入「系统」页面，在 Agent 工具栏中选择你想使用的 Agent 类型（如 Claude、OpenClaw、Kiro 等）
2. 点击该类型图标 → 弹窗中点击「新增」
3. 输入名称 → 点击「创建」

Grix 自动完成：
- ✅ 安装对应 Agent CLI（首次自动安装）
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

### 第 1 步：安装 grix-connector

```bash
# macOS / Linux
npm install -g grix-connector
```

### 第 2 步：在 Grix 中创建 Agent

在 Grix 的任意客户端（Web / 手机 / 桌面）：

1. 进入「AI」标签页 → 点击「+」创建 Agent
2. 填写名称，Provider 类型选择「Agent API」
3. 选择接入类型（Claude / OpenClaw / Hermes 等）
4. 保存后获取三项凭证：Agent ID、服务 Endpoint（WebSocket 地址）、密钥（API Key）

### 第 3 步：安装 Agent CLI

在目标电脑上安装对应的 Agent CLI 工具：

```bash
# 示例：安装 Claude Agent
npm install -g @dhf-claude/grix

# 示例：安装 OpenClaw Agent
npm install -g @dhf-openclaw/grix
```

### 第 4 步：手动配置连接参数

使用第 2 步获取的凭证配置 Agent：

```bash
grix-claude install \
  --ws-url <服务 Endpoint> \
  --agent-id <Agent ID> \
  --api-key <密钥>
```

### 第 5 步：启动 grix-connector

```bash
grix-connector start
```

启动后 Agent 自动连接 Grix 平台，状态变为在线。

## 两种方式的对比

| 对比项 | 桌面版（推荐） | 直接安装 connector |
|--------|--------------|-------------------|
| 安装复杂度 | 下载安装即可 | 需要命令行操作 |
| connector 管理 | 自动安装、启动、重启 | 手动管理 |
| 添加 Agent | 界面一键创建 | 需手动获取凭证并配置 |
| Agent CLI 安装 | 自动检测和安装 | 手动 npm install |
| 适合人群 | 所有用户 | 开发者、服务器部署 |
| 手机端使用 | ✅ 同账号即可 | ✅ 同账号即可 |
