# Asharca workspace on beUI

Source baseline: starc007/ui-components@1e23f4b10a404c17d9649086cf561e152527e2de (MIT).
This replaces the previous Vite/Registry application with the upstream Next.js/Bun project.
The GitHub repository identity is retained; importing a source tree does not establish GitHub's fork-network metadata.
The workspace additions will be kept under components/workspace and the existing beUI catalog.

Previous snapshots:
- archive/pre-beui-rebuild-main-2026-09-24: d40773d2c39ddf8b216b9d0851f80eb192b7fc09
- archive/pre-beui-rebuild-agents-2026-09-24: a2a90e5879e05378a661ca8ec0b6c8ea8a56c4ab

Upstream deployment workflows are intentionally not enabled in this repository.

## Selected component sync — 2026-10-10

Imported the 14 new catalog entries from [`starc007/ui-components@9deb728d936b5f89c859ab6c1f169235aa24b3ad`](https://github.com/starc007/ui-components/commit/9deb728d936b5f89c859ab6c1f169235aa24b3ad), including their source dependencies, previews, public usage compositions and upstream accessibility/behavior tests:

- Motion: `alert`, `collapsible`, `aspect-ratio`, `arc-picker`, `sortable-stack`, `image-viewer`, `date-range-picker`, `color-selector`, `breadcrumb`.
- Charts: `treemap`, `volume-profile`, `status-bar`, `composition-chart`.
- Agents: `voice-orb`.

`image-viewer` installs as `@beui/morphing-lightbox`; `sortable-stack` retains its upstream install slug despite its Sortable List display name. Native tab props, positioned morph-popover autofocus/viewport fitting and cursor-following tooltips were integrated into the existing local primitives. The image viewer includes the upstream modal focus/scroll scope. No new npm dependency was needed.

Publication dates preserve upstream dates; local launch and affected bundle update dates are 2026-10-10. This is a selected component import, not a full upstream merge: the original baseline above remains unchanged, and local Workspace, deployment, branding, tests and in-progress edits are retained.

Verified the isolated PR snapshot with `bun run check` (106 catalog components), public MCP typechecking, and all 625 tests using `NODE_OPTIONS=--experimental-strip-types bun test`. Node 22.12 needs this flag for the existing docs-highlighter test's direct TypeScript import. All 14 new install JSON and markdown route handlers returned 200 with their source bundles. The pre-existing InlineSlider regression now waits for its frame-scheduled accessible readout instead of assuming thumb movement and React state commit together; a DOM smoke also confirmed drag readout and cancellation of pending drag commits on release. Component runtime behavior is unchanged by this test repair. Browser/WebGL visuals were not exercised; the test suite still emits non-failing Motion/React warnings.

## Downstream changes

- `components/workspace/*`: only the custom workspace shell, tabs and native beUI sidebar composition.
- `app/workspace`: independent demo without documentation chrome.
- beUI catalog/previews: two new block entries with self-hosted install URLs.
- Root layout uses the existing bundled Geist font package instead of build-time Google font downloads, and does not load upstream analytics.
- `.github/workflows/ci.yml`: static checks, unit tests and public MCP typechecking only; no app server, build, browser or screenshot steps.
- Paid-product promotion, the private MCP/authentication stack and the licensed-content skill are removed; public components and source attribution remain.
- The previous `registry/ui`, Vite `site`, `agent-internal-*` migration and their build pipeline are not carried over.

Read `docs/workspace.md` for development, changed entry points and deployment requirements.
