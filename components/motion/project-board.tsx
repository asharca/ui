"use client";

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUp, CalendarDays, CheckSquare, CircleCheck, CircleDot, GripVertical, ListTodo, Minus, Pencil, Plus, Search } from "lucide-react";
import { Input } from "@/components/motion/input";
import { CenterMorphModal, CenterMorphModalContent } from "@/components/motion/center-morph-modal";
import { SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface BoardColumn { id: string; title: string }
export interface BoardTask {
  id: string; columnId: string; title: string; description: string; assignee?: string; priority: "low" | "medium" | "high";
  avatarUrl?: string; tags?: string[]; dueDate?: string;
  checklist?: { id: string; label: string; done: boolean }[];
}
export interface ProjectBoardProps {
  columns: BoardColumn[]; tasks?: BoardTask[]; defaultTasks?: BoardTask[];
  onTasksChange?: (tasks: BoardTask[]) => void;
  onColumnsChange: (columns: BoardColumn[]) => void;
  title?: string; currentUser?: string; headerActions?: ReactNode; className?: string;
}
const action = "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full border border-border px-4 text-xs outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring";

/** The host owns tasks and columns; every move, edit and checklist change uses the same immutable update. */
export function ProjectBoard({ columns, tasks: controlled, defaultTasks = [], onTasksChange, onColumnsChange, title = "Release board", currentUser, headerActions, className }: ProjectBoardProps) {
  const [local, setLocal] = useState(defaultTasks);
  const tasks = controlled ?? local;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState<BoardTask | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const touchDrag = useRef<{ id: string; node: HTMLElement; x: number; y: number } | null>(null);
  const renameInput = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");
  const id = useId();
  const [sequence, setSequence] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => { if (renaming) renameInput.current?.focus(); }, [renaming]);
  function change(next: BoardTask[]) { if (controlled === undefined) setLocal(next); onTasksChange?.(next); }
  function move(taskId: string, columnId: string, beforeId?: string) {
    const task = tasks.find(item => item.id === taskId); if (!task || taskId === beforeId) return;
    const next = tasks.filter(item => item.id !== taskId);
    const before = beforeId ? next.findIndex(item => item.id === beforeId) : -1;
    next.splice(before < 0 ? next.length : before, 0, { ...task, columnId });
    change(next); setNotice(`${task.title} moved to ${columns.find(column => column.id === columnId)?.title ?? columnId}.`);
  }
  function create(columnId: string) { setSequence(value => value + 1); setDraft({ id: `${id}-task-${sequence}`, columnId, title: "", description: "", priority: "medium" }); }
  function keyboardMove(task: BoardTask, key: string) {
    const columnIndex = columns.findIndex(column => column.id === task.columnId);
    const siblings = tasks.filter(item => item.columnId === task.columnId); const index = siblings.findIndex(item => item.id === task.id);
    if (key === "ArrowLeft" || key === "ArrowRight") { const column = columns[columnIndex + (key === "ArrowLeft" ? -1 : 1)]; if (column) move(task.id, column.id); }
    else if (key === "ArrowUp" || key === "Home") { const previous = siblings[key === "Home" ? 0 : index - 1]; if (previous) move(task.id, task.columnId, previous.id); }
    else if (key === "ArrowDown" || key === "End") { const after = key === "End" ? undefined : siblings[index + 2]?.id; if (index < siblings.length - 1) move(task.id, task.columnId, after); }
  }
  function finishTouch(event: PointerEvent<HTMLButtonElement>,cancelled = false) {
    const drag = touchDrag.current; if (!drag) return;
    const target = document.elementFromPoint(event.clientX,event.clientY);
    const column = target?.closest<HTMLElement>("[data-board-column]");
    const before = target?.closest<HTMLElement>("[data-board-task]");
    drag.node.style.translate = ""; drag.node.style.pointerEvents = ""; drag.node.style.zIndex = "";
    touchDrag.current = null; setDragging(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!cancelled && column?.dataset.boardColumn) move(drag.id,column.dataset.boardColumn,before?.dataset.boardTask);
  }
  return <section className={cn("mx-auto w-full max-w-6xl bg-background p-3 text-foreground sm:p-5", className)} aria-label="Project board">
    <header className="flex items-center gap-3"><div className="mr-auto"><h2 className="text-xl font-medium tracking-tight">{title}</h2><p className="mt-1 text-xs text-muted-foreground">{tasks.length} tasks · {columns.length} columns</p></div>{headerActions}<button type="button" className={cn(action, "border-transparent bg-primary text-primary-foreground hover:bg-primary/90")} disabled={!columns.length} onClick={() => create(columns[0].id)}><Plus className="size-3.5"/>New task</button></header>
    <div className="my-5 flex flex-wrap items-center justify-between gap-3"><fieldset aria-label="Filter tasks" className="m-0 flex gap-0.5 rounded-full border-0 bg-muted p-0.5">{[["all", "All tasks"], ["high", "High priority"], ["mine", "Mine"]].map(([value,label]) => <button type="button" key={value} aria-pressed={filter === value} className={cn("h-8 cursor-pointer rounded-full px-3 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring", filter === value ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")} onClick={() => setFilter(value)}>{label}</button>)}</fieldset><label className="relative w-full sm:w-60"><Search className="absolute top-2.5 left-3 size-4 text-muted-foreground"/><input type="search" aria-label="Search tasks" placeholder="Search tasks…" className="h-9 w-full rounded-full border border-border bg-background pr-3 pl-10 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring" value={query} onChange={event => setQuery(event.target.value)}/></label></div>
    <div className="grid auto-cols-[minmax(17rem,1fr)] grid-flow-col gap-5 overflow-x-auto pb-2">{columns.map((column,columnIndex) => <section key={column.id} data-board-column={column.id} aria-label={column.title} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); move(event.dataTransfer.getData("text/plain"), column.id); setDragging(null); }} className="flex min-h-0 flex-col bg-background">
      <header className="mb-3 flex h-11 items-center gap-2 px-2">{columnIndex === 0 ? <ListTodo className="size-4 text-muted-foreground"/> : columnIndex === columns.length - 1 ? <CircleCheck className="size-4"/> : <CircleDot className="size-4 text-primary"/>}{renaming === column.id ? <input ref={renameInput} aria-label={`Rename ${column.title} column`} className="min-w-0 flex-1 rounded border border-border bg-background p-1 text-sm" value={column.title} onChange={event => onColumnsChange(columns.map(item => item.id === column.id ? { ...item, title: event.target.value } : item))} onBlur={() => setRenaming(null)} onKeyDown={event => { if (event.key === "Enter" || event.key === "Escape") setRenaming(null); }}/> : <h3 className="text-sm font-medium">{column.title}</h3>}<span className="text-xs text-muted-foreground">{tasks.filter(task => task.columnId === column.id).length}</span><button type="button" aria-label={`Rename ${column.title} column`} className="ml-auto grid size-7 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted" onClick={() => setRenaming(column.id)}><Pencil className="size-3.5"/></button><button type="button" aria-label={`Add task to ${column.title}`} className="grid size-7 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted" onClick={() => create(column.id)}><Plus className="size-4"/></button></header>
      <div className="max-h-[26rem] space-y-3 overflow-y-auto px-1 pb-2 [mask-image:linear-gradient(to_bottom,black_90%,transparent)]">{tasks.filter(task => task.columnId === column.id && `${task.title} ${task.description}`.toLowerCase().includes(query.toLowerCase()) && (filter !== "high" || task.priority === "high") && (filter !== "mine" || Boolean(currentUser && task.assignee === currentUser))).map(task => <motion.article layout={!reduced} transition={SPRING_LAYOUT} key={task.id} data-board-task={task.id} draggable onDragStartCapture={event => { event.dataTransfer.setData("text/plain", task.id); setDragging(task.id); }} onDragEndCapture={() => setDragging(null)} onDragOver={event => event.preventDefault()} onDrop={event => { event.preventDefault(); event.stopPropagation(); move(event.dataTransfer.getData("text/plain"), column.id, task.id); setDragging(null); }} className={cn("relative overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-sm motion-reduce:transition-none", dragging === task.id && "opacity-40")}>
        <div className="p-4 pr-9"><button type="button" aria-label={`Open task: ${task.title}`} className="block w-full cursor-pointer text-left text-sm font-medium outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-ring" onClick={() => setDraft({ ...task, checklist: task.checklist?.map(item => ({ ...item })) })}>{task.title}</button><p className="mt-2 truncate text-xs text-muted-foreground">{task.description}</p><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">{task.tags?.join(", ")}{task.checklist && <><span>·</span><span className="inline-flex items-center gap-1"><CheckSquare className="size-3"/>{task.checklist.filter(item => item.done).length}/{task.checklist.length}</span></>}</div></div>
        <button type="button" aria-label={`Move task: ${task.title}`} aria-describedby={`${id}-instructions`} className="absolute top-4 right-3 z-10 cursor-grab rounded text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring active:cursor-grabbing touch-none" onPointerDown={event => { if (event.pointerType === "mouse") return; const node = event.currentTarget.closest<HTMLElement>("[data-board-task]"); if (!node) return; event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); touchDrag.current = { id: task.id,node,x: event.clientX,y: event.clientY }; node.style.pointerEvents = "none"; node.style.zIndex = "20"; setDragging(task.id); }} onPointerMove={event => { const drag = touchDrag.current; if (!drag) return; drag.node.style.translate = `${event.clientX - drag.x}px ${event.clientY - drag.y}px`; const viewport = drag.node.closest("[data-board-column]")?.parentElement; if (viewport) { const rect = viewport.getBoundingClientRect(); if (event.clientX > rect.right - 40) viewport.scrollLeft += 12; if (event.clientX < rect.left + 40) viewport.scrollLeft -= 12; } }} onPointerUp={event => finishTouch(event)} onPointerCancel={event => finishTouch(event,true)} onKeyDown={event => { if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End"].includes(event.key)) { event.preventDefault(); keyboardMove(task,event.key); } }}><GripVertical className="size-3.5"/></button>
        <footer className="flex min-h-11 flex-wrap items-center gap-2 border-t border-border px-4 py-2 text-[11px] text-muted-foreground"><span className="inline-flex items-center gap-1 rounded border border-border/50 px-1.5 py-0.5">{task.priority === "high" ? <ArrowUp className="size-3"/> : <Minus className="size-3"/>}{task.priority === "medium" ? "Normal" : task.priority === "high" ? "High" : "Low"}</span>{task.assignee && <span className="inline-flex items-center gap-1">{task.avatarUrl && <img alt="" src={task.avatarUrl} className="size-4 rounded-full object-cover"/>}{task.assignee}</span>}{task.dueDate && <span className="inline-flex items-center gap-1"><CalendarDays className="size-3"/>{task.dueDate}</span>}</footer>
      </motion.article>)}</div>
    </section>)}</div>{!columns.length && <p>No columns. Supply a column to start planning.</p>}
    <p id={`${id}-instructions`} className="sr-only">Drag a card to move it. With the handle focused, use Up or Down to reorder, Left or Right to change columns, and Home or End to move to the edges.</p><p className="sr-only" role="status">{notice}</p>
    <CenterMorphModal open={draft !== null} onOpenChange={open => { if (!open) setDraft(null); }}><CenterMorphModalContent ariaLabel="Task details" className="max-w-xl">{draft && <form className="space-y-5" onSubmit={event => { event.preventDefault(); if (!draft.title.trim()) return; const next = { ...draft, title: draft.title.trim() }; change(tasks.some(task => task.id === next.id) ? tasks.map(task => task.id === next.id ? next : task) : [...tasks,next]); setDraft(null); }}><Input label="Task title" required value={draft.title} onChange={title => setDraft({ ...draft,title })}/><label className="block text-xs text-muted-foreground">Description<textarea aria-label="Task description" className="mt-2 min-h-24 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground" value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })}/></label><div className="grid grid-cols-2 gap-3"><label className="text-xs text-muted-foreground">Status<select aria-label="Task status" className={cn(action,"mt-2 w-full bg-background text-foreground")} value={draft.columnId} onChange={event => setDraft({ ...draft,columnId: event.target.value })}>{columns.map(column => <option key={column.id} value={column.id}>{column.title}</option>)}</select></label><label className="text-xs text-muted-foreground">Priority<select aria-label="Task priority" className={cn(action,"mt-2 w-full bg-background text-foreground")} value={draft.priority} onChange={event => setDraft({ ...draft,priority: event.target.value as BoardTask["priority"] })}>{["low","medium","high"].map(priority => <option key={priority} value={priority}>{priority === "medium" ? "Normal" : priority}</option>)}</select></label><Input label="Task assignee" value={draft.assignee ?? ""} onChange={assignee => setDraft({ ...draft,assignee })}/><Input label="Task due date" value={draft.dueDate ?? ""} onChange={dueDate => setDraft({ ...draft,dueDate })}/></div>{draft.checklist?.map(item => <label key={item.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={item.done} onChange={event => setDraft({ ...draft,checklist: draft.checklist?.map(check => check.id === item.id ? { ...check,done: event.target.checked } : check) })}/>{item.label}</label>)}<div className="flex items-center justify-end gap-2">{tasks.some(task => task.id === draft.id) && <button type="button" className={cn(action,"mr-auto text-destructive")} onClick={() => { change(tasks.filter(task => task.id !== draft.id)); setDraft(null); }}>Delete task</button>}<button type="button" className={action} onClick={() => setDraft(null)}>Cancel</button><button type="submit" className={cn(action,"border-transparent bg-primary text-primary-foreground hover:bg-primary/90")}>Save changes</button></div></form>}</CenterMorphModalContent></CenterMorphModal>
  </section>;
}
