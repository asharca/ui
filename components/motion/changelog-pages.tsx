"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { EditorialSubscription } from "@/components/motion/editorial-subscription";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ChangelogSection { id: string; title: string; body: ReactNode }
export interface ChangelogRelease { id: string; version: string; date: string; title: string; summary: string; tags: string[]; sections: ChangelogSection[]; href?: string; image?: { src: string; alt: string } }
export interface ChangelogPageProps {
  title: string; introduction: string; releases: ChangelogRelease[];
  tag?: string; defaultTag?: string; onTagChange?: (tag: string) => void;
  version?: string; defaultVersion?: string; onVersionChange?: (version: string) => void;
  onSubscribe?: (email: string) => Promise<void>; className?: string;
}

function useReleases(props: ChangelogPageProps) {
  const [internalTag, setTag] = useState(props.defaultTag ?? "all");
  const [internalVersion, setVersion] = useState(props.defaultVersion ?? "all");
  const tag = props.tag ?? internalTag;
  const version = props.version ?? internalVersion;
  const releases = [...props.releases].sort((a, b) => b.date.localeCompare(a.date));
  return { tag, version, tags: [...new Set(releases.flatMap(release => release.tags))], versions: [...new Set(releases.map(release => release.version))], releases: releases.filter(release => (tag === "all" || release.tags.includes(tag)) && (version === "all" || release.version === version)), setTag: (next: string) => { if (props.tag === undefined) setTag(next); props.onTagChange?.(next); }, setVersion: (next: string) => { if (props.version === undefined) setVersion(next); props.onVersionChange?.(next); } };
}

interface ReleaseState { tag: string; version: string; tags: string[]; versions: string[]; releases: ChangelogRelease[]; setTag: (next: string) => void; setVersion: (next: string) => void }
function Filters({ state, vertical = false }: { state: ReleaseState; vertical?: boolean }) {
  const id = useId();
  return <div className={cn("space-y-5", !vertical && "flex flex-wrap items-end gap-5 space-y-0")}><fieldset aria-label="Update category" className={cn("m-0 flex min-w-0 flex-wrap gap-1 rounded-2xl border-0 bg-muted/30 p-1", vertical && "lg:flex-col")} >{["all", ...state.tags].map(tag => <button type="button" key={tag} aria-pressed={state.tag === tag} onClick={() => state.setTag(tag)} className={cn("rounded-full px-4 py-2.5 text-left text-xs", state.tag === tag ? "bg-background font-medium shadow-sm" : "text-muted-foreground")}>{tag === "all" ? "All" : tag}</button>)}</fieldset><div><label htmlFor={id} className="mb-2 block text-xs text-muted-foreground">Version</label><select id={id} value={state.version} onChange={event => state.setVersion(event.target.value)} className="rounded-full border border-border bg-background px-3 py-2 text-xs"><option value="all">All versions</option>{state.versions.map(version => <option key={version} value={version}>{version}</option>)}</select></div></div>;
}
function Empty({ state }: { state: ReleaseState }) {
  return <div className="rounded-2xl border border-border p-8"><p>No releases match these filters.</p><button type="button" onClick={() => { state.setTag("all"); state.setVersion("all"); }} className="mt-3 underline underline-offset-4">Reset filters</button></div>;
}
function Release({ release, prefix, editorial = false }: { release: ChangelogRelease; prefix: string; editorial?: boolean }) {
  const reduce = useReducedMotion();
  return <motion.article id={`${prefix}-${release.id}`} initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4, ease: EASE_OUT }} className={cn("scroll-mt-6 space-y-4 border-border bg-background", editorial ? "border-t py-8" : "rounded-2xl border p-6 sm:p-8")}>
    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground"><time dateTime={release.date}>{new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(release.date))}</time><span className="rounded-full bg-muted px-2 py-1 font-mono text-[10px]">{release.version}</span></div>
    <h2 className="text-xl font-medium tracking-[-0.035em]"><a href={`#${prefix}-${release.id}`} className="underline-offset-4 hover:underline">{release.title}</a></h2><p className="text-sm leading-7 text-muted-foreground">{release.summary}</p><ul aria-label="Release categories" className="flex flex-wrap gap-2">{release.tags.map(tag => <li key={tag} className="rounded-full bg-muted px-3 py-1 text-[10px]">{tag}</li>)}</ul>
    {release.image && <img src={release.image.src} alt={release.image.alt} className="aspect-video w-full rounded-xl object-cover" />}
    {release.sections.length > 1 && <nav aria-label={`${release.title} contents`} className="flex flex-wrap gap-4 text-sm">{release.sections.map(section => <a key={section.id} href={`#${prefix}-${release.id}-${section.id}`} className="underline underline-offset-4">{section.title}</a>)}</nav>}
    {release.sections.map(section => <section key={section.id} id={`${prefix}-${release.id}-${section.id}`} className="scroll-mt-6"><h3 className="mb-2 text-lg font-medium">{section.title}</h3><div className="leading-relaxed text-muted-foreground">{section.body}</div></section>)}
    {release.href && <a href={release.href} className="inline-block text-sm underline underline-offset-4">Read the release notes ↗</a>}
  </motion.article>;
}

export function ChangelogSidebarUpdates(props: ChangelogPageProps) {
  const state = useReleases(props); const id = useId();
  return <article className={cn("w-full bg-background px-4 py-12 text-foreground sm:px-8", props.className)}><div className="mx-auto max-w-6xl"><header className="relative isolate overflow-hidden rounded-3xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20"><div aria-hidden="true" className="pointer-events-none absolute -top-24 -z-10 right-[-8%] h-72 w-4/5 rotate-[-7deg] bg-gradient-to-r from-rose-300 via-amber-200 to-sky-300 opacity-40 blur-3xl" /><p className="text-sm text-muted-foreground">Notes from the team</p><h1 className="mt-4 max-w-2xl text-balance text-4xl font-medium leading-[1.04] tracking-[-0.05em] md:text-5xl">{props.title}</h1><p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{props.introduction}</p></header><div className="mt-10 grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12"><aside className="space-y-7 lg:sticky lg:top-8"><div><p className="text-sm font-medium">Release notes</p><p className="mt-2 text-xs text-muted-foreground">Browse by area</p></div><Filters state={state} vertical /><nav aria-label="Release archive" className="flex flex-wrap gap-3 lg:flex-col">{state.releases.map(release => <a href={`#${id}-${release.id}`} key={release.id} className="text-xs text-muted-foreground hover:text-foreground">{release.version} · {release.title}</a>)}</nav></aside><div className="space-y-3"><p role="status" className="sr-only">{state.releases.length} releases · Newest first · UTC</p>{state.releases.map(release => <Release key={release.id} release={release} prefix={id} />)}{!state.releases.length && <Empty state={state} />}{props.onSubscribe && <EditorialSubscription onSubscribe={props.onSubscribe} className="mt-5" />}</div></div></div></article>;
}

export function ChangelogEditorialUpdates(props: ChangelogPageProps) {
  const state = useReleases(props); const id = useId();
  return <article className={cn("mx-auto w-full max-w-5xl bg-background px-4 pb-24 text-foreground sm:px-8", props.className)}><header className="pb-12 pt-16 sm:pb-16 sm:pt-24"><p className="text-sm text-muted-foreground">The product journal</p><h1 className="mt-4 max-w-3xl text-balance text-4xl font-medium leading-[1.04] tracking-[-0.05em] md:text-5xl">{props.title}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{props.introduction}</p></header><Filters state={state} /><p role="status" className="sr-only">{state.releases.length} releases · Newest first · UTC</p><div className="mt-7 space-y-4">{state.releases.map(release => <div key={release.id} className="grid gap-5 md:grid-cols-[100px_1fr]"><p className="pt-8 font-mono text-xs text-muted-foreground">{release.version}</p><Release release={release} prefix={id} editorial /></div>)}{!state.releases.length && <Empty state={state} />}</div>{props.onSubscribe && <EditorialSubscription onSubscribe={props.onSubscribe} title="Keep up with the changes worth knowing about." className="mt-16" />}</article>;
}

export function ChangelogSimpleUpdates(props: ChangelogPageProps) {
  const state = useReleases(props); const id = useId(); const [featured, ...history] = state.releases;
  return <article className={cn("mx-auto w-full max-w-5xl bg-background px-4 pb-24 text-foreground sm:px-8", props.className)}><header className="pb-12 pt-16 sm:pb-16 sm:pt-24"><p className="text-sm text-muted-foreground">Small changes. Better days.</p><h1 className="mt-4 max-w-3xl text-balance text-4xl font-medium leading-[1.05] tracking-[-0.05em] md:text-5xl">{props.title}</h1><p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">{props.introduction}</p></header><div className="mb-8"><Filters state={state} /></div><p role="status" className="sr-only">{state.releases.length} releases · Newest first · UTC</p>{featured ? <section aria-label="Featured improvement" className="grid gap-2 rounded-3xl border border-border bg-background p-2 md:grid-cols-[1.05fr_0.95fr]"><div className="p-5 sm:p-8"><p className="mb-5 text-xs font-medium text-muted-foreground">Latest update</p><Release release={featured} prefix={id} editorial /></div><div className="grid min-h-80 place-items-center rounded-3xl bg-amber-50 p-5 dark:bg-amber-950/20 sm:p-8"><div className="relative w-full max-w-xs"><div aria-hidden="true" className="absolute inset-0 rotate-[-8deg] rounded-2xl border border-amber-200 bg-amber-100 dark:border-amber-900 dark:bg-amber-950" /><figure className="relative rotate-3 rounded-2xl border border-border bg-background p-4 shadow-sm">{featured.image ? <img src={featured.image.src} alt={featured.image.alt} className="aspect-square w-full rounded-xl object-cover" /> : <svg viewBox="0 0 240 210" className="w-full rounded-xl bg-gradient-to-br from-amber-100 via-rose-100 to-primary/10" role="img" aria-label="An original illustration of shared memories"><path d="M0 170 60 80 130 150 195 50 240 150V210H0Z" fill="currentColor" className="text-primary/20" /><circle cx="65" cy="55" r="25" fill="currentColor" className="text-amber-300/60" /></svg>}<figcaption className="mt-5 text-center text-sm font-medium">A month worth keeping</figcaption></figure></div></div></section> : <Empty state={state} />}<section aria-label="Earlier updates" className="py-14 sm:py-20"><p className="text-xs text-muted-foreground">Previously</p><h2 className="mt-1 text-xl font-medium tracking-tight">More useful changes</h2><div className="mt-5 space-y-3">{history.map(release => <Release key={release.id} release={release} prefix={id} />)}</div></section>{props.onSubscribe && <EditorialSubscription onSubscribe={props.onSubscribe} title="Get the next useful update by email." />}</article>;
}
