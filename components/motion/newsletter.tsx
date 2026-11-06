"use client";

import { Check, Inbox, Mail, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/motion/input";
import { Button } from "@/components/motion/button";
import { Avatar, type AvatarGroupMember } from "@/components/motion/avatar-group";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { TextReveal } from "@/components/motion/text-reveal";
import { ConversionShader as ShaderBackground } from "@/components/motion/conversion-artwork";
import { NewsletterPreferencesBackground } from "@/components/motion/newsletter-preferences-background";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export type NewsletterVariant = "issue-preview" | "inline-signup" | "preferences-card";
export interface NewsletterIssue { id: string; title: string; summary: string; image?: string; href?: string; topic?: string }
export interface NewsletterValues { email: string; topics: string[]; frequency: "weekly" | "monthly" }
export interface NewsletterProps {
  variant?: NewsletterVariant;
  title: string;
  description: string;
  issues: NewsletterIssue[];
  topics?: string[];
  readers?: AvatarGroupMember[];
  author?: { name: string; description?: string; image?: string };
  subscriberCount?: number;
  onSubscribe: (values: NewsletterValues) => Promise<{ message?: string; subscriberCount?: number } | void>;
  className?: string;
}

export function Newsletter({ variant = "issue-preview", title, description, issues, topics = [], readers = [], author, subscriberCount, onSubscribe, className }: NewsletterProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const id = useId();
  const submitting = useRef(false);
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string[]>(topics.slice(0, 2));
  const [frequency, setFrequency] = useState<NewsletterValues["frequency"]>("weekly");
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [spread, setSpread] = useState(false);
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(subscriberCount);
  useEffect(() => setCount(subscriberCount), [subscriberCount]);
  useEffect(() => {
    if (reduce || paused || hoverPaused || focusPaused || variant !== "issue-preview" || issues.length < 2) return;
    const timer = setInterval(() => setActive((index) => (index + 1) % issues.length), 5000);
    return () => clearInterval(timer);
  }, [reduce, paused, hoverPaused, focusPaused, variant, issues.length]);
  const reset = () => { setStatus("idle"); setMessage(""); };
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting.current) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setStatus("error"); setMessage("Enter a valid email address."); return; }
    if (variant === "preferences-card" && topics.length > 0 && selected.length === 0) { setStatus("error"); setMessage("Choose at least one topic."); return; }
    submitting.current = true; setStatus("pending"); setMessage("");
    try {
      const result = await onSubscribe({ email: email.trim(), topics: [...selected], frequency });
      setStatus("success"); setMessage(result?.message ?? "Subscription confirmed. Thank you for joining.");
      if (result?.subscriberCount !== undefined) setCount(result.subscriberCount);
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Subscription failed. Please try again."); }
    finally { submitting.current = false; }
  };
  const inboxIssues = issues.filter(issue => selected.length > 0 && (!issue.topic || selected.includes(issue.topic)));
  const form = <form onSubmit={submit} noValidate aria-busy={status === "pending"} className={variant === "preferences-card" ? "pb-4" : "space-y-2"}><fieldset disabled={status === "pending"} className={variant === "preferences-card" ? undefined : "space-y-5"}>
    {variant === "preferences-card" && <><fieldset className="m-0 min-w-0 border-0 p-0"><legend className="mb-2.5 text-sm font-medium">What you’ll get</legend><div className="flex flex-wrap gap-2">{topics.map((topic) => <label key={topic} className={cn("flex cursor-pointer items-center gap-1.5 rounded-full border px-3 h-8 text-xs font-medium has-focus-visible:ring-2 has-focus-visible:ring-ring", selected.includes(topic) ? "border-border bg-card" : "border-border bg-transparent text-foreground hover:bg-primary/5")}><input className="sr-only" type="checkbox" checked={selected.includes(topic)} onChange={(e) => { reset(); setSelected(e.target.checked ? [...selected, topic] : selected.filter((item) => item !== topic)); }} />{selected.includes(topic) ? <Check aria-hidden="true" className="size-3.5" /> : <Plus aria-hidden="true" className="size-3.5" />}{topic}</label>)}</div></fieldset><div className="flex flex-wrap items-center justify-between gap-3"><span id={`${id}-frequency-label`} className="text-sm font-medium">How often</span><fieldset aria-labelledby={`${id}-frequency-label`} className="flex w-fit gap-1 rounded-full bg-muted p-1">{(["weekly", "monthly"] as const).map((value) => <label key={value} className={cn("cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium capitalize has-focus-visible:ring-2 has-focus-visible:ring-ring", frequency === value && "bg-background shadow-sm")}><input className="sr-only" type="radio" name={`${id}-frequency`} checked={frequency === value} onChange={() => { reset(); setFrequency(value); }} />{value}</label>)}</fieldset></div></>}
    <div className={cn("flex flex-col gap-2 sm:flex-row", variant === "preferences-card" && "mt-7")}><Input className="flex-1" aria-label="Email address" placeholder="you@company.com" classNames={{field:"h-10 rounded-full",input:"text-sm"}} type="email" autoComplete="email" required value={email} onChange={(value) => { setEmail(value); reset(); }} success={status === "success"} aria-describedby={`${id}-status`} /><Button type="submit" disabled={status === "pending"} className="h-10 w-full shrink-0 sm:w-auto">{status === "pending" ? "Subscribing…" : status === "success" ? "Subscribed ✓" : status === "error" ? "Try again" : "Subscribe"}</Button></div></fieldset><p id={`${id}-status`} role={status === "error" ? "alert" : "status"} className={cn("text-xs", variant === "preferences-card" ? "mt-2 min-h-4 px-1" : "min-h-4 px-1", status === "error" ? "text-destructive" : "text-muted-foreground")}>{message || "No spam. Unsubscribe whenever you like."}</p></form>;
  const header = <div><span className={cn("inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]", variant === "inline-signup" && "mt-6")}>{variant === "preferences-card" ? "Newsletter" : variant === "inline-signup" ? "The weekly drop" : "Field notes · weekly"}</span>{variant === "preferences-card" ? <h2 className="mt-5 text-balance text-xl font-medium leading-[1.1] tracking-tight">{title}</h2> : <TextReveal as="h2" spaceWidth="0.25em" text={title.split("\n")} className={cn("text-balance text-4xl font-medium leading-[1.1] tracking-tight",variant === "issue-preview" ? "mt-6" : "mt-5")} />}<p className={cn("mt-4 text-pretty text-sm leading-6 text-muted-foreground", variant === "preferences-card" ? "mt-3" : "sm:text-base sm:leading-7", variant === "issue-preview" && "mt-5 max-w-md")}>{description}</p></div>;
  const readersRow = readers.length > 0 && <div className={cn("flex items-center gap-3", variant === "inline-signup" && "justify-center")}><ul className="m-0 flex list-none -space-x-2 p-0" aria-label="Newsletter readers">{readers.map(reader => <li key={reader.id} className="rounded-full border-2 border-background [&>span]:size-7"><Avatar name={reader.name} src={reader.src} size="sm" /></li>)}</ul>{count !== undefined && <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"><span className="font-medium text-foreground"><AnimatedNumber value={count} startOnView={false} /></span><span>{variant === "inline-signup" ? "developers subscribed" : "readers"}</span></span>}</div>;
  const issue = (item: NewsletterIssue, index: number) => <motion.article key={item.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_LAYOUT} className="flex h-full flex-col rounded-3xl border border-border bg-background p-2.5">{item.image ? <img src={item.image} alt="" className="h-36 w-full rounded-2xl object-cover sm:h-40" /> : <div className="h-40 bg-muted" />}<div className="flex flex-1 flex-col px-3 pt-4 pb-3"><p className="flex items-center gap-2.5 text-xs text-muted-foreground">{author && <Avatar name={author.name} src={author.image} size="sm" className="size-6" />}Field notes · Issue {index + 1}</p><h3 className="mt-3 text-balance text-xl font-medium leading-snug tracking-tight">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.summary}</p>{item.href && <a href={item.href} className="mt-3 inline-block text-xs underline underline-offset-4">Read issue</a>}</div></motion.article>;
  return <section data-newsletter={variant} className={cn("w-full px-4 py-20 text-foreground sm:px-8", className)}>
    {variant === "issue-preview" && <div className="mx-auto grid max-w-6xl items-center gap-12 rounded-3xl border border-border bg-background p-6 sm:p-10 lg:grid-cols-2 lg:gap-16"><div>{header}{author && <div className="mt-6 flex items-center gap-3"><Avatar name={author.name} src={author.image} size="md" /><div><p className="text-sm font-medium">Written by {author.name}</p>{author.description && <p className="text-xs text-muted-foreground">{author.description}</p>}</div></div>}<div className="mt-8">{form}</div>{readersRow && <div className="mt-14">{readersRow}</div>}</div><div onPointerEnter={() => canHover && setHoverPaused(true)} onPointerLeave={() => setHoverPaused(false)} onFocusCapture={() => setFocusPaused(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false); }}><div className="relative isolate mx-auto h-112 w-full max-w-md pt-12">{issues.filter((_, index) => index !== active % issues.length).slice(0, 2).map((item, index) => <div key={item.id} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-12 bottom-0 origin-top overflow-hidden rounded-3xl border border-border bg-background p-2.5" style={{ zIndex: 19 - index, opacity: index === 0 ? .75 : .45, transform: reduce ? "none" : `translateY(-${index === 0 ? 22 : 42}px) scale(${index === 0 ? .94 : .88})` }}>{item.image && <img src={item.image} alt="" className="h-36 w-full rounded-2xl object-cover sm:h-40" />}</div>)}<div className="absolute inset-x-0 top-12 bottom-0 z-20">{issues.length > 0 ? issue(issues[active % issues.length], active % issues.length) : <p>No published issues yet.</p>}</div>{status === "success" && <motion.div initial={reduce ? false : { y: -50, opacity: 0, rotate: -5 }} animate={{ y: 0, opacity: 1, rotate: 0 }} transition={{ ease: EASE_OUT, duration: .5 }} className="absolute -bottom-3 right-0 rounded-xl border border-border bg-background p-4 shadow-lg">✉ Welcome to the newsletter</motion.div>}</div><div className="sr-only focus-within:not-sr-only focus-within:mt-5 focus-within:flex focus-within:justify-center focus-within:gap-2">{issues.map((item, index) => <button type="button" key={item.id} aria-label={`Show issue ${index + 1}: ${item.title}`} aria-pressed={active % issues.length === index} onClick={() => { setActive(index); setPaused(true); }} className={cn("size-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring", active % issues.length === index ? "bg-foreground" : "bg-muted-foreground/30")} />)}{issues.length > 1 && <button type="button" onClick={() => setPaused(!paused)} className="ml-2 text-xs text-muted-foreground underline">{paused ? "Resume rotation" : "Pause rotation"}</button>}</div></div></div>}
    {variant === "inline-signup" && <div className="relative isolate mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-background px-5 pt-10 pb-12 text-center sm:px-10"><div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 opacity-90 [mask-image:linear-gradient(to_bottom,black_45%,transparent)]"><ShaderBackground variant="mesh-gradient" colors={["#ffc49b","#ff8a65","#6fb7e9","#ffe0b8"]} distortion={.5} swirl={.25} /></div><div className="relative mx-auto h-48 max-w-md sm:h-56" onPointerEnter={() => canHover && setSpread(true)} onPointerLeave={() => setSpread(false)} onFocusCapture={() => setSpread(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSpread(false); }}>{issues.slice(0, 3).map((item, index) => <motion.div key={item.id} animate={{ x: reduce || index === 2 ? 0 : (index === 0 ? -1 : 1) * (spread ? 170 : 120), y: reduce ? 0 : index === 2 ? spread ? -16 : 0 : spread ? 12 : 20, rotate: reduce || index === 2 ? 0 : (index === 0 ? -1 : 1) * (spread ? 14 : 10) }} transition={SPRING_LAYOUT} style={{ zIndex: index }} className="absolute top-4 left-1/2 -ml-20 w-40 overflow-hidden rounded-2xl border-4 border-background bg-background sm:-ml-24 sm:w-48">{item.image && <img src={item.image} alt="" className="aspect-[4/3] w-full object-cover" />}<div className="absolute bottom-2 left-2 flex justify-between rounded-full bg-background/85 px-2 py-0.5 text-xs"><span>#{index + 1}</span>{status === "success" && index === 1 && <span role="img" aria-label="Subscribed">✓</span>}</div></motion.div>)}</div><div className="mx-auto max-w-md">{header}<div className="mt-8">{form}</div>{readersRow && <div className="mt-6">{readersRow}</div>}</div></div>}
    {variant === "preferences-card" && <div className="mx-auto grid max-w-5xl gap-2 rounded-3xl border border-border bg-background p-2 lg:grid-cols-2"><div className="space-y-7 p-6 sm:p-8">{header}{form}</div><div className="relative isolate min-h-96 overflow-hidden rounded-3xl p-4 sm:p-6"><div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10"><NewsletterPreferencesBackground /></div><div className="flex h-full flex-col rounded-2xl bg-background/85 p-4 backdrop-blur-xl"><div className="mb-4 flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-medium"><span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-muted"><Inbox className="size-3.5" /></span>Your inbox</p><p className="text-xs text-muted-foreground">{frequency === "weekly" ? "Every Sunday at 8:00" : "First Sunday of the month"}</p></div><ul aria-live="polite" className="space-y-2">{inboxIssues.length === 0 ? <li className="p-5 text-sm text-muted-foreground">{selected.length === 0 ? "Select topics to build your edition." : "No issues match these topics yet."}</li> : inboxIssues.map(issue => <motion.li layout={!reduce} key={issue.id} transition={SPRING_LAYOUT} className="flex items-center gap-3 rounded-2xl border border-border bg-background p-3"><span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-muted"><Mail className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{issue.href ? <a href={issue.href} className="outline-none focus-visible:ring-2 focus-visible:ring-ring">{issue.title}</a> : issue.title}</p><p className="truncate text-xs text-muted-foreground">Field notes{issue.topic ? ` · ${issue.topic}` : ""}</p></div></motion.li>)}</ul></div></div></div>}
  </section>;
}
