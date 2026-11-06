"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/motion/button";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { decodeWorkspace, MODELS, SKILLS, STORAGE_KEY, type Preferences, type WorkspaceState } from "./domain";
import { useWorkspace } from "./store";
export function SettingsScreen() {
  const { state, update, reset } = useWorkspace();
  const [preferences, setPreferences] = useState<Preferences>(state.preferences);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<"reset" | "credits" | "import" | null>(null);
  const [incoming, setIncoming] = useState<WorkspaceState | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const previousPreferences = useRef(state.preferences);
  useEffect(() => {
    const previous = previousPreferences.current;
    const next = state.preferences;
    const themeOnly = previous.name === next.name && previous.instructions === next.instructions && previous.model === next.model && previous.skill === next.skill;
    setPreferences(current => themeOnly ? { ...current, theme: next.theme } : next);
    previousPreferences.current = next;
  }, [state.preferences]);
  const dirty = JSON.stringify(preferences) !== JSON.stringify(state.preferences);
  const download = (saved: boolean) => {
    try {
      const content = saved ? localStorage.getItem(STORAGE_KEY) || JSON.stringify(state, null, 2) : JSON.stringify(state, null, 2);
      const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const link = document.createElement("a"); link.href = url; link.download = saved ? "fieldwork-saved-data.json" : "fieldwork-workspace.json"; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("Workspace export prepared. Keep this file private: it contains your conversations and attachments."); setError("");
    } catch { setError("The browser could not export local data."); }
  };
  return <div className="page workspace-settings"><p className="workspace-breadcrumb">Workspace / Settings</p><div className="collection-heading"><div><h1>Settings</h1><p>Make Fieldwork feel like your workspace.</p></div></div>{notice && <p role="status" className="mb-5 rounded-xl bg-accent p-4 text-sm">{notice}</p>}{error && <p role="alert" className="mb-5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">{error}</p>}
    <form className="preferences-form" onSubmit={e => { e.preventDefault(); update(current => ({ ...current, preferences })); setNotice("Personal settings saved on this browser."); }}>
      <section className="preference-section"><h2>Account</h2><div className="preference-box account-preference"><span className="fieldwork-avatar">{(preferences.name || "You").slice(0, 2).toUpperCase()}</span><label><span className="sr-only">Your name</span><input maxLength={50} value={preferences.name} onChange={e => setPreferences(p => ({ ...p, name: e.target.value }))} placeholder="Your name" /><small>Personal account</small></label><span className="source-kind">Local profile</span></div></section>
      <section className="preference-section"><h2>Appearance</h2><div className="preference-box preference-row"><div><label htmlFor="workspace-theme">Theme</label><p>Choose a look, or match your device.</p></div><select id="workspace-theme" value={preferences.theme} onChange={e => { const theme = e.target.value as Preferences["theme"]; setPreferences(p => ({ ...p, theme })); update(current => ({ ...current, preferences: { ...current.preferences, theme } })); }}><option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option></select></div></section>
      <section className="preference-section"><h2>Personalization</h2><div className="preference-box"><div className="preference-row"><div><label htmlFor="workspace-skill">Default skill</label><p>Choose how to approach your next prompt.</p></div><select id="workspace-skill" value={preferences.skill} onChange={e => setPreferences(p => ({ ...p, skill: e.target.value as Preferences["skill"] }))}>{SKILLS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></div><div className="instructions-preference"><label htmlFor="workspace-instructions">Custom instructions</label><p>What should Fieldwork know about how you work?</p><textarea id="workspace-instructions" maxLength={2000} rows={4} value={preferences.instructions} onChange={e => setPreferences(p => ({ ...p, instructions: e.target.value }))} placeholder="For example, keep explanations practical and include clear next steps." /><p className="instructions-count">{preferences.instructions.length} / 2,000</p></div></div><div className="preference-actions"><Button variant="ghost" disabled={!dirty} onClick={() => setPreferences(state.preferences)}>Discard changes</Button><Button type="submit" disabled={!dirty}>Save preferences</Button></div></section>
      <section className="preference-section"><h2>Workspace</h2><div className="preference-box"><a className="preference-row" href="/integrations/"><div>Connected apps<p>Manage the tools you use with Fieldwork.</p></div><span aria-hidden="true">›</span></a><div className="preference-row"><div><label htmlFor="workspace-model">Default model</label><p>Used by new local conversations.</p></div><select id="workspace-model" value={preferences.model} onChange={e => setPreferences(p => ({ ...p, model: e.target.value as Preferences["model"] }))}>{MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}</select></div><p className="workspace-footnote">Your data stays local. Selected context and instructions are passed to your configured adapter. No cloud account is involved.</p></div><div className="preference-actions"><Button type="submit" disabled={!dirty}>Save defaults</Button></div></section>
    </form>
    <section className="panel mb-6"><h2>Local credit allowance</h2><p className="my-3 text-sm leading-6 text-muted-foreground">{state.credits} credits remaining. Fast uses 1 credit and Focus uses 3 per successful local response. Credits are a demonstration counter, not money.</p><Button variant="outline" onClick={() => setConfirm("credits")}>Reset local credits</Button></section>
    <section className="panel mb-6"><h2>Workspace data</h2><p className="my-3 text-sm leading-6 text-muted-foreground">{state.sessions.length} conversations · {state.projects.length} projects · {state.knowledge.length} knowledge entries. Files and messages use browser storage, which can fill up. Export before clearing browser data. Nothing is synchronized across devices.</p><div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => download(false)}>Export workspace</Button><Button variant="outline" onClick={() => input.current?.click()}>Import workspace</Button><Button variant="ghost" onClick={() => download(true)}>Export saved data for recovery</Button></div><input ref={input} type="file" className="sr-only" aria-label="Import workspace JSON" accept="application/json,.json" onChange={async e => { const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; try { if (file.size > 10 * 1024 * 1024) throw new Error("Choose an export smaller than 10 MB."); setIncoming(decodeWorkspace(await file.text())); setConfirm("import"); setError(""); } catch (err) { setError(err instanceof Error ? err.message : "This workspace file could not be read."); } }} /></section>
    <section className="panel border-destructive/30"><h2>Clear this workspace</h2><p className="my-3 text-sm leading-6 text-muted-foreground">Permanently remove conversations, projects, knowledge, connections, and settings from this browser. Export a backup first.</p><Button variant="outline" className="text-destructive" onClick={() => setConfirm("reset")}>Clear local workspace</Button></section>
    <MorphingModal viewId={confirm} onClose={() => { setConfirm(null); setIncoming(null); }} placement="center" ariaLabel={confirm === "reset" ? "Clear local workspace" : confirm === "credits" ? "Reset local credits" : "Import workspace"}><div className="grid gap-5"><h2 className="text-lg font-semibold">{confirm === "reset" ? "Clear everything on this browser?" : confirm === "credits" ? "Reset the demo allowance?" : "Replace this workspace?"}</h2><p className="text-sm leading-6 text-muted-foreground">{confirm === "reset" ? "This cannot be undone without an exported backup. No external accounts are affected." : confirm === "credits" ? "Your allowance returns to 100 local credits. No purchase, billing, or external request is involved." : `The imported workspace has ${incoming?.sessions.length || 0} conversations and ${incoming?.knowledge.length || 0} knowledge entries. It replaces all current workspace data. Export your current workspace first if you want to keep it.`}</p><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => { setConfirm(null); setIncoming(null); }}>Cancel</Button><Button onClick={() => { if (confirm === "reset") { reset(); setNotice("Local workspace cleared."); } else if (confirm === "credits") { update(current => ({ ...current, credits: 100 })); setNotice("Local credit allowance reset to 100."); } else if (incoming) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(incoming)); window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY, newValue: JSON.stringify(incoming) })); setNotice("Workspace imported and saved."); } catch { setError("The imported workspace did not fit in local storage. Your current data was not replaced."); } } setIncoming(null); setConfirm(null); }}>{confirm === "reset" ? "Clear workspace" : confirm === "credits" ? "Reset to 100 credits" : "Replace workspace"}</Button></div></div></MorphingModal>
  </div>;
}
const usage = `"use client";
import { WorkspaceProvider } from "@/features/workspace/store";
import { ChatWorkspace } from "@/features/workspace/chat";
import type { AssistantAdapter } from "@/features/workspace/domain";

// Replace localAssistant through the explicit adapter boundary.
const assistant: AssistantAdapter = {
  label: "Your service",
  async respond(request) {
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: request.signal,
      body: JSON.stringify({
        prompt: request.prompt, model: request.model, skill: request.skill,
        knowledge: request.knowledge, instructions: request.instructions,
        attachments: request.attachments,
      }),
    });
    if (!response.ok) throw new Error("Assistant request failed.");
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("text" in data) || typeof data.text !== "string") {
      throw new Error("Invalid assistant response.");
    }
    return data.text;
  },
};

export function ConnectedWorkspace() {
  return <WorkspaceProvider adapter={assistant}><ChatWorkspace /></WorkspaceProvider>;
}`;
export function HelpScreen() {
  const [notice, setNotice] = useState("");
  return <div className="page"><p className="eyebrow mb-2">A guide to your workspace</p><h1>A little help along the way</h1><p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">Fieldwork is an original, browser-local AI workspace demonstration. The complete frontend works without an account or API key.</p><div className="my-8 grid gap-4 sm:grid-cols-2"><article className="panel"><h2>Start a conversation</h2><p className="my-3 text-sm leading-6 text-muted-foreground">Choose a model and skill, add a prompt, and press Enter. Shift + Enter adds a new line. A session URL is created when you send the first message.</p><a href="/chat/" className="text-sm underline">Open the conversation workspace</a></article><article className="panel"><h2>Bring your context</h2><p className="my-3 text-sm leading-6 text-muted-foreground">Create notes or reference links in Knowledge. Select them using Context below the composer. Local attachments can be previewed before sending.</p><a href="/knowledge/" className="text-sm underline">Manage knowledge</a></article></div><section className="panel mb-6"><h2 className="mb-4">Keyboard shortcuts</h2><dl className="grid grid-cols-[1fr_auto] gap-4 text-sm"><dt>Open command palette</dt><dd><kbd>⌘ / Ctrl + K</kbd></dd><dt>Toggle navigation</dt><dd><kbd>⌘ / Ctrl + B</kbd></dd><dt>Move through commands</dt><dd><kbd>↑ / ↓</kbd></dd><dt>Run selected command</dt><dd><kbd>Enter</kbd></dd><dt>Dismiss a dialog</dt><dd><kbd>Escape</kbd></dd><dt>New line in composer</dt><dd><kbd>Shift + Enter</kbd></dd></dl></section><section className="panel mb-6"><h2 className="mb-3">Common questions</h2>{[{ title: "Is this connected to a real model?", text: "No. The default adapter composes deterministic local responses from your prompt and selected references. Fast and Focus demonstrate a model choice and different local credit costs. They do not call an AI provider. The source exposes an injectable AssistantAdapter for your own service." }, { title: "Why does my session URL not work on another device?", text: "Sessions are saved in this browser's local storage. A session URL identifies a local record, not a server resource. Export the workspace in Settings and import it into your other browser to transfer it." }, { title: "What happens to files and reference links?", text: "Up to three supported files of 1 MB each can be attached. Sent files are persisted with your message; unsent files are discarded when you leave the conversation. Images and text have inline previews. PDFs can be saved for browser inspection. Links are references only; no remote page is read. Binary files are not analyzed by the local controller." }, { title: "Can I recover an archived conversation?", text: "Yes. Open Archive and choose Restore, then confirm. Its session URL and complete history stay the same. Deleting a project leaves every conversation intact." }, { title: "What should I do if local storage is full?", text: "Export your in-memory workspace immediately from Settings. You can then clear local data or import a smaller backup. Browser quotas vary; large attachments can consume the available storage. A visible error appears when persistence fails." }, { title: "Do integration connections access my accounts?", text: "No. Connecting a demonstration adds an explicitly labeled editable sample note to Knowledge. Disconnecting removes the local connection state but preserves the note. No credentials, OAuth, account access, or network requests are used." }].map(faq => <details key={faq.title} className="border-t border-border py-4"><summary className="text-sm font-medium">{faq.title}</summary><p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.text}</p></details>)}</section><section className="panel"><div className="flex flex-wrap items-center justify-between gap-3"><h2>Connect your own assistant</h2><Button variant="outline" size="sm" onClick={async () => { try { await navigator.clipboard.writeText(usage); setNotice("Adapter usage copied."); } catch { setNotice("Clipboard unavailable. Select and copy the source below."); } }}>Copy usage</Button></div><p className="my-4 text-sm leading-6 text-muted-foreground">This copyable example is an integration contract, not a bundled endpoint. Your host must implement POST /api/assistant returning a JSON object with a text string, handle credentials server-side, and explicitly choose what local data may leave the browser. Static deployment requires a separate service.</p>{notice && <p role="status" className="mb-3 text-sm text-primary">{notice}</p>}<pre className="max-h-[36rem] overflow-auto rounded-xl bg-muted p-4 text-xs leading-6"><code>{usage}</code></pre></section></div>;
}
