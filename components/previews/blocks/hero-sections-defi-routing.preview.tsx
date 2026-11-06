"use client";

import { useState } from "react";
import { DefiRoutingHero, type HeroBalancePeriod, type HeroWalletRequest } from "@/components/motion/hero-sections";

const periods: HeroBalancePeriod[] = [
  { id: "1d", label: "1D", balance: "$4,280.40", points: [40, 48, 45, 60, 65, 63, 80] },
  { id: "1w", label: "1W", balance: "$4,612.80", points: [30, 36, 50, 44, 67, 70, 95] },
  { id: "1m", label: "1M", balance: "$4,940.20", points: [15, 26, 24, 44, 59, 78, 100] },
  { id: "3m", label: "3M", balance: "$6,140.20", points: [12, 28, 21, 48, 55, 72, 110] },
  { id: "all", label: "ALL", balance: "$7,140.20", points: [10, 18, 38, 34, 67, 92, 120] },
].map(period => ({ ...period, transactions: [
  { id: `${period.id}-deposit`, label: "Vault deposit", amount: "+240 USDC", date: "Nov 3 · sample" },
  { id: `${period.id}-withdrawal`, label: "Withdrawal", amount: "−100 USDC", date: "Nov 2 · sample" },
  { id: `${period.id}-yield`, label: "Yield distribution", amount: "+12.60 USDC", date: "Nov 1 · sample" },
  { id: `${period.id}-previous`, label: "Earlier deposit", amount: "+180 USDC", date: "Oct 28 · sample" },
  { id: `${period.id}-earlier-yield`, label: "Earlier distribution", amount: "+9.40 USDC", date: "Oct 24 · sample" },
] }));

export function HeroDefiRoutingPreview() {
  const [submitted, setSubmitted] = useState("");
  const [requests, setRequests] = useState<HeroWalletRequest[]>([]);
  return <div className="w-full space-y-3"><details className="text-xs text-muted-foreground"><summary className="w-fit cursor-pointer py-2">Wallet presentation controls</summary><p className="max-w-2xl py-2 leading-6">All balances and history are illustrative. Request review stores only a local draft; no wallet, funds, signature, or transaction service is connected. Amount 13 rejects a request. error@example.com rejects early access.</p></details><DefiRoutingHero eyebrow="A clearer route for your assets" title={<>Your assets.<br/>A clearer route.</>} description="An illustrative non-custodial savings interface, with the decisions and the useful details close at hand." primary={{ label: "Explore the platform", href: "/components" }} secondary={{ label: "Read the guide", href: "/docs" }} navigation={{ brand: { label: "Fieldwork", href: "/" }, links: [{ label: "Components", href: "/components" }, { label: "Documentation", href: "/docs" }] }} announcement={{ label: "Read the integration model", href: "/docs" }} periods={periods} custodyNote="Presentation only. No wallet is connected and no funds are moved. Not financial advice." account={{ name: "Fieldwork preview", network: "Local presentation · no connected wallet" }} notifications={[{ id: "presentation", title: "This wallet is a presentation", detail: "The chart and history use sample data. Financial requests remain local drafts." }, ...requests.map((request, index) => ({ id: `request-${index}`, title: `Local ${request.kind} request`, detail: `Amount ${request.amount} was stored in this preview only. No financial transaction occurred.` }))]} onWalletRequest={async request => { if (Number(request.amount) === 13) throw new Error("Presentation adapter rejected amount 13. No request was stored and no funds moved."); setRequests(current => [...current, request]); return { message: "The local preview stored this request draft. No wallet authorization, signature, deposit, or transfer occurred." }; }} onRequestAccess={async email => { if (email.startsWith("error@")) throw new Error("Preview rejection: use another email."); setSubmitted(email); }}/><p role="status" className="text-xs text-muted-foreground">{submitted ? `Local preview received: ${submitted}` : "No early-access request stored in this local demo."} {requests.length > 0 && `${requests.length} local wallet request drafts stored; balances unchanged.`}</p></div>;
}
