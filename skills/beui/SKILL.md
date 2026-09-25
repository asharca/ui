---
name: beui
description: "Build UI with two sources: unchanged beUI components use the official @beui installation and APIs; Asharca-added or modified components use asharca/ui source and local usage. Use for React motion, agent/chat interfaces, workspace shells, browser-like tab bars, and updating customized components. No self-hosted website or MCP is required."
---

# Asharca UI + beUI

Keep the existing skill name `beui` for installation compatibility. This is the
**asharca/ui edition**, not the unmodified official skill. Read the bundled
[source policy](source-policy.json) before choosing an installation source.

## Source decision — before discovery or installation

1. Inspect the consuming project's existing components, aliases, dependencies,
   theme, and local changes first. Already installed/customized files win; do not
   overwrite them just because an upstream component has the same name.
2. **Project-owned components:** use the entries in `source-policy.json` and
   [local installation and usage](references/workspace.md). This currently means
   `workspace-shell`, `workspace-tab-bar`, and the `WorkspaceSidebar` companion
   included with the shell. Use the actual named exports/props in asharca/ui.
3. **Unchanged components:** use the official workflow below, including official
   `@beui/<slug>` commands and beUI documentation. Routine site branding, removed
   marketing, or edited demo text does not make an unchanged UI primitive a fork.
4. **A new/unknown local modification:** inspect the source and its transitive
   helpers against the pinned upstream baseline recorded in the policy. If a
   component OR one of its required helpers differs intentionally, treat every
   affected install entry as project-owned and add it to the policy before release.
   Never infer "official" solely from an unchanged filename. When the comparison
   cannot be made, preserve the local code and report what still needs checking.

The policy separates ownership from API names: ordinary `tabs` is not the
Asharca `WorkspaceTabBar`, and ordinary `chat-app` is not its inset workspace.
Do not install an official lookalike as a fallback when a project component is
unavailable. Do not invent published `@asharca` or official workspace slugs.

## Project workflow — no deployment or MCP

Use an explicitly supplied local asharca/ui checkout first. A skill installation
contains these instructions/references; **it does not install the UI repository**.
If necessary, obtain the repository/ref in `source-policy.json`, record
`git rev-parse HEAD`, and read that same snapshot throughout the task. Until this
branch is merged, do not clone the default branch and claim it has the workspace.
Never reset, clean, or force-pull a user's dirty checkout.

From that source checkout (not the consuming project), install locked build-time
dependencies when needed and export the selected local entry:

```bash
bun install --frozen-lockfile
bun scripts/export-component.ts workspace-shell --out /absolute/new-directory/workspace-shell.json
```

This reads the existing source dependency graph and writes self-contained JSON.
It does not start Next.js, build the website, deploy a service, or modify the
consumer. Choose a new output path; the exporter refuses existing output files.
The exported item includes its required beUI primitives/helpers from the SAME
snapshot; do not replace that closure with arbitrarily newer official files.

Then in the already configured consuming project:

```bash
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --dry-run
npx shadcn@latest add /absolute/new-directory/workspace-shell.json --diff
# After reviewing every affected file and dependency:
npx shadcn@latest add /absolute/new-directory/workspace-shell.json
```

Use the user's package runner; `--overwrite` is not the default. Existing files
must be reviewed/merged, especially shared `lib/utils`, `lib/ease`, hooks and
`components/motion/*`. A local JSON path is not a URL or a source .tsx file.
Without Bun, follow the manual source-graph procedure in the bundled reference;
never require a running registry server or silently switch to the upstream copy.

## Official workflow — unchanged components only

MCP is optional. A previously configured official MCP may help inspect an
unchanged upstream component, but cannot supply this repository's workspace or
local modifications. No MCP connection is needed to use this skill.

1. Discover official install names from the live official catalog:

```bash
curl -fsS https://beui.dev/r/registry.json
```

For unchanged components, the live registry is the source of truth for currently
available upstream install slugs (`items[].name`). It is NOT the source of truth
for Asharca modifications. A documentation page slug may have several separately
installable variants. The picker below is guidance, not a frozen online catalog.

2. Inspect and install only the verified official item:

```bash
npx shadcn@latest view @beui/<slug>
npx shadcn@latest add @beui/<slug> --dry-run
npx shadcn@latest add @beui/<slug>
# Or: pnpm dlx shadcn@latest add @beui/<slug>
# Or: bunx --bun shadcn@latest add @beui/<slug>
```

Read the installed named exports and current official usage; there is no `beui`
runtime package. Official CLI/registry use can require internet access, but it
never requires the user to deploy a website or MCP. If offline, use an available
source snapshot and state its version; do not invent a live verification result.

## Coexistence and updates

Both sources may be used in one application. Their source files can overlap even
when install slugs differ. Review the WHOLE proposed file list before either
installation and never let an official update overwrite an Asharca-modified
primitive/helper or a consumer's customization. Keep compatible React, Tailwind,
and Motion dependencies and the consumer's existing theme/aliases.

Record source repository, ref/commit, entry slug and destination files in the
consumer's own update notes. Upgrade official entries through official diffs;
re-export project entries from the chosen asharca/ui revision and compare that
JSON. Where both the consumer and upstream changed, merge deliberately and test.
A manifest classifies sources; it is not an automatic three-way merge engine.

Validate with the project's type/lint/unit commands. In asharca/ui, use
`bun run check` and `bun test`; do not start servers, run builds/browser tests, or
take screenshots unless the user separately asks. Credentials and model calls
belong to the host application, not this skill.

## Official component picker

| User asks for | Install `@beui/...` | Avoid |
| --- | --- | --- |
| Toast or snackbar | `animated-toast-stack` | `notification-stack` |
| Expanding notification inbox | `notification-stack` | `animated-toast-stack` |
| Mobile bottom sheet, Vaul-style panel | `bottom-sheet` | `drawer` |
| Side panel or app drawer | `drawer` | `bottom-sheet` |
| App chrome sidebar | `animated-sidebar` | `bounce-sidebar`, `ai-sidebar` |
| AI files, folders, bookmarks | `ai-sidebar` | `animated-sidebar` |
| Standard beUI chat layout (no Asharca tabs) | `chat-app` | custom chat shell |
| Streaming thread that follows tokens | `message-scroller`, `message` | custom scroll math |
| Just a chat bubble | `message-bubble` | custom bubble |
| Prompt box or composer | `prompt-input` | textarea plus custom buttons |
| Agent reasoning, search, tool trace | `agent-activity` | plain log list |
| Task plan | `todo-list` | custom checklist |
| Code surface | `code-block` | pre/code from scratch |
| File diff | `file-diff` | custom diff renderer |
| Tool output | `tool-result` | raw terminal block |
| Tool permission card | `tool-approval` | alert dialog |
| Approval or HITL question | `approval-card` | custom form |
| Inline citations | `citations` | plain numbered links |
| Generated image canvas | `image-generation` | image card from scratch |
| Liquid popover | `popover` | `popover-morph` |
| Corner morph popover | `popover-morph` | `popover` |
| Dropdown select | `select` | `select-morph`, `combobox` |
| Select that grows into panel | `select-morph` | `select` |
| Searchable select | `combobox` | `select` |
| Cmd+K palette | `command-palette` | `combobox` |
| Right-click or long-press menu | `context-menu` | `bloom-menu` |
| Button that blooms into a menu | `bloom-menu` | `context-menu` |
| Press button | `button-base` | custom `motion.button` |
| Loading/success/error button | `button-stateful` | spinner button |
| Magnetic button | `button-magnetic` | custom pointer tracking |
| Hold to confirm | `hold-action-button` | `button-base` |
| Slide to confirm | `slide-action-button` | `swipeable-list` |
| Hover CTA with expanding arrow | `expanding-arrow-button` | `button-base` |
| Spinner, dots, bars loader | `loader` | `thinking-shimmer` |
| Agent thinking status | `thinking-shimmer` | `loader`, `text-shimmer` |
| Cycling reasoning phrases | `reasoning-text` | `text-cascade` |
| Timed agent progress glyph | `agent-progress` | `loader` |
| Shimmer headline text | `text-shimmer` | `thinking-shimmer` |
| Word or letter reveal | `text-reveal` | `text-cascade` |
| Chromatic cycling word | `chromatic-text-reveal` | `text-shimmer` |
| Slot-machine letters | `text-cascade` | `text-scramble` |
| Scramble resolving text | `text-scramble` | `text-cascade` |
| Rolling digits | `number-ticker` | `animated-number` |
| Count-up on view | `animated-number` | `number-ticker` |
| Tick-dot slider | `range-slider` | other `range-slider-*` |
| Inline label slider | `range-slider-inline` | `range-slider` |
| Liquid fill slider | `range-slider-fluid` | `range-slider` |
| Equalizer slider | `range-slider-wave` | `range-slider` |
| Tilting value bubble slider | `range-slider-bubble` | `range-slider` |
| Ruler slider | `range-slider-ruler` | `range-slider` |
| iOS wheel picker | `wheel-picker` | `select` |
| macOS dock | `dock` | `expandable-action-bar` |
| Icon actions with labels | `expandable-action-bar` | `dock` |
| Overflow action rail | `overflow-actions` | `dock` |
| Icon tabs with active label | `expandable-tabs` | `tabs` |
| Morphing tab content room | `morphing-tabs` | `tabs` |
| Pill or underline tabs | `tabs` | `expandable-tabs` |
| Hover gliding background | `shared-layout-bg` | `tabs` |
| Preview ticks or rail | `preview-rail` | `bounce-sidebar` |
| Dynamic Island | `dynamic-island` | `notification-stack` |
| Swipe row actions | `swipeable-list` | `slide-action-button` |
| Pull to refresh | `pull-to-refresh` | custom touch math |
| Basic upload queue | `file-upload` | `attachment-upload` |
| Mixed file, audio, image attachments | `attachment-upload` | `file-upload` |
| OTP or PIN boxes | `otp-input` | `input` |
| Sign-up form | `signup-form` | manual form assembly |
| Theme wipe | `theme-toggle` | class toggle only |
| Shader background | `shader-background` | custom canvas |
| Cylinder carousel | `cylinder-carousel` | `marquee` |
| Logo or text marquee | `marquee` | `cylinder-carousel` |
| Data table | `table` | HTML table from scratch |
| Activity heatmap, contribution graph | `heat-calendar` | custom grid |
| Monthly returns grid | `returns-calendar` | `heat-calendar` |
| Analyst price target chart, forecast fan | `price-target-fan` | custom svg chart |
| Editable table | `table-editable` | `table` |
| Async table | `table-async` | `table` |
| Tournament bracket | `knockout-bracket` | `knockout-wheel` |
| Radial tournament wheel | `knockout-wheel` | `knockout-bracket` |
| 404 page | `not-found-glitch` | custom 404 |
| Project folder card | `project-folder` | folder card from scratch |
| Token or chain swap | `swap` | custom swap form |
| Weekly availability editor | `availability-scheduler` | custom calendar grid |
| Wallet overview card | `wallet-card` | custom wallet card |
| Prediction market ticket | `prediction-market` | custom trade ticket |
| Feedback popup | `feedback-widget` | `animated-toast-stack` |
| Infinite masonry grid | `infinite-masonry` | CSS columns |
| Accordion | `bouncy-accordion` | custom accordion |
| 3D tilt card | `tilt-card` | custom glare math |
| Tooltip | `tooltip` | `popover` |
| Switch, checkbox, radio, input | `switch`, `checkbox`, `radio`, `input` | restyled native controls |

## Composition rules

- Prefer installed source and preserve local modifications; choose its update source before running an installer.
- Import named exports from the files shadcn adds.
- Use `className` for layout and small styling changes. Do not fork internals unless the user asks.
- Keep helpers installed by the registry, such as `@/lib/ease`, `@/lib/utils`, and hooks.
- If adding new motion around beUI components, use `useReducedMotion()` from `motion/react`.
- Gate decorative hover effects like magnetic pull and tilt behind `useHoverCapable()`.
- Prefer `transform` and `opacity`. Keep the existing workspace layout/height animations rather than replacing its tested geometry.

## In this repo

When contributing to asharca/ui, follow `AGENTS.md` and the source policy above. A new public component needs source, preview, registry entry, and a passing `bun run check:registry`. Never rename existing `/r/{name}.json` slugs.

Chart components (`heat-calendar`, `returns-calendar`, `price-target-fan`) live under `/charts` in the docs. Their `@beui` install slugs are unchanged.

Compose charts from their root and exported parts. `HeatCalendar` provides `HeatCalendarGrid`, `HeatCalendarLegend`, and `HeatCalendarTooltip`; `ReturnsCalendar` provides `ReturnsCalendarGrid` and `ReturnsCalendarTooltip`. Put each calendar tooltip inside its grid. Both accept `selection`, `defaultSelection`, and `onSelectionChange`.

`PriceTargetFan` provides Header, Plot, Svg, Axes, History, Targets, Now, Cursor, Tooltip parts (prefix each with `PriceTargetFan`). Put SVG parts inside Svg and put Tooltip beside Svg inside Plot. Pass `current`, `targets`, and an optional chronological `history` of `{ date: ISOString, price }`; omitted history renders no historical series. Use `active`, `defaultActive`, and `onActiveChange` to control the readout. Each chart exports a `use...` hook for custom descendant content; tooltip children may be a render function. Sample data belongs in the consuming app, not the chart implementation. `HeatCalendar.endDate` uses the UTC calendar date.
