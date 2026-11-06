"use client";

import { useState } from "react";
import { BarChart3, Calendar, FileText, Folder, Inbox, Settings, Users } from "lucide-react";
import { OffCanvasSidebarLayout } from "@/components/motion/workspace-navigation";
import type { WorkspaceSidebarGroup } from "@/components/workspace/workspace-sidebar";

export function SidebarOffCanvasPreview() {
  const [active,setActive] = useState("inbox");
  const [workspace,setWorkspace] = useState("beui");
  const groups: WorkspaceSidebarGroup[] = [{ id: "navigation",title: "Navigation",items: [{ id: "inbox",label: "Inbox",icon: <Inbox/>,badge: "12" },{ id: "projects",label: "Projects",icon: <Folder/> },{ id: "calendar",label: "Calendar",icon: <Calendar/> },{ id: "documents",label: "Documents",icon: <FileText/> },{ id: "analytics",label: "Analytics",icon: <BarChart3/> },{ id: "members",label: "Members",icon: <Users/> },{ id: "settings",label: "Settings",icon: <Settings/> }] }];
  return <OffCanvasSidebarLayout groups={groups} activeId={active} onSelect={setActive} workspaces={[{ id: "beui",name: "beUI workspace" },{ id: "personal",name: "Personal workspace" }]} workspaceId={workspace} onWorkspaceChange={setWorkspace} user={{ name: "Maya Chen",email: "maya@example.com" }}><div className="flex h-full w-full flex-col"><p className="mb-2 text-xs font-medium text-muted-foreground">Focus workspace</p><h2 className="max-w-lg text-xl font-medium leading-7 tracking-tight">{active === "inbox" ? "Everything important, without nested navigation." : groups.flatMap(group => group.items.flatMap(item => [item,...(item.children ?? [])])).find(item => item.id === active)?.label}</h2><p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">Collapse the sidebar to give the active workspace the full canvas. The navigation returns from the same edge when needed.</p><div className="mt-auto grid gap-3 sm:grid-cols-2"><article className="rounded-2xl border border-border p-5"><p className="text-xs text-muted-foreground">Open projects</p><p className="mt-5 text-2xl font-semibold tracking-tight">18</p></article><article className="rounded-2xl border border-border p-5"><p className="text-xs text-muted-foreground">Updates today</p><p className="mt-5 text-2xl font-semibold tracking-tight">32</p></article></div></div></OffCanvasSidebarLayout>;
}
