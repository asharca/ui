# Component catalog and ToolPlane alignment

This work continues PR #3 without publishing a version or changing runtime peers.
The catalog now gives every documented component its own runnable TSX demo,
copyable source, API table and integration notes. Compound primitives are shown
in context (for example FieldLabel/Description/Error and Dialog/Popover children).
`showcase/ComponentDemos.tsx` is the authoritative catalog; tests require unique
IDs, unique demo files, real public exports and existing implementation files.

## ToolPlane reference

Reviewed `asharca/ToolPlane`, revision
`cdaf6e25740fc42a808b76111d8adf97a2b733f0`, especially
`src/components/dashboard/agents/AgentConversation.tsx`.
The library keeps ToolPlane's separation: a host owns routing, transport,
persistence, permission decisions and preference storage. UI owns presentation
and interaction. No business API or Next.js dependency was copied into the package.

Aligned interaction patterns:
- composer tools can have groups, descriptions, pressed state and `pinable: false`;
- pinned IDs are ordered, controlled and deduplicated;
- async actions report failures and cannot be submitted repeatedly while pending;
- tool execution cards distinguish pending/running/approval/completion/failure/
  rejection/cancellation, with guarded approval and retry feedback;
- hosts can supply `getToolPresentation` and `components.ToolCall` or
  `components.Reasoning` rather than relying on tool-name conventions;
- the chat demo streams local text, supports cancellation and displays tool
  process fixtures; it never calls a real model or executes real tools.

## Additive public APIs

`ToolCallCard` is exported from the root, `chat-thread` and `tool-call-card`.
It accepts `name`, `state`, optional `input`, `output`, `presentation`, `labels`,
`previewChars` and `onApprove`. Collapsed cards do not serialize results. Initial
previews bound object traversal as well as output length. Explicit full-result
expansion can still be expensive for very large objects; hosts should use custom
renderers or download links for unbounded data.

`ChatThread` retains existing slots, runtime, branch, attachment and action APIs.
New optional props are `getToolPresentation`, `toolResultPreviewChars`,
`onActionError`; its components map adds ToolCall and Reasoning.

`ChatComposerToolbar` adds async `onSelect`, tool `group` and `pinable`, and
`onActionError`/`onActionComplete`. Permissions remain a server-side host concern.

`WorkspaceTabBar` adds `closable` per tab, `closeOnDoubleClick`,
`closeOnMiddleClick` and `showReorderButtons`. Defaults preserve previous mouse
behavior. New applications can set `closeOnDoubleClick={false}`. Arrow/Home/End
navigation, Alt+Shift+Arrow reordering and Delete-to-close provide keyboard paths.
The host decides what happens to unsaved content.

`zhCN` is an optional root export containing chatThread, conversationSidebar,
composerToolbar and toolCall label presets. Existing host translation systems
remain supported.

## Themes and accessibility

Original HSL variables and Tailwind source scanning are retained in
`src/styles.base.css`; the public `styles.css` imports it and adds shared focus,
read-only, radius, coarse-pointer, forced-color and reduced-motion refinements.
Both files are included in package files and sideEffects metadata.

Additional CSS variables: `--toolplane-ui-control-height`,
`--toolplane-ui-focus-width`, `--toolplane-ui-avatar-size`,
`--toolplane-ui-chat-width`, `--toolplane-ui-composer-radius`.

Portal content still uses Radix's portal model. A local themed ancestor does not
magically style content mounted under body. Choose an appropriate portal container
or apply the theme globally; automatic scoped-theme propagation is not implemented.

## Showcase

The directory is grouped into controls, forms/feedback, data/layout,
navigation/overlays, AI chat and workspace. Component metadata does not eagerly
import chat runtimes. Demos, full source, manual and workbench load on demand.
The default preview remains inline; 375/768/1280 previews are actual iframe
viewports. Each preview can be reset or opened independently.

Every demo imports `../../src/index`; the displayed source changes that to the
public `@asharca/ui` import. Demos do not import each other. Photos in AvatarDemo
are illustrative local assets and must be replaced when copying into another app.

## Validation

Run the following from the repository root:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm build:showcase
pnpm test:examples
pnpm test
pnpm test:package
```

`test:examples` checks every standalone demo against built public declarations,
not aliases to source. Unit regressions cover the catalog, viewport routes,
copyable source, tool cards, approvals, async composer tools and keyboard controls.
Check the PR for the exact tested commit and actual results.

Known pre-existing fresh-install blocker: the fixed assistant-ui runtime's
transitive core/cloud peer combination can fail the strict consumer install.
This work does not disable strict peer checks or hide that failure. Browser-based
visual regression, touch and screen-reader acceptance remain separate checks;
jsdom tests are not a substitute for those checks.
