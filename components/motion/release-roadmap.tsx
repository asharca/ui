"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronUp, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface RoadmapStatus { id: string; label: string }
export interface RoadmapRelease {
  id: string;
  title: string;
  description: string;
  statusId: string;
  version?: string;
  /** ISO date or null. Unknown/invalid dates remain explicitly unscheduled. */
  date?: string | null;
  phase?: string;
  progress?: number;
  votes: number;
  voted?: boolean;
  details?: string;
  links?: { label: string; href: string }[];
  /** Optional explicit host period; never inferred from a target date. */
  period?: { id: string; label: string; title: string };
}
export interface ReleaseRoadmapProps {
  releases: RoadmapRelease[];
  statuses: RoadmapStatus[];
  title?: string;
  description?: string;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void;
  /** Host persists the vote and supplies updated votes/voted in releases. No optimistic fake counts. */
  onVote?: (release: RoadmapRelease, voted: boolean) => Promise<void>;
  className?: string;
}
const month = new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" });
const day = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
function timestamp(release: RoadmapRelease) { const date = release.date ? Date.parse(release.date) : NaN; return Number.isFinite(date) ? date : null; }


/** Vertical period timeline; undated plans are never forced into dated Timeline events. */
export function ReleaseRoadmap({ releases, statuses, title = "What we are building, and what comes next.", description = "Updated every two weeks. Vote for the work that matters to your team and open any item to see what is included.", selectedId: controlledId, defaultSelectedId = null, onSelectedIdChange, onVote, className }: ReleaseRoadmapProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [selectedInternal, setSelectedInternal] = useState<string | null>(defaultSelectedId);
  const selectedId = controlledId === undefined ? selectedInternal : controlledId;
  const selected = releases.find((release) => release.id === selectedId);
  const [pending, setPending] = useState<string[]>([]);
  const locks = useRef(new Set<string>());
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const alive = useRef(true);
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  const select = (id: string | null) => { if (controlledId === undefined) setSelectedInternal(id); onSelectedIdChange?.(id); };
  const vote = async (release: RoadmapRelease) => {
    if (!onVote || locks.current.has(release.id)) return;
    locks.current.add(release.id); setPending([...locks.current]); setError(null); setNotice("");
    try { await onVote(release, !release.voted); if (alive.current) setNotice(`Vote ${release.voted ? "removed from" : "recorded for"} ${release.title}.`); }
    catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : "Your vote could not be saved."); }
    finally { locks.current.delete(release.id); if (alive.current) setPending([...locks.current]); }
  };
  const sorted = releases.filter(release => !status || release.statusId === status).map((release, index) => ({ release, index, time: timestamp(release) })).sort((a, b) => a.release.period && b.release.period ? a.index - b.index : a.time === null ? b.time === null ? a.index - b.index : 1 : b.time === null ? -1 : b.time - a.time || a.index - b.index);
  const groups = new Map<string, typeof sorted>();
  for (const item of sorted) { const period = item.release.period?.id ?? (item.time === null ? "Unscheduled" : month.format(item.time)); const items = groups.get(period) ?? []; items.push(item); groups.set(period, items); }
  
  const voteControl = (release: RoadmapRelease) => onVote ? <Button size="sm" variant={release.voted ? "secondary" : "outline"} className="relative z-10 h-8 gap-1.5 rounded-full px-3 text-xs" aria-label={`${release.voted ? "Remove vote for" : "Vote for"} ${release.title}`} aria-pressed={Boolean(release.voted)} disabled={pending.includes(release.id)} onClick={() => vote(release)}><ChevronUp className="size-3.5" /><AnimatedNumber value={release.votes} startOnView={false} />{pending.includes(release.id) && <span className="sr-only">Saving vote</span>}</Button> : <span className="text-xs tabular-nums text-muted-foreground">{release.votes} votes</span>;
  return <section aria-label="Release roadmap" className={cn("w-full bg-background px-4 py-16 text-foreground sm:px-8 sm:py-24", className)}><div className="mx-auto w-full max-w-5xl">
    <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-xl"><p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Roadmap</p><h2 className="text-balance text-4xl font-medium tracking-tight">{title}</h2><p className="mt-4 text-pretty text-base leading-7 text-muted-foreground">{description}</p></div><fieldset aria-label="Filter roadmap status" className="m-0 flex max-w-full shrink-0 gap-1 overflow-x-auto rounded-full border-0 bg-muted p-1">{[{ id: "", label: "All" }, ...statuses].map(item => <button type="button" key={item.id} aria-pressed={(status ?? "") === item.id} onClick={() => setStatus(item.id || null)} className={cn("cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring", (status ?? "") === item.id ? "bg-background" : "text-muted-foreground hover:text-foreground")}>{item.label}<span className="ml-2 text-xs text-muted-foreground">{item.id ? releases.filter(release => release.statusId === item.id).length : releases.length}</span></button>)}</fieldset></header>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<p role="status" className="sr-only">{notice}</p>
    <div ref={timelineRef} className="relative mt-14"><div aria-hidden="true" className="absolute top-4 bottom-4 left-4 w-px bg-border lg:left-[calc(10rem+2.5rem+1rem)]"></div>
      {[...groups].map(([period, items]) => <section aria-label={items[0].release.period?.title ?? period} key={period} className="grid gap-4 pb-12 last:pb-0 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-10"><header className="pl-12 lg:sticky lg:top-24 lg:self-start lg:pt-4 lg:pl-0"><h3 className="text-xl font-medium">{items[0].release.period?.label ?? period}</h3>{items[0].release.period && <p className="mt-1 font-mono text-xs text-muted-foreground">{items[0].release.period.title}</p>}</header><ul className="space-y-3 pl-12 lg:pl-12">{items.map(({ release }) => <motion.li key={release.id} initial={reduce ? false : { opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, ease: EASE_OUT }} className="relative rounded-2xl border border-border bg-background p-5 transition-colors hover:border-foreground/25 motion-reduce:transition-none"><span aria-hidden className={cn("absolute top-5 -left-12 grid size-8 place-items-center rounded-full bg-background",release.progress === 100 ? "bg-muted" : release.progress !== undefined ? "size-7 border-2 border-foreground" : "border border-dashed border-border")}>{release.progress === 100 ? <Check className="size-3.5"/> : release.progress === undefined ? <span className="size-1.5 rounded-full bg-muted-foreground"/> : null}</span><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-xs text-muted-foreground">{release.phase && `${release.phase} · `}{statuses.find(item => item.id === release.statusId)?.label ?? release.statusId}{release.progress !== undefined && release.progress < 100 && ` · ${Math.max(0,Math.min(100,release.progress))}%`}</p><button type="button" aria-haspopup="dialog" className="mt-2 block cursor-pointer text-left text-xl font-medium outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ring" onClick={() => select(release.id)}>{release.title}</button><p className="mt-2 text-sm leading-6 text-muted-foreground">{release.description}</p></div>{voteControl(release)}</div></motion.li>)}</ul></section>)}
      {!sorted.length && <p className="py-10 pl-12 text-sm text-muted-foreground">No releases in this stage yet.</p>}
    </div></div>
    <MorphingModal viewId={selectedId} onClose={() => select(null)} ariaLabel={selected?.title ?? "Release details"} placement="center" className="max-h-[85dvh] max-w-xl overflow-y-auto"><div className="space-y-4">{selected ? <><div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span>{(statuses.find((item) => item.id === selected.statusId)?.label ?? selected.statusId)}</span>{selected.version && <span>{selected.version}</span>}{selected.phase && <span>{selected.phase}</span>}</div><h3 className="text-xl font-semibold">{selected.title}</h3><p className="text-xs text-muted-foreground">{timestamp(selected) === null ? "No date committed" : day.format(timestamp(selected)!)} · {selected.progress === undefined ? "Progress not reported" : `${Math.max(0, Math.min(100, selected.progress))}% complete`}</p><p className="whitespace-pre-wrap text-sm leading-7">{selected.details ?? selected.description}</p>{selected.links?.map((link) => <a key={link.href} href={link.href} className="flex items-center gap-2 text-sm underline underline-offset-4">{link.label}<ExternalLink className="size-3" /></a>)}{voteControl(selected)}</> : <p>This release is no longer available.</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end"><Button variant="outline" size="sm" onClick={() => select(null)}>Close release</Button></div></div></MorphingModal>
  </section>;
}
