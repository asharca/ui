"use client";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { useWorkspace } from "./store";
import type { Attachment, Session } from "./domain";
const subscribeLocation = (listener: () => void) => { window.addEventListener("popstate", listener); return () => window.removeEventListener("popstate", listener); };
export function useQueryValue(key: string) { return useSyncExternalStore(subscribeLocation, () => new URLSearchParams(window.location.search).get(key), () => null); }
export function selectSession(id: string) {
  const query = new URLSearchParams({ session: id });
  const mode = new URLSearchParams(window.location.search).get("mode");
  if (mode === "agent" || mode === "design") query.set("mode", mode);
  window.history.pushState(null, "", `/chat/?${query}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
export function SessionActions({ session }: { session: Session }) {
  const { state, update } = useWorkspace();
  const [action, setAction] = useState<"rename" | "archive" | "move" | null>(null);
  const [title, setTitle] = useState(session.title);
  const [projectId, setProjectId] = useState(session.projectId || "");
  const save = () => {
    if (action === "rename" && !title.trim()) return;
    update(current => ({ ...current, sessions: current.sessions.map(s => s.id !== session.id ? s : action === "rename" ? { ...s, title: title.trim() } : action === "move" ? { ...s, projectId: projectId || null } : { ...s, archived: !s.archived }) }));
    setAction(null);
  };
  return <><div className="flex flex-wrap gap-1"><Button variant="ghost" size="sm" aria-label={`Rename ${session.title}`} onClick={() => { setTitle(session.title); setAction("rename"); }}>Rename</Button><Button variant="ghost" size="sm" aria-label={`Move ${session.title}`} onClick={() => { setProjectId(session.projectId || ""); setAction("move"); }}>Move</Button><Button variant="ghost" size="sm" aria-label={`${session.archived ? "Restore" : "Archive"} ${session.title}`} onClick={() => setAction("archive")}>{session.archived ? "Restore" : "Archive"}</Button></div>
    <MorphingModal viewId={action} onClose={() => setAction(null)} placement="center" ariaLabel={action === "rename" ? "Rename conversation" : action === "move" ? "Move conversation" : `${session.archived ? "Restore" : "Archive"} conversation`}>
      <form onSubmit={e => { e.preventDefault(); save(); }} className="grid gap-5"><h2 className="text-lg font-semibold">{action === "rename" ? "Give this idea a name" : action === "move" ? "Organize your conversation" : session.archived ? "Bring this conversation back?" : "Archive this conversation?"}</h2>{action === "rename" ? <label className="field">Conversation name<input maxLength={120} required value={title} onChange={e => setTitle(e.target.value)} /></label> : action === "move" ? <label className="field">Project<select value={projectId} onChange={e => setProjectId(e.target.value)}><option value="">No project</option>{state.projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label> : <p className="text-sm leading-6 text-muted-foreground">“{session.title}” {session.archived ? "will return to your conversations with its full history." : "will move to Archive. Its messages stay on this browser and you can restore it anytime."}</p>}<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setAction(null)}>Cancel</Button><Button type="submit" disabled={action === "rename" && !title.trim()}>{action === "rename" || action === "move" ? "Save changes" : session.archived ? "Restore conversation" : "Archive conversation"}</Button></div></form>
    </MorphingModal></>;
}
export function AttachmentPreview({ attachment, onClose }: { attachment: Attachment | null; onClose: () => void }) {
  let text = "";
  if (attachment?.type === "text/plain") { try { const bytes = Uint8Array.from(atob(attachment.data.split(",")[1]), c => c.charCodeAt(0)); text = new TextDecoder().decode(bytes); } catch { text = "This text attachment could not be decoded."; } }
  return <MorphingModal viewId={attachment?.id || null} onClose={onClose} placement="center" ariaLabel="Local attachment preview" className="max-w-2xl"><div className="grid gap-4"><div className="flex items-center justify-between gap-4"><h2 className="truncate font-semibold">{attachment?.name}</h2><Button size="sm" variant="ghost" onClick={onClose}>Close</Button></div><p className="text-xs text-muted-foreground">Local preview · {Math.ceil((attachment?.size || 0) / 1024)} KB · never uploaded</p>{attachment?.type.startsWith("image/") ? <img src={attachment.data} alt={attachment.name} className="max-h-[60vh] w-full rounded-lg object-contain" /> : attachment?.type === "text/plain" ? <pre className="max-h-[60vh] overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">{text}</pre> : <div className="rounded-lg border border-border p-6"><p className="text-sm leading-6">PDF inline rendering depends on your browser. Open or save this local copy to inspect it; no server receives the file.</p>{attachment && <a className="mt-4 inline-block underline" href={attachment.data} download={attachment.name}>Save PDF</a>}</div>}</div></MorphingModal>;
}
export function SessionList({ sessions, empty }: { sessions: Session[]; empty: string }) { return sessions.length ? <div className="grid gap-3">{[...sessions].reverse().map(session => <article key={session.id} className="panel flex flex-wrap items-center justify-between gap-3"><div className="min-w-0 flex-1"><a href={`/chat/?session=${encodeURIComponent(session.id)}`} className="font-medium hover:underline break-words">{session.title}</a><p className="mt-1 text-xs text-muted-foreground">{session.messages.length} messages · {new Date(session.createdAt).toLocaleDateString()}</p></div><SessionActions session={session} /></article>)}</div> : <div className="rounded-2xl border border-dashed border-border py-12 text-center"><p className="text-muted-foreground">{empty}</p><a href="/chat/" className="mt-4 inline-block text-sm underline">Start a conversation</a></div>; }
