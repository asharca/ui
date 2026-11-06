"use client";

import { Check, FileImage, FileSpreadsheet, FileText, RefreshCw, TriangleAlert } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE_IN_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type FileFlowStage = "queued" | "processing" | "output";
export interface FileFlowFile { id: string; name: string; format: string }
export interface FileFlowProps { sources: readonly FileFlowFile[]; output?: { name: string; format: string; status: "ready" | "pending" | "error"; detail: string }; processorLabel: string; processorDetail?: string; value?: FileFlowStage; defaultValue?: FileFlowStage; onValueChange?: (stage: FileFlowStage) => void; label?: string; className?: string; presentationPlaying?: boolean }
const FLOW_TRAVEL_EASE = `cubic-bezier(${EASE_IN_OUT.join(",")})`;
// Packet fades use a slower initial slope than the shared exit curve.
const FLOW_FADE_EASE = "cubic-bezier(.23,1,.32,1)";
const flowMotionStyles = `
[data-flow-animate] [data-flow-source-active]{animation:illustration-flow-source 8s ${FLOW_FADE_EASE} infinite}
[data-flow-animate] [data-flow-ring]{animation:illustration-flow-ring 8s ${FLOW_TRAVEL_EASE} infinite}
[data-flow-animate] [data-flow-output]{animation:illustration-flow-card 8s ${FLOW_FADE_EASE} infinite}
[data-flow-animate] [data-flow-signal]{animation:illustration-flow-signal 8s linear infinite}
[data-flow-animate] [data-flow-complete]{animation:illustration-flow-complete 8s ${FLOW_FADE_EASE} infinite}
@keyframes illustration-flow-source{0%,8%,44%,100%{opacity:1;filter:saturate(1)}13%,38%{opacity:0;filter:saturate(1.15)}}
@keyframes illustration-flow-ring{0%,27%,60%,100%{transform:scale(.96);opacity:.65}35%,53%{transform:scale(1.06);opacity:1}}
@keyframes illustration-flow-card{0%,66%,100%{opacity:.55}74%,91%{opacity:1}}
@keyframes illustration-flow-complete{0%,66%,100%{opacity:.55;transform:scale(.96)}74%,91%{opacity:1;transform:scale(1)}}
@keyframes illustration-flow-signal{0%{stroke-dashoffset:100;opacity:0}12%,82%{opacity:.5}100%{stroke-dashoffset:0;opacity:0}}
@keyframes illustration-flow-input{0%,8%{transform:translate(0,0) rotate(-6deg) scale(1);opacity:0}12%{transform:translate(0,0) rotate(-6deg) scale(1);opacity:1}34%{transform:translate(43cqw,12%) rotate(0) scale(.62);opacity:1}39%,100%{transform:translate(43cqw,12%) rotate(0) scale(.62);opacity:0}}
@keyframes illustration-flow-label{0%,17%,100%{opacity:1}25%,42%{opacity:0}}
@keyframes illustration-flow-output{0%,49%{transform:translate(0,-50%) scale(.92);opacity:0}55%{transform:translate(0,-50%) scale(1);opacity:1}74%{transform:translate(24cqw,-50%) scale(.96);opacity:1}79%,100%{transform:translate(24cqw,-50%) scale(.96);opacity:0}}
@media(prefers-reduced-motion:reduce){[data-flow-animate] [data-flow-source-active],[data-flow-animate] [data-flow-ring],[data-flow-animate] [data-flow-output],[data-flow-animate] [data-flow-signal]{animation:none!important}[data-flow-packet]{display:none}}
`;
/** An inspectable conversion narrative; presentation playback never reads or transforms files. */
export function FileFlow({ sources, output, processorLabel, processorDetail, value, defaultValue = "queued", onValueChange, label = "File workflow illustration", className, presentationPlaying = false }: FileFlowProps) {
  const [internal, setInternal] = useState<FileFlowStage>(defaultValue);
  const reduce = useReducedMotion();
  const stage = value ?? internal;
  const select = (next: FileFlowStage) => { if (value === undefined) setInternal(next); onValueChange?.(next); };
  const running = (presentationPlaying || stage === "processing") && !reduce && output?.status !== "error";
  return <section aria-label={label} className={cn("@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-xl bg-muted text-foreground", className)} data-flow-stage={stage} data-flow-animate={running ? "" : undefined}>
    <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_17%_50%,rgba(239,68,68,0.12),transparent_26%),radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.11),transparent_24%),radial-gradient(circle_at_84%_50%,rgba(34,197,94,0.1),transparent_26%)] dark:opacity-60" />
    <div className="absolute left-1/2 top-1/2 h-[52%] w-[88%] max-w-[31rem] -translate-x-1/2 -translate-y-1/2 [container-type:inline-size]">
      <svg aria-hidden="true" viewBox="0 0 520 220" className="absolute inset-0 size-full text-foreground/[.06]"><path d="M112 110H408" fill="none" stroke="currentColor" strokeWidth={1.5} strokeDasharray="4 7" strokeLinecap="round" /><path data-flow-signal d="M112 110H408" pathLength={100} fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="2 12" strokeLinecap="round" opacity={.4} className="text-foreground" /></svg>
      <div data-flow-inputs className="absolute left-0 top-1/2 z-10 h-full w-[30%] -translate-y-1/2">{sources.map((file, index) => <div key={file.id} data-flow-source-active={index === 0 ? "" : undefined} className="absolute flex aspect-[.82] w-[47%] flex-col overflow-hidden rounded-xl border border-white/80 bg-white p-1.5 text-neutral-900 dark:border-white/20 dark:bg-neutral-100" style={{ left: `${index * 26.5}%`, top: index === 1 ? "4%" : index === 0 ? "26%" : "24%", zIndex: index, transform: `rotate(${index === 0 ? -6 : index === 1 ? -1 : 6}deg)` }}><span aria-hidden className={cn("grid min-h-0 flex-1 place-items-center overflow-hidden rounded-lg", index % 3 === 2 ? "bg-gradient-to-br from-sky-100 via-emerald-100 to-amber-100" : "bg-neutral-100")}>{index % 3 === 1 ? <FileSpreadsheet className="size-5 text-emerald-600" /> : index % 3 === 2 ? <FileImage className="size-5 text-slate-500" /> : <FileText className="size-5 text-red-500" />}</span><span className="pt-1 text-center font-mono text-[8px] text-neutral-500">{file.format}</span><span className="sr-only">{file.name}</span></div>)}</div>
      <button type="button" onClick={() => select("processing")} aria-pressed={stage === "processing"} className="absolute left-1/2 top-1/2 z-20 flex size-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-border bg-background"><span data-flow-ring className="flex size-12 items-center justify-center rounded-full bg-[conic-gradient(from_45deg,rgba(59,130,246,0.85),rgba(34,211,238,0.3),rgba(59,130,246,0.85))] p-px"><span className="grid size-full place-items-center rounded-full bg-background text-foreground"><RefreshCw strokeWidth={1.8} aria-hidden className="size-5" /></span></span><span className="text-[10px] font-medium">{processorLabel}</span></button>
      <div data-flow-output className="absolute right-0 top-1/2 z-10 w-[28%] -translate-y-1/2 overflow-hidden rounded-xl border border-[rgba(59,130,246,0.2)] bg-[linear-gradient(145deg,rgba(59,130,246,0.14),rgba(255,255,255,0.96)_58%)] p-3 dark:bg-[linear-gradient(145deg,rgba(59,130,246,0.2),rgba(20,20,22,0.96)_62%)]">{output ? <><div className="flex items-center gap-2"><span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/80 dark:bg-black/20">{output.status === "error" ? <TriangleAlert className="size-[18px] text-destructive" /> : <FileText className="size-[18px] text-muted-foreground" />}</span><div className="min-w-0 flex-1"><h3 className="truncate text-[10px] font-medium">{output.name}</h3><p className="text-[8px] text-muted-foreground">{output.format}</p></div></div><div aria-hidden className="mt-3 grid gap-1"><span className="h-1 rounded-full bg-[rgba(59,130,246,0.22)]" /><span className="h-1 w-[82%] rounded-full bg-foreground/10" /><span className="h-1 w-[58%] rounded-full bg-foreground/10" /></div><span className={cn("mt-2 flex items-center gap-1.5 border-t border-[rgba(59,130,246,0.14)] pt-2 text-[8px]", output.status === "error" ? "text-destructive" : "text-[rgb(22,163,74)] dark:text-[rgb(74,222,128)]")}><span data-flow-complete aria-hidden className="grid size-4 shrink-0 place-items-center rounded-full border border-[rgba(34,197,94,0.24)] bg-[rgba(34,197,94,0.12)]">{output.status === "error" ? <TriangleAlert className="size-2.5" /> : output.status === "ready" ? <Check className="size-2.5" /> : <FileText className="size-2.5" />}</span>{output.status === "ready" ? "Ready to use" : output.status}</span></> : <p className="text-xs text-muted-foreground">No output supplied</p>}</div>
      {running && sources[0] && <div aria-hidden data-flow-packet className="pointer-events-none absolute left-0 top-[26%] z-30 flex aspect-[.82] w-[14.1%] flex-col overflow-hidden rounded-xl border border-white/80 bg-white p-1.5 text-neutral-900 dark:border-white/20 dark:bg-neutral-100" style={{ animation: `illustration-flow-input 8s ${FLOW_TRAVEL_EASE} infinite` }}><span className="grid min-h-0 flex-1 place-items-center rounded-lg bg-neutral-100"><FileText className="size-5 text-red-500" /></span><span className="pt-1 text-center font-mono text-[8px] text-neutral-500" style={{ animation: `illustration-flow-label 8s ${FLOW_FADE_EASE} infinite` }}>{sources[0].format}</span></div>}
      {running && output && <div aria-hidden data-flow-packet className="pointer-events-none absolute left-[51%] top-1/2 z-30 grid size-12 place-items-center rounded-lg border border-[rgba(59,130,246,0.22)] bg-white text-muted-foreground dark:bg-neutral-100" style={{ animation: `illustration-flow-output 8s ${FLOW_TRAVEL_EASE} infinite` }}><FileText className="size-5" /></div>}
    </div>
    <fieldset aria-label="Inspect workflow stage" className="absolute inset-x-3 bottom-3 m-0 flex min-w-0 justify-center gap-2 border-0 p-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">{(["queued", "processing", "output"] as const).map(item => <button type="button" key={item} aria-pressed={stage === item} onClick={() => select(item)} className="rounded-full bg-background/90 px-3 py-2 text-xs capitalize">{item === "queued" ? "Inputs" : item}</button>)}</fieldset>
    <p className="sr-only" aria-live="polite">{stage === "queued" ? `${sources.length} source files in this illustration.` : stage === "processing" ? processorDetail ?? processorLabel : output?.detail ?? "The host has not supplied an output."}</p>
    <style>{flowMotionStyles}</style>
  </section>;
}
