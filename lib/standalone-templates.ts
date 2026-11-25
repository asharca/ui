import { GITHUB_REPOSITORY_URL } from "@/lib/repository";

export type TemplateHighlight = {
  title: string;
  description: string;
};

export type StandaloneTemplate = {
  slug:
    | "workflow-studio"
    | "forecast-community"
    | "asset-workspace"
    | "assistant-workspace";
  name: string;
  directory: string;
  tagline: string;
  description: string;
  features: readonly string[];
  highlights: readonly TemplateHighlight[];
  integrations: string;
};

export const standaloneTemplates: readonly StandaloneTemplate[] = [
  {
    slug: "workflow-studio",
    name: "Workflow Studio",
    directory: "templates/workflow-studio",
    tagline:
      "Self-contained Next.js workspace — clone locally, wire your providers, and deploy.",
    description:
      "An AI workflow studio with a visual node editor, multi-session agent builder, knowledge bases, connections, and inspectable run traces.",
    features: [
      "Connected workflow canvas and undo/redo",
      "Local step execution and input/output inspection",
      "Agent configuration and multi-session conversations",
      "Knowledge documents, chunk editing and search",
      "Connections, run traces and workspace settings",
    ],
    highlights: [
      {
        title: "Visual flow canvas",
        description:
          "Connect triggers, knowledge steps, LLM agents, and webhook sinks on an interactive node graph with undo/redo.",
      },
      {
        title: "Agent builder sessions",
        description:
          "Configure system prompts, tools, and guardrails alongside persistent multi-turn test threads.",
      },
      {
        title: "Knowledge indexing",
        description:
          "Manage uploaded documents, chunk boundaries, and vector search relevance directly inside the studio.",
      },
      {
        title: "Step-by-step traces",
        description:
          "Inspect node latency, payloads, and failure states on every local workflow run without leaving the canvas.",
      },
      {
        title: "Workspace auth & onboarding",
        description:
          "Clean sign-in gate, provider buttons, and session scaffolding ready for OAuth or email magic links.",
      },
      {
        title: "Portable standalone app",
        description:
          "Zero workspace coupling — copy the templates/workflow-studio directory into any standalone repo.",
      },
    ],
    integrations:
      "The included workflow engine runs locally. AI providers, connector synchronization and remote execution require host integrations.",
  },
  {
    slug: "forecast-community",
    name: "Forecast Community",
    directory: "templates/forecast-community",
    tagline:
      "Self-contained Next.js workspace — clone locally, connect your feeds, and deploy.",
    description:
      "A compact prediction community template with spotlight market hubs, interactive trading tickets, probability history, rewards, leaderboards, and wallet profiles.",
    features: [
      "Market discovery, topic filters and watchlists",
      "Buy/sell tickets and position accounting",
      "Probability history and resolution rules",
      "Rewards, rankings, profiles and replies",
      "Persistent positions, transactions and market drafts",
    ],
    highlights: [
      {
        title: "Spotlight market carousel",
        description:
          "Featured multi-outcome markets with live implied odds, volume stats, and quick slide navigation.",
      },
      {
        title: "Instant trade tickets",
        description:
          "Simulated buy/sell positions with stake presets, payout calculation, and real-time virtual balance updates.",
      },
      {
        title: "Seasonal leaderboards",
        description:
          "Track top forecasters by hit rate, cumulative ROI, and active streaks across categories.",
      },
      {
        title: "Quests & reward claims",
        description:
          "Engage forecasters with progress quests, liquidity boosts, and tiered rebate milestones.",
      },
      {
        title: "Multi-outcome probability bars",
        description:
          "Animated distribution indicators compare outcomes side by side as simulated positions settle.",
      },
      {
        title: "Ready for custom feeds",
        description:
          "Typed market stores and simulated balances let you swap in settlement APIs or on-chain adapters later.",
      },
    ],
    integrations:
      "Balances, trades, authentication and rewards are explicitly local demonstrations, not wallet custody or on-chain execution.",
  },
  {
    slug: "asset-workspace",
    name: "Asset Workspace",
    directory: "templates/asset-workspace",
    tagline:
      "Self-contained Next.js workspace — clone locally, plug in market data, and deploy.",
    description:
      "A portfolio dashboard workspace with asset routes, net-worth charts, multi-wallet tracking, swaps, staking, watchlists, and a built-in assistant.",
    features: [
      "Portfolio, asset detail, wallet and activity routes",
      "Address tracking and network filters",
      "Local swaps, staking and reward accounting",
      "Assistant sessions and model selection",
      "Browser persistence, JSON export and confirmed reset",
    ],
    highlights: [
      {
        title: "Unified portfolio overview",
        description:
          "Monitor net worth across timeframes with responsive charts, gain attribution, and per-asset deltas.",
      },
      {
        title: "Instant swap ticket",
        description:
          "Preview token conversions, slippage settings, and simulated settlement across liquid pairs.",
      },
      {
        title: "Staking & validator yields",
        description:
          "Allocate positions across validators, inspect uptime metrics, and project annualized rewards.",
      },
      {
        title: "Wallet connection flow",
        description:
          "Polished onboarding screen with OAuth, email, and hardware/browser wallet connect actions.",
      },
      {
        title: "Activity & address filters",
        description:
          "Slice holdings and historical transactions by wallet address or network without full-page reloads.",
      },
      {
        title: "Local persistence & export",
        description:
          "Demo state persists cleanly in browser storage with one-click JSON export and reset controls.",
      },
    ],
    integrations:
      "Market prices, authentication, assistant responses and transactions are local demonstrations. Connect your own providers before production use.",
  },
  {
    slug: "assistant-workspace",
    name: "Assistant Workspace",
    directory: "templates/assistant-workspace",
    tagline:
      "Self-contained Next.js workspace — clone locally, wire your model endpoint, and deploy.",
    description:
      "A complete conversational AI workspace UI with collapsible navigation, projects, knowledge bases, integrations, credit meters, and model selection.",
    features: [
      "Conversation URLs and a model-aware composer",
      "Projects, chat rename, archive and restore",
      "Notes, reference links and local attachment previews",
      "Integration directory and personalization",
      "Command palette, help and persistent local state",
    ],
    highlights: [
      {
        title: "Focused prompt composer",
        description:
          "Credit status header, web-search toggle, model switcher, and starter prompt chips in one distraction-free stage.",
      },
      {
        title: "Collapsible workspace rail",
        description:
          "Switch seamlessly between New Chat, Projects, Knowledge, Integrations, and Workspace Settings.",
      },
      {
        title: "Starter prompt templates",
        description:
          "Kick off portfolio sites, analytics dashboards, landing pages, and task managers from interactive chips.",
      },
      {
        title: "Session & project URLs",
        description:
          "Bookmarkable conversation threads with rename, archive, restore, and full-text command filtering.",
      },
      {
        title: "Attachments & references",
        description:
          "Preview local file attachments, structured notes, and inline reference citations during threads.",
      },
      {
        title: "Model-agnostic adapter layer",
        description:
          "Swap simulated streaming responses for OpenAI, Anthropic, or self-hosted endpoints with zero UI rewrites.",
      },
    ],
    integrations:
      "The included assistant and integrations are browser-local demonstrations. AI responses, authorization and uploads need host services.",
  },
] as const;

export function standaloneTemplateSource(directory: string) {
  return `${GITHUB_REPOSITORY_URL}/tree/main/${directory}`;
}
