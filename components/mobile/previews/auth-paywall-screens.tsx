"use client";

import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  Delete,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  PauseCircle,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, damping: 24, stiffness: 320 };

export function LoginScreenPreview() {
  const [email, setEmail] = useState("alex@studio.dev");
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-4 pb-5">
      <div>
        <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Sparkles aria-hidden="true" className="size-5" />
        </div>
        <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Welcome back
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Sign in to sync your workspaces across devices.
        </p>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => setSent(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <KeyRound aria-hidden="true" className="size-3.5" />
            <span>Continue with Passkey</span>
          </button>
          <button
            type="button"
            onClick={() => setSent(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <span>Continue with Apple</span>
          </button>
        </div>

        <div className="my-4 flex items-center gap-2">
          <hr className="flex-1 border-border" />
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
          <hr className="flex-1 border-border" />
        </div>

        <label className="block text-[11px] font-medium text-muted-foreground">
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setSent(false);
            }}
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={() => setSent(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {sent ? <Check aria-hidden="true" className="size-3.5" /> : <ArrowRight aria-hidden="true" className="size-3.5" />}
        <span>{sent ? "Sign-in link sent" : "Continue with Email"}</span>
      </button>
    </div>
  );
}

export function SimpleLoginPreview() {
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-6 pb-5">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">Sign in</h3>
        <p className="mt-1 text-xs text-muted-foreground">Use your account credentials.</p>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
            <Mail aria-hidden="true" className="size-3.5 text-muted-foreground" />
            <input
              type="email"
              defaultValue="team@kora.app"
              aria-label="Email"
              className="w-full bg-transparent text-xs text-foreground outline-none"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
            <Lock aria-hidden="true" className="size-3.5 text-muted-foreground" />
            <input
              type={showPwd ? "text" : "password"}
              defaultValue="studio-2026"
              aria-label="Password"
              className="w-full bg-transparent text-xs text-foreground outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? "Hide password" : "Show password"}
              className="text-muted-foreground hover:text-foreground"
            >
              {showPwd ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Eye aria-hidden="true" className="size-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setRemember((r) => !r)}
            className="flex w-full items-center justify-between pt-1 text-xs text-muted-foreground"
          >
            <span>Keep me signed in</span>
            <span
              className={cn(
                "flex size-4 items-center justify-center rounded border",
                remember ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              {remember ? <Check aria-hidden="true" className="size-3" /> : null}
            </span>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSignedIn(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {signedIn ? "Signed in" : "Sign in"}
      </button>
    </div>
  );
}

export function PhoneLoginPreview() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [code, setCode] = useState("482910");
  const [verified, setVerified] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-5 pb-5">
      <div>
        <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card text-foreground">
          <Phone aria-hidden="true" className="size-4" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {step === "phone" ? "Enter your number" : "Verify SMS code"}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {step === "phone"
            ? "We will text a 6-digit verification code."
            : "Code sent to +1 (415) 555-0192."}
        </p>

        {step === "phone" ? (
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
            <span className="border-r border-border pr-2 font-mono text-xs text-muted-foreground">
              +1
            </span>
            <input
              type="tel"
              defaultValue="(415) 555-0192"
              aria-label="Phone number"
              className="w-full bg-transparent font-mono text-xs text-foreground outline-none"
            />
          </div>
        ) : (
          <div className="mt-5">
            <input
              type="text"
              value={code}
              maxLength={6}
              onChange={(e) => {
                setCode(e.target.value);
                setVerified(false);
              }}
              aria-label="SMS verification code"
              className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-center font-mono text-lg font-semibold tracking-[0.35em] text-foreground outline-none"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            if (step === "phone") setStep("otp");
            else setVerified(true);
          }}
          className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          {step === "phone" ? "Send verification code" : verified ? "Verified" : "Confirm code"}
        </button>
        {step === "otp" ? (
          <button
            type="button"
            onClick={() => {
              setStep("phone");
              setVerified(false);
            }}
            className="w-full py-1 text-center text-[11px] text-muted-foreground hover:text-foreground"
          >
            Change phone number
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function WelcomeScreenPreview() {
  const [slide, setSlide] = useState(0);
  const slides = [
    { badge: "Realtime sync", title: "Ship from anywhere", color: "from-sky-500/25 to-indigo-500/20" },
    { badge: "Private keys", title: "Security built in", color: "from-emerald-500/25 to-teal-500/20" },
    { badge: "Smart workflows", title: "Move twice as fast", color: "from-amber-500/25 to-orange-500/20" },
  ];
  const current = slides[slide] ?? slides[0];

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-4 pb-5">
      <div className={cn("flex h-56 flex-col justify-between rounded-3xl border border-border bg-gradient-to-br p-4", current.color)}>
        <span className="w-fit rounded-full bg-background/80 px-2.5 py-0.5 text-[10px] font-medium text-foreground">
          {current.badge}
        </span>
        <div>
          <p className="text-lg font-semibold leading-tight text-foreground">{current.title}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Tap bullets below to cycle highlights.
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-1.5">
        {slides.map((item, idx) => (
          <button
            key={item.title}
            type="button"
            aria-label={`Highlight ${idx + 1}`}
            onClick={() => setSlide(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all",
              slide === idx ? "w-5 bg-primary" : "w-1.5 bg-muted",
            )}
          />
        ))}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setSlide((s) => (s + 1) % slides.length)}
          className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          Create free account
        </button>
        <button
          type="button"
          className="w-full rounded-2xl border border-border bg-card py-2.5 text-xs font-medium text-foreground"
        >
          I already have an account
        </button>
      </div>
    </div>
  );
}

export function SignUpScreenPreview() {
  const [password, setPassword] = useState("Studio#2026!");
  const [agreed, setAgreed] = useState(true);
  const [created, setCreated] = useState(false);

  const score = password.length >= 12 ? 3 : password.length >= 8 ? 2 : password.length > 0 ? 1 : 0;

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-4 pb-5">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Create account</h3>
        <div className="mt-3 space-y-2.5">
          <input
            type="text"
            defaultValue="Soren Klein"
            aria-label="Full name"
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground outline-none"
          />
          <input
            type="email"
            defaultValue="soren@studio.dev"
            aria-label="Work email"
            className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground outline-none"
          />
          <div>
            <input
              type="text"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setCreated(false);
              }}
              aria-label="Password"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground outline-none"
            />
            <div className="mt-1.5 flex gap-1">
              {["weak", "fair", "strong"].map((tier, idx) => (
                <span
                  key={tier}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    idx < score
                      ? score === 3
                        ? "bg-emerald-500"
                        : score === 2
                          ? "bg-amber-500"
                          : "bg-red-500"
                      : "bg-muted",
                  )}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAgreed((a) => !a)}
            className="flex items-center gap-2 pt-1 text-left text-[11px] text-muted-foreground"
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded border",
                agreed ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
            >
              {agreed ? <Check aria-hidden="true" className="size-3" /> : null}
            </span>
            <span>Accept workspace terms & privacy notice</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        disabled={!agreed || score === 0}
        onClick={() => setCreated(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
      >
        {created ? "Account created" : "Get started"}
      </button>
    </div>
  );
}

export function ForgotPasswordPreview() {
  const [sent, setSent] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-6 pb-5">
      <div>
        <div className="flex size-10 items-center justify-center rounded-2xl border border-border bg-card">
          {sent ? <CheckCircle2 aria-hidden="true" className="size-5 text-emerald-500" /> : <Mail aria-hidden="true" className="size-4 text-foreground" />}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {sent ? "Check your inbox" : "Reset password"}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {sent
            ? "We sent recovery instructions to soren@studio.dev."
            : "Enter your account email and we will send a one-time reset link."}
        </p>

        {!sent ? (
          <input
            type="email"
            defaultValue="soren@studio.dev"
            aria-label="Recovery email"
            className="mt-4 w-full rounded-xl border border-border bg-card px-3 py-2.5 text-xs text-foreground outline-none"
          />
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setSent((v) => !v)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {sent ? "Back to email input" : "Send reset link"}
      </button>
    </div>
  );
}

export function UnlockScreenPreview() {
  const reduce = useReducedMotion();
  const [pin, setPin] = useState("12");
  const [status, setStatus] = useState<"locked" | "error" | "unlocked">("locked");

  const pressDigit = (d: string) => {
    if (d === "back") {
      setStatus("locked");
      setPin((p) => p.slice(0, -1));
      return;
    }
    const next = `${pin}${d}`.slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === "1234") {
        setStatus("unlocked");
      } else {
        setStatus("error");
      }
    } else {
      setStatus("locked");
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-5 pt-6 pb-5">
      <div className="text-center">
        <Fingerprint aria-hidden="true" className="mx-auto size-8 text-primary" />
        <h3 className="mt-2.5 text-base font-semibold text-foreground">
          {status === "unlocked"
            ? "Vault unlocked"
            : status === "error"
              ? "Try PIN 1234"
              : "Enter passcode"}
        </h3>

        <motion.div
          animate={
            status === "error" && !reduce ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }
          }
          transition={{ duration: 0.3 }}
          className="mt-4 flex justify-center gap-3"
        >
          {["d1", "d2", "d3", "d4"].map((dot, idx) => (
            <span
              key={dot}
              className={cn(
                "size-3 rounded-full border transition-all",
                idx < pin.length
                  ? status === "error"
                    ? "border-red-500 bg-red-500"
                    : "border-primary bg-primary"
                  : "border-border bg-transparent",
              )}
            />
          ))}
        </motion.div>
      </div>

      <div className="grid w-full grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "face", "0", "back"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              if (key === "face") {
                setPin("1234");
                setStatus("unlocked");
              } else {
                pressDigit(key);
              }
            }}
            className="flex h-11 items-center justify-center rounded-2xl bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            {key === "face" ? (
              <Fingerprint aria-hidden="true" className="size-4 text-primary" />
            ) : key === "back" ? (
              <Delete aria-hidden="true" className="size-4" />
            ) : (
              key
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PaywallScreenPreview() {
  const [billing, setBilling] = useState<"annual" | "monthly">("annual");
  const [selected, setSelected] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-4 pb-5">
      <div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
          <Sparkles aria-hidden="true" className="size-3" />
          Kora Plus
        </span>
        <h3 className="mt-2.5 text-lg font-semibold text-foreground">
          Unlimited projects & exports
        </h3>

        <div className="mt-3 flex gap-1 rounded-xl bg-muted p-1">
          {(["annual", "monthly"] as const).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => {
                setBilling(cycle);
                setSelected(false);
              }}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-[11px] font-medium capitalize",
                billing === cycle ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {cycle === "annual" ? "Annual · Save 30%" : "Monthly"}
            </button>
          ))}
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-card p-3.5">
          <p className="font-mono text-2xl font-semibold text-foreground tabular-nums">
            {billing === "annual" ? "$79" : "$9"}
            <span className="text-xs font-normal text-muted-foreground">
              /{billing === "annual" ? "year" : "month"}
            </span>
          </p>
          <ul className="mt-2.5 space-y-1.5 text-[11px] text-muted-foreground">
            {[
              "4K transparent vector exports",
              "Cloud sync across 5 devices",
              "Custom brand palette tokens",
            ].map((perk) => (
              <li key={perk} className="flex items-center gap-1.5 text-foreground">
                <Check aria-hidden="true" className="size-3 text-emerald-500" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSelected(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {selected ? "Membership enabled" : "Continue"}
      </button>
    </div>
  );
}

export function AuroraPaywallPreview() {
  const [tier, setTier] = useState<"plus" | "studio">("studio");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="relative flex flex-1 flex-col justify-between overflow-hidden px-4 pt-4 pb-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 left-1/2 h-40 w-60 -translate-x-1/2 rounded-full bg-gradient-to-tr from-emerald-500/25 via-sky-500/25 to-violet-500/25 blur-2xl"
      />
      <div className="relative">
        <p className="text-center text-[11px] font-medium text-muted-foreground">Studio Tiers</p>
        <h3 className="mt-1 text-center text-lg font-semibold text-foreground">
          Choose what fits your flow
        </h3>

        <div className="mt-4 space-y-2">
          {[
            { id: "plus", name: "Kora Plus", price: "$9 / mo", desc: "Solo creator kit" },
            { id: "studio", name: "Studio Membership", price: "$19 / mo", desc: "Shared workspace & exports" },
          ].map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => {
                setTier(plan.id as "plus" | "studio");
                setConfirmed(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-colors",
                tier === plan.id
                  ? "border-primary bg-card shadow-sm"
                  : "border-border bg-card/50",
              )}
            >
              <div>
                <p className="text-xs font-semibold text-foreground">{plan.name}</p>
                <p className="text-[10px] text-muted-foreground">{plan.desc}</p>
              </div>
              <span className="font-mono text-xs font-semibold text-foreground">{plan.price}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setConfirmed(true)}
        className="relative w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {confirmed ? "Plan updated" : `Select ${tier === "studio" ? "Studio" : "Kora Plus"}`}
      </button>
    </div>
  );
}

export function TrialScreenPreview() {
  const [started, setStarted] = useState(false);
  const timeline = [
    { icon: Lock, title: "Today: Instant access", desc: "Unlock every workflow with $0 due." },
    { icon: Bell, title: "Day 5: Gentle reminder", desc: "Push alert two days before renewal." },
    { icon: Calendar, title: "Day 7: Billing begins", desc: "Cancel anytime in two taps." },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-4 pb-5">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Try 7 days free</h3>
        <p className="mt-1 text-xs text-muted-foreground">Transparent renewal schedule.</p>

        <div className="mt-4 space-y-3">
          {timeline.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-start gap-3">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-card text-primary">
                  <Icon aria-hidden="true" className="size-3.5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{step.title}</p>
                  <p className="text-[11px] text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setStarted(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {started ? "7-day trial started" : "Start 7-day free trial"}
      </button>
    </div>
  );
}

export function PurchaseSuccessPreview() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-5 pt-8 pb-5 text-center">
      <div className="w-full">
        <motion.div
          initial={reduce ? false : { scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
        >
          <Check aria-hidden="true" className="size-7" />
        </motion.div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Kora Plus unlocked</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Receipt #KR-9401 confirmed.
        </p>

        <div className="mt-5 rounded-2xl border border-border bg-card p-3.5 text-left text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium text-foreground">Annual Studio</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted-foreground">Next renewal</span>
            <span className="font-mono text-foreground">Nov 24, 2027</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDone(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {done ? "Workspace ready" : "Open workspace"}
      </button>
    </div>
  );
}

export function ManageSubscriptionPreview() {
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState<"Annual" | "Monthly">("Annual");

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-3 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Membership</h3>
          <Shield aria-hidden="true" className="size-4 text-muted-foreground" />
        </div>

        <div className="mt-3 rounded-3xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Kora Plus</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                paused ? "bg-amber-500/15 text-amber-500" : "bg-emerald-500/15 text-emerald-500",
              )}
            >
              {paused ? "Paused" : "Active"}
            </span>
          </div>
          <p className="mt-2 font-mono text-xl font-semibold text-foreground">
            {cycle === "Annual" ? "$79 / year" : "$9 / month"}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {paused ? "Resumes manually at any time" : "Renews Dec 14, 2026"}
          </p>
        </div>

        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => setCycle((c) => (c === "Annual" ? "Monthly" : "Annual"))}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs font-medium text-foreground"
          >
            <span>Switch billing cycle</span>
            <span className="text-muted-foreground">{cycle}</span>
          </button>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-2.5 text-xs font-medium text-foreground"
          >
            <span>{paused ? "Resume membership" : "Pause renewal"}</span>
            <PauseCircle aria-hidden="true" className="size-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground">
        Managed via App Store Billing
      </p>
    </div>
  );
}
