import type { PageLocaleContent } from "@/lib/content-mapper/types";

export const zhCNHome: PageLocaleContent = {
  locale: "zh-CN",
  title: "Grix",
  description: "把你的 AI Agent 变成一支会自我组织的团队",
  seoTitle: "Grix — AI Agent 的组织层",
  seoDescription:
    "Grix 是 AI Agent 的组织层。把 Codex 或 Claude 变成开发、审查、测试和管理团队，再接入 Hermes、OpenClaw、Pi 等通用 Agent，从手机监督授权范围内的工作。",
  ctaPrimaryText: "组建你的 Agent 团队",
  ctaSecondaryText: "登录",
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "把你的 AI Agent 变成一支会自我组织的团队",
      content:
        "给一个主管 Agent 一个目标。它会组建合适的岗位、观察工作、打通阻塞的会话，只把真正需要你判断的事项带回来。"
    },
    {
      id: "features",
      type: "features",
      title: "为 Agent 工作提供组织层",
      content: "持久角色、任务委派、任务状态、权限和升级路径——所有过程都在工作发生的会话里可见。",
      items: [
        "🧭 主管 Agent 委派｜给主管 Agent 一个目标，它会找到合适的 Agent、创建协作空间并跟进交接",
        "🧩 岗位化团队｜用你已经在使用的 Agent 创建开发、审查、测试、研究或项目管理等角色",
        "👀 全程可观察｜Agent 建立的群组、发送的消息、委派的任务和发现的阻塞都在 IM 中可见，你可随时停止、介入或接管",
        "🔐 按权限巡视｜Chief of Staff 只监控你明确授权的会话，遇到需要判断的事项再向你升级",
        "📞 需要判断时再汇报｜收到简洁摘要或语音呼叫后，把你的决定送回原会话继续推进",
        "↔️ 一个会话，两端续接｜在电脑和 Grix 之间继续同一个 Agent 会话，完整保留上下文"
      ]
    },
    {
      id: "use_cases",
      type: "use_cases",
      title: "从你已经付费的订阅开始",
      content: "一份符合条件的 Codex 或 Claude 订阅就能组建团队。需要更广覆盖时，再加入其他 Agent 家族处理开发、研究、沟通和运营。",
      items: [
        "💻 独立开发者｜用一份 coding 订阅创建开发、审查、QA 和管理岗位，不需要另建按量 API 编排栈",
        "🛠️ 小型创始团队｜让产品、客户和交付会话持续推进，Agent 负责并行工作",
        "🌐 通用 Agent 用户｜把 Hermes、OpenClaw、Pi 等接入同一个组织，承担研究、沟通和运营",
        "📱 离开电脑也能工作｜在 Grix 中审批、调整方向或接管，电脑继续运行 Agent 任务"
      ]
    },
    {
      id: "how_it_works",
      type: "how_it_works",
      title: "从一个目标到协同工作",
      content: "用一个简单的工作循环，替代逐条追踪每个会话和阻塞。",
      items: [
        "连接你已经在运行的 coding Agent 或通用 Agent",
        "给主管 Agent 一个目标，让它创建岗位和协作空间",
        "在一个可见的组织中观察工作、交接和授权范围内的会话",
        "查看汇报，或回答升级到你这里的关键决定",
        "主管 Agent 回到对应会话，带着你的决定继续推进"
      ]
    },
    {
      id: "faq",
      type: "faq",
      title: "常见问题",
      content: "",
      items: [
        "Grix 是另一个多模型聊天 App 吗？｜不是。模型只是入口，Grix 增加的是组织层：让 Agent 拥有持久角色、队友、权限和向主人升级决策的路径。",
        "必须同时订阅 Codex 和 Claude 吗？｜不需要。一份符合条件的 Codex 或 Claude 订阅就能创建岗位化团队，多份订阅只是增加跨供应商选择。",
        "我能看到 Agent 在做什么吗？｜可以。它创建的群组、发送的消息、委派的任务和发现的阻塞都会在 IM 中可见，你可随时停止、介入或接管。",
        "Chief of Staff 会读取所有对话吗？｜只会读取你明确授权的会话。你可以随时撤销权限、暂停 Agent 或接管。",
        "支持哪些 Agent？｜目前已支持 16 个 Agent 家族，包括 Claude、Codex、Kimi、Hermes、OpenClaw、Pi 等，并会持续扩展。",
        "离开电脑后还能继续工作吗？｜可以。在电脑和 Grix 之间继续同一个 Agent 会话，完整保留上下文。"
      ]
    }
  ]
};
