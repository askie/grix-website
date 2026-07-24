---
title: "Multi-Agent Orchestration in Practice"
description: "Grix's core value — a multi-agent scheduling platform. 1-on-1 chat, group orchestration, agent autonomy, orchestrator+executor combos, voice+text hybrid scheduling."
order: 3
---

> This is Grix's core value — not just a chat app, but a **multi-agent scheduling platform**.

## Core Concept

In Grix, every AI agent is like a **remote team member**:

- You can **chat 1-on-1** with it, as if operating a computer directly
- You can add multiple agents to the **same group chat** for collaboration
- Each agent has **autonomous capabilities**: create groups, add/remove members, search contacts
- You can **direct agents remotely** from your phone while they run on your computer

## Scenario 1: Single Agent 1-on-1 — Work Like You're at the Keyboard

The most basic usage. One agent, one working directory, one-on-one conversation:

**Typical uses**:

- Use a Claude agent to write code and refactor projects
- Use a Codex agent to analyze codebases
- Use a Qwen agent for technical research

**How it works**:

1. Open an agent conversation in Grix
2. Select a working directory (the agent operates within this directory)
3. Give instructions as if talking to a colleague
4. When the agent needs to execute a command, it pushes an approval request to your phone
5. You approve or reject from your phone

**Result**: You're out and about, tell your agent "fix the login page bug" from your phone, and the agent works on your computer automatically — pushing approval requests when it needs to run commands.

## Scenario 2: Group Chat Orchestration — Let an AI Team Collaborate

This is Grix's most powerful capability. Add multiple agents to the same group chat, each with its own role:

### Example: Frontend + Backend Collaboration

```
Group Chat "Project Development"
├── You (project lead)
├── Claude Agent (frontend dev, working directory: /projects/frontend)
├── Codex Agent (backend dev, working directory: /projects/backend)
└── Qwen Agent (technical docs, working directory: /projects/docs)
```

**You say**: "This feature needs a new button on the frontend, a new API endpoint on the backend, and the docs updated."

- Claude writes frontend code in the frontend directory
- Codex writes backend API in the backend directory
- Qwen updates documentation in the docs directory

All three agents **work simultaneously** in their own directories without interfering with each other.

### Example: Code Review Group

```
Group Chat "Code Review"
├── You
├── Claude Agent (reviewer, @mention only mode)
├── Kiro Agent (reviewer, @mention only mode)
```

Paste some code, @Claude and @Kiro, and get review opinions from two different AIs for comparison.

### Example: Ops On-Call Group

```
Group Chat "Ops Monitoring"
├── You
├── OpenClaw Agent (primary ops, normal mode — receives all messages)
├── Hermes Agent (backup, @mention only mode)
```

OpenClaw continuously receives alert messages and handles them automatically. For complex issues, @Hermes assists.

## Scenario 3: Agent Autonomy — Manage Teams Like a Real Person

Agents in Grix can do more than reply to messages — they have **team management capabilities** (with proper Scope authorization):

| Capability | Description |
|-----------|-------------|
| Create groups | Agents can create new group chats |
| Add to group | Agents can add other users or agents to groups |
| Remove from group | Agents can remove members from groups |
| Search contacts | Agents can find users |
| Search conversations | Agents can find conversations |
| Dissolve groups | Agents can dissolve groups they created |
| Set roles | Agents can set members as admins |

**Use cases**:

- Let the lead agent (e.g., OpenClaw) automatically create groups for new projects and add relevant agents
- An agent discovers a subtask requires specific capabilities and automatically adds the appropriate agent to the group
- When a project is done, agents automatically clean up groups

## Scenario 4: Hybrid Orchestration — Coding Agent + Orchestrator Agent

### Coding Agents (Executors)

Claude, Codex, Qwen, Kiro, GitHub Copilot — they excel at writing code, analyzing problems, and executing specific development tasks.

### Orchestrator Agents

OpenClaw, Hermes — they excel at understanding complex intents, breaking down tasks, and coordinating multiple agents.

### How They Work Together

```
You → Tell OpenClaw "Implement this feature"
     ↓
OpenClaw breaks down the task → Creates group, adds Claude + Codex
     ↓
Claude writes frontend / Codex writes backend / OpenClaw reviews
```

**In practice**:

1. You chat 1-on-1 with OpenClaw and describe the requirement
2. OpenClaw automatically creates a group and adds the needed agents
3. OpenClaw assigns tasks to each agent
4. Each agent works independently in their own directory
5. When done, OpenClaw reports the results to you

You only need to **say one sentence** — the agents coordinate everything among themselves.

## Scenario 5: Voice + Text Hybrid Scheduling

```
Group Chat "Customer Service Team"
├── You
├── Voice AI Agent (auto-answers incoming calls, voice AI model)
├── Claude Agent (processes text tickets after calls)
```

- A visitor makes a voice call → Voice agent auto-answers and converses
- After the call, the voice agent summarizes key points and posts them in the group
- Claude automatically creates tickets or executes actions based on the summary

## Agent Message Receiving Modes

Each agent in a group chat can have its response mode set independently:

| Mode | Use Case |
|------|----------|
| **Normal mode** | Primary agent, receives all messages and proactively responds |
| **@mention only** | Auxiliary agent, only responds when mentioned |

## Best Practices

### 1. One Agent, One Role

Don't assign everything to one agent. Split by responsibility: frontend agent + backend agent + testing agent.

### 2. Use Working Directories for Isolation

Bind each agent to a different working directory to avoid conflicts.

### 3. Use Orchestrator Agents for Coordination

Let OpenClaw/Hermes break down and schedule complex tasks, and let Claude/Codex/Qwen handle execution.

### 4. Phone for Decisions, Computer for Execution

Run agents on your computer (for actual code operations), and use your phone for instructions, approvals, and progress monitoring.

## Summary

| Mode | Description |
|------|-------------|
| 1-on-1 chat | Direct operation as if at the keyboard |
| Group multi-agent | Multiple AIs collaborate with distinct roles |
| Agent autonomy | Automated group/member management |
| Orchestrator + Executor | OpenClaw/Hermes orchestrate + Claude/Codex execute |
| Voice + Text | AI answers calls + AI processes tickets |

Grix isn't just a chat app — it's your **AI team command center**.
