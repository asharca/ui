// beUI MIT sources pinned at 1e23f4b10a404c17d9649086cf561e152527e2de.
export const agentCatalog = [
  {
    "slug": "agent-message-bubble",
    "name": "Agent Message Bubble",
    "group": "AI 组件",
    "description": "消息气泡、分组和可折叠长内容。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils",
      "agent-internal-components-agents-message-context"
    ],
    "examples": [
      "agent-message-bubble"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-message",
    "name": "Agent Message",
    "group": "AI 组件",
    "description": "组合头像、正文、页脚与输入中状态，保留现有 Message 接口。",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils",
      "agent-internal-components-agents-message-context",
      "agent-message-bubble",
      "agent-message-scroller"
    ],
    "examples": [
      "agent-message"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-message-scroller",
    "name": "Agent Message Scroller",
    "group": "AI 组件",
    "description": "跟随流式消息、保留阅读位置和快速回到最新消息。",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-components-motion-preview-rail",
      "utils"
    ],
    "examples": [
      "agent-message-scroller"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-prompt-input",
    "name": "Agent Prompt Input",
    "group": "AI 组件",
    "description": "模型选择、附件动作与可自动增高的输入区域。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-motion-button-index",
      "agent-internal-components-motion-popover-morph",
      "agent-internal-components-motion-select",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [
      "agent-prompt-input"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-todo-list",
    "name": "Agent Todo List",
    "group": "AI 组件",
    "description": "任务进度、状态动画和完成后折叠。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-motion-action-swap-roll",
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [
      "agent-todo-list"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-code-block",
    "name": "Agent Code Block",
    "group": "AI 组件",
    "description": "逐行代码展示、高亮、复制与流式状态。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-agents-agent-code",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [
      "agent-code-block"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-approval-card",
    "name": "Agent Approval Card",
    "group": "AI 组件",
    "description": "计划审核与多步骤问答，结果由宿主管理。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-components-motion-action-swap-roll",
      "agent-internal-components-motion-button-index",
      "agent-internal-components-motion-checkbox",
      "agent-internal-components-motion-input",
      "agent-internal-components-motion-radio",
      "agent-internal-lib-ease",
      "utils",
      "agent-internal-components-agents-approval-card-types"
    ],
    "examples": [
      "agent-approval-card"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-file-diff",
    "name": "Agent File Diff",
    "group": "AI 组件",
    "description": "新增、删除与上下文行，展示待审查的文件变化。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-agents-agent-code",
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [
      "agent-file-diff"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-tool-result",
    "name": "Agent Tool Result",
    "group": "AI 组件",
    "description": "终端与请求结果，运行、成功和失败状态。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-agents-agent-code",
      "agent-internal-components-motion-action-swap-roll",
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [
      "agent-tool-result"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-streaming-response",
    "name": "Agent Streaming Response",
    "group": "AI 组件",
    "description": "组合流式正文、来源、反馈和重试操作。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-citations",
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [
      "agent-streaming-response"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-image-generation",
    "name": "Agent Image Generation",
    "group": "AI 组件",
    "description": "图像生成中的点阵反馈与成品过渡，不调用模型。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "agent-internal-lib-hooks-use-hover-capable",
      "utils"
    ],
    "examples": [
      "agent-image-generation"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-tool-approval",
    "name": "Agent Tool Approval",
    "group": "AI 组件",
    "description": "执行前确认、拒绝与权限范围选择。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-agents-agent-code",
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [
      "agent-tool-approval"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-citations",
    "name": "Agent Citations",
    "group": "AI 组件",
    "description": "引用标记、来源堆叠与可折叠来源列表。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-lib-ease",
      "agent-internal-lib-hooks-use-favicon",
      "utils",
      "agent-internal-safety"
    ],
    "examples": [
      "agent-citations"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-activity",
    "name": "Agent Activity",
    "group": "AI 组件",
    "description": "步骤、文本、搜索、工具与执行轨迹。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-agents-loading-states-thinking-shimmer",
      "agent-internal-components-agents-agent-disclosure",
      "agent-internal-lib-ease",
      "utils",
      "agent-internal-components-agents-agent-activity-activity-row",
      "agent-internal-components-agents-agent-activity-types"
    ],
    "examples": [
      "agent-activity"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-loading-states",
    "name": "Agent Loading States",
    "group": "AI 组件",
    "description": "思考微光、推理说明与进度展示。",
    "dependencies": [],
    "needs": [
      "agent-internal-components-agents-loading-states-agent-progress",
      "agent-internal-components-agents-loading-states-reasoning-text",
      "agent-internal-components-agents-loading-states-thinking-shimmer"
    ],
    "examples": [
      "agent-loading-states"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-sidebar",
    "name": "Agent Sidebar",
    "group": "AI 组件",
    "description": "会话、项目、资源树与菜单操作。",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-motion-popover-morph",
      "agent-internal-lib-ease",
      "agent-internal-lib-hooks-use-touch-capable",
      "utils",
      "agent-internal-components-motion-animated-sidebar"
    ],
    "examples": [
      "agent-sidebar"
    ],
    "wide": true,
    "ext": "tsx"
  },
  {
    "slug": "agent-chat-app",
    "name": "Agent Chat App",
    "group": "AI 组件",
    "description": "自动适配容器的 Agent 对话工作区。",
    "dependencies": [],
    "needs": [
      "agent-internal-components-motion-animated-sidebar",
      "utils",
      "agent-sidebar",
      "agent-message",
      "agent-message-bubble",
      "agent-message-scroller",
      "agent-prompt-input",
      "agent-streaming-response",
      "agent-todo-list",
      "safe-streamdown"
    ],
    "examples": [
      "agent-chat-app"
    ],
    "wide": true,
    "ext": "tsx"
  }
];
export const agentInternalEntries = [
  {
    "slug": "agent-internal-lib-ease",
    "name": "agent-internal-lib-ease",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-agents-message-context",
    "name": "agent-internal-components-agents-message-context",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-preview-rail",
    "name": "agent-internal-components-motion-preview-rail",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "agent-internal-lib-hooks-use-dismiss",
      "agent-internal-lib-hooks-use-hover-gesture",
      "agent-internal-lib-hooks-use-tap-gesture",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-lib-hooks-use-dismiss",
    "name": "agent-internal-lib-hooks-use-dismiss",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-lib-hooks-use-hover-gesture",
    "name": "agent-internal-lib-hooks-use-hover-gesture",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [
      "agent-internal-lib-touch"
    ],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-lib-touch",
    "name": "agent-internal-lib-touch",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-lib-hooks-use-tap-gesture",
    "name": "agent-internal-lib-hooks-use-tap-gesture",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-motion-button-index",
    "name": "agent-internal-components-motion-button-index",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [
      "agent-internal-components-motion-button-base",
      "agent-internal-components-motion-button-magnetic",
      "agent-internal-components-motion-button-metallic",
      "agent-internal-components-motion-button-stateful"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-button-base",
    "name": "agent-internal-components-motion-button-base",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "agent-internal-lib-hooks-use-hover-capable",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-lib-hooks-use-hover-capable",
    "name": "agent-internal-lib-hooks-use-hover-capable",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-motion-button-magnetic",
    "name": "agent-internal-components-motion-button-magnetic",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [
      "agent-internal-components-motion-magnetic",
      "agent-internal-components-motion-button-base"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-magnetic",
    "name": "agent-internal-components-motion-magnetic",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "agent-internal-lib-hooks-use-hover-capable",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-button-metallic",
    "name": "agent-internal-components-motion-button-metallic",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils",
      "agent-internal-components-motion-button-base"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-button-stateful",
    "name": "agent-internal-components-motion-button-stateful",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "agent-internal-components-motion-button-base"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-popover-morph",
    "name": "agent-internal-components-motion-popover-morph",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-components-motion-popover-position",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-popover-position",
    "name": "agent-internal-components-motion-popover-position",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-motion-select",
    "name": "agent-internal-components-motion-select",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-action-swap-roll",
    "name": "agent-internal-components-motion-action-swap-roll",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [
      "agent-internal-components-motion-action-swap"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-action-swap",
    "name": "agent-internal-components-motion-action-swap",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-agents-agent-disclosure",
    "name": "agent-internal-components-agents-agent-disclosure",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-agents-agent-code",
    "name": "agent-internal-components-agents-agent-code",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "shiki@4.2.0"
    ],
    "needs": [
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-checkbox",
    "name": "agent-internal-components-motion-checkbox",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-input",
    "name": "agent-internal-components-motion-input",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-radio",
    "name": "agent-internal-components-motion-radio",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-agents-approval-card-types",
    "name": "agent-internal-components-agents-approval-card-types",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-lib-hooks-use-favicon",
    "name": "agent-internal-lib-hooks-use-favicon",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [
      "agent-internal-lib-favicon"
    ],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-lib-favicon",
    "name": "agent-internal-lib-favicon",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-agents-loading-states-thinking-shimmer",
    "name": "agent-internal-components-agents-loading-states-thinking-shimmer",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [
      "agent-internal-components-motion-text-shimmer",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-text-shimmer",
    "name": "agent-internal-components-motion-text-shimmer",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [
      "utils",
      "agent-internal-lib-text-shimmer"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-lib-text-shimmer",
    "name": "agent-internal-lib-text-shimmer",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-agents-agent-activity-activity-row",
    "name": "agent-internal-components-agents-agent-activity-activity-row",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils",
      "agent-internal-components-agents-agent-activity-types",
      "agent-internal-safety"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-agents-agent-activity-types",
    "name": "agent-internal-components-agents-agent-activity-types",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-agents-loading-states-agent-progress",
    "name": "agent-internal-components-agents-loading-states-agent-progress",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-agents-loading-states-reasoning-text",
    "name": "agent-internal-components-agents-loading-states-reasoning-text",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-components-motion-loader",
      "agent-internal-components-motion-text-scramble",
      "agent-internal-lib-ease",
      "agent-internal-lib-text-shimmer",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-loader",
    "name": "agent-internal-components-motion-loader",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-text-scramble",
    "name": "agent-internal-components-motion-text-scramble",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-lib-hooks-use-touch-capable",
    "name": "agent-internal-lib-hooks-use-touch-capable",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  },
  {
    "slug": "agent-internal-components-motion-animated-sidebar",
    "name": "agent-internal-components-motion-animated-sidebar",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "lucide-react",
      "motion"
    ],
    "needs": [
      "agent-internal-components-motion-shared-layout-bg",
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-components-motion-shared-layout-bg",
    "name": "agent-internal-components-motion-shared-layout-bg",
    "group": "内部",
    "description": "beUI Agent dependency; installed with its owner.",
    "dependencies": [
      "motion"
    ],
    "needs": [
      "agent-internal-lib-ease",
      "utils"
    ],
    "examples": [],
    "wide": false,
    "ext": "tsx"
  },
  {
    "slug": "agent-internal-safety",
    "name": "Agent safety",
    "group": "内部",
    "description": "Link protocol filtering.",
    "dependencies": [],
    "needs": [],
    "examples": [],
    "wide": false,
    "ext": "ts"
  }
];
