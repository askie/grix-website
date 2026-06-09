---
title: "System Page (Desktop)"
description: "Desktop-only system page for managing grix-connector, the agent toolbar, LLM providers, and system settings."
order: 12
---

Available only on macOS / Windows / Linux desktop. Manages the local agent toolchain and grix-connector.

## grix-connector

| Info | Description |
|------|-------------|
| Status | Running / Stopped / Not installed |
| Uptime | Time since last start |
| Version | Installed / Latest version |
| Agent count | Currently managed instances |

Actions: Start / Install / Update / Refresh.

## Agent Toolbar

Displays all agents grouped by type.

## System Settings

- Minimize to tray on close
- Auto-start on boot
- Auto-restart connector

## LLM Provider Management

Configure LLM backends for local agents: Add/Edit/Delete providers, load local model lists.

## Agent Installer

Auto-detect dependencies (Node.js >= 18 / Go >= 1.21) → Guide installation if missing → Install Agent CLI → Verify.
