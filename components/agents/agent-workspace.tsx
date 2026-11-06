"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Bot, Check, RotateCcw, FileText, BookOpen, Wrench, Columns2, ArrowUp, Square } from "lucide-react";
import { Button } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import { Selector, type SelectorOption } from "@/components/motion/selector";
import { Switch } from "@/components/motion/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/motion/tabs";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { cn } from "@/lib/utils";

export interface AgentConfiguration {
  name: string;
  description?: string;
  instructions: string;
  modelId: string;
  sourceIds: string[];
  toolIds: string[];
  /** Host preference only; the host must enforce approval before executing writes. */
  requireApproval?: boolean;
}
export interface AgentTestMessage { id: string; role: "user" | "assistant"; content: string; status?: "streaming" | "complete" | "stopped" | "error" }
export interface AgentWorkspaceProps {
  value?: AgentConfiguration;
  defaultValue?: AgentConfiguration;
  onValueChange?: (value: AgentConfiguration) => void;
  models: SelectorOption[];
  sources: SelectorOption[];
  tools: SelectorOption[];
  /** Resolves only after the host has actually saved. Never deploys an agent. */
  onSave: (configuration: AgentConfiguration) => Promise<void>;
  /** Yield text deltas to stream an answer, or return a complete answer. Respect signal for cancellation. */
  onTest: (request: { configuration: AgentConfiguration; messages: AgentTestMessage[]; signal: AbortSignal }) => Promise<string | AsyncIterable<string>> | AsyncIterable<string>;
  onMessagesChange?: (messages: AgentTestMessage[]) => void;
  testLabel?: string;
  className?: string;
}
const EMPTY: AgentConfiguration = { name: "", instructions: "", modelId: "", sourceIds: [], toolIds: [] };
const field = "mt-3 w-full resize-y rounded-2xl border border-border bg-background px-4 py-3 text-sm font-normal leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring";

function ConfigurationChoices({ label, options, selected, onChange }: { label: string; options: SelectorOption[]; selected: string[]; onChange: (ids: string[]) => void }) {
  return <><div className="mb-3 flex items-center justify-between text-xs text-muted-foreground"><span>{label}</span><span className="inline-flex items-center gap-1 tabular-nums"><AnimatedNumber value={selected.length} startOnView={false} duration={0.2} /> selected</span></div><ul className="divide-y divide-border rounded-2xl border border-border">{options.map(option => { const checked = selected.includes(option.id); return <li key={option.id} className="flex items-center gap-4 px-4 py-3.5"><span className={cn("grid size-9 shrink-0 place-items-center rounded-full transition-colors motion-reduce:transition-none [&_svg]:size-4", checked ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>{option.icon ?? <BookOpen className="size-4" />}</span><div className="min-w-0 flex-1"><p className="text-sm font-medium">{option.name}</p>{option.description && <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>}</div><Switch className="shrink-0 [&_button]:h-6 [&_button]:w-10 [&_button>div]:size-4 [&_button>div>div]:size-4" ariaLabel={`Enable ${option.name}`} checked={checked} disabled={option.disabled} onCheckedChange={() => onChange(checked ? selected.filter(id => id !== option.id) : [...selected, option.id])} /></li>; })}</ul></>;
}

/** Configuration is host-owned when value is supplied; test conversations are local and reported to the host. */
export function AgentWorkspace({ value, defaultValue = EMPTY, onValueChange, models, sources, tools, onSave, onTest, onMessagesChange, testLabel = "Test session", className }: AgentWorkspaceProps) {
  const id = useId();
  const [internal, setInternal] = useState(defaultValue);
  const config = value ?? internal;
  const [saved, setSaved] = useState(() => JSON.stringify(config));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [messages, setMessages] = useState<AgentTestMessage[]>([]);
  const messageRef = useRef(messages);
  const [running, setRunning] = useState(false);
  const [prompt, setPrompt] = useState("");
  const promptInput = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => { const field = promptInput.current; if (!field) return; field.style.height = "auto"; field.style.height = prompt.length === 0 ? "56px" : `${Math.min(160, Math.max(56, field.scrollHeight))}px`; }, [prompt]);
  const request = useRef<AbortController | null>(null);
  const [tab, setTab] = useState<"instructions" | "knowledge" | "tools">("instructions");
  const initial = useRef({ ...config, sourceIds: [...config.sourceIds], toolIds: [...config.toolIds] });
  const serial = useRef(0);
  const saveLock = useRef(false);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; request.current?.abort(); }; }, []);
  const report = (next: AgentTestMessage[]) => { messageRef.current = next; setMessages(next); onMessagesChange?.(next); };
  const change = (patch: Partial<AgentConfiguration>) => { const next = { ...config, ...patch }; if (value === undefined) setInternal(next); onValueChange?.(next); setNotice(""); setError(null); };
  const validate = () => {
    if (!config.name.trim()) return "Give this agent a name.";
    if (!config.instructions.trim()) return "Add instructions before saving or testing.";
    if (!models.some((model) => model.id === config.modelId && !model.disabled)) return "Select an available model.";
    if (config.sourceIds.some((id) => !sources.some((source) => source.id === id && !source.disabled))) return "Remove unavailable knowledge sources.";
    if (config.toolIds.some((id) => !tools.some((tool) => tool.id === id && !tool.disabled))) return "Remove unavailable tools.";
    return null;
  };
  const save = async () => {
    if (saveLock.current) return;
    const invalid = validate(); setError(invalid); if (invalid) return;
    const snapshot = { ...config, sourceIds: [...config.sourceIds], toolIds: [...config.toolIds] };
    saveLock.current = true; setSaving(true); setNotice("");
    try { await onSave(snapshot); if (alive.current) { initial.current = snapshot; setSaved(JSON.stringify(snapshot)); setNotice("Configuration saved. Not deployed."); } }
    catch (cause) { if (alive.current) setError(cause instanceof Error ? cause.message : "Could not save the configuration."); }
    finally { saveLock.current = false; if (alive.current) setSaving(false); }
  };
  const test = async (text: string) => {
    if (request.current) return;
    const invalid = validate(); setError(invalid); if (invalid) return;
    const controller = new AbortController(); request.current = controller;
    const user: AgentTestMessage = { id: `${id}-message-${++serial.current}`, role: "user", content: text };
    const assistantId = `${id}-message-${++serial.current}`;
    const history = [...messageRef.current, user];
    report([...history, { id: assistantId, role: "assistant", content: "", status: "streaming" }]);
    setRunning(true); setPrompt("");
    const update = (content: string, status: AgentTestMessage["status"]) => report(messageRef.current.map((message) => message.id === assistantId ? { ...message, content, status } : message));
    let content = "";
    try {
      const answer = await onTest({ configuration: { ...config, sourceIds: [...config.sourceIds], toolIds: [...config.toolIds] }, messages: history, signal: controller.signal });
      if (controller.signal.aborted || !alive.current) return;
      if (typeof answer === "string") content = answer;
      else for await (const delta of answer) { if (controller.signal.aborted || !alive.current) break; content += delta; update(content, "streaming"); }
      if (!controller.signal.aborted && alive.current) { if (!content.trim()) throw new Error("The test returned an empty answer."); update(content, "complete"); }
    } catch (cause) {
      if (!controller.signal.aborted && alive.current) { setError(cause instanceof Error ? cause.message : "The test failed."); update(content, "error"); }
    } finally { if (request.current === controller) { request.current = null; if (alive.current) setRunning(false); } }
  };
  const stop = () => {
    request.current?.abort(); request.current = null; setRunning(false);
    report(messageRef.current.map((message) => message.status === "streaming" ? { ...message, status: "stopped" } : message));
  };
  const dirty = JSON.stringify(config) !== saved;
  return <section aria-label="Agent workspace" className={cn("w-full bg-background px-5 py-8 text-foreground sm:px-8", className)}><div className="mx-auto max-w-6xl">
    <header className="mb-8 flex flex-wrap items-center justify-between gap-5">
      <div className="flex min-w-0 items-center gap-3"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted"><Bot className="size-5" /></span><div className="min-w-0"><h2 className="truncate text-xl font-medium">{config.name || "Untitled agent"}</h2><p className="mt-1 truncate text-sm text-muted-foreground">{config.description || "Configure your assistant, then try a conversation."}</p></div></div>
      <div className="flex items-center gap-2"><span role="status" className="sr-only">{dirty ? "Unsaved changes" : "No unsaved changes"}</span><Button variant="ghost" disabled={saving || running || !dirty} onClick={() => change({ ...initial.current, sourceIds: [...initial.current.sourceIds], toolIds: [...initial.current.toolIds] })} className="h-9 rounded-full">Reset changes</Button><Button disabled={saving || !dirty} onClick={save} className="h-9 rounded-full">{saving ? "Saving…" : "Save agent"}</Button></div>
    </header>
    {error && <p role="alert" className="mb-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
    {notice && <p role="status" className="mb-5 flex items-center gap-2 text-sm"><Check className="size-4" />{notice}</p>}
    <div className="grid items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="min-w-0"><div className="mb-6 flex items-center gap-2 text-xs font-medium text-muted-foreground"><Columns2 className="size-3.5" />Configuration</div><div className="space-y-5">
        <Input classNames={{ field: "h-10" }} label="Agent name" value={config.name} onChange={(name) => change({ name })} />
        <Input classNames={{ field: "h-10" }} label="Short description" value={config.description ?? ""} onChange={(description) => change({ description })} />
        <div><p className="text-sm font-medium">Model</p><Selector label="Agent model" placeholder="Choose a model" options={models} value={config.modelId} onValueChange={modelId => change({ modelId })} className="mt-2 w-full [&>div]:rounded-full [&>div]:shadow-none" classNames={{ trigger: "min-h-[38px] py-1.5" }} /></div>
        {!models.some((model) => !model.disabled) && <p role="status" className="text-xs text-destructive">No available models. Your host must provide a model before saving or testing.</p>}
      </div><Tabs className="mt-5" value={tab} onValueChange={value => setTab(value as "instructions" | "knowledge" | "tools")} variant="underline"><TabsList className="w-full gap-4"><TabsTrigger value="instructions" icon={<FileText className="size-3.5" />} className="gap-2 px-1 text-sm" indicatorClassName="bg-primary">Instructions</TabsTrigger><TabsTrigger value="knowledge" icon={<BookOpen className="size-3.5" />} className="gap-2 px-1 text-sm" indicatorClassName="bg-primary">Knowledge</TabsTrigger><TabsTrigger value="tools" icon={<Wrench className="size-3.5" />} className="gap-2 px-1 text-sm" indicatorClassName="bg-primary">Tools</TabsTrigger></TabsList>
        <TabsContent value="instructions" className="mt-5 min-h-72"><label htmlFor={`${id}-instructions`} className="block text-sm font-medium">How should your agent behave?<textarea id={`${id}-instructions`} rows={8} maxLength={12000} className={field} value={config.instructions} onChange={event => change({ instructions: event.target.value })} /></label><p className="mt-2 flex justify-between gap-3 text-xs text-muted-foreground"><span>Define its role, boundaries, and response style.</span><span className="tabular-nums">{config.instructions.length.toLocaleString()}/12,000</span></p></TabsContent>
        <TabsContent value="knowledge" className="mt-5 min-h-72"><ConfigurationChoices label="Choose what your agent knows" options={sources} selected={config.sourceIds} onChange={sourceIds => change({ sourceIds })} />{config.sourceIds.filter((sourceId) => !sources.some((source) => source.id === sourceId && !source.disabled)).map((sourceId) => <div key={sourceId} className="mt-3 flex flex-wrap items-center gap-2 text-xs text-destructive"><span>Unavailable source: {sourceId}</span><Button variant="outline" size="sm" onClick={() => change({ sourceIds: config.sourceIds.filter((id) => id !== sourceId) })}>Remove unavailable source {sourceId}</Button></div>)}</TabsContent>
        <TabsContent value="tools" className="mt-5 min-h-72"><ConfigurationChoices label="Choose what your agent can do" options={tools} selected={config.toolIds} onChange={toolIds => change({ toolIds })} />{config.toolIds.filter((toolId) => !tools.some((tool) => tool.id === toolId && !tool.disabled)).map((toolId) => <div key={toolId} className="mt-3 flex flex-wrap items-center gap-2 text-xs text-destructive"><span>Unavailable tool: {toolId}</span><Button variant="outline" size="sm" onClick={() => change({ toolIds: config.toolIds.filter((id) => id !== toolId) })}>Remove unavailable tool {toolId}</Button></div>)}<div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-border px-4 py-3.5"><div><p className="text-sm font-medium">Ask before taking action</p><p className="mt-0.5 text-xs text-muted-foreground">Require approval for actions that change data.</p></div><Switch className="shrink-0 [&_button]:h-6 [&_button]:w-10 [&_button>div]:size-4 [&_button>div>div]:size-4" ariaLabel="Require approval for actions" checked={config.requireApproval ?? true} onCheckedChange={requireApproval => change({ requireApproval })} /></div></TabsContent>
      </Tabs>
      </div>
      <section aria-label="Agent test chat" className="flex min-h-[32rem] min-w-0 flex-col rounded-3xl border border-border bg-background p-4 sm:p-5 lg:h-full">
        <header className="flex items-center justify-between gap-3 px-1 pb-4"><div className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted"><Bot className="size-4" /></span><div className="min-w-0"><h3 className="truncate text-xl font-medium">Test {config.name || "your agent"}</h3><p className="mt-0.5 text-xs text-muted-foreground">{testLabel}</p></div></div><Button type="button" variant="ghost" size="icon" className="size-9 rounded-full" aria-label="Clear conversation" disabled={running || !messages.length} onClick={() => report([])}><RotateCcw className="size-4" /></Button></header>
        <div role="log" aria-label="Test messages" aria-live="polite" className="min-h-0 max-h-96 flex-1 space-y-5 overflow-y-auto px-1 py-5 lg:max-h-128">
          {messages.length === 0 && <div className="flex min-h-72 flex-col items-center justify-center text-center"><span className="mb-5 grid size-14 place-items-center rounded-full bg-muted"><Bot className="size-6" /></span><h4 className="text-xl font-medium">Meet {config.name || "your agent"}</h4><p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">Try a real question. Refine your instructions, then test again.</p><div className="mt-6 flex flex-wrap justify-center gap-2">{["What can you help me with?", "How do I invite a teammate?"].map(question => <Button key={question} type="button" variant="secondary" onClick={() => test(question)} className="h-9 rounded-full bg-muted">{question}</Button>)}</div></div>}
          {messages.map((message) => <div key={message.id} className={cn("max-w-[90%] rounded-2xl px-4 py-3 text-sm", message.role === "user" ? "self-end bg-primary text-primary-foreground" : "self-start bg-muted")}><p className="mb-1 text-[10px] font-semibold uppercase tracking-wider">{message.role === "user" ? "You" : config.name || "Assistant"}</p><p className="whitespace-pre-wrap">{message.content || (message.status === "streaming" ? "Thinking…" : message.status === "stopped" ? "Test stopped." : "No answer received.")}</p>{message.status === "stopped" && message.content && <p className="mt-2 text-xs">Stopped</p>}{message.status === "error" && <p className="mt-2 text-xs">Test failed. You can try again.</p>}</div>)}
        </div>
        <div className="pt-4"><form onSubmit={event => { event.preventDefault(); if (prompt.trim() && !running) void test(prompt.trim()); }} className="rounded-2xl border border-border p-3 transition-colors focus-within:border-foreground/40"><textarea ref={promptInput} rows={2} aria-label="Test message" value={prompt} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder="Ask a test question…" className="block max-h-40 min-h-12 w-full resize-none bg-transparent px-1 py-1 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground" /><div className="mt-2 flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{config.sourceIds.length} sources · {config.toolIds.length} {config.toolIds.length === 1 ? "tool" : "tools"}</p>{running ? <Button type="button" size="icon" aria-label="Stop response" onClick={stop} className="size-9 rounded-full"><Square className="size-3 fill-current" /></Button> : <Button type="submit" size="icon" aria-label="Send message" disabled={!prompt.trim()} className="size-9 rounded-full"><ArrowUp className="size-4" /></Button>}</div></form></div>
      </section>
    </div>
  </div></section>;
}
