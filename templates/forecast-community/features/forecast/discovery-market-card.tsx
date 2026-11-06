"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import type { Market } from "./data";

const volumeFormat = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });
const closeFormat = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function DiscoveryMarketCard({ market, bookmarked, disabled, onBookmarkChange }: { market: Market; bookmarked: boolean; disabled: boolean; onBookmarkChange: () => void }) {
  const yes = market.outcomes.find(outcome => outcome.id === "yes");
  const no = market.outcomes.find(outcome => outcome.id === "no");
  const binary = market.outcomes.length === 2 && yes && no;
  const history = yes?.history ?? [];
  const change = yes ? Math.round(yes.price * 100) - (history[0] ?? Math.round(yes.price * 100)) : 0;
  const low = Math.min(...history);
  const span = Math.max(...history) - low || 1;
  const points = history.map((value, index) => `${index / Math.max(1, history.length - 1) * 320},${30 - (value - low) / span * 26}`).join(" ");
  const href = `/markets/${market.id}/`;

  return <article className={`discovery-market-card ${binary ? "is-binary" : "is-multiple"}`}>
    <header><span className={`discovery-market-icon symbol-${market.topic.toLowerCase()}`} aria-hidden="true">{market.symbol}</span><div><h3><Link href={href}>{market.title}</Link></h3><p>{closeFormat.format(new Date(`${market.closes}T00:00:00Z`))} · {market.topic}</p></div></header>
    <div className="discovery-market-content">
      {binary && yes && no ? <>
        <div className="discovery-probability"><Link href={`${href}?outcome=${yes.id}`} aria-label={`${Math.round(yes.price * 100)}% chance: ${market.title}`}>{Math.round(yes.price * 100)}<span>% <small>CHANCE</small></span></Link><span className={change >= 0 ? "success-text" : "danger-text"}>{change >= 0 ? "+" : ""}{change} pp</span></div>
        <svg className="discovery-history" viewBox="0 0 320 34" preserveAspectRatio="none" role="img" aria-label={`Reference probability history: ${history.join(", ")}%`}><polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></svg>
        <div className="discovery-binary-actions">{[yes, no].map(outcome => <Link key={outcome.id} className={outcome.id === "yes" ? "outcome-yes" : "outcome-no"} href={`${href}?outcome=${outcome.id}`}>{outcome.label}<span>{Math.round(outcome.price * 100)}¢</span></Link>)}</div>
      </> : <div className="discovery-outcomes">{market.outcomes.map(outcome => <div className="discovery-outcome" key={outcome.id}><Link className="discovery-outcome-label" href={`${href}?outcome=${outcome.id}`}>{outcome.label}<span aria-hidden="true" style={{ width: `${Math.round(outcome.price * 100)}%` }}/></Link><span title="Potential payout per demo USDC, including the stake, before fees">{outcome.price > 0 ? `${(1 / outcome.price).toFixed(2)}×` : "—"}</span><Link className="outcome-yes" href={`${href}?outcome=${outcome.id}`} aria-label={`${outcome.label}: ${Math.round(outcome.price * 100)} percent`}>{Math.round(outcome.price * 100)}%</Link></div>)}</div>}
      <footer><span>{volumeFormat.format(market.volume)} demo USDC vol.</span><Link href={href} className="discovery-discussion">Discussion ↗</Link><button type="button" disabled={disabled} aria-label={`Bookmark ${market.title}`} aria-pressed={bookmarked} onClick={onBookmarkChange}><Bookmark size={14} fill={bookmarked ? "currentColor" : "none"}/></button></footer>
    </div>
  </article>;
}
