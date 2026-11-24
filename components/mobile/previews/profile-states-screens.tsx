"use client";

import {
  AlertTriangle,
  ArrowDownToLine,
  Bell,
  ChevronRight,
  FolderPlus,
  Lock,
  MapPin,
  Moon,
  Palette,
  RefreshCw,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  Trash2,
  WifiOff,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, damping: 24, stiffness: 320 };

export function ProfileScreenPreview() {
  const [tab, setTab] = useState<"saved" | "shared">("saved");
  const savedItems = ["Motion Kit", "Finance HUD", "Typography"];
  const sharedItems = ["Design Tokens", "Mobile Patterns"];
  const items = tab === "saved" ? savedItems : sharedItems;

  return (
    <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
      <div className="rounded-3xl border border-border bg-card p-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-base font-semibold text-white">
          SK
        </div>
        <h3 className="mt-2.5 text-sm font-semibold text-foreground">Soren Klein</h3>
        <p className="text-[11px] text-muted-foreground">Product Designer · San Francisco</p>

        <div className="mt-3 grid grid-cols-3 divide-x divide-border border-t border-border pt-3">
          {[
            { label: "Saved", value: "28" },
            { label: "Streak", value: "14d" },
            { label: "Collections", value: "6" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-xs font-semibold text-foreground tabular-nums">
                {stat.value}
              </p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex gap-1 rounded-xl bg-muted p-1">
        {(["saved", "shared"] as const).map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => setTab(next)}
            className={cn(
              "flex-1 rounded-lg py-1 text-[11px] font-medium capitalize",
              tab === next ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {next}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-2.5"
          >
            <span className="text-xs font-medium text-foreground">{item}</span>
            <ChevronRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsScreenPreview() {
  const rows = [
    { icon: Palette, label: "Appearance", badge: "Auto" },
    { icon: Bell, label: "Notifications", badge: "On" },
    { icon: Lock, label: "Passcode & Face ID", badge: "Enabled" },
    { icon: Shield, label: "Connected accounts", badge: "2" },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Settings</h3>

        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            SK
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-foreground">Soren Klein</p>
            <p className="truncate text-[10px] text-muted-foreground">soren@studio.dev</p>
          </div>
          <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
        </div>

        <div className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {rows.map((row) => {
            const Icon = row.icon;
            return (
              <div key={row.label} className="flex items-center justify-between px-3.5 py-2.5">
                <div className="flex items-center gap-2.5">
                  <Icon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">{row.label}</span>
                </div>
                <span className="text-[11px] text-muted-foreground">{row.badge}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-center font-mono text-[10px] text-muted-foreground">
        Version 2.4.0 (Build 184)
      </p>
    </div>
  );
}

export function SettingsListPreview() {
  const [state, setState] = useState({
    haptics: true,
    sync: true,
    analytics: false,
    beta: true,
  });

  const entries: Array<{ key: keyof typeof state; label: string; sub: string }> = [
    { key: "haptics", label: "Haptic feedback", sub: "Tactile taps on gestures" },
    { key: "sync", label: "iCloud sync", sub: "Sync presets automatically" },
    { key: "analytics", label: "Crash diagnostics", sub: "Anonymous performance logs" },
    { key: "beta", label: "Early previews", sub: "Enable experimental animations" },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Preferences
      </p>
      <div className="mt-2.5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {entries.map((entry) => {
          const on = state[entry.key];
          return (
            <button
              key={entry.key}
              type="button"
              onClick={() => setState((prev) => ({ ...prev, [entry.key]: !prev[entry.key] }))}
              className="flex w-full items-center justify-between px-3.5 py-3 text-left"
            >
              <div>
                <p className="text-xs font-medium text-foreground">{entry.label}</p>
                <p className="text-[10px] text-muted-foreground">{entry.sub}</p>
              </div>
              <span
                className={cn(
                  "h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors",
                  on ? "bg-primary" : "bg-muted",
                )}
              >
                <span
                  className={cn(
                    "block size-4 rounded-full bg-white transition-transform",
                    on ? "translate-x-4" : "translate-x-0",
                  )}
                />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function AppearancePickerPreview() {
  const [mode, setMode] = useState<"system" | "light" | "dark">("dark");
  const [accent, setAccent] = useState("#2f8af5");

  const swatches = ["#2f8af5", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-3 pb-4">
      <div>
        <h3 className="text-base font-semibold text-foreground">Appearance</h3>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {(
            [
              { id: "system", label: "Auto", icon: SlidersHorizontal },
              { id: "light", label: "Light", icon: Sun },
              { id: "dark", label: "Dark", icon: Moon },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border p-3 transition-colors",
                mode === id ? "border-primary bg-card" : "border-border bg-card/50",
              )}
            >
              <Icon aria-hidden="true" className="size-4 text-foreground" />
              <span className="text-[11px] font-medium text-foreground">{label}</span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-xs font-medium text-foreground">Accent tint</p>
        <div className="mt-2 flex items-center gap-2.5">
          {swatches.map((hex) => (
            <button
              key={hex}
              type="button"
              aria-label={`Select accent ${hex}`}
              onClick={() => setAccent(hex)}
              style={{ backgroundColor: hex }}
              className={cn(
                "size-7 rounded-full transition-transform",
                accent === hex ? "scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background" : "opacity-80",
              )}
            />
          ))}
        </div>
      </div>

      <div
        style={{ backgroundColor: accent }}
        className="rounded-2xl py-2.5 text-center text-xs font-semibold text-white transition-colors"
      >
        Preview {mode} · Accent active
      </div>
    </div>
  );
}

export function NotificationPreferencesPreview() {
  const [mentions, setMentions] = useState(true);
  const [runs, setRuns] = useState(true);
  const [quiet, setQuiet] = useState(true);

  return (
    <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
      <h3 className="text-base font-semibold text-foreground">Notification settings</h3>
      <div className="mt-3 space-y-2">
        {[
          { label: "Direct mentions", sub: "Instant alert for @replies", val: mentions, toggle: () => setMentions((v) => !v) },
          { label: "Agent completions", sub: "Notify when tasks finish", val: runs, toggle: () => setRuns((v) => !v) },
          { label: "Quiet hours (22:00 - 08:00)", sub: "Silence non-urgent banners", val: quiet, toggle: () => setQuiet((v) => !v) },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.toggle}
            className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-3 text-left"
          >
            <div>
              <p className="text-xs font-medium text-foreground">{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.sub}</p>
            </div>
            <span
              className={cn(
                "h-5 w-9 shrink-0 rounded-full p-0.5 transition-colors",
                item.val ? "bg-primary" : "bg-muted",
              )}
            >
              <span
                className={cn(
                  "block size-4 rounded-full bg-white transition-transform",
                  item.val ? "translate-x-4" : "translate-x-0",
                )}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function DeleteAccountPreview() {
  const [confirmText, setConfirmText] = useState("");
  const [deleted, setDeleted] = useState(false);
  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-3 pb-4">
      <div>
        <div className="flex size-10 items-center justify-center rounded-2xl bg-red-500/15 text-red-500">
          <AlertTriangle aria-hidden="true" className="size-5" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-foreground">Delete account</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          This permanently removes saved workspaces, devices, and tokens. Type DELETE to confirm.
        </p>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => {
            setConfirmText(e.target.value);
            setDeleted(false);
          }}
          placeholder="Type DELETE"
          aria-label="Confirmation keyword"
          className="mt-4 w-full rounded-xl border border-border bg-card px-3 py-2.5 font-mono text-xs text-foreground outline-none focus:border-red-500"
        />
      </div>

      <button
        type="button"
        disabled={!canDelete}
        onClick={() => setDeleted(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-red-500 py-2.5 text-xs font-semibold text-white transition-opacity disabled:opacity-40"
      >
        <Trash2 aria-hidden="true" className="size-3.5" />
        <span>{deleted ? "Account scheduled for removal" : "Delete permanently"}</span>
      </button>
    </div>
  );
}

export function EmptyStatePreview() {
  const [created, setCreated] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
      <div className="flex size-14 items-center justify-center rounded-3xl border border-border bg-card text-muted-foreground">
        <FolderPlus aria-hidden="true" className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">
        {created ? `Created "${created}"` : "No workspaces yet"}
      </h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Start a new mobile collection or pick a quick starter preset below.
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-1.5">
        {["Fintech", "AI Chat", "Storefront"].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setCreated(preset)}
            className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-foreground hover:bg-muted"
          >
            + {preset}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setCreated("Blank workspace")}
        className="mt-5 w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        Create workspace
      </button>
    </div>
  );
}

export function OfflineStatePreview() {
  const [retrying, setRetrying] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
      <div className="flex size-14 items-center justify-center rounded-3xl border border-border bg-card text-amber-500">
        <WifiOff aria-hidden="true" className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">You are offline</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
        Showing cached drafts from 4 minutes ago. Changes will sync when reconnected.
      </p>

      <button
        type="button"
        onClick={() => setRetrying((r) => !r)}
        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        <RefreshCw aria-hidden="true" className={cn("size-3.5", retrying && "animate-spin")} />
        <span>{retrying ? "Checking connection..." : "Try again"}</span>
      </button>
    </div>
  );
}

export function UpdateRequiredPreview() {
  const [updating, setUpdating] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-5 pt-6 pb-5">
      <div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-primary">
          <ArrowDownToLine aria-hidden="true" className="size-3" />
          v2.4 Available
        </span>
        <h3 className="mt-3 text-lg font-semibold text-foreground">Update to stay in sync</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Release 2.4 upgrades gesture physics and offline cache recovery.
        </p>

        <ul className="mt-4 space-y-2 rounded-2xl border border-border bg-card p-3.5 text-xs text-foreground">
          <li>· Faster Reanimated card transitions</li>
          <li>· Redesigned dark appearance palette</li>
          <li>· Passkey recovery improvements</li>
        </ul>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setUpdating(true)}
          className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          {updating ? "Opening App Store..." : "Update now"}
        </button>
        <button
          type="button"
          className="w-full py-1.5 text-center text-[11px] text-muted-foreground hover:text-foreground"
        >
          Remind me tomorrow
        </button>
      </div>
    </div>
  );
}

export function NotificationPromptPreview() {
  const [allowed, setAllowed] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-4 pb-5">
      <div>
        <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Bell aria-hidden="true" className="size-5" />
        </div>
        <h3 className="mt-3 text-center text-base font-semibold text-foreground">
          Stay in the loop
        </h3>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Only real-time mentions, transfers, and finished runs.
        </p>

        <div className="mt-4 space-y-2">
          {[
            { app: "Agent Run", msg: "Pull request #184 passed 99 checks", time: "now" },
            { app: "Transfer", msg: "Received +$420.00 from Maya", time: "2m" },
          ].map((banner) => (
            <div
              key={banner.app}
              className="rounded-2xl border border-border bg-card p-3 shadow-sm"
            >
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span className="font-semibold text-foreground">{banner.app}</span>
                <span>{banner.time}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{banner.msg}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAllowed(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {allowed ? "Push notifications enabled" : "Enable notifications"}
      </button>
    </div>
  );
}

export function PermissionPromptPreview() {
  const reduce = useReducedMotion();
  const [choice, setChoice] = useState<"none" | "using" | "once">("none");

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-3 pb-5">
      <div>
        <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-3xl border border-border bg-card">
          <motion.div
            animate={reduce ? undefined : { scale: [1, 1.35, 1], opacity: [0.35, 0.1, 0.35] }}
            transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY }}
            className="absolute size-24 rounded-full bg-primary/25"
          />
          <div className="relative flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <MapPin aria-hidden="true" className="size-5" />
          </div>
        </div>

        <h3 className="mt-4 text-center text-base font-semibold text-foreground">
          Share local currency & pickup
        </h3>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Used only when finding nearby ATMs or courier dropoffs.
        </p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setChoice("using")}
          className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          {choice === "using" ? "Location allowed while using" : "Allow while using app"}
        </button>
        <button
          type="button"
          onClick={() => setChoice("once")}
          className="w-full rounded-2xl border border-border bg-card py-2 text-xs font-medium text-foreground"
        >
          {choice === "once" ? "Allowed once" : "Allow once"}
        </button>
      </div>
    </div>
  );
}

export function RateTheAppPreview() {
  const reduce = useReducedMotion();
  const [stars, setStars] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-5 pt-6 pb-5 text-center">
      <div className="w-full">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
          <Sparkles aria-hidden="true" className="size-6" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-foreground">
          Enjoying the app?
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Tap a rating to tailor your feedback.
        </p>

        <div className="mt-5 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= stars;
            return (
              <motion.button
                key={value}
                type="button"
                whileTap={reduce ? undefined : { scale: 1.25 }}
                transition={SPRING}
                onClick={() => {
                  setStars(value);
                  setSubmitted(false);
                }}
                aria-label={`Rate ${value} out of 5`}
                className="p-1"
              >
                <Star
                  aria-hidden="true"
                  className={cn(
                    "size-7 transition-colors",
                    active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40",
                  )}
                />
              </motion.button>
            );
          })}
        </div>

        <p className="mt-3 text-xs font-medium text-foreground">
          {stars >= 4 ? "Ready to review on App Store" : "Tell us what we can improve"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setSubmitted(true)}
        className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {submitted ? "Thanks for rating" : stars >= 4 ? "Rate on App Store" : "Send note"}
      </button>
    </div>
  );
}
