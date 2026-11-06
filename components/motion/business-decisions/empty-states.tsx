"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/motion/button";
import { Plus, ArrowUpRight, MousePointer2, Pencil, RotateCcw } from "lucide-react";
import { SPRING_SWAP, EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";
import { DecisionFeedback, useDecisionAction } from "./decision-support";

export type EmptyStateKind = "archive" | "search" | "inbox" | "board";
export interface EmptyStateProps {
  kind: EmptyStateKind; title?: string; description?: string;
  action: { label: string; onAction: () => void | Promise<void> };
  secondaryAction?: { label: string; onAction: () => void | Promise<void> }; className?: string;
}
const copy: Record<EmptyStateKind, { title: string; description: string }> = {
  archive: { title: "No data yet", description: "Create a record or import your existing data." },
  search: { title: "No matches", description: "Try another phrase or clear your filters." },
  inbox: { title: "Inbox zero", description: "You are caught up. New conversations will appear here." },
  board: { title: "Start with one thing.", description: "Create the first project. The rest of the board can wait." },
};
export function EmptyState({ kind, title, description, action, secondaryAction, className }: EmptyStateProps) {
  const [hovered, setHovered] = useState(false);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const task = useDecisionAction();
  const active = !reduce && canHover && hovered;
  const actions = <div className={cn("flex flex-wrap justify-center gap-2", kind === "board" && "shrink-0")}><Button size="sm" variant={kind === "search" ? "outline" : kind === "inbox" ? "secondary" : "primary"} className={cn("h-9", kind === "inbox" && "border border-border bg-card hover:bg-card")} disabled={task.busy} onClick={() => { void task.run(action.onAction); }}>{kind === "search" ? <RotateCcw aria-hidden className="size-3.5" /> : kind === "inbox" ? <Pencil aria-hidden className="size-3.5" /> : <Plus aria-hidden className="size-3.5" />}{action.label}</Button>{secondaryAction && <Button size="sm" variant="ghost" disabled={task.busy} onClick={() => { void task.run(secondaryAction.onAction); }}>{secondaryAction.label}</Button>}</div>;
  if (kind === "board") return <section aria-label={title ?? copy.board.title} className={cn("mx-auto flex min-h-[420px] w-full max-w-[600px] flex-col justify-between overflow-hidden bg-background px-5 py-7 text-foreground sm:px-7", className)} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}><header className="flex items-start justify-between gap-6"><div><span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Projects / empty</span><h2 className="mt-2 max-w-md text-balance text-xl font-medium tracking-[-0.04em]">{title ?? copy.board.title}</h2></div><ArrowUpRight aria-hidden className="mt-1 size-5 text-muted-foreground" /></header><div aria-hidden className="relative my-6 grid min-h-[185px] grid-cols-3 gap-2">{["Queue", "Doing", "Done"].map(label => <div key={label} className="border border-border/60 p-2"><div className="flex justify-between border-b border-border pb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"><span>{label}</span><span>00</span></div></div>)}<motion.div animate={{ x: active ? 150 : 0, y: active ? -8 : 0 }} transition={reduce ? { duration: 0 } : SPRING_SWAP} className="absolute left-5 top-14 w-[27%] border border-foreground bg-background p-3 shadow-sm"><div className="flex items-center justify-between"><span className="size-2 rounded-full bg-primary" /><span className="font-mono text-[10px]">001</span></div><div className="mt-3 h-1.5 w-4/5 bg-foreground" /><div className="mt-2 h-1 w-1/2 bg-muted-foreground/30" /><span className="absolute -bottom-1 -right-24 flex items-center gap-1 font-mono text-[10px] text-muted-foreground"><MousePointer2 className="size-4" />drag to begin</span></motion.div></div><footer className="flex items-end justify-between gap-5 border-t border-border pt-5"><p className="min-w-0 max-w-[250px] flex-1 text-pretty text-xs leading-5 sm:text-sm text-muted-foreground">{description ?? copy.board.description}</p>{actions}</footer>{(task.busy || task.error) && <DecisionFeedback {...task} />}</section>;
  return <section className={cn("mx-auto flex w-full max-w-[520px] flex-col items-center justify-center bg-background px-5 py-9 text-center text-foreground", kind === "inbox" ? "min-h-[410px]" : "min-h-[390px]", className)} onPointerEnter={event => { if (event.pointerType !== "touch") setHovered(true); }} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setHovered(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false); }}>
    <svg aria-hidden="true" viewBox={kind === "archive" ? "0 0 240 220" : "0 0 240 160"} className={cn("max-w-full", kind === "archive" ? "mb-5 aspect-[16/15] h-auto w-[205px] text-foreground" : kind === "search" ? "mb-6 h-36 w-64 text-foreground" : "mb-6 h-[165px] w-[260px] text-muted-foreground")} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      {kind === "archive" && <g transform="translate(7 -5)"><path d="m64 42 59-31 61 36-60 32Z" className="fill-background" /><path d="M64 42v102l60 35 60-33V47M124 79v100M64 91l60 35 60-33M64 48l60 35 60-31" /><path d="m76 51 11-6 11 6-11 6m37 40 12-6" /><motion.g animate={{ x: active ? -19 : -10, y: active ? 10 : 5 }} transition={reduce ? { duration: 0 } : SPRING_SWAP}><path d="m64 99 45-24 51 29-46 25Z" className="fill-background" /><path d="M64 99v58l50 29v-57m0 57 46-25v-57" className="fill-background" /><path d="m84 108 13 7 12-6M105 180v8m52-29v8" /></motion.g></g>}
      {kind === "search" && <><rect x="40" y="36" width="150" height="91" rx="12" className="fill-muted/30" /><motion.g animate={{ x: active ? -10 : 0 }} transition={reduce ? { duration: 0 } : SPRING_SWAP}><path d="M58 56h78M58 74h52M58 92h70M58 110h37" /></motion.g><motion.g animate={reduce ? { x: 0, y: 0 } : { x: active ? [0, 12, 0] : [0, 4, 0], y: [0, -5, 0] }} transition={{ duration: 4, repeat: reduce ? 0 : Infinity, ease: EASE_OUT }}><circle cx="159" cy="82" r="31" className="fill-background" strokeWidth="3" /><path d="m181 105 20 22" strokeWidth="8" /><path d="m148 76 17 13m0-13-17 13" className="stroke-muted-foreground/50" /></motion.g></>}
      {kind === "inbox" && <><ellipse cx="120" cy="139" rx="65" ry="8" className="fill-muted" stroke="none" /><motion.path d="m61 79 59-43 59 43" className="fill-muted" animate={{ y: active ? -8 : 0 }} transition={reduce ? { duration: 0 } : SPRING_SWAP} /><motion.g initial={false} animate={{ y: reduce ? 0 : active ? -18 : -5 }} transition={reduce ? { duration: 0 } : SPRING_SWAP}><rect x="81" y="50" width="78" height="66" rx="6" className="fill-background" /><circle cx="120" cy="76" r="13" className="fill-muted" /><path d="m113 76 5 5 10-11M100 102h40" /></motion.g><path d="M61 79v49a7 7 0 0 0 7 7h104a7 7 0 0 0 7-7V79l-59 40Z" className="fill-card" /><path d="m62 130 37-30m79 30-37-30" /></>}
    </svg>
    <div className="mb-4 space-y-2"><h2 className="text-balance text-xl font-medium tracking-[-0.03em]">{title ?? copy[kind].title}</h2><p className="max-w-xs text-pretty text-sm leading-6 text-muted-foreground">{description ?? copy[kind].description}</p></div>
    {actions}
    <DecisionFeedback {...task} />
  </section>;
}
