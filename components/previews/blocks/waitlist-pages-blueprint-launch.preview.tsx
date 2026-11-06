"use client";

import { useState } from "react";
import { WaitlistBlueprintLaunch } from "@/components/motion/waitlist-pages";

export function WaitlistBlueprintLaunchPreview() {
  const [email, setEmail] = useState("");
  const [invites, setInvites] = useState(0);
  const [reject, setReject] = useState(false);
  return <div className="w-full"><details className="px-4 text-xs text-muted-foreground"><summary className="cursor-pointer py-2">Demo details</summary><label className="flex gap-2 py-2"><input type="checkbox" checked={reject} onChange={(event) => setReject(event.target.checked)} />Demo signup failure</label><p role="status">Local interactive demo · {email ? `Reserved for ${email}` : "No reservation yet"} · {invites} invitation links generated. Reservations remain in memory.</p></details><WaitlistBlueprintLaunch brand="Openform Studio" title="Make the future feel ready now" highlightWord="future" description="A new canvas for people who prefer making to managing." launchAt="2027-05-01T16:00:00Z" memberProof={email ? "Your local reservation is recorded" : "1,288 people already joined"} memberAvatars={[{ src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=96&q=80", alt: "Waitlist member" }, { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=80", alt: "Waitlist member" }, { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&q=80", alt: "Waitlist member" }]} onSubscribe={async (address) => { const { promise, resolve } = Promise.withResolvers<void>(); setTimeout(resolve, 600); await promise; if (reject) throw new Error("Demo: reservation could not be recorded."); setEmail(address); }} onInvite={email ? async () => { const count = invites + 1; setInvites(count); const url = new URL(window.location.href); url.searchParams.set("demo-invite", String(count)); return url.toString(); } : undefined} footer={<nav aria-label="Product links" className="flex gap-7"><a href="/docs">About</a><a href="/guides">FAQs</a></nav>} /></div>;
}
