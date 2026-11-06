import { GITHUB_REPOSITORY_URL } from "@/lib/repository";

export const standaloneTemplates = [
  {
    slug: "workflow-studio",
    name: "Workflow Studio",
    directory: "templates/workflow-studio",
    description: "A browser-local automation workspace with a node editor, agent builder, knowledge bases and inspectable runs.",
    features: ["Connected workflow canvas and undo/redo", "Local step execution and input/output inspection", "Agent configuration and multi-session conversations", "Knowledge documents, chunk editing and search", "Connections, run traces and workspace settings"],
    integrations: "The included workflow engine runs locally. AI providers, connector synchronization and remote execution require host integrations.",
  },
  {
    slug: "forecast-community",
    name: "Forecast Community",
    directory: "templates/forecast-community",
    description: "A prediction community with binary and multiple-outcome markets, trading tickets, rewards and wallet profiles.",
    features: ["Market discovery, topic filters and watchlists", "Buy/sell tickets and position accounting", "Probability history and resolution rules", "Rewards, rankings, profiles and replies", "Persistent positions, transactions and market drafts"],
    integrations: "Balances, trades, authentication and rewards are explicitly local demonstrations, not wallet custody or on-chain execution.",
  },
  {
    slug: "asset-workspace",
    name: "Asset Workspace",
    directory: "templates/asset-workspace",
    description: "A portfolio workspace with asset routes, wallet tracking, swaps, staking, watchlists and a local assistant.",
    features: ["Portfolio, asset detail, wallet and activity routes", "Address tracking and network filters", "Local swaps, staking and reward accounting", "Assistant sessions and model selection", "Browser persistence, JSON export and confirmed reset"],
    integrations: "Market prices, authentication, assistant responses and transactions are local demonstrations. Connect your own providers before production use.",
  },
  {
    slug: "assistant-workspace",
    name: "Assistant Workspace",
    directory: "templates/assistant-workspace",
    description: "A project-based conversational workspace with session URLs, knowledge, attachments, integrations and settings.",
    features: ["Conversation URLs and a model-aware composer", "Projects, chat rename, archive and restore", "Notes, reference links and local attachment previews", "Integration directory and personalization", "Command palette, help and persistent local state"],
    integrations: "The included assistant and integrations are browser-local demonstrations. AI responses, authorization and uploads need host services.",
  },
] as const;

export function standaloneTemplateSource(directory: string) {
  return `${GITHUB_REPOSITORY_URL}/tree/main/${directory}`;
}
