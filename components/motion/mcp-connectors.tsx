"use client";

import { ChevronDown, Database, GitBranch, Layers, MessageSquare, Plus, RefreshCw, Server } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Switch } from "@/components/motion/switch";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type McpToolPermission = "allow" | "ask" | "off";

export interface McpTool {
  id: string;
  name: string;
  permission: McpToolPermission;
}

export interface McpServer {
  id: string;
  name: string;
  kind: "github" | "linear" | "postgres" | "slack" | "custom";
  transport: "Remote" | "Local";
  status: "connected" | "auth-needed";
  enabled: boolean;
  tools: McpTool[];
}

export interface McpConnectorsProps {
  servers: McpServer[];
  onServerToggle?: (serverId: string, enabled: boolean) => void;
  onToolPermissionChange?: (
    serverId: string,
    toolId: string,
    permission: McpToolPermission,
  ) => void;
  onReconnect?: (serverId: string) => void;
  onAddServer?: (url: string) => void;
  className?: string;
}

function ServerIcon({ kind }: { kind: McpServer["kind"] }) {
  switch (kind) {
    case "github":
      return <GitBranch aria-hidden="true" className="size-4" />;
    case "linear":
      return <Layers aria-hidden="true" className="size-4" />;
    case "postgres":
      return <Database aria-hidden="true" className="size-4" />;
    case "slack":
      return <MessageSquare aria-hidden="true" className="size-4" />;
    default:
      return <Server aria-hidden="true" className="size-4" />;
  }
}

const PERMISSION_OPTIONS: McpToolPermission[] = ["allow", "ask", "off"];

/** Connector manager for MCP servers with per-tool permissions and add-server flow. */
export function McpConnectors({
  servers: initialServers,
  onServerToggle,
  onToolPermissionChange,
  onReconnect,
  onAddServer,
  className,
}: McpConnectorsProps) {
  const reduce = useReducedMotion() ?? false;
  const [servers, setServers] = useState(initialServers);
  const [expandedId, setExpandedId] = useState<string | null>(
    initialServers[0]?.id ?? null,
  );
  const [adding, setAdding] = useState(false);
  const [newUrl, setNewUrl] = useState("https://mcp.example.com/analytics");
  const [reconnectingId, setReconnectingId] = useState<string | null>(null);

  const totalTools = servers.reduce((acc, s) => acc + s.tools.length, 0);
  const enabledTools = servers.reduce(
    (acc, s) =>
      s.enabled && s.status === "connected"
        ? acc + s.tools.filter((t) => t.permission !== "off").length
        : acc,
    0,
  );
  const askFirstTools = servers.reduce(
    (acc, s) =>
      s.enabled && s.status === "connected"
        ? acc + s.tools.filter((t) => t.permission === "ask").length
        : acc,
    0,
  );

  const handleToggleServer = (id: string, checked: boolean) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === id ? { ...server, enabled: checked } : server,
      ),
    );
    onServerToggle?.(id, checked);
  };

  const handleReconnect = (id: string) => {
    setReconnectingId(id);
    onReconnect?.(id);
    window.setTimeout(() => {
      setServers((prev) =>
        prev.map((server) =>
          server.id === id
            ? { ...server, status: "connected", enabled: true }
            : server,
        ),
      );
      setReconnectingId(null);
    }, 600);
  };

  const handleToolPermission = (
    serverId: string,
    toolId: string,
    permission: McpToolPermission,
  ) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === serverId
          ? {
              ...server,
              tools: server.tools.map((tool) =>
                tool.id === toolId ? { ...tool, permission } : tool,
              ),
            }
          : server,
      ),
    );
    onToolPermissionChange?.(serverId, toolId, permission);
  };

  const handleAddSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = newUrl.trim();
    if (!cleaned) return;
    let hostname = "Custom MCP";
    try {
      hostname = new URL(cleaned).hostname.replace(/^mcp\./, "").split(".")[0] || "Custom MCP";
    } catch {
      hostname = cleaned.slice(0, 18);
    }
    const label = hostname.charAt(0).toUpperCase() + hostname.slice(1);
    const id = `mcp-${Date.now()}`;
    const newServer: McpServer = {
      id,
      name: label,
      kind: "custom",
      transport: "Remote",
      status: "connected",
      enabled: true,
      tools: [
        { id: `${id}-query`, name: "query_metrics", permission: "allow" },
        { id: `${id}-export`, name: "export_report", permission: "ask" },
      ],
    };
    setServers((prev) => [...prev, newServer]);
    setExpandedId(id);
    setAdding(false);
    setNewUrl("");
    onAddServer?.(cleaned);
  };

  return (
    <section
      aria-label="MCP connectors"
      className={cn(
        "mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-5 text-foreground",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Connectors</h3>
          <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
            {servers.length} servers · {totalTools} tools
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((prev) => !prev)}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Plus aria-hidden="true" className="size-3.5" />
          Add server
        </button>
      </header>

      {adding ? (
        <motion.form
          initial={reduce ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleAddSubmit}
          className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-background p-2"
        >
          <input
            type="url"
            required
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder="https://mcp.your-domain.com/sse"
            aria-label="MCP server URL"
            className="min-w-0 flex-1 bg-transparent px-2 text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="inline-flex h-7 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Connect
          </button>
        </motion.form>
      ) : null}

      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
        {servers.map((server) => {
          const isOpen = expandedId === server.id;
          const activeToolCount = server.tools.filter((t) => t.permission !== "off").length;
          return (
            <li key={server.id} className="p-3.5">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setExpandedId(isOpen ? null : server.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-border bg-card text-foreground">
                    <ServerIcon kind={server.kind} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <span className="truncate">{server.name}</span>
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-3.5 shrink-0 text-muted-foreground transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full",
                          server.status === "connected"
                            ? "bg-emerald-500"
                            : "bg-amber-500",
                        )}
                      />
                      <span>
                        {server.status === "connected" ? "Connected" : "Sign in needed"}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{server.transport}</span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {activeToolCount}/{server.tools.length} tools
                      </span>
                    </span>
                  </span>
                </button>

                {server.status === "auth-needed" ? (
                  <button
                    type="button"
                    disabled={reconnectingId === server.id}
                    onClick={() => handleReconnect(server.id)}
                    className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                  >
                    <span>
                      {reconnectingId === server.id ? "Connecting..." : "Reconnect"}
                    </span>
                    <RefreshCw
                      aria-hidden="true"
                      className={cn(
                        "size-3",
                        reconnectingId === server.id && "animate-spin",
                      )}
                    />
                  </button>
                ) : (
                  <Switch
                    checked={server.enabled}
                    onCheckedChange={(checked) => handleToggleServer(server.id, checked)}
                    ariaLabel={`Toggle ${server.name}`}
                  />
                )}
              </div>

              {isOpen ? (
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }}
                  className="mt-3 space-y-2 border-t border-border pt-3 pl-11"
                >
                  {server.tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex flex-wrap items-center justify-between gap-2 text-xs"
                    >
                      <code className="font-mono text-[11px] text-foreground">
                        {tool.name}
                      </code>
                      <div className="inline-flex rounded-full border border-border bg-card p-0.5">
                        {PERMISSION_OPTIONS.map((option) => {
                          const selected = tool.permission === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() =>
                                handleToolPermission(server.id, tool.id, option)
                              }
                              className={cn(
                                "relative rounded-full px-2 py-0.5 text-[10px] font-medium capitalize transition-colors",
                                selected
                                  ? "text-foreground"
                                  : "text-muted-foreground hover:text-foreground",
                              )}
                            >
                              {selected ? (
                                <motion.span
                                  layoutId={`${server.id}-${tool.id}-perm`}
                                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                                  className="absolute inset-0 rounded-full bg-background shadow-xs"
                                />
                              ) : null}
                              <span className="relative z-10">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : null}
            </li>
          );
        })}
      </ul>

      <footer className="mt-3 px-1 font-mono text-xs text-muted-foreground tabular-nums">
        <NumberTicker value={enabledTools} startOnView={false} /> tools enabled ·{" "}
        <NumberTicker value={askFirstTools} startOnView={false} /> ask first
      </footer>
    </section>
  );
}
