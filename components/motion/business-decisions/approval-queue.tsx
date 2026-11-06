"use client";

import { useId, useRef, useState } from "react";
import { FileText, KeyRound, Palette, Wallet, BookOpen, Search, ChevronRight, ClipboardCheck, Clock3, Check, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/motion/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { cn } from "@/lib/utils";
import { DecisionDialog, DecisionFeedback, useDecisionAction } from "./decision-support";

export type ReviewDecision = "approved" | "rejected" | "changes-requested";
export interface ApprovalRequest {
  id: string; title: string; requester: string; category: string; context: string;
  status: "pending" | ReviewDecision; submittedAt: string;
  attachments?: { name: string; href: string; size?: string }[];
  decisionNote?: string;
  avatarUrl?: string; dueLabel?: string; reference?: string;
  fields?: { label: string; value: string }[];
}
export interface ApprovalQueueProps {
  requests: ApprovalRequest[];
  onDecision: (id: string, decision: ReviewDecision, note: string) => void | Promise<void>;
  selectedId?: string | null; defaultSelectedId?: string | null;
  onSelectedIdChange?: (id: string | null) => void; className?: string;
}
/** Searchable host-owned review records. Failed decisions leave the review and note intact. */
export function ApprovalQueue({ requests, onDecision, selectedId, defaultSelectedId = null, onSelectedIdChange, className }: ApprovalQueueProps) {
  const [internal, setInternal] = useState(defaultSelectedId);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("pending");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const noteId = useId();
  const [validation, setValidation] = useState("");
  const action = useDecisionAction();
  const selected = requests.find(item => item.id === (selectedId === undefined ? internal : selectedId));
  const SelectedIcon = selected?.category === "Design" ? Palette : selected?.category === "Purchase" ? Wallet : selected?.category === "Content" ? BookOpen : KeyRound;
  const select = (id: string | null) => { if (selectedId === undefined) setInternal(id); onSelectedIdChange?.(id); action.clearError(); };
  async function decide(decision: ReviewDecision) {
    if (!selected) return;
    if (decision !== "approved" && !(notes[selected.id] ?? "").trim()) { setValidation("A note is required to request changes or decline."); noteRef.current?.focus(); return; }
    setValidation("");
    if (await action.run(() => onDecision(selected.id, decision, (notes[selected.id] ?? "").trim()))) select(null);
  }
  const visible = requests.filter(item => (filter === "all" || (filter === "pending" ? item.status === "pending" : item.status !== "pending")) && `${item.title} ${item.requester} ${item.category} ${item.context}`.toLowerCase().includes(query.toLowerCase()));
  return <section className={cn("w-full max-w-4xl bg-background p-4 text-foreground sm:p-6", className)} aria-label="Approval queue">
    <header className="mb-5 flex items-center gap-3"><span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground"><ClipboardCheck className="size-4" /></span><div><h2 className="text-xl font-medium">Approval queue</h2><p className="mt-1 text-xs text-muted-foreground">{requests.filter(item => item.status === "pending").length} requests awaiting review</p></div></header>
    <Tabs value={filter} onValueChange={setFilter}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><TabsList aria-label="Filter approval requests" className="gap-0.5 bg-muted p-0.5 [&_[data-tabs-label]]:text-foreground">{[["pending", "Pending"], ["completed", "Reviewed"], ["all", "All"]].map(([value, label]) => <TabsTrigger key={value} value={value} indicatorClassName="bg-background" className="h-8 gap-1.5 px-3 py-0 text-xs focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">{label}<span className="text-muted-foreground">{requests.filter(item => value === "all" || (value === "pending" ? item.status === "pending" : item.status !== "pending")).length}</span></TabsTrigger>)}</TabsList><label className="relative w-full sm:w-56"><Search aria-hidden className="absolute left-3 top-3 size-4 text-muted-foreground" /><input aria-label="Search approval requests" placeholder="Search requests..." type="search" value={query} onChange={event => setQuery(event.target.value)} className="h-10 w-full rounded-full border border-border bg-background pl-10 pr-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label></div>
      <TabsContent value={filter} className="mt-0 rounded-none"><div className="max-h-[30rem] overflow-y-auto overscroll-contain p-1"><div className="min-h-96"><ul className="space-y-2.5">{visible.map(item => { const Icon = item.category === "Design" ? Palette : item.category === "Purchase" ? Wallet : item.category === "Content" ? BookOpen : KeyRound; return <li key={item.id} className="relative flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-4 text-sm sm:gap-4 sm:px-5 hover:bg-muted/20 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"><span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><p className="truncate text-sm font-medium">{item.title}</p>{item.dueLabel && <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{item.dueLabel}</span>}</div><p className="mt-1 truncate text-xs text-muted-foreground">{item.context}</p><p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground"><span>{item.category}</span><span>·</span><span>{item.submittedAt}</span><span className="inline-flex items-center gap-1.5 sm:hidden"><span>·</span>{item.requester}</span></p><span className="mt-2 block sm:hidden"><span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground"><Clock3 className="size-3.5" />{item.status.replaceAll("-", " ")}</span></span></div><div className="hidden w-32 shrink-0 space-y-2 sm:block"><div className="flex items-center gap-2">{item.avatarUrl ? <img src={item.avatarUrl} alt="" className="size-6 rounded-full object-cover" /> : <span className="grid size-6 place-items-center rounded-full bg-muted text-[10px]">{item.requester.split(" ").map(part => part[0]).join("")}</span>}<p className="truncate text-xs">{item.requester}</p></div><p className="flex items-center gap-1.5 text-xs capitalize text-muted-foreground"><Clock3 className="size-3.5" />{item.status.replaceAll("-", " ")}</p></div><ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground" /><button type="button" aria-label={`Review ${item.title}`} className="absolute inset-0 cursor-pointer rounded-2xl outline-none" onClick={() => { setValidation(""); select(item.id); }} /></li>; })}</ul>
        {!visible.length && <p role="status" className="py-8 text-center text-muted-foreground">No matching requests.</p>}
      </div></div></TabsContent>
    </Tabs>
    <DecisionDialog open={Boolean(selected)} onOpenChange={open => { if (!open && !action.busy) select(null); }} title={selected?.title ?? "Review request"} busy={action.busy} showCloseButton={false} radius={16} shadow={false} backdropClassName="bg-foreground/15" className="max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-xl rounded-2xl p-0">
      {selected && <>
        <header className="flex items-start gap-3 border-b border-border px-5 py-4"><span aria-hidden className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-border text-muted-foreground"><SelectedIcon className="size-4" /></span><div className="min-w-0 flex-1"><p className="mb-1 text-xs text-muted-foreground">{selected.category}{selected.reference && ` · ${selected.reference}`}</p><h3 className="text-xl font-medium">{selected.title}</h3></div><Button size="icon" variant="ghost" className="size-9 shrink-0 rounded-full" aria-label="Close review" disabled={action.busy} onClick={() => select(null)}><X className="size-4" /></Button></header>
        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="grid size-6 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-background text-xs text-muted-foreground">{selected.avatarUrl ? <img src={selected.avatarUrl} alt="" className="size-full object-cover" /> : selected.requester.split(" ").map(part => part[0]).join("")}</span><p className="text-xs">{selected.requester}<span className="ml-2 text-muted-foreground">{selected.submittedAt}</span></p></div><span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground"><Clock3 className="size-3.5" />{selected.status.replaceAll("-", " ")}</span></div>
          <p className="text-sm leading-relaxed text-muted-foreground">{selected.context}</p>
          {selected.fields && <dl className="grid grid-cols-2 gap-x-5 gap-y-4 rounded-xl border border-border p-4">{selected.fields.map(field => <div key={field.label} className="min-w-0"><dt className="text-xs text-muted-foreground">{field.label}</dt><dd className="mt-1 text-sm">{field.value}</dd></div>)}</dl>}
          {selected.attachments?.length ? <section><h4 className="mb-2 text-xs font-medium">Supporting files</h4><ul className="space-y-2">{selected.attachments.map(file => <li key={file.href}><a className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5 hover:bg-muted/40" href={file.href} target="_blank" rel="noreferrer"><FileText aria-hidden className="size-4 shrink-0 text-muted-foreground" /><span className="min-w-0 flex-1"><span className="block truncate text-xs font-medium">{file.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{file.size}</span></span></a></li>)}</ul></section> : null}
          {selected.status === "pending" ? <div><label htmlFor={noteId} className="mb-1.5 block text-xs font-medium">Review note <span className="font-normal text-muted-foreground">· optional when approving</span></label><textarea id={noteId} ref={noteRef} value={notes[selected.id] ?? ""} onChange={event => { setNotes(previous => ({ ...previous, [selected.id]: event.target.value })); setValidation(""); }} disabled={action.busy} rows={3} placeholder="Share your feedback…" className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/60 disabled:opacity-60" /><p className="mt-1 text-xs text-muted-foreground">A note is required to request changes or decline.</p>{validation && <p role="alert" className="mt-1 text-xs text-destructive">{validation}</p>}</div> : <p className="rounded-xl bg-muted/40 p-4 text-sm">{selected.decisionNote ?? "This request has been reviewed."}</p>}
          {(action.error || action.busy) && <DecisionFeedback {...action} />}
        </div>
        {selected.status === "pending" && <footer className="flex flex-wrap items-center gap-1 border-t border-border px-5 py-4 sm:gap-2"><Button size="sm" className="h-9 gap-1.5 rounded-full px-2 text-xs sm:px-3" disabled={action.busy} onClick={() => { void decide("approved"); }}><Check className="size-3.5" />Approve</Button><Button size="sm" variant="outline" className="h-9 gap-1.5 rounded-full px-2 text-xs sm:px-3" disabled={action.busy} onClick={() => { void decide("changes-requested"); }}><MessageSquare className="size-3.5" />Request changes</Button><Button size="sm" variant="ghost" className="ml-auto h-9 gap-1.5 rounded-full px-2 text-xs sm:px-3" disabled={action.busy} onClick={() => { void decide("rejected"); }}><X className="size-3.5" />Decline</Button></footer>}
      </>}
    </DecisionDialog>
  </section>;
}
