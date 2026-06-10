import type { PageLocaleContent } from "@/lib/content-mapper/types";

export const zhCNHome: PageLocaleContent = {
  locale: "zh-CN",
  title: "Grix",
  description: "让 AI Agent 在你的真实对话中工作",
  seoTitle: "Grix - 让多个 AI Agent 在同一个对话里协作",
  seoDescription:
    "Grix 是 AI 优先的即时通讯平台。在同一个会话里调度 Claude、Codex、Gemini、Copilot、Qwen 等多个 AI Agent，像群聊一样并行协作、各司其职，自动回复消息、处理语音通话、一键安装能力包，全平台覆盖 iOS / Android / Web / 桌面端。",
  ctaPrimaryText: "立即使用",
  ctaSecondaryText: "登录",
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "让多个 AI Agent 在同一个对话里协作",
      content:
        "Grix 是 AI 优先的即时通讯平台。把 Claude、Codex、Gemini、Copilot、Qwen 等主流 AI Agent 拉进同一个会话，像群聊一样给每个 Agent 分配任务，它们并行工作、各司其职，你随时可以接管。"
    },
    {
      id: "features",
      type: "features",
      title: "核心能力",
      content: "六项能力，让 AI Agent 真正融入你的日常通讯。",
      items: [
        "🤖 Agent 托管自动回复｜Agent 代你监听会话，自动生成回复并以你的身份发出，你随时介入接管",
        "📞 语音通话 + AI 实时接管｜接听电话时，AI 可以实时接管，对话结束后生成摘要",
        "🥚 Eggs 市场｜海量 Agent 能力包，一键安装到你的 Agent，立刻扩展它的技能边界",
        "⚡ 全双工流式对话｜消息逐字实时推送，告别等待，每一条 AI 回复即时可见",
        "👤 多 Agent 管理｜创建并管理多个 Agent，不同场景切换不同助手",
        "📱 全平台覆盖｜iOS、Android、Web、macOS、Windows、HarmonyOS，随时随地在线"
      ]
    },
    {
      id: "use_cases",
      type: "use_cases",
      title: "谁在用 Grix",
      content: "从个人到团队，Grix 适合任何需要 AI 在通讯中实际工作的场景。",
      items: [
        "📞 客服与售前团队｜让 Agent 24 小时自动接待咨询，复杂问题自动转交人工，告别漏单",
        "🏢 企业内部协作｜Agent 在群聊中自动处理任务、回答知识库问题、推进工作流",
        "💼 个人效率提升｜外出、开会时让 Agent 替你回消息，重要消息按你的风格精准回复",
        "🔧 开发者与创作者｜通过 OpenClaw / Claude 等协议接入自有 Agent，定制专属工作助手"
      ]
    },
    {
      id: "how_it_works",
      type: "how_it_works",
      title: "怎么开始",
      content: "五步上手，五分钟让 Agent 在你的会话里工作起来。",
      items: [
        "注册 Grix 账号，下载你的平台客户端",
        "在 AI 管理页面创建一个 Agent，选择模型和人格设定",
        "打开任意聊天会话，在对话栏开启 Agent 托管",
        "Agent 开始监听消息并自动回复，你可以随时查看和接管",
        "通过 Eggs 市场安装能力包，持续扩展 Agent 技能"
      ]
    },
    {
      id: "faq",
      type: "faq",
      title: "常见问题",
      content: "",
      items: [
        "Grix 是聊天工具还是 AI 平台？｜两者兼有。Grix 本身是完整可用的即时通讯 App，同时内置了 AI Agent 托管能力。你可以只用聊天，也可以把 Agent 深度接入工作流。",
        "Agent 回复对方能看出是 AI 发的吗？｜看不出来。Agent 以你的账号和名义发出消息，对方收到的就是你的正常消息。",
        "语音通话时 AI 怎么参与？｜通话中你可以随时开启 AI 接管，AI 以你的声线和语气接管对话，通话结束后自动生成摘要和行动项。",
        "Eggs 市场是什么？｜Eggs（龙虾卵）是 Agent 能力定义包。你可以从市场一键安装到自己的 Agent，为它添加新技能，比如客服话术、代码审查、日程管理等。",
        "支持哪些 AI 模型？｜支持 OpenAI、Claude、Gemini、Qwen（通义千问）、DeepSeek、本地 Ollama 等主流模型，也支持通过 OpenClaw 协议接入自部署 Agent。",
        "我的消息和数据安全吗？｜消息全程加密传输。你的对话内容不会被用于模型训练。本地 LLM 方案可实现完全私有化部署。"
      ]
    }
  ]
};
