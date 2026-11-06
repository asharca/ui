"use client";

import { Check, ChevronDown, FileText, GitCommitHorizontal, MessageSquare } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { FileDiff, type FileDiffLine } from "@/components/agents/file-diff";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";
import { lifecycleActionClass, lifecycleInputClass } from "./lifecycle-actions";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type ReviewDecision = "accepted" | "rejected";
export interface ReviewHunk { id: string; label: string; lines: FileDiffLine[] }
export interface ReviewVersion { id: string; label: string; hunks: ReviewHunk[] }
export interface ReviewFile { id: string; path: string; versions: ReviewVersion[] }
export interface ReviewTarget { fileId: string; versionId: string; hunkId?: string }
export interface ReviewComment extends ReviewTarget { id: string; body: string }
export interface ReviewedFile { fileId: string; versionId: string; acceptedHunkIds: string[]; rejectedHunkIds: string[] }
export interface DiffReviewProps {
  files: ReviewFile[];
  value?: Record<string, ReviewDecision>;
  defaultValue?: Record<string, ReviewDecision>;
  onValueChange?: (value: Record<string, ReviewDecision>) => void;
  selectedFileId?: string;
  defaultSelectedFileId?: string;
  onSelectedFileChange?: (id: string) => void;
  /** Resolves only when the host has persisted the decision. File targets omit hunkId. */
  onDecision: (target: ReviewTarget, decision: ReviewDecision) => void | Promise<void>;
  onComment?: (target: ReviewTarget, body: string) => void | Promise<void>;
  comments?: ReviewComment[];
  onCommit: (message: string, files: ReviewedFile[]) => void | Promise<void>;
  className?: string;
}

/** Keys include the version: decisions never leak into a newer revision. */
export function reviewDecisionKey(target: ReviewTarget) {
  return JSON.stringify([target.fileId, target.versionId, target.hunkId]);
}

/** A host-backed review workflow composed from FileDiff, not a second diff renderer. */
export function DiffReview({ files, value, defaultValue = {}, onValueChange, selectedFileId, defaultSelectedFileId, onSelectedFileChange, onDecision, onComment, comments, onCommit, className }: DiffReviewProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const [internal, setInternal] = useState(defaultValue);
  const [selected, setSelected] = useState(defaultSelectedFileId ?? files[0]?.id);
  const [versions, setVersions] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [localComments, setLocalComments] = useState<ReviewComment[]>([]);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState("");
  const [committed, setCommitted] = useState(false);
  const [commenting, setCommenting] = useState<string>();
  const commentInput = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (commenting) commentInput.current?.focus(); }, [commenting]);
  const decisions = value ?? internal;
  const file = (selectedFileId ?? selected) === "" ? undefined : files.find((entry) => entry.id === (selectedFileId ?? selected)) ?? files[0];
  const versionFor = (entry: ReviewFile) => entry.versions.find((version) => version.id === versions[entry.id]) ?? entry.versions[0];
  const all = files.flatMap((entry) => {
    const current = versionFor(entry);
    return current?.hunks.map((hunk) => ({ fileId: entry.id, versionId: current.id, hunkId: hunk.id })) ?? [];
  });
  const reviewed = all.filter((target) => decisions[reviewDecisionKey(target)]).length;
  const complete = all.length > 0 && reviewed === all.length;
  const accepted = all.filter((target) => decisions[reviewDecisionKey(target)] === "accepted").length;
  const selectFile = (next: string) => { setSelected(next); onSelectedFileChange?.(next); };
  const run = async (operation: () => Promise<void>) => {
    if (pendingRef.current) return;
    pendingRef.current = true; setPending(true); setError(undefined);
    try { await operation(); } catch (cause) { setError(cause instanceof Error ? cause.message : "The action could not be saved. Please try again."); }
    finally { pendingRef.current = false; setPending(false); }
  };
  const decide = (target: ReviewTarget, decision: ReviewDecision) => void run(async () => {
    await onDecision(target, decision);
    const next = { ...decisions };
    const targets = target.hunkId ? [target] : all.filter((entry) => entry.fileId === target.fileId && entry.versionId === target.versionId);
    for (const entry of targets) next[reviewDecisionKey(entry)] = decision;
    if (value === undefined) setInternal(next);
    onValueChange?.(next); setCommitted(false);
    setExpanded((current) => {
      const nextExpanded = { ...current };
      for (const entry of targets) nextExpanded[reviewDecisionKey(entry)] = decision !== "accepted";
      return nextExpanded;
    });
    const unfinished = all.some((entry) => entry.fileId === target.fileId && !next[reviewDecisionKey(entry)]);
    if (!unfinished) {
      const nextFile = files.find((entry) => all.some((item) => item.fileId === entry.id && !next[reviewDecisionKey(item)]));
      if (nextFile) selectFile(nextFile.id);
    }
  });

  const changedLines = files.flatMap((entry) => versionFor(entry)?.hunks.flatMap((hunk) => hunk.lines) ?? []);
  return <section aria-label="Code change review" aria-busy={pending} className={cn("mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-1.5 text-foreground", className)}>
    <header className="space-y-3 px-3 pb-3 pt-2">
      <div className="flex items-start gap-2.5"><span className="grid size-7 shrink-0 place-items-center"><FileText className="size-4 text-muted-foreground" /></span><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-medium">Review changes</h2><p className="truncate text-xs text-muted-foreground">Agent · Review the proposed changes</p></div><span className="mt-2.5 flex shrink-0 gap-1.5 font-mono text-xs tabular-nums"><span className="text-emerald-600 dark:text-emerald-400">+{changedLines.filter((line) => line.type === "added").length}</span><span className="text-rose-600 dark:text-rose-400">−{changedLines.filter((line) => line.type === "removed").length}</span></span></div>
      <div className="flex items-center gap-3"><div role="progressbar" aria-label="Review progress" aria-valuemin={0} aria-valuemax={all.length || 1} aria-valuenow={reviewed} aria-valuetext={`${reviewed} of ${all.length} reviewed`} className="h-2 min-w-0 flex-1"><motion.div initial={false} animate={{ width: `${all.length ? reviewed / all.length * 100 : 0}%` }} transition={{ duration: reduced ? 0 : 0.3, ease: EASE_OUT }} className="h-full rounded-full bg-emerald-500" /></div><span role="status" className="shrink-0 text-xs text-muted-foreground tabular-nums">{reviewed} of {all.length} reviewed</span></div>
    </header>
    {files.length ? <ul aria-label="Changed files" className="divide-y divide-border overflow-clip rounded-2xl border border-border bg-background">{files.map((entry) => {
      const current = versionFor(entry);
      const lines = current?.hunks.flatMap((hunk) => hunk.lines) ?? [];
      const open = entry.id === file?.id;
      const reviewedFile = !!current?.hunks.length && current.hunks.every((hunk) => decisions[reviewDecisionKey({ fileId: entry.id, versionId: current.id, hunkId: hunk.id })]);
      return <li key={entry.id}><button type="button" aria-expanded={open} aria-controls={`${id}-${entry.id}`} onClick={() => selectFile(open ? "" : entry.id)} className="flex h-11 w-full min-w-0 items-center gap-2.5 px-4 text-left text-xs outline-none hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"><span className={cn("w-12 shrink-0", lines.every((line) => line.type === "added") ? "text-emerald-600 dark:text-emerald-400" : lines.every((line) => line.type === "removed") ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400")}>{lines.every((line) => line.type === "added") ? "New" : lines.every((line) => line.type === "removed") ? "Deleted" : "Edited"}</span><span className="min-w-0 flex-1 truncate font-mono"><span className="text-muted-foreground">{entry.path.slice(0, entry.path.lastIndexOf("/") + 1)}</span>{entry.path.slice(entry.path.lastIndexOf("/") + 1)}</span><span className="flex shrink-0 gap-1.5 font-mono tabular-nums">{lines.some((line) => line.type === "added") && <span className="text-emerald-600 dark:text-emerald-400">+{lines.filter((line) => line.type === "added").length}</span>}{lines.some((line) => line.type === "removed") && <span className="text-rose-600 dark:text-rose-400">−{lines.filter((line) => line.type === "removed").length}</span>}</span><span className={cn("grid size-4 shrink-0 place-items-center rounded-full border border-border font-mono text-[10px] text-muted-foreground", reviewedFile && "border-emerald-500 bg-emerald-500 text-white")}>{reviewedFile ? <Check className="size-2.5" strokeWidth={3} aria-label="Reviewed" /> : <span className="sr-only">{current?.hunks.length ?? 0} hunks to review</span>}</span><ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground", open && "rotate-180")} /></button>
        <AgentDisclosure open={open} id={`${id}-${entry.id}`}><div className="space-y-2">{current ? <>
          {!current.hunks.length && <p className="p-3 text-xs text-muted-foreground">This version has no changes to review.</p>}
          {current.hunks.map((hunk) => {
            const target = { fileId: entry.id, versionId: current.id, hunkId: hunk.id };
            const key = reviewDecisionKey(target);
            const decision = decisions[key];
            const visibleComments = (comments ?? localComments).filter((comment) => reviewDecisionKey(comment) === key);
            const commentId = `${id}-${entry.id}-${current.id}-${hunk.id}-comment`;
            const expandedHunk = expanded[key] ?? decision !== "accepted";
            return <motion.article key={key} data-decision={decision ?? "pending"} animate={{ x: decision === "rejected" && !reduced ? [0, -3, 3, 0] : 0 }} transition={{ duration: reduced ? 0 : 0.2, ease: EASE_OUT }} className={cn("overflow-hidden border-t border-border", decision === "rejected" && "bg-destructive/5")}>
              <div className="flex h-10 items-center justify-between gap-2 px-4"><button type="button" aria-expanded={expandedHunk} onClick={() => setExpanded({ ...expanded, [key]: !expandedHunk })} className={cn("min-w-0 truncate rounded font-mono text-xs text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring", decision === "rejected" && "line-through")}>{decision === "accepted" && <Check className="mr-1 inline size-3 text-emerald-600" />}{hunk.label}</button><div className="flex shrink-0 items-center gap-1">{hunk === current.hunks[0] && entry.versions.length > 1 && <AnimatedDropdown ariaLabel={`Version for ${entry.path}`} disabled={pending} value={current.id} onValueChange={(versionId) => { setVersions({ ...versions, [entry.id]: versionId }); setCommitted(false); }} className="shrink-0" trigger={<span className="truncate">{current.label}</span>} triggerClassName="h-7 max-w-20 gap-1 rounded-full border-0 bg-transparent px-2 py-0 text-xs font-normal text-muted-foreground [&>svg:last-child]:size-3" align="end" indicatorPosition="end" menuLabel="Review revision" menuWidth={176} items={entry.versions.map((version) => ({ id: version.id, kind: "option" as const, value: version.id, textValue: version.label, label: <span className="block text-xs">{version.label}</span> }))} />}<button type="button" className="h-7 rounded-full px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40" disabled={pending || decision === "rejected"} onClick={() => decide(target, "rejected")} aria-label={`Reject ${hunk.label}`}>{decision === "rejected" ? "Rejected" : "Reject"}</button><button type="button" className="h-7 rounded-full border border-border bg-muted/40 px-3 text-xs font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40" disabled={pending || decision === "accepted"} onClick={() => decide(target, "accepted")} aria-label={`Accept ${hunk.label}`}>{decision === "accepted" ? "Accepted" : "Accept"}</button>{onComment && <button type="button" className="grid size-7 place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Comment on ${hunk.label}`} aria-expanded={commenting === key} onClick={() => setCommenting(commenting === key ? undefined : key)}><MessageSquare className="size-3.5" /></button>}</div></div>
              <FileDiff file={hunk.label} lines={hunk.lines.map((line) => ({ ...line, oldLine: undefined, newLine: line.type === "removed" ? line.oldLine : line.newLine ?? line.oldLine }))} status="complete" collapseOnComplete={false} open={expandedHunk} onOpenChange={(next) => setExpanded({ ...expanded, [key]: next })} maxHeight={300} className={cn("[&>button]:hidden [&>div>div]:p-0 [&>div>div>div]:rounded-none [&>div>div>div]:bg-transparent [&_[data-slot=file-diff-viewport]>div]:py-1 [&_[data-slot=file-diff-viewport]_.grid]:grid-cols-[2.5rem_1rem_minmax(0,1fr)] [&_[data-slot=file-diff-viewport]_.grid>span:first-child]:hidden [&_[data-slot=file-diff-viewport]_.grid>span:nth-child(2)]:text-muted-foreground/70", decision === "rejected" && "line-through opacity-70")} />
              {visibleComments.length > 0 && <ul className="space-y-2 p-2 text-[11px]">{visibleComments.map((comment) => <li key={comment.id} className="whitespace-pre-wrap rounded-lg bg-muted p-2">{comment.body}</li>)}</ul>}
              {onComment && commenting === key && <form className="space-y-2 p-2" onSubmit={(event) => { event.preventDefault(); const body = drafts[key]?.trim(); if (!body) return; void run(async () => { await onComment(target, body); if (comments === undefined) setLocalComments((items) => [...items, { ...target, id: crypto.randomUUID(), body }]); setDrafts((items) => ({ ...items, [key]: "" })); setCommenting(undefined); }); }}><label htmlFor={commentId} className="text-[11px] text-muted-foreground">Comment on {hunk.label}</label><textarea id={commentId} ref={commentInput} value={drafts[key] ?? ""} onChange={(event) => setDrafts({ ...drafts, [key]: event.target.value })} disabled={pending} rows={2} className={cn(lifecycleInputClass, "block w-full resize-y text-xs")} /><button type="submit" className={lifecycleActionClass} disabled={pending || !drafts[key]?.trim()}>Post comment</button></form>}
            </motion.article>;
          })}
          {current.hunks.length > 1 && <div className="flex justify-end gap-2 px-2 pb-2 pt-1"><button type="button" className={lifecycleActionClass} disabled={pending} onClick={() => decide({ fileId: entry.id, versionId: current.id }, "rejected")}>Reject file</button><button type="button" className={lifecycleActionClass} disabled={pending} onClick={() => decide({ fileId: entry.id, versionId: current.id }, "accepted")}>Accept file</button></div>}
        </> : <p className="p-3 text-xs text-muted-foreground">No versions are available for this file.</p>}</div></AgentDisclosure>
      </li>;
    })}</ul> : <p className="p-8 text-center text-xs text-muted-foreground">No changed files to review.</p>}
    <footer className="space-y-2 px-0.5 pt-1.5">
      {error && <p role="alert" className="px-3 py-2 text-xs text-destructive">{error}</p>}
      {complete ? <form className="flex flex-wrap gap-2 p-1" onSubmit={(event) => { event.preventDefault(); if (!message.trim() || !accepted || committed) return; void run(async () => { const snapshot = files.flatMap((entry) => { const current = versionFor(entry); return current ? [{ fileId: entry.id, versionId: current.id, acceptedHunkIds: current.hunks.filter((hunk) => decisions[reviewDecisionKey({ fileId: entry.id, versionId: current.id, hunkId: hunk.id })] === "accepted").map((hunk) => hunk.id), rejectedHunkIds: current.hunks.filter((hunk) => decisions[reviewDecisionKey({ fileId: entry.id, versionId: current.id, hunkId: hunk.id })] === "rejected").map((hunk) => hunk.id) }] : []; }); await onCommit(message.trim(), snapshot); setCommitted(true); }); }}><input aria-label="Commit message" placeholder="Describe the accepted changes" value={message} disabled={pending || committed} onChange={(event) => setMessage(event.target.value)} className={cn(lifecycleInputClass, "h-9 min-w-0 flex-1 rounded-full px-4 text-sm")} /><button type="submit" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" disabled={pending || committed || !accepted || !message.trim()}><GitCommitHorizontal className="size-3.5" />{pending ? "Saving…" : committed ? "Committed" : "Commit"}</button>{!accepted && <p className="w-full p-2 text-xs text-muted-foreground">All changes were rejected. There is nothing to commit.</p>}{committed && <p role="status" className="w-full p-2 text-xs text-muted-foreground">Accepted changes committed successfully.</p>}</form> : <div className="flex items-center justify-end gap-1 px-1 pb-1 pt-1"><button type="button" className="h-8 rounded-full px-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40" disabled={pending || !all.length} onClick={() => void run(async () => { const next = { ...decisions }; for (const target of all) { if (next[reviewDecisionKey(target)]) continue; await onDecision(target, "rejected"); next[reviewDecisionKey(target)] = "rejected"; if (value === undefined) setInternal({ ...next }); onValueChange?.({ ...next }); } setCommitted(false); })}>Reject all</button><button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50" disabled={pending || !all.length} onClick={() => void run(async () => { const next = { ...decisions }; for (const target of all) { if (next[reviewDecisionKey(target)]) continue; await onDecision(target, "accepted"); next[reviewDecisionKey(target)] = "accepted"; if (value === undefined) setInternal({ ...next }); onValueChange?.({ ...next }); } setCommitted(false); })}><Check className="size-3.5" />Accept all</button></div>}
    </footer>
  </section>;
}
