import { webCatalogDates } from "@/lib/web-catalog-data";

/**
 * Component publication and modification dates derived from git history.
 * Keep these dates in sync when a component's public docs or implementation
 * changes so sitemap and article freshness signals stay truthful. Site-wide
 * maintenance should not refresh every component's public update date.
 */
const COMPONENT_DATES = {
  "charts/line-chart": { publishedAt: "2026-10-27", updatedAt: "2026-11-06" },
  "charts/bar-chart": { publishedAt: "2026-10-27", updatedAt: "2026-11-06" },
  "charts/sparkline": { publishedAt: "2026-10-27", updatedAt: "2026-11-06" },
  "charts/sankey-chart": { publishedAt: "2026-10-22", updatedAt: "2026-11-04" },
  "charts/candlestick-chart": { publishedAt: "2026-10-12", updatedAt: "2026-11-04" },
  "charts/donut-chart": { publishedAt: "2026-10-12", updatedAt: "2026-11-04" },
  "motion/timeline": { publishedAt: "2026-10-20", updatedAt: "2026-11-04" },
  "motion/card": { publishedAt: "2026-10-10", updatedAt: "2026-11-06" },
  "motion/color-picker": { publishedAt: "2026-10-10", updatedAt: "2026-11-04" },
  "motion/pagination": { publishedAt: "2026-10-31", updatedAt: "2026-11-04" },
  "motion/avatar-group": { publishedAt: "2026-10-31", updatedAt: "2026-11-04" },
  "blocks/card-dealer": { publishedAt: "2026-10-24", updatedAt: "2026-11-04" },
  "motion/date-time-picker": { publishedAt: "2026-10-15", updatedAt: "2026-11-06" },
  "motion/alert": { publishedAt: "2026-10-05", updatedAt: "2026-11-04" },
  "motion/collapsible": { publishedAt: "2026-10-05", updatedAt: "2026-11-04" },
  "motion/aspect-ratio": { publishedAt: "2026-10-05", updatedAt: "2026-11-04" },
  "motion/arc-picker": { publishedAt: "2026-10-04", updatedAt: "2026-11-04" },
  "motion/sortable-stack": { publishedAt: "2026-10-02", updatedAt: "2026-10-10" },
  "motion/image-viewer": { publishedAt: "2026-10-02", updatedAt: "2026-11-04" },
  "motion/date-range-picker": { publishedAt: "2026-10-02", updatedAt: "2026-11-06" },
  "motion/color-selector": { publishedAt: "2026-09-27", updatedAt: "2026-11-04" },
  "motion/breadcrumb": { publishedAt: "2026-09-27", updatedAt: "2026-11-06" },
  "charts/treemap": { publishedAt: "2026-10-07", updatedAt: "2026-11-04" },
  "charts/volume-profile": { publishedAt: "2026-10-07", updatedAt: "2026-11-04" },
  "charts/status-bar": { publishedAt: "2026-10-07", updatedAt: "2026-11-04" },
  "charts/composition-chart": { publishedAt: "2026-09-25", updatedAt: "2026-11-04" },
  "agents/voice-orb": { publishedAt: "2026-10-04", updatedAt: "2026-10-10" },
  "motion/tilt-card": { publishedAt: "2026-05-17", updatedAt: "2026-06-22" },
  "motion/button": { publishedAt: "2026-05-17", updatedAt: "2026-11-06" },
  "motion/expandable-control": {
    publishedAt: "2026-08-22",
    updatedAt: "2026-08-22",
  },
  "motion/adaptive-stepper": {
    publishedAt: "2026-08-31",
    updatedAt: "2026-09-01",
  },
  "motion/expanding-arrow-button": {
    publishedAt: "2026-07-16",
    updatedAt: "2026-09-22",
  },
  "motion/marquee": { publishedAt: "2026-05-17", updatedAt: "2026-11-06" },
  "motion/tabs": { publishedAt: "2026-05-17", updatedAt: "2026-11-04" },
  "motion/switch": { publishedAt: "2026-05-17", updatedAt: "2026-06-10" },
  "motion/input": { publishedAt: "2026-06-29", updatedAt: "2026-08-28" },
  "motion/select": { publishedAt: "2026-06-28", updatedAt: "2026-11-06" },
  "motion/combobox": { publishedAt: "2026-08-11", updatedAt: "2026-08-22" },
  "motion/multi-select": { publishedAt: "2026-08-29", updatedAt: "2026-08-29" },
  "motion/checkbox": { publishedAt: "2026-06-23", updatedAt: "2026-11-04" },
  "motion/radio": { publishedAt: "2026-06-23", updatedAt: "2026-11-04" },
  "motion/bottom-sheet": { publishedAt: "2026-05-17", updatedAt: "2026-11-04" },
  "motion/pull-to-refresh": { publishedAt: "2026-07-17", updatedAt: "2026-07-17" },
  "motion/shared-layout-bg": { publishedAt: "2026-05-17", updatedAt: "2026-11-04" },
  "motion/bounce-sidebar": { publishedAt: "2026-07-22", updatedAt: "2026-11-04" },
  "motion/animated-sidebar": {
    publishedAt: "2026-07-29",
    updatedAt: "2026-11-06",
  },
  "motion/file-tree": { publishedAt: "2026-08-27", updatedAt: "2026-11-04" },
  "motion/preview-rail": { publishedAt: "2026-07-11", updatedAt: "2026-09-25" },
  "motion/dock": { publishedAt: "2026-05-17", updatedAt: "2026-09-22" },
  "motion/tooltip": { publishedAt: "2026-05-17", updatedAt: "2026-11-04" },
  "motion/context-menu": { publishedAt: "2026-07-27", updatedAt: "2026-07-27" },
  "motion/popover": { publishedAt: "2026-07-07", updatedAt: "2026-11-06" },
  "motion/morphing-modal": { publishedAt: "2026-05-17", updatedAt: "2026-11-06" },
  "motion/center-morph-modal": {
    publishedAt: "2026-07-21",
    updatedAt: "2026-11-06",
  },
  "motion/text-animation": { publishedAt: "2026-05-17", updatedAt: "2026-11-06" },
  "motion/number": { publishedAt: "2026-05-17", updatedAt: "2026-11-04" },
  "motion/animated-badge": { publishedAt: "2026-06-05", updatedAt: "2026-11-04" },
  "motion/action-swap": { publishedAt: "2026-06-10", updatedAt: "2026-11-04" },
  "motion/animated-toast-stack": { publishedAt: "2026-06-05", updatedAt: "2026-09-22" },
  "motion/theme-toggle": { publishedAt: "2026-06-15", updatedAt: "2026-11-04" },
  "motion/bouncy-accordion": { publishedAt: "2026-06-16", updatedAt: "2026-11-04" },
  "motion/drawer": { publishedAt: "2026-06-22", updatedAt: "2026-11-04" },
  "motion/scroll-animation": { publishedAt: "2026-06-24", updatedAt: "2026-11-04" },
  "motion/range-slider": { publishedAt: "2026-06-24", updatedAt: "2026-11-06" },
  "motion/wheel-picker": { publishedAt: "2026-07-09", updatedAt: "2026-10-15" },
  "motion/table": { publishedAt: "2026-07-01", updatedAt: "2026-11-06" },
  "motion/shader-background": { publishedAt: "2026-07-02", updatedAt: "2026-11-04" },
  "motion/cylinder-carousel": { publishedAt: "2026-07-04", updatedAt: "2026-11-06" },
  "motion/loader": { publishedAt: "2026-07-04", updatedAt: "2026-11-04" },
  "charts/funnel-chart": { publishedAt: "2026-09-20", updatedAt: "2026-11-04" },
  "charts/liquidity-heatmap": { publishedAt: "2026-09-20", updatedAt: "2026-11-04" },
  "charts/bump-chart": { publishedAt: "2026-09-20", updatedAt: "2026-11-04" },
  "charts/order-book": { publishedAt: "2026-09-19", updatedAt: "2026-11-04" },
  "charts/heat-calendar": { publishedAt: "2026-09-11", updatedAt: "2026-11-04" },
  "charts/returns-calendar": { publishedAt: "2026-09-11", updatedAt: "2026-11-04" },
  "charts/price-target-fan": { publishedAt: "2026-09-11", updatedAt: "2026-11-04" },
  "agents/loading-states": {
    publishedAt: "2026-07-30",
    updatedAt: "2026-11-04",
  },
  "agents/chat-app": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-11-06",
  },
  "agents/message-bubble": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-11-04",
  },
  "agents/message": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-11-04",
  },
  "agents/message-scroller": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-11-04",
  },
  "agents/ai-sidebar": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-11-06",
  },
  "agents/approval-card": {
    publishedAt: "2026-08-01",
    updatedAt: "2026-11-06",
  },
  "agents/code-block": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-08-02",
  },
  "agents/todo-list": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-11-04",
  },
  "agents/prompt-input": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-11-06",
  },
  "agents/tool-result": {
    publishedAt: "2026-08-01",
    updatedAt: "2026-11-04",
  },
  "agents/file-diff": {
    publishedAt: "2026-08-01",
    updatedAt: "2026-11-04",
  },
  "agents/streaming-response": {
    publishedAt: "2026-08-01",
    updatedAt: "2026-11-04",
  },
  "agents/image-generation": {
    publishedAt: "2026-08-02",
    updatedAt: "2026-08-02",
  },
  "agents/tool-approval": {
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-02",
  },
  "agents/citations": {
    publishedAt: "2026-08-01",
    updatedAt: "2026-11-04",
  },
  "agents/agent-activity": {
    publishedAt: "2026-08-01",
    updatedAt: "2026-08-19",
  },
  "blocks/infinite-masonry": { publishedAt: "2026-07-15", updatedAt: "2026-07-15" },
  "blocks/notification-stack": { publishedAt: "2026-07-14", updatedAt: "2026-11-04" },
  "blocks/project-folder": { publishedAt: "2026-08-15", updatedAt: "2026-08-20" },
  "blocks/card-folder": { publishedAt: "2026-09-04", updatedAt: "2026-11-04" },
  "blocks/knockout-bracket": { publishedAt: "2026-07-12", updatedAt: "2026-11-04" },
  "blocks/availability-scheduler": { publishedAt: "2026-07-10", updatedAt: "2026-11-06" },
  "blocks/swap": { publishedAt: "2026-05-19", updatedAt: "2026-09-22" },
  "blocks/dynamic-island": { publishedAt: "2026-06-10", updatedAt: "2026-11-04" },
  "blocks/command-palette": { publishedAt: "2026-05-17", updatedAt: "2026-11-04" },
  "blocks/morphing-search": { publishedAt: "2026-08-18", updatedAt: "2026-11-04" },
  "blocks/selector": { publishedAt: "2026-09-28", updatedAt: "2026-11-06" },
  "blocks/expandable-action-bar": { publishedAt: "2026-06-05", updatedAt: "2026-09-22" },
  "blocks/overflow-actions": { publishedAt: "2026-06-19", updatedAt: "2026-06-28" },
  "blocks/expandable-tabs": { publishedAt: "2026-06-14", updatedAt: "2026-06-28" },
  "blocks/morphing-tabs": { publishedAt: "2026-08-06", updatedAt: "2026-08-06" },
  "blocks/swipeable-list": { publishedAt: "2026-06-15", updatedAt: "2026-11-04" },
  "blocks/file-upload": { publishedAt: "2026-06-18", updatedAt: "2026-11-06" },
  "blocks/prediction-market": { publishedAt: "2026-06-18", updatedAt: "2026-11-06" },
  "blocks/wallet-card": { publishedAt: "2026-07-03", updatedAt: "2026-11-06" },
  "blocks/otp-input": { publishedAt: "2026-06-13", updatedAt: "2026-11-04" },
  "blocks/signup-form": { publishedAt: "2026-08-08", updatedAt: "2026-11-06" },
  "blocks/bloom-menu": { publishedAt: "2026-06-26", updatedAt: "2026-11-04" },
  "blocks/feedback-widget": { publishedAt: "2026-06-29", updatedAt: "2026-11-06" },
  "blocks/not-found": { publishedAt: "2026-06-21", updatedAt: "2026-09-22" },
  "blocks/workspace-shell": { publishedAt: "2026-09-24", updatedAt: "2026-11-06" },
  "blocks/workspace-tab-bar": { publishedAt: "2026-09-24", updatedAt: "2026-11-06" },
} as const;

export type ComponentDates = {
  publishedAt: string;
  updatedAt: string;
};

export function componentDates(category: string, slug: string): ComponentDates {
  const key = `${category}/${slug}`;
  const dates = webCatalogDates[key] ?? COMPONENT_DATES[key as keyof typeof COMPONENT_DATES];
  if (!dates) {
    throw new Error(`Missing component dates for ${category}/${slug}`);
  }
  return dates;
}
