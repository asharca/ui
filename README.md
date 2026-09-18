# @asharca/ui

[Live documentation](https://asharca.github.io/ui/) · [Application examples](https://asharca.github.io/ui/#/examples)

`ChatComposerToolbar` (`@asharca/ui/chat-composer-toolbar`) provides a unified
tool menu and configurable, ordered shortcuts. Pass `tools`, `pinnedIds`, and
`onPinnedIdsChange`; the consuming app owns actions and preference persistence.
Use it in `ChatThread.composerTools` with `showAttachmentPicker={false}` to
replace the default attachment button. The default remains unchanged.

Reusable React controls, chat thread, conversation sidebar, and responsive shell extracted from ToolPlane. Routing, persistence, authentication, and API handlers stay in the host application.

## Install

```bash
pnpm add @asharca/ui
# or: npm install @asharca/ui
```

pnpm installs missing peer dependencies by default. If automatic peer installation
is disabled or your package manager leaves peers missing, install them explicitly:

```bash
pnpm add @asharca/ui @assistant-ui/react@0.15.20 react@^19 react-dom@^19 tailwindcss@^4
```

For version conflicts, first check that your application and other dependencies
support these versions. Installing the package does not configure your CSS build.

The package uses React 19 and Tailwind CSS 4. `ChatThread` additionally accepts an assistant-ui `AssistantRuntime`, so transport and persistence stay in the host application.

The runtime peer accepts `@assistant-ui/react@^0.15.18`, paired with
`@assistant-ui/react-streamdown@0.3.13`. Version `0.2.3` is tested with runtime
`0.15.20` on September 18, 2026. Existing locked `0.15.18` installations remain
in the supported range; new installations should use `0.15.20`, which aligns
the upstream core/cloud dependencies. An unlocked `0.15.18` install can select
an incompatible cloud peer. Keep strict peer validation enabled.
Hosts that also use the Streamdown adapter should use `0.3.13` so the renderer
and host share the same assistant-ui context.

Import the stylesheet once from the host application's global Tailwind stylesheet:

```css
@import "tailwindcss";
@import "@asharca/ui/styles.css";
```

The package stylesheet uses Tailwind's `@source` directive to scan the emitted `dist` files. Importing only the React components will leave their utility classes ungenerated.

## Controls

Import lightweight controls without loading the chat runtime:

```tsx
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, IconButton, Input, SearchInput } from '@asharca/ui/controls';

export function Toolbar() {
  const [query, setQuery] = useState('');
  return <>
    <Button variant="primary">Save</Button>
    <IconButton icon={<Plus />} label="Add item" />
    <Input name="title" aria-label="Title" />
    <SearchInput
      value={query}
      label="Search conversations"
      onChange={(event) => setQuery(event.target.value)}
      onClear={() => setQuery('')}
    />
  </>;
}
```

`Button` supports `primary`, `secondary`, `ghost`, `danger`, and `danger-secondary` variants, `sm`/`md`/`lg` sizes, a loading state, and `asChild` for framework links. Controls also include `Textarea`, `Select`/`NativeSelect`, `Checkbox`, `Radio`, and field labels/descriptions/errors. All controls forward native props and refs.

## Modules

- `@asharca/ui/workspace-sidebar` provides `WorkspaceSidebar`: controlled `collapsed`
  and `mobileOpen` states, `items`, `activeId`, `onSelect`, brand/workspace content
  and a `footer` slot. Items accept `icon`, `label`, `badge`, and `disabled`.
  Widths use `--workspace-sidebar-width` and `--workspace-sidebar-collapsed-width`.
  The mobile breakpoint is 850px. Hosts own routing, persistence, the open trigger,
  scrim, focus trapping/restoration, and background inertness for modal drawers;
  `mobileCloseRef` exposes the built-in close button for focus management.

- `@asharca/ui/controls` — buttons and native form controls.
- `@asharca/ui/controls` also provides `Switch`, native `Slider`, and an additive `outline` button variant.
- `@asharca/ui/avatar` — `Avatar`, `AvatarImage`, and `AvatarFallback`.
- `@asharca/ui/workspace-tab-bar` — ToolPlane's `WorkspaceTabBar` with host-controlled selection, closing, pinning, drag reordering, and new-window callbacks. The showcase wires these actions to its sidebar and pages; route state stays in the host application.
- `@asharca/ui/accordion` — `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent`.
- `@asharca/ui/navigation` also provides Radix-backed `Tabs`, `TabsList`, `TabsTrigger`, and `TabsContent` with keyboard navigation. Existing `Tab` / `TabList` exports are unchanged.
- `@asharca/ui/feedback` also provides native `Progress` and decorative `Skeleton`. Give progress bars and sliders an accessible label; label switches via `htmlFor` or `aria-label`.
- `@asharca/ui/overlays` also provides `DropdownMenu`, its trigger, portal, content, item, group, label, and separator.
- `@asharca/ui/forms` — submit, confirm-submit, and copy actions.
- `@asharca/ui/layout` — page, header, toolbar, section, panel, card, empty state, entity, and data table. `DataTable` supports controlled multi-select with `selectable`, `rowIds`, `selectedRowIds`, and `onSelectedRowIdsChange`.
- `@asharca/ui/navigation` — tabs, chips, and pagination layout.
- `@asharca/ui/feedback` — badges, status, alerts, and spinners.
- `@asharca/ui/dialog` and `@asharca/ui/overlays` — Dialog, Popover, Tooltip, Context Menu, and Hover Card primitives.
- `@asharca/ui/chat-shell`, `@asharca/ui/chat-thread`, and `@asharca/ui/conversation-sidebar` — chat composition.
- The root export also includes `ToolPlaneLogo`, `ContentPage`, `RotatingHeadline`, `SafeStreamdown`, `Breadcrumbs`, `NavigationTabs`, and `WorkspaceTabBar`.

Next.js routing, translations, server actions, authentication, and domain data stay in the host. Pass those through children, labels, callbacks, and thin adapters.

## Example

```tsx
'use client';

import { useState } from 'react';
import {
  ChatShell,
  ChatThread,
  type ChatThreadProps,
  ConversationSidebar,
} from '@asharca/ui';

export function ChatPage({ runtime }: { runtime: ChatThreadProps['runtime'] }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobilePane, setMobilePane] = useState<'sidebar' | 'chat'>('sidebar');

  return (
    <div className="h-dvh">
      <ChatShell
        sidebar={(
          <ConversationSidebar
            groups={[]}
            onSelectConversation={() => setMobilePane('chat')}
          />
        )}
        header={<strong>Support assistant</strong>}
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={setSidebarOpen}
        mobilePane={mobilePane}
        onMobilePaneChange={setMobilePane}
        rightPanel={<div>Optional inspector</div>}
      >
        <ChatThread
          runtime={runtime}
          assistantName="Support assistant"
        />
      </ChatShell>
    </div>
  );
}
```

Build the runtime with AI SDK, assistant-ui local runtime, or another adapter in the host. `sidebarOpen` controls the desktop column. `mobilePane` controls whether narrow screens show the sidebar or the chat. Set `rightPanelOpen={false}` to keep the optional desktop right panel closed, and pass `sidebarLabel` when the sidebar needs a named complementary landmark.

`ChatThread` accepts an optional `components` map for host-specific rendering without replacing the thread layout. Use `AssistantText` for a custom Markdown renderer, `AssistantMessageBefore` / `AssistantMessageAfter` for per-message context, `AssistantActions` for extra message actions, and `SentAttachment` for a host preview flow.

`ConversationSidebar` conversations may also provide optional `meta` content and a `deleting` state, so hosts can keep domain badges and show async delete progress without replacing the list layout.

Pass `onConversationOrderChange(groupId, conversationIds)` to enable same-group
conversation drag ordering and accessible move-up/down buttons. The callback
returns the full group order, including items hidden by search. Hosts own the
reordered state and persistence; selection is unchanged. Disabled/deleting
conversations cannot be moved. Omitting the callback preserves the default list.

Theme defaults are scoped to package component roots. Override them with HSL-channel variables such as `--toolplane-ui-background`, `--toolplane-ui-foreground`, and `--toolplane-ui-brand`. The older `--chat-ui-*` variables remain supported; `--chat-ui-sidebar-width` and `--chat-ui-right-panel-width` still control chat layout. Add a `.dark` class to an ancestor, or `data-theme="dark"` to a component, to use the dark defaults.

## Component workbench

Run `pnpm dev` and open the local URL printed by Vite. The standalone showcase
includes interactive controls, forms, tables, overlays, light/dark themes, and
a local chat demo (no AI service or credentials required). Demo data is kept in
memory and resets on reload.

`pnpm build:showcase` type-checks and builds the site into `showcase-dist/`.
The showcase is development-only and is not included in the npm package.
Open `#/examples` for order administration, analytics, project boards, the
component workspace, and settings. Each has an in-page style, light/dark and
density switcher, plus source tabs reading the actual files in
`showcase/examples/`. See `showcase/examples/README.md` for file locations.
The chart primitives are exported from `@asharca/ui/chart`; combine them with
Recharts and the existing styles. Profile photos
in `showcase/public/avatars` are demo assets from Unsplash (photo IDs
`1494790108377-be9c29b29330`, `1506794778202-cad84cf45f1d`, and
`1534528741775-53994a69daeb`); member names and emails are fictional.

## Build and pack

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm test
pnpm test:package
pnpm pack
```

Development uses Node 24 and pnpm. Tests run without ToolPlane, Next.js,
Postgres, or Docker. `test:package` installs the tarball into a temporary consumer
with strict peer checking and verifies imports, rendering, CSS, and Tailwind
source scanning.

## Release

This package is maintained in `asharca/ui`, independently from ToolPlane.
Changes go through a PR with required CI checks; merging to `main` does not
repeat the full CI run. CI can also be started manually.

To release, update `package.json` in a PR, merge it, and tag the merged commit
on `main`. Replace `X.Y.Z` with the package version:

```bash
git tag ui-vX.Y.Z
git push origin ui-vX.Y.Z
```

The `publish-ui.yml` workflow checks that the tag matches the package version
and belongs to `main`, builds and tests the tagged commit, verifies the tarball,
then publishes that exact version to npm with provenance. Published npm versions
are immutable; use a new version and tag for each release.

Publishing requires access to the `@asharca` npm scope. Configure npm trusted
publishing for `asharca/ui` and `publish-ui.yml`, allowing direct
publishing with `npm publish`. The workflow uses OIDC rather than a long-lived
npm token. No `NPM_TOKEN` or `NODE_AUTH_TOKEN` repository secret is needed.

Version `0.2.0` is the first release from this repository. It requires
`@assistant-ui/react@0.15.18`; consumers upgrading from `0.1.x` must update that
runtime peer as well. Component exports and CSS variables are unchanged by the
repository migration. Consuming applications update their dependency and rebuild
to adopt a release.

## License

MIT. See [LICENSE](./LICENSE). This repository preserves the history of the UI
package extracted from ToolPlane; it does not license the rest of ToolPlane.
