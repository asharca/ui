import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { NumberTicker } from "@/components/motion/number-ticker";
import { SHOWCASE_DIRECTORY_SLUGS } from "@/lib/catalog-taxonomy";
import { componentPath } from "@/lib/component-paths";
import { findComponent } from "@/lib/registry";

export function LibraryShowcase({
  webCount,
  nativeCount,
}: {
  webCount: number;
  nativeCount: number;
}) {
  const totalCount = webCount + nativeCount;

  const directoryItems = SHOWCASE_DIRECTORY_SLUGS.map((entry) => {
    const comp = findComponent(entry.category, entry.slug);
    return {
      ...entry,
      href: componentPath(entry.category, entry.slug),
      variants: comp?.examples?.length || 1,
    };
  });

  return (
    <section id="showcase" className="scroll-mt-24 px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div>
            <p className="text-sm text-muted-foreground">The block library</p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              A full page. Or the missing piece.
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/docs/ai-agents"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Build with your agent
            </Link>
            <Link
              href="/components"
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <span>Explore all blocks</span>
              <ArrowUpRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-xs font-medium text-muted-foreground">
              Inside the library
            </p>
            <div className="mt-3 text-5xl font-medium tracking-tight text-foreground tabular-nums">
              <NumberTicker value={totalCount} startOnView={false} />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Web blocks, pages, illustrations, and templates, plus React Native
              blocks and screens, all as source you own.
            </p>

            <div className="mt-6 divide-y divide-border border-t border-border">
              <div className="py-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Web</span>
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {webCount}
                  </span>
                </div>
                <Link
                  href="/components"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  <span>Browse web</span>
                  <ArrowRight aria-hidden="true" className="size-3" />
                </Link>
              </div>
              <div className="pt-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">React Native</span>
                  <span className="font-mono font-medium text-foreground tabular-nums">
                    {nativeCount}
                  </span>
                </div>
                <Link
                  href="/mobile"
                  className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  <span>Browse React Native</span>
                  <ArrowRight aria-hidden="true" className="size-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            {directoryItems.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                prefetch={false}
                className="group flex items-center justify-between gap-4 border-b border-border py-3.5 transition-colors hover:border-(--color-border-strong)"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {item.num}
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {item.label}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono tabular-nums">
                    {item.variants} variants
                  </span>
                  <ArrowRight
                    aria-hidden="true"
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
