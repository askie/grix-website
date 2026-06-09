---
title: "Quick Start"
description: "Go from zero to chatting with an AI agent in just a few minutes. This chapter gets you started with Grix the fastest way possible."
order: 2
---

This chapter helps you get started with Grix as quickly as possible — from zero to chatting with an AI agent in minutes.

## Two Ways to Get Started

| Method | Best For | Difficulty |
|--------|----------|------------|
| Option 1: Install Grix Desktop | Recommended, easiest | ⭐ Easy |
| Option 2: Install grix-connector directly | Headless servers, or you prefer not to install an extra app | ⭐⭐ Manual setup |

## Option 1: Install Grix Desktop (Recommended)

This is the fastest path. After installing the desktop app, Grix automatically installs and manages grix-connector — everything happens within the UI.

### Step 1: Download and Install

| Platform | Instructions |
|----------|-------------|
| macOS | Download `.dmg`, drag to Applications |
| Windows | Download `.exe` installer, double-click to install |
| Linux | Download `.AppImage` or the appropriate package format |

### Step 2: Sign Up / Log In

Open Grix Desktop and sign up for a new account or log in with an existing one.

### Step 3: Auto-Install grix-connector

When you first visit the "System" page in Grix Desktop:

- Grix **automatically detects and installs** grix-connector
- It starts automatically after installation
- No manual configuration needed

### Step 4: Add an Agent with One Click

1. Go to the "System" page and select the agent type you want (e.g., Claude, Gemini, Qwen, etc.)
2. Click the type icon → click "New" in the dialog
3. Enter a name → click "Create"

Grix automatically:
- ✅ Registers the agent on the server
- ✅ Configures local connection parameters
- ✅ Starts the agent process
- ✅ Opens a conversation with the agent

**You can now chat with your agent.**

### Step 5: Use on Your Phone

Install Grix on your phone (iOS / Android) and log in with the same account:

- All your agents appear automatically
- You can chat with agents directly
- You receive approval requests, voice calls, and other notifications
- No CLI tools needed on your phone — agents run on your computer

> 💡 **Key concept**: Agents run on your computer. Your phone interacts with them remotely through the Grix platform. Desktop handles execution, phone handles anywhere-anytime access.

## Option 2: Install grix-connector Directly

Use this if you don't want the desktop GUI, or need to deploy agents on a remote server.

### Step 1: Register a Grix Account

Go to [grix.dhf.pub](https://grix.dhf.pub), sign up and get your API key and Agent ID.

### Step 2: Install grix-connector

```bash
# Requires Node.js >= 18
npm install -g grix-connector
```

On Windows, `grix-connector` uses the built-in Task Scheduler (no extra dependency required).

### Step 3: Create Agent Config

Create `~/.grix/config/agents.json`:

```json
{
  "agents": [
    {
      "name": "my-agent",
      "ws_url": "wss://grix.dhf.pub/v1/agent-api/ws",
      "agent_id": "your-agent-id",
      "api_key": "your-grix-api-key",
      "client_type": "claude"
    }
  ]
}
```

Change `client_type` to match the agent you want to connect (see table below). You can define multiple agents in one file, or use separate files under `~/.grix/config/`.

#### Supported Agent Types

| `client_type` | Agent | Required CLI |
|---|---|---|
| `claude` | Claude Code (Anthropic) | `claude` |
| `codex` | Codex (OpenAI) | `codex` |
| `copilot` | GitHub Copilot | `copilot` or `gh` |
| `gemini` | Gemini (Google) | `gemini` |
| `qwen` | Qwen (Alibaba) | `qwen` |
| `codewhale` | CodeWhale | `codewhale` |
| `cursor` | Cursor Agent | `agent` |
| `opencode` | OpenCode | `opencode` |
| `pi` | Pi | `pi` |
| `openhuman` | OpenHuman | `openhuman-core` |
| `reasonix` | Reasonix | `reasonix` |

> ⚠️ Make sure the corresponding CLI tool is installed locally before connecting an agent. grix-connector will automatically find and launch the CLI based on `client_type`.

#### Config Reference

| Field | Required | Description |
|---|---|---|
| `name` | yes | Display name for this agent |
| `ws_url` | yes | WebSocket endpoint URL, e.g. `wss://grix.dhf.pub/v1/agent-api/ws` |
| `agent_id` | yes | Agent ID from Grix platform |
| `api_key` | yes | API key for authentication |
| `client_type` | yes | See Supported Agents table above |
| `prompt_timeout_ms` | no | Prompt execution timeout (ms) |
| `pool.maxSize` | no | Max adapter pool size (default 20) |
| `pool.idleTimeoutMs` | no | Idle adapter eviction timeout (default 300000 = 5 min) |

#### Multi-Agent Example

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

### Step 4: Start grix-connector

```bash
grix-connector start
```

The daemon connects to Grix via WebSocket and starts routing chat messages to your agents.

### Commands

```bash
grix-connector start      # Start as system service (auto-installs on first run)
grix-connector stop       # Stop the service
grix-connector restart    # Restart the service
grix-connector status     # Check service status
```

## Comparison

| Aspect | Desktop (Recommended) | Direct connector |
|--------|----------------------|-----------------|
| Installation complexity | Download and install | Requires command line |
| Connector management | Auto install, start, restart | Manual management |
| Adding agents | One-click in UI | Edit JSON config file |
| Agent CLI install | Auto-detect and install | Install corresponding CLI yourself |
| Best for | All users | Developers, server deployments |
| Mobile usage | ✅ Same account | ✅ Same account |
