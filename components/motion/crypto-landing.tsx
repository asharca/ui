"use client";

import { useId, useState } from "react";
import { Sparkline } from "@/components/charts/sparkline";
import { Button, ButtonLink } from "@/components/motion/button";
import { LandingConversion, LandingFeatures, LandingFrame, LandingReveal, LandingSection, type LandingSiteProps } from "@/components/motion/landing-templates/shared";

export interface CryptoLandingAsset { id: string; symbol: string; name: string; amount: number; price: number; network: string }
export interface CryptoLandingPeriod { id: string; label: string; values: number[]; labels?: string[] }
export interface CryptoLandingProps extends LandingSiteProps { assets: CryptoLandingAsset[]; periods: CryptoLandingPeriod[]; networks: string[]; dataLabel: string; currency?: string; headline?: string }

/** Portfolio values and history are host supplied. No wallet connection or market feed is implied. */
export function CryptoLanding({ assets, periods, networks, dataLabel, currency = "USD", headline = "Your keys, every chain, one app", ...site }: CryptoLandingProps) {
  const id = useId();
  const [periodId, setPeriodId] = useState(periods[0]?.id ?? "");
  const [network, setNetwork] = useState("all");
  const [visible, setVisible] = useState(true);
  const period = periods.find(item => item.id === periodId) ?? periods[0];
  const filtered = assets.filter(asset => network === "all" || asset.network === network);
  const total = assets.reduce((sum, asset) => sum + asset.amount * asset.price, 0);
  const money = (value: number) => new Intl.NumberFormat("en", { style: "currency", currency }).format(value);
  return <LandingFrame {...site} appearance="crypto" groups={[{ label: "Product", links: [{ label: "Portfolio", description: "A readable balance across your networks", href: `#${id}-portfolio` }, { label: "Ownership", description: "Understand custody and permissions", href: `#${id}-ownership` }] }, { label: "Resources", links: [{ label: "Custody explained", href: `#${id}-ownership` }, { label: "Questions and answers", href: `#${id}-faq` }] }]} links={[{ label: "Fees", href: `#${id}-pricing` }]}>
    <main>
      <section className="landing-crypto-hero">
        <LandingReveal className="landing-crypto-copy">
          <p className="landing-eyebrow inline-flex items-center gap-2 rounded-full border border-border px-3 py-1"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>Self-custody, clearly understood</p>
          <h1>{headline}</h1>
          <p>Track your whole portfolio across networks, understand every movement, and keep ownership where it belongs. With you.</p>
          <div className="landing-hero-actions"><ButtonLink href={site.action.href} size="lg">{site.action.label}</ButtonLink><ButtonLink href={`#${id}-ownership`} variant="outline" size="lg">How custody works</ButtonLink></div>
          <p className="landing-wallet-trust text-muted-foreground">SELF-CUSTODIAL　·　{networks.length} NETWORKS　·　YOUR KEYS</p>
        </LandingReveal>
      <section id={`${id}-portfolio`} className="landing-wallet-demo scroll-mt-8" aria-label="Portfolio product preview">
        <div className="landing-demo-title"><strong>{site.brand} <span className="ml-4 font-normal text-muted-foreground">Portfolio</span></strong><span className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">{networks.length} networks</span></div>
        <div className="landing-wallet-body">
          <nav className="landing-wallet-sidebar" aria-label="Portfolio preview sections"><p className="mb-4 px-3 font-mono text-[10px] text-muted-foreground">WALLET</p><a href={`#${id}-portfolio`}>◈　Portfolio</a><a href={`#${id}-assets`}>◇　Assets <span className="float-right">{assets.length}</span></a><a href={`#${id}-ownership`}>⌘　Ownership</a><a href={`#${id}-pricing`}>↗　Plans</a></nav>
          <div className="landing-wallet-content">
            <div className="grid gap-5 sm:grid-cols-2"><div><div className="flex items-center justify-between gap-3"><p className="text-[10px] text-muted-foreground">Total balance</p><Button size="sm" variant="ghost" className="h-auto p-1 text-[9px]" aria-pressed={!visible} onClick={() => setVisible(!visible)}>{visible ? "Hide balance" : "Show balance"}</Button></div><p className="landing-balance mt-2 tabular-nums" aria-live="polite">{visible ? money(total) : "••••••"}</p><div className="mt-5 grid grid-cols-2 gap-3 text-[10px]"><div><p className="text-muted-foreground">Assets</p><p className="mt-1 text-lg font-medium">{visible ? assets.length : "••"}</p></div><div><p className="text-muted-foreground">Networks</p><p className="mt-1 text-lg font-medium">{networks.length}</p></div></div></div><div>{visible ? <Sparkline data={period?.values ?? []} labels={period?.labels} label={`Portfolio history, ${period?.label ?? "no period"}`} height={96} variant="area" interactive showDelta formatValue={money} /> : <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">Portfolio history hidden</div>}<fieldset className="m-0 mt-2 flex min-w-0 justify-end gap-1 border-0 p-0" aria-label="Portfolio history period">{periods.map(item => <Button key={item.id} variant={period?.id === item.id ? "primary" : "ghost"} size="sm" className="h-auto px-2 py-1 text-[9px]" aria-pressed={period?.id === item.id} onClick={() => setPeriodId(item.id)}>{item.label}</Button>)}</fieldset></div></div>
            <div id={`${id}-assets`} className="mt-8 flex flex-wrap items-center justify-between gap-3"><h2 className="text-sm font-medium">Holdings</h2><label className="text-xs text-muted-foreground">Network <select value={network} onChange={event => setNetwork(event.target.value)} className="ml-2 rounded-md border border-border bg-background px-2 py-1 text-foreground"><option value="all">All networks</option>{networks.map(name => <option key={name} value={name}>{name}</option>)}</select></label></div>
            <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-xs"><caption className="sr-only">Portfolio assets · {dataLabel}</caption><thead className="border-b border-border text-muted-foreground"><tr><th className="py-3 font-normal">Asset</th><th className="px-3 py-3 font-normal">Network</th><th className="px-3 py-3 text-right font-normal">Balance</th><th className="py-3 text-right font-normal">Value</th></tr></thead><tbody>{filtered.map(asset => <tr key={asset.id} className="border-b border-border last:border-0"><th className="flex items-center gap-3 py-4 text-left font-normal"><span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-medium">{asset.symbol.slice(0, 1)}</span><span>{asset.name}<span className="block text-[10px] text-muted-foreground">{asset.symbol}</span></span></th><td className="px-3 text-muted-foreground">{asset.network}</td><td className="px-3 text-right tabular-nums">{visible ? asset.amount.toLocaleString("en") : "••••"}</td><td className="text-right tabular-nums">{visible ? money(asset.amount * asset.price) : "••••"}</td></tr>)}</tbody></table>{!filtered.length && <p className="py-8 text-center text-sm text-muted-foreground">No assets in this network.</p>}</div>
            <p className="mt-5 font-mono text-[10px] text-muted-foreground">{dataLabel}</p>
          </div>
        </div>
      </section>
      </section>
      <div className="landing-integrations"><h2>Connected to the networks you already use</h2><div>{networks.map(name => <span key={name}>{name}</span>)}</div></div>
      <LandingSection id={`${id}-ownership`} title="Trust comes from what you can see." eyebrow="A considered foundation"><LandingFeatures items={[{ title: "Ownership, made legible", description: "Keep custody separate from a portfolio view. Connecting data should not mean surrendering your keys." }, { title: "Read before you sign", description: "Describe permissions, amounts, and destination networks before any consequential step." }, { title: "A record that travels", description: "Understand activity in context, with consistent asset and network labels across your portfolio." }]} /><p className="mt-8 max-w-3xl text-sm leading-7 text-muted-foreground">Crypto assets carry risk. Historical illustrations are not forecasts, and portfolio information is not investment advice.</p></LandingSection>
      <LandingConversion {...site} id={id} />
    </main>
  </LandingFrame>;
}
