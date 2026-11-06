"use client";

import { MessageCircle, MousePointer2 } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface PresenceCollaborator { id: string; name: string; initials: string; targetId: string; comment: string; cursor?: { x: number; y: number }; tone?: "primary" | "muted" }
export interface PresenceBlock { id: string; title: string; text: string; /** Exact supplied phrase to highlight; never an estimated paragraph-width overlay. */ selection?: string }
export interface LivePresenceIllustrationProps { scene: "document" | "canvas"; title: string; blocks: PresenceBlock[]; collaborators: PresenceCollaborator[]; activeId?: string; defaultActiveId?: string; onActiveChange?: (id: string) => void; className?: string; presentationPlaying?: boolean }
const presenceMotionStyles = `
[data-presence-playing] [data-presence-selection]{animation:illustration-presence-selection 9s cubic-bezier(.65,0,.35,1) infinite}
[data-presence-playing] [data-presence-caret="primary"]{animation:illustration-presence-maya-caret 9s cubic-bezier(.65,0,.35,1) infinite}
[data-presence-playing] [data-presence-caret="muted"]{animation:illustration-presence-noah-caret 9s cubic-bezier(.65,0,.35,1) infinite}
[data-presence-playing] [data-presence-label="primary"]{animation:illustration-presence-maya-label 9s cubic-bezier(.23,1,.32,1) infinite}
[data-presence-playing] [data-presence-label="muted"]{animation:illustration-presence-noah-label 9s cubic-bezier(.23,1,.32,1) infinite}
[data-presence-playing] [data-presence-pin]{animation:illustration-presence-pin 8s cubic-bezier(.23,1,.32,1) infinite}
[data-presence-playing] [data-presence-comment]{animation:illustration-presence-comment 8s cubic-bezier(.23,1,.32,1) infinite}
[data-presence-playing] [data-presence-cursor="primary"]{animation:illustration-presence-maya 8s cubic-bezier(.77,0,.175,1) infinite}
[data-presence-playing] [data-presence-cursor="muted"]{animation:illustration-presence-noah 8s cubic-bezier(.77,0,.175,1) infinite}
@keyframes illustration-presence-selection{0%,10%,96%,100%{transform:scaleX(.02);opacity:0}24%,82%{transform:scaleX(1);opacity:1}}
@keyframes illustration-presence-maya-caret{0%,9%,96%,100%{transform:translateX(-13cqw);opacity:0}24%,82%{transform:translateX(0);opacity:1}}
@keyframes illustration-presence-noah-caret{0%,40%,96%,100%{transform:translateX(8cqw);opacity:0}54%,84%{transform:translateX(0);opacity:1}}
@keyframes illustration-presence-maya-label{0%,17%,93%,100%{transform:translateY(5px) scale(.94);opacity:0}28%,82%{transform:translateY(0) scale(1);opacity:1}}
@keyframes illustration-presence-noah-label{0%,47%,93%,100%{transform:translateY(-5px) scale(.94);opacity:0}58%,84%{transform:translateY(0) scale(1);opacity:1}}
@keyframes illustration-presence-pin{0%,45%,100%{transform:scale(.82)}54%,90%{transform:scale(1)}}
@keyframes illustration-presence-comment{0%,51%,96%,100%{transform:translateY(6px) scale(.97);opacity:0}62%,90%{transform:translateY(0) scale(1);opacity:1}}
@keyframes illustration-presence-maya{0%,12%,100%{transform:translate(0,0)}28%,80%{transform:translate(-13cqw,-15cqw)}92%{transform:translate(-4cqw,-4cqw)}}
@keyframes illustration-presence-noah{0%,34%,100%{transform:translate(0,0)}52%,84%{transform:translate(-31cqw,21cqw)}93%{transform:translate(-8cqw,6cqw)}}
@media(prefers-reduced-motion:reduce){[data-presence-playing] [data-presence-selection],[data-presence-playing] [data-presence-caret],[data-presence-playing] [data-presence-label],[data-presence-playing] [data-presence-pin],[data-presence-playing] [data-presence-comment],[data-presence-playing] [data-presence-cursor]{animation:none!important;transform:none;opacity:1}}
`;
/** Host-supplied presence, not a synchronization transport. Decorative cursors never edit content. */
export function LivePresenceIllustration({ scene, title, blocks, collaborators, activeId, defaultActiveId, onActiveChange, className, presentationPlaying = false }: LivePresenceIllustrationProps) {
  const [internal, setInternal] = useState(defaultActiveId ?? collaborators[0]?.id);
  const [following, setFollowing] = useState(false);
  const selected = collaborators.find(person => person.id === (activeId ?? internal)) ?? collaborators[0];
  const block = blocks.find(block => block.id === selected?.targetId) ?? blocks[0];
  const reduce = useReducedMotion();
  const running = presentationPlaying && !reduce && !following;
  return <section data-presence-playing={running ? "" : undefined} aria-label={`${title} presence`} className={cn("@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-muted text-foreground", className)}>
    <fieldset aria-label="Follow collaborator" className={cn("absolute left-1/2 z-30 m-0 flex h-11 -translate-x-1/2 items-center rounded-full border border-border bg-background px-3.5", scene === "canvas" ? "top-[9%]" : "bottom-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100")}><div className="flex -space-x-1.5">{collaborators.map((person, index) => <button type="button" key={person.id} aria-label={`Follow ${person.name}`} aria-pressed={selected?.id === person.id} onClick={() => { setFollowing(true); if (activeId === undefined) setInternal(person.id); onActiveChange?.(person.id); }} className={cn("relative grid size-7 cursor-pointer place-items-center rounded-full border-2 border-background text-[8px] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-ring", index % 2 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700")}>{person.initials}</button>)}</div><span className="ml-2 whitespace-nowrap border-l border-border pl-2 text-[8px] font-medium">{collaborators.length} editing</span><span className="ml-2 size-1.5 rounded-full bg-emerald-500" /></fieldset>
    {scene === "document" ? <div className="absolute left-[9%] top-[19%] w-[82%]">
      <h3 className="text-[clamp(18px,4.5cqw,26px)] font-medium tracking-[-.035em] text-blue-600 dark:text-blue-400">{title}</h3>
      <div className="mt-[6%] text-[clamp(13px,3.4cqw,19px)] font-medium leading-[1.52] tracking-[-.025em]">{blocks.map((item, blockIndex) => {
        const start = item.selection ? item.text.indexOf(item.selection) : -1;
        const people = collaborators.filter(person => person.targetId === item.id);
        return <p key={item.id} className={cn("whitespace-nowrap", blockIndex > 0 && "text-muted-foreground")}>{start >= 0 && item.selection ? <>{item.text.slice(0, start)}<span className="relative inline-block text-foreground"><span className="relative z-10">{item.selection}</span>{people.map(person => {
          const muted = person.tone === "muted";
          return <span key={person.id} aria-hidden className="pointer-events-none absolute inset-0">
            {!muted && <span data-presence-selection className="absolute -inset-x-1 -inset-y-0.5 origin-left rounded-[2px] bg-blue-500/10" />}
            <span data-presence-caret={muted ? "muted" : "primary"} className={cn("absolute top-[4%] z-20 h-[92%]", muted ? "-left-1 border-l border-foreground" : "-right-1 border-r border-primary")} />
            <span data-presence-label={muted ? "muted" : "primary"} className={cn("absolute z-30 inline-flex items-center gap-1 whitespace-nowrap rounded-md px-1.5 py-1 text-[8px] font-medium tracking-normal", muted ? "left-0 top-[calc(100%+.4rem)] bg-foreground text-background" : "right-0 bottom-[calc(100%+.45rem)] bg-primary text-primary-foreground")}><span className="grid size-4 place-items-center rounded-full bg-muted/30 text-[6px]">{person.initials}</span>{person.name}</span>
          </span>;
        })}</span>{item.text.slice(start + item.selection.length)}</> : item.text}<span className="sr-only">{item.title}</span></p>;
      })}</div>
    </div> : <div className="absolute left-1/2 top-[22%] h-[58%] w-[78%] -translate-x-1/2 border border-border bg-background">
      <p className="absolute left-[6%] top-[8%] text-[7px] uppercase tracking-[.16em] text-muted-foreground">{title}</p>
      <div className="absolute left-[6%] top-[25%] h-[48%] w-[82%] border border-blue-600"><div className="flex size-full items-center px-[5%]"><h3 className="whitespace-pre-line text-[clamp(18px,4.8cqw,31px)] font-semibold leading-[1.5] tracking-[-.045em]">{block?.text}</h3></div>{["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map(corner => <span key={corner} aria-hidden className={cn("absolute size-2 border border-blue-600 bg-background", corner)} />)}<span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-blue-600 px-2 py-1 font-mono text-[7px] text-white">560 × 122</span><span aria-hidden data-presence-pin className="absolute right-0 top-1/2 grid size-7 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-blue-600 text-white"><MessageCircle className="size-3.5 fill-current" /></span></div>
      {selected && <aside data-presence-comment aria-live="polite" className="absolute bottom-[5%] right-[2%] z-20 w-[35%] rounded-lg border border-border bg-background px-3 py-2"><div className="flex items-center gap-1.5"><span aria-hidden className="grid size-5 place-items-center rounded-full bg-secondary text-[7px]">{selected.initials}</span><p className="text-[8px] font-medium">{selected.name}</p></div><p className="mt-1 text-[7px] text-muted-foreground">{selected.comment}</p></aside>}
    </div>}
    {scene === "canvas" && collaborators.filter(person => person.cursor).map((person, index) => <div aria-hidden data-presence-cursor={person.tone === "muted" ? "muted" : "primary"} key={person.id} className={cn("pointer-events-none absolute z-40", index % 2 ? "text-amber-600" : "text-blue-600")} style={{ left: `${Math.max(0, Math.min(85, person.cursor!.x))}%`, top: `${Math.max(0, Math.min(85, person.cursor!.y))}%` }}><MousePointer2 className="size-5 fill-current" /><span className={cn("ml-2 inline-flex rounded-sm px-1.5 py-0.5 text-[7px] font-medium text-white", index % 2 ? "bg-amber-600" : "bg-blue-600")}>{person.name}</span></div>)}
    {scene === "document" && selected && <p className="sr-only" aria-live="polite">{selected.name}: {selected.comment}</p>}
    {!blocks.length && <p className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">No shared content</p>}
    <style>{presenceMotionStyles}</style>
  </section>;
}
