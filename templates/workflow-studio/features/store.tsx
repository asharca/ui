"use client";
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { initialState, localAdapter, type StudioAdapter, type StudioState } from "./domain";
export const STORAGE_KEY = "workflow-studio:v1";
export function restoreWorkspace(raw: string): StudioState {
 const value: unknown = JSON.parse(raw);
 const object = (item: unknown): item is Record<string, unknown> => !!item && typeof item === "object" && !Array.isArray(item);
 const text = (item: unknown): item is string => typeof item === "string";
 const strings = (item: unknown): item is string[] => Array.isArray(item) && item.every(text);
 const list = (item: unknown, predicate: (row: Record<string, unknown>) => boolean) => Array.isArray(item) && item.every(row => object(row) && predicate(row));
 const kinds = ["input", "transform", "condition", "knowledge", "agent", "connection", "output"];
 const message = (row: Record<string, unknown>) => text(row.id) && ["user", "assistant"].includes(String(row.role)) && text(row.content) && (row.steps === undefined || list(row.steps, step => text(step.name) && text(step.input) && text(step.output)));
 const trace = (row: Record<string, unknown>) => text(row.id) && text(row.name) && kinds.includes(String(row.kind)) && ["success", "error", "skipped"].includes(String(row.status)) && text(row.input) && text(row.output) && typeof row.duration === "number" && typeof row.start === "number" && typeof row.tokens === "number" && (row.error === undefined || text(row.error));
 if (!object(value) || value.version !== 1) throw new Error("Unsupported workspace file.");
 if (!list(value.workflows, row => text(row.id) && text(row.name) && text(row.description) && text(row.updatedAt) && list(row.nodes, node => text(node.id) && node.type === "studio" && object(node.position) && typeof node.position.x === "number" && typeof node.position.y === "number" && object(node.data) && kinds.includes(String(node.data.kind)) && text(node.data.label) && text(node.data.value) && ["uppercase", "lowercase", "trim", "prefix"].includes(String(node.data.operation))) && list(row.edges, edge => text(edge.id) && text(edge.source) && text(edge.target)))) throw new Error("Invalid workflow data.");
 if (!list(value.agents, row => text(row.id) && text(row.name) && text(row.persona) && text(row.instructions) && ["local-extractive", "local-brief"].includes(String(row.model)) && strings(row.tools) && strings(row.knowledgeIds) && strings(row.blockedWords))) throw new Error("Invalid agent data.");
 if (!list(value.sessions, row => text(row.id) && text(row.agentId) && text(row.title) && list(row.messages, message))) throw new Error("Invalid chat data.");
 if (!list(value.bases, row => text(row.id) && text(row.name) && typeof row.chunkSize === "number" && row.chunkSize >= 32 && row.chunkSize <= 10000 && typeof row.overlap === "number" && row.overlap >= 0 && row.overlap < row.chunkSize && list(row.documents, doc => text(doc.id) && text(doc.name) && strings(doc.tags) && strings(doc.chunks) && ["upload", "connector", "manual"].includes(String(doc.source))))) throw new Error("Invalid knowledge data.");
 if (!list(value.connections, row => text(row.id) && text(row.name) && typeof row.authorized === "boolean" && text(row.scope) && (row.syncedAt === undefined || text(row.syncedAt)))) throw new Error("Invalid connection data.");
 if (!list(value.runs, row => text(row.id) && text(row.workflowId) && text(row.name) && text(row.createdAt) && ["success", "error"].includes(String(row.status)) && text(row.input) && text(row.output) && typeof row.duration === "number" && list(row.steps, trace))) throw new Error("Invalid run data.");
 const settings = value.settings;
 if (!object(settings) || !text(settings.name) || !text(settings.email) || !text(settings.workspace) || !["system", "light", "dark"].includes(String(settings.theme)) || !["local-free", "local-team"].includes(String(settings.plan)) || !object(settings.notifications) || !["runs", "errors", "digest"].every(key => typeof (settings.notifications as Record<string, unknown>)[key] === "boolean") || !list(settings.members, row => text(row.id) && text(row.email) && ["owner", "editor", "viewer"].includes(String(row.role))) || !list(settings.keys, row => text(row.id) && text(row.name) && text(row.value))) throw new Error("Invalid workspace settings.");
 return value as unknown as StudioState;
}
const Context = createContext<{ state: StudioState; setState: Dispatch<SetStateAction<StudioState>>; ready: boolean; error: string; announce: (message: string) => void; adapter: StudioAdapter } | null>(null);
export function StudioProvider({ children, adapter = localAdapter }: { children: React.ReactNode; adapter?: StudioAdapter }) {
 const [state, setState] = useState<StudioState>(initialState); const [ready, setReady] = useState(false); const [error, announce] = useState(""); const persisted = useRef(state);
 useEffect(() => { try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { const restored = restoreWorkspace(saved); persisted.current = restored; setState(restored); } } catch (cause) { announce(`Could not restore saved workspace: ${cause instanceof Error ? cause.message : String(cause)}. The unreadable copy remains in storage until you change workspace data.`); } finally { setReady(true); } }, []);
 useEffect(() => { if (!ready || persisted.current === state) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); persisted.current = state; } catch { announce("Browser storage is unavailable or full. Export your workspace from Settings before leaving."); } }, [state, ready]);
 useEffect(() => { const media = window.matchMedia("(prefers-color-scheme: dark)"); const apply = () => { document.documentElement.classList.toggle("dark", state.settings.theme === "dark" || (state.settings.theme === "system" && media.matches)); }; apply(); media.addEventListener("change", apply); return () => media.removeEventListener("change", apply); }, [state.settings.theme]);
 return <Context.Provider value={{ state, setState, ready, error, announce, adapter }}>{children}</Context.Provider>;
}
export function useStudio() { const value = useContext(Context); if (!value) throw new Error("StudioProvider is required."); return value; }
export function downloadJSON(name: string, value: unknown) { const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" })); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url); }
export async function copyText(value: string, announce: (message: string) => void) { try { await navigator.clipboard.writeText(value); announce("Copied to clipboard."); } catch { announce("Clipboard permission denied. Select the displayed text and copy it manually."); } }
