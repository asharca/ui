"use client";

import { useId, useMemo, useState } from "react";
import { Bot, Bug, Check, Fingerprint, KeyRound, LockKeyhole, Radar, ShieldAlert, UnlockKeyhole } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { OTPInput } from "@/components/motion/otp-input";
import { EASE_IN_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { IllustrationPlaybackControl, SceneError, useIllustrationSequence, useProductRequest } from "./illustration-product-scene";

const canvas = "@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-muted text-foreground";
const scanCheckpoints = [0, 1600, 3200, 4800, 6400];
const scanLines = [94, 114, 134, 154, 174, 194];
const examples = ["Bot login", "Leaked key", "Phishing", "SQL injection", "Port scan", "Malware"];
const threatIcons = [Bot, KeyRound, Fingerprint, ShieldAlert, Radar, Bug];
export interface ThreatScanResult { checked: number; blocked: { id: string; label: string }[]; summary: string }
export interface ThreatScanSceneProps { onScan: () => Promise<ThreatScanResult>; className?: string; title?: string; demoThreats?: readonly string[]; demonstration?: boolean }
/** An 8-second illustrative sweep never constructs a ThreatScanResult or inspects actual traffic. */
export function ThreatScanScene({ onScan, className, title = "Security scan concept", demoThreats = examples, demonstration = false }: ThreatScanSceneProps) {
  const request = useProductRequest<ThreatScanResult>();
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const demo = demonstration && !interacted;
  const running = demo && playing && !reduce;
  const playbackPhase = useIllustrationSequence(running, scanCheckpoints, 8000);
  const phase = demo && reduce ? 4 : playbackPhase;
  const cleared = !!request.result || demo && phase === 4;
  const clip = useId();
  const threatOccurrences = new Map<string, number>();
  const threats = request.result?.blocked ?? demoThreats.map(label => {
    const occurrence = threatOccurrences.get(label) ?? 0;
    threatOccurrences.set(label, occurrence + 1);
    return { id: JSON.stringify([label, occurrence]), label };
  });
  return <section aria-label={demo ? "Sample security scan playback" : title} data-presentation={demo || undefined} className={cn(canvas, className)}>
    <div aria-hidden className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:5cqw_5cqw]" />
    <svg viewBox="0 0 400 300" className="absolute inset-0 size-full" aria-hidden="true"><defs><clipPath id={clip}><path d="M200 58 252 76v62c0 32-22 54-52 70-30-16-52-38-52-70V76Z" /></clipPath></defs><motion.path initial={false} animate={{ fill: cleared ? "#10b981" : "var(--background)" }} transition={{ duration: reduce ? 0 : .4 }} d="M200 58 252 76v62c0 32-22 54-52 70-30-16-52-38-52-70V76Z" stroke="var(--border)" strokeWidth={2} /><g clipPath={`url(#${clip})`} opacity={cleared ? 0 : 1}>{scanLines.map((y, i) => <path key={y} d={`M${168 + i % 2 * 8} ${y}h${64 - i % 2 * 16}`} stroke="var(--border)" strokeWidth={4} />)}<motion.rect x={148} y={75} width={104} height={22} fill="#10b981" initial={false} animate={running ? { y: [0, 120, 120, 0], opacity: [.12, .2, 0, .12] } : { y: 0, opacity: .12 }} transition={{ duration: reduce ? 0 : 8, times: running ? [0, .62, .86, 1] : undefined, repeat: running ? Infinity : 0, ease: EASE_IN_OUT }} /></g>{cleared && <motion.path d="m181 127 13 13 26-28" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : .4 }} fill="none" stroke="white" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />}</svg>
    <ul aria-label={request.result ? "Host-reported blocked threats" : "Example threat labels"} className="absolute inset-0">{threats.slice(0, 6).map((threat, index) => { const Icon = threatIcons[index]; const resolved = !!request.result || demo && phase > Math.floor(index / 2); return <motion.li key={threat.id} initial={false} animate={{ x: resolved ? index % 2 ? -5 : 5 : 0 }} transition={{ duration: reduce ? 0 : .4 }} className={cn("absolute flex items-center gap-[1.5cqw] rounded-full bg-background/85 px-[2cqw] py-[1.3cqw] text-[max(7.2px,1.9cqw)]", index % 2 ? "left-[67%]" : "right-[67%] flex-row-reverse")} style={{ top: `${24 + Math.floor(index / 2) * 18}%` }}><span className={cn("grid size-[5cqw] shrink-0 place-items-center rounded-full", resolved ? "bg-emerald-500 text-white" : "bg-rose-500/10 text-rose-500")}>{resolved ? <Check className="size-[2.6cqw]" aria-hidden /> : <Icon className="size-[2.6cqw]" aria-hidden />}</span><span className={cn("whitespace-nowrap", resolved && "opacity-50")}>{threat.label}</span></motion.li>; })}</ul>
    <button type="button" disabled={request.pending} aria-label={demo ? "Run host scan; displayed threats are sample playback" : undefined} onClick={() => { setInteracted(true); void request.run(onScan); }} className="absolute bottom-[12%] left-1/2 flex w-[43%] -translate-x-1/2 cursor-pointer items-center justify-center gap-2 rounded-full bg-background py-[1.5%] text-[2.1cqw] text-muted-foreground focus-visible:outline-2 focus-visible:outline-ring"><span className={cn("size-1.5 rounded-full", cleared ? "bg-emerald-500" : "bg-amber-400")} />{request.pending ? "Scanning traffic" : request.result ? "Scan complete · rescan" : cleared ? "All threats blocked" : "Scanning traffic"}</button>
    <div aria-live={demo ? "off" : "polite"} className="absolute inset-x-[8%] bottom-[2%] text-center text-[1.8cqw] text-muted-foreground">{request.result && <p>{request.result.checked} checked · {request.result.summary}</p>}<SceneError message={request.error} /></div>
    <p className="sr-only">Security illustration only. Sample playback does not scan, detect or block real threats. Activate the scan control to request host-supplied results.</p>
    {demo && <IllustrationPlaybackControl label="security scan playback" playing={playing} onPlayingChange={setPlaying} reduced={reduce} />}
  </section>;
}

export interface VerificationResult { verified: boolean; message: string }
export interface VerificationSceneProps { onVerify: (code: string) => Promise<VerificationResult>; length?: number; destination: string; className?: string; demonstration?: { code: string; playing?: boolean } }
/** Sample digits and unlock animation never submit a code or become an authorization result. */
export function VerificationScene({ onVerify, length = 6, destination, className, demonstration }: VerificationSceneProps) {
  const [code, setCode] = useState("");
  const request = useProductRequest<VerificationResult>();
  const [edited, setEdited] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const reduce = useReducedMotion();
  const demo = !!demonstration && !interacted;
  // Digit transition durations were observed; inter-digit spacing and full loop timing are reconstructed.
  const checkpoints = useMemo(() => Array.from({ length: length + 3 }, (_, index) => index === 0 ? 0 : index <= length ? 600 + (index - 1) * 350 : index === length + 1 ? 600 + length * 350 : 1200 + length * 350), [length]);
  const playbackPhase = useIllustrationSequence(demo && playing && demonstration?.playing !== false && !reduce, checkpoints, Math.max(8000, 2400 + length * 350));
  const phase = demo && reduce ? length + 2 : playbackPhase;
  const sampleVerified = demo && phase === length + 2;
  const samplePending = demo && phase === length + 1;
  const displayedCode = demo ? demonstration.code.slice(0, Math.min(phase, length)) : code;
  const feedback = edited ? null : request.result;
  const unlocked = feedback?.verified || sampleVerified;
  return <section aria-label={demo ? "Sample verification playback, not account authorization" : "Two-step verification"} data-presentation={demo || undefined} className={cn(canvas, className)}>
    <div aria-hidden className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:5cqw_5cqw]" />
    <div className="absolute left-1/2 top-1/2 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[4.4cqw] border border-border bg-background px-[4%] py-[4.4%] text-center">
      <motion.div aria-hidden initial={false} animate={{ scale: unlocked ? 1.06 : 1, rotate: unlocked ? -4 : 0 }} transition={{ duration: reduce ? 0 : .42 }} className={cn("mx-auto mb-[3cqw] grid size-[11cqw] place-items-center rounded-full", unlocked ? "bg-emerald-500 text-white" : "border border-border bg-muted text-muted-foreground")}>{unlocked ? <UnlockKeyhole className="size-[4cqw] fill-current" /> : <LockKeyhole className="size-[4cqw]" />}</motion.div>
      <h3 className="text-[3cqw] font-medium">Two-step verification</h3><p className="mt-[1cqw] text-[2cqw] text-muted-foreground">Sent to {destination}</p>
      <form className="mt-[4cqw]" onFocusCapture={() => { if (demo) { setInteracted(true); setCode(""); setEdited(true); } }} onSubmit={event => { event.preventDefault(); if (!demo && code.length === length && !request.pending) { setEdited(false); void request.run(() => onVerify(code)); } }}>
        <OTPInput aria-label={demo ? "Sample verification digits; focus to enter your own code" : "Verification code"} length={length} value={displayedCode} onChange={next => { setInteracted(true); setCode(next); setEdited(true); }} disabled={request.pending || feedback?.verified} status={feedback ? feedback.verified ? "success" : "error" : sampleVerified ? "success" : "idle"} errorMessage={feedback?.verified === false ? feedback.message : undefined} successMessage={feedback?.verified ? feedback.message : sampleVerified ? "✓ Verified" : undefined} className="max-w-full items-center [&_[data-filled]]:h-[9.8cqw] [&_[data-filled]]:w-[9.8cqw] [&_[data-filled]]:rounded-[1.8cqw] [&_[data-filled]]:text-[4cqw] [&_fieldset>div]:gap-[1.5cqw] [&_fieldset>span]:hidden [&>p]:rounded-full [&>p]:border [&>p]:border-emerald-500/20 [&>p]:bg-emerald-500/10 [&>p]:px-[2cqw] [&>p]:py-[.4cqw] [&>p]:text-[2cqw]" />
        {!feedback?.verified && !sampleVerified && <button type={demo ? "button" : "submit"} disabled={!demo && (code.length !== length || request.pending)} onClick={demo ? () => { setInteracted(true); setCode(""); setEdited(true); } : undefined} className={cn("mt-[3cqw] rounded-full bg-foreground px-[5cqw] py-[1.5cqw] text-[2cqw] text-background disabled:opacity-40", !displayedCode && "sr-only focus:not-sr-only")}>{request.pending || samplePending ? "Verifying…" : "Verify code"}</button>}
      </form><SceneError message={request.error} />
    </div>
    {demo && <><p className="sr-only">Supplied sample code playback only. No code is submitted and no account is authenticated. Focus a code field to use the real verification callback.</p><IllustrationPlaybackControl label="verification playback" playing={playing} onPlayingChange={setPlaying} reduced={reduce} /></>}
  </section>;
}
