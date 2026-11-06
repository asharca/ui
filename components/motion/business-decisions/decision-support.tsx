"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CenterMorphModal, CenterMorphModalContent } from "@/components/motion/center-morph-modal";
import { cn } from "@/lib/utils";

/** Domain action state: never mutates host records before a callback resolves. */
export function useDecisionAction() {
  const lock = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(action: () => void | Promise<unknown>, message = "That action failed. Please try again.") {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setError("");
    try { await action(); return true; }
    catch { setError(message); return false; }
    finally { lock.current = false; setBusy(false); }
  }
  return { busy, error, run, clearError: () => setError("") };
}

export function DecisionDialog({ open, onOpenChange, title, children, busy = false, className, showCloseButton = true, closeButtonLabel, backdropClassName, initialFocus, radius, shadow }: {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; children: ReactNode; busy?: boolean; className?: string; showCloseButton?: boolean; closeButtonLabel?: string; backdropClassName?: string; initialFocus?: "first-control" | "panel"; radius?: number; shadow?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => { if (opener?.isConnected) opener.focus({ preventScroll: true }); };
  }, [open]);
  return <CenterMorphModal open={open} onOpenChange={onOpenChange}>
    <CenterMorphModalContent ariaLabel={title} initialFocus={initialFocus} radius={radius} shadow={shadow} dismissible={!busy} showCloseButton={showCloseButton && !busy} closeButtonLabel={closeButtonLabel} backdropClassName={backdropClassName} className={cn("max-h-[85dvh] w-[min(94vw,42rem)] overflow-y-auto p-6", className)}>
      {children}
    </CenterMorphModalContent>
  </CenterMorphModal>;
}

export function DecisionFeedback({ error, busy }: { error?: string; busy?: boolean }) {
  return <div className="text-sm" aria-live="polite" aria-atomic="true">
    {busy && <p role="status" className="text-muted-foreground">Saving…</p>}
    {error && <p role="alert" className="text-destructive">{error}</p>}
  </div>;
}
