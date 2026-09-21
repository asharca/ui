# Component Studio redesign

> Initial iteration. See [Reference-led rework](./REFERENCE-REWORK.md) for the
> subsequent redesign and licensed beUI adaptations. Its source ledger
> supersedes the original no-third-party-code statement.

## Direction

Replace the single-form landing page and text-first catalog with an editorial
component studio. Use neutral surfaces, deliberate whitespace, restrained
borders, a clear type hierarchy, and real interaction rather than decorative
background effects. Retain Chinese documentation and the existing package API.

References (inspiration, not copied code or assets):

- https://www.beautifului.dev/ — AI interaction states and composed interfaces.
- https://beui.dev/ — tangible control feedback and live demonstrations.
- https://transitions.dev/ — continuous transitions that connect states.
- https://www.rareui.com/ — a curated, preview-led component collection.
- https://ui.shadcn.com/ — calm documentation chrome and reusable primitives.

## What changed

The homepage has an interactive four-part showroom: a native project form,
a locally simulated assistant/tool call, a tab-motion specimen and button
feedback. Six canonical component demos and three existing app examples connect
the showroom to usable code. Demo actions explicitly do not create projects,
call models, or connect services.

The component catalog uses the canonical componentDocs data, combinable search
and category filters, grid/list modes, per-tile reset and real previews. It does
not render links around interactive controls. Previews mount once near the
scroll viewport, with a manual-load fallback when IntersectionObserver is not
available. Switching layout removes previews; it is not a persistence feature.

The documentation keeps its router, search, mobile navigation, API, AI Markdown
and copy/source contracts. The canvas has plain/dot/grid backgrounds and existing
viewport, theme and reset controls. Background changes and code-tab switches do
not remount the inline preview; explicit reset and viewport changes do.

The published optional styles refine buttons, choices, tabs, chips, surfaces,
menus and tool-call feedback. Tabs use a measured CSS pseudo-element that moves
between actual Radix triggers without adding focus targets or changing the DOM.
The marker tracks resize, dynamic tabs, orientation and inherited direction.
Unmeasurable lists retain their original selected state, and reduced-motion /
forced-color preferences have explicit fallbacks. Consumer utility overrides
remain above the component layer.

## Guardrails

No new dependencies, version bump, package rename, registry protocol, copied
third-party assets, remote API calls, merge or publication. The three existing
skins and density controls remain. Sidebar folding and DataTable selection
logic and their regression tests are unchanged.

## Validation

`tests/unit/component-studio.test.tsx` covers filtering, layout, empty results,
manual preview/reset, TabsList asChild/refs/keyboard, preview state preservation
and local assistant behavior. The existing site browser regression additionally
covers complete screenshots, combined filters, backgrounds, real interpolated
tab movement, reduced motion and RTL. All earlier browser and package checks
remain enabled. Test outcomes are recorded in PR/CI rather than assumed here.
