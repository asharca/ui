"use client";

import {
  McpConnectors,
  type McpServer,
} from "@/components/motion/mcp-connectors";

const INITIAL_SERVERS: McpServer[] = [
  {
    id: "github",
    name: "GitHub",
    kind: "github",
    transport: "Remote",
    status: "connected",
    enabled: true,
    tools: [
      { id: "gh-read", name: "read_repository", permission: "allow" },
      { id: "gh-pr", name: "list_pull_requests", permission: "allow" },
      { id: "gh-comment", name: "create_pr_comment", permission: "ask" },
      { id: "gh-merge", name: "merge_pull_request", permission: "off" },
    ],
  },
  {
    id: "linear",
    name: "Linear",
    kind: "linear",
    transport: "Remote",
    status: "connected",
    enabled: true,
    tools: [
      { id: "lin-search", name: "search_issues", permission: "allow" },
      { id: "lin-update", name: "update_issue_state", permission: "ask" },
      { id: "lin-create", name: "create_issue", permission: "ask" },
    ],
  },
  {
    id: "postgres",
    name: "Postgres",
    kind: "postgres",
    transport: "Local",
    status: "connected",
    enabled: false,
    tools: [
      { id: "pg-schema", name: "inspect_schema", permission: "allow" },
      { id: "pg-query", name: "run_readonly_sql", permission: "ask" },
    ],
  },
  {
    id: "slack",
    name: "Slack",
    kind: "slack",
    transport: "Remote",
    status: "auth-needed",
    enabled: false,
    tools: [
      { id: "slk-read", name: "read_channel_history", permission: "allow" },
      { id: "slk-post", name: "post_message", permission: "ask" },
    ],
  },
];

export function McpConnectorsPreview() {
  return <McpConnectors servers={INITIAL_SERVERS} />;
}
