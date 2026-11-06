"use client";

import { useEffect, useRef, useState } from "react";

export interface LifecycleActionController {
  run: (key: string, action: () => void | Promise<void>) => Promise<void>;
  pending: Set<string>;
  errors: Record<string, string>;
}

/** Per-operation lock: synchronous clicks cannot submit an operation twice. */
export function useLifecycleAction() {
  const locks = useRef(new Set<string>());
  const mounted = useRef(true);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function run(key: string, action: () => void | Promise<void>) {
    if (locks.current.has(key)) return;
    locks.current.add(key);
    setPending(new Set(locks.current));
    setErrors((current) => ({ ...current, [key]: "" }));
    try { await action(); }
    catch (error) { if (mounted.current) setErrors((current) => ({ ...current, [key]: error instanceof Error ? error.message : "The operation failed. Try again." })); }
    finally { locks.current.delete(key); if (mounted.current) setPending(new Set(locks.current)); }
  }
  return { run, pending, errors };
}

export const lifecycleActionClass = "inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40";
export const lifecycleInputClass = "min-w-0 rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:ring-2 focus-visible:ring-ring";
