"use client";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Compass, FileText, Paperclip, Sparkles, X } from "lucide-react";
import { PromptInput } from "@/components/agents/prompt-input";
import { Message, MessageAvatar, MessageContent, MessageHeader } from "@/components/agents/message";
import { Button } from "@/components/motion/button";
import { useReducedMotion } from "motion/react";
import { AttachmentPreview, selectSession, SessionActions, useQueryValue } from "./conversations";
import { id, MODELS, readAttachment, SKILLS, type Attachment, type Model, type Session, type Skill } from "./domain";
import { useWorkspace } from "./store";
export function ChatWorkspace() {
  const { state, ready, update, adapter } = useWorkspace();
  const sessionId = useQueryValue("session");
  const projectQuery = useQueryValue("project");
  const mode = useQueryValue("mode");
  const session = state.sessions.find(s => s.id === sessionId);
  const [model, setModel] = useState<Model>(state.preferences.model);
  const [skill, setSkill] = useState<Skill>(state.preferences.skill);
  const [knowledgeIds, setKnowledgeIds] = useState<string[]>([]);
  const [showContext, setShowContext] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [preview, setPreview] = useState<Attachment | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");
  const request = useRef<AbortController | null>(null);
  const files = useRef<HTMLInputElement>(null);
  const liveEdge = useRef<HTMLDivElement>(null);
  const scrollCursor = useRef<{ sessionId: string | null; count: number; pending: string | null; reduce: boolean | null } | null>(null);
  const previousSession = useRef(sessionId);
  const reduce = useReducedMotion();
  useEffect(() => { setModel(state.preferences.model); setSkill(state.preferences.skill); }, [state.preferences.model, state.preferences.skill]);
  useEffect(()=>{if(mode==="agent")setSkill("outline");else if(mode==="design")setSkill("brainstorm");},[mode]);
  useEffect(() => {
    const cursor = { sessionId, count: session?.messages.length ?? 0, pending, reduce };
    const previous = scrollCursor.current;
    if (previous && previous.sessionId === cursor.sessionId && previous.count === cursor.count && previous.pending === cursor.pending && previous.reduce === cursor.reduce) return;
    scrollCursor.current = cursor;
    liveEdge.current?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "end" });
  }, [sessionId, session?.messages.length, pending, reduce]);
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (previousSession.current === sessionId) return;
    previousSession.current = sessionId;
    setAttachments([]); setKnowledgeIds([]); setError("");
  }, [sessionId]);
  const draft = session ? session.draft : state.newDraft;
  const setDraft = (value: string) => update(current => session ? { ...current, sessions: current.sessions.map(s => s.id === session.id ? { ...s, draft: value } : s) } : { ...current, newDraft: value });
  const send = async (prompt: string) => {
    if (request.current || !prompt.trim() || !ready) return;
    const cost = MODELS.find(m => m.value === model)!.cost;
    if (state.credits < cost) { setError("Not enough local credits. Reset the demonstration allowance in Settings; no payment is needed."); return; }
    if (sessionId && !session) return;
    if (session?.archived) return;
    const targetId = session?.id || id();
    const selected = state.knowledge.filter(k => knowledgeIds.includes(k.id));
    const sentAttachments = attachments;
    const message = { id: id(), role: "user" as const, text: prompt.trim(), createdAt: Date.now(), model, skill, attachments: sentAttachments, knowledgeIds: selected.map(k => k.id) };
    const created: Session = { id: targetId, title: prompt.trim().slice(0, 58), createdAt: Date.now(), archived: false, projectId: state.projects.some(p => p.id === projectQuery) ? projectQuery : null, messages: [message], draft: "" };
    const controller = new AbortController();
    request.current = controller;
    setPending(targetId); setStreamingText(""); setError(""); setNotice(""); setAttachments([]);
    update(current => ({ ...current, newDraft: session ? current.newDraft : "", sessions: session ? current.sessions.map(s => s.id === targetId ? { ...s, draft: "", messages: [...s.messages, message] } : s) : [...current.sessions, created] }));
    if (!session) selectSession(targetId);
    try {
      const text = await adapter.respond({ prompt: prompt.trim(), model, skill, knowledge: selected, attachments: sentAttachments, instructions: state.preferences.instructions, signal: controller.signal, onChunk: chunk => { if (!controller.signal.aborted) setStreamingText(current => current + chunk); } });
      if (controller.signal.aborted) return;
      update(current => ({ ...current, credits: Math.max(0, current.credits - cost), sessions: current.sessions.map(s => s.id === targetId ? { ...s, messages: [...s.messages, { id: id(), role: "assistant", text, createdAt: Date.now(), model, skill }] } : s) }));
    } catch (e) { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "The assistant could not respond. Your message is saved; no credits were spent."); }
    finally { if (request.current === controller) { request.current = null; setPending(null); setStreamingText(""); } }
  };
  if (sessionId && !session && ready) return <div className="page"><h1>Conversation not found</h1><p className="mt-3 text-muted-foreground">This URL points to a conversation that is not saved in this browser. Local demo sessions are not shared between devices.</p><a href="/chat/" className="mt-5 inline-block underline">Start a new conversation</a></div>;
  return <div className={`chat-workspace ${session?.messages.length ? "has-messages" : "is-empty"}`}>
    {session && <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-3"><div className="min-w-0"><h1 className="truncate font-medium">{session.title}</h1><p className="text-xs text-muted-foreground">{session.archived ? "Archived conversation" : state.projects.find(p => p.id === session.projectId)?.name || "Personal conversation"}</p></div><SessionActions session={session} /></div>}
    <div className="chat-column">
    {!session?.messages.length ? <section className="chat-welcome"><span className="chat-welcome-mark"><Sparkles size={20}/></span><h1>What should we move forward?</h1></section> : <div role="log" aria-label="Conversation messages" className="space-y-8 py-8">{session.messages.map(message => <Message key={message.id} from={message.role} animateIn><MessageAvatar className={message.role === "assistant" ? "bg-accent text-primary" : ""}>{message.role === "assistant" ? <Sparkles size={14} /> : (state.preferences.name || "You").slice(0, 1).toUpperCase()}</MessageAvatar><MessageContent><MessageHeader>{message.role === "user" ? "You" : "Fieldwork · Local simulation"}</MessageHeader><div className={message.role === "user" ? "prose-local max-w-full rounded-2xl bg-muted px-4 py-3 text-sm" : "prose-local max-w-full pt-2 text-sm"}>{message.text}</div>{message.attachments?.map(a => <Button variant="outline" size="sm" key={a.id} onClick={() => setPreview(a)}><Paperclip size={13}/>{a.name}</Button>)}{message.knowledgeIds && message.knowledgeIds.length > 0 && <p className="text-xs text-muted-foreground">Context: {message.knowledgeIds.map(k => state.knowledge.find(n => n.id === k)?.title || "Removed reference").join(", ")}</p>}<Button variant="ghost" size="sm" onClick={async () => { try { await navigator.clipboard.writeText(message.text); setNotice("Message copied."); } catch { setError("Clipboard access was denied. Select and copy the message text instead."); } }}>Copy text</Button></MessageContent></Message>)}</div>}
    <div ref={liveEdge} />
    <div className="chat-composer">
      <div className="chat-credit-strip">{state.credits} Local Credits Remaining</div>
      {error && <p role="alert" className="mb-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}{notice && <p role="status" className="mb-2 text-xs text-muted-foreground">{notice}</p>}
      {pending && pending === sessionId && <div className="mb-3"><p role="status" className="text-sm text-muted-foreground">{adapter.label} is composing…</p>{streamingText && <section aria-label="Streaming local response" aria-live="off" className="prose-local mt-3 text-sm">{streamingText}</section>}</div>}
      {session?.archived ? <div className="panel text-sm text-muted-foreground">This conversation is archived. Restore it above to continue.</div> : <>
      {attachments.length > 0 && <div className="mb-2 flex flex-wrap gap-2">{attachments.map(a => <div key={a.id} className="flex items-center rounded-lg border border-border bg-card"><Button size="sm" variant="ghost" onClick={() => setPreview(a)}><Paperclip size={13} />{a.name}</Button><Button variant="ghost" size="icon" aria-label={`Remove ${a.name}`} onClick={() => setAttachments(current => current.filter(x => x.id !== a.id))}><X size={13} /></Button></div>)}</div>}
      <PromptInput aria-label="Message Fieldwork" value={draft} onValueChange={setDraft} onSubmit={send} model={model} models={MODELS.map(m => ({ value: m.value, label: m.label }))} onModelChange={v => setModel(v as Model)} actions={[...SKILLS.map(item => ({ value: item.value, label: `${item.value === skill ? "✓ " : ""}${item.label}` })), { value: "context", label: `Knowledge context${knowledgeIds.length ? ` (${knowledgeIds.length})` : ""}` }, { value: "attach", label: "Attach local file", disabled: !!pending || attachments.length >= 3 }]} onAction={value => { if (value === "context") setShowContext(!showContext); else if (value === "attach") files.current?.click(); else setSkill(value as Skill); }} loading={!!pending} onStop={() => { request.current?.abort(); request.current = null; setPending(null); setStreamingText(""); setNotice("Response stopped. Your message is saved; no credits were spent."); }} placeholder="Ask, plan, or build something…" />
      <input ref={files} type="file" accept="image/png,image/jpeg,image/gif,image/webp,text/plain,application/pdf" className="sr-only" aria-label="Choose local attachment" onChange={async e => { const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; try { const attachment = await readAttachment(file); setAttachments(current => [...current, attachment].slice(0, 3)); setError(""); } catch (err) { setError(err instanceof Error ? err.message : "Could not read this file."); } }} />
      {showContext && <section aria-label="Knowledge selection" className="mt-3 rounded-xl border border-border bg-card p-4"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-medium">Include knowledge</h2><a href="/knowledge/" className="text-xs underline">Manage knowledge</a></div>{state.knowledge.length ? <div className="grid max-h-48 gap-3 overflow-auto">{state.knowledge.map(k => <label key={k.id} className="flex items-center gap-3"><input type="checkbox" checked={knowledgeIds.includes(k.id)} onChange={e => setKnowledgeIds(current => e.target.checked ? [...current, k.id] : current.filter(x => x !== k.id))} />{k.title}</label>)}</div> : <p className="text-xs text-muted-foreground">No references yet. Add a note or link in Knowledge, then select it here.</p>}</section>}
      </>}
      {!session?.messages.length && <div className="chat-suggestions">{[{ icon:Compass,title:"Portfolio site",prompt:"Outline a clear plan for a personal portfolio site",skill:"outline" },{icon:BookOpen,title:"Analytics dashboard",prompt:"Summarize the selected knowledge into requirements for an analytics dashboard",skill:"summarize"},{icon:FileText,title:"Landing page",prompt:"Brainstorm three directions for a useful product landing page",skill:"brainstorm"},{icon:Compass,title:"Task manager",prompt:"Outline a practical task manager with clear priorities and next steps",skill:"outline"}].map(item => <Button key={item.title} variant="ghost" size="sm" onClick={() => { setDraft(item.prompt); setSkill(item.skill as Skill); }}><item.icon size={14}/>{item.title}</Button>)}</div>}
      <p className="chat-demo-note">{adapter.label} · {SKILLS.find(item => item.value === skill)?.label}. No hosted AI or uploads. Up to 3 local files, 1 MB each.</p>
    </div></div><AttachmentPreview attachment={preview} onClose={() => setPreview(null)} />
  </div>;
}
