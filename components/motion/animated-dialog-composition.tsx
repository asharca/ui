"use client";

import { X } from "lucide-react";
import { type ReactNode, useCallback, useId, useState } from "react";
import { MorphingModal } from "@/components/motion/morphing-modal";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

export interface AnimatedDialogProps {
  title: string;
  description: string;
  children: ReactNode;
  triggerLabel: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A non-morphing trigger composed with the existing nested-safe modal. */
export function AnimatedDialog({ title, description, children, triggerLabel, open: controlled, defaultOpen = false, onOpenChange, className }: AnimatedDialogProps) {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlled ?? internal;
  const id = useId();
  const change = (next: boolean) => {
    if (controlled === undefined) setInternal(next);
    onOpenChange?.(next);
  };
  // MorphingModal already owns portal, presence, title discovery and nested traps.
  // Associate this composition's description without changing its public API.
  const associateDescription = useCallback((node: HTMLDivElement | null) => {
    const dialog = node?.closest('[role="dialog"]');
    dialog?.setAttribute("aria-labelledby", `${id}-title`);
    dialog?.setAttribute("aria-describedby", `${id}-description`);
  }, [id]);
  return <>
    <Button onClick={() => change(true)} aria-haspopup="dialog" aria-expanded={open} className="h-9 rounded-full px-5 text-sm">{triggerLabel}</Button>
    <MorphingModal viewId={open ? id : null} placement="center" onClose={() => change(false)} backdropClassName="bg-foreground/10 [backdrop-filter:blur(24px)] [-webkit-backdrop-filter:blur(24px)]" className={cn("max-w-lg rounded-2xl shadow-none [&>div]:p-0", className)}>
      <div ref={associateDescription} className="relative">
        <header className="border-b border-border p-4 pr-[4.75rem]"><h2 id={`${id}-title`} className="text-xl font-medium">{title}</h2><p id={`${id}-description`} className="mt-1 text-sm text-muted-foreground">{description}</p></header>
        {children}
        <button type="button" onClick={() => change(false)} aria-label="Close dialog" className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-primary/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><X aria-hidden className="size-4" /></button>
      </div>
    </MorphingModal>
  </>;
}
