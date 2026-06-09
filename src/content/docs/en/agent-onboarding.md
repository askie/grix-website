---
title: "Agent Integration Guide"
description: "Detailed guide on integrating various AI agents (Claude, OpenClaw, Codex, Gemini, etc.) into the Grix platform."
order: 16
---

Detailed guide on integrating various AI agents into the Grix platform.

## Supported Agent Types

| Type | CLI Command |
|------|-------------|
| OpenClaw | `openclaw` |
| Claude | `claude` |
| Codex | `codex` |
| Gemini | `gemini` |
| Qwen | `qwen` |
| Pi | `pi` |
| Hermes | `hermes` |
| Reasonix | `reasonix` |
| CodeWhale | `codewhale` |
| OpenCode | `opencode` |
| Kiro | `kiro-cli` |
| GitHub Copilot | `gh` |

## Prerequisites

1. **grix-connector** installed and running (desktop app handles this automatically)
2. **System dependencies**: Node.js >= 18 / Go >= 1.21 (varies by agent type)

## Option 1: Desktop One-Click Integration (Recommended)

1. Go to the "System" page and confirm the connector is running
2. Click the agent type icon — CLI is auto-installed on first use
3. Click "New" → Enter a name → "Create"
4. Grix auto-registers + configures + starts + opens conversation

## Option 2: Manual Integration

1. Create an agent in the Grix "AI" tab (select Agent API type)
2. After saving, get: Agent ID / Endpoint / API Key
3. Install the CLI on the target machine and configure:

```bash
# Claude example
npm install -g @dhf-claude/grix
grix-claude install --ws-url <Endpoint> --agent-id <ID> --api-key <Key>

# OpenClaw example
npm install -g @dhf-openclaw/grix

# Codex example
npm install @dhf-codex/grix
grix-codex agent --agent-id <ID> --endpoint <Endpoint> --api-key <Key>
```

4. Start grix-connector — the agent comes online

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent shows offline | Check computer is on, connector is running, network is connected |
| Key compromised | Go to agent edit page → "Reset Key", reconfigure with new key |
| Command not found | Restart terminal or add install path to PATH |
| npm permission error | `sudo npm install -g` or modify npm prefix |
