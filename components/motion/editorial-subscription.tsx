"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

/** Host owns delivery; resolve only after a real subscription has been accepted. */
export interface EditorialSubscriptionProps {
  onSubscribe: (email: string) => Promise<void>;
  title?: string;
  className?: string;
}

export function EditorialSubscription({ onSubscribe, title = "A thoughtful note, once a month.", className }: EditorialSubscriptionProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  return <section className={cn("rounded-2xl border border-border bg-background p-6 sm:p-9", className)} aria-labelledby={`${id}-title`}>
    <p className="text-xs text-muted-foreground">A note when it matters</p><h2 id={`${id}-title`} className="mt-2 max-w-xl text-balance text-4xl font-medium tracking-[-0.035em]">{title}</h2>
    <form className="mt-6 flex flex-wrap items-end gap-3" onSubmit={async (event) => {
      event.preventDefault();
      if (status === "pending") return;
      setStatus("pending"); setError("");
      try { await onSubscribe(email.trim()); setStatus("success"); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Subscription could not be completed. Please try again."); setStatus("error"); }
    }}>
      <div className="min-w-0 flex-1"><label htmlFor={id} className="sr-only">Email address</label><input id={id} type="email" placeholder="Your email address" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); if (status !== "pending") setStatus("idle"); }} disabled={status === "pending"} aria-describedby={`${id}-status`} className="h-12 w-full rounded-full border border-border bg-background px-5 text-sm" /></div>
      <button type="submit" disabled={status === "pending" || status === "success"} className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-50">{status === "pending" ? "Subscribing…" : status === "success" ? "Subscribed" : "Subscribe"}</button>
    </form>
    <p id={`${id}-status`} role={status === "error" ? "alert" : "status"} className="mt-3 text-xs text-muted-foreground">{status === "success" ? "Your subscription has been accepted." : status === "error" ? error : "Only the updates you signed up for."}</p>
  </section>;
}
