"use client";

import {
  Bot,
  Check,
  Code2,
  Cpu,
  Layers,
  Moon,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { ConversionShader } from "@/components/motion/conversion-artwork";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    id: "agent-ready",
    icon: Bot,
    title: "Agent Skill, MCP, or registry",
    description:
      "Let your coding agent discover and install components via MCP or Agent Skill, or pull directly through the shadcn-compatible registry.",
  },
  {
    id: "source-ownership",
    icon: Code2,
    title: "Source ownership",
    description:
      "Real files land in your codebase — no locked black-box wrapper. Customize every spring, layout, and prop freely.",
  },
  {
    id: "full-catalog",
    icon: Layers,
    title: "Illustrations & complete templates",
    description:
      "40 animated product illustrations, 18 full-page compositions, and 11 ready-to-run templates ready to drop into Next.js.",
  },
  {
    id: "motion",
    icon: Sparkles,
    title: "Motion, done right",
    description:
      "Shared easing tokens, spring physics, reduced-motion safe fallbacks, and GPU-composited transforms for crisp 60fps interaction.",
  },
  {
    id: "themeable",
    icon: Moon,
    title: "Themeable & dark-ready",
    description:
      "Built on semantic shadcn CSS tokens so every block, chart, and illustration adapts cleanly to light and dark surfaces.",
  },
  {
    id: "production",
    icon: Cpu,
    title: "Production-grade",
    description:
      "Next.js 16, React 19, Tailwind CSS v4, Motion 12, and React Native Expo — typed, accessible, and responsive.",
  },
] as const;

export function BenefitsSection() {
  const [activeId, setActiveId] = useState<(typeof BENEFITS)[number]["id"]>(
    "agent-ready",
  );

  return (
    <section id="benefits" className="scroll-mt-24 px-4 py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <p className="text-sm text-muted-foreground">What you get</p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Built for teams that ship.
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-stretch">
          <div className="flex flex-col gap-1.5">
            {BENEFITS.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "flex items-start gap-3.5 rounded-2xl border p-4 text-left transition-colors",
                    active
                      ? "border-(--color-border-strong) bg-card text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-card/50 hover:text-foreground",
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 size-4 shrink-0",
                      active ? "text-foreground" : "text-muted-foreground",
                    )}
                  />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        active ? "text-foreground" : "text-foreground/85",
                      )}
                    >
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative isolate flex min-h-[24rem] items-center justify-center overflow-hidden rounded-3xl bg-[#2b1a14] p-6 text-white sm:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(90% 80% at 75% 25%, #d6855c 0%, #5a2b1c 48%, #22140f 100%)",
              }}
            >
              <ConversionShader
                variant="mesh-gradient"
                colors={["#22140f", "#6a3320", "#c9744d", "#eeb48c"]}
                distortion={0.35}
                swirl={0.2}
                className="opacity-55 mix-blend-screen"
              />
            </div>

            <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-black/45 p-5 font-mono text-xs text-white shadow-2xl backdrop-blur-xl">
              {activeId === "agent-ready" && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 text-white/60">
                    <span>$ agent · beui-mcp</span>
                    <span>connected</span>
                  </div>
                  <p className="text-white/95">
                    <span className="text-white/45">&gt; </span>
                    Add an animated pricing section
                  </p>
                  <p className="text-white/70">
                    <span className="text-white/45">→ </span>
                    beui.search_components(&quot;pricing&quot;)
                  </p>
                  <p className="text-white/70">
                    <span className="text-white/45">→ </span>
                    beui.get_component(&quot;pricing&quot;)
                  </p>
                  <p className="flex items-center gap-2 pt-1 text-emerald-300">
                    <Check aria-hidden="true" className="size-3.5" />
                    <span>Pricing section added to your page</span>
                  </p>
                </div>
              )}

              {activeId === "source-ownership" && (
                <div className="space-y-2">
                  <div className="border-b border-white/10 pb-2 text-white/60">
                    src/components/motion/
                  </div>
                  {[
                    "hero-sections.tsx",
                    "feature-sections.tsx",
                    "morphing-modal.tsx",
                    "lib/ease.ts",
                  ].map((file) => (
                    <div
                      key={file}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5"
                    >
                      <span className="text-white/90">{file}</span>
                      <span className="text-emerald-300">owned</span>
                    </div>
                  ))}
                </div>
              )}

              {activeId === "full-catalog" && (
                <div className="grid grid-cols-2 gap-2.5 font-sans">
                  {[
                    { k: "Components", v: "64" },
                    { k: "Agents", v: "33" },
                    { k: "Blocks & Pages", v: "96" },
                    { k: "Illustrations", v: "40" },
                    { k: "Charts", v: "17" },
                    { k: "Templates", v: "11" },
                  ].map((stat) => (
                    <div
                      key={stat.k}
                      className="rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <p className="text-[11px] text-white/60">{stat.k}</p>
                      <p className="mt-1 font-mono text-lg font-medium text-white">
                        {stat.v}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {activeId === "motion" && (
                <div className="space-y-2.5">
                  <div className="border-b border-white/10 pb-2 text-white/60">
                    lib/ease.ts · physics tokens
                  </div>
                  <p className="text-[#ffd29d]">
                    SPRING_LAYOUT = &#123; stiffness: 380, damping: 32 &#125;
                  </p>
                  <p className="text-[#9ecbff]">
                    EASE_OUT = [0.16, 1, 0.3, 1]
                  </p>
                  <p className="text-white/75">
                    useReducedMotion() automatically replaces spatial travel
                    with instant opacity transitions.
                  </p>
                </div>
              )}

              {activeId === "themeable" && (
                <div className="space-y-2.5">
                  <div className="border-b border-white/10 pb-2 text-white/60">
                    globals.css · semantic tokens
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-[#fcfcfc] p-3 text-[#0b0b0b]">
                      <p className="text-[11px] font-medium">Light mode</p>
                      <p className="mt-1 text-[10px] opacity-65">#fcfcfc · #f5f5f5</p>
                    </div>
                    <div className="rounded-xl border border-white/15 bg-[#151515] p-3 text-[#f2f2f2]">
                      <p className="text-[11px] font-medium">Dark mode</p>
                      <p className="mt-1 text-[10px] opacity-65">#151515 · #1c1c1c</p>
                    </div>
                  </div>
                </div>
              )}

              {activeId === "production" && (
                <div className="space-y-2">
                  <div className="border-b border-white/10 pb-2 text-white/60">
                    Verification suite
                  </div>
                  {[
                    "TypeScript strict mode",
                    "Biome static lint",
                    "Registry closure check",
                    "WCAG & axe accessibility",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-white/85">
                      <Check aria-hidden="true" className="size-3.5 text-emerald-400" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
