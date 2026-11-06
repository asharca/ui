"use client";
import { useState } from "react";
import { Folder, Plus, ArrowUpRight, Pencil, Trash2, Search } from "lucide-react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { id, type Project } from "./domain";
import { SessionList, useQueryValue } from "./conversations";
import { useWorkspace } from "./store";
export function ProjectsScreen() {
  const { state, update } = useWorkspace();
  const projectId = useQueryValue("project");
  const project = state.projects.find(p => p.id === projectId);
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [removing, setRemoving] = useState<Project | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const open = (p: Project | "new") => { setEditing(p); setName(p === "new" ? "" : p.name); setDescription(p === "new" ? "" : p.description); setError(""); };
  const save = () => {
    if (!name.trim() || !editing) return;
    if (state.projects.some(p => p.name.toLowerCase() === name.trim().toLowerCase() && p.id !== (editing === "new" ? "" : editing.id))) { setError("A project with this name already exists."); return; }
    const next: Project = { id: editing === "new" ? id() : editing.id, name: name.trim(), description: description.trim() };
    update(current => ({ ...current, projects: editing === "new" ? [...current.projects, next] : current.projects.map(p => p.id === next.id ? next : p) }));
    setEditing(null);
  };
  const sessions = state.sessions.filter(s => !s.archived && (!project || s.projectId === project.id) && s.title.toLowerCase().includes(search.toLowerCase()));
  return <div className="page workspace-collection"><div className="collection-heading"><div><h1>{project ? project.name : "Projects"}</h1><p>{project ? project.description || "Conversations collected around one shared goal." : "Keep related conversations together."}</p></div>{project ? <div className="flex gap-2"><Button variant="outline" onClick={() => open(project)}>Edit project</Button><Button variant="ghost" onClick={() => setRemoving(project)}>Delete project</Button></div> : <Button onClick={() => open("new")}><Plus size={16} />New project</Button>}</div>
    {projectId && !project ? <div role="status" className="panel"><h2>Project not found</h2><p className="mt-2 text-sm text-muted-foreground">This project is not available in this browser.</p><a href="/projects/" className="mt-4 inline-block underline">View all projects</a></div> : project ? <><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><a href="/projects/" className="text-sm text-muted-foreground hover:underline">← All projects</a><a href={`/chat/?project=${encodeURIComponent(project.id)}`} className="inline-flex items-center gap-2 text-sm text-primary underline">New conversation in project <ArrowUpRight size={14} /></a></div><label className="field mb-6">Search project conversations<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a conversation…" /></label><SessionList sessions={sessions} empty={search ? "No matching conversations." : "No active conversations in this project. Create one or move an existing conversation here."} /></> : state.projects.length ? <div className="collection-list">{state.projects.map(p => { const count = state.sessions.filter(s => s.projectId === p.id && !s.archived).length; return <article key={p.id} className="project-row"><Folder size={20} className="text-muted-foreground" /><a href={`/projects/?project=${encodeURIComponent(p.id)}`} className="project-row-title"><h2>{p.name}</h2><p>{count} {count === 1 ? "chat" : "chats"}</p></a><a href={`/chat/?project=${encodeURIComponent(p.id)}`} className="project-new-chat">New chat</a><Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} onClick={() => open(p)}><Pencil size={16} /></Button><Button variant="ghost" size="icon" aria-label={`Delete ${p.name}`} className="text-destructive" onClick={() => setRemoving(p)}><Trash2 size={16} /></Button></article>; })}</div> : <div className="panel py-16 text-center"><Folder className="mx-auto mb-4 text-muted-foreground" size={32} /><h2>Your next project starts here</h2><p className="mt-3 text-sm text-muted-foreground">Create a space for your research, plans, or work in progress.</p><Button className="mt-5" onClick={() => open("new")}>Create your first project</Button></div>}
    <MorphingModal viewId={editing ? "project-editor" : null} onClose={() => setEditing(null)} placement="center" ariaLabel={editing === "new" ? "Create project" : "Edit project"}><form className="grid gap-4" onSubmit={e => { e.preventDefault(); save(); }}><h2 className="text-lg font-semibold">{editing === "new" ? "Make room for an idea" : "Edit project"}</h2><label className="field">Project name<input required maxLength={80} value={name} onChange={e => setName(e.target.value)} /></label><label className="field">Description<textarea rows={3} maxLength={500} value={description} onChange={e => setDescription(e.target.value)} /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button type="submit" disabled={!name.trim()}>{editing === "new" ? "Create project" : "Save project"}</Button></div></form></MorphingModal>
    <MorphingModal viewId={removing ? "delete-project" : null} onClose={() => setRemoving(null)} placement="center" ariaLabel="Delete project"><div className="grid gap-5"><h2 className="text-lg font-semibold">Delete “{removing?.name}”?</h2><p className="text-sm leading-6 text-muted-foreground">Only the project is removed. All its conversations, including archived ones, remain in your workspace without a project.</p><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setRemoving(null)}>Cancel</Button><Button onClick={() => { if (!removing) return; const removedId = removing.id; update(current => ({ ...current, projects: current.projects.filter(p => p.id !== removedId), sessions: current.sessions.map(s => s.projectId === removedId ? { ...s, projectId: null } : s) })); setRemoving(null); if (projectId === removedId) window.location.assign("/projects/"); }}>Delete project</Button></div></div></MorphingModal>
  </div>;
}
export function ArchiveScreen() {
  const { state } = useWorkspace();
  const [query, setQuery] = useState("");
  const [project, setProject] = useState("");
  const sessions = state.sessions.filter(s => s.archived && s.title.toLowerCase().includes(query.toLowerCase()) && (!project || s.projectId === project));
  return <div className="page workspace-collection archive-collection"><div className="collection-heading"><div><h1>Archived chats</h1><p>Out of the sidebar, here when you need them.</p></div></div><div className="archive-content"><div className="collection-controls"><label className="collection-search"><Search size={16} /><span className="sr-only">Search archived chats</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search archived chats" /></label>{state.sessions.some(s => s.archived && s.projectId) && <label className="field"><span className="sr-only">Project</span><select value={project} onChange={e => setProject(e.target.value)}><option value="">All projects</option>{state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}</div>{sessions.length ? <SessionList sessions={sessions} empty="" /> : <p className="collection-empty">{query || project ? "No archived conversations match these filters." : "No archived chats yet."}</p>}</div></div>;
}
