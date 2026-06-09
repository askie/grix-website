---
title: "Grix 跨平台特性"
description: "Grix 基于 Flutter 实现 7 平台全覆盖（iOS、Android、macOS、Windows、Linux、Web、鸿蒙），针对各平台深度适配。"
order: 14
---

Grix 基于 Flutter 实现 7 平台全覆盖，针对各平台深度适配。

## 平台特色

| 平台 | 特色能力 |
|------|---------|
| iOS | 推送、相机扫码、Apple 登录、CallKit |
| Android | 推送、相机扫码、Google 登录 |
| macOS | 系统托盘、Agent 工具栏、文件拖拽 |
| Windows | 系统托盘、Agent 工具栏、开机自启 |
| Linux | 系统托盘、Agent 工具栏 |
| Web (PWA) | 离线缓存、浏览器通知、SW |
| 鸿蒙 | 原生适配 |

## Web 端

PWA 支持（安装到桌面、离线缓存）、浏览器通知、文件拖拽上传。

## 桌面端

系统托盘、开机自启、Agent 工具栏、右键菜单、键盘快捷键、文件拖拽。

## 移动端

推送通知（APNs/FCM）、相机扫码、相册、全屏来电界面。

## 数据同步

- 本地 SQLite 缓存
- WebSocket 长连接实时同步
- 离线消息重连后自动补全
- 多设备间实时同步

## 版本更新

应用内检测新版本、强制/可选更新提示。
