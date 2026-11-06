export type Model = "local-fast" | "local-deep";
export type Skill = "outline" | "summarize" | "brainstorm";
export type Attachment = { id: string; name: string; type: string; size: number; data: string };
export type ChatMessage = { id: string; role: "user" | "assistant"; text: string; createdAt: number; model?: Model; skill?: Skill; attachments?: Attachment[]; knowledgeIds?: string[] };
export type Session = { id: string; title: string; projectId: string | null; archived: boolean; createdAt: number; messages: ChatMessage[]; draft: string };
export type Project = { id: string; name: string; description: string };
export type Knowledge = { id: string; title: string; kind: "note" | "link"; content: string };
export type Preferences = { name: string; instructions: string; theme: "light" | "dark" | "system"; model: Model; skill: Skill };
export type WorkspaceState = { version: 1; sessions: Session[]; projects: Project[]; knowledge: Knowledge[]; integrations: string[]; preferences: Preferences; credits: number; newDraft: string };
export const STORAGE_KEY = "fieldwork.workspace.v1";
export const MODELS = [{ value: "local-fast", label: "Fieldwork Fast · 1 credit", cost: 1 }, { value: "local-deep", label: "Fieldwork Focus · 3 credits", cost: 3 }] as const;
export const SKILLS = [{ value: "outline", label: "Build an outline" }, { value: "summarize", label: "Summarize context" }, { value: "brainstorm", label: "Explore ideas" }] as const;
export const INTEGRATIONS = [{ id: "documents", name: "Document library", description: "Simulate a document connection and add an editable sample reference to Knowledge.", title: "Local document connection", text: "This is a browser-local document integration demonstration. Replace this note with your own reference material; nothing was imported from an external account." }, { id: "issues", name: "Issue tracker", description: "Try a local issue-tracker connection with an editable planning reference.", title: "Local issue-tracker connection", text: "Local demonstration issue: define acceptance criteria, identify an owner, and review accessibility before release. No real issues or account data are connected." }, { id: "calendar", name: "Team calendar", description: "Explore a simulated calendar context without accessing a real calendar.", title: "Local calendar connection", text: "Local calendar demonstration: reserve a planning block, an async review, and a retrospective. No calendar events were fetched or created." }];
export function id() { return crypto.randomUUID(); }
export function emptyWorkspace(): WorkspaceState { return { version: 1, sessions: [], projects: [], knowledge: [], integrations: [], preferences: { name: "", instructions: "", theme: "system", model: "local-fast", skill: "outline" }, credits: 100, newDraft: "" }; }
const record = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
const strings = (x: unknown): x is string[] => Array.isArray(x) && x.every(v => typeof v === "string");
const attachment = (x: unknown) => record(x) && typeof x.id === "string" && typeof x.name === "string" && typeof x.type === "string" && typeof x.size === "number" && typeof x.data === "string" && /^data:(image\/(png|jpeg|gif|webp)|text\/plain|application\/pdf);base64,/.test(x.data);
const message = (x: unknown) => record(x) && typeof x.id === "string" && (x.role === "user" || x.role === "assistant") && typeof x.text === "string" && typeof x.createdAt === "number" && (x.attachments === undefined || (Array.isArray(x.attachments) && x.attachments.every(attachment))) && (x.knowledgeIds === undefined || strings(x.knowledgeIds));
export function decodeWorkspace(raw: string): WorkspaceState {
  const x: unknown = JSON.parse(raw);
  const preferences = record(x) && record(x.preferences) ? x.preferences : null;
  if (!record(x) || x.version !== 1 || !Array.isArray(x.sessions) || !x.sessions.every(s => record(s) && typeof s.id === "string" && typeof s.title === "string" && (s.projectId === null || typeof s.projectId === "string") && typeof s.archived === "boolean" && typeof s.createdAt === "number" && typeof s.draft === "string" && Array.isArray(s.messages) && s.messages.every(message)) || !Array.isArray(x.projects) || !x.projects.every(p => record(p) && typeof p.id === "string" && typeof p.name === "string" && typeof p.description === "string") || !Array.isArray(x.knowledge) || !x.knowledge.every(k => record(k) && typeof k.id === "string" && typeof k.title === "string" && (k.kind === "note" || k.kind === "link") && typeof k.content === "string") || !strings(x.integrations) || typeof x.credits !== "number" || !Number.isFinite(x.credits) || x.credits < 0 || x.credits > 100 || typeof x.newDraft !== "string" || !preferences || typeof preferences.name !== "string" || typeof preferences.instructions !== "string" || !["light", "dark", "system"].includes(String(preferences.theme)) || !MODELS.some(m => m.value === preferences.model) || !SKILLS.some(s => s.value === preferences.skill)) throw new Error("Saved workspace format is not supported. Export or reset the saved data in Settings.");
  return x as unknown as WorkspaceState;
}
export type AssistantRequest = { prompt: string; model: Model; skill: Skill; knowledge: Knowledge[]; attachments: Attachment[]; instructions: string; signal: AbortSignal; onChunk?: (chunk: string) => void };
export interface AssistantAdapter { label: string; respond(request: AssistantRequest): Promise<string> }
/** Intentionally local: deterministic text composition, not a hosted AI service. */
export const localAssistant: AssistantAdapter = { label: "Browser-local simulation", async respond({ prompt, model, skill, knowledge, attachments, instructions, signal, onChunk }) {
  signal.throwIfAborted();
  const topic = prompt.trim();
  const refs = knowledge.map(k => `${k.title}: ${k.content}`).join("\n\n");
  const context = refs ? `\n\nSelected reference material (provided locally):\n${refs}` : "\n\nNo knowledge selected. Add references to make this exercise more specific.";
  const fileInfo = attachments.length ? `\n\nAttached locally: ${attachments.map(a => a.name).join(", ")}. This demonstration does not analyze binary file content.` : "";
  const body = skill === "summarize" ? `Local context summary\n\nRequest: ${topic}\n\n${knowledge.length ? knowledge.map(k => `• ${k.title} — ${k.content.slice(0, 500)}`).join("\n") : "There are no selected reference notes to summarize. Select knowledge below the composer or add a note in Knowledge."}\n\nNext step: verify these references against the original material.` : skill === "brainstorm" ? `Three directions to explore\n\nFor “${topic}”:\n\n1. Small experiment — turn the request into one observable outcome and test it with a colleague.\n2. Evidence first — collect one example from your selected context and write down what it changes.\n3. Alternative lens — list an assumption behind the request, then explore the opposite.\n\nChoose one direction and add constraints in your next message.` : `Working outline\n\nTopic: ${topic}\n\n1. Goal — define what a successful result should change.\n2. Context — review the selected knowledge and identify constraints.\n3. Approach — break the work into three concrete decisions.\n4. Review — assign an owner and write measurable acceptance criteria.\n5. Next action — choose the smallest useful step.`;
  const response = `LOCAL DEMONSTRATION · ${model === "local-deep" ? "Focus" : "Fast"}\n\n${body}${skill === "summarize" ? "" : context}${fileInfo}${instructions ? `\n\nYour saved instructions: ${instructions}` : ""}\n\nGenerated by a deterministic local controller; not a real model response.`;
  for (let offset = 0; onChunk && offset < response.length; offset += 32) {
    signal.throwIfAborted();
    const { promise, resolve, reject } = Promise.withResolvers<void>();
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 24);
    signal.addEventListener("abort", abort, { once: true });
    await promise;
    signal.throwIfAborted();
    onChunk(response.slice(offset, offset + 32));
  }
  return response;
} };
export function safeReferenceUrl(content: string) { try { const u = new URL(content); return ["https:", "http:"].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; } }
export async function readAttachment(file: File): Promise<Attachment> {
  const type = file.type || (file.name.endsWith(".txt") ? "text/plain" : "");
  if (!["image/png", "image/jpeg", "image/gif", "image/webp", "text/plain", "application/pdf"].includes(type)) throw new Error("Choose PNG, JPEG, GIF, WebP, plain text, or PDF files.");
  if (file.size > 1024 * 1024) throw new Error("Each local attachment must be 1 MB or smaller.");
  const { promise, resolve, reject } = Promise.withResolvers<string>();
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).replace(/^data:[^;]*;/, `data:${type};`));
  reader.onerror = () => reject(new Error("The file could not be read."));
  reader.readAsDataURL(file);
  const data = await promise;
  return { id: id(), name: file.name, type, size: file.size, data };
}
