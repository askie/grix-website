---
title: "Agent Toolbar"
description: "Desktop-only feature for centralized visual management of all local agents — status, probe details, and operations."
order: 18
---

Desktop-only feature for centralized visual management of all local agents.

## Display Modes

| Mode | Location | Description |
|------|----------|-------------|
| Compact | Top of message list | Row of small icons + count badges |
| Full | System page | Card layout with text labels |

## Agent Status

- 🟢 Healthy/Ready — Process running, conversation channel connected
- 🟡 Degraded/Busy — Processing a task
- 🔴 Error/Offline — Not started or connection lost
- ⚪ Not installed

## Click Actions

Click an agent type icon to open a detail dialog:

### Instance List

Each agent shows: Name, status, adapter type, pool status.

### Probe Details

```
CLI: claude v1.2.3
Path: /usr/local/bin/claude
Process: Started · Running
Conversation: OK (120ms)
```

### Action Buttons

| Button | Function |
|--------|----------|
| New | Create a new agent instance of this type |
| Install | Shown when CLI is not installed |
| 🔄 Restart | Restart the agent process |
| 🗑️ Remove | Delete instance (requires confirmation) |

## New Agent Flow

"New" → Enter name → "Create" → Grix auto-registers + starts + opens conversation.

## Install CLI Flow

"Install" → Check dependencies → Install → Verify → Done. Prompts "Install Dependencies" when prerequisites are missing.
