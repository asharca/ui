"use client";
import { useId, useState } from "react";
import { AnimatedDialog } from "@/components/motion/animated-dialog-composition";

export function AnimatedDialogPreview() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [invited, setInvited] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  return <div className="flex min-h-[260px] items-center justify-center p-6"><AnimatedDialog triggerLabel="Open modal" title="Invite a teammate" description="Give someone access to your workspace." open={open} onOpenChange={setOpen}>
    <form onSubmit={event => { event.preventDefault(); setInvited(current => [...current, email]); setOpen(false); setEmail(""); }}>
      <div className="flex flex-col gap-1.5 p-5"><label htmlFor={emailId} className="px-1 text-sm font-medium">Email address</label><input id={emailId} type="email" autoComplete="email" required placeholder="teammate@example.com" value={email} onChange={event => setEmail(event.target.value)} className="block h-10 w-full rounded-full border border-border-strong bg-background px-3.5 text-sm leading-6 outline-none placeholder:text-muted-foreground/60 focus:border-muted-foreground/40" /></div>
      <footer className="flex justify-end gap-2 border-t border-border px-5 py-4"><button type="button" onClick={() => setOpen(false)} className="h-9 rounded-full border border-border px-5 text-sm font-medium hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-ring">Cancel</button><button type="submit" className="h-9 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-ring">Invite teammate</button></footer>
    </form>
  </AnimatedDialog><p role="status" className="sr-only">{invited.length ? `${invited.at(-1)} added to this local preview's invitation list. No email was sent.` : ""}</p></div>;
}
