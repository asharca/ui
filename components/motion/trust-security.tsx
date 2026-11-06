"use client";

import { useId, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ShieldCheck, LockKeyhole, ArrowUpRight } from "lucide-react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface TrustClaim {
  id: string;
  title: string;
  description: string;
  evidenceHref?: string;
  evidenceLabel?: string;
  detail?: ReactNode;
  mark?: ReactNode;
  /** Host-authored scope/status, not an inferred certification. */
  status?: string;
}
export interface TrustSectionProps {
  title: string;
  description?: string;
  claims: TrustClaim[];
  disclosure?: string;
  className?: string;
}
function TrustHeading({ title, description, disclosure }: Pick<TrustSectionProps, "title" | "description" | "disclosure">) {
  return <header className="mb-14 max-w-3xl"><p className="mb-7 inline-flex rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium text-muted-foreground">Trust and security</p><h2 className="text-balance text-4xl font-medium tracking-[-.05em]">{title}</h2>{description && <p className="mt-6 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>}{disclosure && <p className="mt-4 text-xs leading-5 text-muted-foreground">{disclosure}</p>}</header>;
}
function ClaimEvidence({ claim }: { claim: TrustClaim }) {
  return <>{claim.detail && <details className="mt-4 text-sm"><summary className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-ring">Read scope: {claim.title}</summary><div className="mt-3 text-muted-foreground">{claim.detail}</div></details>}{claim.evidenceHref && <a href={claim.evidenceHref} className="mt-4 inline-flex items-center gap-1 rounded text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{claim.evidenceLabel ?? `Evidence for ${claim.title}`}<ArrowUpRight aria-hidden="true" className="size-3" /></a>}</>;
}
export interface EnterpriseReadinessProps extends TrustSectionProps {
  support: TrustClaim;
  deployment: TrustClaim;
  contact?: { label: string; href: string };
}
export function EnterpriseReadiness({ support, deployment, contact, ...props }: EnterpriseReadinessProps) {
  const reduce = useReducedMotion();
  return <section className={cn("w-full bg-background px-6 py-12 text-foreground sm:px-10 sm:py-16 [&_header]:mx-auto [&_header]:text-center", props.className)}><div className="mx-auto max-w-6xl"><TrustHeading {...props} /><div className="grid gap-4 md:grid-cols-2">{[support, deployment].map((claim, index) => <motion.article key={claim.id} initial={false} whileInView={{ y: 0 }} transition={{ duration: reduce ? 0 : .5, delay: reduce ? 0 : index * .1, ease: EASE_OUT }} className="rounded-3xl border border-border bg-background p-6 sm:p-8"><p className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">{index === 0 ? "People, not tickets" : "Your environment, your call"}</p><h3 className="text-2xl font-medium tracking-tight">{claim.title}</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">{claim.description}</p><ClaimEvidence claim={claim} /></motion.article>)}<div className="relative overflow-hidden rounded-3xl border border-border bg-background p-6 sm:p-8 md:col-span-2"><div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"><div><p className="text-xs uppercase tracking-widest text-muted-foreground">Security &amp; governance</p><h3 className="mt-4 text-2xl font-medium tracking-tight">Confidence comes built in.</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">Review the controls and scope supplied by your team.</p></div><ul className="grid gap-3 sm:grid-cols-2">{props.claims.map(claim => <li key={claim.id} className="rounded-xl border border-border p-4"><p className="text-sm font-medium">{claim.title}</p>{claim.status && <p className="mt-2 text-xs text-muted-foreground">{claim.status}</p>}<p className="mt-2 text-xs leading-5 text-muted-foreground">{claim.description}</p><ClaimEvidence claim={claim} /></li>)}</ul></div></div></div>{contact && <div className="mt-8 flex justify-center"><a href={contact.href} className="inline-flex rounded-full border border-border px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-ring">{contact.label}</a></div>}</div></section>;
}
export interface ComplianceMarksProps extends TrustSectionProps { trustCenter?: { label: string; href: string } }
export function ComplianceMarks({ trustCenter, ...props }: ComplianceMarksProps) {
  const hover = useHoverCapable();
  const reduce = useReducedMotion();
  return <section className={cn("w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-6 sm:py-24 lg:px-8 lg:py-28", props.className)}><div className="mx-auto w-full max-w-7xl"><div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><TrustHeading {...props} />{trustCenter && <a href={trustCenter.href} className="mb-14 inline-flex w-fit items-center gap-2 rounded-full border border-border px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-ring">{trustCenter.label}<ArrowUpRight className="size-4" aria-hidden="true" /></a>}</div><div className="grid gap-0 border-y border-border sm:grid-cols-2 lg:grid-cols-4">{props.claims.map((claim) => <motion.article key={claim.id} whileHover={hover && !reduce ? { y: -3 } : undefined} className="flex min-h-56 flex-col border-border px-1 py-8 sm:px-6 lg:px-7 not-first:border-t sm:even:border-l lg:not-first:border-t-0 lg:not-first:border-l"><div aria-hidden="true" className="mb-8 flex size-6 items-center text-foreground">{claim.mark ?? <ShieldCheck className="size-6" />}</div><div className="flex items-end gap-2"><h3 className="text-2xl font-medium tracking-tight">{claim.title}</h3>{claim.status && <p className="pb-1 text-xs text-muted-foreground">{claim.status}</p>}</div><p className="mt-6 text-sm leading-7 text-muted-foreground">{claim.description}</p><ClaimEvidence claim={claim} /></motion.article>)}</div>{!props.claims.length && <p>No compliance statements supplied.</p>}</div></section>;
}
export function SecuritySafeguards(props: TrustSectionProps) {
  const reduce = useReducedMotion();
  const id = useId();
  return <section className={cn("w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-6 sm:py-24 lg:px-8 lg:py-28", props.className)}><div className="mx-auto max-w-7xl"><TrustHeading {...props} /><div className="grid items-stretch gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-16"><div>
      <div className="relative flex min-h-[28rem] items-center justify-center overflow-hidden rounded-3xl border border-border/65 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--foreground)_7%,transparent),transparent_68%)]" aria-hidden="true">
        <motion.div initial={false} whileInView={{ rotate: reduce ? 0 : 90 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 1.2, ease: EASE_OUT }} className="absolute size-64 rounded-full border border-dashed border-primary/20" />
        <div className="absolute size-44 rounded-full border border-primary/20 bg-primary/5" /><div className="relative grid size-24 place-items-center rounded-3xl border border-border bg-background/80 shadow-sm"><LockKeyhole className="size-10 text-primary" /></div><span className="absolute top-14 right-8 rounded-full border border-border bg-background/80 px-4 py-2 text-xs">Access controls</span><span className="absolute bottom-14 left-8 rounded-full border border-border bg-background/80 px-4 py-2 text-xs">Data controls</span><span className="sr-only" id={id}>Protection illustration</span>
      </div>
    </div>
    <ul className="grid content-center divide-y divide-border/60 border-y border-border/70">{props.claims.map((claim, index) => <li key={claim.id} className="grid gap-4 py-6 sm:grid-cols-[auto_.72fr_1fr] sm:items-start sm:gap-6"><span className="grid size-8 place-items-center rounded-full border border-border text-xs text-muted-foreground">{index + 1}</span><h3 className="text-base font-medium">{claim.title}</h3><div><p className="text-sm leading-7 text-muted-foreground">{claim.description}</p><ClaimEvidence claim={claim} /></div></li>)}</ul>
  </div></div></section>;
}
export interface ReliabilityAndSupportProps extends TrustSectionProps {
  uptime: { value: number; decimals?: number; label: string; period: string; evidenceHref?: string };
  /** Availability observations in percent; no synthetic history is generated. */
  availability: { label: string; value: number }[];
  statusLink?: { label: string; href: string };
}
export function ReliabilityAndSupport({ uptime, availability, statusLink, ...props }: ReliabilityAndSupportProps) {
  const reduce = useReducedMotion();
  const minimum = Math.min(100, ...availability.map(point => Math.max(0, Math.min(100, point.value))));
  const span = Math.max(.01, 100 - minimum);
  const points = availability.map((point, index) => `${availability.length > 1 ? index / (availability.length - 1) * 600 : 300},${90 - (Math.min(100, Math.max(0, point.value)) - minimum) / span * 70}`).join(" ");
  const occurrences = new Map<string, number>();
  return <section className={cn("w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-6 sm:py-24 lg:px-8 lg:py-28 [&_header]:mx-auto [&_header]:text-center [&_header_p]:mx-auto", props.className)}><div className="mx-auto w-full max-w-7xl"><TrustHeading {...props} /><div className="mt-14 grid border-y border-border/70 lg:grid-cols-[1.15fr_.85fr]"><div className="relative flex min-h-[31rem] flex-col overflow-hidden py-8 sm:px-8 lg:border-r lg:border-border/60 lg:px-10 lg:py-10"><div><p className="text-sm font-medium">{uptime.label}</p><p className="mt-2 text-xs text-muted-foreground">{uptime.period}</p></div><div className="mt-12 text-7xl font-medium tracking-tighter sm:text-8xl" role="img" aria-label={`${uptime.label}: ${uptime.value}%`}><NumberTicker value={uptime.value} decimals={uptime.decimals ?? 2} suffix="%" /></div>{uptime.evidenceHref && <a href={uptime.evidenceHref} className="mt-5 w-fit rounded text-xs text-muted-foreground underline focus-visible:outline-2 focus-visible:outline-ring">View availability evidence</a>}<div className="mt-auto pt-10">{availability.length > 0 ? <><svg viewBox="0 0 600 100" role="img" aria-label="Host-supplied availability observations; exact values listed below" className="h-28 w-full"><path d="M0 100 H600" className="stroke-border" fill="none" /><motion.polyline points={points} fill="none" className="stroke-foreground" strokeWidth="2" initial={{ pathLength: reduce ? 1 : 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: reduce ? 0 : 1, ease: EASE_OUT }} /></svg><div className="mt-3 flex justify-between text-xs text-muted-foreground"><span>{availability[0]?.label}</span><span>{availability[availability.length - 1]?.label}</span></div><details className="mt-4 text-xs text-muted-foreground"><summary className="cursor-pointer rounded focus-visible:outline-2 focus-visible:outline-ring">Availability observations</summary><ul className="mt-3 grid gap-2 sm:grid-cols-3">{availability.map(point => { const identity = JSON.stringify([point.label, point.value]); const occurrence = occurrences.get(identity) ?? 0; occurrences.set(identity, occurrence + 1); return <li key={`${identity}:${occurrence}`} className="flex justify-between gap-4 rounded border border-border p-2"><span>{point.label}</span><span>{point.value}%</span></li>; })}</ul></details></> : <p className="text-sm text-muted-foreground">No availability observations supplied.</p>}</div></div><div className="flex min-h-[31rem] flex-col py-2 lg:px-8"><div className="flex-1">{props.claims.map((claim, index) => <article key={claim.id} className="grid gap-4 border-border/60 py-7 not-first:border-t sm:grid-cols-[auto_1fr] sm:gap-5"><span className="grid size-9 place-items-center rounded-full border border-border text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><div><h3 className="text-lg font-medium">{claim.title}</h3><p className="mt-3 text-sm leading-7 text-muted-foreground">{claim.description}</p><ClaimEvidence claim={claim} /></div></article>)}</div>{statusLink && <a href={statusLink.href} className="mb-6 mt-5 inline-flex w-fit rounded-full border border-border px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-ring">{statusLink.label}</a>}</div></div></div></section>;
}
