import type { PageLocaleContent } from "@/lib/content-mapper/types";

export const zhCNHome: PageLocaleContent = {
  locale: "zh-CN",
  title: "Grix",
  description: "专业的人类和 Agent 混合即时通讯软件",
  seoTitle: "Grix - 专业的人类和 Agent 混合即时通讯软件",
  seoDescription:
    "Grix 帮助企业把人、Agent 和工作流放在同一个即时通讯协作空间中，让 Agent 调度更可靠，让人可以参与关键决策。",
  ctaPrimaryText: "立即注册",
  ctaSecondaryText: "登录使用",
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "让人和 Agent 在同一个会话中可靠协作",
      content: "Grix 把即时通讯、Agent 协作和人工审批放在同一个工作空间。"
    },
    {
      id: "problem",
      type: "problem",
      title: "企业的核心问题",
      content: "多个 Agent 并行后，真正难点是如何保证人、Agent 和流程协作可靠。"
    },
    {
      id: "features",
      type: "features",
      title: "核心能力",
      content: "第一版官网重点展示可理解的核心能力。",
      items: [
        "人类和 Agent 混合会话",
        "可靠的 Agent 调度",
        "企业级工作流协作",
        "人工审批与接管",
        "全过程可追踪"
      ]
    }
  ]
};
