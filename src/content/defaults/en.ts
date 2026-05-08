import type { PageLocaleContent } from "@/lib/content-mapper/types";

export const enHome: PageLocaleContent = {
  locale: "en",
  title: "Grix",
  description: "Professional human-agent hybrid messaging",
  seoTitle: "Grix - Professional human-agent hybrid messaging",
  seoDescription:
    "Grix helps teams bring people, agents, and workflows into one collaborative messaging space for more reliable agent operations.",
  ctaPrimaryText: "Get started",
  ctaSecondaryText: "Sign in",
  sections: [
    {
      id: "hero",
      type: "hero",
      title: "Reliable human-agent collaboration in one workspace",
      content: "Grix unifies messaging, agent coordination, and human approvals in one place."
    },
    {
      id: "problem",
      type: "problem",
      title: "The real challenge",
      content: "When teams use many agents, reliability between people, agents, and business flows becomes the key problem."
    },
    {
      id: "features",
      type: "features",
      title: "Core capabilities",
      content: "Version one focuses on clear and practical product value.",
      items: [
        "Human-agent mixed conversations",
        "Reliable agent orchestration",
        "Enterprise workflow collaboration",
        "Human approval and takeover",
        "Traceable collaboration records"
      ]
    }
  ]
};
