"use client";

import { ArrowRight, ArrowUpRight, BadgeCheck, Blocks, Check, CircleArrowUp, CircleCheck, Gem, Minus, Plus, RefreshCcw, Sparkles, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/motion/button";
import { NumberTicker } from "@/components/motion/number-ticker";
import { RangeSlider } from "@/components/motion/range-slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type PricingPeriod = "monthly" | "yearly";
/** All prices are integer minor currency units. annualPrice is the entire year, not a monthly equivalent. */
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  benefits: string[];
  featured?: boolean;
  actionLabel?: string;
  /** Short host-owned label beside the plan name, such as "Best value". */
  badge?: string;
  /** Heading above the benefit list, such as "Everything in Free, plus". */
  benefitsLabel?: string;
  /** Supporting line under the plan description or price. */
  note?: string;
  /** Unit after the price, such as "/ person / month". */
  priceSuffix?: string;
  /** Non-numeric price, such as "Custom". The quote is then marked custom and carries no amount. */
  priceLabel?: string;
  /** When set, plan prices are the base subscription and cover this many seats. */
  includedSeats?: number;
  /** Complete additional-seat price for the corresponding billing period, in minor units. */
  additionalSeatMonthlyPrice?: number;
  additionalSeatAnnualPrice?: number;
}
export interface PricingQuote {
  planId: string;
  period: PricingPeriod | "lifetime";
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
  /** The plan is priced by the host after contact; amounts are zero and must not be charged. */
  custom?: boolean;
  usageMultiplier?: number;
  basePrice?: number;
  includedQuantity?: number;
  extraQuantity?: number;
  extraUnitPrice?: number;
}
export interface PricingProps {
  plans: PricingPlan[];
  currency: string;
  locale?: string;
  billing?: PricingPeriod;
  defaultBilling?: PricingPeriod;
  onBillingChange?: (period: PricingPeriod) => void;
  selectedPlan?: string;
  defaultSelectedPlan?: string;
  onPlanChange?: (planId: string) => void;
  /** Host owns checkout, navigation, and server validation. Rejections are displayed without retrying. */
  onChoose: (quote: PricingQuote) => void | Promise<void>;
  /** Host-owned section copy. */
  eyebrow?: string;
  title?: string;
  description?: string;
  footnote?: string;
  /** Name of the yearly billing option, such as "Annual". Defaults to "Yearly". */
  yearlyLabel?: string;
  /** Short label on the yearly billing option, such as "Save 20%". */
  yearlyBadge?: string;
  className?: string;
}
export interface SeatPricingProps extends PricingProps {
  seats?: number;
  defaultSeats?: number;
  minSeats?: number;
  maxSeats?: number;
  onSeatsChange?: (seats: number) => void;
  /** Singular name of one seat, such as "editor". */
  seatLabel?: string;
  /** Highest qualifying threshold wins. 1000 basis points = 10%. */
  volumeDiscounts?: { minSeats: number; basisPoints: number }[];
}
function fractionDigits(currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
}
/** Formats minor units, showing fractional digits only when the amount has them. */
export function formatPricingMoney(amount: number, currency: string, locale = "en-US") {
  const digits = fractionDigits(currency, locale);
  const fraction = amount % 10 ** digits === 0 ? 0 : digits;
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: fraction, maximumFractionDigits: fraction }).format(amount / 10 ** digits);
}
function moneyParts(amount: number, currency: string, locale = "en-US"): MoneyParts {
  const digits = fractionDigits(currency, locale);
  const decimals = amount % 10 ** digits === 0 ? 0 : digits;
  const parts = new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: decimals, maximumFractionDigits: decimals }).formatToParts(amount / 10 ** digits);
  return {
    symbol: parts.filter(part => part.type === "currency").map(part => part.value).join(""),
    number: parts.filter(part => part.type !== "currency" && part.type !== "literal").map(part => part.value).join(""),
    major: amount / 10 ** digits,
    decimals,
  };
}
export function calculatePricingQuote(plan: PricingPlan, period: PricingPeriod, quantity: number, currency: string, basisPoints = 0): PricingQuote {
  if (plan.priceLabel !== undefined) return { planId: plan.id, period, quantity, unitPrice: 0, subtotal: 0, discount: 0, total: 0, currency, custom: true };
  const unitPrice = period === "yearly" ? plan.annualPrice : plan.monthlyPrice;
  const includedQuantity = plan.includedSeats;
  const extraQuantity = includedQuantity === undefined ? 0 : Math.max(0, quantity - includedQuantity);
  const extraUnitPrice = period === "yearly" ? plan.additionalSeatAnnualPrice ?? 0 : plan.additionalSeatMonthlyPrice ?? 0;
  const subtotal = includedQuantity === undefined ? unitPrice * quantity : unitPrice + extraQuantity * extraUnitPrice;
  const discount = Math.round(subtotal * Math.min(10000, Math.max(0, basisPoints)) / 10000);
  return { planId: plan.id, period, quantity, unitPrice, subtotal, discount, total: subtotal - discount, currency, ...(includedQuantity === undefined ? {} : { basePrice: unitPrice, includedQuantity, extraQuantity, extraUnitPrice }) };
}
interface MoneyParts { symbol: string; number: string; major: number; decimals: number }
interface PricingModel {
  billing: PricingPeriod;
  plan: PricingPlan | undefined;
  setBilling: (next: PricingPeriod) => void;
  setPlan: (id: string) => void;
  money: (value: number) => string;
  parts: (value: number) => MoneyParts;
}
interface SeatModel { seats: number; setSeats: (value: number) => void; min: number; max: number; basisPoints: number }
function usePricing(props: PricingProps): PricingModel {
  const [internalBilling, setBilling] = useState<PricingPeriod>(props.defaultBilling ?? "monthly");
  const [internalPlan, setPlan] = useState(props.defaultSelectedPlan ?? props.plans[0]?.id);
  const billing = props.billing ?? internalBilling;
  const plan = props.plans.find((item) => item.id === (props.selectedPlan ?? internalPlan)) ?? props.plans[0];
  return {
    billing, plan,
    setBilling: (next: PricingPeriod) => { if (props.billing === undefined) setBilling(next); props.onBillingChange?.(next); },
    setPlan: (id: string) => { if (props.selectedPlan === undefined) setPlan(id); props.onPlanChange?.(id); },
    money: (value: number) => formatPricingMoney(value, props.currency, props.locale),
    parts: (value: number) => moneyParts(value, props.currency, props.locale),
  };
}
/** Monthly price, or the monthly equivalent of the annual price. */
function perMonth(plan: PricingPlan, billing: PricingPeriod) { return billing === "yearly" ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice; }
function annualSavings(plan: PricingPlan) { return Math.max(0, plan.monthlyPrice * 12 - plan.annualPrice); }

function YearlyBadge({ children, tone = "pill" }: { children: ReactNode; tone?: "pill" | "soft" | "accent" | "mono" }) {
  if (tone === "soft") return <span className="ml-2 text-xs opacity-70">{children}</span>;
  if (tone === "accent") return <span className="text-xs font-medium text-accent">{children}</span>;
  return <span className={cn("rounded-full bg-accent px-1.5 py-0.5 text-xs font-medium leading-none text-accent-foreground", tone === "mono" && "font-mono")}>{children}</span>;
}
/** Pricing segments select with a raised surface pill and foreground label, like a segmented control. */
const SEGMENT = "[&>[data-tabs-label]]:text-foreground";
function Billing({ value, onChange, label = "Billing period", yearlyLabel = "Yearly", badge, badgeTone, listClassName, triggerClassName, className }: { value: PricingPeriod; onChange: (next: PricingPeriod) => void; label?: string; yearlyLabel?: string; badge?: string; badgeTone?: "pill" | "soft" | "accent" | "mono"; listClassName?: string; triggerClassName?: string; className?: string }) {
  return <Tabs value={value} onValueChange={(next) => onChange(next === "yearly" ? "yearly" : "monthly")} className={className}><TabsList aria-label={label} className={listClassName}><TabsTrigger value="monthly" className={cn(SEGMENT, triggerClassName)} indicatorClassName="bg-background">Monthly</TabsTrigger><TabsTrigger value="yearly" className={cn(SEGMENT, triggerClassName)} indicatorClassName="bg-background">{badge ? badgeTone === "soft" ? <>{yearlyLabel}<YearlyBadge tone="soft">{badge}</YearlyBadge></> : <span className={cn("flex items-center", badgeTone === "accent" ? "gap-2" : "gap-1.5")}>{yearlyLabel}<YearlyBadge tone={badgeTone}>{badge}</YearlyBadge></span> : yearlyLabel}</TabsTrigger></TabsList></Tabs>;
}
/** Currency amount whose number slides in when the value changes. */
function Amount({ value, parts, className, symbolClassName, children }: { value: number; parts: (value: number) => MoneyParts; className?: string; symbolClassName?: string; children?: ReactNode }) {
  const reduce = useReducedMotion();
  const { symbol, number } = parts(value);
  return <span className={cn("inline-flex items-baseline font-sans tabular-nums text-foreground", className)}><span className={symbolClassName}>{symbol}</span><span className="relative inline-flex h-[1.24em] items-center overflow-hidden px-[0.06em] align-bottom"><span className="invisible">{number}</span><AnimatePresence initial={false}><motion.span key={number} initial={reduce ? { opacity: 0 } : { y: "70%", opacity: 0, filter: "blur(4px)" }} animate={{ y: 0, opacity: 1, filter: "blur(0px)" }} exit={reduce ? { opacity: 0 } : { y: "-70%", opacity: 0, filter: "blur(4px)" }} transition={{ duration: reduce ? 0 : 0.35, ease: EASE_OUT }} className="absolute inset-y-0 right-[0.06em] left-[0.06em] flex items-center leading-[1.1]">{number}</motion.span></AnimatePresence></span>{children}</span>;
}
/** Currency amount whose digits roll individually. */
function RollingAmount({ value, parts, className }: { value: number; parts: (value: number) => MoneyParts; className?: string }) {
  const { symbol, number, major, decimals } = parts(value);
  return <NumberTicker value={major} decimals={decimals} prefix={symbol} format={() => number} startOnView={false} blur className={className} />;
}
/** Short text that crossfades vertically when it changes. */
function SwapText({ children, className }: { children: string; className?: string }) {
  const reduce = useReducedMotion();
  return <div className={cn("relative overflow-hidden", className)}><AnimatePresence initial={false} mode="popLayout"><motion.p key={children} initial={reduce ? { opacity: 0 } : { y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: "-100%", opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25, ease: EASE_OUT }}>{children}</motion.p></AnimatePresence></div>;
}
function Choose({ quote, onChoose, children, variant = "primary", icon = "arrow", className, wrapperClassName }: { quote: PricingQuote; onChoose: PricingProps["onChoose"]; children: ReactNode; variant?: "primary" | "outline"; icon?: "arrow" | "up-right" | "none"; className?: string; wrapperClassName?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  return <div className={cn("space-y-2", wrapperClassName)}><Button variant={variant} className={cn("group w-full rounded-full", className)} disabled={pending} aria-busy={pending} onClick={async () => {
    if (locked.current) return;
    locked.current = true; setPending(true); setError("");
    try { await onChoose(quote); } catch (reason) { if (mounted.current) setError(reason instanceof Error ? reason.message : "Unable to continue. Please try again."); }
    finally { locked.current = false; if (mounted.current) setPending(false); }
  }}>{pending ? "Continuing…" : children}{!pending && icon === "arrow" && <ArrowRight aria-hidden="true" className="size-4" />}{!pending && icon === "up-right" && <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />}</Button>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}
function CheckBubble({ strong, className }: { strong?: boolean; className?: string }) {
  return <span aria-hidden="true" className={cn("flex size-4 shrink-0 items-center justify-center rounded-full", strong ? "bg-foreground text-background" : "bg-muted text-foreground", className)}><Check className="size-2.5" /></span>;
}
function Empty() { return <p className="text-sm text-muted-foreground">No plans are currently available.</p>; }
/** Rotating border highlight; static under reduced motion. */
function BorderBeam() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return <div aria-hidden="true" className="pointer-events-none absolute -inset-px overflow-hidden rounded-3xl p-px [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)]"><motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,color-mix(in_oklab,var(--primary)_55%,transparent)_320deg,transparent_360deg)]" /></div>;
}
const AURORA_BARS = [331.2, 434.3, 522.9, 593.1, 633.6, 593.1, 522.9, 434.3, 331.2].map((height, index) => ({ id: `bar-${index}`, height, x: -8.5 + index * 71.1, index }));
/** Nine blurred gradient columns rising toward the centre. */
function AuroraBars({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const id = useId();
  return <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden bg-[#f7f4f0] dark:bg-[#0b0c0f] dark:[--aurora-0:#bc3d65] dark:[--aurora-1:#ba4f62] dark:[--aurora-2:#ba664a] dark:[--aurora-3:#d3a971] dark:[--aurora-4:#e8c790]", className)}><div className="absolute -inset-x-[20%] -bottom-[9%] h-[91%] origin-bottom [mask-image:linear-gradient(to_top,black_4%,black_65%,transparent_100%)]"><svg aria-hidden="true" className="size-full" viewBox="0 0 640 720" preserveAspectRatio="none" fill="none"><defs><linearGradient id={`${id}-fill`} x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stopColor="var(--aurora-0, #f8e4df)" /><stop offset="25%" stopColor="var(--aurora-1, #ee9eaf)" /><stop offset="50%" stopColor="var(--aurora-2, #e96882)" /><stop offset="75%" stopColor="var(--aurora-3, #f2a165)" /><stop offset="100%" stopColor="var(--aurora-4, #ffd69e)" /></linearGradient><filter id={`${id}-blur`} x="-45%" y="-42%" width="190%" height="190%"><feGaussianBlur stdDeviation="34" /></filter></defs>{AURORA_BARS.map(({ id: bar, height, x, index }) => <motion.rect key={bar} x={x} y={720 - height} width={88.2} height={height} rx={37} fill={`url(#${id}-fill)`} filter={`url(#${id}-blur)`} opacity={0.65} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} animate={reduce ? undefined : { scaleY: [1, 0.9 + (index % 3) * 0.04, 1] }} transition={{ duration: 6 + index * 0.4, repeat: Infinity, ease: "easeInOut" }} />)}</svg></div><div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f7f4f0_8%,rgba(247,244,240,0.67)_38%,rgba(247,244,240,0.04)_100%)] dark:bg-[linear-gradient(to_bottom,#0b0c0f_8%,rgba(11,12,15,0.67)_38%,rgba(11,12,15,0.04)_100%)]" /></div>;
}
const MIST_LAYERS = Array.from({ length: 5 }, (_, layer) => {
  const points = Array.from({ length: 97 }, (_, point) => {
    const x = point * 8 - 64;
    const y = 110 + layer * 24 + Math.sin(x * .018 + layer * .6) * 30 + Math.sin(x * .047 + layer) * 12 + Math.sin(x * .093 + layer * .8) * 4;
    return `${x},${y.toFixed(2)}`;
  });
  return { id: `mist-${layer}`, path: `M${points.join(" L")} L704,360 L-64,360 Z`, layer };
});
/** Layered drifting contours keep the mist readable without requiring a GPU context. */
function PricingMist({ colors, className }: { colors: string[]; className?: string }) {
  const reduce = useReducedMotion();
  return <div aria-hidden="true" className={cn("relative size-full overflow-hidden", className)} style={{ background: `linear-gradient(to top, ${colors[1]}, ${colors[0]})` }}><svg aria-hidden="true" className="size-full" viewBox="0 0 640 360" preserveAspectRatio="none">{MIST_LAYERS.map(({ id, path, layer }) => <motion.path key={id} d={path} fill={`color-mix(in srgb, ${colors[2]} ${28 + layer * 12}%, ${colors[1]})`} opacity={.48} animate={reduce ? { x: 0, y: 0 } : { x: [0, layer % 2 ? 22 : -22, 0], y: [0, -5, 0] }} transition={{ duration: 12 + layer * 2, repeat: Infinity, ease: "easeInOut" }} />)}</svg><div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 58% 110%, ${colors[3] ?? colors[2]}, transparent 65%)` }} /></div>;
}
function PlanTabs({ plans, value, onChange, label = "Plan" }: { plans: PricingPlan[]; value?: string; onChange: (id: string) => void; label?: string }) {
  return <Tabs value={value ?? ""} onValueChange={onChange}><TabsList aria-label={label} className="grid w-full auto-cols-fr grid-flow-col">{plans.map((plan) => <TabsTrigger key={plan.id} value={plan.id} className={cn(SEGMENT, "w-full justify-center")} indicatorClassName="bg-background">{plan.name}</TabsTrigger>)}</TabsList></Tabs>;
}
function useSeats(props: SeatPricingProps): SeatModel {
  const min = Math.max(1, Math.round(props.minSeats ?? 1));
  const max = Math.max(min, Math.round(props.maxSeats ?? 100));
  const [internal, setInternal] = useState(props.defaultSeats ?? min);
  const seats = Math.min(max, Math.max(min, Math.round(props.seats ?? internal)));
  const setSeats = (value: number) => { const next = Math.max(min, Math.min(max, Math.round(value))); if (props.seats === undefined) setInternal(next); props.onSeatsChange?.(next); };
  const discount = (props.volumeDiscounts ?? []).reduce((best, tier) => seats >= tier.minSeats && tier.minSeats > best.minSeats ? tier : best, { minSeats: 0, basisPoints: 0 });
  return { seats, setSeats, min, max, basisPoints: discount.basisPoints };
}
function Stepper({ state, label, size = "md" }: { state: SeatModel; label: string; size?: "sm" | "md" }) {
  const small = size === "sm";
  return <div className={cn("flex items-center", small ? "gap-1" : "gap-2")}><Button variant="outline" aria-label={`Remove one ${label}`} disabled={state.seats <= state.min} onClick={() => state.setSeats(state.seats - 1)} className={cn("rounded-full p-0", small ? "size-8" : "size-9")}><Minus aria-hidden="true" className={small ? "size-3.5" : "size-4"} /></Button><output aria-label={`Selected ${label}s`} className={cn("text-center font-medium tabular-nums", small ? "w-8 text-sm" : "min-w-10 text-xl")}>{state.seats}</output><Button variant="outline" aria-label={`Add one ${label}`} disabled={state.seats >= state.max} onClick={() => state.setSeats(state.seats + 1)} className={cn("rounded-full p-0", small ? "size-8" : "size-9")}><Plus aria-hidden="true" className={small ? "size-3.5" : "size-4"} /></Button></div>;
}
function plural(count: number, word: string) { return `${count} ${word}${count === 1 ? "" : "s"}`; }
function people(count: number) { return count === 1 ? "1 person" : `${count} people`; }

export interface AIPricingProps extends PricingProps {
  proPlanId: string;
  /** Explicit complete monthly and annual prices for each Pro usage level. */
  proUsagePrices: { multiplier: number; monthlyPrice: number; annualPrice: number; description?: string }[];
}
export function AIPricing(props: AIPricingProps) {
  const model = usePricing(props);
  const [level, setLevel] = useState(props.proUsagePrices[0]?.multiplier);
  const selected = props.proUsagePrices.find((item) => item.multiplier === level) ?? props.proUsagePrices[0];
  return <section data-pricing="ai" className={cn("w-full bg-background text-foreground", props.className)}><div className="mx-auto max-w-7xl px-6 pb-16 sm:px-10">
    <div className="mx-auto max-w-2xl pt-10 pb-9 text-center sm:pt-16">{props.eyebrow && <p className="mb-4 text-xs font-medium text-muted-foreground">{props.eyebrow}</p>}<h2 className="text-balance text-4xl font-medium tracking-tight">{props.title ?? "A little help. A bigger possibility."}</h2>{props.description && <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{props.description}</p>}<div className="mt-7"><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} triggerClassName="h-9 px-4" /></div></div>
    <div className="grid gap-4 lg:grid-cols-3">{props.plans.map((source) => {
      const pro = source.id === props.proPlanId && selected;
      const plan = pro ? { ...source, monthlyPrice: selected.monthlyPrice, annualPrice: selected.annualPrice, description: selected.description ?? source.description } : source;
      const price = perMonth(plan, model.billing);
      const quote = calculatePricingQuote(plan, model.billing, 1, props.currency);
      const choose = pro ? { ...quote, usageMultiplier: selected.multiplier } : quote;
      return <article key={plan.id} className="relative isolate flex flex-col rounded-3xl border border-border bg-background p-6 sm:p-7">{plan.featured && <BorderBeam />}
        <div className="flex min-h-11 items-center justify-between gap-4"><h3 className="text-xl font-medium">{plan.name}</h3>{pro && <Tabs value={String(selected.multiplier)} onValueChange={(next) => setLevel(Number(next))}><TabsList aria-label={`${plan.name} usage`} className="gap-0.5">{props.proUsagePrices.map((tier) => <TabsTrigger key={tier.multiplier} value={String(tier.multiplier)} className={cn(SEGMENT, "h-7 min-w-12 px-3 py-1 text-xs")} indicatorClassName="bg-background">{tier.multiplier}x</TabsTrigger>)}</TabsList></Tabs>}</div>
        <div className="mt-6 flex items-baseline gap-1.5"><Amount value={price} parts={model.parts} className="text-5xl font-medium tracking-tight" /><span className="text-sm text-muted-foreground">{plan.priceSuffix ?? (plan.monthlyPrice === 0 ? "/ forever" : "/ month")}</span></div>
        <p className="mt-1 min-h-5 text-xs text-muted-foreground">{plan.monthlyPrice === 0 ? plan.note ?? "No credit card needed" : model.billing === "yearly" ? `${model.money(plan.annualPrice)} billed yearly` : "Billed monthly"}</p>
        <div className="my-6 min-h-20"><p className="pt-3 text-sm leading-6 text-muted-foreground">{plan.description}</p></div>
        <Choose quote={choose} onChoose={props.onChoose} variant={plan.featured ? "primary" : "outline"} className="h-10">{plan.actionLabel ?? `Choose ${plan.name}`}{pro ? ` ${selected.multiplier}×` : ""}</Choose>
        {plan.benefitsLabel && <p className="mt-7 mb-4 text-xs font-medium">{plan.benefitsLabel}</p>}<ul className={cn("space-y-3", !plan.benefitsLabel && "mt-7")}>{plan.benefits.map((benefit) => <li key={benefit} className="flex gap-2.5 text-sm leading-5 text-muted-foreground"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground" />{benefit}</li>)}</ul>
      </article>;
    })}</div>{props.plans.length === 0 && <Empty />}
    {props.footnote && <p className="mt-5 text-center text-xs leading-5 text-muted-foreground">{props.footnote}</p>}
  </div></section>;
}
export interface SharedBenefitsPricingProps extends PricingProps { benefits: string[]; banner?: ReactNode; benefitsTitle?: string }
export function SharedBenefitsPricing(props: SharedBenefitsPricingProps) {
  const model = usePricing(props);
  const id = useId();
  const quote = model.plan && calculatePricingQuote(model.plan, model.billing, 1, props.currency);
  return <section data-pricing="shared-benefits" className={cn("w-full bg-background px-6 py-12 text-foreground sm:px-10 sm:py-16", props.className)}><div className="mx-auto max-w-5xl">
    <div className="mb-9 max-w-2xl"><h2 className="text-balance text-4xl font-medium tracking-tight">{props.title ?? "The same great tools. Your kind of space."}</h2>{props.description && <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">{props.description}</p>}</div>
    <div className="grid overflow-hidden rounded-3xl lg:grid-cols-2">
      <div className="min-w-0 p-5 sm:p-7">{props.banner && <div className="overflow-hidden rounded-2xl">{props.banner}</div>}<div className="px-1 pt-7 pb-2"><p className="mb-2 text-xs text-muted-foreground">Always included</p><h3 className="text-xl font-medium tracking-tight">{props.benefitsTitle ?? "A good foundation, on every plan."}</h3><ul className="mt-6 space-y-4">{props.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-sm leading-5 text-muted-foreground"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground" />{benefit}</li>)}</ul></div></div>
      <div className="min-w-0 p-6 sm:p-8"><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h3 className="text-xl font-medium">Make it yours.</h3><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} triggerClassName="h-8 px-3.5 text-xs" /></div>
        <fieldset className="space-y-3"><legend className="sr-only">Choose your plan</legend>{props.plans.map((plan) => { const active = model.plan?.id === plan.id; return <label key={plan.id} className="relative block cursor-pointer"><input type="radio" name={id} value={plan.id} checked={active} onChange={() => model.setPlan(plan.id)} className="peer sr-only" /><span className={cn("flex items-center gap-4 rounded-2xl border border-border p-4 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring", active ? "bg-muted" : "bg-background")}><span aria-hidden="true" className={cn("grid size-5 shrink-0 place-items-center rounded-full border transition-colors", active ? "border-foreground" : "border-border")}><span className={cn("size-2.5 rounded-full bg-foreground transition-transform motion-reduce:transition-none", active ? "scale-100" : "scale-0")} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-medium">{plan.name}</span><span className="mt-1 block text-xs text-muted-foreground">{plan.description}</span></span><span className="shrink-0 text-right"><span className="block text-base font-medium tabular-nums">{model.money(perMonth(plan, model.billing))}</span><span className="text-xs text-muted-foreground">/ month</span></span></span></label>; })}</fieldset>
        {model.plan && quote ? <div className="mt-6 border-t border-border pt-5">{model.plan.note && <p className="mb-3 text-xs leading-5 text-muted-foreground">{model.plan.note}</p>}<div className="flex flex-wrap items-baseline gap-1"><Amount value={perMonth(model.plan, model.billing)} parts={model.parts} className="text-4xl font-medium tracking-tight" /><span className="text-xs text-muted-foreground">/ month</span></div><p className="mt-1 text-xs text-muted-foreground">{model.billing === "yearly" ? `${model.money(model.plan.annualPrice)} billed yearly` : "Billed monthly"}</p><Choose quote={quote} onChoose={props.onChoose} className="h-9" wrapperClassName="mt-5">Continue with {model.plan.name}</Choose></div> : <Empty />}
      </div>
    </div>
  </div></section>;
}
export function TeamCalculatorPricing(props: SeatPricingProps) {
  const model = usePricing(props); const seats = useSeats(props);
  const plan = model.plan;
  const quote = plan && calculatePricingQuote(plan, model.billing, seats.seats, props.currency, seats.basisPoints);
  const gross = plan ? plan.monthlyPrice * seats.seats : 0;
  const volume = Math.round(gross * seats.basisPoints / 10000);
  const due = quote ? model.billing === "yearly" ? Math.round(quote.total / 12) : quote.total : 0;
  const yearly = model.billing === "yearly" ? gross - volume - due : 0;
  const yearlyPercent = plan && plan.monthlyPrice > 0 ? Math.round(annualSavings(plan) / (plan.monthlyPrice * 12) * 100) : 0;
  const tiers = [...(props.volumeDiscounts ?? [])].sort((a, b) => a.minSeats - b.minSeats);
  const next = tiers.find((tier) => tier.minSeats > seats.seats);
  const active = tiers.filter((tier) => tier.minSeats <= seats.seats).at(-1);
  return <section data-pricing="team-calculator" className={cn("w-full bg-background px-6 py-12 text-foreground sm:px-10 sm:py-16", props.className)}><div className="mx-auto max-w-5xl">
    <div className="mb-9 max-w-xl">{props.eyebrow && <p className="mb-3 text-xs font-medium text-muted-foreground">{props.eyebrow}</p>}<h2 className="text-balance text-4xl font-medium tracking-tight">{props.title ?? "Good work gets better together."}</h2>{props.description && <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">{props.description}</p>}</div>
    <div className="grid overflow-hidden rounded-3xl border border-border lg:grid-cols-[1.3fr_1fr]">
      <div className="min-w-0 p-6 sm:p-8">
        <div className="flex items-center gap-3"><span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-muted"><Users className="size-5" /></span><div><h3 className="text-xl font-medium">Your team, your size.</h3><p className="mt-1 text-xs text-muted-foreground">From {seats.min} to {seats.max} people</p></div></div>
        {props.plans.length > 1 && <div className="mt-6"><PlanTabs plans={props.plans} value={plan?.id} onChange={model.setPlan} /></div>}
        <div className="mt-8 mb-4 flex items-center justify-between gap-4"><p className="text-sm font-medium">Team members</p><Stepper state={seats} label={props.seatLabel ?? "seat"} /></div>
        <RangeSlider value={seats.seats} min={seats.min} max={seats.max} step={1} onValueChange={seats.setSeats} aria-label="Team size" showTicks={false} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{people(seats.min)}</span><span>{people(seats.max)}</span></div>
        <p aria-live="polite" className="mt-5 min-h-10 text-xs leading-5 text-muted-foreground">{next ? `At ${next.minSeats} seats, save ${next.basisPoints / 100}% on every seat. ` : active ? `Your ${active.basisPoints / 100}% volume discount is applied. ` : ""}Discounts apply automatically.</p>
        {tiers.length > 0 && <ul className="mt-6 flex flex-wrap gap-2">{tiers.map((tier) => <li key={tier.minSeats} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs", active?.minSeats === tier.minSeats ? "border-foreground text-foreground" : "border-border text-muted-foreground")}>{active?.minSeats === tier.minSeats && <Check aria-hidden="true" className="size-3" />}{tier.minSeats}+ seats · {tier.basisPoints / 100}% off</li>)}</ul>}
        {plan && <div className="mt-8 border-t border-border pt-6"><p className="mb-4 text-xs font-medium">Every seat comes with</p><ul className="space-y-3">{plan.benefits.map((benefit) => <li key={benefit} className="flex gap-2.5 text-sm text-muted-foreground"><Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground" />{benefit}</li>)}</ul></div>}
      </div>
      <aside aria-label="Team estimate" className="flex min-w-0 flex-col border-t border-border p-6 sm:p-8 lg:border-t-0 lg:border-l">
        <Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} label="Team billing period" triggerClassName="h-9" />
        {plan && quote ? <><p className="mt-7 mb-3 text-sm text-muted-foreground">Your team total</p><div className="flex flex-wrap items-baseline gap-2"><RollingAmount value={due} parts={model.parts} className="text-5xl font-medium tracking-tight" /><span className="text-sm text-muted-foreground">/ month</span></div><p className="mt-3 text-xs text-muted-foreground">{model.money(quote.total)} billed {model.billing === "yearly" ? "yearly" : "monthly"} · {plural(seats.seats, "seat")}</p>
          <dl className="my-7 space-y-4 border-y border-border py-6 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">{plural(seats.seats, "seat")} × {model.money(plan.monthlyPrice)}</dt><dd className="tabular-nums">{model.money(gross)}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Volume discount ({seats.basisPoints / 100}%)</dt><dd className="tabular-nums">−{model.money(volume)}</dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">Yearly savings ({model.billing === "yearly" ? yearlyPercent : 0}%)</dt><dd className="tabular-nums">−{model.money(yearly)}</dd></div></dl>
          <p className="mb-6 text-xs leading-5 text-muted-foreground">{model.billing === "yearly" ? `Yearly billing saves ${yearlyPercent}% after your volume discount.` : `Choose yearly billing to save another ${yearlyPercent}% after your volume discount.`}</p>
          <Choose quote={quote} onChoose={props.onChoose} className="h-9">Start with {plural(seats.seats, "seat")}</Choose><p className="mt-3 text-center text-xs text-muted-foreground">{props.footnote ?? "Taxes calculated at checkout."}</p></> : <Empty />}
      </aside>
    </div>
  </div></section>;
}
export function AuroraDuoPricing(props: PricingProps) {
  const model = usePricing(props);
  return <section data-pricing="aurora-duo" className={cn("w-full px-4 py-20 text-foreground sm:px-8", props.className)}><div className="mx-auto w-full max-w-4xl">
    <header className="mx-auto flex max-w-2xl flex-col items-center text-center">{props.eyebrow && <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{props.eyebrow}</p>}<h2 className="mt-5 text-balance text-4xl font-medium leading-tight tracking-tight">{props.title ?? "Start simple. Upgrade when the work earns it."}</h2>{props.description && <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{props.description}</p>}<div className="mt-7"><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} badge={props.yearlyBadge} badgeTone="soft" listClassName="border border-border" triggerClassName="min-h-10 px-4" /></div></header>
    <div className="mt-10 grid gap-3 md:grid-cols-2">{props.plans.map((plan) => <article key={plan.id} className="relative flex min-h-[34rem] flex-col overflow-hidden rounded-3xl border border-border bg-transparent p-6 sm:p-7">
      {plan.featured && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-72 overflow-hidden [mask-image:linear-gradient(to_top,black_18%,black_68%,transparent_100%)]"><PricingMist colors={["var(--mist-base, #f3f3ef)", "var(--mist-low, #b4c7cc)", "var(--mist-contour, #95bcc5)", "var(--mist-glow, #4cc8db)"]} className="absolute -inset-x-[20%] -bottom-[8%] h-[122%] w-[140%] dark:[--mist-base:#0c1518] dark:[--mist-low:#20333d] dark:[--mist-contour:#35576b] dark:[--mist-glow:#4e8d9e]" /></div>}
      <div className="relative z-10 flex flex-1 flex-col"><h3 className="text-xl font-medium">{plan.name}</h3><Amount value={perMonth(plan, model.billing)} parts={model.parts} className="mt-5 text-5xl font-medium tracking-tight"><span className="pl-1 font-sans text-base tracking-normal text-muted-foreground">/month</span></Amount><p className="mt-5 max-w-sm text-pretty text-sm leading-6 text-muted-foreground">{plan.description}</p>
        <div className="my-7 flex items-center gap-3 text-xs tracking-widest text-muted-foreground uppercase"><span aria-hidden="true" className="h-px flex-1 bg-border" />{plan.benefitsLabel ?? "Plan includes"}<span aria-hidden="true" className="h-px flex-1 bg-border" /></div>
        <ul className="space-y-3.5">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-3 text-sm text-foreground/75"><Check aria-hidden="true" className="size-4 shrink-0 text-foreground" />{benefit}</li>)}</ul>
        <div className="mt-auto pt-8"><Choose quote={calculatePricingQuote(plan, model.billing, 1, props.currency)} onChoose={props.onChoose} variant={plan.featured ? "primary" : "outline"} icon={plan.featured ? "arrow" : "none"} className="h-9 px-6 text-base">{plan.actionLabel ?? `Continue with ${plan.name}`}</Choose></div></div>
    </article>)}</div>{!props.plans.length && <Empty />}
  </div></section>;
}
const LIFETIME_ICONS = [Blocks, Sparkles, CircleArrowUp, RefreshCcw, BadgeCheck];
export interface AuroraFlowPricingProps { plan: Omit<PricingPlan, "monthlyPrice" | "annualPrice">; lifetimePrice: number; currency: string; locale?: string; onChoose: PricingProps["onChoose"]; eyebrow?: string; title?: string; tagline?: string; className?: string }
export function AuroraFlowPricing(props: AuroraFlowPricingProps) {
  const parts = (value: number) => moneyParts(value, props.currency, props.locale);
  const quote: PricingQuote = { planId: props.plan.id, period: "lifetime", quantity: 1, unitPrice: props.lifetimePrice, subtotal: props.lifetimePrice, discount: 0, total: props.lifetimePrice, currency: props.currency };
  return <section data-pricing="aurora-flow" className={cn("w-full overflow-hidden bg-background px-4 py-20 text-foreground sm:px-8 sm:py-28", props.className)}><div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-20">
    <div className="max-w-xl">{props.eyebrow && <p className="font-mono text-xs tracking-[0.17em] text-muted-foreground uppercase">{props.eyebrow}</p>}<h2 className="mt-6 text-balance text-4xl font-medium leading-tight tracking-[-0.055em]">{props.title ?? "Own the source. Keep every update."}</h2><p className="mt-6 max-w-md text-pretty text-base leading-7 text-muted-foreground">{props.plan.description}</p>{props.tagline && <div className="mt-9 flex items-center gap-3 font-mono text-xs tracking-[0.1em] text-muted-foreground uppercase"><span aria-hidden="true" className="h-px w-10 bg-border" />{props.tagline}</div>}</div>
    <article className="relative mx-auto flex min-h-[42rem] w-full max-w-[35rem] flex-col overflow-hidden rounded-3xl text-[#141714] dark:text-white"><AuroraBars />
      <div className="relative z-10 flex flex-1 flex-col p-7 sm:p-10">
        <div className="flex items-center justify-between gap-4"><h3 className="text-xl font-medium tracking-[-0.03em]">{props.plan.name}</h3>{props.plan.badge && <span className="rounded-full bg-black/5 px-3 py-1.5 font-mono text-xs tracking-[0.12em] text-black/55 uppercase dark:bg-white/8 dark:text-white/62">{props.plan.badge}</span>}</div>
        <div className="mt-8"><Amount value={props.lifetimePrice} parts={parts} className="text-7xl tracking-[-0.075em] text-black/52 sm:text-8xl dark:text-white/62"><span className="pl-1 font-sans text-base tracking-normal text-black/55 dark:text-white/62">one time</span></Amount></div>
        <ul className="mt-10 space-y-4">{props.plan.benefits.map((benefit, index) => { const Icon = LIFETIME_ICONS[index % LIFETIME_ICONS.length]; return <li key={benefit} className="flex items-center gap-4 text-base text-black/58 sm:text-lg dark:text-white/64"><span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-black/6 text-black/72 dark:bg-white/8 dark:text-white/72"><Icon className="size-[1.1rem]" /></span><span>{benefit}</span></li>; })}</ul>
        <div className="mt-auto pt-10"><Choose quote={quote} onChoose={props.onChoose} icon="none" className="h-9 bg-black px-6 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/88">{props.plan.actionLabel ?? "Get lifetime access"}</Choose></div>
      </div>
    </article>
  </div></section>;
}
const VISUAL_ART = [
  ["absolute -top-20 -left-14 size-72 rounded-full blur-2xl bg-[radial-gradient(circle_at_66%_65%,rgba(255,255,255,0.94)_0%,rgba(254,179,156,0.72)_26%,rgba(45,205,202,0.14)_62%,transparent_74%)]", "absolute -right-12 -bottom-24 h-64 w-80 rounded-full blur-xl bg-[radial-gradient(rgba(255,255,255,0.82)_0%,rgba(32,188,210,0.28)_48%,transparent_72%)]", "absolute inset-0 opacity-45 [background-image:repeating-radial-gradient(ellipse_at_22%_118%,transparent_0,transparent_18px,rgba(255,255,255,0.48)_19px,transparent_20px)]", "bg-[linear-gradient(135deg,#7ad8dd,#c8eef0_55%,#5cc6d8)]"],
  ["absolute -right-10 -bottom-24 size-72 rounded-full blur-lg bg-[radial-gradient(circle_at_44%_40%,#fff7c2_0%,#ffba4a_27%,#f36b4f_51%,rgba(238,69,91,0.22)_68%,transparent_74%)]", "absolute -bottom-20 -left-20 h-44 w-80 rounded-full blur-2xl bg-[radial-gradient(rgba(255,188,94,0.82)_0%,rgba(245,100,91,0.34)_48%,transparent_72%)]", "absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.55)_0,rgba(255,255,255,0.55)_1px,transparent_1px,transparent_3px)]", "bg-[linear-gradient(135deg,#7fb6e8,#d9e6f5_45%,#f7b46a)]"],
];
export function VisualPlansPricing(props: PricingProps) {
  const model = usePricing(props);
  const reduce = useReducedMotion();
  return <section data-pricing="visual-plans" className={cn("w-full px-4 py-20 text-foreground sm:px-8", props.className)}><div className="mx-auto w-full max-w-4xl">
    <header className="mx-auto flex max-w-2xl flex-col items-center text-center"><span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-muted"><Gem className="size-4" /></span>{props.eyebrow && <p className="mt-5 text-xs font-medium tracking-widest text-muted-foreground uppercase">{props.eyebrow}</p>}<h2 className="mt-4 text-balance text-4xl font-medium leading-tight tracking-tight">{props.title ?? "Start free. Bring us in when the stakes rise."}</h2>{props.description && <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{props.description}</p>}</header>
    <div className="mt-10 grid gap-4 md:grid-cols-2">{props.plans.map((plan, index) => { const art = VISUAL_ART[index % VISUAL_ART.length]; const price = perMonth(plan, model.billing); return <article key={plan.id} className="flex min-h-[34rem] flex-col overflow-hidden rounded-3xl border border-border bg-transparent">
      <div aria-hidden="true" className="h-36 overflow-hidden border-b border-border"><div className={cn("relative size-full overflow-hidden", art[3])}><motion.div animate={reduce ? undefined : { x: [0, 14, 0], y: [0, 8, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} className={art[0]} /><motion.div animate={reduce ? undefined : { x: [0, -12, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} className={art[1]} /><div className={art[2]} /></div></div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4"><div><h3 className="text-xl font-medium">{plan.name}</h3><div className="mt-2 flex items-baseline gap-1.5">{plan.priceLabel ?? (price === 0 ? <span className="font-sans text-2xl font-medium tracking-tight">Free</span> : <><span className="font-sans text-2xl font-medium tracking-tight">{model.money(price)}</span><span className="text-sm text-muted-foreground">/month</span></>)}</div></div>{plan.badge && <span className="shrink-0 rounded-full bg-gradient-to-r from-primary/10 via-muted to-background px-2.5 py-1 text-xs font-medium whitespace-nowrap text-muted-foreground">{plan.badge}</span>}</div>
        <p className="mt-5 max-w-md text-pretty text-sm leading-6 text-muted-foreground">{plan.description}</p>
        <div className="mt-7 border-t border-border pt-6"><p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{plan.benefitsLabel ?? "What you get"}</p><ul className="mt-4 space-y-3.5">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-3 text-sm leading-5 text-foreground/75"><CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-foreground" /><span>{benefit}</span></li>)}</ul></div>
        <div className="mt-auto pt-8"><Choose quote={calculatePricingQuote(plan, model.billing, 1, props.currency)} onChoose={props.onChoose} variant={plan.featured ? "primary" : "outline"} icon="none" className="h-9 px-6 text-base">{plan.actionLabel ?? `Choose ${plan.name}`}</Choose></div>
      </div>
    </article>; })}</div>{!props.plans.length && <Empty />}
  </div></section>;
}
export function PricingCommandDeck(props: PricingProps) {
  const model = usePricing(props);
  return <section data-pricing="command-deck" className={cn("w-full bg-background px-4 py-16 text-foreground sm:px-8 sm:py-24", props.className)}><div className="mx-auto max-w-6xl">
    <header className="mx-auto flex max-w-2xl flex-col items-center text-center">{props.eyebrow && <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">{props.eyebrow}</span>}<h2 className="mt-4 text-balance text-4xl font-medium tracking-tight">{props.title ?? "One plan for every stage of the work."}</h2>{props.description && <p className="mt-3 max-w-xl text-balance text-sm leading-6 text-muted-foreground sm:text-base">{props.description}</p>}</header>
    <div className="mt-8 flex justify-center"><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} badge={props.yearlyBadge} badgeTone="mono" /></div>
    <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{props.plans.map((plan, index) => { const savings = annualSavings(plan); return <article key={plan.id} className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-background">
      {plan.featured && <div className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-55 mask-[linear-gradient(to_bottom,black,transparent)]"><PricingMist colors={["var(--mist-base, #eef4ff)", "var(--mist-low, #a9c8ff)", "var(--mist-contour, #6ea2ff)"]} className="absolute inset-0 dark:[--mist-base:#10203b] dark:[--mist-low:#1a3562] dark:[--mist-contour:#1e3c6a]" /></div>}
      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-medium">{plan.name}</h3><span className="rounded-full bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground tabular-nums shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">{String(index + 1).padStart(2, "0")}</span></div>
        <p className="mt-2 min-h-10 text-pretty text-sm leading-5 text-muted-foreground">{plan.description}</p>
        <div className="mt-6">{plan.priceLabel ? <p className="font-mono text-5xl font-medium leading-tight tracking-tight">{plan.priceLabel}</p> : <div className="flex items-baseline gap-2"><Amount value={perMonth(plan, model.billing)} parts={model.parts} className="font-mono text-5xl font-medium tracking-tight" /><span className="font-mono text-xs text-muted-foreground">{plan.priceSuffix ?? "/ month"}</span></div>}<SwapText className="mt-2 h-4 font-mono text-xs text-muted-foreground tabular-nums">{plan.priceLabel ? plan.note ?? "Custom agreement" : model.billing === "yearly" ? `${model.money(plan.annualPrice)} billed yearly${savings > 0 ? ` · save ${model.money(savings)}` : ""}` : "Billed monthly"}</SwapText></div>
        <ul className="mt-6 space-y-3">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2.5 text-sm"><CheckBubble strong={plan.featured} />{benefit}</li>)}</ul>
        <div className="mt-auto pt-6"><Choose quote={calculatePricingQuote(plan, model.billing, 1, props.currency)} onChoose={props.onChoose} variant={plan.featured ? "primary" : "outline"} icon="up-right" className="h-10">{plan.actionLabel ?? `Choose ${plan.name}`}</Choose></div>
      </div>
    </article>; })}</div>{!props.plans.length && <Empty />}
  </div></section>;
}
export function UpgradePanelPricing(props: SeatPricingProps & { helpHref?: string }) {
  const model = usePricing(props); const seats = useSeats(props); const reduce = useReducedMotion();
  const plan = model.plan;
  const unit = props.seatLabel ?? "seat";
  const quote = plan && calculatePricingQuote(plan, model.billing, seats.seats, props.currency, seats.basisPoints);
  const months = model.billing === "yearly" ? 12 : 1;
  const gross = plan ? plan.monthlyPrice * seats.seats * months : 0;
  const yearlyDiscount = quote && model.billing === "yearly" ? gross - quote.subtotal : 0;
  const savingsPercent = plan && plan.monthlyPrice > 0 ? Math.round(annualSavings(plan) / (plan.monthlyPrice * 12) * 100) : 0;
  const move = (delta: number) => { const next = props.plans[Math.max(0, Math.min(props.plans.length - 1, props.plans.findIndex((item) => item.id === plan?.id) + delta))]; if (next) model.setPlan(next.id); };
  return <div data-pricing="upgrade-panel" className={cn("mx-auto w-full max-w-5xl px-4 text-foreground", props.className)}><div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-12">
    <div className="mx-auto w-full max-w-sm"><div className="relative">
      <div aria-hidden="true" className="absolute inset-0 -translate-x-5 translate-y-2 scale-95 rounded-3xl border border-border" /><div aria-hidden="true" className="absolute inset-0 translate-x-5 translate-y-2 scale-95 rounded-3xl border border-border" />
      {plan ? <motion.article key={plan.id} drag={reduce ? false : "x"} dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 60) move(info.offset.x < 0 ? 1 : -1); }} initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }} aria-roledescription="plan card" aria-label={plan.name} className="relative flex min-h-96 cursor-grab touch-pan-y flex-col rounded-3xl border border-border bg-background p-6 active:cursor-grabbing">
        <span className="w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">{plan.name}</span>
        <div className="mt-6 flex items-baseline gap-2"><Amount value={perMonth(plan, model.billing)} parts={model.parts} className="text-5xl font-medium tracking-tight" /><span className="text-xs leading-4 text-muted-foreground">per {unit} / month</span></div>
        <div className="mt-6"><p className="text-xl font-medium">{plan.description}</p>{plan.note && <p className="mt-1 text-sm leading-6 text-muted-foreground">{plan.note}</p>}</div>
        <ul className="mt-6 flex flex-col gap-3 border-t border-border pt-5">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2.5 text-sm"><CheckBubble strong />{benefit}</li>)}</ul>
      </motion.article> : <Empty />}
    </div><fieldset aria-label="Plan cards" onKeyDown={(event) => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }} className="m-0 mt-8 flex min-w-0 items-center justify-center gap-2 border-0 p-0">{props.plans.map((item) => <button key={item.id} type="button" aria-label={`Show ${item.name}`} aria-pressed={plan?.id === item.id} onClick={() => model.setPlan(item.id)} className={cn("h-2 rounded-full outline-none transition-[width,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none", plan?.id === item.id ? "w-6 bg-foreground" : "w-2 bg-muted-foreground/30")} />)}</fieldset></div>
    <div className="mx-auto flex w-full max-w-md flex-col">
      <h2 className="text-balance font-sans text-4xl font-medium leading-tight">{props.title ?? "Upgrade to"} <span className="relative inline-flex overflow-hidden align-bottom"><AnimatePresence initial={false} mode="popLayout"><motion.span key={plan?.id} initial={reduce ? { opacity: 0 } : { y: "100%" }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: "-100%" }} transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}>{plan?.name}</motion.span></AnimatePresence></span></h2>
      <div className="mt-8"><PlanTabs plans={props.plans} value={plan?.id} onChange={model.setPlan} label="Choose plan" /></div>
      {plan && quote ? <><div className="mt-4 rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between gap-4"><span className="text-sm font-medium">Billing</span><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} badge={savingsPercent > 0 ? `Save ${savingsPercent}%` : undefined} /></div>
        <div className="mt-4 flex items-center justify-between gap-4"><span className="text-sm font-medium capitalize">{unit}s</span><Stepper state={seats} label={unit} size="sm" /></div>
        <dl className="mt-5 border-t border-border pt-5 text-sm"><div className="flex justify-between gap-4"><dt className="text-muted-foreground">{plan.name} · {plural(seats.seats, unit)} × {plural(months, "month")}</dt><dd className="tabular-nums">{model.money(gross)}</dd></div>{yearlyDiscount > 0 && <div className="flex justify-between gap-4 pt-2"><dt className="text-muted-foreground">Yearly discount</dt><dd className="tabular-nums">−{model.money(yearlyDiscount)}</dd></div>}{quote.discount > 0 && <div className="flex justify-between gap-4 pt-2"><dt className="text-muted-foreground">Volume discount</dt><dd className="tabular-nums">−{model.money(quote.discount)}</dd></div>}</dl>
        <div className="mt-4 flex items-end justify-between gap-4 border-t border-dashed border-border pt-4"><div><p className="text-sm font-medium">Due today</p><p className="mt-0.5 text-xs text-muted-foreground">Renews {model.billing === "yearly" ? "yearly" : "monthly"}</p></div><Amount value={quote.total} parts={model.parts} className="text-3xl font-medium tracking-tight" /></div>
      </div><Choose quote={quote} onChoose={props.onChoose} icon="none" className="h-10" wrapperClassName="mt-4">Upgrade to {plan.name}</Choose></> : <Empty />}
      {props.helpHref && <p className="mt-4 text-center text-sm text-muted-foreground">Need help picking the right plan? <a href={props.helpHref} className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-muted-foreground">Talk to us</a></p>}
    </div>
  </div></div>;
}
export interface UsagePricingTier { id: string; units: number; label: string; monthlyPrice: number; annualPrice: number }
export interface UsageSliderPricingProps extends Omit<PricingProps, "plans" | "selectedPlan" | "defaultSelectedPlan" | "onPlanChange"> { tiers: UsagePricingTier[]; benefits: string[]; tier?: string; defaultTier?: string; onTierChange?: (id: string) => void; /** Plural name of a metered unit, such as "seats". */ unitLabel?: string; actionLabel?: string }
export function UsageSliderPricing(props: UsageSliderPricingProps) {
  const model = usePricing({ ...props, plans: [] }); const [internal, setInternal] = useState(props.defaultTier ?? props.tiers[0]?.id);
  const index = Math.max(0, props.tiers.findIndex((tier) => tier.id === (props.tier ?? internal))); const tier = props.tiers[index];
  const units = props.unitLabel ?? "units";
  const plan = tier && { id: tier.id, name: tier.label, description: "", monthlyPrice: tier.monthlyPrice, annualPrice: tier.annualPrice, benefits: props.benefits };
  const first = props.tiers[0]; const last = props.tiers.at(-1);
  return <div data-pricing="usage-slider" className={cn("mx-auto w-full max-w-xl px-4 text-foreground", props.className)}>{tier && plan && first && last ? <div className="w-full max-w-xl">
    <div className="flex items-end gap-2"><RollingAmount value={perMonth(plan, model.billing)} parts={model.parts} className="font-sans text-6xl leading-none" /><span className="pb-1.5 text-xl text-muted-foreground">/ month</span></div>
    <p aria-live="polite" className="mt-4 text-muted-foreground">{tier.units.toLocaleString(props.locale)} {units} included.</p>
    <div className="mt-7"><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} badge={props.yearlyBadge} badgeTone="accent" /></div>
    <div className="mt-8"><RangeSlider min={0} max={Math.max(0, props.tiers.length - 1)} step={1} value={index} aria-label={`${units} per month`} formatValueText={(value) => { const item = props.tiers[value]; return item ? `${item.units.toLocaleString(props.locale)} ${units}` : ""; }} onValueChange={(value) => { const next = props.tiers[value]; if (next) { if (props.tier === undefined) setInternal(next.id); props.onTierChange?.(next.id); } }} className="h-12" /><div className="mt-3 flex items-center justify-between text-xs font-semibold tracking-wide uppercase"><span>{first.units.toLocaleString(props.locale)} {units}</span><span>{last.units.toLocaleString(props.locale)} {units}</span></div></div>
    <div className="mt-10"><p className="text-sm font-semibold tracking-wide uppercase">Included in every plan</p><ul className="mt-5 flex flex-col gap-3.5">{props.benefits.map((benefit) => <li key={benefit} className="flex gap-3 text-lg leading-7"><span aria-hidden="true" className="text-muted-foreground">—</span><span>{benefit}</span></li>)}</ul></div>
    <div className="mt-9 flex flex-wrap items-center gap-4"><Choose quote={calculatePricingQuote(plan, model.billing, 1, props.currency)} onChoose={props.onChoose} icon="none" className="h-9 w-auto px-6 text-base" wrapperClassName="space-y-2">{props.actionLabel ?? `Choose ${tier.label}`}</Choose>{props.footnote && <p className="text-sm leading-5 text-muted-foreground">{props.footnote}</p>}</div>
  </div> : <p>No usage tiers are currently available.</p>}</div>;
}
export function PlansGridPricing(props: PricingProps) {
  const model = usePricing(props);
  return <section data-pricing="plans-grid" className={cn("w-full px-4 py-16 text-foreground sm:py-20", props.className)}>
    <div className="mx-auto flex max-w-2xl flex-col items-center text-center">{props.eyebrow && <p className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">{props.eyebrow}</p>}<h2 className="mt-4 text-balance font-sans text-4xl font-medium leading-tight">{props.title ?? "A plan for every stage"}</h2>{props.description && <p className="mt-4 max-w-xl text-pretty leading-7 text-muted-foreground">{props.description}</p>}<div className="mt-8"><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} badge={props.yearlyBadge} badgeTone="pill" /></div></div>
    <div className="mx-auto mt-12 grid w-full max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">{props.plans.map((plan) => { const price = perMonth(plan, model.billing); const savings = annualSavings(plan); return <article key={plan.id} className={cn("group relative flex flex-col rounded-3xl border bg-background p-2 transition-colors duration-300", plan.featured ? "border-foreground/15" : "border-border")}>
      <div className={cn("relative flex h-40 flex-col overflow-hidden rounded-2xl p-4", !plan.featured && "border border-border")}>{plan.featured ? <AuroraBars /> : <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px] mask-[linear-gradient(to_bottom,black,transparent_85%)]" />}
        <div className={cn("relative z-10 flex items-center justify-between gap-3", plan.featured && "text-[#141714] dark:text-white")}><h3 className="text-xl font-medium">{plan.name}</h3>{plan.badge && <span className="rounded-full bg-background/70 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">{plan.badge}</span>}</div>
        <div className={cn("relative z-10 mt-auto", plan.featured && "[&_.text-foreground]:text-[#141714] [&_.text-muted-foreground]:text-black/55 dark:[&_.text-foreground]:text-white dark:[&_.text-muted-foreground]:text-white/55")}><div className="flex min-h-10 flex-wrap items-baseline gap-x-1.5 gap-y-1">{plan.priceLabel || price === 0 ? <span className="font-sans text-4xl font-medium leading-none tracking-tight text-foreground">{plan.priceLabel ?? "Free"}</span> : <><Amount value={price} parts={model.parts} className="text-4xl font-medium tracking-tight" /><span className="text-sm text-muted-foreground">/ month</span>{model.billing === "yearly" && savings > 0 && <s className="text-sm text-muted-foreground tabular-nums">{model.money(plan.monthlyPrice)}</s>}</>}</div><SwapText className="mt-1.5 h-4 text-xs text-muted-foreground tabular-nums">{plan.note ?? (model.billing === "yearly" ? `Billed ${model.money(plan.annualPrice)} yearly` : "Billed monthly")}</SwapText></div>
      </div>
      <div className="flex flex-1 flex-col px-3 pt-4 pb-3"><p className="min-h-10 text-pretty text-sm leading-5 text-muted-foreground">{plan.description}</p><Choose quote={calculatePricingQuote(plan, model.billing, 1, props.currency)} onChoose={props.onChoose} variant={plan.featured ? "primary" : "outline"} icon="none" className="h-9" wrapperClassName="mt-4">{plan.actionLabel ?? `Choose ${plan.name}`}</Choose>
        <ul className="mt-6 space-y-3 border-t border-border pt-5">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-start gap-2.5 text-sm leading-5"><CheckBubble strong={plan.featured} className={cn("mt-0.5", !plan.featured && "text-muted-foreground")} /><span>{benefit}</span></li>)}</ul>
        <SwapText className="mt-auto h-9 pt-5 text-center text-xs font-medium tabular-nums">{model.billing === "yearly" && savings > 0 && !plan.priceLabel ? `You save ${model.money(savings)} a year` : " "}</SwapText></div>
    </article>; })}</div>{!props.plans.length && <Empty />}
    {props.footnote && <p className="mt-8 text-center text-xs text-muted-foreground">{props.footnote}</p>}
  </section>;
}
export function PricingLedger(props: SeatPricingProps) {
  const model = usePricing(props); const seats = useSeats(props); const plan = model.plan;
  const quote = plan && calculatePricingQuote(plan, model.billing, seats.seats, props.currency, seats.basisPoints);
  const included = plan?.includedSeats ?? 0;
  const extra = Math.max(0, seats.seats - included);
  const extraUnit = plan?.additionalSeatMonthlyPrice ?? 0;
  const grossMonthly = plan ? plan.includedSeats === undefined ? plan.monthlyPrice * seats.seats : plan.monthlyPrice + extra * extraUnit : 0;
  const due = quote ? model.billing === "yearly" ? Math.round(quote.total / 12) : quote.total : 0;
  const reduction = grossMonthly - due;
  const percent = grossMonthly > 0 ? Math.round(reduction / grossMonthly * 100) : 0;
  return <section data-pricing="ledger" className={cn("w-full px-4 py-16 text-foreground sm:px-8 sm:py-20", props.className)}><div className="mx-auto w-full max-w-5xl">
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"><div className="max-w-xl">{props.eyebrow && <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">{props.eyebrow}</span>}<h2 className="mt-4 text-balance text-4xl font-medium tracking-tight">{props.title ?? "A price you can explain line by line."}</h2>{props.description && <p className="mt-3 text-pretty text-sm leading-6 text-muted-foreground sm:text-base">{props.description}</p>}</div><Billing value={model.billing} onChange={model.setBilling} yearlyLabel={props.yearlyLabel} badge={props.yearlyBadge} /></div>
    <div className="mt-10 grid overflow-hidden rounded-3xl border border-border lg:grid-cols-2">
      <div className="flex flex-col p-5 sm:p-6"><PlanTabs plans={props.plans} value={plan?.id} onChange={model.setPlan} />
        {plan && <div className="mt-6"><div className="flex items-baseline gap-2"><span className="text-4xl font-medium tracking-tight tabular-nums">{model.money(plan.monthlyPrice)}</span><span className="text-sm text-muted-foreground">{plan.includedSeats === undefined ? "/ seat / month" : "/ month base"}</span></div><p className="mt-2 min-h-12 max-w-xs text-balance text-sm leading-6 text-muted-foreground">{plan.description}</p><ul className="mt-5 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">{plan.benefits.map((benefit) => <li key={benefit} className="flex items-center gap-2.5 text-sm"><span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted"><Check className="size-3" /></span>{benefit}</li>)}</ul></div>}
        <div className="mt-auto pt-6"><div className="flex items-baseline justify-between gap-4 border-t border-border pt-5"><p className="text-sm font-medium">Team size</p><p className="text-sm"><span className="font-medium tabular-nums">{seats.seats}</span> <span className="text-muted-foreground">{seats.seats === 1 ? (props.seatLabel ?? "seat") : `${props.seatLabel ?? "seat"}s`}</span></p></div><RangeSlider value={seats.seats} min={seats.min} max={seats.max} step={1} onValueChange={seats.setSeats} aria-label="Team seats" showTicks={false} className="mt-3 h-9" />{plan?.includedSeats !== undefined && <div className="mt-2 flex justify-between gap-4 text-xs text-muted-foreground"><span>{plan.includedSeats} seats included</span><span>then {model.money(extraUnit)} per seat</span></div>}</div>
      </div>
      <div className="border-t border-border lg:border-t-0 lg:border-l"><div className="flex flex-col p-5 sm:p-6">{plan && quote ? <>
        <div className="flex items-center justify-between gap-4"><h3 className="text-sm font-medium">Your estimate</h3><span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">Updates live</span></div>
        <dl aria-live="polite" className="mt-5 space-y-3 text-sm">{plan.includedSeats === undefined ? <div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">{plural(seats.seats, "seat")} × {model.money(plan.monthlyPrice)}</dt><dd className="tabular-nums">{model.money(grossMonthly)}</dd></div> : <><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">{plan.name} base · {included} seats</dt><dd className="tabular-nums">{model.money(plan.monthlyPrice)}</dd></div><div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">{plural(extra, "extra seat")} × {model.money(extraUnit)}</dt><dd className="tabular-nums">{model.money(extra * extraUnit)}</dd></div></>}{reduction > 0 && <div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">{model.billing === "yearly" ? `Annual billing · ${percent}% off` : `Volume discount · ${percent}% off`}</dt><dd className="tabular-nums">−{model.money(reduction)}</dd></div>}</dl>
        <div className="mt-5 flex items-end justify-between gap-4 border-t border-dashed border-border pt-5"><div><p className="text-sm font-medium">Due monthly</p><p className="mt-0.5 text-xs text-muted-foreground">{model.billing === "yearly" ? `${model.money(quote.total)} billed yearly` : "Billed monthly"}</p></div><Amount value={due} parts={model.parts} className="text-5xl font-medium tracking-tight" /></div>
        <Choose quote={quote} onChoose={props.onChoose} className="h-10" wrapperClassName="mt-6">Start with {plan.name}</Choose><p className="mt-3 text-center text-xs text-muted-foreground">{props.footnote ?? "Change seats whenever your team needs."}</p>
      </> : <Empty />}</div></div>
    </div>
  </div></section>;
}
