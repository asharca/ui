"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PreviewFit } from "@/components/app/landing/preview-fit";
import { PressLink } from "@/components/app/press-link";
import { previews } from "@/components/previews";
import { GITHUB_REPOSITORY_URL } from "@/lib/repository";
import { cn } from "@/lib/utils";

type FeaturedTemplate = {
  id: string;
  domain: string;
  name: string;
  badge: string;
  description: string;
  previewKey: string;
  href: string;
  sourceHref: string;
};

const FEATURED_TEMPLATES: FeaturedTemplate[] = [
  {
    id: "workflow-studio",
    domain: "workflow.studio",
    name: "Workflow Studio",
    badge: "Standalone App",
    description:
      "An AI workflow builder app with a connected node canvas, an agent builder with multi-session chat, knowledge bases, connections, and inspectable run traces.",
    previewKey: "AgentBuilderAgentWorkspacePreview",
    href: "/templates/workflow-studio",
    sourceHref: `${GITHUB_REPOSITORY_URL}/tree/main/templates/workflow-studio`,
  },
  {
    id: "forecast-community",
    domain: "forecast.markets",
    name: "Forecast Community",
    badge: "Standalone App",
    description:
      "A social prediction community with binary and multi-outcome markets, trading tickets, probability history charts, rewards, and persistent positions.",
    previewKey: "blocks/prediction-market",
    href: "/templates/forecast-community",
    sourceHref: `${GITHUB_REPOSITORY_URL}/tree/main/templates/forecast-community`,
  },
  {
    id: "asset-workspace",
    domain: "portfolio.wallet",
    name: "Asset Workspace",
    badge: "Standalone App",
    description:
      "A multi-route portfolio workspace with asset inspection, wallet tracking, swaps, staking vaults, watchlists, and a local assistant.",
    previewKey: "blocks/crypto-wallet-portfolio-overview",
    href: "/templates/asset-workspace",
    sourceHref: `${GITHUB_REPOSITORY_URL}/tree/main/templates/asset-workspace`,
  },
  {
    id: "assistant-workspace",
    domain: "assistant.workspace",
    name: "Assistant Workspace",
    badge: "Standalone App",
    description:
      "A project-based conversational AI workspace with session URLs, model-aware prompt composer, knowledge attachments, archive/restore, and settings.",
    previewKey: "agents/chat-app",
    href: "/templates/assistant-workspace",
    sourceHref: `${GITHUB_REPOSITORY_URL}/tree/main/templates/assistant-workspace`,
  },
  {
    id: "ai-landing",
    domain: "agent.landing",
    name: "AI Agent Landing",
    badge: "Landing Template",
    description:
      "A complete Next.js landing page built for AI products, featuring hero sections, interactive workflow showcases, capability grids, and theme-ready tokens.",
    previewKey: "blocks/ai-landing-default",
    href: "/components/blocks/ai-landing",
    sourceHref: `${GITHUB_REPOSITORY_URL}/blob/main/components/motion/ai-landing.tsx`,
  },
];

export function TemplatesShowcase() {
  const [index, setIndex] = useState(0);
  const current = FEATURED_TEMPLATES[index] ?? FEATURED_TEMPLATES[0];
  const Preview = previews[current.previewKey];

  const prev = () =>
    setIndex((i) => (i - 1 + FEATURED_TEMPLATES.length) % FEATURED_TEMPLATES.length);
  const next = () =>
    setIndex((i) => (i + 1) % FEATURED_TEMPLATES.length);

  return (
    <section id="templates" className="scroll-mt-24 px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-xl">
            <p className="text-sm text-muted-foreground">Templates</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Full sites, ready to ship.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Complete Next.js applications and landing pages with every route
              and interaction built. Copy a standalone project or inspect the
              source directly.
            </p>
          </div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
          >
            <span>All templates</span>
            <ArrowUpRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        {/* Browser domain strip */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {FEATURED_TEMPLATES.map((tpl, idx) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setIndex(idx)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                idx === index
                  ? "border-(--color-border-strong) bg-card text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {tpl.domain}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-12">
          {/* Framed live browser stage */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="size-2.5 rounded-full bg-foreground/15" />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {current.domain}
              </span>
              <span className="w-8" aria-hidden="true" />
            </div>
            <div className="h-[20rem] sm:h-[24rem]">
              <PreviewFit
                hover={false}
                stageWidth={1020}
                maxScale={0.95}
                align="top"
                marginClassName="m-0 h-full rounded-none"
              >
                {Preview ? <Preview /> : null}
              </PreviewFit>
            </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full border border-border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {current.badge}
              </span>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-foreground">
                {current.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {current.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <PressLink
                  href={current.href}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <span>Open template</span>
                  <ArrowRight aria-hidden="true" className="size-4" />
                </PressLink>
                <a
                  href={current.sourceHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
                >
                  <ExternalLink aria-hidden="true" className="size-3.5" />
                  <span>Browse source</span>
                </a>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous template"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-(--color-border-strong) hover:text-foreground"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next template"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-(--color-border-strong) hover:text-foreground"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
              <span className="ml-1 font-mono text-xs text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(FEATURED_TEMPLATES.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
