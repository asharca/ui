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
  whatIsIt: string;
  whoIsItFor: string;
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
      "An AI workflow builder app with a React Flow canvas, an agent builder with multi-session chat, knowledge bases, connections, and run traces.",
    whatIsIt:
      "Workflow Studio is a complete automation application rather than an isolated widget. Teams can build directed multi-step pipelines on an interactive node canvas, configure agents with tools and guardrails, manage document chunks inside knowledge bases, authorize sample app connectors, and inspect per-step run traces and token usage—persisting demo state locally in the browser.",
    whoIsItFor:
      "Engineers and product teams shipping workflow automation suites, agent builders, internal AI orchestration consoles, or developer platforms that need a multi-route Next.js frontend starter they own end to end.",
    features: [
      "Connected workflow canvas and undo/redo",
      "Local step execution and input/output inspection",
      "Agent configuration and multi-session conversations",
      "Knowledge documents, chunk editing and search",
      "Connections, run traces and workspace settings",
    ],
    highlights: [
      {
        title: "Workflow canvas",
        description:
          "Connect triggers, knowledge lookups, transform steps, agents, and outputs on an interactive React Flow graph with undo/redo, tidy layout, and test-run execution.",
      },
      {
        title: "Agent builder and chat",
        description:
          "Configure agent personas, models, system instructions, tools, and blocked-word guardrails alongside a multi-session conversation workspace.",
      },
      {
        title: "Knowledge bases",
        description:
          "Adjust chunk size and overlap, inspect parsed document slices, test local similarity search, and bind knowledge sources directly to workflows and agents.",
      },
      {
        title: "Runs and traces",
        description:
          "Review execution history across workflows with step-by-step waterfall timing, structured input/output inspection, error states, and retry visibility.",
      },
      {
        title: "Complete app shell",
        description:
          "Collapsible navigation rail, command search, light/dark themes, app connection authorization flows, and workspace settings included out of the box.",
      },
      {
        title: "Standalone source",
        description:
          "Static-export-ready Next.js 16 + React 19 + Tailwind CSS 4 codebase inside templates/workflow-studio with locally bundled UI controls and zero workspace coupling.",
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
    whatIsIt:
      "Forecast Community is a multi-route prediction market web app covering featured market carousels, category filtering, binary and multi-outcome trading tickets, simulated portfolio accounting, forecaster leaderboards, reward programs, and user profile discussions.",
    whoIsItFor:
      "Teams building social forecasting communities, internal calibration trackers, research prediction hubs, or interactive market interfaces that need end-to-end trading ticket and portfolio flows.",
    features: [
      "Market discovery, topic filters and watchlists",
      "Buy/sell tickets and position accounting",
      "Probability history and resolution rules",
      "Rewards, rankings, profiles and replies",
      "Persistent positions, transactions and market drafts",
    ],
    highlights: [
      {
        title: "Discover and predict",
        description:
          "Spotlight market hub, trending movers, topic filtering, bookmark watchlists, and responsive binary or multi-choice outcome trade tickets.",
      },
      {
        title: "Rewards and rankings",
        description:
          "Seasonal forecaster leaderboards paired with claimable quest rewards and progress tracking.",
      },
      {
        title: "Your calls in one place",
        description:
          "Portfolio positions, resolved outcomes, transaction ledgers, and custom draft market creation persisted locally.",
      },
      {
        title: "Standalone source",
        description:
          "Self-contained Next.js 16 project under templates/forecast-community with clean domain stores ready to swap in live settlement APIs.",
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
      "A crypto portfolio dashboard workspace with asset routes, net-worth charts, multi-wallet tracking, swaps, staking, watchlists, and a built-in assistant.",
    whatIsIt:
      "Asset Workspace combines multi-chain portfolio analytics with simulated swaps, validator staking yields, tracked wallet addresses, customizable watchlists, activity ledgers, and a contextual assistant view inside a cohesive dark/light dashboard shell.",
    whoIsItFor:
      "Builders creating digital-asset dashboards, treasury consoles, fintech portfolio trackers, or multi-route web3 interfaces where users inspect balances across wallets and networks.",
    features: [
      "Portfolio, asset detail, wallet and activity routes",
      "Address tracking and network filters",
      "Local swaps, staking and reward accounting",
      "Assistant sessions and model selection",
      "Browser persistence, JSON export and confirmed reset",
    ],
    highlights: [
      {
        title: "A complete workspace",
        description:
          "Includes Overview, Assets, Asset Detail, Wallets, Watchlist, Staking, Activity, Assistant, Settings, and Sign-in onboarding routes.",
      },
      {
        title: "Connected demo workflows",
        description:
          "Simulated swaps, validator delegations, and watchlist toggles immediately update portfolio balances and transaction history.",
      },
      {
        title: "Your data, locally",
        description:
          "Full local browser persistence with JSON state export, address filtering, and confirmed workspace reset.",
      },
      {
        title: "A reusable design system",
        description:
          "Shared motion dialogs, responsive charts, network badges, and clean surface hierarchy ready for light and dark themes.",
      },
      {
        title: "Ready to make your own",
        description:
          "Typed portfolio providers isolate fixed sample prices so you can plug in live market feeds and wallet adapters.",
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
      "A complete conversational AI workspace UI with projects, knowledge bases, integrations, credit meters, archive management, and settings.",
    whatIsIt:
      "Assistant Workspace is a full multi-page conversational AI product shell with URL-addressable chat sessions, project grouping, reference knowledge management, local file attachment previews, integration toggles, command palette search, and workspace settings.",
    whoIsItFor:
      "Developers and startups launching dedicated ChatGPT/Claude-style SaaS workspaces, internal team assistants, or project-centric AI tools needing real multi-route state out of the box.",
    features: [
      "Conversation URLs and a model-aware composer",
      "Projects, chat rename, archive and restore",
      "Notes, reference links and local attachment previews",
      "Integration directory and personalization",
      "Command palette, help and persistent local state",
    ],
    highlights: [
      {
        title: "Conversation workspace",
        description:
          "Model-aware prompt composer with credit allowance meter, starter prompt chips, inline attachment previews, and streaming local responses.",
      },
      {
        title: "Projects and archives",
        description:
          "Group threads into projects, rename or relocate chats, and archive/restore conversations without losing history.",
      },
      {
        title: "Knowledge and context",
        description:
          "Attach notes and reference links to the library and selectively inject them into active conversation prompts.",
      },
      {
        title: "Complete app screens",
        description:
          "Dedicated routes for /chat, /projects, /knowledge, /integrations, /archive, /settings, and /help with keyboard command search.",
      },
      {
        title: "Responsive and themeable",
        description:
          "Off-canvas mobile sidebar, light/dark preference sync, and keyboard-navigable modals built on Motion and Tailwind CSS.",
      },
      {
        title: "Modular source and deployment",
        description:
          "Swap localAdapter for any streaming AssistantAdapter endpoint and deploy statically or to Cloudflare Workers.",
      },
    ],
    integrations:
      "The included assistant and integrations are browser-local demonstrations. AI responses, authorization and uploads need host services.",
  },
] as const;

export function standaloneTemplateSource(directory: string) {
  return `${GITHUB_REPOSITORY_URL}/tree/main/${directory}`;
}
