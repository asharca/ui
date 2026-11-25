import type { TemplateHighlight } from "@/lib/standalone-templates";

export function TemplateEditorialSections({
  whatIsIt,
  whoIsItFor,
  highlights,
  directory,
}: {
  whatIsIt: string;
  whoIsItFor: string;
  highlights: readonly TemplateHighlight[];
  directory?: string;
}) {
  return (
    <div className="space-y-12">
      <section
        aria-labelledby="editorial-overview"
        className="space-y-6 border-t border-border pt-10"
      >
        <h2
          id="editorial-overview"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Built for a real launch.
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 rounded-2xl border border-border bg-card/50 p-5">
            <h3 className="text-sm font-semibold text-foreground">
              What is it?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {whatIsIt}
            </p>
          </div>
          <div className="space-y-2 rounded-2xl border border-border bg-card/50 p-5">
            <h3 className="text-sm font-semibold text-foreground">
              Who is it for?
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {whoIsItFor}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="what-you-get" className="space-y-5">
        <div className="space-y-1">
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            What you get
          </p>
          <h2
            id="what-you-get"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Everything you need to make it yours.
          </h2>
          {directory ? (
            <p className="text-sm text-muted-foreground">
              Every route, workflow, and state stays modular inside{" "}
              <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-xs text-foreground">
                {directory}
              </code>
              .
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border bg-card/60 p-4"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
