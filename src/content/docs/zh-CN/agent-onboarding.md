---
title: "Grix Agent 接入指南"
description: "详细介绍如何将 Claude、OpenClaw、Codex、Qwen 等各类 AI Agent 接入 Grix 平台。"
order: 16
---

详细介绍如何将各类 AI Agent 接入 Grix 平台。

## 支持的 Agent 类型

| 类型 | CLI 命令 |
|------|---------|
| OpenClaw | `openclaw` |
| Claude | `claude` |
| Codex | `codex` |
| Qwen | `qwen` |
| Pi | `pi` |
| Hermes | `hermes` |
| Reasonix | `reasonix` |
| CodeWhale | `codewhale` |
| OpenCode | `opencode` |
| Kiro | `kiro-cli` |
| GitHub Copilot | `gh` |

## 前置条件

1. **grix-connector** 已安装并运行（桌面版自动处理）
2. **系统依赖**：Node.js >= 18 / Go >= 1.21（按 Agent 类型）

## 方式一：桌面端一键接入（推荐）

1. 进入「系统」页面，确认 Connector 运行中
2. 点击 Agent 类型图标 → 首次自动安装 CLI
3. 点击「新增」→ 输入名称 → 「创建」
4. Grix 自动注册 + 配置 + 启动 + 打开会话

## 方式二：手动接入

1. 在 Grix「AI」页创建 Agent（类型选 Agent API）
2. 保存后获取：Agent ID / Endpoint / API Key
3. 在目标机器安装 CLI 并配置：

```bash
# Claude 示例
npm install -g @dhf-claude/grix
grix-claude install --ws-url <Endpoint> --agent-id <ID> --api-key <Key>

# OpenClaw 示例
npm install -g @dhf-openclaw/grix

# Codex 示例
npm install @dhf-codex/grix
grix-codex agent --agent-id <ID> --endpoint <Endpoint> --api-key <Key>
```

4. 启动 grix-connector，Agent 上线

## 常见问题

| 问题 | 解决 |
|------|------|
| Agent 显示离线 | 检查电脑开机、connector 运行、网络连通 |
| 密钥泄露 | Agent 编辑页「重置密钥」，用新密钥重新配置 |
| 命令找不到 | 重启终端或添加安装路径到 PATH |
| npm 权限问题 | `sudo npm install -g` 或修改 npm prefix |
