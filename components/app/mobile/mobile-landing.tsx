"use client";

import {
  ArrowRight,
  Bot,
  Check,
  Copy,
  Moon,
  Smartphone,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { MobileScreenCard } from "@/components/app/mobile/mobile-screen-card";
import { PressLink } from "@/components/app/press-link";
import { ConversionShader } from "@/components/motion/conversion-artwork";
import { NATIVE_PATH } from "@/lib/component-paths";
import {
  MOBILE_DOMAINS,
  MOBILE_SCREEN_GROUPS,
  MOBILE_SCREEN_VARIANT_COUNT,
  MOBILE_SCREENS_PATH,
  type MobileDomainId,
} from "@/lib/mobile-screens";
import { cn } from "@/lib/utils";

const CAPABILITIES = [
  {
    icon: Smartphone,
    title: "Built for Expo",
    description:
      "React Native with Reanimated springs, Gesture Handler, and Uniwind styles.",
  },
  {
    icon: Moon,
    title: "Light and dark",
    description:
      "Every screen adapts cleanly to both appearances with shared color tokens.",
  },
  {
    icon: Terminal,
    title: "Source yours",
    description:
      "Copy complete TypeScript screens into src/ and tailor every gesture.",
  },
  {
    icon: Bot,
    title: "Agent ready",
    description:
      "Structured metadata and clean props so coding agents compose flows fast.",
  },
];

export function MobileLanding({
  primitivesCount,
}: {
  primitivesCount: number;
}) {
  const [domain, setDomain] = useState<MobileDomainId>("ai");
  const [copied, setCopied] = useState(false);

  const visibleGroups = useMemo(() => {
    if (domain === "all") return MOBILE_SCREEN_GROUPS.slice(0, 12);
    return MOBILE_SCREEN_GROUPS.filter((g) => g.domain === domain);
  }, [domain]);

  const installSnippet = "npx beui-native add prompt-input";

  const handleCopy = () => {
    navigator.clipboard?.writeText(installSnippet).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative">
      {/* Hero matching /mobile */}
      <section className="px-2.5 pt-2.5 sm:px-3 sm:pt-3">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[#0e1518] text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(64% 92% at 76% 36%, #e7a576 0%, #9b5134 28%, #15404b 58%, #0b1114 100%)",
            }}
          >
            <ConversionShader
              variant="mesh-gradient"
              colors={["#0b1114", "#153d47", "#9b5134", "#eab082"]}
              distortion={0.4}
              swirl={0.2}
              className="opacity-70"
            />
            <div className="absolute inset-0 bg-[radial-gradient(85%_95%_at_50%_40%,rgb(11_17_20_/_0.35)_0%,rgb(11_17_20_/_0.78)_80%)]" />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset" />
          </div>

          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 pt-32 pb-20 text-center sm:px-8 sm:pt-40 sm:pb-24">
            <Link
              href={MOBILE_SCREENS_PATH}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-3.5 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-black/50"
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-emerald-400"
              />
              <span>
                {MOBILE_SCREEN_VARIANT_COUNT} React Native screens &amp;{" "}
                {primitivesCount} touch primitives
              </span>
            </Link>

            <h1 className="mt-6 text-balance text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
              Your React Native app,
              <span className="block text-white/55">already designed.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-pretty text-sm leading-7 text-white/80 sm:text-base">
              Animated screens, blocks, and touch primitives for Expo, with
              light and dark built in. Copy the source and own every update.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <PressLink
                href={MOBILE_SCREENS_PATH}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
              >
                <span>Explore all screens</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </PressLink>
              <PressLink
                href={NATIVE_PATH}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-black/35 px-5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/50"
              >
                <span>Touch primitives ({primitivesCount})</span>
              </PressLink>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/75">
              {[
                "Open source · Copy-paste",
                "Light and dark built in",
                "Built for Expo",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check aria-hidden="true" className="size-3.5 text-emerald-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capability bar */}
      <section className="mx-auto -mt-8 relative z-10 max-w-6xl px-4">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <h2 className="text-lg font-medium tracking-tight text-foreground">
              In every screen and block
            </h2>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="truncate">$ {installSnippet}</span>
              {copied ? (
                <Check aria-hidden="true" className="size-3.5 text-emerald-500" />
              ) : (
                <Copy aria-hidden="true" className="size-3.5" />
              )}
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-background/70 p-4"
              >
                <div className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                  <Icon aria-hidden="true" className="size-4" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog preview section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              Every screen your app needs.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real interactive screens from the catalog, inside an iOS frame.
            </p>
          </div>
          <Link
            href={MOBILE_SCREENS_PATH}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            <span>Browse all {MOBILE_SCREEN_GROUPS.length} groups</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div
          role="tablist"
          aria-label="Filter mobile screen category"
          className="mt-6 inline-flex max-w-full flex-wrap items-center gap-1 rounded-2xl border border-border bg-card p-1"
        >
          {MOBILE_DOMAINS.map((tab) => {
            const active = domain === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setDomain(tab.id)}
                className={cn(
                  "rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleGroups.map((group, index) => (
            <MobileScreenCard key={group.slug} group={group} eager={index < 8} />
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Need individual gesture primitives?
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Explore all {primitivesCount} foundational React Native controls
              (Buttons, Selects, Tabs, Voice Orb, Toasts) with iOS Simulator
              recordings.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={MOBILE_SCREENS_PATH}
              className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground"
            >
              All 35 screen groups
            </Link>
            <Link
              href={NATIVE_PATH}
              className="inline-flex h-9 items-center rounded-full border border-border bg-background px-4 text-xs font-medium text-foreground"
            >
              View primitives
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
