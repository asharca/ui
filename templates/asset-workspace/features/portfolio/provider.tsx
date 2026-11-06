"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialState, parseState, STORAGE_KEY, type Command, type PortfolioState } from "./model";
import { localServices, type AssetServices } from "./services";

export type PortfolioContextValue = {
  state: PortfolioState; ready: boolean; busy: boolean; error: string; notice: string;
  perform: (command: Command) => Promise<boolean>;
  signIn: (name: string, email: string) => Promise<boolean>;
  update: (change: (state: PortfolioState) => PortfolioState) => void;
  reset: () => void; exportData: () => void; clearError: () => void; services: AssetServices;
};
const PortfolioContext = createContext<PortfolioContextValue | null>(null);
export function PortfolioProvider({ children, services = localServices }: { children: ReactNode; services?: AssetServices }) {
  const [state, setState] = useState<PortfolioState>(initialState);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [storageBlocked, setStorageBlocked] = useState(false);
  const current = useRef(state);
  const pending = useRef(false);
  current.current = state;
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) { const restored = parseState(saved); current.current = restored; setState(restored); }
    } catch (cause) { setStorageBlocked(true); setError(`${cause instanceof Error ? cause.message : "Storage is unavailable."} Changes will remain in memory. Export before leaving.`); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready || storageBlocked) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { setStorageBlocked(true); setError("Your browser could not save this workspace. Export your JSON to keep a copy."); }
  }, [state, ready, storageBlocked]);
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme = state.theme === "system" ? query.matches ? "dark" : "light" : state.theme;
      document.documentElement.style.colorScheme = state.theme === "system" ? query.matches ? "dark" : "light" : state.theme;
    };
    apply(); query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, [state.theme]);
  useEffect(() => {
    document.documentElement.dataset.compact = String(state.preferences?.compact ?? false);
    document.documentElement.lang = state.preferences?.locale ?? "en-US";
  }, [state.preferences?.compact, state.preferences?.locale]);
  const update = (change: (value: PortfolioState) => PortfolioState) => {
    const next = change(current.current); current.current = next; setState(next);
  };
  const perform = async (command: Command) => {
    if (pending.current) return false;
    pending.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const before = current.current;
      const next = await services.execute(command, before);
      // Preserve concurrent presentation/chat changes while committing portfolio fields atomically.
      update(s => ({ ...s, balances: next.balances, positions: next.positions, wallets: next.wallets, activity: next.activity, watchlist: next.watchlist }));
      setNotice(command.type === "watch" ? "Watchlist updated." : "Local demo workspace updated. No network transaction was sent.");
      return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "The action failed. Your balances have not changed."); return false; }
    finally { pending.current = false; setBusy(false); }
  };
  const signIn = async (name: string, email: string) => {
    if (pending.current) return false;
    pending.current = true; setBusy(true); setError("");
    try { const profile = await services.signIn({ name, email }); update(s => ({ ...s, profile })); return true; }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Demo sign-in failed."); return false; }
    finally { pending.current = false; setBusy(false); }
  };
  const exportData = () => {
    try {
      // Preserve malformed original data too, rather than silently replacing it with defaults.
      let content = JSON.stringify(current.current, null, 2);
      if (storageBlocked) {
        try { content = localStorage.getItem(STORAGE_KEY) ?? content; }
        catch { /* In-memory data remains exportable when storage access is denied. */ }
      }
      const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
      const a = document.createElement("a"); a.href = url; a.download = "asset-workspace.json"; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice("Workspace JSON export created.");
    } catch { setError("Export failed because browser storage or downloads are unavailable."); }
  };
  const reset = () => {
    const fresh = initialState();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); setStorageBlocked(false); setError(""); }
    catch { setError("Reset applied in memory, but browser storage is unavailable."); }
    current.current = fresh; setState(fresh); setNotice("Demo workspace reset. Your addresses, activity, and conversations were removed.");
  };
  return <PortfolioContext.Provider value={{ state, ready, busy, error, notice, perform, signIn, update, reset, exportData, clearError: () => setError(""), services }}>{children}</PortfolioContext.Provider>;
}
export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("Portfolio screens require PortfolioProvider.");
  return context;
}
