import { ArrowRight, Check } from "lucide-react";
import { PressLink } from "@/components/app/press-link";
import { ConversionShader } from "@/components/motion/conversion-artwork";

export function LaunchCta({ totalCount }: { totalCount: number }) {
  return (
    <section id="get-started" className="scroll-mt-24 px-4 py-14 sm:py-20">
      <div className="relative isolate mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#2b1a14] px-6 py-10 text-white sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(95% 95% at 85% 40%, #d48258 0%, #5e2c1c 45%, #2b1a14 100%)",
          }}
        >
          <ConversionShader
            variant="mesh-gradient"
            colors={["#2b1a14", "#6e341f", "#bd6842", "#e8aa80"]}
            distortion={0.35}
            swirl={0.2}
            className="opacity-55 mix-blend-screen"
          />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset" />
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
          <div>
            <p className="text-sm text-white/75">
              Copy-paste ownership. Keep every source file.
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              Your next launch is mostly done.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
              {totalCount} animated blocks, illustrations, screens, and templates
              for web and mobile, ready to install. Change the copy and ship.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-wrap items-center gap-3">
              <PressLink
                href="/components"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#151515] shadow-sm transition-colors hover:bg-white/90"
              >
                <span>Explore components</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </PressLink>
              <PressLink
                href="/templates"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-black/25 px-5 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-black/40"
              >
                Browse templates
              </PressLink>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-white/75">
              {[
                "MIT licensed source",
                "Unlimited projects",
                "Source in your repo",
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <Check aria-hidden="true" className="size-3.5 text-emerald-400" />
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
