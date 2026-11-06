"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/motion/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { CenterMorphModal, CenterMorphModalContent } from "@/components/motion/center-morph-modal";
import { cn } from "@/lib/utils";

/** Shared domain presentation; all amounts, snapshots and side effects belong to the host. */
export const commerceInput = "min-w-0 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring";
export function CommercePanel({ title, subtitle, children, className }: { title: string; subtitle?: string; children: ReactNode; className?: string }) {
  return <section aria-label={title} className={cn("w-full space-y-6 bg-background p-5 text-foreground sm:p-6", className)}><header><h2 className="text-xl font-medium tracking-tight">{title}</h2>{subtitle && <p className="mt-2 text-sm leading-6 text-muted-foreground">{subtitle}</p>}</header>{children}</section>;
}
/** Prevents duplicate submissions, reports real host errors, never manufactures success. */
export function CommerceAction({ action, children, disabled = false, className, variant = "primary" }: { action?: () => void | Promise<void>; children: ReactNode; disabled?: boolean; className?: string; variant?: "primary" | "outline" | "ghost" }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  return <div className={cn("space-y-2", className)}><Button className="h-9 w-full rounded-full" variant={variant} disabled={disabled || pending || !action} aria-busy={pending || undefined} onClick={async () => {
    if (!action || locked.current) return;
    locked.current = true; setPending(true); setError("");
    try { await action(); } catch (cause) { setError(cause instanceof Error ? cause.message : "The request could not be completed."); }
    finally { locked.current = false; setPending(false); }
  }}>{pending ? "Awaiting confirmation…" : children}</Button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}
export function CommerceChoices({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (value: string) => void }) {
  return <Tabs value={value} onValueChange={onChange} className="min-w-0"><TabsList aria-label={label} className="max-w-full bg-muted [&_[data-tabs-label]]:text-foreground">{options.map(option => <TabsTrigger key={option} value={option} indicatorClassName="bg-background" className="h-9 rounded-full px-3.5 text-sm">{option}</TabsTrigger>)}</TabsList></Tabs>;
}
/** The existing dialog restores its own Trigger; table-launched dialogs instead restore their actual opener. */
export function CommerceDialog({ open, onOpenChange, label, children, returnFocus }: { open: boolean; onOpenChange: (open: boolean) => void; label: string; children: ReactNode; returnFocus?: HTMLElement | null }) {
  const opener = useRef<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (!open) return;
    opener.current = returnFocus ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    return () => {
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
  }, [open, returnFocus]);
  return <CenterMorphModal open={open} onOpenChange={onOpenChange}><CenterMorphModalContent ariaLabel={label}>{children}</CenterMorphModalContent></CenterMorphModal>;
}
export const money = (value: number, currency = "USD", precision = 2) => new Intl.NumberFormat("en", { style: "currency", currency, minimumFractionDigits: Math.min(2, precision), maximumFractionDigits: precision }).format(value);
export const decimal = (value: number, precision = 4) => new Intl.NumberFormat("en", { maximumFractionDigits: precision }).format(value);

/** Compact history without invented samples; gaps split the visible trace. */
export function CommerceSparkline({ values, label, className, color = "currentColor" }: { values: readonly (number | null)[]; label: string; className?: string; color?: string }) {
  const finite = values.filter((value): value is number => value != null && Number.isFinite(value));
  const min = Math.min(...finite); const range = Math.max(...finite) - min || 1;
  let drawing = false;
  const path = values.map((value, index) => {
    if (value == null || !Number.isFinite(value)) { drawing = false; return ""; }
    const command = drawing ? "L" : "M"; drawing = true;
    return `${command}${index / Math.max(1, values.length - 1) * 120},${34 - (value - min) / range * 30}`;
  }).join(" ");
  return <svg viewBox="0 0 120 38" role="img" aria-label={label} className={cn("h-9 w-28", className)}><path d={path} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" /></svg>;
}
