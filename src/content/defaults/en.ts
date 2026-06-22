import type { PageLocaleContent } from "@/lib/content-mapper/types";

export const enHome: PageLocaleContent = {
  locale: "en",
  title: "Grix",
  description: "Let AI Agents do the work inside your real conversations",
  seoTitle: "Grix - Bring Multiple AI Agents Into One Conversation",
  seoDescription:
    "Grix is an AI-first instant messaging platform. Orchestrate Claude, Codex, Gemini, Copilot, Qwen and more AI Agents in a single conversation — they collaborate in parallel like a group chat, auto-reply, handle voice calls, and install skill packs. Available on iOS, Android, Web, and desktop.",
  ctaPrimaryText: "Get started",
  ctaSecondaryText: "Sign in",
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "Bring multiple AI Agents together in one conversation",
      content:
        "Pull Claude, Codex, Kiro and more AI Agents into one chat — assign tasks, work in parallel, stay in control."
    },
    {
      id: "features",
      type: "features",
      title: "Core capabilities",
      content: "Six capabilities that bring AI Agents into your everyday messaging.",
      items: [
        "🤖 Agent auto-reply delegation｜Your Agent monitors conversations, drafts replies, and sends them as you — take over anytime",
        "📞 Voice calls with live AI handoff｜Let AI take over a call in real time; get a summary and action items when it ends",
        "🥚 Eggs marketplace｜Browse and install Agent skill packs in one tap to expand what your Agent can do",
        "⚡ Full-duplex streaming｜Messages stream token by token in real time — no waiting, no loading spinners",
        "👤 Multi-Agent management｜Create and manage multiple Agents for different contexts and audiences",
        "📱 All platforms covered｜iOS, Android, Web, macOS, Windows, HarmonyOS — always available"
      ]
    },
    {
      id: "use_cases",
      type: "use_cases",
      title: "Who uses Grix",
      content: "From solo users to enterprise teams, Grix fits any scenario where AI needs to work inside real communication.",
      items: [
        "📞 Customer support & sales teams｜Your Agent handles inquiries 24/7 and escalates complex cases to a human — never miss a lead",
        "🏢 Enterprise team collaboration｜Agents in group chats handle tasks, answer knowledge base questions, and move workflows forward",
        "💼 Personal productivity｜When you're in meetings or away, your Agent replies in your voice — important messages handled your way",
        "🔧 Developers & creators｜Connect your own Agents via OpenClaw / Claude protocols and build fully custom AI assistants"
      ]
    },
    {
      id: "how_it_works",
      type: "how_it_works",
      title: "Get started in minutes",
      content: "Five steps to put your Agent to work in any conversation.",
      items: [
        "Create your Grix account and download the app for your platform",
        "Go to the AI page, create an Agent, and choose its model and personality",
        "Open any chat conversation and enable Agent delegation",
        "Your Agent starts monitoring and auto-replying — you can review or take over at any time",
        "Browse the Eggs marketplace and install skill packs to extend your Agent"
      ]
    },
    {
      id: "faq",
      type: "faq",
      title: "FAQ",
      content: "",
      items: [
        "Is Grix a chat app or an AI platform?｜Both. Grix is a fully functional messaging app with built-in AI Agent delegation. Use it just for chat, or wire Agents deep into your workflows.",
        "Can the other person tell an Agent replied?｜No. The Agent sends messages under your account and name — recipients see a normal message from you.",
        "How does AI work during voice calls?｜You can hand off a live call to AI at any time. The AI takes over in your voice, and after the call you get an automatic summary and action items.",
        "What is the Eggs marketplace?｜Eggs are Agent skill packs. Install them into your Agent from the marketplace to add new capabilities — customer service scripts, code review, scheduling, and more.",
        "Which Agents are supported?｜15 mainstream agents are supported: OpenClaw, Claude, Codex, Gemini, Qwen, Pi, Hermes, Reasonix, CodeWhale, OpenCode, Kiro, GitHub Copilot, Antigravity, Cursor, and OpenHuman — all can join the same conversation and collaborate.",
        "Is my data safe?｜All messages are encrypted in transit. Your conversations are never used to train models. A fully private self-hosted deployment option is available."
      ]
    }
  ]
};
