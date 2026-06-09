---
title: "Group Chat Agent Working Directory"
description: "Set working directories for agents in Grix so they operate within specified paths. Supports remote file browser selection."
order: 19
---

Set working directories for agents in Grix so they operate within specified paths.

## What is a Working Directory

A working directory (cwd) is the root path where an agent performs operations. Once set, the agent reads/writes files and executes commands relative to this directory.

## When to Set

- **When creating a new conversation** — The agent proactively sends an "Open Working Directory" card
- **Agent-initiated request** — During work, an agent may request a directory change

## How to Set

### Manual Input

Enter a path in the card input field (e.g., `/Users/me/projects/my-app`) → Click "Submit Directory".

### Browse and Select

Click "Select Directory" → Use the remote file selector to browse the agent host's file system:

- Folder navigation
- Go up / Go to root
- Favorites (commonly used directories)
- Create new folder
- Click "Use Current Directory" to confirm

## Working Directories in Group Chats

### Independent per Agent

A group chat can have multiple agents, each bound to its own independent working directory without interfering with each other.

### Agent Message Receiving Mode

| Mode | Description |
|------|-------------|
| Normal mode | Receives all messages |
| @mention only | Only responds when @mentioned |

Find the agent in the group member list → Set the message receiving mode.

## Conversation List Grouped by Directory

```
📁 /projects/frontend    (2 conversations)
📁 /projects/backend     (1 conversation)
📁 No directory bound     (1 conversation)
```

Click a directory tag to filter the view.

## Notes

- The path must be a valid path on the agent's host machine
- The path cannot be empty
- Remote file system browsing is unavailable when the agent is offline
