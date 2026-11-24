"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  Code2,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TESTIMONIALS } from "@/components/app/landing/testimonials-data";
import { PressLink } from "@/components/app/press-link";
import { ConversionShader } from "@/components/motion/conversion-artwork";
import { cn } from "@/lib/utils";

type HeroTab = "cli" | "agent" | "source";

const HERO_AVATARS = [0, 1, 4, 5, 6].map((idx) => {
  const item = TESTIMONIALS[idx];
  return {
    id: item.id,
    name: item.user.name,
    src: item.user.avatar.replace("_normal", "_bigger"),
  };
});

const AGENT_BADGES = [
  { label: "Claude", short: "C" },
  { label: "Codex", short: "O" },
  { label: "Cursor", short: "⌘" },
  { label: "Windsurf", short: "W" },
  { label: "Gemini", short: "✦" },
  { label: "Amp", short: "A" },
];

export function LandingHero({ totalCount }: { totalCount: number }) {
  const [tab, setTab] = useState<HeroTab>("agent");

  return (
    <section className="px-2.5 pt-2.5 sm:px-3 sm:pt-3">
      <div className="relative isolate overflow-hidden rounded-3xl bg-[#2b1a14] text-white">
        {/* Warm glowing background field */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(62% 95% at 78% 42%, #f1be96 0%, #bf6d47 38%, #472115 72%, #1d0f0b 100%)",
          }}
        >
          <ConversionShader
            variant="mesh-gradient"
            colors={["#1d0f0b", "#4e2416", "#b86441", "#efc09a"]}
            distortion={0.45}
            swirl={0.22}
            className="opacity-75"
          />
          <div className="absolute inset-0 bg-[radial-gradient(75%_120%_at_18%_48%,rgb(24_13_9_/_0.88)_0%,rgb(29_15_11_/_0.48)_48%,transparent_85%)]" />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset" />
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_38%,transparent_40%,rgb(29_15_11_/_0.35))]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-16 xl:grid-cols-[minmax(0,1fr)_25rem] xl:gap-14 xl:pt-36 xl:pb-20">
          <div className="mx-auto max-w-3xl text-center xl:mx-0 xl:max-w-none xl:text-left">
            <Link
              href="/components"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-black/35"
            >
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-emerald-400"
              />
              <span>Open source</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span>{totalCount} components &amp; blocks</span>
              <ArrowRight aria-hidden="true" className="size-3" />
            </Link>

            <h1 className="mt-5 text-balance text-5xl font-medium tracking-tight text-white md:text-6xl">
              <span
                className="block motion-safe:animate-hero-rise"
                style={{ animationDelay: "120ms" }}
              >
                Bring better design
              </span>
              <span
                className="block text-white/60 motion-safe:animate-hero-rise"
                style={{ animationDelay: "200ms" }}
              >
                to your next project.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-pretty text-sm leading-7 text-white/80 sm:text-base xl:mx-0">
              Animated blocks, illustrations, screens, and complete templates for
              web and mobile. Pick a starting point, make it yours, and ship
              with the source in your hands.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 xl:justify-start">
              <PressLink
                href="/components"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#151515] shadow-sm transition-colors hover:bg-white/90"
              >
                Explore the library
                <ArrowRight aria-hidden="true" className="size-4" />
              </PressLink>
              <PressLink
                href="/templates"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/40"
              >
                Browse templates
              </PressLink>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3 xl:justify-start">
              <div className="flex items-center -space-x-2">
                {HERO_AVATARS.map((avatar) => (
                  /* biome-ignore lint/performance/noImgElement: existing external builder avatar thumbnails */
                  <img
                    key={avatar.id}
                    src={avatar.src}
                    alt={avatar.name}
                    width={24}
                    height={24}
                    className="size-6 shrink-0 rounded-full object-cover ring-2 ring-white/25"
                  />
                ))}
              </div>
              <p className="text-xs text-white/75">
                Loved by developers and founders shipping on web and mobile
              </p>
            </div>
          </div>

          {/* Right interactive install card */}
          <div className="mx-auto hidden w-full max-w-md motion-safe:animate-hero-fade-rise sm:block xl:max-w-none">
            <div className="rounded-2xl border border-white/15 bg-black/35 p-4 text-left text-white shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between gap-2">
                <div
                  role="tablist"
                  aria-label="Installation method"
                  className="inline-flex items-center gap-1 rounded-full bg-white/10 p-1"
                >
                  {(
                    [
                      { id: "cli", label: "CLI", icon: Terminal },
                      { id: "agent", label: "Agent", icon: Bot },
                      { id: "source", label: "Source", icon: Code2 },
                    ] as const
                  ).map(({ id, label, icon: Icon }) => {
                    const active = tab === id;
                    return (
                      <button
                        key={id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setTab(id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                          active
                            ? "bg-white text-[#151515]"
                            : "text-white/75 hover:text-white",
                        )}
                      >
                        <Icon aria-hidden="true" className="size-3.5" />
                        <span>{label}</span>
                      </button>
                    );
                  })}
                </div>
                <Link
                  href="/docs/ai-agents"
                  className="inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
                >
                  <span>Guide</span>
                  <ArrowUpRight aria-hidden="true" className="size-3" />
                </Link>
              </div>

              <div className="mt-4 min-h-[124px] font-mono text-xs leading-6">
                {tab === "cli" ? (
                  <div className="space-y-1.5">
                    <p className="text-white/95">
                      <span className="text-white/45">$ </span>
                      bunx --bun shadcn add @beui/hero-sections
                    </p>
                    <p className="flex items-center gap-2 text-white/70">
                      <Check aria-hidden="true" className="size-3.5 text-emerald-400" />
                      <span>Resolved dependencies</span>
                    </p>
                    <p className="flex items-center gap-2 text-white/70">
                      <Check aria-hidden="true" className="size-3.5 text-emerald-400" />
                      <span>components/motion/hero-sections.tsx</span>
                    </p>
                    <p className="flex items-center gap-2 text-emerald-300">
                      <Check aria-hidden="true" className="size-3.5" />
                      <span>Ready in your repository</span>
                    </p>
                  </div>
                ) : tab === "agent" ? (
                  <div className="space-y-1.5">
                    <p className="text-white/95">
                      <span className="text-white/45">&gt; </span>
                      Add an animated hero section
                    </p>
                    <p className="text-white/70">
                      <span className="text-white/45">→ </span>
                      beui.search_components(&quot;hero&quot;)
                    </p>
                    <p className="text-white/70">
                      <span className="text-white/45">→ </span>
                      beui.get_component(&quot;hero-sections&quot;)
                    </p>
                    <p className="flex items-center gap-2 text-emerald-300">
                      <Check aria-hidden="true" className="size-3.5" />
                      <span>Hero section added to your page</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 text-white/85">
                    <p className="text-white/50">
                      {"// components/motion/hero-sections.tsx"}
                    </p>
                    <p>
                      <span className="text-[#9ecbff]">export function</span>{" "}
                      <span className="text-[#ffd29d]">HeroShowcase</span>(){" "}
                      {"{"}
                    </p>
                    <p className="pl-3 text-white/70">
                      return &lt;MotionHero spring=&#123;SPRING_LAYOUT&#125; /&gt;;
                    </p>
                    <p>{"}"}</p>
                  </div>
                )}
              </div>

              <div className="mt-3 border-t border-white/10 pt-3 text-xs text-white/70">
                Real files in your codebase. Edit them like your own.
              </div>
            </div>

            <div className="mt-3.5 flex items-center justify-between gap-3 px-1">
              <span className="text-[11px] leading-tight text-white/75">
                Works with any agent
              </span>
              <div className="flex items-center gap-1.5">
                {AGENT_BADGES.map((agent) => (
                  <span
                    key={agent.label}
                    role="img"
                    title={agent.label}
                    aria-label={agent.label}
                    className="grid size-7 place-items-center rounded-full border border-white/15 bg-white/15 text-[11px] font-medium text-white/90 backdrop-blur-sm"
                  >
                    {agent.short}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
