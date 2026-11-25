"use client";

import {
  Activity,
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpDown,
  ArrowUpRight,
  Bell,
  Check,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  Home,
  Lock,
  Plus,
  QrCode,
  Snowflake,
  Unlock,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HoldingId = "ETH" | "BTC" | "SOL" | "USDC";

interface Holding {
  id: HoldingId;
  name: string;
  symbol: HoldingId;
  price: number;
  amount: number;
  changePct: number;
  color: string;
  series: number[];
}

interface ActivityTx {
  id: string;
  kind: "send" | "swap" | "deposit";
  title: string;
  subtitle: string;
  amountLabel: string;
  positive: boolean;
  time: string;
  hash: string;
  timeline: Array<{ label: string; time: string; done: boolean }>;
}

const INITIAL_HOLDINGS: Holding[] = [
  {
    id: "ETH",
    name: "Ethereum",
    symbol: "ETH",
    price: 3120.0,
    amount: 1.15,
    changePct: 3.4,
    color: "text-sky-400",
    series: [2890, 2940, 2910, 2980, 3045, 3020, 3090, 3120],
  },
  {
    id: "BTC",
    name: "Bitcoin",
    symbol: "BTC",
    price: 94200.0,
    amount: 0.025,
    changePct: 1.85,
    color: "text-amber-400",
    series: [91800, 92400, 92100, 92900, 93200, 93650, 93900, 94200],
  },
  {
    id: "SOL",
    name: "Solana",
    symbol: "SOL",
    price: 184.0,
    amount: 4.5,
    changePct: 4.1,
    color: "text-emerald-400",
    series: [170, 173, 172, 177, 179, 181, 182, 184],
  },
  {
    id: "USDC",
    name: "USD Coin",
    symbol: "USDC",
    price: 1.0,
    amount: 610.31,
    changePct: 0.01,
    color: "text-blue-400",
    series: [1, 1, 1, 1, 1, 1, 1, 1],
  },
];

const INITIAL_ACTIVITY: ActivityTx[] = [
  {
    id: "tx-1",
    kind: "deposit",
    title: "Deposit USDC",
    subtitle: "Apple Pay instant",
    amountLabel: "+$500.00",
    positive: true,
    time: "Today, 09:32",
    hash: "0x81f9...4e12",
    timeline: [
      { label: "Initiated via card", time: "09:32:01", done: true },
      { label: "Settlement verified", time: "09:32:04", done: true },
      { label: "Confirmed on Base", time: "09:32:09", done: true },
    ],
  },
  {
    id: "tx-2",
    kind: "swap",
    title: "Swap USDC -> ETH",
    subtitle: "0.24 ETH @ $3,120",
    amountLabel: "0.24 ETH",
    positive: true,
    time: "Yesterday, 18:14",
    hash: "0x4c9a...b310",
    timeline: [
      { label: "Quote locked", time: "18:14:02", done: true },
      { label: "Routed on DEX", time: "18:14:06", done: true },
      { label: "Settled to wallet", time: "18:14:11", done: true },
    ],
  },
  {
    id: "tx-3",
    kind: "send",
    title: "Send to @liam.eth",
    subtitle: "Dinner split",
    amountLabel: "-0.04 ETH",
    positive: false,
    time: "Nov 22, 20:05",
    hash: "0x9d12...7a08",
    timeline: [
      { label: "Signed locally", time: "20:05:10", done: true },
      { label: "Broadcast to network", time: "20:05:12", done: true },
      { label: "Confirmed", time: "20:05:16", done: true },
    ],
  },
];

const PORTFOLIO_CURVES: Record<string, number[]> = {
  "1D": [7145.83, 7180.1, 7152.4, 7225.9, 7260.0, 7248.5, 7315.2, 7381.31],
  "1W": [6720.0, 6810.5, 6890.0, 6840.2, 7015.8, 7190.0, 7295.4, 7381.31],
  "1M": [6120.0, 6280.0, 6195.0, 6540.0, 6780.0, 6910.0, 7150.0, 7381.31],
};

function buildPath(values: number[], width: number, height: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 0.0001);
  return values
    .map((v, idx) => {
      const x = (idx / Math.max(1, values.length - 1)) * width;
      const y = height - ((v - min) / span) * (height - 12) - 6;
      return `${idx === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function HoldToConfirmButton({
  label,
  disabled,
  onConfirm,
}: {
  label: string;
  disabled?: boolean;
  onConfirm: () => void;
}) {
  const reduce = useReducedMotion();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const stopHold = () => {
    setHolding(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!completedRef.current) setProgress(0);
  };

  const startHold = () => {
    if (disabled) return;
    if (reduce) {
      completedRef.current = true;
      setProgress(100);
      onConfirm();
      return;
    }
    completedRef.current = false;
    setHolding(true);
    const start = Date.now();
    timerRef.current = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - start) / 700) * 100);
      setProgress(pct);
      if (pct >= 100) {
        completedRef.current = true;
        stopHold();
        onConfirm();
      }
    }, 16);
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={startHold}
      onPointerUp={stopHold}
      onPointerLeave={stopHold}
      onPointerCancel={stopHold}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          onConfirm();
        }
      }}
      className="relative flex h-10 w-full items-center justify-center overflow-hidden rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground outline-none transition-opacity disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 bg-foreground/20 transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
      <span className="relative z-10">{holding ? "Keep holding..." : label}</span>
    </button>
  );
}

export function NeobankAppPreview() {
  const reduce = useReducedMotion() ?? false;
  const [tab, setTab] = useState<"home" | "card" | "activity">("home");
  const [hidden, setHidden] = useState(false);
  const [range, setRange] = useState<"1D" | "1W" | "1M">("1D");
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const [holdings, setHoldings] = useState<Holding[]>(INITIAL_HOLDINGS);
  const [activity, setActivity] = useState<ActivityTx[]>(INITIAL_ACTIVITY);
  const [selectedTokenId, setSelectedTokenId] = useState<HoldingId | null>(null);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
  const [sheet, setSheet] = useState<"send" | "swap" | "deposit" | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardFrozen, setCardFrozen] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  // Send & swap local sheet state
  const [sendToken, setSendToken] = useState<HoldingId>("ETH");
  const [sendAmount, setSendAmount] = useState("0.05");
  const [swapFrom, setSwapFrom] = useState<HoldingId>("USDC");
  const [swapTo, setSwapTo] = useState<HoldingId>("ETH");
  const [swapAmount, setSwapAmount] = useState("150");

  const totalUsd = useMemo(
    () => holdings.reduce((sum, h) => sum + h.amount * h.price, 0),
    [holdings],
  );
  const curveValues = useMemo(() => {
    const base = PORTFOLIO_CURVES[range] ?? PORTFOLIO_CURVES["1D"];
    const delta = totalUsd - 7381.31;
    return base.map((v, i) => (i === base.length - 1 ? totalUsd : Math.max(0, v + delta * (i / base.length))));
  }, [range, totalUsd]);

  const activeValue = scrubIndex === null ? totalUsd : (curveValues[scrubIndex] ?? totalUsd);
  const whole = Math.floor(activeValue).toLocaleString("en-US");
  const cents = (activeValue % 1).toFixed(2).slice(2);
  const selectedToken = holdings.find((h) => h.id === selectedTokenId) ?? null;
  const selectedTx = activity.find((t) => t.id === selectedTxId) ?? null;

  const logTx = (tx: Omit<ActivityTx, "id">) => {
    setActivity((prev) => [{ ...tx, id: `tx-${Date.now()}` }, ...prev]);
  };

  const handleConfirmSend = () => {
    const qty = Number.parseFloat(sendAmount);
    if (!Number.isFinite(qty) || qty <= 0) return;
    setHoldings((prev) =>
      prev.map((h) =>
        h.id === sendToken ? { ...h, amount: Math.max(0, h.amount - qty) } : h,
      ),
    );
    logTx({
      kind: "send",
      title: `Sent ${sendToken}`,
      subtitle: "To maya.base.eth",
      amountLabel: `-${qty} ${sendToken}`,
      positive: false,
      time: "Just now",
      hash: "0x7e21...c91f",
      timeline: [
        { label: "Hold gesture verified", time: "Now", done: true },
        { label: "Broadcast to network", time: "Now", done: true },
        { label: "Confirmed on Base", time: "Now", done: true },
      ],
    });
    setSheet(null);
  };

  const handleConfirmSwap = () => {
    const qty = Number.parseFloat(swapAmount);
    if (!Number.isFinite(qty) || qty <= 0 || swapFrom === swapTo) return;
    const fromHolding = holdings.find((h) => h.id === swapFrom);
    const toHolding = holdings.find((h) => h.id === swapTo);
    if (!fromHolding || !toHolding) return;
    const actualFrom = Math.min(qty, fromHolding.amount);
    if (actualFrom <= 0) return;
    const received = (actualFrom * fromHolding.price) / toHolding.price;
    setHoldings((prev) =>
      prev.map((h) => {
        if (h.id === swapFrom) return { ...h, amount: Math.max(0, h.amount - actualFrom) };
        if (h.id === swapTo) return { ...h, amount: h.amount + received };
        return h;
      }),
    );
    logTx({
      kind: "swap",
      title: `Swap ${swapFrom} -> ${swapTo}`,
      subtitle: `${actualFrom.toFixed(2)} ${swapFrom} for ${received.toFixed(4)} ${swapTo}`,
      amountLabel: `+${received.toFixed(4)} ${swapTo}`,
      positive: true,
      time: "Just now",
      hash: "0x3b18...91a4",
      timeline: [
        { label: "Quote locked", time: "Now", done: true },
        { label: "Routed on DEX", time: "Now", done: true },
        { label: "Settled to wallet", time: "Now", done: true },
      ],
    });
    setSheet(null);
  };

  const handleDepositUsdc = () => {
    setHoldings((prev) =>
      prev.map((h) => (h.id === "USDC" ? { ...h, amount: h.amount + 500 } : h)),
    );
    logTx({
      kind: "deposit",
      title: "Deposit USDC",
      subtitle: "Instant card top-up",
      amountLabel: "+$500.00",
      positive: true,
      time: "Just now",
      hash: "0xa12c...0f42",
      timeline: [
        { label: "Authorization complete", time: "Now", done: true },
        { label: "USDC minted", time: "Now", done: true },
        { label: "Confirmed in vault", time: "Now", done: true },
      ],
    });
    setSheet(null);
  };

  return (
    <div className="relative flex flex-1 flex-col justify-between bg-background text-foreground">
      <div className="flex-1 overflow-y-auto px-4 pb-3 pt-1">
        {selectedToken ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setSelectedTokenId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to wallet
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold">{selectedToken.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedToken.amount.toFixed(selectedToken.symbol === "USDC" ? 2 : 4)} {selectedToken.symbol}
                </p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold tabular-nums">
                  ${(selectedToken.amount * selectedToken.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-emerald-400">+{selectedToken.changePct}%</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-3">
              <svg viewBox="0 0 240 68" className="h-16 w-full overflow-visible text-emerald-400" aria-hidden="true">
                <path
                  d={buildPath(selectedToken.series, 240, 64)}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSendToken(selectedToken.id);
                  setSelectedTokenId(null);
                  setSheet("send");
                }}
                className="h-9 rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              >
                Send {selectedToken.symbol}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSwapFrom(selectedToken.id);
                  setSwapTo(selectedToken.id === "USDC" ? "ETH" : "USDC");
                  setSelectedTokenId(null);
                  setSheet("swap");
                }}
                className="h-9 rounded-full border border-border bg-foreground/[0.06] text-xs font-medium"
              >
                Swap
              </button>
            </div>
          </div>
        ) : sheet ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold capitalize">{sheet}</h3>
              <button
                type="button"
                onClick={() => setSheet(null)}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>

            {sheet === "send" && (
              <div className="space-y-3 rounded-2xl border border-border bg-card p-3.5">
                <div className="flex gap-1.5">
                  {(["ETH", "USDC", "SOL"] as HoldingId[]).map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => setSendToken(sym)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                        sendToken === sym
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border text-muted-foreground",
                      )}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
                <label className="block space-y-1 text-[11px] text-muted-foreground">
                  <span>Amount ({sendToken})</span>
                  <input
                    type="number"
                    step="0.01"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <p className="text-[11px] text-muted-foreground">Recipient: maya.base.eth</p>
                <HoldToConfirmButton label={`Hold to send ${sendAmount || "0"} ${sendToken}`} onConfirm={handleConfirmSend} />
              </div>
            )}

            {sheet === "swap" && (
              <div className="space-y-3 rounded-2xl border border-border bg-card p-3.5">
                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-1 text-[11px] text-muted-foreground">
                    <span>From</span>
                    <select
                      value={swapFrom}
                      onChange={(e) => setSwapFrom(e.target.value as HoldingId)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2 text-xs text-foreground"
                    >
                      {holdings.map((h) => (
                        <option key={h.id} value={h.id}>{h.symbol}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1 text-[11px] text-muted-foreground">
                    <span>To</span>
                    <select
                      value={swapTo}
                      onChange={(e) => setSwapTo(e.target.value as HoldingId)}
                      className="h-9 w-full rounded-xl border border-border bg-background px-2 text-xs text-foreground"
                    >
                      {holdings.map((h) => (
                        <option key={h.id} value={h.id}>{h.symbol}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="block space-y-1 text-[11px] text-muted-foreground">
                  <span>Amount ({swapFrom})</span>
                  <input
                    type="number"
                    value={swapAmount}
                    onChange={(e) => setSwapAmount(e.target.value)}
                    className="h-9 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm text-foreground"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleConfirmSwap}
                  className="h-9 w-full rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                >
                  Confirm swap
                </button>
              </div>
            )}

            {sheet === "deposit" && (
              <div className="space-y-3 rounded-2xl border border-border bg-card p-3.5 text-center">
                <p className="text-xs font-medium">Wallet address (Base / Ethereum)</p>
                <p className="truncate rounded-xl border border-border bg-background px-3 py-2 font-mono text-[11px] text-muted-foreground">
                  0x71C9...9F4a82
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCopiedAddr(true)}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-foreground/[0.06] text-xs font-medium"
                  >
                    {copiedAddr ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                    {copiedAddr ? "Copied" : "Copy address"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDepositUsdc}
                    className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-primary text-xs font-semibold text-primary-foreground"
                  >
                    <Plus className="size-3.5" />
                    +$500 USDC
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : tab === "home" ? (
          <div className="space-y-3.5">
            {/* Top header matching official Neobank app preview */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-full bg-primary/20 text-[11px] font-semibold text-primary">
                  M
                </span>
                <span className="text-xs font-semibold">Hi, Maya</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Receive QR"
                  onClick={() => setSheet("deposit")}
                  className="grid size-7 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
                >
                  <QrCode className="size-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setTab("activity")}
                  className="grid size-7 place-items-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
                >
                  <Bell className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Balance & privacy mask toggle */}
            <div>
              <button
                type="button"
                aria-label={hidden ? "Show total balance" : "Hide total balance"}
                onClick={() => setHidden((v) => !v)}
                className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <span>Total balance</span>
                {hidden ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
              </button>
              <p className="mt-0.5 text-2xl font-bold tracking-tight tabular-nums">
                {hidden ? (
                  "••••••"
                ) : (
                  <>
                    ${whole}
                    <span className="text-muted-foreground">.{cents}</span>
                  </>
                )}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-emerald-400">
                +$235.48 (2.32%) today
              </p>
            </div>

            {/* Scrubbable SVG balance curve */}
            <div className="space-y-2">
              <div
                className="relative h-20 w-full cursor-ew-resize touch-none select-none"
                onPointerMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                  setScrubIndex(Math.round(ratio * (curveValues.length - 1)));
                }}
                onPointerLeave={() => setScrubIndex(null)}
              >
                <svg viewBox="0 0 260 76" className="h-full w-full overflow-visible text-emerald-400" aria-label="Balance history chart">
                  <path
                    d={buildPath(curveValues, 260, 72)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {scrubIndex !== null && (
                    <circle
                      cx={(scrubIndex / Math.max(1, curveValues.length - 1)) * 260}
                      cy={(() => {
                        const min = Math.min(...curveValues);
                        const max = Math.max(...curveValues);
                        const span = Math.max(max - min, 0.0001);
                        return 72 - ((curveValues[scrubIndex] - min) / span) * 60 - 6;
                      })()}
                      r="4"
                      fill="currentColor"
                    />
                  )}
                </svg>
              </div>
              <div className="flex gap-1.5">
                {(["1D", "1W", "1M"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-medium",
                      range === r ? "bg-foreground/[0.1] text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Circular Quick Actions */}
            <div className="grid grid-cols-4 gap-2 pt-0.5 text-center">
              {[
                { key: "send", label: "Send", Icon: ArrowUpRight, primary: true, action: () => setSheet("send") },
                { key: "receive", label: "Receive", Icon: ArrowDownLeft, primary: false, action: () => setSheet("deposit") },
                { key: "swap", label: "Swap", Icon: ArrowUpDown, primary: false, action: () => setSheet("swap") },
                { key: "deposit", label: "Deposit", Icon: Plus, primary: false, action: () => setSheet("deposit") },
              ].map(({ key, label, Icon, primary, action }) => (
                <button
                  key={key}
                  type="button"
                  onClick={action}
                  className="flex flex-col items-center gap-1"
                >
                  <span
                    className={cn(
                      "grid size-9 place-items-center rounded-full border",
                      primary
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </button>
              ))}
            </div>

            {/* Holdings list */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] font-medium text-muted-foreground">Holdings</p>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {holdings.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedTokenId(h.id)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left transition-colors hover:bg-foreground/[0.04]"
                  >
                    <div className="flex items-center gap-2">
                      <span className={cn("grid size-6 place-items-center rounded-full bg-foreground/[0.06] font-mono text-[10px] font-semibold", h.color)}>
                        {h.symbol[0]}
                      </span>
                      <div>
                        <p className="text-xs font-medium">{h.name}</p>
                        <p className="text-[10px] text-muted-foreground tabular-nums">
                          {h.amount.toFixed(h.symbol === "USDC" ? 2 : 3)} {h.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <p className="text-xs font-medium">
                        {hidden ? "••••" : `$${(h.amount * h.price).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      </p>
                      <p className="text-[10px] text-emerald-400">+{h.changePct}%</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : tab === "card" ? (
          <div className="space-y-3 pt-1">
            <h3 className="text-sm font-semibold">Virtual Card</h3>
            <button
              type="button"
              onClick={() => setCardFlipped((v) => !v)}
              aria-label={cardFlipped ? "Show card front" : "Flip card for details"}
              className="relative w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-4 text-left text-white shadow-sm"
            >
              <AnimatePresence mode="wait" initial={false}>
                {!cardFlipped ? (
                  <motion.div
                    key="front"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold">beUI Card</span>
                      <span className="font-mono opacity-80">VISA</span>
                    </div>
                    <div>
                      <p className="font-mono text-sm tracking-widest">•••• •••• •••• 4829</p>
                      <p className="mt-1 text-[10px] opacity-75">Maya Chen · 08/29</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="back"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 py-1"
                  >
                    <p className="text-[11px] opacity-75">Card Number</p>
                    <p className="font-mono text-xs">4532 8910 3302 4829</p>
                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-[10px] opacity-70">EXP</p>
                        <p className="font-mono">08/29</p>
                      </div>
                      <div>
                        <p className="text-[10px] opacity-70">CVV</p>
                        <p className="font-mono">492</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {cardFrozen && (
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-sky-950/60 backdrop-blur-md">
                  <Snowflake className="size-4 text-sky-300" />
                  <span className="text-xs font-semibold text-sky-100">Card Frozen</span>
                </div>
              )}
            </button>
            <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-2.5">
              <div className="flex items-center gap-2 text-xs font-medium">
                {cardFrozen ? <Lock className="size-3.5 text-sky-400" /> : <Unlock className="size-3.5 text-muted-foreground" />}
                <span>Freeze card</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={cardFrozen}
                aria-label="Freeze card"
                onClick={() => setCardFrozen((v) => !v)}
                className={cn(
                  "flex h-6 w-10 items-center rounded-full p-0.5 transition-colors",
                  cardFrozen ? "bg-sky-500" : "bg-foreground/15",
                )}
              >
                <span className={cn("size-5 rounded-full bg-white transition-transform", cardFrozen && "translate-x-4")} />
              </button>
            </div>
          </div>
        ) : selectedTx ? (
          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={() => setSelectedTxId(null)}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Back to activity
            </button>
            <div className="rounded-2xl border border-border bg-card p-3.5">
              <p className="text-sm font-semibold">{selectedTx.title}</p>
              <p className="mt-0.5 font-mono text-xs text-muted-foreground">{selectedTx.hash}</p>
              <p className={cn("mt-2 font-mono text-base font-semibold", selectedTx.positive ? "text-emerald-400" : "text-foreground")}>
                {selectedTx.amountLabel}
              </p>
              <ol className="mt-4 space-y-2.5 border-l border-border pl-3.5">
                {selectedTx.timeline.map((step) => (
                  <li key={step.label} className="relative flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="size-3 text-emerald-400" />
                      {step.label}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">{step.time}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 pt-1">
            <h3 className="text-sm font-semibold">Activity</h3>
            <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {activity.map((tx) => (
                <button
                  key={tx.id}
                  type="button"
                  onClick={() => setSelectedTxId(tx.id)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-foreground/[0.04]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-xs font-medium">{tx.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{tx.time}</p>
                  </div>
                  <span className={cn("shrink-0 font-mono text-xs tabular-nums", tx.positive ? "text-emerald-400" : "text-foreground")}>
                    {tx.amountLabel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tab Dock */}
      <nav aria-label="Neobank navigation" className="grid grid-cols-3 border-t border-border bg-background/95 px-2 py-2">
        {[
          { id: "home" as const, label: "Home", Icon: Home },
          { id: "card" as const, label: "Card", Icon: CreditCard },
          { id: "activity" as const, label: "Activity", Icon: Activity },
        ].map(({ id, label, Icon }) => {
          const active = tab === id && !selectedToken && !sheet;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setSelectedTokenId(null);
                setSelectedTxId(null);
                setSheet(null);
                setTab(id);
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 py-0.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
