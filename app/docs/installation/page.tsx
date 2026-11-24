import { Code2, Layers, Palette, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/app/docs/code-block";
import { CopyPage } from "@/components/app/docs/copy-page";
import { GuideShell } from "@/components/app/docs/guide-shell";
import { InstallBlock } from "@/components/app/docs/install-block";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const PAGE_PATH = "/docs/installation";
const DESCRIPTION =
  "Configure the shadcn-compatible @beui registry once, add semantic theme tokens, and install any React component, block, illustration, or template directly into your project.";

export const metadata: Metadata = {
  title: "Installation",
  description: DESCRIPTION,
  alternates: {
    canonical: PAGE_PATH,
    types: { "text/markdown": `${PAGE_PATH}.md` },
  },
};

const COMPONENTS_JSON = `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "registries": {
    "@beui": "${SITE_URL}/r/{name}.json"
  }
}`;

const SECTIONS = [
  { id: "register", label: "Register the registry" },
  { id: "theme", label: "Add theme tokens" },
  { id: "install", label: "Install a component" },
  { id: "manual", label: "Manual install" },
];

export default function InstallationPage() {
  return (
    <GuideShell>
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="min-w-0">
          <header id="overview" className="scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Intro
            </p>
            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <h1 className="text-3xl font-medium tracking-tight text-foreground">
                Installation
              </h1>
              <CopyPage
                pageUrl={`${SITE_URL}${PAGE_PATH}`}
                markdownPath={`${PAGE_PATH}.md`}
                componentName="Installation"
              />
            </div>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Every component, block, chart, and animated illustration ships
              through an open shadcn-compatible registry. Configure it once and
              install real TypeScript source directly into your app.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-accent" />
                <span>React 19, Next.js App Router, and Tailwind CSS v4</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-accent" />
                <span>The shadcn CLI — no global install needed</span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-accent" />
                <span>Copy-paste MIT source ownership in your repository</span>
              </li>
            </ul>
          </header>

          <section
            id="register"
            className="mt-10 scroll-mt-24 border-t border-border pt-8"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <Layers aria-hidden="true" className="size-3.5" />
              </span>
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                1. Register the registry
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Add the <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">@beui</code>{" "}
              namespace to your project&apos;s{" "}
              <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground">
                components.json
              </code>{" "}
              so the CLI can resolve dependencies and internal helpers
              automatically.
            </p>
            <div className="mt-4">
              <CodeBlock
                code={COMPONENTS_JSON}
                lang="json"
                filename="components.json"
              />
            </div>
          </section>

          <section
            id="theme"
            className="mt-10 scroll-mt-24 border-t border-border pt-8"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <Palette aria-hidden="true" className="size-3.5" />
              </span>
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                2. Add theme tokens
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Components use semantic Tailwind tokens (<code className="font-mono text-foreground">bg-background</code>,{" "}
              <code className="font-mono text-foreground">bg-card</code>,{" "}
              <code className="font-mono text-foreground">border-border</code>).
              Run <code className="font-mono text-foreground">npx shadcn@latest init</code>{" "}
              once or copy the CSS tokens from the{" "}
              <Link
                href="/docs/theme"
                className="text-foreground underline underline-offset-4"
              >
                theme setup guide
              </Link>
              .
            </p>
          </section>

          <section
            id="install"
            className="mt-10 scroll-mt-24 border-t border-border pt-8"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <Terminal aria-hidden="true" className="size-3.5" />
              </span>
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                3. Install a component
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Install any component, block, illustration, or chart using your
              package manager:
            </p>
            <div className="mt-4">
              <InstallBlock category="blocks" slug="hero-sections" />
            </div>
          </section>

          <section
            id="manual"
            className="mt-10 scroll-mt-24 border-t border-border pt-8"
          >
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <Code2 aria-hidden="true" className="size-3.5" />
              </span>
              <h2 className="text-xl font-medium tracking-tight text-foreground">
                4. Manual install
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Prefer copying files without the CLI? Every component page has a{" "}
              <strong className="font-medium text-foreground">Code</strong> tab,
              a <strong className="font-medium text-foreground">Usage</strong>{" "}
              tab, and a <strong className="font-medium text-foreground">Manual</strong>{" "}
              install list showing exact npm dependencies and raw TypeScript
              files. You can also explore{" "}
              <Link
                href="/docs/native-setup"
                className="text-foreground underline underline-offset-4"
              >
                React Native setup
              </Link>{" "}
              for Expo mobile apps or{" "}
              <Link
                href="/docs/ai-agents"
                className="text-foreground underline underline-offset-4"
              >
                For AI agents
              </Link>
              .
            </p>
          </section>
        </div>

        <aside
          aria-label="On this page"
          className="hidden xl:block"
        >
          <div className="sticky top-20 space-y-3">
            <p className="text-xs font-medium text-foreground">On this page</p>
            <nav aria-label="Section links" className="flex flex-col gap-2 border-l border-border pl-3 text-xs">
              {SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {sec.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </GuideShell>
  );
}
