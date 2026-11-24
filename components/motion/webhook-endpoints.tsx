"use client";

import {
  CheckCircle2,
  FlaskConical,
  Link2,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Receipt,
  Send,
  Users,
  Webhook,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { withOccurrenceKeys } from "@/lib/collection-keys";
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

const DAILY_SERIES = [1420, 1380, 1510, 1590, 1540, 1680, 1740, 1862];
const WEEK_HEALTH = [95.2, 99.1, 99.4, 98.9, 96.4, 99.2, 99.0];

function EndpointKindIcon({ index }: { index: number }) {
  switch (index % 4) {
    case 0:
      return <Webhook aria-hidden="true" className="size-3.5" />;
    case 1:
      return <Receipt aria-hidden="true" className="size-3.5" />;
    case 2:
      return <Users aria-hidden="true" className="size-3.5" />;
    default:
      return <FlaskConical aria-hidden="true" className="size-3.5" />;
  }
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

  const maxDaily = Math.max(1, ...DAILY_SERIES);
  const sparkPoints = DAILY_SERIES.map(
    (v, idx) =>
      `${(idx / Math.max(1, DAILY_SERIES.length - 1)) * 180},${28 - (v / maxDaily) * 20}`,
  ).join(" ");

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
        "mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
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
        <div className="flex flex-col justify-between rounded-2xl border border-border bg-background/70 p-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Webhook aria-hidden="true" className="size-3" />
              Endpoints
            </p>
            <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
              <NumberTicker value={endpoints.length} startOnView={false} />
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {activeCount} active · {endpoints.length - activeCount} paused
            </p>
          </div>
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {endpoints.map((ep) => (
              <span
                key={ep.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  !ep.active
                    ? "bg-foreground/[0.15]"
                    : ep.successRate < 90
                      ? "bg-rose-500"
                      : "bg-emerald-500",
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-background/70 p-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Send aria-hidden="true" className="size-3" />
              Deliveries today
            </p>
            <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
              <NumberTicker value={deliveriesToday} locale startOnView={false} />
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">across all endpoints</p>
          </div>
          <svg
            aria-hidden="true"
            viewBox="0 0 180 32"
            className="mt-3 h-7 w-full text-sky-400"
          >
            <polyline
              points={sparkPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-border bg-background/70 p-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 aria-hidden="true" className="size-3" />
              Avg success
            </p>
            <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
              <NumberTicker value={avgSuccess} decimals={1} suffix="%" startOnView={false} />
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Average success per day, last 7 days
            </p>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-1" aria-hidden="true">
            {withOccurrenceKeys(WEEK_HEALTH, (pct) => String(pct)).map(({ item: pct, key }) => (
              <span
                key={key}
                className={cn(
                  "h-5 rounded-md",
                  pct >= 98 ? "bg-emerald-500" : "bg-amber-400",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {onAddEndpoint ? (
        <form
          onSubmit={submitUrl}
          className="mt-4 space-y-2.5 rounded-2xl border border-border bg-background/70 p-3.5"
        >
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Plus aria-hidden="true" className="size-3" />
            Add an endpoint to start receiving events
          </p>
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 focus-within:border-border-strong">
              <Link2 aria-hidden="true" className="size-3.5 shrink-0 text-muted-foreground" />
              <input
                type="url"
                required
                value={urlInput}
                onChange={(event) => setUrlInput(event.target.value)}
                placeholder="https://your-app.com/hooks"
                aria-label="New webhook endpoint URL"
                className="min-w-0 flex-1 bg-transparent font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-9 shrink-0 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-background/70">
        <div className="hidden grid-cols-[minmax(0,1fr)_3.25rem_6.5rem_4.5rem_5.5rem] items-center gap-3 border-b border-border px-4 py-2 text-[11px] font-medium text-muted-foreground sm:grid">
          <span>Endpoint</span>
          <span className="text-center">Success</span>
          <span className="text-right">Latency</span>
          <span className="text-center">Status</span>
          <span className="sr-only">Actions</span>
        </div>

        <ul className="divide-y divide-border">
          {endpoints.map((ep, index) => {
            const isTesting = testingId === ep.id;
            const statusLabel = !ep.active
              ? "Paused"
              : ep.successRate < 90
                ? "Failing"
                : "Active";

            return (
              <li
                key={ep.id}
                className="grid grid-cols-1 items-center gap-3 px-4 py-3.5 sm:grid-cols-[minmax(0,1fr)_3.25rem_6.5rem_4.5rem_5.5rem]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground">
                    <EndpointKindIcon index={index} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <code className="truncate font-mono text-xs font-medium text-foreground">
                        {ep.url}
                      </code>
                      {ep.lastTestStatus ? (
                        <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] font-medium text-emerald-500">
                          {ep.lastTestStatus}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {ep.eventsLabel}
                    </p>
                  </div>
                </div>

                <div className="relative mx-auto flex size-8 items-center justify-center">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 28 28"
                    className="size-8 -rotate-90"
                  >
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="currentColor"
                      strokeOpacity="0.14"
                      strokeWidth="2.4"
                    />
                    <motion.circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      pathLength="1"
                      stroke="currentColor"
                      strokeWidth="2.4"
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
                  <span className="absolute font-mono text-[10px] font-semibold text-foreground tabular-nums">
                    {Math.round(ep.successRate)}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  {isTesting ? (
                    <div
                      aria-hidden="true"
                      className="relative h-1.5 w-10 overflow-hidden rounded-full bg-foreground/[0.08]"
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
                      className="h-1.5 w-10 overflow-hidden rounded-full bg-foreground/[0.08]"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full",
                          ep.latencyMs > 800
                            ? "bg-rose-500"
                            : ep.latencyMs > 250
                              ? "bg-amber-400"
                              : "bg-emerald-500",
                        )}
                        style={{
                          width: `${Math.min(100, Math.max(15, Math.round((ep.latencyMs / 1200) * 100)))}%`,
                        }}
                      />
                    </div>
                  )}
                  <span className="w-12 text-right font-mono text-[11px] text-muted-foreground tabular-nums">
                    {ep.latencyMs} ms
                  </span>
                </div>

                <div className="flex justify-center">
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-medium",
                      statusLabel === "Active" &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                      statusLabel === "Failing" &&
                        "border-rose-500/30 bg-rose-500/10 text-rose-400",
                      statusLabel === "Paused" &&
                        "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {statusLabel}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    aria-label={`Send test event to ${ep.url}`}
                    title="Send test event"
                    onClick={() => triggerTest(ep.id)}
                    className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                  >
                    <Send aria-hidden="true" className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={ep.active}
                    aria-label={`Toggle ${ep.url}`}
                    title={ep.active ? "Pause endpoint" : "Resume endpoint"}
                    onClick={() => onToggleEndpoint?.(ep.id, !ep.active)}
                    className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                  >
                    {ep.active ? (
                      <Pause aria-hidden="true" className="size-3.5" />
                    ) : (
                      <Play aria-hidden="true" className="size-3.5" />
                    )}
                  </button>
                  <span
                    aria-hidden="true"
                    className="grid size-7 place-items-center rounded-lg text-muted-foreground/60"
                  >
                    <MoreHorizontal className="size-3.5" />
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
