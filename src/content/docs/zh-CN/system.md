---
title: "Grix 系统页（桌面端）"
description: "桌面端专属的系统页，管理 grix-connector 连接器、Agent 工具栏、大模型提供商和系统设置。"
order: 12
---

仅 macOS / Windows / Linux 桌面端显示，管理本地 Agent 工具链和 grix-connector。

## grix-connector 连接器

| 信息 | 说明 |
|------|------|
| 运行状态 | 运行中 / 已停止 / 未安装 |
| 运行时间 | 已持续运行时间 |
| 版本 | 已安装/最新版本 |
| Agent 数量 | 当前管理的实例数 |

操作：启动 / 安装 / 更新 / 刷新。

## Agent 工具栏

按类型分组展示所有 Agent。

## 系统设置

- 关闭时最小化到托盘
- 开机自动启动
- 自动重启连接器

## 大模型提供商管理

为本地 Agent 配置 LLM 后端：添加/编辑/删除提供商、加载本地模型列表。

## Agent 安装器

自动检测依赖（Node.js >= 18 / Go >= 1.21）→ 缺失时引导安装 → 安装 Agent CLI → 校验。
