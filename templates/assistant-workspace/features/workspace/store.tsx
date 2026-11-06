"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { decodeWorkspace, emptyWorkspace, localAssistant, STORAGE_KEY, type AssistantAdapter, type WorkspaceState } from "./domain";
export type WorkspaceContextValue = { state: WorkspaceState; ready: boolean; error: string; update: (change: (state: WorkspaceState) => WorkspaceState) => void; reset: () => void; dismissError: () => void; adapter: AssistantAdapter };
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
export function WorkspaceProvider({ children, adapter = localAssistant }: { children: ReactNode; adapter?: AssistantAdapter }) {
  const [state, setState] = useState<WorkspaceState>(emptyWorkspace);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const ref = useRef(state);
  const blocked = useRef(false);
  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) { ref.current = decodeWorkspace(saved); setState(ref.current); } }
    catch (e) { blocked.current = true; setError(e instanceof Error ? e.message : "Local storage is unavailable."); }
    setReady(true);
    const changed = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      try { ref.current = event.newValue ? decodeWorkspace(event.newValue) : emptyWorkspace(); blocked.current = false; setState(ref.current); }
      catch { setError("Another tab saved unreadable workspace data. Your current view is unchanged."); }
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, []);
  const update = useCallback((change: (current: WorkspaceState) => WorkspaceState) => {
    if (blocked.current) { setError("Saved data could not be loaded. Open Settings to export or reset it before making changes."); return; }
    const next = change(ref.current);
    ref.current = next;
    setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { setError("Your changes are in memory only: local storage is full or unavailable. Export your workspace in Settings before closing this tab, or remove large attachments."); }
  }, []);
  const reset = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); blocked.current = false; ref.current = emptyWorkspace(); setState(ref.current); setError(""); }
    catch { setError("The browser did not allow clearing local storage."); }
  }, []);
  useEffect(() => {
    if (!ready) return;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => { const dark = state.preferences.theme === "dark" || (state.preferences.theme === "system" && query.matches); document.documentElement.classList.toggle("dark", dark); document.documentElement.style.colorScheme = dark ? "dark" : "light"; };
    apply(); query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [ready, state.preferences.theme]);
  return <WorkspaceContext.Provider value={{ state, ready, error, update, reset, dismissError: () => setError(""), adapter }}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() { const value = useContext(WorkspaceContext); if (!value) throw new Error("WorkspaceProvider is required."); return value; }
