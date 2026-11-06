"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/motion/select";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Bot, Check, ChevronRight, Copy, History, Search } from "lucide-react";
import { Button } from "@/components/motion/button";
import { CenterMorphModal, CenterMorphModalContent, CenterMorphModalTrigger } from "@/components/motion/center-morph-modal";
import { cn } from "@/lib/utils";
import { SPRING_LAYOUT } from "@/lib/ease";

export interface AuditEvent {
  id: string;
  /** ISO timestamp. Dates are grouped using the supplied time zone. */
  timestamp: string;
  actor: string;
  category: string;
  action: string;
  target: string;
  before?: unknown;
  after?: unknown;
  details?: Record<string, unknown>;
  avatarUrl?: string;
  dayLabel?: string;
  actorKind?: "person" | "system";
  icon?: ReactNode;
  description?: string;
}
export interface AuditTrailProps {
  events: readonly AuditEvent[];
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  actor?: string;
  onActorChange?: (actor: string) => void;
  category?: string;
  onCategoryChange?: (category: string) => void;
  timeZone?: string;
  className?: string;
}
const field = "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
function auditValue(value: unknown): string { return value === null || value === undefined ? "Not set" : typeof value === "object" ? JSON.stringify(value) : String(value); }
function auditChanges(event: AuditEvent) {
  const before = event.before && typeof event.before === "object" && !Array.isArray(event.before) ? event.before as Record<string,unknown> : null;
  const after = event.after && typeof event.after === "object" && !Array.isArray(event.after) ? event.after as Record<string,unknown> : null;
  if (before || after) return [...new Set([...Object.keys(before ?? {}),...Object.keys(after ?? {})])].map(label => ({ label,before: before?.[label],after: after?.[label] }));
  return event.before !== undefined || event.after !== undefined ? [{ label: "Value",before: event.before,after: event.after }] : [];
}


/** Searchable, immutable host-provided history. Inspection never changes the event record. */
export function AuditTrail({ events, query, defaultQuery = "", onQueryChange, actor, onActorChange, category, onCategoryChange, timeZone = "UTC", className }: AuditTrailProps) {
  const [search, setSearch] = useState(defaultQuery);
  const [person, setPerson] = useState("");
  const [kind, setKind] = useState("");
  const reduced = useReducedMotion();
  const [copied,setCopied] = useState(""); const [copyError,setCopyError] = useState("");
  const q = query ?? search;
  const who = actor ?? person;
  const type = category ?? kind;
  const changeQuery = (next: string) => { setSearch(next); onQueryChange?.(next); };
  const changeActor = (next: string) => { setPerson(next); onActorChange?.(next); };
  const changeCategory = (next: string) => { setKind(next); onCategoryChange?.(next); };
  const groups = useMemo(() => {
    const result = new Map<string, AuditEvent[]>();
    const date = new Intl.DateTimeFormat("en", { dateStyle: "full", timeZone });
    [...events].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).filter((event) =>
      (!who || event.actor === who) && (!type || event.category === type) &&
      `${event.action} ${event.target} ${event.actor} ${event.category}`.toLowerCase().includes(q.toLowerCase()),
    ).forEach((event) => {
      const day = date.format(new Date(event.timestamp));
      result.set(day, [...(result.get(day) ?? []), event]);
    });
    return result;
  }, [events, q, who, type, timeZone]);
  return <section aria-label="Workspace history" className={cn("mx-auto w-full max-w-4xl bg-background p-4 text-foreground sm:p-6", className)}>
    <header className="mb-5 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full border border-border"><History className="size-4 text-muted-foreground"/></span><div><h2 className="text-xl font-medium tracking-tight">Audit trail</h2><p className="mt-1 text-xs text-muted-foreground">Changes across your workspace</p></div></header>
    <div className="mb-6 flex flex-wrap items-center gap-3"><fieldset aria-label="Filter category" className="m-0 flex max-w-full gap-0.5 overflow-x-auto rounded-full border-0 bg-muted p-0.5">{["", ...new Set(events.map(event => event.category))].map(item => <button type="button" key={item} aria-pressed={type === item} onClick={() => changeCategory(item)} className={cn("h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring", type === item ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}>{item || "All"} <span className="ml-1 tabular-nums">{item ? events.filter(event => event.category === item).length : events.length}</span></button>)}</fieldset><div className="flex w-full gap-2 sm:ml-auto sm:w-auto"><Select value={who} onValueChange={changeActor} className="w-36 shrink-0"><SelectTrigger className="h-10 !rounded-full text-xs"><span className="sr-only">Filter audit actors</span><SelectValue/></SelectTrigger><SelectContent><SelectItem value="">Everyone</SelectItem>{[...new Set(events.map(event => event.actor))].map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}</SelectContent></Select><label className="relative min-w-0 flex-1 sm:w-44"><Search aria-hidden className="absolute top-3 left-3 size-4 text-muted-foreground"/><input aria-label="Search events" className={cn(field, "h-10 w-full rounded-full pl-10 text-xs")} value={q} onChange={event => changeQuery(event.target.value)} placeholder="Search events…"/></label></div></div>
    <div className="max-h-144 overflow-y-auto overscroll-contain px-1">{!groups.size && <p role="status" className="py-16 text-center text-sm text-muted-foreground">No events match these filters.</p>}
    {[...groups].map(([date, items]) => <section key={date} className="mb-5 last:mb-0"><h3 className="mb-2 flex items-center gap-3 px-3 py-2 text-xs text-muted-foreground"><span>{items[0].dayLabel ?? date}</span><span className="h-px flex-1 bg-border"/><span>{items.length}</span></h3><ol>{items.map(event => {
      const changes = auditChanges(event);
      const time = new Intl.DateTimeFormat("en",{ timeStyle: "short",timeZone }).format(new Date(event.timestamp));
      return <motion.li layout={!reduced} transition={SPRING_LAYOUT} key={event.id} className="@container/audit-row"><CenterMorphModal><CenterMorphModalTrigger><button type="button" aria-label={`View event: ${event.actor} ${event.action} ${event.target}`} className="grid w-full cursor-pointer grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 gap-y-2 rounded-xl px-3 py-3 text-left text-sm hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-ring @xl/audit-row:grid-cols-[auto_minmax(0,9rem)_minmax(0,1fr)_auto_auto] @xl/audit-row:gap-x-5 @xl/audit-row:px-4 @xl/audit-row:py-4"><span className="grid size-8 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-background text-xs text-muted-foreground @xl/audit-row:size-9">{event.avatarUrl ? <img src={event.avatarUrl} alt="" className="size-full object-cover"/> : event.actorKind === "system" ? <Bot className="size-4"/> : event.actor.split(" ").map(part => part[0]).slice(0,2).join("")}</span><span className="col-start-2 row-start-1 min-w-0 break-words font-medium leading-snug">{event.actor}</span><span className="col-span-4 col-start-1 row-start-2 min-w-0 @xl/audit-row:col-span-1 @xl/audit-row:col-start-3 @xl/audit-row:row-start-1"><span className="block break-words text-sm leading-snug"><span className="text-muted-foreground">{event.action}</span> <span className="font-medium">{event.target}</span></span><span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground"><span className="inline-flex items-center gap-1.5 [&_svg]:size-3">{event.icon}{event.category}</span>{changes.length === 1 ? <span className="inline-flex flex-wrap items-center gap-1.5"><span>{changes[0].label}:</span><span className="rounded border border-border px-1.5 py-0.5">{auditValue(changes[0].before)}</span><ArrowRight aria-hidden className="size-3"/><span className="rounded border border-border px-1.5 py-0.5 text-foreground">{auditValue(changes[0].after)}</span></span> : changes.length > 1 ? <span>{changes.length} fields changed</span> : null}</span></span><time dateTime={event.timestamp} className="col-start-3 row-start-1 max-w-20 text-right text-xs text-muted-foreground tabular-nums @xl/audit-row:col-start-4">{time}</time><ChevronRight aria-hidden className="col-start-4 row-start-1 size-3.5 text-muted-foreground @xl/audit-row:col-start-5"/></button></CenterMorphModalTrigger><CenterMorphModalContent ariaLabel="Event details" className="max-w-2xl"><span className="text-xs text-muted-foreground">{event.category}</span><h3 className="mt-2 text-xl font-medium">Event details</h3><div className="my-5 flex items-center gap-3"><span className="grid size-10 place-items-center overflow-hidden rounded-full border border-border bg-muted">{event.avatarUrl ? <img src={event.avatarUrl} alt="" className="size-full object-cover"/> : <Bot className="size-4"/>}</span><div><p className="text-sm font-medium">{event.actor}</p><p className="mt-1 text-xs text-muted-foreground">{event.dayLabel ?? date} · {time}</p></div></div><p className="text-sm">{event.actor} {event.action} <span className="font-medium">{event.target}</span>.</p>{event.description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{event.description}</p>}{changes.length > 0 && <div className="mt-6"><h4 className="mb-3 text-sm font-medium">Changed values</h4><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-left text-xs"><thead className="bg-muted/50 text-muted-foreground"><tr><th className="p-3 font-medium">Field</th><th className="p-3 font-medium">Before</th><th className="p-3 font-medium">After</th></tr></thead><tbody>{changes.map(change => <tr key={change.label} className="border-t border-border"><th className="p-3 font-medium">{change.label}</th><td className="p-3 text-muted-foreground">{auditValue(change.before)}</td><td className="p-3">{auditValue(change.after)}</td></tr>)}</tbody></table></div></div>}<dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-4 text-xs">{Object.entries(event.details ?? {}).map(([label,value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words">{auditValue(value)}</dd></div>)}<div className="col-span-2"><dt className="text-muted-foreground">Event ID</dt><dd className="mt-1 flex items-center gap-2"><code>{event.id}</code><button type="button" aria-label="Copy event ID" className="cursor-pointer rounded p-1 hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring" onClick={async () => { try { await navigator.clipboard.writeText(event.id); setCopied(event.id); setCopyError(""); } catch { setCopyError("The event ID could not be copied. Select and copy it manually."); } }}>{copied === event.id ? <Check className="size-3.5"/> : <Copy className="size-3.5"/>}</button></dd></div></dl>{copyError && <p role="alert" className="mt-3 text-xs text-destructive">{copyError}</p>}</CenterMorphModalContent></CenterMorphModal></motion.li>;
    })}</ol></section>)}
    <footer className="mt-4 flex items-center justify-between text-xs text-muted-foreground"><span>{[...groups.values()].reduce((count, items) => count + items.length, 0)} matching events.</span>{(q || who || type) && <Button variant="ghost" size="sm" onClick={() => { changeQuery(""); changeActor(""); changeCategory(""); }}>Reset filters</Button>}</footer></div>
  </section>;
}
