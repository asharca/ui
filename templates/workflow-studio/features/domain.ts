import type { Node } from "@xyflow/react";

export type StepKind = "input" | "transform" | "condition" | "knowledge" | "agent" | "connection" | "output";
export type StepData = { label: string; kind: StepKind; value: string; operation: "uppercase" | "lowercase" | "trim" | "prefix"; [key: string]: unknown };
export type Step = Node<StepData, "studio">;
export type Wire = { id: string; source: string; target: string; sourceHandle?: string | null; targetHandle?: string | null };
export type Workflow = { id: string; name: string; description: string; nodes: Step[]; edges: Wire[]; updatedAt: string; status?: "live" | "draft" | "paused" };
export type DocumentRecord = { id: string; name: string; tags: string[]; chunks: string[]; source: "upload" | "connector" | "manual" };
export type KnowledgeBase = { id: string; name: string; chunkSize: number; overlap: number; documents: DocumentRecord[] };
export type Agent = { id: string; name: string; persona: string; model: "local-extractive" | "local-brief"; instructions: string; tools: string[]; knowledgeIds: string[]; blockedWords: string[]; status?: "live" | "draft" };
export type ToolStep = { name: string; input: string; output: string };
export type Message = { id: string; role: "user" | "assistant"; content: string; steps?: ToolStep[] };
export type Session = { id: string; agentId: string; title: string; messages: Message[] };
export type Connection = { id: string; name: string; authorized: boolean; scope: string; syncedAt?: string };
export type TraceStep = { id: string; name: string; kind: StepKind; status: "success" | "error" | "skipped"; input: string; output: string; error?: string; start: number; duration: number; tokens: number };
export type Run = { id: string; workflowId: string; name: string; createdAt: string; status: "success" | "error"; input: string; output: string; steps: TraceStep[]; duration: number };
export type Settings = { theme: "system" | "light" | "dark"; name: string; email: string; workspace: string; notifications: { runs: boolean; errors: boolean; digest: boolean }; members: { id: string; email: string; role: "owner" | "editor" | "viewer" }[]; keys: { id: string; name: string; value: string }[]; plan: "local-free" | "local-team" };
export type StudioState = { version: 1; workflows: Workflow[]; agents: Agent[]; sessions: Session[]; bases: KnowledgeBase[]; connections: Connection[]; runs: Run[]; settings: Settings };
export const uid = (prefix = "item") => `${prefix}-${globalThis.crypto.randomUUID()}`;
export const STEP_LABELS: Record<StepKind, string> = { input: "Input", transform: "Transform text", condition: "Require text", knowledge: "Search knowledge", agent: "Local agent", connection: "Connector read", output: "Output" };
export function createStep(kind: StepKind, index = 0): Step { return { id: uid("step"), type: "studio", position: { x: 80 + index * 270, y: 140 }, data: { kind, label: STEP_LABELS[kind], value: kind === "condition" ? "hello" : "", operation: "uppercase" } }; }
export function createWorkflow(name: string): Workflow { const input = createStep("input"), output = createStep("output", 1); return { id: uid("flow"), name, description: "A local automation", nodes: [input, output], edges: [{ id: uid("edge"), source: input.id, target: output.id }], updatedAt: new Date().toISOString() }; }
export function initialState(): StudioState {
 const workflow: Workflow = { id: "flow-welcome", name: "Welcome message", description: "Turn a simple message into something a little louder.", status:"live", updatedAt: "2026-11-04T00:00:00.000Z", nodes: [{ id: "step-input", type: "studio", position: { x: 80, y: 140 }, data: { kind: "input", label: "Input", value: "", operation: "uppercase" } }, { id: "step-transform", type: "studio", position: { x: 350, y: 140 }, data: { kind: "transform", label: "Transform text", value: "", operation: "uppercase" } }, { id: "step-output", type: "studio", position: { x: 620, y: 140 }, data: { kind: "output", label: "Output", value: "", operation: "uppercase" } }], edges: [{ id: "welcome-a", source: "step-input", target: "step-transform" }, { id: "welcome-b", source: "step-transform", target: "step-output" }] };
 const recipes: { id:string; name:string; description:string; status:NonNullable<Workflow["status"]>; steps:{kind:StepKind;label:string;value?:string;operation?:StepData["operation"]}[] }[] = [
  {id:"flow-cedar-support",name:"Cedar support routing",description:"Clean a support request, enforce a keyword, and look up a documented reply.",status:"live",steps:[{kind:"input",label:"Support request"},{kind:"transform",label:"Clean request",operation:"trim"},{kind:"condition",label:"Require support topic",value:"support"},{kind:"agent",label:"Workspace guide",value:"agent-guide"},{kind:"output",label:"Documented reply"}]},
  {id:"flow-atlas-handbook",name:"Atlas handbook answers",description:"Search the team handbook and pass matching context to a citation-first guide.",status:"draft",steps:[{kind:"input",label:"Team question"},{kind:"knowledge",label:"Search handbook",value:"base-handbook"},{kind:"agent",label:"Find cited answers",value:"agent-guide"},{kind:"output",label:"Answer and citations"}]},
  {id:"flow-meadow-outline",name:"Meadow project outline",description:"Find project planning notes and add a clear heading to the local brief.",status:"live",steps:[{kind:"input",label:"Planning question"},{kind:"agent",label:"Planning assistant",value:"agent-planner"},{kind:"transform",label:"Add brief heading",operation:"prefix",value:"Project outline\n\n"},{kind:"output",label:"Planning brief"}]},
  {id:"flow-juniper-digest",name:"Juniper release digest",description:"Read authorized local sample documents and find related release notes.",status:"live",steps:[{kind:"input",label:"Review request"},{kind:"connection",label:"Read local document drive",value:"drive"},{kind:"agent",label:"Release editor",value:"agent-editor"},{kind:"output",label:"Release digest"}]},
  {id:"flow-harbor-review",name:"Harbor weekly review",description:"Search fictional project notes and prepare a locally cited weekly review.",status:"paused",steps:[{kind:"input",label:"Weekly review topic"},{kind:"knowledge",label:"Search project notes",value:"base-projects"},{kind:"agent",label:"Research assistant",value:"agent-research"},{kind:"transform",label:"Add review heading",operation:"prefix",value:"Weekly review\n\n"},{kind:"output",label:"Review notes"}]},
 ];
 const workflows: Workflow[] = [workflow,...recipes.map(recipe=>{
  const nodes: Step[] = recipe.steps.map((step,index)=>({id:`${recipe.id}-step-${index}`,type:"studio",position:{x:80+index*270,y:140},data:{kind:step.kind,label:step.label,value:step.value??"",operation:step.operation??"uppercase"}}));
  const edges: Wire[] = nodes.slice(1).map((node,index)=>({id:`${recipe.id}-edge-${index}`,source:nodes[index].id,target:node.id}));
  return {id:recipe.id,name:recipe.name,description:recipe.description,status:recipe.status,updatedAt:"2026-11-04T00:00:00.000Z",nodes,edges};
 })];
 const agents: Agent[] = [
  {id:"agent-guide",name:"Workspace guide",persona:"A concise, helpful research assistant",model:"local-extractive",instructions:"Answer using relevant knowledge and cite the document name.",tools:["knowledge-search","word-count"],knowledgeIds:["base-handbook"],blockedWords:["password","secret"],status:"live"},
  {id:"agent-editor",name:"Juniper release editor",persona:"A careful editor for the fictional Juniper product team",model:"local-brief",instructions:"Find release notes and keep the brief focused on documented changes.",tools:["knowledge-search","word-count"],knowledgeIds:["base-releases","base-handbook"],blockedWords:["secret"],status:"live"},
  {id:"agent-research",name:"Atlas project researcher",persona:"An evidence-first researcher for fictional project notes",model:"local-extractive",instructions:"Return matching project references with document citations.",tools:["knowledge-search"],knowledgeIds:["base-projects"],blockedWords:["password"],status:"live"},
  {id:"agent-planner",name:"Meadow planning assistant",persona:"A concise planning companion for the fictional Meadow launch",model:"local-brief",instructions:"Use saved project notes to identify the next planning decision.",tools:["knowledge-search","word-count"],knowledgeIds:["base-projects"],blockedWords:["password","secret"],status:"draft"},
 ];
 const bases: KnowledgeBase[] = [
  {id:"base-handbook",name:"Team handbook",chunkSize:500,overlap:50,documents:[{id:"doc-welcome",name:"Getting started.txt",tags:["guide"],source:"manual",chunks:["Workflow Studio runs entirely in your browser. Create workflows by connecting input, transform, knowledge, agent, and output steps. Your workspace is saved on this device.","Knowledge search ranks local text chunks by shared words. Connections use explicitly local sample documents. No external authorization or AI service is contacted.","Support requests should describe the problem, the expected outcome, and a reproducible example. Keep authentication credentials and private keys out of support requests. Review an answer against the team handbook before sharing it."]}]},
  {id:"base-projects",name:"Meadow project notes",chunkSize:500,overlap:50,documents:[{id:"doc-meadow-plan",name:"Meadow launch plan.txt",tags:["planning","demo"],source:"manual",chunks:["Fictional demo project: Meadow is preparing a small team planning app. The launch plan includes a clear product introduction, an accessible task list, and a short onboarding flow. Validate the scope with three research conversations before release.","The weekly review checks the Meadow launch brief, unresolved support questions, and the next research decision. A project owner records evidence and assigns one concrete next step for each open question."]}]},
  {id:"base-releases",name:"Juniper release notes",chunkSize:500,overlap:50,documents:[{id:"doc-juniper-notes",name:"Juniper release notes.txt",tags:["release","demo"],source:"manual",chunks:["Fictional demo release: Juniper added keyboard navigation for project lists and a clearer empty state for new workspaces. The team publishes release notes every Friday and reviews workflow runs each morning.","The Juniper release review checks the local sample document, verifies the named changes, and records any unresolved accessibility issue before the notes are shared."]}]},
 ];
 return {version:1,workflows,agents,sessions:[],bases,connections:[{id:"drive",name:"Document drive",authorized:false,scope:"Read local sample documents"},{id:"notes",name:"Team notes",authorized:false,scope:"Read local sample notes"}],runs:[],settings:{theme:"system",name:"Alex Morgan",email:"alex@example.test",workspace:"Personal workspace",notifications:{runs:true,errors:true,digest:false},members:[{id:"owner",email:"alex@example.test",role:"owner"}],keys:[],plan:"local-free"}};
}
export function chunkText(text: string, size: number, overlap: number): string[] { if (size < 32 || size > 10000 || overlap < 0 || overlap >= size) throw new Error("Chunk size must be 32–10000 and overlap must be smaller than chunk size."); const chunks: string[] = []; for (let offset = 0; offset < text.length; offset += size - overlap) { chunks.push(text.slice(offset, offset + size)); if (offset + size >= text.length) break; } return chunks; }
export function searchKnowledge(bases: KnowledgeBase[], query: string) { const terms = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []; return bases.flatMap(base => base.documents.flatMap(doc => doc.chunks.map((text, index) => ({ base: base.name, document: doc.name, index, text, score: terms.reduce((score, word) => score + (text.toLowerCase().includes(word) ? 1 : 0), 0) })))).filter(result => result.score > 0).sort((a, b) => b.score - a.score).slice(0, 6); }
export interface StudioAdapter { reply(agent: Agent, messages: Message[], bases: KnowledgeBase[]): Promise<{ content: string; steps: ToolStep[] }>; readConnection(connection: Connection): Promise<string>; }
export const localAdapter: StudioAdapter = {
 async reply(agent, messages, bases) {
  const query = messages.at(-1)?.content ?? ""; const blocked = agent.blockedWords.find(word => word.trim() && query.toLowerCase().includes(word.toLowerCase()));
  if (blocked) return { content: `Local guardrail: requests containing “${blocked}” are blocked.`, steps: [{ name: "Guardrail", input: query, output: "Blocked" }] };
  const steps: ToolStep[] = [{ name: "Local configuration", input: agent.persona, output: agent.instructions }];
  let answer = "";
  if (agent.tools.includes("knowledge-search")) { const hits = searchKnowledge(bases.filter(base => agent.knowledgeIds.includes(base.id)), query); steps.push({ name: "Knowledge search", input: query, output: JSON.stringify(hits, null, 2) }); answer = hits.map(hit => `${hit.text} [${hit.document}, chunk ${hit.index + 1}]`).join("\n\n"); }
  if (agent.tools.includes("word-count")) steps.push({ name: "Word count", input: query, output: `${query.trim().split(/\s+/).filter(Boolean).length} words` });
  if (!answer) answer = `Local demo response: no matching knowledge was found for “${query}”. Add a document or enable knowledge search. This is a deterministic local controller, not an AI model.`;
  if (agent.model === "local-brief") answer = answer.slice(0, 280);
  return { content: answer, steps };
 },
 async readConnection(connection) { if (!connection.authorized) throw new Error(`Authorize ${connection.name} in Connections first.`); return `${connection.name}: Local sample document. The team publishes release notes every Friday and reviews workflow runs each morning.`; }
};
export async function executeWorkflow(workflow: Workflow, input: string, state: StudioState, adapter: StudioAdapter = localAdapter): Promise<Run> {
 const start = performance.now(); const steps: TraceStep[] = []; const outputs = new Map<string, string>(); const pending = new Set(workflow.nodes.map(node => node.id)); let failed = false;
 if (!workflow.nodes.some(node => node.data.kind === "input") || !workflow.nodes.some(node => node.data.kind === "output")) throw new Error("A workflow needs an Input and Output step.");
 if (workflow.edges.some(edge => !pending.has(edge.source) || !pending.has(edge.target))) throw new Error("A connection points to a missing step.");
 while (pending.size) {
  const ready = workflow.nodes.filter(node => pending.has(node.id) && workflow.edges.filter(edge => edge.target === node.id).every(edge => outputs.has(edge.source)));
  if (!ready.length) { for (const node of workflow.nodes.filter(node => pending.has(node.id))) steps.push({ id: node.id, name: node.data.label, kind: node.data.kind, status: "error", input: "", output: "", error: "Cycle or upstream failure: this step could not execute.", start: performance.now() - start, duration: 0, tokens: 0 }); failed = true; break; }
  for (const node of ready) {
   pending.delete(node.id); const tick = performance.now(); const incoming = workflow.edges.filter(edge => edge.target === node.id); const stepInput = incoming.length ? incoming.map(edge => outputs.get(edge.source) ?? "").join("\n") : input; let output = ""; let error: string | undefined;
   try { switch (node.data.kind) {
    case "input": output = input; break;
    case "transform": output = node.data.operation === "uppercase" ? stepInput.toUpperCase() : node.data.operation === "lowercase" ? stepInput.toLowerCase() : node.data.operation === "trim" ? stepInput.trim() : node.data.value + stepInput; break;
    case "condition": if (!stepInput.toLowerCase().includes(node.data.value.toLowerCase())) throw new Error(`Input must contain “${node.data.value}”.`); output = stepInput; break;
    case "knowledge": if (node.data.value && !state.bases.some(base => base.id === node.data.value)) throw new Error("The selected knowledge base no longer exists. Choose another in the inspector."); output = JSON.stringify(searchKnowledge(state.bases.filter(base => !node.data.value || base.id === node.data.value), stepInput), null, 2); break;
    case "agent": { const agent = state.agents.find(item => item.id === node.data.value); if (!agent) throw new Error("Choose an existing agent in the step inspector."); output = (await adapter.reply(agent, [{ id: "run", role: "user", content: stepInput }], state.bases)).content; break; }
    case "connection": { const connection = state.connections.find(item => item.id === node.data.value); if (!connection) throw new Error("Choose a connection in the step inspector."); output = await adapter.readConnection(connection); break; }
    case "output": output = stepInput; break;
   } outputs.set(node.id, output); } catch (cause) { error = cause instanceof Error ? cause.message : String(cause); failed = true; }
   steps.push({ id: node.id, name: node.data.label, kind: node.data.kind, status: error ? "error" : "success", input: stepInput, output, error, start: tick - start, duration: performance.now() - tick, tokens: Math.ceil((stepInput.length + output.length) / 4) });
  }
 }
 return { id: uid("run"), workflowId: workflow.id, name: workflow.name, createdAt: new Date().toISOString(), status: failed ? "error" : "success", input, output: workflow.nodes.filter(node => node.data.kind === "output").map(node => outputs.get(node.id) ?? "").join("\n"), steps, duration: performance.now() - start };
}
