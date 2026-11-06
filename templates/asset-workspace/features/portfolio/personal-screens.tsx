"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/motion/button";
import { CenterMorphModal, CenterMorphModalContent, CenterMorphModalTrigger } from "@/components/motion/center-morph-modal";
import { usePortfolio } from "./provider";
import { Choice } from "./ui";

const models = [{ id: "local-analyst", name: "Local Analyst · balanced" }, { id: "local-educator", name: "Local Educator · explanatory" }, { id: "local-concise", name: "Local Brief · concise" }];
export function AssistantScreen() {
  const { state, update, services } = usePortfolio();
  const [prompt, setPrompt] = useState(""); const [streaming, setStreaming] = useState(false); const [error, setError] = useState("");
  const abort = useRef<AbortController | null>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const scrolledMessages = useRef<typeof state.messages | null>(null);
  const [clearOpen, setClearOpen] = useState(false);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (scrolledMessages.current === state.messages) return;
    scrolledMessages.current = state.messages;
    if (bottom.current) bottom.current.scrollTop = bottom.current.scrollHeight;
  }, [state.messages]);
  const send = async (text: string) => {
    if (!text.trim() || abort.current) return;
    const controller = new AbortController(); abort.current = controller;
    setStreaming(true); setError(""); setPrompt("");
    const id = crypto.randomUUID(); const model = state.model;
    update(s => ({ ...s, messages: [...s.messages, { id: crypto.randomUUID(), role: "user", text: text.trim(), model }, { id, role: "assistant", text: "", model }] }));
    try {
      for await (const chunk of services.assistant({ prompt: text.trim(), model, snapshot: state, signal: controller.signal })) {
        if (controller.signal.aborted) break;
        update(s => ({ ...s, messages: s.messages.map(message => message.id === id ? { ...message, text: message.text + chunk } : message) }));
      }
      if (controller.signal.aborted) update(s => ({ ...s, messages: s.messages.map(message => message.id === id ? { ...message, text: `${message.text}\n[Stopped by you]` } : message) }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The assistant could not respond.");
      update(s => ({ ...s, messages: s.messages.map(message => message.id === id ? { ...message, text: `${message.text}\n[Response failed]` } : message) }));
    } finally { abort.current = null; setStreaming(false); }
  };
  return <div className="portfolio-assistant"><header className="assistant-header"><h1>Local assistant</h1><CenterMorphModal open={clearOpen} onOpenChange={setClearOpen}><CenterMorphModalTrigger><Button variant="outline" size="sm" disabled={!state.messages.length || streaming}>New conversation</Button></CenterMorphModalTrigger><CenterMorphModalContent ariaLabel="Clear conversation"><h2>Start with a clean page?</h2><p>Remove all locally saved messages. Your balances and activity stay unchanged.</p><div className="button-row"><Button onClick={() => { update(s => ({ ...s, messages: [] })); setClearOpen(false); }}>Clear saved messages</Button><Button variant="ghost" onClick={() => setClearOpen(false)}>Keep conversation</Button></div></CenterMorphModalContent></CenterMorphModal></header><div ref={bottom} className="conversation" role="log" aria-label="Local assistant conversation" aria-live="off">{state.messages.length ? state.messages.map(message => <article className={`message ${message.role}`} key={message.id}><span className="message-avatar" aria-hidden="true">{message.role === "user" ? "You" : "✧"}</span><div><p className="message-label">{message.role === "user" ? "You" : models.find(model => model.id === message.model)?.name ?? message.model}</p><p className="message-text">{message.text || (streaming ? "Composing local reply…" : "Response interrupted before content arrived.")}</p></div></article>) : <div className="assistant-empty"><span className="sparkle" aria-hidden="true">✧</span><h2>A clearer view, one question away.</h2><p>Explore your demo holdings and staking with a rule-based local guide, not a remote AI provider or investment adviser.</p><div className="prompt-grid">{["Summarize my portfolio", "Explain my staking rewards", "How do simulated swaps work?", "What does wallet tracking do?"].map(text => <Button key={text} variant="outline" onClick={() => void send(text)}>{text}</Button>)}</div></div>}</div>{error && <div role="alert" className="negative"><p>{error}</p><Button variant="outline" size="sm" onClick={() => { const last = state.messages.findLast(message => message.role === "user"); if (last) void send(last.text); }}>Retry last message</Button></div>}<form className="assistant-composer" onSubmit={event => { event.preventDefault(); void send(prompt); }}><label htmlFor="local-assistant-prompt" className="sr-only">Message the local assistant</label><textarea id="local-assistant-prompt" rows={2} value={prompt} onChange={event => setPrompt(event.target.value)} maxLength={2000} placeholder="Ask about your demo portfolio…" disabled={streaming}/><div><Choice label="Demo response model" value={state.model} options={models} onChange={model => update(s => ({ ...s, model }))}/>{streaming ? <Button variant="outline" onClick={() => abort.current?.abort()}>Stop response</Button> : <Button type="submit" disabled={!prompt.trim()}>Send ↗</Button>}</div></form><p className="muted assistant-disclosure" role="status">{streaming ? "Streaming a local response…" : "Local only · Saved in this browser · No prompt is sent to a provider"}</p></div>;
}
