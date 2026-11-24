"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  RotateCw,
  Send,
  Webhook,
} from "lucide-react";
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
  responseBody?: string;
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
  return `${secret.slice(0, 6)}•••••••••••••••••••••••${secret.slice(-4)}`;
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
  const [copiedBody, setCopiedBody] = useState(false);
  const [filter, setFilter] = useState<"all" | "failed">("all");
  const [bodyTab, setBodyTab] = useState<"request" | "response">("request");
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

  const inspectedBody = selected
    ? bodyTab === "request"
      ? selected.payload
      : (selected.responseBody ??
        (selected.status >= 400
          ? `{\n  "error": "upstream_timeout",\n  "status": ${selected.status}\n}`
          : `{\n  "received": true,\n  "status": ${selected.status}\n}`))
    : "";

  const copyInspectedBody = async () => {
    try {
      await navigator.clipboard.writeText(inspectedBody);
    } catch {
      // Ignore clipboard unavailability
    }
    setCopiedBody(true);
    window.setTimeout(() => setCopiedBody(false), 1600);
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
            <span className="grid size-8 shrink-0 place-items-center rounded-xl border border-border bg-background/70 text-muted-foreground">
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
                      : "bg-foreground/[0.08] text-muted-foreground",
                  )}
                >
                  {active ? "Active" : "Paused"}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{serviceLabel}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-lg border border-border bg-background/70 px-2 py-1">
              {eventsCount} events
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/70 px-2.5 py-1 font-mono text-[11px]">
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
            <span className="rounded-lg border border-border bg-background/70 px-2 py-1 font-mono text-[11px]">
              API {apiVersion}
            </span>
          </div>
        </div>

        <Switch checked={active} onCheckedChange={setActive} ariaLabel="Toggle webhook endpoint" />
      </header>

      {/* Stat tiles */}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Send aria-hidden="true" className="size-3" />
            Deliveries, 24h
          </p>
          <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={deliveries24h} locale startOnView={false} />
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5 font-mono text-emerald-500">
              <ArrowUpRight aria-hidden="true" className="size-3" />
              +4.9%
            </span>
            <span>vs. prior 24h</span>
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

        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 aria-hidden="true" className="size-3" />
            Success rate
          </p>
          <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={successRate} decimals={2} suffix="%" startOnView={false} />
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5 font-mono text-emerald-500">
              <ArrowUpRight aria-hidden="true" className="size-3" />
              +0.5 pts
            </span>
            <span>vs. prior 24h</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/[0.08]">
            <motion.div
              initial={false}
              animate={{ width: `${Math.min(100, successRate)}%` }}
              transition={{ duration: reduce ? 0 : 0.35 }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground tabular-nums">
            {failedCount24h} failed
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock aria-hidden="true" className="size-3" />
            Avg latency
          </p>
          <p className="mt-1.5 text-2xl font-medium tracking-tight tabular-nums">
            <NumberTicker value={avgLatencyMs} suffix=" ms" startOnView={false} />
          </p>
          <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-0.5 font-mono text-emerald-500">
              <ArrowDownRight aria-hidden="true" className="size-3" />
              -13.9%
            </span>
            <span>vs. prior 24h</span>
          </p>
          <svg
            aria-hidden="true"
            viewBox="0 0 220 40"
            className="mt-2.5 h-8 w-full text-sky-400"
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
        <div className="overflow-hidden rounded-2xl border border-border bg-background/70">
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
                    "rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                    filter === t.id
                      ? "bg-foreground/[0.08] text-foreground"
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
                      isSelected ? "bg-foreground/[0.07]" : "hover:bg-foreground/[0.04]",
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
                    <span className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-muted-foreground tabular-nums">
                      {item.attempts.length > 1 ? (
                        <span className="inline-flex items-center gap-0.5 text-amber-400">
                          <RotateCw aria-hidden="true" className="size-2.5" />
                          {item.attempts.length}
                        </span>
                      ) : null}
                      <span>{item.latency}</span>
                      <span>·</span>
                      <span>{item.age}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {selected ? (
          <div className="rounded-2xl border border-border bg-background/70 p-4">
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
                  className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground transition-colors hover:bg-foreground/[0.06]"
                >
                  <RotateCw aria-hidden="true" className="size-3" />
                  Retry
                </button>
              ) : null}
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-medium">Attempts</span>
                <span className="font-mono">UTC</span>
              </div>
              <ul className="mt-1.5 space-y-1.5">
                {selected.attempts.map((attempt) => (
                  <li
                    key={attempt.id}
                    className="flex items-center justify-between font-mono text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span>{attempt.label}</span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium",
                          attempt.status >= 400
                            ? "bg-rose-500/15 text-rose-400"
                            : "bg-emerald-500/15 text-emerald-500",
                        )}
                      >
                        {attempt.status}
                      </span>
                      <span className="text-muted-foreground">{attempt.duration}</span>
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {attempt.timestamp}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex rounded-full border border-border bg-card p-0.5 text-[11px]">
                  {(["request", "response"] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setBodyTab(tab)}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 font-medium capitalize transition-colors",
                        bodyTab === tab
                          ? "bg-foreground/[0.08] text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => void copyInspectedBody()}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                >
                  {copiedBody ? (
                    <Check aria-hidden="true" className="size-3 text-emerald-500" />
                  ) : (
                    <Copy aria-hidden="true" className="size-3" />
                  )}
                  <span>{copiedBody ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {bodyTab === "request" ? (
                <div className="mt-2.5 rounded-xl border border-border bg-neutral-950/60 p-3 font-mono text-[10.5px] leading-5">
                  <p className="mb-1 text-[10px] font-sans uppercase tracking-wider text-muted-foreground">
                    Headers
                  </p>
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 text-neutral-300">
                    <span className="text-neutral-500">content-type</span>
                    <span className="truncate">application/json</span>
                    <span className="text-neutral-500">webhook-event</span>
                    <span className="truncate">{selected.event}</span>
                    <span className="text-neutral-500">webhook-delivery</span>
                    <span className="truncate">{selected.id}</span>
                  </div>
                </div>
              ) : null}

              <div className="mt-2 rounded-xl border border-border bg-neutral-950/60 p-3">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Body
                </p>
                <pre className="max-h-32 overflow-auto font-mono text-[11px] leading-relaxed text-neutral-300">
                  {inspectedBody}
                </pre>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
