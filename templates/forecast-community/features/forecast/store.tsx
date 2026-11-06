"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialState, localForecastService, parseState, STORAGE_KEY, type Command, type ForecastPersistence, type ForecastService, type ForecastState } from "./model";

export type ForecastContextValue = { state: ForecastState; ready: boolean; busy: boolean; error: string; notice: string; run(command: Command, message?: string): Promise<boolean>; reset(): void; dismiss(): void };
const ForecastContext = createContext<ForecastContextValue | null>(null);
const browserPersistence: ForecastPersistence = { load: () => localStorage.getItem(STORAGE_KEY), save: value => localStorage.setItem(STORAGE_KEY, value) };
/** Explicit local demo controller. Replace both service and persistence to integrate a host. */
export function ForecastProvider({ children, service = localForecastService, persistence = browserPersistence }: { children: ReactNode; service?: ForecastService; persistence?: ForecastPersistence }) {
  const [state, setState] = useState<ForecastState>(initialState);
  const current = useRef(state);
  const locked = useRef(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    try { const restored = parseState(persistence.load()); current.current = restored; setState(restored); setReady(true); }
    catch (cause) { setError(`Could not restore local demo data. ${cause instanceof Error ? cause.message : "Storage is unavailable."}`); }
  }, [persistence]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => { document.documentElement.classList.toggle("dark", state.theme === "dark" || (state.theme === "system" && media.matches)); document.documentElement.style.colorScheme = state.theme === "system" ? "light dark" : state.theme; };
    update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update);
  }, [state.theme]);
  const run = useCallback(async (command: Command, message = "Saved to this browser.") => {
    if (!ready || locked.current) return false;
    locked.current = true; setBusy(true); setError(""); setNotice("");
    try {
      const next = await service.execute(current.current, command);
      // Commit storage before UI: failed persistence never looks like a completed trade.
      const serialized = JSON.stringify(next); parseState(serialized); persistence.save(serialized);
      current.current = next; setState(next); setNotice(message); return true;
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save this local action. Please try again."); return false; }
    finally { locked.current = false; setBusy(false); }
  }, [ready, persistence, service]);
  const reset = useCallback(() => {
    if (locked.current) return;
    try { persistence.save(JSON.stringify(initialState)); current.current = initialState; setState(initialState); setReady(true); setError(""); setNotice("Local demo data reset. Your browser starts with 1,000 demo USDC."); }
    catch { setError("Browser storage is unavailable. Allow local storage before using this demo."); }
  }, [persistence]);
  return <ForecastContext.Provider value={{ state, ready, busy, error, notice, run, reset, dismiss: () => { setError(""); setNotice(""); } }}>{children}</ForecastContext.Provider>;
}
export function useForecast() { const value = useContext(ForecastContext); if (!value) throw new Error("ForecastProvider is required."); return value; }
/** Keep rejected actions visible inside modal forms, not only behind their backdrop. */
export function LocalActionError() { const { error } = useForecast(); return error ? <p role="alert" className="inline-error">{error}</p> : null; }
