"use client";

import Link from "next/link";
import { useId, useState, type ReactNode } from "react";
import { Button } from "@/components/motion/button";
import { Selector } from "@/components/motion/selector";
import { Input } from "@/components/motion/input";
import { Check, Plus, X } from "lucide-react";
import { LineChart, LineChartPlot, LineChartTooltip } from "@/components/charts/line-chart";
import { assets, findAsset, money, portfolioValue, quantity, type AssetId } from "./model";
import { usePortfolio } from "./provider";
const compactCurrency = new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", notation:"compact", maximumFractionDigits:1 });

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`panel ${className}`}>{children}</section>;
}
export function Choice({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: readonly string[] | { id: string; name: string }[] }) {
  return <fieldset className="choice" style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }} aria-label={label}><span className="field-label">{label}</span><Selector className="w-full" label={label} value={value} onValueChange={onChange} options={options.map(option => typeof option === "string" ? { id: option, name: option } : option)} /></fieldset>;
}
export function AssetBadge({ id, showNetwork = true }: { id: AssetId; showNetwork?: boolean }) {
  const asset = findAsset(id)!;
  return <span className="asset-name"><span className="coin" style={{ background: asset.color }} aria-hidden="true">{asset.symbol.slice(0, 1)}</span><span><strong>{asset.name}</strong><small>{asset.symbol}{showNetwork && ` · ${asset.network}`}</small></span></span>;
}
export function WatchButton({ id, iconOnly = false, remove = false }: { id: AssetId; iconOnly?: boolean; remove?: boolean }) {
  const { state, perform, busy } = usePortfolio();
  const watched = state.watchlist.includes(id);
  return <Button className={iconOnly ? "asset-watch-toggle" : undefined} variant="ghost" size={iconOnly ? "icon" : "sm"} title={`${watched ? "Unfollow" : "Follow"} ${findAsset(id)!.name}`} aria-label={`${watched ? "Unfollow" : "Follow"} ${findAsset(id)!.name}`} aria-pressed={watched} disabled={busy} onClick={() => void perform({ type: "watch", asset: id })}>{remove ? <X size={14}/> : watched ? <Check size={14}/> : <Plus size={14}/>} {!iconOnly && (watched ? "Watching" : "Watch")}</Button>;
}
export function AssetTable({ ids = assets.map(asset => asset.id), variant = "holdings", watchable = true }: { ids?: AssetId[]; variant?: "holdings" | "watchlist"; watchable?: boolean }) {
  const { state } = usePortfolio();
  const total = variant === "holdings" ? portfolioValue(state) : 0;
  return <div className="table-scroll"><table className={`asset-${variant}-table`}><caption className="sr-only">{variant === "watchlist" ? "Watched assets, networks and illustrative market prices" : "Asset market snapshot, total balances including staked principal, and allocation across the whole portfolio"}</caption><thead><tr><th>Asset</th>{variant === "watchlist" && <th>Network</th>}<th>Price</th><th>24h change</th>{variant === "holdings" && <><th>Balance</th><th>Allocation</th></>}{watchable && <th><span className={variant === "watchlist" ? "sr-only" : undefined}>Watch</span></th>}</tr></thead><tbody>{ids.map(id => {
    const asset = findAsset(id)!;
    if (variant === "watchlist") return <tr key={id}><td><Link className="asset-link" href={`/assets/${id}/`}><AssetBadge id={id} showNetwork={false}/></Link></td><td><span className="asset-network"><span className="asset-network-dot" style={{ background:asset.color }} aria-hidden="true"/>{asset.network}</span></td><td className="asset-price">{money(asset.price)}</td><td><span className={`asset-change ${asset.change < 0 ? "negative" : "positive"}`}>{asset.change > 0 ? "+" : ""}{asset.change}%</span></td>{watchable && <td><WatchButton id={id} iconOnly remove/></td>}</tr>;
    const staked = state.positions.reduce((sum,position)=>sum+(position.asset===id?position.amount:0),0);
    const amount = state.balances[id]+staked; const value = amount*asset.price; const share = total > 0 ? value/total*100 : 0;
    return <tr key={id}><td><Link className="asset-link" href={`/assets/${id}/`}><AssetBadge id={id} showNetwork={false}/></Link></td><td className="asset-price">{money(asset.price)}</td><td><span className={`asset-change ${asset.change < 0 ? "negative" : "positive"}`}>{asset.change > 0 ? "+" : ""}{asset.change}%</span></td><td className="asset-balance"><strong>{money(value)}</strong><small>{quantity(amount)} {asset.symbol}</small>{staked > 0 && <span className="sr-only">{quantity(state.balances[id])} available and {quantity(staked)} staked</span>}</td><td className="asset-allocation-cell"><span>{share.toFixed(1)}%</span><meter className="sr-only" aria-label={`${asset.name} allocation`} min={0} max={100} value={share} aria-valuetext={`${share.toFixed(1)} percent of the whole portfolio`}/><div className="asset-allocation-track" aria-hidden="true"><span style={{ width:`${share}%` }}/></div></td>{watchable && <td><WatchButton id={id} iconOnly/></td>}</tr>;
  })}</tbody></table>{ids.length === 0 && <p className="empty">No matching assets. Try a different search or network.</p>}</div>;
}
export function SnapshotChart({ value, label = "Illustrative portfolio value", height = 288, compact = false }: { value: number; label?: string; height?: number; compact?: boolean }) {
  const [range, setRange] = useState("1M");
  const scenario = [0.0098,0.1963,0.0114,0,0.2573,0.2358,0.0886,0.253,0.3963,0.2643,0.2715,0.4672,0.4558,0.3655,0.4935,0.5968,0.5197,0.5414,0.6756,0.6781,0.6428,0.7313,0.798,0.7774,0.8096,0.8824,0.9029,0.9206,0.9666,1];
  const span = range === "1D" || range === "previous" ? .025 : range === "1W" ? .08 : range === "3M" ? .3 : range === "1Y" ? .45 : range === "2Y" ? .6 : .22;
  const fractions = scenario.map(point => 1 - span + point * span);
  const gradientId = useId();
  if (compact) { const min = Math.min(...fractions), max = Math.max(...fractions); const points = fractions.map((fraction,index)=>`${10+index/(fractions.length-1)*190},${8+(max-fraction)/(max-min||1)*70}`).join(" "); return <div className="compact-snapshot-chart"><svg viewBox="0 0 210 108" width="100%" height={height} role="img" aria-label={`${label}: reference scenario from ${money(value*fractions[0])} to ${money(value)}`}><defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--muted-foreground)" stopOpacity=".18"/><stop offset="100%" stopColor="var(--muted-foreground)" stopOpacity="0"/></linearGradient></defs><polygon points={`10,88 ${points} 200,88`} fill={`url(#${gradientId})`}/><polyline points={points} fill="none" stroke="var(--muted-foreground)" strokeWidth="1.4" strokeLinejoin="round"/><text x="10" y="105" fill="var(--muted-foreground)" fontSize="9">Reference</text><text x="200" y="105" textAnchor="end" fill="var(--muted-foreground)" fontSize="9">Now</text></svg></div>; }
  const [count, unit] = ({ "1D": [24, "h"], previous: [24, "h"], "1W": [7, "d"], "1M": [30, "d"], "3M": [90, "d"], "1Y": [12, "mo"], "2Y": [24, "mo"] } as Record<string, [number, string]>)[range];
  const offset = range === "previous" ? 24 : 0;
  const axis = fractions.map((_, i) => { const ago = Math.round((fractions.length - 1 - i) * count / (fractions.length - 1)) + offset; return ago ? `${ago}${unit} ago` : "Now"; });
  return <div><div className="chart-toolbar"><span className="muted">Reference scenario · not historical market data</span><fieldset  aria-label="Chart period"><Selector label="Chart period" value={range} onValueChange={setRange} className="portfolio-period" classNames={{ trigger: "min-h-9 rounded-xl border-0 bg-background px-3 text-xs", content: "w-52", option: "min-h-9 text-sm" }} options={[{id:"1D",name:"Today"},{id:"previous",name:"Yesterday"},{id:"1W",name:"Last 7 days"},{id:"1M",name:"Last 30 days"},{id:"3M",name:"Last 90 days"},{id:"1Y",name:"Last 12 months"},{id:"2Y",name:"Last 24 months"}]}/></fieldset></div><LineChart label={`${label} · illustrative scenario, not historical market data`} variant="area" domain={[value*(1-span*1.16),Math.max(1,value*(1+span*.16))]} categories={axis} series={[{ id: "portfolio", name: "Reference value", color:"var(--muted-foreground)", values: fractions.map(fraction => value * fraction) }]} formatValue={money} formatTick={value=>compactCurrency.format(value)}><LineChartPlot height={height}/><LineChartTooltip/></LineChart></div>;
}
export function SwapForm({ initialAsset = "ethereum", onDone }: { initialAsset?: AssetId; onDone?: () => void }) {
  const { state, perform, busy, error } = usePortfolio();
  const [from, setFrom] = useState<AssetId>(initialAsset);
  const [to, setTo] = useState<AssetId>(initialAsset === "usd-coin" ? "ethereum" : "usd-coin");
  const [amount, setAmount] = useState("");
  const errorId = useId();
  const a = findAsset(from)!; const b = findAsset(to)!;
  const parsed = Number(amount);
  const valid = Number.isFinite(parsed) && parsed > 0 && parsed <= state.balances[from] && from !== to;
  const output = Number.isFinite(parsed) && parsed > 0 && from !== to ? parsed * a.price / b.price * 0.997 : 0;
  const options = assets.map(asset => ({ id: asset.id, name: `${asset.symbol} · ${asset.name}` }));
  const invalid = from === to ? "Choose two different assets." : amount && (!Number.isFinite(parsed) || parsed <= 0) ? "Enter an amount greater than zero." : parsed > state.balances[from] ? "Amount exceeds your available demo balance." : "";
  return <form className="swap-form" onSubmit={async event => { event.preventDefault(); if (valid && await perform({ type: "swap", from, to, amount: parsed })) { setAmount(""); onDone?.(); } }}>
    <div className="swap-pay"><div className="between"><span>You pay</span><Choice label="Pay asset" value={from} options={options} onChange={value => setFrom(value as AssetId)}/></div><Input label={`Amount in ${a.symbol}`} type="number" min="0" step="any" placeholder="0" value={amount} onChange={setAmount} required aria-describedby={errorId}/><div className="between"><small id={errorId}>Available: {quantity(state.balances[from])} {a.symbol} · {a.network}</small><Button variant="ghost" size="sm" onClick={() => setAmount(String(state.balances[from]))}>Use max</Button></div></div>
    <Button className="swap-reverse" variant="outline" size="icon" aria-label="Reverse swap assets" onClick={() => { setFrom(to); setTo(from); setAmount(""); }}>↕</Button>
    <div className="swap-receive"><div className="between"><span>You get</span><Choice label="Receive asset" value={to} options={options} onChange={value => setTo(value as AssetId)}/></div><output className="swap-output" aria-live="polite">{quantity(output)} <small>{b.symbol}</small></output><small>≈ {money(output * b.price)} · After demo fee</small></div>
    <dl className="swap-details"><div><dt>Fixed sample rate</dt><dd>1 {a.symbol} = {quantity(a.price / b.price)} {b.symbol}</dd></div><div><dt>Simulated fee · 0.3%</dt><dd>{money(Number.isFinite(parsed) && parsed > 0 ? parsed * a.price * .003 : 0)}</dd></div><div><dt>Network execution</dt><dd>None · local accounting only</dd></div></dl>
    {invalid && <p className="negative" role="alert">{invalid}</p>}{error && <p className="negative" role="alert">{error}</p>}
    <Button className="swap-confirm" type="submit" disabled={!valid || busy}>{busy ? "Updating…" : "Confirm simulated swap"}</Button>
    <p className="muted text-sm">Local simulation, not a quote or bridge. No slippage, gas, wallet signature or real transaction.</p>
  </form>;
}
