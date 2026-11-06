"use client";
import { useState } from "react";
import { AgentChatInput, type ComposerPayload } from "@/components/agents/agent-chat-input";
import { Button } from "@/components/motion/button";
export function CreativeComposerPreview() {
  const [streaming, setStreaming] = useState(false);
  const [fail, setFail] = useState(false);
  const [receipt, setReceipt] = useState("");
  const [credits, setCredits] = useState(490);
  const [queue, setQueue] = useState<{ id: string; text: string }[]>([]);
  const [voice, setVoice] = useState(false);
  const submit = async (payload: ComposerPayload) => {
    if (fail) throw new Error("Demo rejection: switch off failure and resend your preserved draft.");
    setReceipt(JSON.stringify({ text: payload.text, attachments: payload.attachments.map(file => file.name), ...payload.settings }, null, 2));
    setCredits(value => value - 1); setStreaming(true);
  };
  return <div className="flex w-full justify-center p-4 sm:p-8"><div className="relative w-full max-w-3xl">
    <AgentChatInput variant="creative" models={[{ value: "default", label: "GPT-5.4" }, { value: "reasoning", label: "Claude Sonnet 4.6" }]} defaultSettings={{ resolution: "2160p", aspectRatio: "16:9", reasoning: "deep", skills: [], webSearch: false }} skills={[{ id: "research", label: "Research", description: "Review supplied research context" }]} streaming={streaming} onSubmit={submit} onStop={() => { setStreaming(false); setReceipt("Demo response stopped by host"); }} credits={credits} creditCost={1} onDictate={async () => { throw new Error("No dictation provider connected to this demo."); }} onVoice={() => setVoice(value => !value)} onUpgrade={() => setReceipt("Upgrade requested. No billing service is connected to this demo.")} onQueue={async payload => setQueue(items => [...items, { id: crypto.randomUUID(), text: payload.text }])} queuedMessages={queue} onRemoveQueued={id => setQueue(items => items.filter(item => item.id !== id))} />
    {voice && <div role="status" className="mt-3 rounded-xl border border-border p-3 text-sm">Voice hook received by demo host. This preview does not acquire a microphone.<Button variant="ghost" onClick={() => setVoice(false)}>Close voice request</Button></div>}
    <details className="absolute top-full mt-3 text-[10px] text-muted-foreground"><summary className="cursor-pointer">Demo controls</summary><div className="mt-2 space-y-2 rounded-xl border border-border bg-background p-3"><p>Interactive demo · no AI service or microphone connected</p><label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)} /> Reject next send</label>{streaming && <Button variant="ghost" onClick={() => setStreaming(false)}>Finish demo response</Button>}{receipt && <div role="status"><p>Host received</p><pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap">{receipt}</pre></div>}</div></details>
  </div></div>;
}
