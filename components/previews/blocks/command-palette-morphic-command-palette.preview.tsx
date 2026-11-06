"use client";
import { FilePlus, Folder, FolderPlus, Home, Keyboard, Search, Settings2, Users } from "lucide-react";
import { useState } from "react";
import { MorphicCommands } from "@/components/motion/morphic-commands";

export function MorphicCommandPalettePreview() {
  const [selected, setSelected] = useState("");
  const [documents, setDocuments] = useState(0);
  const [projects, setProjects] = useState(0);
  const created = documents + projects > 0 ? ` · ${documents} local documents, ${projects} local projects` : "";
  return <div className="w-full py-10"><div className="flex min-h-80 w-full flex-col items-center justify-center gap-3 p-6"><MorphicCommands shortcut="j" trigger={<button type="button" className="inline-flex h-9 items-center gap-3 rounded-full border-0 bg-background px-4 text-sm font-medium shadow-[inset_0_0_0_1px_var(--border)] focus-visible:outline-2 focus-visible:outline-ring"><Search aria-hidden className="size-4 text-muted-foreground" />Open command palette<kbd className="ml-3 font-mono text-xs text-muted-foreground">⌘ / Ctrl J</kbd></button>} items={[
    { id: "home", label: "Home", group: "Navigation", icon: Home, onSelect: () => setSelected("Home") },
    { id: "projects", label: "Projects", group: "Navigation", icon: Folder, onSelect: () => setSelected("Projects") },
    { id: "team", label: "Team", group: "Navigation", icon: Users, onSelect: () => setSelected("Team") },
    { id: "settings", label: "Settings", group: "Navigation", icon: Settings2, onSelect: () => setSelected("Settings") },
    { id: "document", label: "New document", group: "Actions", icon: FilePlus, onSelect: () => { setDocuments(value => value + 1); setSelected("New document"); } },
    { id: "project", label: "New project", group: "Actions", icon: FolderPlus, onSelect: () => { setProjects(value => value + 1); setSelected("New project"); } },
    { id: "shortcuts", label: "Keyboard shortcuts", group: "Actions", icon: Keyboard, onSelect: () => setSelected("Keyboard shortcuts (⌘ / Ctrl J opens, ↑↓ navigates, Enter selects, Escape closes)") }
  ]} /><output className="min-h-4 text-center text-xs text-muted-foreground">{selected ? `Selected: ${selected}${created}` : ""}</output></div></div>;
}
