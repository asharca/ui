"use client";

import { Plus, Send } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Switch } from "@/components/motion/switch";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface WebhookEndpointItem {
  id: string;
  url: string;
  eventsLabel: string;
  active: boolean;
  successRate: number;
  latencyMs: number;
  lastTestStatus?: string;
}

export interface WebhookEndpointsProps {
  endpoints: WebhookEndpointItem[];
  deliveriesToday: number;
  onAddEndpoint?: (url: string) => void;
  onToggleEndpoint?: (id: string, active: boolean) => void;
  onSendTest?: (id: string) => void;
  className?: string;
}

/** Webhook endpoints list with per-endpoint success rings, latency bars, inline add, and live test pulse. */
export function WebhookEndpoints({
  endpoints,
  deliveriesToday,
  onAddEndpoint,
  onToggleEndpoint,
  onSendTest,
  className,
}: WebhookEndpointsProps) {
  const reduce = useReducedMotion() ?? false;
  const [urlInput, setUrlInput] = useState("");
  const [testingId, setTestingId] = useState<string | null>(null);

  const activeCount = endpoints.filter((e) => e.active).length;
  const avgSuccess = endpoints.length
    ? endpoints.reduce((sum, e) => sum + e.successRate, 0) / endpoints.length
    : 100;

  const submitUrl = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = urlInput.trim();
    if (!cleaned) return;
    onAddEndpoint?.(cleaned);
    setUrlInput("");
  };

  const triggerTest = (id: string) => {
    setTestingId(id);
    onSendTest?.(id);
    window.setTimeout(() => {
      setTestingId((prev) => (prev === id ? null : prev));
    }, 650);
  };

  return (
    <section
      aria-label="Webhook endpoints"
      className={cn(
        "mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
        className,
      )}
    >
      <header>
        <h3 className="text-base font-semibold">Webhooks</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Signed POST requests to your servers when events happen.
        </p>
      </header>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Endpoints</p>
          <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={endpoints.length} startOnView={false} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {activeCount} active · {endpoints.length - activeCount} paused
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Deliveries today</p>
          <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={deliveriesToday} locale startOnView={false} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">across all endpoints</p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Avg success</p>
          <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={avgSuccess} decimals={1} suffix="%" startOnView={false} />
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">trailing 24 hours</p>
        </div>
      </div>

      {onAddEndpoint ? (
        <form
          onSubmit={submitUrl}
          className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-background p-2"
        >
          <input
            type="url"
            required
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder="https://api.example.com/webhooks/events"
            aria-label="New webhook endpoint URL"
            className="min-w-0 flex-1 bg-transparent px-2.5 text-xs text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="inline-flex h-8 items-center gap-1 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus aria-hidden="true" className="size-3.5" />
            Add endpoint
          </button>
        </form>
      ) : null}

      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
        {endpoints.map((ep) => {
          const isTesting = testingId === ep.id;
          return (
            <li
              key={ep.id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 28 28"
                  className="size-8 shrink-0 -rotate-90"
                >
                  <circle
                    cx="14"
                    cy="14"
                    r="11"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.14"
                    strokeWidth="2.5"
                  />
                  <motion.circle
                    cx="14"
                    cy="14"
                    r="11"
                    fill="none"
                    pathLength="1"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={
                      ep.successRate >= 98
                        ? "text-emerald-500"
                        : ep.successRate >= 90
                          ? "text-amber-400"
                          : "text-rose-500"
                    }
                    initial={false}
                    animate={{ strokeDasharray: `${ep.successRate / 100} 1` }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: EASE_OUT }}
                  />
                </svg>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="truncate font-mono text-xs font-medium text-foreground">
                      {ep.url}
                    </code>
                    {ep.lastTestStatus ? (
                      <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-500">
                        {ep.lastTestStatus}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {ep.eventsLabel} · {ep.successRate.toFixed(1)}% success · {ep.latencyMs}ms
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isTesting ? (
                  <div
                    aria-hidden="true"
                    className="relative h-1 w-12 overflow-hidden rounded-full bg-muted"
                  >
                    <motion.span
                      initial={reduce ? false : { x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 0.55, ease: EASE_OUT }}
                      className="block h-full w-4 rounded-full bg-primary"
                    />
                  </div>
                ) : (
                  <div
                    aria-hidden="true"
                    className="h-1.5 w-12 overflow-hidden rounded-full bg-muted"
                  >
                    <div
                      className="h-full rounded-full bg-foreground/50"
                      style={{
                        width: `${Math.min(100, Math.round((ep.latencyMs / 400) * 100))}%`,
                      }}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => triggerTest(ep.id)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Send aria-hidden="true" className="size-3" />
                  Send test
                </button>

                <Switch
                  checked={ep.active}
                  onCheckedChange={(checked) => onToggleEndpoint?.(ep.id, checked)}
                  ariaLabel={`Toggle ${ep.url}`}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
