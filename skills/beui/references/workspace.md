# Asharca components: local installation and usage

This reference ships with the `beui` skill from **asharca/ui**. It covers only
Asharca additions/modifications; use official usage for unchanged beUI primitives.
The versioned `source-policy.json` beside the skill classifies the current entries.

## Obtain source without deploying a service

Prefer a local checkout the user supplies. Otherwise, from a directory outside
the business project, use the branch in the policy (currently not yet merged):

```bash
git clone --single-branch --branch rebuild/beui-workspace https://github.com/asharca/ui.git asharca-ui-source
cd asharca-ui-source
git rev-parse HEAD
bun install --frozen-lockfile
```

After reviewing the chosen revision, use the same snapshot for all source files.
A downloaded skill may outlive this branch: consult the repository's current refs
and ask for/resolve the intended revision rather than silently using an older
main. Updating an existing checkout must preserve local work; never force-reset.

Export a self-contained local registry item; no dev server, build, or MCP runs:

```bash
bun scripts/export-component.ts workspace-shell --out /absolute/new-directory/workspace-shell.json
# Only the tab bar, when no shell/sidebar is needed:
bun scripts/export-component.ts workspace-tab-bar --out /absolute/new-directory/workspace-tab-bar.json
```

The output contains real source plus all internal dependencies, preserves MIT
notices, and uses the existing shadcn file targets. Existing output files are not
overwritten. Source dependencies are read locally; obtaining Bun/npm packages
may require network access. No claim of a fully offline package installation.

In the consumer, read its `components.json` and review installation before writing:

```bash
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --dry-run
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --diff
npx shadcn@latest add /absolute/new-directory/workspace-shell.json
```

The command runs in the consumer, not asharca/ui. Never pass raw .tsx as a registry
JSON file. Do not use `--overwrite` or accept replacement of shared helpers without
review. Older/custom CLIs may require a compatible shadcn version or manual alias
mapping; inspect their output instead of claiming a successful install.

## Components and exact boundaries

`WorkspaceShell` exports from `components/workspace/workspace-shell.tsx`; it
extends beUI `AnimatedSidebarProviderProps` (`open`, `defaultOpen`, `onOpenChange`,
mobile state, etc.). It has `sidebar`, `tabBar`, `mobileHeader`, `header`, `footer`,
`scroll` and `contentProps` slots. Set a height on its container. `scroll="content"`
scrolls the content pane; `scroll="none"` lets an editor/chat child own scrolling.
It does NOT use the removed legacy `collapsed` / `onCollapsedChange` API.

`WorkspaceSidebar` takes `groups`, `activeId`, `onSelect`, `title`, `footer`,
`className`. It consumes the shell's beUI provider; do not create a second provider.
It is bundled with `workspace-shell`, not a separately advertised official slug.

`WorkspaceTabBar` takes `tabs`, `activeTabId`, `onSelect`, and optional callbacks
`onClose`, `onReorder(sourceId, targetId)`, `onPinnedChange(id, pinned)`,
`onOpenInNewWindow`, `onNewTab`. `WorkspaceTab` supports `id`, `title`, `icon`,
`pinned`, `dirty`, `closable`, `detachable`, `tabId`, `panelId`. It is not the
ordinary beUI `Tabs` API. Pinning, ordering, draft storage and dirty-close
confirmation are host-owned; do not invent server-side behavior.

## Minimal composition

Adapt these imports to the consumer's actual aliases. This is source composition,
not an npm package import. Keep inactive panels mounted to preserve child state.

```tsx
"use client";

import { useState } from "react";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { WorkspaceSidebar } from "@/components/workspace/workspace-sidebar";
import { WorkspaceTabBar, type WorkspaceTab } from "@/components/workspace/workspace-tab-bar";

const tabs: WorkspaceTab[] = [
  { id: "overview", title: "Overview", pinned: true, tabId: "tab-overview", panelId: "panel-overview" },
  { id: "notes", title: "Notes", tabId: "tab-notes", panelId: "panel-notes" },
];

export default function Workspace() {
  const [active, setActive] = useState("overview");
  return (
    <WorkspaceShell className="h-dvh" defaultOpen
      sidebar={<WorkspaceSidebar title="Workspace" activeId={active} onSelect={setActive}
        groups={[{ id: "main", items: tabs.map(({ id, title }) => ({ id, label: title })) }]} />}
      tabBar={<WorkspaceTabBar tabs={tabs} activeTabId={active} onSelect={setActive} />}>
      {tabs.map((tab) => (
        <div key={tab.id} id={tab.panelId} role="tabpanel" aria-labelledby={tab.tabId}
          hidden={active !== tab.id} inert={active !== tab.id} className="p-4">
          <textarea aria-label={`${tab.title} note`} defaultValue="" />
        </div>
      ))}
    </WorkspaceShell>
  );
}
```

For mobile, supply `mobileHeader` with beUI `AnimatedSidebarTrigger` inside the
same provider, as shown in the full repository preview. For a complete working
example read `components/previews/blocks/workspace-shell.preview.tsx` and
`docs/workspace.md` from the selected revision; do not copy private demo imports.
Multiple workspaces must generate unique tab/panel IDs rather than reusing this
single-instance example's literals.

`openWorkspaceWindow` allows same-origin HTTP(S) URLs only and must run in a user
activation. A blocked popup returns null; preserve the original tab/draft. Copy
only minimal approved state, never credentials, the whole store or model secrets.

## Manual fallback and future modifications

Without Bun, inspect `lib/registry.ts` for the entry, main file and `extraFiles`.
Recursively resolve static imports, re-exports and dynamic imports (`@/` and
relative paths) using `lib/source-files.ts` rules. Copy the complete graph from
the SAME source revision, map aliases, preserve existing utilities, and install
the declared external packages at compatible versions. Do not copy site code,
analytics, globals/reset or the entire app. Read `app/docs/theme/page.tsx` for
required theme tokens and merge only missing tokens into the consumer's theme.

When any official implementation/helper is intentionally modified, add the
impacted install slugs to `source-policy.json` with their real category/files and
update this reference/evals. Use the same exporter for those entries. Website-only
copy changes do not convert an unchanged primitive into a project-owned API.

Validate the consumer's types/lint/unit tests and inspect its diff; record the
source commit and installed file paths. Update by re-exporting and merging, not
by replacing all shared files with the latest official version.
