---
title: "Chat Page"
description: "The chat page is Grix's core interaction interface, integrating messaging, AI conversations, voice calls, and group management."
order: 6
---

The chat page is Grix's core interaction interface, integrating messaging, AI conversations, voice calls, and group management.

## Message Input and Sending

- Text messages + Emoji
- **@Mention members** — Type `@` to trigger the selection list; supports @everyone
- **Quote reply** — Long-press a message and select "Quote"
- **Send queue** — Send multiple messages in sequence; view or delete from the queue panel
- **Silent send** — Send without triggering an agent reply, useful for adding context

## Attachments and Media

| Type | Source |
|------|--------|
| Images | Gallery / Camera / Desktop drag-and-drop / Paste |
| Video | Up to 50MB |
| Files | Common document and archive formats |
| Remote files | Browse the agent host's file system |

### Grix Image Editor

Edit before uploading: crop, draw, arrows, circles, rectangles, text annotations. Supports undo, zoom, and line width/font size adjustments.

## Message Actions

Long-press/right-click a message: Copy / Quote / Forward (individual/combined/multi-select) / Recall.

## Grix AI Conversation Features

### AI Delegated Reply

1. Click "Delegate to AI" → Select an agent → Set turn count
2. The agent automatically replies to incoming messages
3. The top status bar shows delegation status; stop anytime

### Real-Time Streaming Output

Agent responses appear character by character. Click "Stop" to interrupt.

### Agent Thinking Process

A collapsible card shows the AI reasoning chain. Click to expand.

### Tool Execution Card

When an agent calls a tool, a structured card displays the tool name, parameters, and results.

### Execution Approval Card

Before executing a command, the agent pushes an approval request: **Allow once** / **Always allow** / **Deny**. Approvals have an expiration time and auto-expire.

### Agent Input Request

When an agent needs user input, a Q&A card appears: Quick buttons / Text input / OAuth redirect.

### Agent Status

🟢 Online / 🔴 Offline (prompts to check computer and connector) / ⏳ Thinking

## Grix Voice Calls

### Basic Operations

Start call / Answer / Decline / Mute / Speaker / Hang up / Minimize

### AI Answering (Key Feature)

1. **AI Answer Incoming** — When a call comes in, choose an AI agent to answer
2. **Voice Delegation** — Once enabled, all incoming calls are auto-answered by AI
3. **Human Takeover** — Take over the call at any time
4. **Return to AI** — After taking over, you can hand the call back to AI

### Call History

Records all call history: status, duration, AI answering indicator.

## Group Chat Management

- Invite friends / Group member list
- Set/remove admins / Transfer ownership / Remove members
- Mute all / Mute individual / Speaking whitelist
- Agent message receiving mode: Normal / @mention only
- Group nickname / Group QR code / Leave / Dissolve / Report

## Conversation-Level Features

- **Rename conversation** — Leave empty to auto-use the first message summary
- **Notification toggle** — Individual do-not-disturb
- **Webhook management** — Create a webhook for the conversation; external HTTP POST pushes messages
- **Token usage** — 5h/7d usage stats, balance, context compression
