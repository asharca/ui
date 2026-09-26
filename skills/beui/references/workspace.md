# Asharca workspace components

This reference supplements the normal beUI instructions with custom components
from **asharca/ui**. Official beUI components can be freely combined with these
additions. `source-policy.json` beside the skill is a custom export inventory
with source paths and revision information.

## Obtain source without deploying a service

Use a local checkout supplied by the user, or obtain the current work branch:

```bash
git clone --single-branch --branch rebuild/beui-workspace https://github.com/asharca/ui.git asharca-ui-source
cd asharca-ui-source
git rev-parse HEAD
bun install --frozen-lockfile
```

The branch is not yet merged. Select the appropriate repository revision and use
that snapshot consistently; keep local work when updating an existing checkout.

Export a self-contained local registry item; no server, build or MCP is needed:

```bash
bun scripts/export-component.ts workspace-shell --out /absolute/new-directory/workspace-shell.json
# Standalone tab bar:
bun scripts/export-component.ts workspace-tab-bar --out /absolute/new-directory/workspace-tab-bar.json
```

The output contains the component and its internal dependencies, MIT notices and
shadcn file targets. Existing output files are preserved. Downloading the source
or Bun/npm packages may require network access.

In the consumer, read `components.json` and review the proposed installation:

```bash
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --dry-run
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --diff
npx shadcn@latest add /absolute/new-directory/workspace-shell.json
```

The command runs in the consumer, not asharca/ui. The input is the exported JSON.
Review shared helpers and local changes before accepting file replacements. Use
compatible dependencies and adapt the targets to the consumer's actual aliases.

## Component APIs

`WorkspaceShell` exports from `components/workspace/workspace-shell.tsx` and
extends beUI `AnimatedSidebarProviderProps` (`open`, `defaultOpen`, `onOpenChange`
and mobile state). Its slots are `sidebar`, `tabBar`, `mobileHeader`, `header`,
`footer`, `scroll` and `contentProps`. Set a height on the container.
`scroll="content"` scrolls the content pane; `scroll="none"` lets a child editor
or chat own its scrolling.

`WorkspaceSidebar` accepts `groups`, `activeId`, `onSelect`, `title`, `logo`,
`footer` and `className`. It consumes the shell's provider and is included in
the `workspace-shell` install entry. The collapsed 36px header aligns its logo
with menu icons; hover or keyboard focus reveals the toggle. Expanding grows
the header to 64px and reveals the title behind the moving toggle. Header
content remains vertically centered while the logo keeps its horizontal anchor.
Compact hover starts a fresh interaction: the logo slides down and fades out
with SPRING_LAYOUT, without a clipping edge. Menu groups and rows share a 4px gap. Demo
footer icons keep the same left padding and row height in both states.
Reduced motion switches these states without movement.

`WorkspaceTabBar` accepts `tabs`, `activeTabId`, `onSelect` and optional callbacks
`onClose`, `onReorder(sourceId, targetId)`, `onPinnedChange(id, pinned)`,
`onOpenInNewWindow` and `onNewTab`. `WorkspaceTab` supports `id`, `title`, `icon`,
`pinned`, `dirty`, `closable`, `detachable`, `tabId` and `panelId`.
Pinning, ordering, draft persistence and dirty-close confirmation are owned by
the host application.

## Minimal composition

Adapt these imports to the consumer's actual aliases. Keep inactive panels
mounted to preserve their child state.

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
same provider. The complete example is in
`components/previews/blocks/workspace-shell.preview.tsx`; additional details are
in `docs/workspace.md`. Generate unique tab/panel IDs for multiple workspaces.
Official beUI components can be used in any of the content or action slots.

`openWorkspaceWindow` accepts same-origin HTTP(S) URLs and runs during user
activation. A blocked popup returns null; preserve the original tab and draft.
Transfer only the intended panel state, rather than credentials or the whole store.

## Manual installation and updates

Without Bun, inspect `lib/registry.ts` for the entry, main file and `extraFiles`.
Resolve static imports, re-exports and dynamic imports recursively using
`lib/source-files.ts`. Copy the complete graph, map aliases, preserve existing
utilities and add compatible external dependencies. Merge the theme tokens
needed by the components into the consumer's existing theme.

Add future custom components to the export inventory and document their APIs
here or in another bundled reference. The inventory describes custom additions;
it does not control which official components an application may use.

For updates, export from the desired revision, compare the files, and merge the
changes appropriate to the project. Check types, lint and unit tests. Record the
source commit and destination paths to make future updates easier.
