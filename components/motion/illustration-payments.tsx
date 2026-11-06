"use client";

import { ArrowDownLeft, Check, CreditCard, Headphones, LoaderCircle, MousePointer2 } from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { IllustrationPlaybackControl, SceneError, useIllustrationSequence, useProductRequest } from "./illustration-product-scene";

const canvas = "@container group relative isolate aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl bg-muted text-foreground";
// The public checkout cycle is measured at 8 seconds; intermediate checkpoints are reconstructed.
const checkoutCheckpoints = [0, 1800, 3200, 4300, 7200];
export interface IllustrationReceipt { reference: string; amount: string; message?: string }
export interface CheckoutSceneProps { item: string; amount: string; paymentLabel: string; onCheckout: () => Promise<IllustrationReceipt>; className?: string; itemDetail?: string; itemAmount?: string; shipping?: string; tax?: string; demonstration?: { receipt: IllustrationReceipt; playing?: boolean } }
/** A sample playback receipt is kept separate from request.result and can never charge a payment. */
export function CheckoutScene({ item, amount, paymentLabel, onCheckout, className, itemDetail, itemAmount, shipping, tax, demonstration }: CheckoutSceneProps) {
  const request = useProductRequest<IllustrationReceipt>();
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const [interacted, setInteracted] = useState(false);
  const demo = !!demonstration && !interacted;
  const playbackPhase = useIllustrationSequence(demo && playing && demonstration?.playing !== false && !reduce, checkoutCheckpoints, 8000);
  const phase = demo && reduce ? 3 : playbackPhase;
  const samplePending = demo && phase === 1;
  const sampleConfirmed = demo && (phase === 2 || phase === 3);
  const receipt = request.result ?? (demo && phase === 3 ? demonstration.receipt : null);
  return <section aria-label={demo ? "Sample checkout playback" : "Checkout illustration"} data-presentation={demo || undefined} className={cn(canvas, className)}>
    <div aria-hidden className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:5cqw_5cqw]" />
    <div className="absolute left-1/2 top-[57%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-[4.4cqw] border border-border bg-background p-[3.2%]">
      <div className="flex items-center gap-[2.4cqw]"><span aria-hidden className="grid size-[10cqw] shrink-0 place-items-center rounded-[2cqw] bg-amber-200 text-amber-950"><Headphones className="size-[7cqw]" /></span><div className="min-w-0 flex-1"><h3 className="text-[2.6cqw] font-medium">{item}</h3>{itemDetail && <p className="mt-1 text-[1.8cqw] text-muted-foreground">{itemDetail}</p>}</div>{itemAmount && <span className="text-[2.7cqw]">{itemAmount}</span>}</div>
      <dl className="mt-[4cqw] space-y-[1.3cqw] text-[2cqw]">{shipping && <div className="flex justify-between text-muted-foreground"><dt>Shipping</dt><dd>{shipping}</dd></div>}{tax && <div className="flex justify-between text-muted-foreground"><dt>Tax</dt><dd>{tax}</dd></div>}<div className="flex justify-between border-t border-dashed border-border pt-[2cqw] text-[2.5cqw] font-medium"><dt>Total</dt><dd>{amount}</dd></div></dl>
      <div className="mt-[3cqw] flex items-center gap-[2cqw] rounded-full border border-border px-[2cqw] py-[1.4cqw] text-[2cqw]"><CreditCard aria-hidden className="size-[4cqw] text-orange-500" /><span className="flex-1 font-mono">{paymentLabel}</span><span className="text-muted-foreground">Default</span></div>
      <motion.button type="button" disabled={request.pending || request.result !== null} aria-label={demo ? "Run checkout action; animation is sample playback only" : undefined} onClick={() => { setInteracted(true); void request.run(onCheckout); }} initial={false} animate={{ width: samplePending || sampleConfirmed ? "8cqw" : "100%", scale: samplePending ? .96 : 1 }} transition={{ duration: reduce ? 0 : .4, ease: EASE_OUT }} className={cn("mx-auto mt-[2cqw] flex h-[8cqw] cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-[2.5cqw] disabled:cursor-default", request.result || sampleConfirmed ? "bg-emerald-500 text-white" : "bg-foreground text-background")}>{request.pending || samplePending ? <><LoaderCircle aria-hidden className="size-[3.5cqw] motion-safe:animate-spin" style={samplePending && !playing ? { animationPlayState: "paused" } : undefined} /><span className="sr-only">{demo ? "Sample processing animation" : "Processing payment"}</span></> : request.result || sampleConfirmed ? <><Check aria-hidden className="size-[3.5cqw]" /><span className={sampleConfirmed ? "sr-only" : undefined}>{demo ? "Sample confirmation" : "Confirmed"}</span></> : `Pay ${amount}`}</motion.button>
      <SceneError message={request.error} />
    </div>
    {demo && !reduce && <motion.div aria-hidden initial={false} animate={{ opacity: phase === 0 || phase === 1 ? 1 : 0, x: phase === 0 ? 30 : 0, y: phase === 0 ? 20 : 0, scale: phase === 1 ? .85 : 1 }} transition={{ duration: .45, ease: EASE_OUT }} className="pointer-events-none absolute left-[67%] top-[80%] z-20"><MousePointer2 className="size-[5cqw] fill-background" /></motion.div>}
    <div aria-live={demo ? "off" : "polite"} aria-busy={request.pending}>{receipt && <motion.div key={demo ? "sample-receipt" : receipt.reference} initial={reduce ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : .3, ease: EASE_OUT }} aria-label={demo ? "Sample receipt, no payment made" : undefined} className="absolute left-1/2 top-[4%] flex w-max max-w-[90%] -translate-x-1/2 items-center gap-[1.5cqw] rounded-full border border-border bg-background px-[1.5cqw] py-[1.2cqw] text-[2.2cqw] shadow-sm"><span className="grid size-[5cqw] shrink-0 place-items-center rounded-full bg-emerald-500 text-white"><Check className="size-[3cqw]" aria-hidden /></span><p className="font-medium">{receipt.message ?? "Payment received"}</p><p className="text-muted-foreground">{receipt.amount}{!demo && ` · ${receipt.reference}`}</p></motion.div>}</div>
    {demonstration && !interacted && <><p className="sr-only">Sample playback does not send money, collect credentials or produce a host receipt. Activate checkout to run the supplied action instead.</p><IllustrationPlaybackControl label="checkout playback" playing={playing} reduced={reduce} onPlayingChange={setPlaying} /></>}
  </section>;
}

export interface IncomingPayment { id: string; sender: string; amount: string; date: string; status: "pending" | "settled" | "failed"; method?: string; avatar?: { src: string; alt: string } }
export interface RevenuePresentationFrame { balance: number; payments: readonly IncomingPayment[] }
export interface RevenueStreamProps { balance: string; payments: readonly IncomingPayment[]; className?: string; title?: string; demonstration?: { frames: readonly RevenuePresentationFrame[]; formatBalance: (value: number) => string; interval?: number; playing?: boolean } }
function PlaybackBalance({ value, format, reduced }: { value: number; format: (value: number) => string; reduced: boolean | null }) {
  const amount = useMotionValue(value);
  const formatted = useTransform(amount, format);
  useEffect(() => {
    if (reduced || value < amount.get()) { amount.set(value); return; }
    const animation = animate(amount, value, { duration: .7, ease: EASE_OUT });
    return () => animation.stop();
  }, [value, amount, reduced]);
  return <motion.span>{formatted}</motion.span>;
}
/** Passive arrivals only replay explicitly supplied sample frames, without emitting payment events. */
export function RevenueStream({ balance, payments, className, title = "Incoming payments", demonstration }: RevenueStreamProps) {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(true);
  const interval = demonstration?.interval ?? 2600;
  const count = demonstration?.frames.length ?? 0;
  const checkpoints = useMemo(() => Array.from({ length: count }, (_, index) => index * interval), [count, interval]);
  const frame = useIllustrationSequence(!!demonstration && playing && demonstration.playing !== false && !reduce, checkpoints, count * interval);
  const sample = demonstration?.frames[frame];
  const displayedPayments = sample?.payments ?? payments;
  return <section aria-label={sample ? "Sample incoming payment playback" : title} data-presentation={!!sample || undefined} className={cn(canvas, className)}>
    <div aria-hidden className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle,var(--border)_1px,transparent_1px)] [background-size:5cqw_5cqw]" />
    <div className="absolute left-1/2 top-1/2 w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-[4.4cqw] border border-border bg-background p-[3.4%]">
      <div className="flex items-start justify-between"><div><p className="text-[2cqw] text-muted-foreground">Available balance</p><p aria-live={sample ? "off" : "polite"} className="mt-[2cqw] text-[5.4cqw] font-semibold tracking-tight">{sample && demonstration ? <PlaybackBalance value={sample.balance} format={demonstration.formatBalance} reduced={reduce} /> : balance}</p></div><span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-1 text-[1.8cqw] text-emerald-600"><span className="relative size-1 rounded-full bg-current"><span aria-hidden className={cn("absolute inset-0 rounded-full bg-current", playing && !reduce && "motion-safe:animate-ping")} /></span>Live</span></div>
      <ol aria-label={sample ? "Sample incoming payment frames" : "Incoming payments"} className="relative mt-[3cqw] h-[36cqw] overflow-y-auto border-t border-border [scrollbar-width:none] [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">{displayedPayments.map(payment => <motion.li key={payment.id} layout="position" initial={reduce ? false : { opacity: 0, y: -12, height: 0 }} animate={{ opacity: 1, y: 0, height: "9cqw" }} transition={{ duration: reduce ? 0 : .3, ease: EASE_OUT }} className="flex items-center gap-[2cqw] border-b border-border text-[2.3cqw]">{payment.avatar ? <img src={payment.avatar.src} alt={payment.avatar.alt} className="size-[6cqw] shrink-0 rounded-full object-cover" /> : <span aria-hidden className="grid size-[6cqw] shrink-0 place-items-center rounded-full bg-muted text-[1.8cqw]">{payment.sender.split(" ").map(name => name[0]).join("")}</span>}<div className="min-w-0 flex-1"><p className="truncate font-medium">{payment.sender}</p><div className="mt-1 flex items-center gap-1 text-[1.6cqw] text-muted-foreground">{payment.method && <span className="rounded border border-primary/20 bg-primary/5 px-1 text-primary">{payment.method}</span>}<span>{payment.date}</span><span className="sr-only"> · {payment.status}</span></div></div><span className={cn("font-medium", payment.status === "settled" ? "text-emerald-600" : payment.status === "failed" ? "text-destructive" : "text-muted-foreground")}>{payment.status === "settled" && "+"}{payment.amount}</span><ArrowDownLeft aria-hidden className="sr-only" /></motion.li>)}{!displayedPayments.length && <li className="py-8 text-center text-xs text-muted-foreground">No incoming payments.</li>}</ol>
    </div>
    {demonstration && <><p className="sr-only">Sample frames only. No financial service is connected and no payment event is emitted.</p><IllustrationPlaybackControl label="incoming payment playback" playing={playing} onPlayingChange={setPlaying} reduced={reduce} /></>}
  </section>;
}
