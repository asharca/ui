"use client";

import { Check, Copy, Eye, EyeOff, KeyRound, RotateCcw, Webhook } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Switch } from "@/components/motion/switch";
import { withOccurrenceKeys } from "@/lib/collection-keys";
import { cn } from "@/lib/utils";

export interface WebhookAttemptItem {
  id: string;
  label: string;
  status: number;
  duration: string;
  timestamp: string;
}

export interface WebhookDeliveryItem {
  id: string;
  event: string;
  status: number;
  latency: string;
  age: string;
  attempts: WebhookAttemptItem[];
  payload: string;
}

export interface WebhookDeliveriesProps {
  endpointUrl: string;
  serviceLabel: string;
  eventsCount: number;
  signingSecret: string;
  apiVersion: string;
  deliveries24h: number;
  successRate: number;
  failedCount24h: number;
  avgLatencyMs: number;
  outcomeBars: boolean[];
  latencySeries: number[];
  deliveries: WebhookDeliveryItem[];
  onRetryDelivery?: (id: string) => void;
  className?: string;
}

function maskSecret(secret: string) {
  if (secret.length <= 12) return "••••••••";
  return `${secret.slice(0, 6)}•••••••••••••••${secret.slice(-4)}`;
}

/** Webhook deliveries dashboard with outcome strip, KPIs, and split payload inspector. */
export function WebhookDeliveries({
  endpointUrl,
  serviceLabel,
  eventsCount,
  signingSecret,
  apiVersion,
  deliveries24h,
  successRate,
  failedCount24h,
  avgLatencyMs,
  outcomeBars,
  latencySeries,
  deliveries,
  onRetryDelivery,
  className,
}: WebhookDeliveriesProps) {
  const reduce = useReducedMotion() ?? false;
  const [active, setActive] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [filter, setFilter] = useState<"all" | "failed">("all");
  const [selectedId, setSelectedId] = useState<string>(deliveries[0]?.id ?? "");

  const failedItems = deliveries.filter((d) => d.status >= 400);
  const visibleDeliveries = filter === "failed" ? failedItems : deliveries;
  const selected =
    deliveries.find((d) => d.id === selectedId) ?? visibleDeliveries[0] ?? deliveries[0];

  const maxLat = Math.max(1, ...latencySeries);
  const sparkPoints = latencySeries
    .map(
      (val, idx) =>
        `${(idx / Math.max(1, latencySeries.length - 1)) * 220},${36 - (val / maxLat) * 28}`,
    )
    .join(" ");

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(signingSecret);
    } catch {
      // Ignore clipboard unavailability
    }
    setCopiedSecret(true);
    window.setTimeout(() => setCopiedSecret(false), 1600);
  };

  return (
    <section
      aria-label={`Webhook endpoint ${endpointUrl}`}
      className={cn(
        "mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-5 text-foreground sm:p-6",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-border bg-background text-muted-foreground">
              <Webhook aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <code className="truncate font-mono text-sm font-medium text-foreground">
                  {endpointUrl}
                </code>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    active
                      ? "bg-emerald-500/15 text-emerald-500"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {active ? "Active" : "Paused"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{serviceLabel}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-lg border border-border bg-background px-2 py-1">
              {eventsCount} events
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-[11px]">
              <KeyRound aria-hidden="true" className="size-3" />
              <span>{revealed ? signingSecret : maskSecret(signingSecret)}</span>
              <button
                type="button"
                aria-label={revealed ? "Hide signing secret" : "Reveal signing secret"}
                onClick={() => setRevealed((prev) => !prev)}
                className="text-muted-foreground hover:text-foreground"
              >
                {revealed ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              </button>
              <button
                type="button"
                aria-label="Copy signing secret"
                onClick={() => void copySecret()}
                className="text-muted-foreground hover:text-foreground"
              >
                {copiedSecret ? (
                  <Check className="size-3 text-emerald-500" />
                ) : (
                  <Copy className="size-3" />
                )}
              </button>
            </span>
            <span className="rounded-lg border border-border bg-background px-2 py-1 font-mono text-[11px]">
              API {apiVersion}
            </span>
          </div>
        </div>

        <Switch checked={active} onCheckedChange={setActive} ariaLabel="Toggle webhook endpoint" />
      </header>

      {/* Stat tiles */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Deliveries, 24h</p>
          <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={deliveries24h} locale startOnView={false} />
          </p>
          <div
            aria-hidden="true"
            className="mt-3 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-0.5 sm:grid-cols-[repeat(40,minmax(0,1fr))]"
          >
            {withOccurrenceKeys(outcomeBars.slice(-40), (ok) =>
              ok ? "1" : "0",
            ).map(({ item: ok, key }) => (
              <span
                key={key}
                className={cn(
                  "h-3.5 rounded-[2px]",
                  ok ? "bg-emerald-500" : "bg-rose-500",
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Success rate</p>
          <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={successRate} decimals={2} suffix="%" startOnView={false} />
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={false}
              animate={{ width: `${Math.min(100, successRate)}%` }}
              transition={{ duration: reduce ? 0 : 0.35 }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground tabular-nums">
            {failedCount24h} failed
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Avg latency</p>
          <p className="mt-2 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={avgLatencyMs} suffix=" ms" startOnView={false} />
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 220 40"
            className="mt-3 h-8 w-full text-emerald-500"
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
      </div>

      {/* Split inspector */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="overflow-hidden rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <div className="flex gap-1.5">
              {(
                [
                  { id: "all", label: `All ${deliveries.length}` },
                  { id: "failed", label: `Failed ${failedItems.length}` },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFilter(t.id)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    filter === t.id
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">Newest first</span>
          </div>

          <ul className="divide-y divide-border">
            {visibleDeliveries.map((item) => {
              const isSelected = selected?.id === item.id;
              const isError = item.status >= 400;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-xs transition-colors",
                      isSelected ? "bg-muted/60" : "hover:bg-muted/30",
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 font-mono text-[10px] font-medium",
                          isError
                            ? "bg-rose-500/15 text-rose-400"
                            : "bg-emerald-500/15 text-emerald-500",
                        )}
                      >
                        {item.status}
                      </span>
                      <code className="truncate font-mono text-foreground">
                        {item.event}
                      </code>
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {item.latency} · {item.age}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {selected ? (
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 font-mono text-[11px] font-medium",
                      selected.status >= 400
                        ? "bg-rose-500/15 text-rose-400"
                        : "bg-emerald-500/15 text-emerald-500",
                    )}
                  >
                    {selected.status}
                  </span>
                  <code className="font-mono text-xs font-semibold text-foreground">
                    {selected.event}
                  </code>
                </div>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {selected.id} · {selected.latency} · Attempt {selected.attempts.length}
                </p>
              </div>
              {selected.status >= 400 && onRetryDelivery ? (
                <button
                  type="button"
                  onClick={() => onRetryDelivery(selected.id)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <RotateCcw aria-hidden="true" className="size-3" />
                  Retry
                </button>
              ) : null}
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-medium text-muted-foreground">Attempts</p>
              <ul className="mt-1.5 space-y-1.5">
                {selected.attempts.map((attempt) => (
                  <li
                    key={attempt.id}
                    className="flex items-center justify-between text-xs font-mono"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full",
                          attempt.status >= 400 ? "bg-rose-500" : "bg-emerald-500",
                        )}
                      />
                      <span>{attempt.label}</span>
                      <span className="text-muted-foreground">{attempt.status}</span>
                      <span className="text-muted-foreground">{attempt.duration}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {attempt.timestamp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3">
              <p className="text-[11px] font-medium text-muted-foreground">Payload</p>
              <pre className="mt-1.5 max-h-28 overflow-auto rounded-xl border border-border bg-neutral-950 p-2.5 font-mono text-[11px] leading-relaxed text-neutral-300">
                {selected.payload}
              </pre>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
