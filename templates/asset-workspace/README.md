# Orbit asset workspace

Independent implementation of the public **Folio Crypto Portfolio** capability overview. This is a complete standalone Next.js 16 / React 19 / strict TypeScript / Tailwind 4 application, not an installable single component. All content and visual treatment are original. It uses local system fonts and includes no paid source, tokens, wallet SDK, remote assets, or external API requests.

## Run and deploy

From this directory, install dependencies with `bun install`, then use `bun run dev`. Run `bun run typecheck` for this application's strict check and `bun run build` to emit the static `out/` directory. Deploy `out/` to a static host that serves directory `index.html` files. `next start` is intentionally not provided because this is a static export.

The integration owner materializes beUI's existing `button`, `input`, `selector`, `center-morph-modal`, and `line-chart` source bundles (including their complete internal dependencies) into this app's `components/` and `lib/` directories. After materialization there are no parent imports, symlinks, workspace protocol dependencies, remote fonts, or registry calls. Each app is independently installable.

## Routes and actual workflows

- `/login/`: local demo identity, validation, guest entry, sign-out; no password or real session.
- `/`: current liquid + staked principal valuation, allocation, interactive scenario chart, simulated swap dialog, latest activity.
- `/assets/`: symbol/name search, chain filters, available balances, follow/unfollow, swap accounting.
- `/assets/bitcoin/`, `/assets/ethereum/`, `/assets/solana/`, `/assets/usd-coin/`, `/assets/arbitrum/`, `/assets/avalanche/`: individual asset descriptions, balances, snapshot charts, follow controls, and focused swap flows. All are statically generated; unknown assets use the not-found page.
- `/wallets/`: validate and track public addresses, search/filter, copy addresses, confirmed removal. A tracked address is an address-book record, **not** a connected wallet or synchronized balance.
- `/activity/`: real local action history, text/type/network filters, inspectable details, JSON export. No fabricated chain transaction hash.
- `/staking/`: stake and unstake ETH/SOL/AVAX, available-balance validation, time-based illustrative APR accrual, and reward claims. Staked principal moves out of liquid balance; total portfolio includes it once. Claims credit liquid balance. Unstaking is intentionally immediate in this simulation.
- `/watchlist/`: persistent favorites, search/network filtering, actual unfollow controls and empty states.
- `/assistant/`: three selectable local response styles, portfolio-aware deterministic streaming, stop, persisted transcript, confirmed clear. It is explicitly not an AI provider connection.
- `/settings/`: light/dark/system theme, editable demo profile, sign-out, JSON export, confirmed reset requiring `RESET`, and integration disclosures.

Prices, changes, and chart scenarios are clearly labeled fixed reference examples. Scenario charts are not historic market data. The demo begins with illustrative balances and a seeded ETH staking position; tracking an address never invents holdings for that address. Swap outputs deduct a documented 0.3% illustrative fee. All balances are demo numbers, never funds.

## Persistence and failure handling

`features/portfolio/model.ts` owns the typed state, commands, validation, math, and serialization contract. `features/portfolio/provider.tsx` hydrates browser storage in an effect before rendering workspace screens, avoiding server access to browser APIs and accidental initial overwrite. Data uses `asset-workspace:v1` in localStorage. Invalid saved data is not overwritten; it can be exported before a confirmed reset. Unavailable storage leaves an explicit warning and an in-memory session with JSON export. Reload persistence is per browser origin; there is no server backup or cross-device account.

Profile, preferences, addresses, balance changes, staking timestamps, watchlist, action history, assistant model, and transcripts persist. No network success is simulated behind an unlabeled loading state. Service errors are surfaced, command writes are serialized, and failed local commands leave balances unchanged.

Exports contain the demo email, public addresses, and conversations. Treat them as potentially sensitive. Reset clears all workspace data and restores seed balances/profile/theme; it cannot modify anything on a chain.

## Copyable host integration

The default root layout already mounts the complete local app. To inject a real host boundary, provide a typed service object from a **client** composition:

```tsx
"use client";

import type { ReactNode } from "react";
import { PortfolioProvider } from "@/features/portfolio/provider";
import { Workspace } from "@/features/portfolio/workspace";
import { localServices, type AssetServices } from "@/features/portfolio/services";

const services: AssetServices = {
  ...localServices,
  // Keep the local implementation until your authenticated host adapter exists.
  // This is a working local service object, not a mock network connection.
};

export function AssetWorkspace({ children }: { children: ReactNode }) {
  return (
    <PortfolioProvider services={services}>
      <Workspace>{children}</Workspace>
    </PortfolioProvider>
  );
}
```

`AssetServices.signIn` returns a display profile; replace it with your host's actual auth/session architecture and enforce authorization server-side. A browser profile alone is never authorization. `AssetServices.execute(command, snapshot)` is the injectable boundary for tracked-address and execution workflows; the local implementation applies a typed pure command. A production system must separate address indexing from custody, obtain user consent, quote accurately, sign through the user's wallet, await settlement, and reconcile from the authoritative server/indexer. Do not simply substitute a remote URL and assume the local demo ledger is authoritative.

`AssetServices.assistant({prompt, model, snapshot, signal})` is an async iterable of text chunks. Honor the abort signal, authenticate provider calls in a server proxy, and keep keys outside client code. The model IDs here refer only to local presentation styles; replace them and their selector labels with your host-supported models when integrating a provider.

The typed `assets` catalog in `model.ts` is the single explicit market-data boundary. Replace its fixed values and the explicitly illustrative chart scenarios with a subscribed host market source before labeling any value live. A real indexer must supply per-address holdings; current tracked addresses intentionally have no invented balance data. The public local template does not claim exchange, AI, identity, or on-chain connectivity.

## Accessibility and visual behavior

Semantic page landmarks, skip link, labeled inputs and grouped selectors, visible keyboard focus, accessible beUI portalled menus/dialogs, Escape dismissal and focus restoration, confirmation forms, status/error messages, accessible chart data tables, responsive mobile navigation, and OS reduced-motion support are included. Themes subscribe to system appearance changes while System is selected.

## Integration verification (not executed during implementation)

From the repository root after source materialization:

```sh
bun tests/web-smoke-AppAssets.tsx
bun run --filter @asharca/asset-workspace-template typecheck
bun run --filter @asharca/asset-workspace-template build
```

The temporary smoke mounts actual app exports, manipulates rendered controls, and asserts balances, filtering, follow state, all six asset details, dialog dismissal, wallet add/remove, staking/unstaking/claims, activity, model streaming/stop, profile, themes, JSON export, reload restoration, confirmed reset, invalid commands, and damaged-storage preservation. Main owns executing it and removing temporary smoke files after acceptance. Real Next route navigation/static-host deep links, clipboard browser permission behavior, chart layout/pointer inspection, mobile focus trapping, theme presentation, and reduced-motion visuals require the integration owner's real browser pass.
