"use client";

import { createContext, useContext, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Archive, Bell, Check, CheckCheck, ChevronDown, Clock, Download, Mail, MailOpen, MoreHorizontal, RotateCcw, Search, X } from "lucide-react";
import { Button } from "@/components/motion/button";
import { MorphPopover, MorphPopoverTrigger, MorphPopoverContent } from "@/components/motion/popover-morph";
import { AnimatedDropdown } from "@/components/motion/animated-dropdown";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { DecisionFeedback, useDecisionAction } from "./decision-support";

export interface CenterNotification {
  id: string; title: string; summary: string; details?: string; category: string;
  group: string; createdAt: string; read: boolean; href?: string; avatarUrl?: string; actionLabel?: string;
}
export interface NotificationCenterProps {
  notifications: CenterNotification[];
  onRead: (ids: string[], read: boolean) => void | Promise<void>;
  onArchive: (ids: string[]) => void | Promise<void>;
  onSnooze?: (id: string, until: Date) => void | Promise<void>;
  onClear?: (ids: string[]) => void | Promise<void>; statusMessage?: string; className?: string;
}

const NotificationCategoryContext = createContext<readonly string[] | null>(null);
function useNotificationCategories(notifications: CenterNotification[], inherited: readonly string[] | null = null) {
  const [categories, setCategories] = useState<readonly string[]>(() => inherited ?? [...new Set(notifications.map(item => item.category))].sort());
  if (inherited) return inherited;
  if (notifications.some(item => !categories.includes(item.category))) {
    const next = new Set(categories);
    for (const item of notifications) next.add(item.category);
    const merged = [...next].sort();
    setCategories(merged);
    return merged;
  }
  return categories;
}

export function NotificationPanel({ notifications, onRead, onArchive, onSnooze, onClear, statusMessage, className, compact = false, onClose, onReset }: NotificationCenterProps & { compact?: boolean; onClose?: () => void; onReset?: () => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [menu, setMenu] = useState<string | null>(null);
  const [readNotice, setReadNotice] = useState("");
  const searchInput = useRef<HTMLInputElement>(null);
  const action = useDecisionAction();
  const reduce = useReducedMotion();
  const inheritedCategories = useContext(NotificationCategoryContext);
  const categories = useNotificationCategories(notifications, inheritedCategories);
  const visible = notifications.filter(item => (category !== "unread" || !item.read) && (category === "all" || category === "unread" || item.category === category) && `${item.title} ${item.summary} ${item.details ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const groups = [...new Set(visible.map(item => item.group))];
  const unreadIds = notifications.filter(item => !item.read).map(item => item.id);
  const filterLabels: Record<string, string> = { action: "Needs action", reviews: "Reviews", system: "System" };
  return <section aria-label="Notification inbox" className={cn("flex w-full flex-col overflow-hidden bg-background text-foreground", compact ? "h-full max-h-full" : "h-[42rem] max-w-3xl rounded-3xl border border-border", className)}>
    <header className={cn("shrink-0", compact ? "px-5 pb-2 pt-4" : "px-4 pb-4 pt-5 sm:px-6 sm:pt-6")}>
      <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3">{!compact && <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground"><Bell className="size-4" /></span>}<div><h2 className="text-xl font-medium">Notifications{compact && unreadIds.length > 0 && <span className="ml-2.5 rounded-full border border-border px-2 py-0.5 text-xs font-normal tabular-nums text-muted-foreground">{unreadIds.length}<span className="sr-only"> unread</span></span>}</h2>{!compact && <p className="mt-0.5 text-xs text-muted-foreground">{unreadIds.length ? `${unreadIds.length} unread updates` : "You’re all caught up"}</p>}</div></div><div className={cn("flex items-center", compact ? "gap-0.5" : "gap-1")}>{onReset && <Button size="icon" variant="ghost" className="size-9" aria-label="Reset demo" disabled={action.busy} onClick={() => { onReset(); setReadNotice(""); action.clearError(); }}><RotateCcw className="size-3.5" /></Button>}<Button size="sm" variant={compact ? "ghost" : "outline"} className={compact ? "size-9 p-0" : "h-9 gap-2 text-xs"} aria-label={compact ? "Mark all as read" : "Mark all read"} disabled={action.busy || !unreadIds.length} onClick={() => { void action.run(() => onRead(unreadIds, true)).then(ok => { if (ok) setReadNotice("All updates marked as read."); }); }}><CheckCheck className="size-4" />{!compact && "Mark all read"}</Button>{compact && onClose && <Button size="icon" variant="ghost" className="size-9" aria-label="Close notifications" onClick={onClose}><X className="size-4" /></Button>}</div></div>
      {!compact && <div className="relative mt-5 h-10 overflow-hidden rounded-full border border-border bg-background transition-colors duration-200 focus-within:border-muted-foreground/40 motion-reduce:transition-none"><Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input ref={searchInput} aria-label="Search notifications" placeholder="Search updates…" type="search" value={query} onChange={event => setQuery(event.target.value)} className="peer h-full w-full bg-transparent pl-10 pr-10 text-sm text-foreground caret-foreground outline-none placeholder:text-muted-foreground" />{query && <Button size="icon" variant="ghost" className="absolute right-0 top-0 size-10 text-muted-foreground hover:text-foreground" aria-label="Clear search" onClick={() => { setQuery(""); searchInput.current?.focus({ preventScroll: true }); }}><X className="size-4" /></Button>}</div>}
    </header>
    <Tabs value={category} onValueChange={value => { setCategory(value); setMenu(null); }} variant="underline" className={cn("shrink-0 border-b border-border", compact ? "px-5" : "px-4 sm:px-6")}><TabsList aria-label="Notification filters" className="w-max min-w-full gap-4 border-0" wrapperClassName="w-full">
      {["all", ...(!compact ? ["unread"] : []), ...categories].map(value => <TabsTrigger key={value} value={value} indicatorClassName="h-0.5 bg-foreground" className="mb-0 min-h-10 shrink-0 whitespace-nowrap rounded-md px-0 text-sm focus-visible:ring-2 focus-visible:ring-ring">{value === "all" ? "All" : value === "unread" ? <>Unread{unreadIds.length > 0 && <span className="ml-1.5 font-mono">{unreadIds.length}</span>}</> : (filterLabels[value] ?? value)}</TabsTrigger>)}
    </TabsList></Tabs>
    <p className="sr-only" role="status">{unreadIds.length} unread notifications. {visible.length} shown.</p>
    <div className={cn("min-h-0 flex-1 overflow-y-auto", compact ? "overscroll-contain px-5" : "overscroll-contain px-3 pb-3 sm:px-4 sm:pb-4")}>
      {groups.map(group => <section key={group} aria-label={group}>{!compact && <h3 className="bg-background px-2 pb-3 pt-5 text-xs text-muted-foreground">{group}</h3>}<ul className={compact ? "" : "space-y-2"}><AnimatePresence initial={false}>{visible.filter(item => item.group === group).map(item => <motion.li key={item.id} layout={!reduce} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: reduce ? 0 : 12 }} transition={{ duration: reduce ? 0 : 0.18, ease: EASE_OUT }} className={cn("relative border-border bg-background", compact ? cn("py-4", item.id !== visible[visible.length - 1]?.id && "border-b") : "rounded-2xl border px-3 py-4 sm:px-4")}>
        <div className="flex items-start gap-3"><span aria-hidden className={cn("relative mt-0.5 grid shrink-0 place-items-center rounded-full border border-border text-muted-foreground", compact ? "size-8" : "size-10")}>{item.avatarUrl ? <img src={item.avatarUrl} alt="" className="absolute inset-0 size-full rounded-full object-cover" /> : <Download className="size-4" />}{!item.read && <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border-2 border-background bg-primary" />}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5"><h4 className={cn("break-words text-sm", item.read ? "font-normal" : "font-medium")}>{item.title}<span className="sr-only">. {!compact && `${item.group}. `}{item.read ? "Read" : "Unread"}.</span></h4><time className="text-xs text-muted-foreground">· {item.createdAt}</time></div><p className={cn("mt-1 break-words text-muted-foreground", compact ? "text-xs leading-relaxed" : "text-sm")}>{item.summary}</p>{(item.href || !compact) && <div className="mt-2.5 flex flex-wrap items-center gap-1.5">{item.href && <a href={item.href} className="inline-flex h-9 items-center rounded-full border border-border px-3 text-xs hover:bg-muted/40">{item.actionLabel ?? "Open update"}</a>}{!compact && <Button variant="ghost" size="sm" aria-expanded={expanded.includes(item.id)} className="h-9 gap-2 px-2 text-xs text-muted-foreground" onClick={() => setExpanded(previous => previous.includes(item.id) ? previous.filter(id => id !== item.id) : [...previous, item.id])}>{expanded.includes(item.id) ? "Less detail" : "View details"}<ChevronDown aria-hidden className={cn("size-3 transition-transform motion-reduce:transition-none", expanded.includes(item.id) && "rotate-180")} /></Button>}</div>}</div><AnimatedDropdown ariaLabel={`Actions for ${item.title}`} trigger={<MoreHorizontal aria-hidden className="size-4" />} triggerClassName="[&>svg:last-child]:hidden -mr-2 -mt-1.5 size-9 shrink-0 rounded-full border-0 bg-transparent p-0 text-muted-foreground hover:bg-muted" align="end" initialFocus="menu" sideOffset={4} shadow={false} menuWidth={224} itemClassName="min-h-10 gap-2.5 rounded-lg px-2.5" open={menu === item.id} onOpenChange={open => setMenu(open ? item.id : null)} disabled={action.busy} items={[{ id: "read", label: `Mark as ${item.read ? "unread" : "read"}`, textValue: `Mark as ${item.read ? "unread" : "read"}`, icon: item.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />, disabled: action.busy, closeOnSelect: false, onSelect: () => { void action.run(() => onRead([item.id], !item.read)).then(ok => { if (ok) setMenu(null); }); } }, ...(onSnooze ? [{ id: "snooze", label: "Snooze for later", textValue: "Snooze for later", icon: <Clock className="size-4" />, disabled: action.busy, closeOnSelect: false, onSelect: () => { void action.run(() => onSnooze(item.id, new Date(Date.now() + 3600000))).then(ok => { if (ok) { setReadNotice(""); setMenu(null); } }); } }] : []), { id: "archive", label: "Archive", textValue: "Archive", icon: <Archive className="size-4" />, disabled: action.busy, closeOnSelect: false, onSelect: () => { void action.run(() => onArchive([item.id])).then(ok => { if (ok) { setReadNotice(""); setMenu(null); } }); } }]} /></div>
        <AnimatePresence>{expanded.includes(item.id) && !compact && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.15 }} className="ml-0 mt-3 border-t border-border pt-4 text-sm text-muted-foreground sm:ml-13"><p>{item.details ?? item.summary}</p></motion.div>}</AnimatePresence>
      </motion.li>)}</AnimatePresence></ul></section>)}
      {!visible.length && <motion.div role="status" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduce ? 0 : 0.15, ease: EASE_OUT }} className="flex h-full flex-col items-center justify-center gap-3 px-4 py-6 text-center"><span aria-hidden className="flex size-12 items-center justify-center rounded-full border border-border"><Check className="size-5 text-muted-foreground" /></span><div><p className="text-sm font-medium">{query ? "No matching updates" : category === "unread" ? "You’re all caught up" : "No notifications"}</p><p className="mt-1 text-xs text-muted-foreground">{query ? "Try another search or clear it to see more updates." : "Your next update will appear here."}</p></div><Button size="sm" variant="outline" className="h-9 px-4 text-xs" onClick={() => { if (query) { setQuery(""); searchInput.current?.focus({ preventScroll: true }); } else setCategory("all"); }}>{query ? "Clear search" : "View all updates"}</Button></motion.div>}
    </div>
    <footer className={cn("flex shrink-0 items-center justify-between gap-3 border-t border-border py-3 text-xs text-muted-foreground", compact ? "px-5" : "px-4 sm:px-6")}>{compact ? <><span>{unreadIds.length ? `${unreadIds.length} unread` : "All caught up"}</span><span><kbd className="mr-2 rounded-md border border-border px-1.5 py-0.5 font-sans">Esc</kbd>to close</span></> : <><span>{readNotice || statusMessage || "Updates across your workspace"}</span><span className="flex items-center gap-3"><span>{notifications.length} updates</span>{onClear && <Button size="sm" variant="ghost" className="h-6 px-1 text-[10px]" disabled={action.busy || !visible.length} onClick={() => { void action.run(() => onClear?.(visible.map(item => item.id))); }}>Clear visible</Button>}</span></>}</footer>
    <DecisionFeedback {...action} />
  </section>;
}
export interface NotificationDropdownProps extends NotificationCenterProps { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }
export function NotificationDropdown({ open, defaultOpen, onOpenChange, className, ...props }: NotificationDropdownProps) {
  const count = props.notifications.filter(item => !item.read).length;
  const categoryValues = useNotificationCategories(props.notifications);
  const [internal, setInternal] = useState(defaultOpen ?? false);
  const shown = open ?? internal;
  const setOpen = (next: boolean) => { if (open === undefined) setInternal(next); onOpenChange?.(next); };
  return <MorphPopover open={shown} onOpenChange={setOpen}><MorphPopoverTrigger><Button variant="outline" size="icon" className="relative size-9 rounded-full bg-transparent hover:bg-primary/5" aria-label={`Notifications, ${count} unread`}><Bell className="size-4" />{count > 0 && <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">{count}</span>}</Button></MorphPopoverTrigger><MorphPopoverContent align="end" collisionPadding={16} shadow={false} className={cn("h-[36rem] w-[min(28rem,calc(100vw-2rem))] max-w-none overflow-hidden rounded-2xl p-0", className)}><NotificationCategoryContext.Provider value={categoryValues}><NotificationPanel {...props} compact onClose={() => setOpen(false)} /></NotificationCategoryContext.Provider></MorphPopoverContent></MorphPopover>;
}
