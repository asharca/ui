"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { ProductPageSignup } from "@/components/motion/product-page-signup";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface WaitlistPageProps {
  brand: string;
  title: string;
  /** Blueprint headline selection; defaults to the final word. */
  highlightWord?: string;
  description: string;
  /** ISO timestamp including a timezone. */
  launchAt: string;
  onSubscribe: (email: string) => Promise<void>;
  memberProof?: string;
  memberAvatars?: { src: string; alt: string }[];
  productPreview?: ReactNode;
  footer?: ReactNode;
  /** Return a host-generated invitation URL; no invitation is invented locally. */
  onInvite?: () => Promise<string>;
  className?: string;
}

function MemberAvatars({ avatars }: { avatars?: WaitlistPageProps["memberAvatars"] }) {
  return avatars?.length ? <div className="flex -space-x-2">{avatars.map((avatar) => <img key={avatar.src} src={avatar.src} alt={avatar.alt} className="size-9 rounded-full border-2 border-background object-cover" />)}</div> : null;
}

function LaunchCountdown({ launchAt, large = false }: { launchAt: string; large?: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  const target = Date.parse(launchAt);
  if (!Number.isFinite(target)) return <p role="status">Launch date to be announced.</p>;
  const remaining = now === null ? null : Math.max(0, Math.floor((target - now) / 1000));
  const units = remaining === null ? [null, null, null, null] : [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
  return <div><div role="timer" aria-label="Time until launch" className={cn(large ? "grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 sm:gap-x-10" : "flex items-center justify-center gap-2 sm:gap-3")}>{["Days", "Hours", "Minutes", "Seconds"].map((label, index) => <div key={label} className={cn("relative text-center", large ? "flex flex-col" : "grid size-16 content-center rounded-full border border-border sm:size-20")}><span className={cn("block font-medium tracking-tight tabular-nums", large ? "order-2 text-[clamp(4rem,15vw,12rem)] leading-none [-webkit-mask-image:linear-gradient(black_55%,transparent)]" : "text-xl")}>{units[index] === null ? "—" : <NumberTicker value={units[index]} pad={2} startOnView={false} duration={0.3} />}</span><span className={cn("text-xs uppercase tracking-widest text-muted-foreground", large && "mb-4")}>{label}</span>{index < 3 && !large && <span aria-hidden="true" className="absolute -right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground sm:-right-3">:</span>}</div>)}</div><p className="sr-only">{remaining === 0 ? "Launch time has arrived · " : "Launching · "}<time dateTime={launchAt}>{new Date(target).toISOString().replace("T", " ").replace(".000Z", " UTC")}</time></p></div>;
}
export function WaitlistEarlyAccess({ brand, title, description, launchAt, onSubscribe, memberProof, memberAvatars, productPreview, footer, onInvite, className }: WaitlistPageProps) {
  const reduce = useReducedMotion();
  return <section aria-label={`${brand} early access`} className={cn("relative isolate min-h-[860px] w-full overflow-hidden bg-background px-4 pt-14 text-foreground sm:pt-16", className)}>
    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[58%] bg-[radial-gradient(ellipse_at_bottom,var(--color-primary)_0%,transparent_66%)] opacity-20" />
    <motion.div initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, ease: EASE_OUT }} className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
      <span role="img" aria-label={brand} className="grid size-12 place-items-center rounded-full bg-primary text-xl font-medium text-primary-foreground">{brand.slice(0, 1)}</span>
      <h1 className="mt-6 text-balance text-4xl font-medium tracking-tight md:text-5xl">{title}</h1><p className="mt-3 max-w-md text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
      <ProductPageSignup className="mt-6 w-full max-w-xl" onSubscribe={onSubscribe} buttonLabel="Join waitlist" />
      {(memberProof || memberAvatars?.length) && <div className="mt-4 flex items-center gap-3"><MemberAvatars avatars={memberAvatars} />{memberProof && <p className="text-sm text-muted-foreground">{memberProof}</p>}</div>}
      <div className="mt-6"><LaunchCountdown launchAt={launchAt} /></div>{onInvite && <div className="mt-4"><InviteLink onInvite={onInvite} /></div>}
    </motion.div>
    {productPreview && <motion.div initial={reduce ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4, ease: EASE_OUT }} className="relative mx-auto mt-14 w-full max-w-[320px] sm:mt-16">{productPreview}</motion.div>}
    {footer && <footer className="relative p-5 text-center text-xs text-muted-foreground">{footer}</footer>}
  </section>;
}
export function WaitlistBlueprintLaunch({ brand, title, highlightWord, description, launchAt, onSubscribe, memberProof, memberAvatars, footer, onInvite, className }: WaitlistPageProps) {
  const reduce = useReducedMotion();
  const selected = highlightWord ?? title.trim().split(/\s+/).at(-1) ?? "";
  const selectionStart = selected ? title.indexOf(selected) : -1;
  return <section aria-label={`${brand} blueprint launch`} className={cn("w-full bg-background p-2 text-foreground sm:p-4", className)}><div className="relative isolate min-h-[840px] overflow-hidden rounded-3xl border border-border bg-background">
    <header className="relative z-20 mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 sm:px-10"><span className="font-medium">{brand}</span>{footer && <div className="text-sm text-muted-foreground">{footer}</div>}</header>
    <motion.div initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .3, ease: EASE_OUT }} className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-5 pt-[68px] text-center">
      {memberAvatars?.length && <div className="mb-7"><MemberAvatars avatars={memberAvatars} /></div>}
      <h1 className="max-w-4xl text-balance text-4xl font-medium tracking-tight md:text-5xl">{selectionStart < 0 ? title : <>{title.slice(0, selectionStart)}<mark className="relative mx-2 inline-block -rotate-2 border border-foreground bg-transparent px-2 italic text-foreground">{selected}<span aria-hidden="true" className="absolute -left-1.5 -top-1.5 size-2 rounded-full border border-background bg-foreground" /><span aria-hidden="true" className="absolute -right-1.5 -top-1.5 size-2 rounded-full border border-background bg-foreground" /><span aria-hidden="true" className="absolute -bottom-1.5 -left-1.5 size-2 rounded-full border border-background bg-foreground" /><span aria-hidden="true" className="absolute -bottom-1.5 -right-1.5 size-2 rounded-full border border-background bg-foreground" /></mark>{title.slice(selectionStart + selected.length).trim() && <span className="mt-2 block">{title.slice(selectionStart + selected.length).trimStart()}</span>}</>}</h1>
      <p className="sr-only">{description}</p><ProductPageSignup className="mt-10 w-full max-w-xl" onSubscribe={onSubscribe} buttonLabel="Join waitlist" idleMessage={memberProof ?? "No spam. We’ll only email when access is ready."} />{onInvite && <div className="mt-4"><InviteLink onInvite={onInvite} /></div>}
    </motion.div><div className="absolute inset-x-0 bottom-[-2.5rem] z-10 mx-auto max-w-6xl px-5 sm:px-8"><LaunchCountdown launchAt={launchAt} large /></div>
  </div></section>;
}

function InviteLink({ onInvite }: { onInvite: () => Promise<string> }) {
  const [url, setUrl] = useState(""); const [error, setError] = useState(""); const [pending, setPending] = useState(false);
  return <div className="space-y-2 text-sm"><button type="button" disabled={pending} className="cursor-pointer underline underline-offset-4 disabled:opacity-50" onClick={async () => { setPending(true); setError(""); try { setUrl(await onInvite()); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to create an invitation."); } finally { setPending(false); } }}>{pending ? "Creating invitation…" : "Create an invitation"}</button>{url && <label className="block">Your invitation URL<input aria-label="Your invitation URL" readOnly value={url} onFocus={(event) => event.currentTarget.select()} className="mt-2 w-full rounded-lg border border-border bg-background p-2" /></label>}{error && <p role="alert" className="text-destructive">{error}</p>}</div>;
}

