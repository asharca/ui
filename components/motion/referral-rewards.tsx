"use client";

import { Check, Copy, Gift, Link2, UserPlus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ReferralRewardTier {
  count: number;
  rewardLabel: string;
}

export interface ReferralFriendItem {
  id: string;
  name: string;
  initials: string;
  accent?: string;
  subtitle: string;
  status: "Rewarded" | "Joined" | "Invited";
}

export interface ReferralRewardsProps {
  title?: string;
  subtitle?: string;
  inviteUrl: string;
  referralsCount: number;
  earnedAmount: number;
  tiers: ReferralRewardTier[];
  friends: ReferralFriendItem[];
  onInvite?: () => void;
  className?: string;
}

/** Referral card with copyable link, milestone progress track, tier unlock bursts, and live friend list. */
export function ReferralRewards({
  title = "Invite friends",
  subtitle = "Get $10 in credit for every friend who joins.",
  inviteUrl,
  referralsCount,
  earnedAmount,
  tiers,
  friends,
  onInvite,
  className,
}: ReferralRewardsProps) {
  const reduce = useReducedMotion() ?? false;
  const [copied, setCopied] = useState(false);

  const maxTier = Math.max(1, tiers[tiers.length - 1]?.count ?? 10);
  const progressPct = Math.min(100, (referralsCount / maxTier) * 100);
  const nextTier = tiers.find((t) => t.count > referralsCount);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
    } catch {
      // Ignore clipboard failures in restricted environments
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section
      aria-label={title}
      className={cn(
        "mx-auto w-full max-w-md rounded-3xl border border-border bg-card p-5 text-foreground",
        className,
      )}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-background text-foreground"
          >
            <Gift className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {onInvite ? (
          <button
            type="button"
            onClick={onInvite}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <UserPlus aria-hidden="true" className="size-3.5" />
            Invite
          </button>
        ) : null}
      </header>

      <div className="mt-4 flex items-center justify-between gap-2 rounded-2xl border border-border bg-background px-3 py-2">
        <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-muted-foreground">
          <Link2 aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">{inviteUrl}</span>
        </span>
        <button
          type="button"
          aria-label="Copy invite link"
          onClick={() => void copyLink()}
          className="grid size-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? (
            <Check aria-hidden="true" className="size-3.5 text-emerald-500" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
        </button>
      </div>

      {/* Reward track */}
      <div className="mt-4 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-foreground">Rewards</span>
          <span className="font-mono text-muted-foreground tabular-nums">
            <NumberTicker value={referralsCount} startOnView={false} /> of {maxTier} ·{" "}
            <NumberTicker value={earnedAmount} prefix="$" startOnView={false} /> earned
          </span>
        </div>

        <div className="relative mt-4 mb-2 h-1.5 w-full rounded-full bg-muted">
          <motion.div
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: reduce ? 0 : 0.45, ease: EASE_OUT }}
            className="h-full rounded-full bg-primary"
          />
          <div className="absolute inset-0 flex items-center justify-between">
            {tiers.map((tier) => {
              const unlocked = referralsCount >= tier.count;
              return (
                <motion.span
                  key={tier.count}
                  initial={false}
                  animate={
                    unlocked && !reduce ? { scale: [1, 1.25, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                  className={cn(
                    "grid size-5 place-items-center rounded-full border text-[10px] font-semibold tabular-nums",
                    unlocked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {unlocked ? <Check aria-hidden="true" className="size-3" /> : tier.count}
                </motion.span>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex justify-between text-[11px] font-medium text-muted-foreground">
          {tiers.map((tier) => (
            <span
              key={tier.count}
              className={cn(referralsCount >= tier.count && "text-foreground")}
            >
              {tier.rewardLabel}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          {nextTier
            ? `${nextTier.count - referralsCount} more for ${nextTier.rewardLabel}`
            : "All reward tiers unlocked"}
        </p>
      </div>

      {/* Invited friends */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between px-1 text-xs">
          <span className="font-medium text-foreground">Friends</span>
          <span className="font-mono text-muted-foreground tabular-nums">
            <NumberTicker value={friends.length} startOnView={false} />
          </span>
        </div>

        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {friends.map((friend) => (
              <motion.li
                key={friend.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-3.5 py-2.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold",
                      friend.accent ?? "bg-primary/15 text-primary",
                    )}
                  >
                    {friend.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">
                      {friend.name}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {friend.subtitle}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                    friend.status === "Rewarded" &&
                      "bg-emerald-500/15 text-emerald-500",
                    friend.status === "Joined" &&
                      "bg-amber-500/15 text-amber-500",
                    friend.status === "Invited" && "bg-sky-500/15 text-sky-400",
                  )}
                >
                  {friend.status}
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </section>
  );
}
