# Product page compositions

These client components compose the existing semantic theme and motion library. They do not fetch private content, create accounts, report real monitoring health, or perform checkout by themselves. Every preview is a complete copyable example with explicitly local demonstration state.

## Sources and variants

- `components/motion/waitlist-pages.tsx`: `WaitlistEarlyAccess` (centered signup, live countdown, host-supplied product preview) and `WaitlistBlueprintLaunch` (grid canvas, selected headline word, dominant countdown). Both accept real `onSubscribe` and optional `onInvite` callbacks. `highlightWord` selects the blueprint headline treatment; by default the last word is selected.
- `components/motion/status-pages.tsx`: `StatusOverview` and `IncidentResponse`. Supply published services, per-day history, incidents, and updates. Overview derives health only from supplied service states; missing or unknown data is not described as operational. Select uptime bars to inspect a recorded day, reveal historical incidents, and expand incident details. The response page follows host incident updates and passes the incident ID to its subscription callback.
- `components/motion/pricing-pages.tsx`: `PlanExplorer`, composed from the existing `Switch` and `InlineSlider`. Monthly and annual per-editor rates are host data. Annual checkout total is `annualPerEditor × editors × 12`; monthly total is `monthlyPerEditor × editors`. Prices displayed above the total are always per editor per month. Controlled/uncontrolled billing and editor count are supported. Plan focus follows team-size recommendation until a comparison is explicitly selected; moving the slider restores automatic recommendation. Checkout is exclusively host-owned; a resolved callback is never described as a completed purchase.
- `components/motion/search-pages.tsx`: `SearchResultsPage` ranks local host-supplied items with title-prefix/title/body relevance, filters by type and product area, groups the current result page, and exposes a selected-result preview. It supports controlled/uncontrolled `ProductSearchState`, pagination, loading, error/retry, reset, and suggestion searches. Arrow keys select a result, Enter follows its real URL, and Escape clears the query.
- `components/motion/docs-pages.tsx`: `DocsArticlePage` accepts article sections, navigation, code, install commands, payload fields, delivery steps, adjacent links, and optional asynchronous feedback. Scroll tracking and anchor navigation use instance-scoped IDs. On mobile the in-flow directory opens with its native disclosure; Escape closes it and restores summary focus. There is no hidden modal or focus trap. `ProductPageCode` reuses the existing `CodeBlock` renderer with explicit clipboard success/denied/unavailable states.

## Host integration rules

Subscription callbacks must resolve only after the host records the address, and reject with a safe customer-visible error on failure. Pending controls prevent duplicate submission. Email validation runs before the callback. Invitation callbacks must return a real host-generated URL. Preview signup and invitation handlers are intentionally local demos, not production services.

Provide timezone-bearing ISO launch/update timestamps. Countdowns tick once per second, stop numerically at zero, display the UTC launch time, and clean up their interval on unmount. Published status timestamps and uptime-date context are explicitly UTC. Incident updates are shown newest first; they are not generated or polled locally.

Search URL synchronization is **off by default**, avoiding interference with an embedding application. Opt in with a unique `urlPrefix`, such as `knowledge-`. The component reads `<prefix>q`, `<prefix>type`, `<prefix>area`, and `<prefix>page` when uncontrolled, writes edits with `history.replaceState` while preserving unrelated URL fields, and listens to `popstate`. Controlled mode writes user edits and leaves external navigation/value synchronization to the host. No search history entries are added per keystroke.

All article text, links, code strings, pricing, monitoring data and async service operations belong to the host. Server checkout remains authoritative for currency precision, entitlements, and charging. The reusable pages never contain preview fixture data.

## Verification boundaries

Central DOM interaction verification covers all seven public variants: validation/retry, host callbacks, invitation output, status history and uptime detail, annual billing arithmetic, slider keyboard behavior, comparison focus, ranked search/filter/pagination/URL/keyboard states, clipboard content and denial, mobile directory dismissal/focus, and documentation feedback.

Run repository acceptance with `bun run check`, `bun test`, and the public MCP typecheck. DOM verification cannot prove layout, responsive breakpoints, scroll geometry, reduced-motion appearance or shared-layout animation. Real-browser review must cover the waitlist canvases, overview/history and incident resolution, slider/billing/comparison, keyboard search, three-column docs, scrolling outline/progress, mobile directory and actual clipboard permissions.
