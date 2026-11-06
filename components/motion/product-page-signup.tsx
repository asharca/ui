"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Host resolves only after the subscription has actually been recorded. */
export interface ProductPageSignupProps {
  onSubscribe: (email: string) => Promise<void>;
  label?: string;
  buttonLabel?: string;
  successMessage?: string;
  idleMessage?: string;
  className?: string;
  stackedOnMobile?: boolean;
}

export function ProductPageSignup({ onSubscribe, label = "Email address", buttonLabel = "Keep me updated", successMessage = "Subscription recorded.", idleMessage = "No spam. We’ll only email when access is ready.", className, stackedOnMobile = false }: ProductPageSignupProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const pending = useRef(false);
  return <form noValidate className={cn(stackedOnMobile ? "space-y-2 text-left" : "space-y-3 text-left", className)} onSubmit={async (event) => {
    event.preventDefault();
    if (pending.current) return;
    const address = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError("Enter a valid email address."); setState("error"); return;
    }
    pending.current = true; setState("pending"); setError("");
    try { await onSubscribe(address); setState("success"); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "We couldn't subscribe you. Please try again."); setState("error"); }
    finally { pending.current = false; }
  }}>
    <label className="sr-only" htmlFor={id}>{label}</label>
    <div className={cn("flex gap-2", stackedOnMobile && "flex-col sm:flex-row")}>
      <input id={id} name="email" type="email" autoComplete="email" required value={email} disabled={state === "pending"} aria-invalid={state === "error"} aria-describedby={`${id}-message`} onChange={(event) => { setEmail(event.target.value); if (state !== "pending") setState("idle"); }} className="h-10 min-w-0 flex-1 rounded-full border border-border bg-background px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Your email address" />
      <button type="submit" disabled={state === "pending" || state === "success"} className="h-10 shrink-0 cursor-pointer rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60">{state === "pending" ? "Submitting…" : state === "success" ? "Subscribed" : buttonLabel}</button>
    </div>
    <p id={`${id}-message`} role={state === "error" ? "alert" : "status"} className={cn(stackedOnMobile ? "min-h-5 text-left text-xs" : "min-h-4 text-center text-xs", state === "error" ? "text-destructive" : "text-muted-foreground")}>{state === "success" ? successMessage : state === "error" ? error : idleMessage}</p>
  </form>;
}
