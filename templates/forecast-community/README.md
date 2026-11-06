# Forecast Community

An original, self-contained prediction community application implementing the public Hunch Prediction Markets frontend feature set. The package is `@asharca/forecast-community-template`; it uses Next.js 16.3.8, React 19, strict TypeScript and Tailwind 4. No paid source, branded assets, private registry or external fonts are used.

## Run and export

The integration owner must first materialize these existing beUI source bundles, including their complete transitive source dependencies, into this directory: `button`, `morphing-modal`, `prediction-market` (including its market-card extra file), `line-chart`, and `table`. Application code imports those local copies through `@/components/…` and `@/lib/…`. There are no parent-directory runtime imports or workspace dependencies.

From this directory, after that source integration:

```sh
bun install
bun run dev
bun run typecheck
bun run build
```

Deploy `out/` to a static host with directory-index support. The Next configuration uses static export and trailing slashes. There are no server actions, API routes, environment variables, wallet secrets or required external services. Every market and sample profile route is generated at build time; adding records to `features/forecast/data.ts` adds their static routes on the next build.

## Routes and interactions

- `/`: Distinct binary, multiple-outcome and resolved market listings; topic filters, search, trending/closing sort, persistent watchlist, direct outcome selection and links into market discussions. The introductory artwork is CSS and typography, not a remote asset.
- `/markets/[marketId]/`: Outcome probability history with 24H/3D/7D sample-range selection, existing interactive chart inspection/legend and accessible data table; clear resolution rules and public-source links; fixed-price local Buy/Sell ticket; persistent shares, cost basis, balance and transaction records; responsive mobile trade sheet; share-link clipboard with a permission-failure message; profile-linked replies.
- `/rewards/`: Search and category filters, actual trade/reply eligibility, progress, one-time collection, persisted claimed status and local balance credits.
- `/leaderboard/`: Weekly and all-time sample rankings with different ordering, profile navigation and persistent follow/unfollow.
- `/profile/me/`: Local display name and bio editing, local wallet identity, balance, following and replies; explicit connect/disconnect. Disconnect preserves saved data; it is not an external logout.
- `/profile/river/`, `/profile/noor/`, `/profile/alex/`: Fictional sample wallet profiles, sample accuracy/call statistics, follow controls and linked market notes.
- `/portfolio/`: Persisted positions, shares, average cost, fixed-price valuation, unrealized P/L, position-management links, simulated faucet deposits/withdrawals and sortable/filterable transaction history using the existing table primitive.
- `/drafts/`: Private market-draft creation and editing, binary or 2–8 unique outcomes, closing date/topic/context/resolution rules, saved draft restoration and confirmed deletion. Drafts do not silently publish into the market catalog.

The shell supplies a skip link, meaningful route navigation, responsive mobile navigation with Escape/focus return, local identity connection, persistent light/dark/system appearance and global action/error feedback. Existing modal primitives provide body portals, nested focus management, Escape and return focus. Existing motion primitives plus the application stylesheet respect reduced motion.

## Local controller and host boundary

All prices, balances, authentication, identities, rankings, rewards, replies and transactions are explicitly local demonstrations. Initial credit is 1,000 demo USDC, with no cash value. No real wallet is connected, no transaction is signed, no external authentication occurs, and no on-chain or network settlement is implied. Historical values are illustrative samples, not live feeds. Public resolution links are references, not monitored data integrations.

`features/forecast/model.ts` owns `Command`, `ForecastState`, `ForecastService` and `ForecastPersistence`. The default `localForecastService` really applies each local command; it rejects unauthenticated protected actions, closed/resolved markets, overdrafts, oversells, invalid drafts and ineligible or duplicate reward claims. Buying uses demo USDC, selling uses shares. Prices stay fixed; there are no trading fees, slippage, order book or automatic market resolution. The bundled resolved market is read-only and demonstrates final-result presentation.

`ForecastProvider` accepts injectable `service` and `persistence` contracts. A service implements `execute(state, command)` and returns the complete next state, synchronously or asynchronously; a persistence adapter implements `load()` and `save(serializedState)`. Both are explicit host boundaries, not invented bundled HTTP endpoints. Keep production authorization, price validation, settlement and secrets on a real host service. Never trust the browser’s local balance as financial state.

The shared prediction ticket’s amount/outcome/Buy-Sell controls are reused, but its decorative timed success action is hidden. The application’s visible submission action invokes the real controller and reports success only after persistence commits. The fixed-order header’s nonfunctional dropdown affordance is hidden because this demo has no alternative order types.

`features/forecast/usage.tsx` is a copyable full-page composition, and `features/forecast/preview.tsx` exports the interactive `ForecastCommunityPreview`. Both require a normal Next router context and the app theme. Existing `app/layout.tsx` already wraps routes with the provider and shell, so do not nest another full-page composition inside that layout.

## Persistence and errors

Browser state is restored after mount from `localStorage` key `forecast-community:v1`; SSR/static generation never reads browser storage. Watchlist, following, local identity, profile, appearance, holdings, balance, history, claimed rewards, replies and drafts survive route navigation and provider remount/reload. Commands are serialized while pending, and storage is committed before visible state. Storage failure or a rejected host action leaves the prior UI/balance intact and produces an error rather than a successful-looking trade.

Malformed or unsupported storage is retained, reported, and blocks mutation until the user explicitly resets unreadable local data. A failed reset reports browser-storage unavailability. Do not store sensitive production identities or financial information in this demo. This controller does not promise synchronization or conflict resolution between multiple browser tabs.

## Integration verification handoff

No checks, formatters, build, server or browser were run by this slice owner. After source materialization, main should run:

```sh
# Repository root:
bun tests/web-smoke-AppForecast.tsx
# Application directory:
bun run typecheck
bun run build
```

The temporary executable smoke mounts the actual provider, shell and exported screens. It prepares discovery/auth/theme/watchlist/routing, binary Buy/Sell/error, multi-outcome trade, resolved read-only state, chart-range selection, reply, mobile-sheet Escape, reward collection, rank/follow/profile, funds/history, draft create/restore/edit/delete, complete cross-route persistence, storage failure without state mutation and malformed-data recovery assertions. It has not been executed by this slice owner.

Main must additionally review real-browser responsive layouts and touch behavior, tab/focus order, all dialogs’ containment/Escape/focus restoration, chart crosshair geometry and legend, clipboard-denial UX, OS-theme changes, reduced motion, mobile navigation/trade bar and full reload persistence. DOM smoke cannot establish visual or assistive-technology correctness. Market closing dates in sample content are intentional; expired questions reject new trades rather than silently remaining tradable.
