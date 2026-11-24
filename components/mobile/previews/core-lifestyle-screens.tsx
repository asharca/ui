"use client";

import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  Compass,
  Flame,
  Heart,
  Home,
  Inbox,
  Send,
  Trophy,
  User,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, damping: 24, stiffness: 320 };

export function LeaderboardMobilePreview() {
  const [scope, setScope] = useState<"global" | "friends">("global");
  const rows =
    scope === "global"
      ? [
          { rank: 1, name: "Aria Chen", pts: "4,920" },
          { rank: 2, name: "Mateo Silva", pts: "4,610" },
          { rank: 3, name: "Nora Park", pts: "4,340" },
          { rank: 4, name: "Lukas Meyer", pts: "3,980" },
        ]
      : [
          { rank: 1, name: "Maya Lin", pts: "3,410" },
          { rank: 2, name: "Theo Brooks", pts: "3,120" },
          { rank: 3, name: "Elena Sato", pts: "2,890" },
        ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Standings</h3>
          <Trophy aria-hidden="true" className="size-4 text-amber-400" />
        </div>

        <div className="mt-2.5 flex gap-1 rounded-xl bg-muted p-1">
          {(["global", "friends"] as const).map((next) => (
            <button
              key={next}
              type="button"
              onClick={() => setScope(next)}
              className={cn(
                "flex-1 rounded-lg py-1 text-[11px] font-medium capitalize",
                scope === next ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              {next}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 items-end gap-2 rounded-2xl border border-border bg-card p-3 text-center">
          <div className="rounded-xl bg-muted/60 py-2">
            <p className="text-[10px] text-muted-foreground">#2</p>
            <p className="truncate text-[11px] font-semibold text-foreground">
              {rows[1]?.name.split(" ")[0]}
            </p>
          </div>
          <div className="rounded-xl bg-primary/15 py-3">
            <p className="text-[10px] font-semibold text-primary">#1</p>
            <p className="truncate text-xs font-semibold text-foreground">
              {rows[0]?.name.split(" ")[0]}
            </p>
          </div>
          <div className="rounded-xl bg-muted/60 py-1.5">
            <p className="text-[10px] text-muted-foreground">#3</p>
            <p className="truncate text-[11px] font-semibold text-foreground">
              {rows[2]?.name.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-4 font-mono text-[11px] text-muted-foreground">
                  {row.rank}
                </span>
                <span className="font-medium text-foreground">{row.name}</span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                {row.pts}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground">
        <span>#7 You</span>
        <span className="font-mono tabular-nums">2,640 pts</span>
      </div>
    </div>
  );
}

export function OnboardingPagerPreview() {
  const [step, setStep] = useState(0);
  const slides = [
    {
      badge: "Step 01",
      title: "Capture ideas at touch speed",
      desc: "Gesture-driven sheets tuned for 120Hz scrolling.",
      grad: "from-sky-500/20 to-indigo-500/20",
    },
    {
      badge: "Step 02",
      title: "Light & dark built in",
      desc: "Tokenized palettes adapt seamlessly across screens.",
      grad: "from-emerald-500/20 to-teal-500/20",
    },
    {
      badge: "Step 03",
      title: "Ready for production Expo",
      desc: "Drop complete TypeScript files into src/ and customize.",
      grad: "from-amber-500/20 to-orange-500/20",
    },
  ];
  const current = slides[step] ?? slides[0];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-3 pb-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setStep(slides.length - 1)}
          className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
        >
          Skip
        </button>
      </div>

      <div className={cn("rounded-3xl border border-border bg-gradient-to-br p-5", current.grad)}>
        <span className="font-mono text-[10px] font-semibold text-primary">
          {current.badge}
        </span>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">
          {current.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {current.desc}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-center gap-1.5">
          {slides.map((item, idx) => (
            <button
              key={item.badge}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => setStep(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                step === idx ? "w-6 bg-primary" : "w-1.5 bg-muted",
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setStep((s) => (s + 1) % slides.length)}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          <span>{step === slides.length - 1 ? "Get started" : "Continue"}</span>
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function MascotPreview() {
  const reduce = useReducedMotion();
  const [mood, setMood] = useState<"happy" | "thinking" | "surprised" | "resting">("happy");

  return (
    <div className="flex flex-1 flex-col items-center justify-between px-4 pt-6 pb-5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Companion state: {mood}
      </p>

      <motion.div
        key={mood}
        initial={reduce ? false : { scale: 0.9, rotate: -4 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={SPRING}
        className="flex size-36 items-center justify-center rounded-[2.2rem] bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg"
      >
        <svg viewBox="0 0 80 80" className="size-24 text-white" aria-hidden="true">
          {mood === "resting" ? (
            <>
              <path d="M22 36 Q28 41 34 36" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M46 36 Q52 41 58 36" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="28" cy="34" r={mood === "surprised" ? 5 : 4} fill="currentColor" />
              <circle cx="52" cy="34" r={mood === "surprised" ? 5 : 4} fill="currentColor" />
            </>
          )}
          {mood === "happy" ? (
            <path d="M30 48 Q40 58 50 48" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          ) : mood === "thinking" ? (
            <line x1="33" y1="50" x2="47" y2="50" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          ) : mood === "surprised" ? (
            <circle cx="40" cy="51" r="4.5" fill="none" stroke="currentColor" strokeWidth="3.2" />
          ) : (
            <path d="M34 50 Q40 53 46 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          )}
        </svg>
      </motion.div>

      <div className="grid w-full grid-cols-2 gap-1.5">
        {(["happy", "thinking", "surprised", "resting"] as const).map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => setMood(next)}
            className={cn(
              "rounded-xl border py-2 text-xs font-medium capitalize",
              mood === next
                ? "border-primary bg-card text-foreground"
                : "border-border bg-card/50 text-muted-foreground",
            )}
          >
            {next}
          </button>
        ))}
      </div>
    </div>
  );
}

export function HomeDashboardPreview() {
  const [selectedDay, setSelectedDay] = useState("Thu");
  const week = [
    { day: "Mon", val: 45 },
    { day: "Tue", val: 72 },
    { day: "Wed", val: 58 },
    { day: "Thu", val: 92 },
    { day: "Fri", val: 64 },
  ];

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground">Good morning</p>
          <h3 className="text-base font-semibold text-foreground">Soren Klein</h3>
        </div>
        <div className="flex size-8 items-center justify-center rounded-full border border-border bg-card">
          <Bell aria-hidden="true" className="size-3.5 text-foreground" />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: "Focus", value: "4.2h" },
          { label: "Streak", value: "14d" },
          { label: "Tasks", value: "9/11" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-border bg-card p-2.5">
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            <p className="mt-1 font-mono text-sm font-semibold text-foreground tabular-nums">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Weekly momentum</span>
          <span className="inline-flex items-center gap-1 text-[10px] text-amber-500">
            <Flame aria-hidden="true" className="size-3" />
            Best: {selectedDay}
          </span>
        </div>
        <div className="mt-3 flex h-20 items-end justify-between gap-2">
          {week.map((bar) => (
            <button
              key={bar.day}
              type="button"
              onClick={() => setSelectedDay(bar.day)}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                style={{ height: `${bar.val}%` }}
                className={cn(
                  "w-full rounded-t-md transition-colors",
                  selectedDay === bar.day ? "bg-primary" : "bg-muted",
                )}
              />
              <span className="font-mono text-[9px] text-muted-foreground">{bar.day}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-border bg-card p-3">
        <p className="text-[11px] font-semibold text-foreground">Continue workspace</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Mobile onboarding · Last edited 12m ago
        </p>
      </div>
    </div>
  );
}

export function AgendaPreview() {
  const [day, setDay] = useState(24);
  const [doneIds, setDoneIds] = useState<string[]>(["ev1"]);

  const days = [
    { num: 22, label: "S" },
    { num: 23, label: "M" },
    { num: 24, label: "T" },
    { num: 25, label: "W" },
    { num: 26, label: "T" },
  ];

  const events = [
    { id: "ev1", time: "09:30", title: "Design critique", tag: "Studio" },
    { id: "ev2", time: "13:00", title: "Mobile token sync", tag: "Core UI" },
    { id: "ev3", time: "16:30", title: "Ship release build", tag: "Engineering" },
  ];

  const toggleDone = (id: string) => {
    setDoneIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Nov {day}</h3>
        <Calendar aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>

      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {days.map((item) => (
          <button
            key={item.num}
            type="button"
            onClick={() => setDay(item.num)}
            className={cn(
              "flex flex-col items-center rounded-2xl py-2 text-xs font-medium",
              day === item.num
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground",
            )}
          >
            <span className="text-[9px] opacity-75">{item.label}</span>
            <span className="mt-0.5 font-mono text-xs tabular-nums">{item.num}</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {events.map((ev) => {
          const done = doneIds.includes(ev.id);
          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => toggleDone(ev.id)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3 py-2.5 text-left"
            >
              <div>
                <p className="font-mono text-[10px] text-primary">{ev.time}</p>
                <p
                  className={cn(
                    "text-xs font-medium",
                    done ? "text-muted-foreground line-through" : "text-foreground",
                  )}
                >
                  {ev.title}
                </p>
                <p className="text-[10px] text-muted-foreground">{ev.tag}</p>
              </div>
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border",
                  done ? "border-emerald-500 bg-emerald-500 text-white" : "border-border",
                )}
              >
                {done ? <Check aria-hidden="true" className="size-3" /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function InboxScreenPreview() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [readIds, setReadIds] = useState<string[]>(["m3"]);

  const threads = [
    { id: "m1", sender: "Maya Lin", preview: "Updated the tab bar spring physics!", time: "2m" },
    { id: "m2", sender: "Agent Swarm", preview: "3 PR checks passed without errors.", time: "18m" },
    { id: "m3", sender: "Theo Brooks", preview: "Ready for tomorrow's design sync?", time: "2h" },
  ];

  const visible = threads.filter((t) =>
    filter === "unread" ? !readIds.includes(t.id) : true,
  );

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Messages</h3>
        <Inbox aria-hidden="true" className="size-4 text-muted-foreground" />
      </div>

      <div className="mt-2.5 flex gap-1 rounded-xl bg-muted p-1">
        {(["all", "unread"] as const).map((next) => (
          <button
            key={next}
            type="button"
            onClick={() => setFilter(next)}
            className={cn(
              "flex-1 rounded-lg py-1 text-[11px] font-medium capitalize",
              filter === next ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {next}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {visible.map((item) => {
          const unread = !readIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                setReadIds((prev) =>
                  prev.includes(item.id)
                    ? prev.filter((x) => x !== item.id)
                    : [...prev, item.id],
                )
              }
              className="flex w-full items-start gap-2.5 rounded-2xl border border-border bg-card p-3 text-left"
            >
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  unread ? "bg-primary" : "bg-transparent",
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{item.sender}</span>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {item.preview}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ChatThreadPreview() {
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState(true);
  const [msgs, setMsgs] = useState([
    { id: "c1", from: "other", text: "Just tested the bottom sheet inertia on iOS." },
    { id: "c2", from: "me", text: "Feels crisp at 120Hz! Merging now." },
  ]);

  const sendMsg = () => {
    const clean = draft.trim();
    if (!clean) return;
    setMsgs((prev) => [...prev.slice(-3), { id: `m-${prev.length + 1}`, from: "me", text: clean }]);
    setDraft("");
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-3.5 pt-2 pb-4">
      <div>
        <div className="flex items-center gap-2 border-b border-border pb-2.5">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            ML
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Maya Lin</p>
            <p className="text-[10px] text-emerald-500">Online</p>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {msgs.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "max-w-[84%] rounded-2xl px-3 py-2 text-xs",
                msg.from === "me"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground",
              )}
            >
              <p>{msg.text}</p>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setLiked((l) => !l)}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-foreground"
          >
            <Heart
              aria-hidden="true"
              className={cn("size-3", liked && "fill-red-500 text-red-500")}
            />
            <span>{liked ? "2" : "1"}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMsg();
          }}
          placeholder="Message..."
          aria-label="Reply message"
          className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={sendMsg}
          aria-label="Send message"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Send aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

export function CommentsSheetPreview() {
  const [likedIds, setLikedIds] = useState<string[]>(["r1"]);
  const replies = [
    { id: "r1", author: "Theo", text: "Love how smooth the header collapses.", count: 14 },
    { id: "r2", author: "Elena", text: "Dark palette contrast looks great.", count: 8 },
  ];

  const toggle = (id: string) => {
    setLikedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-end bg-black/25">
      <div className="rounded-t-3xl border-t border-border bg-card px-4 pt-3 pb-4 shadow-xl">
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        <p className="mt-2.5 text-center text-xs font-semibold text-foreground">Comments (24)</p>

        <div className="mt-3 space-y-2.5">
          {replies.map((reply) => {
            const liked = likedIds.includes(reply.id);
            return (
              <div
                key={reply.id}
                className="flex items-start justify-between gap-2 rounded-2xl bg-background p-3"
              >
                <div>
                  <p className="text-[11px] font-semibold text-foreground">{reply.author}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{reply.text}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(reply.id)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground"
                >
                  <Heart
                    aria-hidden="true"
                    className={cn("size-3.5", liked && "fill-red-500 text-red-500")}
                  />
                  <span className="tabular-nums">{reply.count + (liked ? 1 : 0)}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function TabBarMobilePreview() {
  const [active, setActive] = useState("home");
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "explore", label: "Explore", icon: Compass },
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-6 pb-4">
      <div className="rounded-3xl border border-border bg-card p-5 text-center">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Active route
        </p>
        <p className="mt-2 text-lg font-semibold capitalize text-foreground">{active} Tab</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Spring layout pill glides across the floating bottom dock.
        </p>
      </div>

      <nav
        aria-label="Bottom tab bar"
        className="flex items-center justify-between rounded-full border border-border bg-card p-1.5 shadow-md"
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isCurrent = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-label={label}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center rounded-full py-2 transition-colors",
                isCurrent ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export function ScrollTabsMobilePreview() {
  const [tab, setTab] = useState("Overview");
  const items = ["Overview", "Motion", "Tokens", "Accessibility", "Code"];

  return (
    <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              tab === item
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-muted-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-1 flex-col justify-center rounded-3xl border border-border bg-card p-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-wider text-primary">
          Selected panel
        </p>
        <h3 className="mt-1.5 text-lg font-semibold text-foreground">{tab}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Horizontal pill bar centers selected topics while content updates smoothly.
        </p>
      </div>
    </div>
  );
}
