"use client";

import { ChevronDown, Search } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId, useState } from "react";
import { ButtonLink } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import { ConversionShader } from "@/components/motion/conversion-artwork";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type FaqBlockVariant = "numbered-faq" | "ai-workspace-faq" | "stacked-faq" | "split-faq" | "searchable-faq";
export interface FaqQuestion { id: string; question: string; answer: ReactNode; searchText?: string; topic?: string }
export interface FaqBlocksProps {
  variant?: FaqBlockVariant;
  title: string;
  description?: string;
  questions: FaqQuestion[];
  support?: { label: string; href: string };
  openItems?: string[];
  defaultOpenItems?: string[];
  onOpenItemsChange?: (ids: string[]) => void;
  className?: string;
}

export function FaqBlocks({ variant = "numbered-faq", title, description, questions, support, openItems, defaultOpenItems = [], onOpenItemsChange, className }: FaqBlocksProps) {
  const reduce = useReducedMotion();
  const id = useId();
  const [internal, setInternal] = useState(defaultOpenItems);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const open = openItems ?? internal;
  const change = (ids: string[]) => { if (openItems === undefined) setInternal(ids); onOpenItemsChange?.(ids); };
  const topics = ["All", ...new Set(questions.map((item) => item.topic).filter((item): item is string => Boolean(item)))];
  const visible = variant === "searchable-faq" ? questions.filter((item) => (topic === "All" || topic === item.topic) && `${item.question} ${typeof item.answer === "string" ? item.answer : item.searchText ?? ""}`.toLowerCase().includes(query.trim().toLowerCase())) : questions;
  const numbered = variant === "numbered-faq" || variant === "split-faq";
  const card = variant === "stacked-faq" || variant === "ai-workspace-faq";
  const toggle = (itemId: string) => change(open.includes(itemId) ? open.filter((value) => value !== itemId) : variant === "stacked-faq" ? [...open, itemId] : [itemId]);
  const answers = <div className={cn(card && "flex flex-col gap-4", variant === "split-faq" && "border-t border-border", variant === "searchable-faq" && "overflow-hidden rounded-3xl")}>
    {visible.map((item, visibleIndex) => {
      const index = questions.indexOf(item);
      const expanded = open.includes(item.id);
      return <article key={item.id} className={cn("overflow-hidden", card ? "rounded-3xl border border-border bg-background" : "border-b border-border last:border-b-0", variant === "ai-workspace-faq" && "border-border/60 bg-background/80 backdrop-blur-xl", variant === "searchable-faq" && "border-0 bg-muted/60", variant === "searchable-faq" && expanded && "mb-3 rounded-3xl", variant === "searchable-faq" && visibleIndex > 0 && open.includes(visible[visibleIndex-1].id) && "rounded-t-3xl")}>
        <h3><button id={`${id}-${index}-trigger`} type="button" aria-expanded={expanded} aria-controls={`${id}-${index}-answer`} onClick={() => toggle(item.id)} className={cn("flex w-full items-start gap-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring", card ? "min-h-20 px-5 py-5 sm:px-6" : "min-h-20 py-6", variant === "stacked-faq" && "items-center", variant === "numbered-faq" && "min-h-24 px-4 py-8 sm:px-6 lg:px-8", variant === "searchable-faq" && "min-h-[58px] items-center px-5 py-4")}>
          {numbered && <span aria-hidden="true" className={cn("w-8 shrink-0 pt-0.5 font-mono text-xs", expanded ? "text-foreground" : "text-muted-foreground")}>{String(index + 1).padStart(2, "0")}</span>}
          <span className={cn("flex-1 text-base font-medium leading-6", (variant === "numbered-faq" || variant === "stacked-faq") && "text-xl leading-7", variant === "searchable-faq" && "text-sm")}>{item.question}</span>
          {variant === "searchable-faq" && item.topic && <span className="hidden text-[11px] uppercase tracking-wider text-muted-foreground sm:block">{item.topic}</span>}
          {variant !== "numbered-faq" && <motion.span aria-hidden="true" animate={{ rotate: reduce ? 0 : expanded ? variant === "searchable-faq" ? 180 : 45 : 0 }} transition={{ duration: reduce ? 0 : .2, ease: EASE_OUT }} className={cn("grid size-6 shrink-0 place-items-center text-lg text-muted-foreground", variant === "stacked-faq" && "size-11 rounded-full bg-muted")}>{variant === "searchable-faq" ? <ChevronDown className={cn("size-4", reduce && expanded && "rotate-180")} /> : reduce && expanded ? "−" : "+"}</motion.span>}
        </button></h3>
        <AnimatePresence initial={false}>{expanded && <motion.div key="answer" id={`${id}-${index}-answer`} role="region" aria-labelledby={`${id}-${index}-trigger`} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .18, ease: EASE_OUT }} className={cn("pb-6 text-sm leading-6 text-muted-foreground", card && "px-5 sm:px-6", numbered && "pl-12", variant === "numbered-faq" && "pr-8 pl-[calc(2rem+1.75rem)] sm:pl-[calc(2rem+2.25rem)] lg:pl-[calc(2rem+2.75rem)]", variant === "searchable-faq" && "px-5 pb-5")}>{item.answer}</motion.div>}</AnimatePresence>
      </article>;
    })}
  </div>;
  const eyebrow = { "numbered-faq": "Good to know", "ai-workspace-faq": "AI workspace FAQ", "stacked-faq": "FAQs", "split-faq": "Questions, answered", "searchable-faq": "Help center" }[variant];
  const header = <header className={cn("space-y-5", (variant === "numbered-faq" || variant === "ai-workspace-faq" || variant === "searchable-faq") && "mx-auto max-w-2xl text-center")}><span className={cn("inline-flex items-center gap-3 text-xs font-medium text-muted-foreground", variant === "numbered-faq" ? "uppercase tracking-[.15em]" : "", variant === "ai-workspace-faq" && "rounded-full bg-muted px-3 py-1")}>{variant === "stacked-faq" && <span aria-hidden="true" className="size-2.5 rounded-full bg-primary" />}{eyebrow}</span><h2 className={cn("text-balance text-4xl font-medium leading-none tracking-tight",variant === "ai-workspace-faq" && "mx-auto max-w-md")}>{title}</h2>{description && <p className="text-pretty text-sm leading-6 text-muted-foreground">{description}</p>}</header>;
  const supportCard = support && <aside className="mt-10 max-w-md rounded-2xl border border-border bg-background p-5 sm:p-6"><p className="text-sm font-medium">Human support</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Still deciding? Find the answers you need from a person.</p><ButtonLink href={support.href} variant="outline" className="mt-5">{support.label}</ButtonLink></aside>;
  return <section data-faq={variant} className={cn("w-full bg-background px-4 py-16 text-foreground sm:px-8 sm:py-24", className)}>
    {variant === "numbered-faq" && <div className="mx-auto max-w-6xl">{header}<div className="mx-auto mt-12 max-w-4xl">{answers}</div></div>}
    {variant === "ai-workspace-faq" && <div className="mx-auto max-w-6xl">{header}<div className="relative isolate mt-12 overflow-hidden rounded-3xl border border-border/60 p-4 sm:p-6 lg:p-8"><div className="pointer-events-none absolute inset-0 -z-20"><ConversionShader variant="dithering" colors={["#0f766e","#fb923c"]} /></div><div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-background/15 backdrop-saturate-150 dark:bg-background/30" /><div className="grid items-start gap-4 lg:grid-cols-[.78fr_1.22fr] lg:gap-5"><aside className="rounded-3xl border border-border/60 bg-background/80 p-6 backdrop-blur-2xl backdrop-saturate-150 sm:p-7"><p className="text-xl font-medium">Planning an AI workflow?</p><p className="mt-3 max-w-sm text-pretty text-sm leading-6 text-muted-foreground">Explore models, connected tools, and the decisions your team controls.</p>{support && <ButtonLink href={support.href} className="mt-6 h-9 rounded-full">{support.label}</ButtonLink>}</aside>{answers}</div></div></div>}
    {(variant === "stacked-faq" || variant === "split-faq") && <div className={cn("mx-auto grid max-w-6xl gap-12", variant === "stacked-faq" ? "lg:grid-cols-[.78fr_1.22fr] lg:gap-20" : "lg:grid-cols-[.9fr_1.1fr] lg:gap-16")}><div className="self-start lg:sticky lg:top-8">{header}{variant === "split-faq" && supportCard}</div>{answers}</div>}
    {variant === "searchable-faq" && <div className="mx-auto max-w-4xl">{header}<div className="mt-9"><Input aria-label="Search questions and answers" placeholder="Search questions" type="search" leftIcon={<Search className="size-4" />} classNames={{ field: "h-10 rounded-full", input: "text-sm" }} value={query} onChange={setQuery} /></div><fieldset aria-label="FAQ topic" className="mx-auto mt-4 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-muted p-1">{topics.map((item) => <button type="button" key={item} aria-pressed={topic === item} onClick={() => setTopic(item)} className={cn("shrink-0 rounded-full px-3.5 py-1.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring", topic === item ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>{item}</button>)}</fieldset><p role="status" className="sr-only">{visible.length} answers found</p><div className="mt-8">{visible.length ? answers : <div className="rounded-2xl border border-border p-10 text-center"><p className="font-medium">No matching questions</p><p className="mt-2 text-sm text-muted-foreground">Try a different search or topic.</p><button type="button" onClick={() => { setQuery(""); setTopic("All"); }} className="mt-4 text-sm underline">Clear search</button></div>}</div></div>}
  </section>;
}
