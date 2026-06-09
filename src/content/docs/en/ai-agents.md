---
title: "AI Agent Management"
description: "Create, manage, and configure various AI agents in Grix, including remote API, local LLM, and Agent API types."
order: 7
---

## Agent List

Go to the "AI" tab at the bottom of Grix to see all your agents:

- Tree-view categories (drag to reorder, create/rename/delete categories)
- Status: 🟢 Online / 🔴 Offline / ⭐ Primary
- Quick actions: Chat / View / Configure / Permissions

## Creating a Grix Agent

### Basic Information

Name (4–100 characters), description, avatar, category.

### Provider Types

| Type | Description |
|------|-------------|
| Remote API | OpenAI-compatible API |
| Local LLM | Local models like Ollama |
| Agent API | Claude/OpenClaw/Hermes/Codex/Gemini/Qwen/DeepSeek/Kiro/Copilot etc. |
| Voice AI Model | For voice call answering |

### Agent API Integration

After saving, Grix generates credentials: Agent ID, Endpoint, API Key. Follow the setup guide to configure.

### Key Management

- "Copy All" to copy credentials in one click
- "Reset Key" — old key immediately invalidated; connected agents will disconnect

## Agent Permission Configuration (Scope)

Fine-grained authorization: Create agents / Search conversations / Search contacts / Create groups / Add members / Remove members / Dissolve groups / Set roles / Manage speaking permissions / Category management.
