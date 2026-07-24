---
title: "Grix AI 智能体管理"
description: "在 Grix 中创建、管理和配置多种 AI Agent，包括远端 API、本地 LLM、Agent API 等类型。"
order: 7
---

## Agent 列表

进入 Grix 底部「AI」标签页，展示所有 Agent：

- 树形分类（拖拽排序、新建/重命名/删除分类）
- 状态：🟢 在线 / 🔴 离线 / ⭐ 主
- 快捷入口：会话 / 查看 / 配置 / 权限

## 创建 Grix Agent

### 基础信息

名称（4-100 字符）、介绍、头像、分类。

### Provider 类型

| 类型 | 说明 |
|------|------|
| 远端 API | OpenAI 兼容 API |
| 本地 LLM | Ollama 等本地模型 |
| Agent API | Claude/OpenClaw/Hermes/Codex/Qwen/DeepSeek/Kiro/Copilot 等 |
| 语音大模型 | 用于语音通话代接 |

### Agent API 接入

保存后 Grix 生成凭证：Agent ID、Endpoint、API Key。按安装指引配置。

### 密钥管理

- 「拷贝全部」一键复制凭证
- 「重置密钥」— 旧密钥立即失效，已连接 Agent 会掉线

## Agent 权限配置（Scope）

精细化授权：创建 Agent / 搜索会话 / 搜索联系人 / 建群 / 拉人 / 踢人 / 解散群 / 设角色 / 调发言权限 / 分类管理。
