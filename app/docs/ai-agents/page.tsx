import { GITHUB_SKILL_INSTALL } from "@/lib/repository";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/app/docs/code-block";
import { CopyPage } from "@/components/app/docs/copy-page";
import { GuideShell } from "@/components/app/docs/guide-shell";
import { SITE_URL } from "@/lib/site";

const PAGE_PATH = "/docs/ai-agents";
const DESCRIPTION = "Use official beUI components with additional Asharca workspace APIs, installation steps and examples; no self-hosted service is required.";
export const metadata: Metadata = {
  title: "AI Agents",
  description: DESCRIPTION,
  alternates: { canonical: PAGE_PATH, types: { "text/markdown": `${PAGE_PATH}.md` } },
  openGraph: { title: "AI Agents · beUI", description: DESCRIPTION, url: PAGE_PATH, type: "article", siteName: "beUI", images: ["/api/og"] },
  twitter: { card: "summary_large_image", title: "AI Agents · beUI", images: ["/api/og"] },
};

const ENDPOINTS = [
  { label: "llms.txt", url: "/llms.txt", desc: "Markdown index in llmstxt.org format." },
  { label: "Registry index", url: "/r", desc: "JSON catalogue of every component." },
  { label: "Component detail", url: "/r/{slug}", desc: "JSON with files, deps, source." },
  { label: "shadcn catalog", url: "/registry.json", desc: "Directory-compatible registry catalog." },
  { label: "shadcn item", url: "/r/{slug}.json", desc: "Install item with inline file content and shadcn semantic color classes." },
  { label: "Raw source", url: "/r/{slug}/raw", desc: "Plain text .tsx ready to drop in." },
];
const MCP_URL = "https://mcp.beui.dev/mcp";
const MCP_CLI_SNIPPET = `# Optional official beUI MCP connection
# Claude Code
claude mcp add --transport http beui https://mcp.beui.dev/mcp

# Codex
codex mcp add beui --url https://mcp.beui.dev/mcp

# Amp
amp mcp add beui https://mcp.beui.dev/mcp`;
const MCP_MANUAL_SNIPPET = `{
  "mcpServers": {
    "beui": {
      "type": "http",
      "url": "https://mcp.beui.dev/mcp"
    }
  }
}`;
const LOCAL_SKILL_SNIPPET = `# Before the feature branch is merged, obtain the selected source.
git clone --single-branch --branch rebuild/beui-workspace https://github.com/asharca/ui.git asharca-ui-source

# In the consuming project; replace the absolute source path.
npx skills add /absolute/path/asharca-ui-source/skills/beui --skill beui`;
const LOCAL_COMPONENT_SNIPPET = `# In the selected asharca/ui source checkout
git rev-parse HEAD
bun install --frozen-lockfile
bun scripts/export-component.ts workspace-shell --out /absolute/new-directory/workspace-shell.json

# In the configured consuming project
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --dry-run
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --diff
npx shadcn@latest add /absolute/new-directory/workspace-shell.json`;
const FETCH_SNIPPET = `// Optional official beUI component discovery
const idx = await fetch('https://beui.dev/r').then((r) => r.json());
const entry = await fetch(\`https://beui.dev/r/\${slug}\`).then((r) => r.json());
// Inspect source files and dependencies before installing.
// Preserve the project's local changes, aliases and theme configuration.`;
const SHADCN_SNIPPET = `# Official beUI component
npx shadcn@latest view @beui/animated-toast-stack
npx shadcn@latest add @beui/animated-toast-stack --dry-run
npx shadcn@latest add @beui/animated-toast-stack

# Official URL alternative
npx shadcn@latest add https://beui.dev/r/animated-toast-stack.json`;
const ENTRY_SHAPE = `{
  "slug": "animated-toast-stack",
  "name": "Animated Toast Stack",
  "category": "motion",
  "dependencies": ["motion", "lucide-react", "react"],
  "internal": ["@/lib/utils"],
  "files": [
    { "path": "components/motion/animated-toast-stack.tsx", "type": "component", "content": "..." },
    { "path": "lib/utils.ts", "type": "util", "content": "..." }
  ]
}`;
const heading = "mt-10 scroll-mt-24 text-xl font-medium tracking-tight text-foreground";
const inlineCode = "rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground";

export default function AIAgentsPage() {
  return <GuideShell>
    <header id="overview" className="scroll-mt-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Agent guide</p>
      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl font-medium tracking-tight text-foreground">For AI agents</h1>
        <CopyPage pageUrl={`${SITE_URL}${PAGE_PATH}`} markdownPath={`${PAGE_PATH}.md`} componentName="Agent Guide" />
      </div>
      <p className="mt-3 max-w-2xl text-muted-foreground">Use official beUI components as usual, with additional installation and usage examples for the Asharca workspace. These components can be freely combined without deploying your own website or MCP.</p>
    </header>

    <h2 id="agent-skill" className={heading}>Agent skill</h2>
    <p className="mt-2 text-muted-foreground">This skill supplements the normal beUI instructions with WorkspaceShell, WorkspaceSidebar and WorkspaceTabBar APIs and examples. Choose the components that fit your interface; official beUI components remain available throughout the application.</p>
    <p className="mt-4 text-sm text-muted-foreground">After the changes are merged into the default branch:</p>
    <div className="mt-4"><CodeBlock code={GITHUB_SKILL_INSTALL} lang="bash" filename="terminal" /></div>
    <p className="mt-4 text-sm text-muted-foreground">Before merging, install from the selected local branch. A skill installation supplies documentation, not the complete component repository:</p>
    <div className="mt-4"><CodeBlock code={LOCAL_SKILL_SNIPPET} lang="bash" filename="local-skill" /></div>
    <p className="mt-4 text-sm text-muted-foreground">For a custom workspace component, export its local registry item, then review and install the JSON in the consuming project:</p>
    <div className="mt-4"><CodeBlock code={LOCAL_COMPONENT_SNIPPET} lang="bash" filename="local-component" /></div>
    <p className="mt-4 text-sm text-muted-foreground">The bundled references/workspace.md contains the component APIs and a minimal composition. source-policy.json is the custom export inventory, not a selection rule. The exporter does not start a server. Review shared-file differences and preserve local edits during installation.</p>

    <h2 id="mcp-server" className={heading}>MCP server (optional)</h2>
    <p className="mt-2 text-muted-foreground">The official beUI MCP provides discovery and source inspection for its hosted catalog. Connecting it is optional; the custom workspace examples and local export work independently. Hosted at <code className={inlineCode}>{MCP_URL}</code>.</p>
    <div className="mt-4"><CodeBlock code={MCP_CLI_SNIPPET} lang="bash" filename="terminal" /></div>
    <p className="mt-4 text-muted-foreground">Any other client: add it manually to your MCP config.</p>
    <div className="mt-4"><CodeBlock code={MCP_MANUAL_SNIPPET} lang="json" filename="mcp.json" /></div>
    <p className="mt-4 text-sm text-muted-foreground">Tools: <code className={inlineCode}>list_components</code>, <code className={inlineCode}>search_components</code>, <code className={inlineCode}>get_component</code>, <code className={inlineCode}>get_install_command</code>.</p>

    <h2 id="endpoints" className={heading}>Endpoints</h2>
    <ul className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
      {ENDPOINTS.map((e) => <li key={e.url} className="flex items-start justify-between gap-4 p-4">
        <div className="min-w-0"><div className="flex items-center gap-2"><code className="rounded-md bg-foreground/5 px-2 py-0.5 font-mono text-xs text-foreground">{e.url}</code><span className="text-sm font-medium text-foreground">{e.label}</span></div><p className="mt-1 text-sm text-muted-foreground">{e.desc}</p></div>
        {!e.url.includes("{") && <Link href={e.url} target="_blank" rel="noreferrer noopener" className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground">Open<ArrowUpRight className="h-3 w-3" /></Link>}
      </li>)}
    </ul>

    <h2 id="agent-flow" className={heading}>Agent flow</h2>
    <p className="mt-2 text-muted-foreground">Explore official components with the catalog below. For the custom workspace, the bundled reference describes its APIs and local export. Compose either or both as needed.</p>
    <div className="mt-4"><CodeBlock code={FETCH_SNIPPET} lang="ts" filename="agent.ts" /></div>

    <h2 id="shadcn-flow" className={heading}>shadcn flow</h2>
    <p className="mt-2 text-muted-foreground">Official components retain their normal install commands. The local JSON above provides the additional workspace components. Review changes to shared helpers and retain the target app&apos;s theme.</p>
    <div className="mt-4"><CodeBlock code={SHADCN_SNIPPET} lang="bash" filename="terminal" /></div>

    <h2 id="entry-shape" className={heading}>Entry shape</h2>
    <p className="mt-2 text-muted-foreground">Detail entries include source files and internal helpers. The export script produces a shadcn registry item with inline file contents, alias-aware targets and provenance, rather than this illustrative detail response.</p>
    <div className="mt-4"><CodeBlock code={ENTRY_SHAPE} lang="json" filename="entry.json" /></div>

    <h2 id="generative-ui" className={heading}>Generative UI</h2>
    <p className="mt-2 text-muted-foreground">Want the model to compose these components into a live interface? Follow the <Link href="/docs/openui" className="text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground">OpenUI integration guide</Link> to register a custom component library, generate its system prompt, and render interactive OpenUI Lang as it streams.</p>
  </GuideShell>;
}
