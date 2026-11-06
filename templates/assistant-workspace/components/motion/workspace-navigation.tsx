"use client";

import { useRef, useState, type ReactNode } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/motion/select";
import { Home, Layers, PanelLeft, Plus, Search, X } from "lucide-react";
import { AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarContent, AnimatedSidebarFooter, AnimatedSidebarHeader, AnimatedSidebarMenu, AnimatedSidebarMenuButton, AnimatedSidebarMenuItem, AnimatedSidebarMenuSub, AnimatedSidebarMenuSubButton, AnimatedSidebarMenuSubItem, AnimatedSidebarProvider, AnimatedSidebarTrigger, useAnimatedSidebar } from "@/components/motion/animated-sidebar";
import type { WorkspaceSidebarGroup, WorkspaceSidebarItem } from "@/components/workspace/workspace-sidebar";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface SidebarWorkspaceOption { id: string; name: string }
export interface WorkspaceNavigationProps {
  groups: WorkspaceSidebarGroup[]; activeId: string; onSelect: (id: string) => void;
  workspaces: SidebarWorkspaceOption[]; workspaceId: string; onWorkspaceChange: (id: string) => void;
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void;
  children: ReactNode; className?: string;
  user?: { name: string; email: string };
  onCreate?: () => void;
}
function filterGroups(groups: WorkspaceSidebarGroup[], query: string): WorkspaceSidebarGroup[] {
  return groups.map(group => ({ ...group, items: group.items.flatMap(item => item.label.toLowerCase().includes(query.toLowerCase()) ? [item] : item.children?.filter(child => child.label.toLowerCase().includes(query.toLowerCase())) ?? []) })).filter(group => group.items.length);
}
function NavigationItem({ item, activeId, onSelect, flat }: { item: WorkspaceSidebarItem; activeId: string; onSelect: (id: string) => void; flat?: boolean }) {
  const { open, isMobile, setOpenMobile } = useAnimatedSidebar();
  const [expanded, setExpanded] = useState(true);
  const compact = !open && !isMobile;
  function select(id: string) { onSelect(id); if (isMobile) setOpenMobile(false); }
  return <AnimatedSidebarMenuItem><AnimatedSidebarMenuButton href={item.children?.length && !flat ? undefined : item.href} icon={item.icon} badge={item.badge} disabled={item.disabled} isActive={activeId === item.id} ariaExpanded={item.children?.length && !flat ? expanded && !compact : undefined} onSelect={() => item.children?.length && !flat ? setExpanded(value => !value) : select(item.id)} className="min-h-9 rounded-2xl px-3 text-sm [&_svg]:size-4">{item.label}</AnimatedSidebarMenuButton>{!flat && item.children?.length ? <div inert={compact || !expanded}><AnimatedSidebarMenuSub open={expanded && !compact} className="ml-5 border-border pl-3">{item.children.map(child => <AnimatedSidebarMenuSubItem key={child.id}><AnimatedSidebarMenuSubButton href={child.href} icon={child.icon ?? <span aria-hidden className="text-xs">•</span>} disabled={item.disabled || child.disabled} isActive={activeId === child.id} onSelect={() => select(child.id)} className="min-h-8 text-xs">{child.label}</AnimatedSidebarMenuSubButton></AnimatedSidebarMenuSubItem>)}</AnimatedSidebarMenuSub></div> : null}</AnimatedSidebarMenuItem>;
}
function NavigationPanel({ props, flat = false, rail = false }: { props: WorkspaceNavigationProps; flat?: boolean; rail?: boolean }) {
  const [query, setQuery] = useState("");
  const { open, isMobile } = useAnimatedSidebar();
  const compact = !open && !isMobile;
  const filtered = filterGroups(props.groups,query);
  const title = props.workspaces.find(workspace => workspace.id === props.workspaceId)?.name ?? "Workspace";
  return <AnimatedSidebar ariaLabel={`${title} navigation`} collapsible={flat ? "offcanvas" : "icon"} panelClassName={cn("static h-full bg-background",rail && "rounded-2xl border border-border")}><div className="flex h-full min-h-0 flex-col" inert={!open && flat && !isMobile}>
    <AnimatedSidebarHeader className={cn("gap-3 p-3",rail && "p-4")}><div className={cn("flex min-w-0 items-center gap-2",rail ? "h-8" : "h-12 px-2")}>{!rail && !compact && <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg bg-foreground text-background"><Layers className="size-4"/></span>}{!compact && <Select value={props.workspaceId} onValueChange={props.onWorkspaceChange} className="min-w-0 flex-1"><SelectTrigger className={cn("h-8 !rounded-lg border-transparent bg-transparent px-0 py-0 font-medium",rail && "text-xl [&>svg]:hidden")}><span className="sr-only">Switch workspace</span><SelectValue className="min-w-0 truncate"/></SelectTrigger><SelectContent>{props.workspaces.map(workspace => <SelectItem key={workspace.id} value={workspace.id}>{workspace.name}</SelectItem>)}</SelectContent></Select>}<AnimatedSidebarTrigger aria-label="Toggle navigation" className="ml-auto size-8"><PanelLeft className="size-4"/></AnimatedSidebarTrigger><AnimatedSidebarClose aria-label="Close mobile navigation" className="size-8 md:hidden"><X className="size-4"/></AnimatedSidebarClose></div>{!compact && (rail && props.onCreate ? <button type="button" className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm hover:bg-muted" onClick={props.onCreate}><Plus className="size-4"/>New page</button> : <label className="relative"><Search aria-hidden className="absolute top-2.5 left-3 size-4 text-muted-foreground"/><input aria-label="Search navigation" placeholder={flat ? "Search navigation" : "Search workspace"} value={query} onChange={event => setQuery(event.target.value)} className="h-10 w-full rounded-full border border-border bg-background pr-2 pl-9 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"/></label>)}</AnimatedSidebarHeader>
    <AnimatedSidebarContent className="gap-5 px-3 py-2">{filtered.map(group => <div key={group.id}>{!compact && group.title && <p className={cn("mb-3 px-2 text-xs uppercase tracking-[0.1em] text-muted-foreground",rail && "mb-6")}>{group.title}</p>}<AnimatedSidebarMenu className="gap-1">{group.items.map(item => <NavigationItem key={item.id} item={item} activeId={props.activeId} onSelect={props.onSelect} flat={flat}/>)}</AnimatedSidebarMenu></div>)}{!filtered.length && <p className="px-3 text-xs text-muted-foreground">No matching pages.</p>}</AnimatedSidebarContent>
    {!rail && <AnimatedSidebarFooter className="p-4"><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-medium text-primary">{(props.user?.name ?? "Maya Chen").split(" ").map(part => part[0]).join("")}</span>{!compact && <div className="min-w-0"><p className="truncate text-sm font-medium">{props.user?.name ?? "Maya Chen"}</p><p className="truncate text-xs text-muted-foreground">{props.user?.email ?? "maya@example.com"}</p></div>}</div></AnimatedSidebarFooter>}
  </div></AnimatedSidebar>;
}
function Canvas({ props, rail = false }: { props: WorkspaceNavigationProps; rail?: boolean }) {
  const active = props.groups.flatMap(group => group.items.flatMap(item => [item,...(item.children ?? [])])).find(item => item.id === props.activeId);
  return <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto"><header className={cn("flex h-16 shrink-0 items-center gap-3 px-4",!rail && "border-b border-border")}><AnimatedSidebarTrigger aria-label="Toggle workspace navigation" className="h-8 w-10"><PanelLeft className="size-4"/></AnimatedSidebarTrigger>{!rail && <span aria-hidden className="h-5 w-px bg-border"/>}<span className="truncate text-sm font-medium">{active?.label ?? "Workspace"}</span></header><div className={cn("flex min-h-0 flex-1 flex-col p-7",rail && "p-6 sm:px-12 sm:py-10")}>{props.children}</div></main>;
}
export function WorkspaceSidebarLayout(props: WorkspaceNavigationProps) {
  return <div className="w-full p-2 sm:p-3"><AnimatedSidebarProvider open={props.open} defaultOpen={props.defaultOpen ?? true} onOpenChange={props.onOpenChange} style={{ "--sidebar-width": "16rem" }} className={cn("h-[720px] min-h-0 overflow-hidden rounded-2xl border border-border bg-background text-foreground",props.className)}><NavigationPanel props={props}/><Canvas props={props}/></AnimatedSidebarProvider></div>;
}
export function OffCanvasSidebarLayout(props: WorkspaceNavigationProps) {
  return <div className="w-full p-2 sm:p-3"><AnimatedSidebarProvider open={props.open} defaultOpen={props.defaultOpen ?? true} onOpenChange={props.onOpenChange} style={{ "--sidebar-width": "16rem" }} className={cn("h-[720px] min-h-0 overflow-hidden rounded-2xl border border-border bg-background text-foreground",props.className)}><NavigationPanel props={props} flat/><Canvas props={props}/></AnimatedSidebarProvider></div>;
}
export interface RailSidebarLayoutProps extends WorkspaceNavigationProps { activeAreaId?: string; onAreaChange?: (id: string) => void; areaGroups?: Record<string, WorkspaceSidebarGroup[]> }
/** Hover reveals an overlay; pinning alone changes canvas width. Mobile uses the core sidebar focus-managed drawer. */
export function RailSidebarLayout(props: RailSidebarLayoutProps) {
  const [localPinned, setPinned] = useState(props.defaultOpen ?? true); const pinned = props.open ?? localPinned;
  const [hovered, setHovered] = useState(false); const canHover = useHoverCapable();
  const rail = useRef<HTMLElement>(null); const panel = useRef<HTMLElement>(null);
  const [localArea, setArea] = useState(props.groups[0]?.id ?? ""); const areaId = props.activeAreaId ?? localArea;
  function pin(value: boolean) { if (props.open === undefined) setPinned(value); props.onOpenChange?.(value); setHovered(false); }
  const area = props.groups.find(group => group.id === areaId);
  return <div className="w-full p-2 sm:p-3"><div className={cn("flex h-[720px] min-h-0 overflow-hidden rounded-2xl border border-border bg-background text-foreground",props.className)}><nav ref={rail} aria-label="Workspace areas" className="z-30 flex w-16 shrink-0 flex-col items-center gap-4 py-4" onMouseEnter={() => { if (canHover && !pinned) setHovered(true); }} onMouseLeave={event => { if (!panel.current?.contains(event.relatedTarget as Node | null)) setHovered(false); }}>{props.groups.map((group,index) => <button type="button" key={group.id} aria-label={group.title ?? group.id} aria-pressed={areaId === group.id} className={cn("grid size-9 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring",areaId === group.id && "bg-muted text-foreground")} onClick={() => { if (props.activeAreaId === undefined) setArea(group.id); props.onAreaChange?.(group.id); pin(true); }}>{index === 0 ? <Home className="size-5"/> : group.items[0]?.icon ?? <Layers className="size-5"/>}</button>)}<button type="button" aria-label={pinned ? "Unpin navigation panel" : "Pin navigation panel"} aria-pressed={pinned} className="mt-auto grid size-9 cursor-pointer place-items-center rounded-full border border-border text-xs" onClick={() => pin(!pinned)}><PanelLeft className="size-4"/></button></nav><AnimatedSidebarProvider open={pinned || hovered} onOpenChange={pin} style={{ "--sidebar-width": "17rem" }} className="relative min-h-0 min-w-0 flex-1"><section aria-label="Workspace navigation panel" ref={panel} className={cn("z-20 my-2 mr-2 flex min-h-0",!pinned && "absolute inset-y-0 left-0")} onMouseLeave={event => { if (!rail.current?.contains(event.relatedTarget as Node | null)) setHovered(false); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(false); }}><NavigationPanel props={{ ...props,groups: props.areaGroups?.[areaId] ?? (area ? [area] : props.groups) }} flat rail/></section><Canvas props={props} rail/></AnimatedSidebarProvider></div></div>;
}
