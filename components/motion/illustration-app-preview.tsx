"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Bell, Bookmark, Bot, Check, FileText, Heart, Mail, MoreHorizontal, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductScene, SceneError, useProductRequest } from "./illustration-product-scene";

function portfolioLine(values: readonly number[]) {
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) { min = Math.min(min, value); max = Math.max(max, value); }
  let path = "";
  let lastY = 50;
  const scale = 40 / (max - min || 1);
  const step = 184 / Math.max(1, values.length - 1);
  for (let index = 0; index < values.length; index++) {
    const y = 50 - (values[index] - min) * scale;
    const x = 8 + index * step;
    const previousY = 50 - (values[Math.max(0, index - 2)] - min) * scale;
    const nextY = 50 - (values[Math.min(values.length - 1, index + 1)] - min) * scale;
    path += index ? `C${x - step * 2 / 3} ${lastY + (y - previousY) / 6} ${x - step / 3} ${y - (nextY - lastY) / 6} ${x} ${y}` : `M${x} ${y}`;
    lastY = y;
  }
  return { path, lastY };
}
export interface PortfolioAsset { id: string; symbol: string; name: string; balance: string; change: string; history: readonly number[] }
export interface PortfolioPhoneProps { assets: readonly PortfolioAsset[]; total: string; totalChange?: string; selectedId?: string; defaultSelectedId?: string; onSelectedIdChange?: (id: string) => void; className?: string; title?: string }
/** Data-only mobile portfolio composition; values never imply a connected wallet. */
export function PortfolioPhone({ assets, total, totalChange, selectedId, defaultSelectedId, onSelectedIdChange, className, title = "Portfolio" }: PortfolioPhoneProps) {
  const [internal, setInternal] = useState(defaultSelectedId ?? assets[0]?.id);
  const selected = assets.find((asset) => asset.id === (selectedId ?? internal)) ?? assets[0];
  const chart = portfolioLine(selected?.history ?? []);
  return <ProductScene phone title={title} className={className} caption="Portfolio illustration · balances supplied by the host.">
    <header className="mb-[9%] flex items-center justify-between"><div><p className="text-muted-foreground">Total balance</p><h4 className="font-semibold">{title}</h4></div><Mail aria-hidden className="size-3 text-muted-foreground" /></header>
    <div className="rounded-2xl border border-border bg-muted/50 p-[8%]"><p className="text-[max(6.88px,1.46cqw)] text-muted-foreground">Available</p><div className="mt-0.5 flex items-center justify-between gap-2"><strong className="text-[max(18.24px,3.88cqw)] font-semibold tracking-tight">{total}</strong><span className="text-[max(5.76px,1.22cqw)] text-muted-foreground">↗ {totalChange ?? selected?.change}</span></div>{selected && <svg viewBox="0 0 200 58" role="img" aria-label={`${selected.name} history: ${selected.history.join(", ")}`} className="mt-[12%] h-10 w-full overflow-visible" preserveAspectRatio="none"><path d={chart.path} fill="none" stroke="currentColor" strokeOpacity={.7} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" /></svg>}</div>
    <div className="my-[7%] grid grid-cols-2 gap-2"><div className="flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-[2cqw] text-muted-foreground"><ArrowDownLeft className="size-3" aria-hidden />Receive</div><div className="flex items-center justify-center gap-2 rounded-xl border border-border py-2 text-[2cqw] text-muted-foreground"><ArrowUpRight className="size-3" aria-hidden />Send</div></div>
    <h4 className="mb-[4%] font-medium">Assets</h4><fieldset className="m-0 space-y-1 border-0 p-0" aria-label="Portfolio assets">{assets.map((asset, index) => <button type="button" key={asset.id} aria-pressed={selected?.id === asset.id} onClick={() => { if (selectedId === undefined) setInternal(asset.id); onSelectedIdChange?.(asset.id); }} className="flex w-full cursor-pointer items-center gap-2 rounded-xl py-2 text-left focus-visible:outline-2 focus-visible:outline-ring"><span aria-hidden className={cn("grid size-[6cqw] shrink-0 place-items-center rounded-full text-[2.5cqw]", ["bg-orange-100 text-orange-600", "bg-indigo-100 text-indigo-600", "bg-purple-100 text-purple-600"][index % 3])}>{asset.symbol.slice(0, 1)}</span><span className="flex-1"><span className="block font-medium">{asset.name}</span><span className="text-[1.7cqw] text-muted-foreground">{asset.change}</span></span><span className="font-medium">{asset.balance}</span></button>)}</fieldset>{!assets.length && <p>No assets to display.</p>}
  </ProductScene>;
}

export interface AssistantPhoneProps { onAsk: (prompt: string) => Promise<string>; suggestions: readonly string[]; className?: string; title?: string; demo?: { prompt: string; response: string; steps: readonly string[] } }
export function AssistantPhone({ onAsk, suggestions, className, title = "Ask your assistant", demo }: AssistantPhoneProps) {
  const [prompt, setPrompt] = useState("");
  const [sent, setSent] = useState("");
  const request = useProductRequest<string>();
  return <ProductScene phone title={title} className={className} caption="Assistant concept · demo playback is presentation only; user requests use the supplied callback.">
    <header className="mb-[9%] flex items-center justify-between"><div><p className="text-muted-foreground">Workspace</p><h4 className="font-semibold">{title}</h4></div><span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"><Bot className="size-3" /></span></header>
    {(sent || demo) && <div className="ml-[12%] rounded-2xl rounded-br-md border border-border bg-muted px-[8%] py-[7%]"><p className="leading-normal">{sent || demo?.prompt}</p></div>}
    <div aria-live="polite" aria-busy={request.pending} className="mt-[8%]">
      {(request.pending || (!sent && demo)) && <div className="flex items-center gap-2 text-[max(7.36px,1.56cqw)] font-medium text-muted-foreground"><span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-lg bg-muted"><Bot className="size-3" /></span><span>Thinking through the brief…</span></div>}
      {(request.result !== null || (!sent && demo)) && <><div className="flex items-center gap-2"><span aria-hidden className="grid size-6 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><Bot className="size-3" /></span><h4 className="font-medium">Launch plan ready</h4></div><p className="mt-[6%] text-[max(6.88px,1.46cqw)] leading-normal text-muted-foreground">{request.result ?? demo?.response}</p>{!sent && demo && <div className="mt-[6%] space-y-1.5">{demo.steps.map(step => <div key={step} className="flex items-center gap-2 rounded-xl bg-muted/60 px-2 py-1.5"><span aria-hidden className="grid size-4 shrink-0 place-items-center rounded-full bg-background text-muted-foreground"><Check className="size-2.5" /></span><span className="text-[max(7.2px,1.53cqw)]">{step}</span></div>)}</div>}</>}
    </div>
    <div className="mt-[6%] flex flex-wrap gap-1.5">{suggestions.map(suggestion => <button type="button" key={suggestion} onClick={() => setPrompt(suggestion)} className="flex cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1 text-[max(6.08px,1.29cqw)] text-muted-foreground"><FileText aria-hidden className="size-2.5" />{suggestion}</button>)}</div>
    <form className="absolute inset-x-[8%] bottom-[11%] flex h-[42px] items-center gap-2 rounded-xl border border-border bg-muted p-1.5" onSubmit={event => { event.preventDefault(); if (prompt.trim() && !request.pending) { setSent(prompt.trim()); void request.run(() => onAsk(prompt.trim())); } }}><input aria-label="Ask a follow-up" placeholder="Ask a follow-up" value={prompt} onChange={event => setPrompt(event.target.value)} disabled={request.pending} className="min-w-0 flex-1 bg-transparent px-1.5 text-[max(6.72px,1.43cqw)] outline-none" /><button type="submit" aria-label="Ask assistant" disabled={!prompt.trim() || request.pending} className="grid size-7 shrink-0 place-items-center rounded-full bg-foreground text-background disabled:opacity-40"><Send className="size-3" /></button></form><SceneError message={request.error} />
  </ProductScene>;
}

export interface SocialIllustrationPost { id: string; author: string; handle: string; content: string; color?: string; likes: number; liked?: boolean; saved?: boolean; image?: { src: string; alt: string } }
export interface SocialPhoneProps { posts: readonly SocialIllustrationPost[]; onPostChange: (id: string, change: { liked?: boolean; saved?: boolean }) => void; className?: string; title?: string }
/** Likes and bookmarks remain controlled by the host. Images are supplied, never copied from the reference. */
export function SocialPhone({ posts, onPostChange, className, title = "Following" }: SocialPhoneProps) {
  return <ProductScene phone title={title} className={className} caption="Social feed illustration · your community, your content.">
    <header className="mb-[9%] flex items-center justify-between"><div><p className="text-muted-foreground">Discover</p><h4 className="font-semibold">{title}</h4></div><Bell className="size-3 text-muted-foreground" aria-hidden /></header>
    <section aria-label="Stories" className="mb-[9%] flex justify-between">{["A", "N", "M", "R"].map(name => <span key={name} className="grid size-[34px] font-mono font-medium place-items-center rounded-full border border-border bg-background ring-2 ring-muted ring-offset-2 ring-offset-background text-[max(7.36px,1.56cqw)]">{name}</span>)}</section>
    <div className="space-y-3">{posts.map(post => <article key={post.id} className="overflow-hidden rounded-2xl border border-border bg-muted/30"><header className="flex items-center gap-2 p-[6%]"><span aria-hidden className="grid size-7 place-items-center rounded-full bg-muted font-mono text-[max(7.36px,1.56cqw)] font-medium" style={{ backgroundColor: post.color }}>{post.author.split(" ").map(name => name[0]).join("")}</span><div className="flex-1"><h4 className="text-[max(7.36px,1.56cqw)] font-medium">{post.author}</h4><p className="text-[max(5.76px,1.22cqw)] text-muted-foreground">{post.handle}</p></div><MoreHorizontal className="size-3" aria-hidden /></header>{post.image ? <img src={post.image.src} alt={post.image.alt} className="aspect-[4/3] w-full object-cover" /> : <div aria-hidden className="aspect-[4/3] bg-gradient-to-br from-muted via-primary/10 to-muted" />}<div className="p-[6%]"><div className="mb-2 flex items-center gap-2"><button type="button" aria-label={`Like post by ${post.author}`} aria-pressed={post.liked ?? false} onClick={() => onPostChange(post.id, { liked: !post.liked })} className="flex cursor-pointer items-center gap-1"><Heart className={cn("size-3", post.liked && "fill-current text-red-500")} />{post.likes}</button><button type="button" aria-label={`Save post by ${post.author}`} aria-pressed={post.saved ?? false} onClick={() => onPostChange(post.id, { saved: !post.saved })} className="ml-auto cursor-pointer"><Bookmark className={cn("size-3", post.saved && "fill-current")} /></button></div><p className="leading-relaxed">{post.content}</p></div></article>)}</div>{!posts.length && <p>No posts to display.</p>}
  </ProductScene>;
}
