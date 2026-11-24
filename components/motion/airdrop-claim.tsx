"use client";

import { Check, Lock, RotateCcw, Wallet, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface AirdropCriterionItem {
  id: string;
  label: string;
  detail: string;
  rewardAmount: number;
  status: "checking" | "eligible" | "ineligible";
}

export interface AirdropClaimProps {
  seasonTitle: string;
  protocolLine: string;
  tokenSymbol: string;
  walletAddress: string;
  networkName: string;
  criteria: AirdropCriterionItem[];
  lockBonusPercent?: number;
  claimedTxHash?: string | null;
  onClaim?: (options: { lockBonus: boolean; totalAmount: number }) => void;
  onReplay?: () => void;
  className?: string;
}

function OrbMark({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-block shrink-0 rounded-full bg-gradient-to-br from-cyan-300 via-teal-400 to-sky-600 shadow-[0_0_24px_rgba(45,212,191,0.35)]",
        size === "sm" ? "size-7" : "size-10",
      )}
    >
      <span className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/10 to-white/40 blur-[1px]" />
    </span>
  );
}

/** Token airdrop card with staggered eligibility check, lock bonus option, and claim confirmation. */
export function AirdropClaim({
  seasonTitle,
  protocolLine,
  tokenSymbol,
  walletAddress,
  networkName,
  criteria,
  lockBonusPercent = 20,
  claimedTxHash = null,
  onClaim,
  onReplay,
  className,
}: AirdropClaimProps) {
  const reduce = useReducedMotion() ?? false;
  const [lockBonus, setLockBonus] = useState(false);

  const baseAllocation = criteria.reduce(
    (sum, item) => (item.status === "eligible" ? sum + item.rewardAmount : sum),
    0,
  );
  const allChecked = criteria.every((item) => item.status !== "checking");
  const finalAmount = lockBonus
    ? Math.round(baseAllocation * (1 + lockBonusPercent / 100))
    : baseAllocation;
  const approxUsd = Math.round(finalAmount * 0.42);

  return (
    <section
      aria-label={seasonTitle}
      className={cn(
        "mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-5 text-foreground",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <OrbMark />
          <div>
            <h3 className="text-sm font-semibold text-foreground">{seasonTitle}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{protocolLine}</p>
          </div>
        </div>
        {onReplay ? (
          <button
            type="button"
            onClick={onReplay}
            aria-label="Replay eligibility check"
            className="grid size-8 place-items-center rounded-full border border-border bg-background/70 text-muted-foreground hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
          </button>
        ) : null}
      </header>

      {/* Connected wallet strip */}
      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-border bg-background/60 px-3.5 py-2.5 text-xs">
        <span className="flex items-center gap-2 font-mono text-foreground">
          <Wallet aria-hidden="true" className="size-3.5 text-muted-foreground" />
          <span>{walletAddress}</span>
          <span className="rounded-md bg-foreground/[0.06] px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {networkName}
          </span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-emerald-500">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
          Connected
        </span>
      </div>

      {/* Criteria flush divider list */}
      <ul className="mt-4 divide-y divide-border border-t border-border">
        {criteria.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 py-3 text-xs"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  item.status === "eligible" &&
                    "border-emerald-500/40 bg-emerald-500/15 text-emerald-500",
                  item.status === "ineligible" &&
                    "border-border bg-foreground/[0.06] text-muted-foreground",
                  item.status === "checking" && "border-primary/40 text-primary",
                )}
              >
                {item.status === "eligible" ? (
                  <Check className="size-3" strokeWidth={2.5} />
                ) : item.status === "ineligible" ? (
                  <X className="size-3" />
                ) : (
                  <span className="size-1.5 animate-ping rounded-full bg-primary" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{item.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 font-mono tabular-nums",
                item.status === "eligible"
                  ? "font-medium text-emerald-500"
                  : "text-muted-foreground line-through opacity-60",
              )}
            >
              +{item.rewardAmount.toLocaleString()} {tokenSymbol}
            </span>
          </li>
        ))}
      </ul>

      {/* Allocation & claim flow */}
      <AnimatePresence mode="wait" initial={false}>
        {claimedTxHash ? (
          <motion.div
            key="claimed"
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center"
          >
            <p className="text-xs font-semibold text-emerald-500">
              Allocation claimed
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold text-foreground tabular-nums">
              {finalAmount.toLocaleString()} {tokenSymbol}
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
              Tx {claimedTxHash}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="claim-panel"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 space-y-4 border-t border-border pt-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Your allocation</p>
                <div className="mt-1 flex items-center gap-2.5">
                  <OrbMark size="sm" />
                  <p className="font-mono text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                    <NumberTicker value={finalAmount} locale startOnView={false} />{" "}
                    <span className="text-sm font-medium text-muted-foreground">
                      {tokenSymbol}
                    </span>
                  </p>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  about ${approxUsd.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1 rounded-full border border-border bg-background/70 p-1">
              {[
                { lock: false, label: "Claim now" },
                { lock: true, label: `Lock 90 days (+${lockBonusPercent}%)` },
              ].map((option) => {
                const active = lockBonus === option.lock;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setLockBonus(option.lock)}
                    className={cn(
                      "relative flex items-center justify-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="airdrop-mode"
                        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        className="absolute inset-0 rounded-full bg-foreground/[0.09]"
                      />
                    ) : null}
                    <span className="relative z-10 inline-flex items-center gap-1">
                      {option.lock ? <Lock aria-hidden="true" className="size-3" /> : null}
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1.5 text-center">
              <button
                type="button"
                disabled={!allChecked || finalAmount <= 0}
                onClick={() => onClaim?.({ lockBonus, totalAmount: finalAmount })}
                className="inline-flex h-10 w-full items-center justify-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {allChecked
                  ? `Claim ${finalAmount.toLocaleString()} ${tokenSymbol}`
                  : "Checking eligibility..."}
              </button>
              <p className="text-[11px] text-muted-foreground">
                {lockBonus
                  ? "Tokens unlock automatically after 90 days"
                  : "Sent to your wallet right away"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
