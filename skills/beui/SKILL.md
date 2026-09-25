---
name: beui
description: "Use beUI animated React components with additional Asharca Workspace Shell, Workspace Sidebar and Workspace Tab Bar examples. Includes official @beui installation, custom component APIs and local source export without deploying a website or MCP. Use for motion UI, agent/chat interfaces and browser-like workspaces."
---

# beUI with Asharca workspace components

This is the `asharca/ui` edition of the `beui` skill. It supplements normal beUI
usage with the custom workspace components documented below. Official beUI
components remain available and can be freely combined with custom components.
Choose the components that fit the interface and the user's preferences.

## Official beUI components

Use the official documentation and `@beui/<slug>` installation as usual. The live
registry is the source of truth for official install names (`items[].name`):

```bash
curl -fsS https://beui.dev/r/registry.json
npx shadcn@latest view @beui/<slug>
npx shadcn@latest add @beui/<slug> --dry-run
npx shadcn@latest add @beui/<slug>
# Or: pnpm dlx shadcn@latest add @beui/<slug>
# Or: bunx --bun shadcn@latest add @beui/<slug>
```

A documentation page can contain separately installable variants. Read the
installed exports and current usage after installation. A connected official MCP
is another optional way to discover and inspect its components. No MCP connection
is needed to use this skill; the official registry may require internet access.

## Custom workspace components

Use these additions when their layout or interactions suit the project. They
compose beUI primitives and work alongside official components, including Tabs,
ChatApp, buttons, menus and message components.

| Component | What it adds | Local install entry |
| --- | --- | --- |
| `WorkspaceShell` | Shared chrome and an inset content surface, with sidebar, tab bar, header and footer slots | `workspace-shell` |
| `WorkspaceSidebar` | Grouped navigation composed from beUI AnimatedSidebar | Included with `workspace-shell` |
| `WorkspaceTabBar` | Surface-connected browser-like tabs with pin, close, reorder and window callbacks | `workspace-tab-bar` |

`WorkspaceShell` accepts beUI sidebar provider props such as `open`, `defaultOpen`
and `onOpenChange`, plus `sidebar`, `tabBar`, `mobileHeader`, `header`, `footer`,
`scroll` and `contentProps`. Give the container an explicit height.

`WorkspaceSidebar` accepts `groups`, `activeId`, `onSelect`, `title` and `footer`.
It uses the provider supplied by the shell.

`WorkspaceTabBar` accepts `tabs`, `activeTabId`, `onSelect`, `onClose`,
`onReorder(sourceId, targetId)`, `onPinnedChange(id, pinned)`,
`onOpenInNewWindow` and `onNewTab`. The application owns tab state, persistence
and business actions.

See [workspace usage and examples](references/workspace.md) for the full import
paths, a minimal composition, mobile controls, window actions and update steps.
The [custom entry index](source-policy.json) lists source paths and the repository
ref used by the local exporter. It is reference data, not a component-selection
restriction or a prerequisite for using official components.

### Install custom components without deployment

Use a local `asharca/ui` checkout or obtain the ref listed in the custom entry
index. Installing this skill supplies documentation, not the entire UI repository.
Record the source commit with `git rev-parse HEAD`.

From the source checkout:

```bash
bun install --frozen-lockfile
bun scripts/export-component.ts workspace-shell --out /absolute/new-directory/workspace-shell.json
# For the standalone tab bar:
bun scripts/export-component.ts workspace-tab-bar --out /absolute/new-directory/workspace-tab-bar.json
```

The exporter packages the complete source dependency graph and MIT notice into
local JSON. It does not start Next.js or MCP, build the website, or modify the
consumer. Use a new output path; existing files are preserved.

Then, from the configured consuming project:

```bash
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --dry-run
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --diff
npx shadcn@latest add /absolute/new-directory/workspace-shell.json
```

Use the project's package runner and review the files/dependencies before
installation. The bundled reference also covers manual source copying.

## Composition and updates

- Read the project's existing components, aliases, dependencies and theme.
- Import the named exports from installed files; use `className` and component
  props to adapt layout and presentation.
- Official and custom components can share `lib/utils`, `lib/ease`, hooks and
  motion primitives. Review shared-file differences and preserve local edits
  during installation or updates.
- Inspect official changes with the official CLI; re-export custom components
  from the desired source revision. Merge the changes appropriate to the project.
- Use `useReducedMotion()` for added motion and `useHoverCapable()` for decorative
  hover effects. Reuse the existing motion tokens and layout behaviour.
- Validate with the project's type, lint and unit tests. In this repository use
  `bun run check` and `bun test`. Start servers, run builds/browser tests or take
  screenshots only when the user requests those additional checks.

## Official component picker

These are suggestions for common use cases, not exclusions of other components.

| User asks for | Suggested `@beui/...` |
| --- | --- |
| Toast or snackbar | `animated-toast-stack` |
| Expanding notification inbox | `notification-stack` |
| Mobile bottom sheet, Vaul-style panel | `bottom-sheet` |
| Side panel or app drawer | `drawer` |
| App chrome sidebar | `animated-sidebar` |
| AI files, folders, bookmarks | `ai-sidebar` |
| Complete beUI chat layout | `chat-app` |
| Streaming thread that follows tokens | `message-scroller`, `message` |
| Chat bubble | `message-bubble` |
| Prompt box or composer | `prompt-input` |
| Agent reasoning, search, tool trace | `agent-activity` |
| Task plan | `todo-list` |
| Code surface | `code-block` |
| File diff | `file-diff` |
| Tool output | `tool-result` |
| Tool permission card | `tool-approval` |
| Approval or HITL question | `approval-card` |
| Inline citations | `citations` |
| Generated image canvas | `image-generation` |
| Liquid popover | `popover` |
| Corner morph popover | `popover-morph` |
| Dropdown select | `select` |
| Select that grows into panel | `select-morph` |
| Searchable select | `combobox` |
| Cmd+K palette | `command-palette` |
| Right-click or long-press menu | `context-menu` |
| Button that blooms into a menu | `bloom-menu` |
| Press button | `button-base` |
| Loading/success/error button | `button-stateful` |
| Magnetic button | `button-magnetic` |
| Hold to confirm | `hold-action-button` |
| Slide to confirm | `slide-action-button` |
| Hover CTA with expanding arrow | `expanding-arrow-button` |
| Spinner, dots, bars loader | `loader` |
| Agent thinking status | `thinking-shimmer` |
| Cycling reasoning phrases | `reasoning-text` |
| Timed agent progress glyph | `agent-progress` |
| Shimmer headline text | `text-shimmer` |
| Word or letter reveal | `text-reveal` |
| Chromatic cycling word | `chromatic-text-reveal` |
| Slot-machine letters | `text-cascade` |
| Scramble resolving text | `text-scramble` |
| Rolling digits | `number-ticker` |
| Count-up on view | `animated-number` |
| Tick-dot slider | `range-slider` |
| Inline label slider | `range-slider-inline` |
| Liquid fill slider | `range-slider-fluid` |
| Equalizer slider | `range-slider-wave` |
| Tilting value bubble slider | `range-slider-bubble` |
| Ruler slider | `range-slider-ruler` |
| iOS wheel picker | `wheel-picker` |
| macOS dock | `dock` |
| Icon actions with labels | `expandable-action-bar` |
| Overflow action rail | `overflow-actions` |
| Icon tabs with active label | `expandable-tabs` |
| Morphing tab content room | `morphing-tabs` |
| Pill or underline tabs | `tabs` |
| Hover gliding background | `shared-layout-bg` |
| Preview ticks or rail | `preview-rail` |
| Dynamic Island | `dynamic-island` |
| Swipe row actions | `swipeable-list` |
| Pull to refresh | `pull-to-refresh` |
| Basic upload queue | `file-upload` |
| Mixed file, audio, image attachments | `attachment-upload` |
| OTP or PIN boxes | `otp-input` |
| Sign-up form | `signup-form` |
| Theme wipe | `theme-toggle` |
| Shader background | `shader-background` |
| Cylinder carousel | `cylinder-carousel` |
| Logo or text marquee | `marquee` |
| Data table | `table` |
| Activity heatmap, contribution graph | `heat-calendar` |
| Monthly returns grid | `returns-calendar` |
| Analyst price target chart, forecast fan | `price-target-fan` |
| Editable table | `table-editable` |
| Async table | `table-async` |
| Tournament bracket | `knockout-bracket` |
| Radial tournament wheel | `knockout-wheel` |
| 404 page | `not-found-glitch` |
| Project folder card | `project-folder` |
| Token or chain swap | `swap` |
| Weekly availability editor | `availability-scheduler` |
| Wallet overview card | `wallet-card` |
| Prediction market ticket | `prediction-market` |
| Feedback popup | `feedback-widget` |
| Infinite masonry grid | `infinite-masonry` |
| Accordion | `bouncy-accordion` |
| 3D tilt card | `tilt-card` |
| Tooltip | `tooltip` |
| Switch, checkbox, radio, input | `switch`, `checkbox`, `radio`, `input` |

## In this repository

Follow `AGENTS.md` when contributing. A public component includes source, preview,
registry entry and a passing `bun run check:registry`. Document custom additions
in the entry index and bundled reference so the skill can describe their APIs.

Chart components (`heat-calendar`, `returns-calendar`, `price-target-fan`) live
under `/charts` in the docs. Their official install slugs remain available.

`HeatCalendar` provides `HeatCalendarGrid`, `HeatCalendarLegend` and
`HeatCalendarTooltip`; `ReturnsCalendar` provides `ReturnsCalendarGrid` and
`ReturnsCalendarTooltip`. Put each calendar tooltip inside its grid. Both accept
`selection`, `defaultSelection` and `onSelectionChange`.

`PriceTargetFan` provides Header, Plot, Svg, Axes, History, Targets, Now, Cursor
and Tooltip parts (prefix each with `PriceTargetFan`). Put SVG parts inside Svg
and Tooltip beside Svg inside Plot. Pass `current`, `targets` and optional
chronological `history` of `{ date: ISOString, price }`. Omitted history renders
no historical series. `active`, `defaultActive` and `onActiveChange` control the
readout. Chart hooks and render-function tooltips support custom composition.
Sample data belongs in the consuming app. `HeatCalendar.endDate` uses the UTC date.
