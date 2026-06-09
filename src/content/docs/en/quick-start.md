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

1. Go to the "System" page and select the agent type you want (e.g., Claude, OpenClaw, Kiro, etc.)
2. Click the type icon → click "New" in the dialog
3. Enter a name → click "Create"

Grix automatically:
- ✅ Installs the agent CLI (first-time auto-install)
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

### Step 1: Install grix-connector

```bash
# macOS / Linux
npm install -g grix-connector
```

### Step 2: Create an Agent in Grix

From any Grix client (Web / mobile / desktop):

1. Go to the "AI" tab → click "+" to create an agent
2. Enter a name, select "Agent API" as the provider type
3. Choose the integration type (Claude / OpenClaw / Hermes, etc.)
4. Save and get three credentials: Agent ID, Endpoint (WebSocket URL), API Key

### Step 3: Install the Agent CLI

Install the corresponding agent CLI tool on the target computer:

```bash
# Example: Install Claude Agent
npm install -g @dhf-claude/grix

# Example: Install OpenClaw Agent
npm install -g @dhf-openclaw/grix
```

### Step 4: Configure Connection Parameters

Configure the agent using the credentials from Step 2:

```bash
grix-claude install \
  --ws-url <Endpoint> \
  --agent-id <Agent ID> \
  --api-key <API Key>
```

### Step 5: Start grix-connector

```bash
grix-connector start
```

Once started, the agent automatically connects to the Grix platform and appears online.

## Comparison

| Aspect | Desktop (Recommended) | Direct connector |
|--------|----------------------|-----------------|
| Installation complexity | Download and install | Requires command line |
| Connector management | Auto install, start, restart | Manual management |
| Adding agents | One-click in UI | Manual credential setup |
| Agent CLI install | Auto-detect and install | Manual npm install |
| Best for | All users | Developers, server deployments |
| Mobile usage | ✅ Same account | ✅ Same account |
