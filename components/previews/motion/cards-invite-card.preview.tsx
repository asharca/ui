"use client";
import { useState } from "react";
import { ReferralInviteCard } from "@/components/motion/purposeful-cards";
export function InviteCardPreview() {
  const [dismissed, setDismissed] = useState(false);
  return <div className="flex min-h-[46rem] w-full items-center justify-center px-4 py-10 sm:px-8 sm:py-14">{dismissed ? <button type="button" onClick={() => setDismissed(false)} className="rounded-full border border-border p-3 text-sm">Show invite card</button> : <ReferralInviteCard title="Invite & earn rewards" reward="Earn 150 credits" url="https://example.com/invite/mira" steps={["Share your invite — Send your personal link to someone you want to bring in.", "They join — Your friend creates an account through your invitation.", "You both earn — The reward unlocks for both of you after they get started."]} onDismiss={() => setDismissed(true)} />}</div>;
}
