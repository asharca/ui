"use client";

import { Check, Lock, RotateCcw, Sparkles, Wallet, X } from "lucide-react";
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

/** Token airdrop card with staggered eligibility check, lock bonus option, and claim confirmation. */
export function AirdropClaim({
  seasonTitle,
  protocolLine,
  tokenSymbol,
  walletAddress,
  networkName,
  criteria,
  lockBonusPercent = 25,
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
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-full bg-cyan-500/15 text-cyan-400"
          >
            <Sparkles className="size-4" />
          </span>
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
            className="grid size-8 place-items-center rounded-full border border-border bg-background text-muted-foreground hover:text-foreground"
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
          </button>
        ) : null}
      </header>

      {/* Connected wallet strip */}
      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs">
        <span className="flex items-center gap-2 font-mono text-foreground">
          <Wallet aria-hidden="true" className="size-3.5 text-muted-foreground" />
          <span>{walletAddress}</span>
          <span className="text-muted-foreground">{networkName}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 text-emerald-500">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-emerald-500" />
          Connected
        </span>
      </div>

      {/* Criteria checklist */}
      <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background">
        {criteria.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 px-4 py-3 text-xs"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border",
                  item.status === "eligible" &&
                    "border-emerald-500/40 bg-emerald-500/15 text-emerald-500",
                  item.status === "ineligible" &&
                    "border-border bg-muted text-muted-foreground",
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
            className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center"
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
            className="mt-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-border bg-background p-1">
              {[
                { lock: false, label: "Claim now" },
                { lock: true, label: `Lock 90d (+${lockBonusPercent}%)` },
              ].map((option) => {
                const active = lockBonus === option.lock;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setLockBonus(option.lock)}
                    className={cn(
                      "relative flex items-center justify-center gap-1 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="airdrop-mode"
                        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        className="absolute inset-0 rounded-xl bg-card shadow-xs"
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

            <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
              <div>
                <p className="text-[11px] text-muted-foreground">Total allocation</p>
                <p className="font-mono text-xl font-semibold text-foreground tabular-nums">
                  <NumberTicker value={finalAmount} locale startOnView={false} />{" "}
                  <span className="text-xs font-medium text-muted-foreground">
                    {tokenSymbol}
                  </span>
                </p>
              </div>
              <button
                type="button"
                disabled={!allChecked || finalAmount <= 0}
                onClick={() => onClaim?.({ lockBonus, totalAmount: finalAmount })}
                className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {allChecked ? "Claim tokens" : "Checking..."}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
