"use client";

import { useState } from "react";
import { Activity, FileText, Folder, Layers, Settings } from "lucide-react";
import { RailSidebarLayout } from "@/components/motion/workspace-navigation";
import type { WorkspaceSidebarGroup } from "@/components/workspace/workspace-sidebar";

const recent = ["Launch direction","Research notes","Campaign outline","A few good ideas","Onboarding checklist","Friday recap"];
const sections: WorkspaceSidebarGroup[] = [
  { id: "pinned",title: "Pinned",items: [{ id: "brand",label: "Brand notes",icon: <Folder/> },{ id: "website",label: "Website refresh",icon: <Folder/> }] },
  { id: "projects",title: "Projects",items: [{ id: "fieldwork",label: "Fieldwork",icon: <Folder/> }] },
  { id: "recent",title: "Recent",items: recent.map((label,index) => ({ id: `page-${index}`,label })) },
];
const areas: WorkspaceSidebarGroup[] = [
  { id: "workspace",title: "Workspace",items: sections.flatMap(group => group.items) },
  { id: "library",title: "Library",items: [{ id: "references",label: "References",icon: <Layers/> }] },
  { id: "activity",title: "Activity",items: [{ id: "updates",label: "Recent updates",icon: <Activity/> }] },
  { id: "settings",title: "Settings",items: [{ id: "preferences",label: "Preferences",icon: <Settings/> }] },
];

export function SidebarRailPreview() {
  const [active,setActive] = useState("page-0");
  const [workspace,setWorkspace] = useState("canvas");
  const [created,setCreated] = useState("");
  const title = created || areas.flatMap(group => group.items).find(item => item.id === active)?.label || "Launch direction";
  return <RailSidebarLayout groups={areas} areaGroups={{ workspace: sections }} activeId={active} onSelect={id => { setActive(id); setCreated(""); }} onCreate={() => setCreated("Untitled page")} workspaces={[{ id: "canvas",name: "Canvas" },{ id: "personal",name: "Personal space" }]} workspaceId={workspace} onWorkspaceChange={setWorkspace}><div className="mx-auto flex h-full w-full max-w-xl flex-col justify-center pb-12"><div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground"><FileText className="size-4"/>Private page</div><h2 className="text-4xl font-medium tracking-tight">{title}</h2><p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">A place for the early thoughts, useful references, and small decisions that move the work forward.</p><div className="mt-9 divide-y divide-border rounded-2xl border border-border bg-background px-5">{[["01","Find the starting point","Bring the notes and references together."],["02","Make room for the good ideas","Keep the next step clear and close."],["03","Share when it feels ready","A little progress is still progress."]].map(([number,heading,description]) => <div key={number} className="flex gap-4 py-5"><span className="pt-0.5 font-mono text-xs text-muted-foreground">{number}</span><div><p className="text-sm font-medium">{heading}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p></div></div>)}</div></div></RailSidebarLayout>;
}
