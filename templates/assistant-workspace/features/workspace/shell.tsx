"use client";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Archive, BookOpen, Bot, ChevronDown, CircleHelp, Folder, Menu, MessageSquare, Paintbrush, PanelLeft, Plus, Search, Settings, Unplug, X } from "lucide-react";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarTrigger, useAnimatedSidebar } from "@/components/motion/animated-sidebar";
import { Button } from "@/components/motion/button";
import { CommandPalette } from "@/components/motion/command-palette";
import { cn } from "@/lib/utils";
import { useWorkspace } from "./store";
import { useQueryValue } from "./conversations";
import { MorphPopover, MorphPopoverContent, MorphPopoverTrigger } from "@/components/motion/popover-morph";
const navigation = [{ href:"/knowledge/",label:"Knowledge base",icon:BookOpen },{href:"/archive/",label:"Archived chats",icon:Archive},{href:"/integrations/",label:"Connected apps",icon:Unplug},{href:"/chat/",label:"Conversations",icon:MessageSquare},{href:"/projects/",label:"Projects",icon:Folder}];
function Navigation({ onCommands }: { onCommands: () => void }) {
  const { state } = useWorkspace();
  const mode = useQueryValue("mode") ?? "chat";
  const { setOpenMobile } = useAnimatedSidebar();
  const pathname = usePathname();
  return <AnimatedSidebar collapsible="offcanvas" ariaLabel="Workspace navigation" panelClassName="fieldwork-sidebar">
    <div className="fieldwork-brand"><a href="/">Fieldwork</a><Button variant="ghost" size="icon" aria-label="Search conversations" onClick={onCommands}><Search size={16}/></Button><AnimatedSidebarTrigger><PanelLeft size={16}/></AnimatedSidebarTrigger><AnimatedSidebarClose className="md:hidden"><X size={18}/></AnimatedSidebarClose></div>
    <fieldset className="fieldwork-modes" style={{ border: 0, margin: 0, minWidth: 0 }} aria-label="Workspace mode">{[{id:"chat",label:"Chat",icon:MessageSquare},{id:"agent",label:"Agent",icon:Bot},{id:"design",label:"Design",icon:Paintbrush}].map(item=><button type="button" key={item.id} aria-pressed={mode===item.id} onClick={()=>window.location.assign(`/chat/?mode=${item.id}`)}><item.icon size={13}/>{item.label}</button>)}</fieldset>
    <a href="/chat/" className="fieldwork-new-chat"><Plus size={15}/>New chat<kbd>⌘N</kbd></a>
    <nav className="fieldwork-nav" aria-label="Main">{navigation.filter(item=>item.href!=="/chat/"&&item.href!=="/projects/").map(item => <a key={item.href} href={item.href} onClick={() => setOpenMobile(false)} aria-current={pathname === item.href || pathname === item.href.slice(0, -1) ? "page" : undefined} className={cn(pathname?.startsWith(item.href.slice(0, -1)) && "is-active")}><item.icon size={15}/>{item.label}{item.href === "/archive/" && state.sessions.some(s => s.archived) && <span>{state.sessions.filter(s => s.archived).length}</span>}</a>)}</nav>
    <div className="fieldwork-projects"><div className="fieldwork-section-label"><span>Projects</span><a href="/projects/" aria-label="Manage projects"><Plus size={13}/></a></div>{state.projects.map(project => <a className="fieldwork-project" key={project.id} href={`/projects/?project=${encodeURIComponent(project.id)}`}><Folder size={14}/>{project.name}</a>)}</div>
    <div className="fieldwork-recents"><p className="fieldwork-section-label">Recent</p>{state.sessions.filter(s => !s.archived).slice(-12).reverse().map(session => <a key={session.id} href={`/chat/?session=${encodeURIComponent(session.id)}`}>{session.title}</a>)}{!state.sessions.some(s => !s.archived) && <p className="fieldwork-empty">Start a conversation to see it here.</p>}</div>
    <div className="fieldwork-profile"><MorphPopover><MorphPopoverTrigger><button type="button" className="fieldwork-profile-trigger" aria-label="Open profile menu"><span className="fieldwork-avatar">{(state.preferences.name || "You").slice(0, 2).toUpperCase()}</span><span>{state.preferences.name || "Personal settings"}<small>Local account · {state.credits} credits</small></span><ChevronDown size={14}/></button></MorphPopoverTrigger><MorphPopoverContent side="top" align="start" className="fieldwork-profile-popover"><p>My account</p><a href="/settings/"><Settings size={14}/>Profile & settings</a><a href="/help/"><CircleHelp size={14}/>Help & support</a></MorphPopoverContent></MorphPopover></div>
  </AnimatedSidebar>;
}
export function AppShell({ children }: { children: ReactNode }) {
  const { state, error, ready, dismissError } = useWorkspace();
  const [commands, setCommands] = useState(false);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") { event.preventDefault(); window.location.assign("/chat/"); } }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  const items = [ { id: "new", label: "Start a new conversation", group: "Workspace", onSelect: () => window.location.assign("/chat/") }, ...navigation.map(item => ({ id: item.href, label: item.label, group: "Pages", onSelect: () => window.location.assign(item.href) })), ...state.sessions.map(s => ({ id: s.id, label: s.title, group: s.archived ? "Archived conversations" : "Conversations", onSelect: () => window.location.assign(`/chat/?session=${encodeURIComponent(s.id)}`) })), ...state.projects.map(p => ({ id: p.id, label: p.name, group: "Projects", onSelect: () => window.location.assign(`/projects/?project=${encodeURIComponent(p.id)}`) })), { id: "settings", label: "Personal settings", group: "Pages", onSelect: () => window.location.assign("/settings/") }, { id: "help", label: "Help & keyboard shortcuts", group: "Pages", onSelect: () => window.location.assign("/help/") } ];
  return <><a href="#workspace-main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-card focus:p-3">Skip to content</a><WorkspaceShell className="fieldwork-shell h-dvh" sidebar={<Navigation onCommands={() => setCommands(true)} />} header={<header className="fieldwork-mobile-header"><AnimatedSidebarTrigger><Menu size={18}/></AnimatedSidebarTrigger><span>Fieldwork</span><span className="ml-auto text-xs text-muted-foreground">Browser-local demo</span></header>}>
    <main id="workspace-main" tabIndex={-1} className="h-full min-h-0 outline-none">{error && <div role="alert" className="flex items-start gap-3 border-b border-destructive/30 bg-destructive/10 p-4 text-sm"><span className="flex-1">{error} <a href="/settings/" className="underline">Manage local data</a></span><Button size="sm" variant="ghost" onClick={dismissError}>Dismiss</Button></div>}{ready ? children : <p role="status" className="p-8 text-muted-foreground">Opening your local workspace…</p>}</main>
    </WorkspaceShell><CommandPalette open={commands} onOpenChange={setCommands} items={items} placeholder="Find a conversation, project, or page…" /></>;
}
