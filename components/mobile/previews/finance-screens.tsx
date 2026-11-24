"use client";

import {
  ArrowDownLeft,
  ArrowUpDown,
  ArrowUpRight,
  Check,
  Copy,
  CreditCard,
  Delete,
  Eye,
  EyeOff,
  Lock,
  Plane,
  Plus,
  QrCode,
  Search,
  Send,
  ShieldCheck,
  Snowflake,
  Sparkles,
  TrendingUp,
  Unlock,
  Users,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, damping: 24, stiffness: 320 };

export function AccountsScreenPreview() {
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [currencyIndex, setCurrencyIndex] = useState(0);

  const accounts = [
    { code: "USD", label: "US Dollar", symbol: "$", balance: "18,420", flag: "US" },
    { code: "EUR", label: "Euro", symbol: "€", balance: "6,210", flag: "EU" },
    { code: "GBP", label: "British Pound", symbol: "£", balance: "3,180", flag: "UK" },
  ];
  const active = accounts[currencyIndex] ?? accounts[0];

  const txns = [
    { id: "t1", title: "Figma Pro Team", time: "Today, 09:12", amount: "-$45.00", positive: false },
    { id: "t2", title: "Stripe Payout", time: "Yesterday", amount: "+$2,480.00", positive: true },
    { id: "t3", title: "Blue Bottle Coffee", time: "Nov 21", amount: "-$6.80", positive: false },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-medium text-muted-foreground">Total balance</p>
          <p className="text-base font-semibold tracking-tight text-foreground">
            {hidden ? "••••••" : `${active.symbol}${active.balance}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setHidden((prev) => !prev)}
          aria-label={hidden ? "Show balances" : "Mask balances"}
          className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
        >
          {hidden ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Eye aria-hidden="true" className="size-3.5" />}
        </button>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {accounts.map((acc, idx) => (
          <button
            key={acc.code}
            type="button"
            onClick={() => setCurrencyIndex(idx)}
            className={cn(
              "min-w-0 rounded-2xl border p-2 text-left transition-colors",
              currencyIndex === idx
                ? "border-primary/40 bg-card shadow-sm"
                : "border-border bg-card/50 opacity-75 hover:opacity-100",
            )}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="rounded bg-muted px-1 py-0.5 font-mono text-[9px] font-semibold text-foreground">
                {acc.flag}
              </span>
              <span className="text-[9px] text-muted-foreground">{acc.code}</span>
            </div>
            <p className="mt-2 truncate font-mono text-[11px] font-semibold text-foreground tabular-nums">
              {hidden ? "••••" : `${acc.symbol}${acc.balance}`}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Add", icon: Plus },
          { label: "Send", icon: ArrowUpRight },
          { label: "Convert", icon: ArrowUpDown },
        ].map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            className="flex items-center justify-center gap-1 rounded-xl bg-primary px-2 py-2 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Icon aria-hidden="true" className="size-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Recent activity
        </p>
        <div className="mt-2 space-y-2">
          {txns.map((txn, idx) => (
            <motion.div
              key={txn.id}
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: idx * 0.04 }}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-7 items-center justify-center rounded-full bg-muted text-foreground">
                  {txn.positive ? (
                    <ArrowDownLeft aria-hidden="true" className="size-3.5 text-emerald-500" />
                  ) : (
                    <ArrowUpRight aria-hidden="true" className="size-3.5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{txn.title}</p>
                  <p className="text-[10px] text-muted-foreground">{txn.time}</p>
                </div>
              </div>
              <span
                className={cn(
                  "font-mono text-xs font-medium tabular-nums",
                  txn.positive ? "text-emerald-500" : "text-foreground",
                )}
              >
                {hidden ? "••••" : txn.amount}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TransactionHistoryPreview() {
  const [filter, setFilter] = useState<"all" | "in" | "out">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>("h1");

  const entries = [
    { id: "h1", day: "Today", name: "Linear Workspace", cat: "Software", amount: -16, sign: "-" },
    { id: "h2", day: "Today", name: "Client Retainer", cat: "Transfer", amount: 3200, sign: "+" },
    { id: "h3", day: "Yesterday", name: "Whole Foods Market", cat: "Groceries", amount: -84.2, sign: "-" },
    { id: "h4", day: "Yesterday", name: "Apple Services", cat: "Media", amount: -14.99, sign: "-" },
  ];

  const filtered = entries.filter((entry) => {
    if (filter === "in" && entry.sign !== "+") return false;
    if (filter === "out" && entry.sign !== "-") return false;
    if (query.trim() && !entry.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    return true;
  });

  const totalIn = filter === "out" ? 0 : 3200;
  const totalOut = filter === "in" ? 0 : 115.19;
  const inWidth = totalIn + totalOut === 0 ? 50 : Math.round((totalIn / (totalIn + totalOut)) * 100);

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Activity</h3>
        <span className="font-mono text-[11px] text-muted-foreground">November</span>
      </div>

      <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2">
        <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter merchants..."
          aria-label="Filter merchants"
          className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-2.5 flex gap-1.5">
        {(
          [
            { id: "all", label: "All" },
            { id: "in", label: "Money in" },
            { id: "out", label: "Money out" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
              filter === item.id
                ? "bg-foreground text-background"
                : "bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-3">
        <div className="flex justify-between text-[11px]">
          <span className="text-emerald-500 font-medium tabular-nums">+${totalIn.toLocaleString()}</span>
          <span className="text-muted-foreground tabular-nums">-${totalOut.toFixed(2)}</span>
        </div>
        <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-muted">
          <div style={{ width: `${inWidth}%` }} className="bg-emerald-500 transition-all duration-300" />
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {filtered.map((item) => {
          const expanded = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(expanded ? null : item.id)}
              className="flex w-full flex-col rounded-2xl border border-border bg-card px-3 py-2 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {item.day} · {item.cat}
                  </p>
                </div>
                <span
                  className={cn(
                    "font-mono text-xs font-medium tabular-nums",
                    item.sign === "+" ? "text-emerald-500" : "text-foreground",
                  )}
                >
                  {item.sign}${Math.abs(item.amount).toFixed(2)}
                </span>
              </div>
              {expanded ? (
                <p className="mt-1.5 border-t border-border pt-1.5 text-[10px] text-muted-foreground">
                  Card •••• 4821 · Settled instantly
                </p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SendMoneyPreview() {
  const [recipient, setRecipient] = useState("Maya");
  const [digits, setDigits] = useState("125");
  const [sent, setSent] = useState(false);

  const contacts = [
    { name: "Maya", initials: "ML" },
    { name: "Theo", initials: "TK" },
    { name: "Elena", initials: "ER" },
    { name: "Kai", initials: "KW" },
  ];

  const handleKey = (key: string) => {
    setSent(false);
    if (key === "back") {
      setDigits((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
      return;
    }
    if (key === "." && digits.includes(".")) return;
    setDigits((prev) => (prev === "0" && key !== "." ? key : `${prev}${key}`.slice(0, 6)));
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <p className="text-center text-xs font-semibold text-foreground">Send transfer</p>
        <div className="mt-3 flex justify-center gap-2.5">
          {contacts.map((person) => (
            <button
              key={person.name}
              type="button"
              onClick={() => {
                setRecipient(person.name);
                setSent(false);
              }}
              className="flex flex-col items-center gap-1"
            >
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-[11px] font-semibold transition-all",
                  recipient === person.name
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/40 ring-offset-2 ring-offset-background"
                    : "border border-border bg-card text-foreground",
                )}
              >
                {person.initials}
              </span>
              <span className="text-[10px] text-muted-foreground">{person.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="font-mono text-3xl font-semibold tracking-tight text-foreground tabular-nums">
            ${digits}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Available balance $18,420
          </p>
        </div>
      </div>

      <div>
        <div className="grid grid-cols-3 gap-1.5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKey(key)}
              className="flex h-10 items-center justify-center rounded-xl bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
            >
              {key === "back" ? <Delete aria-hidden="true" className="size-4" /> : key}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setSent(true)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          {sent ? <Check aria-hidden="true" className="size-3.5" /> : <Send aria-hidden="true" className="size-3.5" />}
          <span>{sent ? `Sent $${digits} to ${recipient}` : `Send to ${recipient}`}</span>
        </button>
      </div>
    </div>
  );
}

export function SplitBillPreview() {
  const [selected, setSelected] = useState<string[]>(["you", "maya", "theo"]);
  const [requested, setRequested] = useState(false);

  const people = [
    { id: "you", name: "You", initials: "YO" },
    { id: "maya", name: "Maya Lin", initials: "ML" },
    { id: "theo", name: "Theo Brooks", initials: "TB" },
    { id: "elena", name: "Elena Sato", initials: "ES" },
  ];

  const total = 148;
  const share = selected.length > 0 ? total / selected.length : total;

  const toggle = (id: string) => {
    setRequested(false);
    setSelected((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id],
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="rounded-3xl border border-border bg-card p-3.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Users aria-hidden="true" className="size-3.5" />
              Dinner at Tartine
            </span>
            <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
              ${total.toFixed(2)}
            </span>
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold text-foreground tabular-nums">
            ${share.toFixed(2)}{" "}
            <span className="text-xs font-normal text-muted-foreground">/ person</span>
          </p>
        </div>

        <div className="mt-3 space-y-2">
          {people.map((person) => {
            const active = selected.includes(person.id);
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => toggle(person.id)}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                    {person.initials}
                  </span>
                  <span className="text-xs font-medium text-foreground">{person.name}</span>
                </div>
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full border",
                    active ? "border-primary bg-primary text-primary-foreground" : "border-border",
                  )}
                >
                  {active ? <Check aria-hidden="true" className="size-3" /> : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setRequested(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        {requested ? "Split requests sent" : `Split across ${selected.length} people`}
      </button>
    </div>
  );
}

export function AddMoneyPreview() {
  const [amount, setAmount] = useState(100);
  const [method, setMethod] = useState<"apple" | "bank">("apple");
  const [added, setAdded] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Add money</h3>
        <div className="mt-3 rounded-3xl border border-border bg-card p-4 text-center">
          <p className="text-[11px] text-muted-foreground">Instant top up</p>
          <p className="mt-1 font-mono text-3xl font-semibold text-foreground tabular-nums">
            ${amount}
          </p>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {[25, 100, 250, 500].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setAmount(val);
                  setAdded(false);
                }}
                className={cn(
                  "rounded-xl py-1.5 font-mono text-[11px] font-medium transition-colors",
                  amount === val
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {[
            { id: "apple", title: "Apple Pay", sub: "No fee · Arrives in seconds" },
            { id: "bank", title: "Chase Checking ••4821", sub: "ACH Instant · Free" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMethod(item.id as "apple" | "bank")}
              className={cn(
                "flex w-full items-center justify-between rounded-2xl border p-3 text-left transition-colors",
                method === item.id ? "border-primary bg-card" : "border-border bg-card/60",
              )}
            >
              <div>
                <p className="text-xs font-medium text-foreground">{item.title}</p>
                <p className="text-[10px] text-muted-foreground">{item.sub}</p>
              </div>
              <span
                className={cn(
                  "size-4 rounded-full border-2",
                  method === item.id ? "border-primary bg-primary" : "border-border",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAdded(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {added ? `Added $${amount} to USD` : `Add $${amount}`}
      </button>
    </div>
  );
}

export function ReceiveScreenPreview() {
  const [network, setNetwork] = useState<"Base" | "Solana" | "Handle">("Base");
  const [copied, setCopied] = useState(false);

  const addresses = {
    Base: "0x71c9...8e24",
    Solana: "7xKX...9pLm",
    Handle: "@soren.studio",
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Receive</h3>
          <QrCode aria-hidden="true" className="size-4 text-muted-foreground" />
        </div>

        <div className="mt-3 flex gap-1 rounded-xl bg-muted p-1">
          {(["Base", "Solana", "Handle"] as const).map((net) => (
            <button
              key={net}
              type="button"
              onClick={() => {
                setNetwork(net);
                setCopied(false);
              }}
              className={cn(
                "flex-1 rounded-lg py-1 text-[11px] font-medium transition-colors",
                network === net ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {net}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col items-center rounded-3xl border border-border bg-card p-4">
          <div className="rounded-2xl bg-white p-3">
            <svg viewBox="0 0 64 64" className="size-28 text-black" aria-hidden="true">
              <rect x="4" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="10" y="10" width="6" height="6" fill="currentColor" />
              <rect x="42" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="48" y="10" width="6" height="6" fill="currentColor" />
              <rect x="4" y="42" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="4" />
              <rect x="10" y="48" width="6" height="6" fill="currentColor" />
              <rect x="28" y="6" width="6" height="6" fill="currentColor" />
              <rect x="28" y="18" width="8" height="6" fill="currentColor" />
              <rect x="6" y="28" width="6" height="6" fill="currentColor" />
              <rect x="18" y="28" width="12" height="6" fill="currentColor" />
              <rect x="34" y="28" width="6" height="12" fill="currentColor" />
              <rect x="46" y="28" width="14" height="6" fill="currentColor" />
              <rect x="28" y="42" width="6" height="6" fill="currentColor" />
              <rect x="40" y="44" width="10" height="6" fill="currentColor" />
              <rect x="52" y="48" width="8" height="12" fill="currentColor" />
            </svg>
          </div>
          <p className="mt-3 font-mono text-xs font-medium text-foreground">
            {addresses[network]}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{network} network verified</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCopied(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {copied ? <Check aria-hidden="true" className="size-3.5" /> : <Copy aria-hidden="true" className="size-3.5" />}
        <span>{copied ? "Address copied" : "Copy address"}</span>
      </button>
    </div>
  );
}

export function SwapScreenPreview() {
  const [reversed, setReversed] = useState(false);
  const [pct, setPct] = useState(50);
  const [swapped, setSwapped] = useState(false);

  const fromToken = reversed ? "USDC" : "ETH";
  const toToken = reversed ? "ETH" : "USDC";
  const fromAmt = reversed ? (pct * 28).toFixed(0) : ((pct / 100) * 1.4).toFixed(2);
  const toAmt = reversed ? ((pct / 100) * 0.94).toFixed(3) : (pct * 42.6).toFixed(2);

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Swap</h3>
          <span className="rounded-full bg-card px-2 py-0.5 text-[10px] text-muted-foreground">
            Slippage 0.5%
          </span>
        </div>

        <div className="relative mt-3 space-y-2">
          <div className="rounded-2xl border border-border bg-card p-3.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Pay</span>
              <span>Balance {reversed ? "5,600 USDC" : "2.10 ETH"}</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">
                {fromAmt}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                {fromToken}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setReversed((r) => !r);
              setSwapped(false);
            }}
            aria-label="Flip tokens"
            className="mx-auto -my-3 relative z-10 flex size-8 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm transition-transform active:rotate-180"
          >
            <ArrowUpDown aria-hidden="true" className="size-3.5" />
          </button>

          <div className="rounded-2xl border border-border bg-card p-3.5">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Receive</span>
              <span>Rate 1 ETH = $3,040</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="font-mono text-2xl font-semibold text-foreground tabular-nums">
                {toAmt}
              </span>
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground">
                {toToken}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex gap-1.5">
          {[25, 50, 75, 100].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setPct(v);
                setSwapped(false);
              }}
              className={cn(
                "flex-1 rounded-xl py-1.5 font-mono text-[11px] font-medium",
                pct === v ? "bg-foreground text-background" : "bg-card text-muted-foreground",
              )}
            >
              {v === 100 ? "MAX" : `${v}%`}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setSwapped(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {swapped ? `Swapped ${fromAmt} ${fromToken}` : `Swap ${fromToken} to ${toToken}`}
      </button>
    </div>
  );
}

export function YieldVaultPreview() {
  const [term, setTerm] = useState<"flex" | "30d" | "90d">("30d");
  const [deposited, setDeposited] = useState(false);

  const apy = term === "flex" ? "4.1%" : term === "30d" ? "5.2%" : "6.4%";

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Treasury Vault</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
            <TrendingUp aria-hidden="true" className="size-3" />
            {apy} APY
          </span>
        </div>

        <div className="mt-3 rounded-3xl border border-border bg-card p-4">
          <p className="text-[11px] text-muted-foreground">USDC Reserve</p>
          <p className="mt-1 font-mono text-2xl font-semibold text-foreground tabular-nums">
            $4,850.00
          </p>
          <p className="mt-1 text-[11px] text-emerald-500">
            Est. +${term === "flex" ? "198" : term === "30d" ? "252" : "310"}/yr
          </p>
        </div>

        <p className="mt-3 text-[11px] font-medium text-muted-foreground">Lock period</p>
        <div className="mt-1.5 grid grid-cols-3 gap-1.5">
          {(["flex", "30d", "90d"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTerm(item);
                setDeposited(false);
              }}
              className={cn(
                "rounded-xl border py-2 text-xs font-medium capitalize",
                term === item
                  ? "border-primary bg-card text-foreground"
                  : "border-border bg-card/50 text-muted-foreground",
              )}
            >
              {item === "flex" ? "Flexible" : item}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDeposited(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        <Sparkles aria-hidden="true" className="size-3.5" />
        <span>{deposited ? "Vault deposit active" : "Deposit $1,000 USDC"}</span>
      </button>
    </div>
  );
}

export function CardControlsPreview() {
  const [frozen, setFrozen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [contactless, setContactless] = useState(true);

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Obsidian Card</h3>
        <CreditCard aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>

      <div
        className={cn(
          "relative mt-3 overflow-hidden rounded-2xl border p-4 transition-all",
          frozen
            ? "border-sky-400/40 bg-sky-500/10"
            : "border-white/15 bg-gradient-to-br from-[#1f232c] via-[#13151b] to-[#0b0c10] text-white",
        )}
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold">beUI Metal</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
            {frozen ? "Frozen" : "Active"}
          </span>
        </div>
        <p className="mt-6 font-mono text-sm tracking-wider tabular-nums">
          {showDetails ? "4532  8910  2241  4821" : "••••  ••••  ••••  4821"}
        </p>
        <div className="mt-3 flex justify-between font-mono text-[10px] opacity-80">
          <span>EXP 09/29</span>
          <span>CVV {showDetails ? "842" : "•••"}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setFrozen((f) => !f)}
          className={cn(
            "flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-medium",
            frozen ? "border-sky-400/40 bg-sky-500/10 text-sky-400" : "border-border bg-card text-foreground",
          )}
        >
          {frozen ? <Unlock aria-hidden="true" className="size-3.5" /> : <Snowflake aria-hidden="true" className="size-3.5" />}
          <span>{frozen ? "Unfreeze" : "Freeze card"}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowDetails((s) => !s)}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2 text-xs font-medium text-foreground"
        >
          {showDetails ? <EyeOff aria-hidden="true" className="size-3.5" /> : <Lock aria-hidden="true" className="size-3.5" />}
          <span>{showDetails ? "Hide" : "Reveal"}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setContactless((c) => !c)}
        className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-2.5"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-foreground">
          <ShieldCheck aria-hidden="true" className="size-4 text-emerald-500" />
          <span>Contactless payments</span>
        </div>
        <span
          className={cn(
            "h-5 w-9 rounded-full p-0.5 transition-colors",
            contactless ? "bg-primary" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "block size-4 rounded-full bg-white transition-transform",
              contactless ? "translate-x-4" : "translate-x-0",
            )}
          />
        </span>
      </button>
    </div>
  );
}

export function WalletScreenPreview() {
  const [activeId, setActiveId] = useState("studio");
  const passes = [
    { id: "studio", title: "Studio All-Access", sub: "Member #0841", bg: "from-zinc-800 to-zinc-950 text-white" },
    { id: "transit", title: "Bay Transit Pass", sub: "Balance $32.50", bg: "from-sky-600 to-blue-800 text-white" },
    { id: "coffee", title: "Roastery Club", sub: "2 free drinks", bg: "from-amber-600 to-orange-800 text-white" },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Wallet</h3>
        <span className="text-[11px] text-muted-foreground">{passes.length} passes</span>
      </div>

      <div className="mt-3 space-y-2">
        {passes.map((pass) => {
          const active = activeId === pass.id;
          return (
            <button
              key={pass.id}
              type="button"
              onClick={() => setActiveId(pass.id)}
              className={cn(
                "w-full rounded-2xl bg-gradient-to-br p-3.5 text-left transition-all",
                pass.bg,
                active ? "shadow-md ring-2 ring-primary/40" : "opacity-80",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">{pass.title}</span>
                <span className="text-[10px] opacity-80">{pass.sub}</span>
              </div>
              {active ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-black">
                  <span className="font-mono text-[10px] font-medium">HOLD NEAR READER</span>
                  <QrCode aria-hidden="true" className="size-4" />
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function BoardingPassPreview() {
  const [bright, setBright] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div className="rounded-3xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-muted-foreground">NH 007</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">
            On time
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="font-mono text-2xl font-bold text-foreground">SFO</p>
            <p className="text-[10px] text-muted-foreground">San Francisco</p>
          </div>
          <Plane aria-hidden="true" className="size-4 text-primary" />
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-foreground">HND</p>
            <p className="text-[10px] text-muted-foreground">Tokyo Haneda</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-y border-dashed border-border py-2.5 text-center">
          <div>
            <p className="text-[10px] text-muted-foreground">Gate</p>
            <p className="font-mono text-xs font-semibold text-foreground">G12</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Seat</p>
            <p className="font-mono text-xs font-semibold text-foreground">14A</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Group</p>
            <p className="font-mono text-xs font-semibold text-foreground">2</p>
          </div>
        </div>

        <div
          className={cn(
            "mt-3 flex flex-col items-center rounded-2xl p-2.5 transition-all",
            bright ? "bg-white text-black shadow-md" : "bg-muted text-foreground",
          )}
        >
          <div className="flex h-10 w-full items-center justify-center gap-0.5">
            {["b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11", "b12"].map(
              (bar, i) => (
                <span
                  key={bar}
                  className={cn(
                    "h-full bg-current",
                    i % 3 === 0 ? "w-1" : i % 2 === 0 ? "w-0.5" : "w-1.5",
                  )}
                />
              ),
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setBright((b) => !b)}
        className="w-full rounded-2xl border border-border bg-card py-2 text-xs font-medium text-foreground"
      >
        {bright ? "Normal brightness" : "Boost scan brightness"}
      </button>
    </div>
  );
}
