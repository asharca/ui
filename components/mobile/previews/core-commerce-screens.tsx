"use client";

import {
  Bookmark,
  Check,
  ChevronRight,
  CreditCard,
  Heart,
  MapPin,
  MoreHorizontal,
  PackageCheck,
  Search,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Truck,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SPRING = { type: "spring" as const, damping: 24, stiffness: 320 };

export function FeedCardPreview() {
  const [liked, setLiked] = useState(true);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-center px-4 py-4">
      <article className="rounded-3xl border border-border bg-card p-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
              ES
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">Elena Sato</p>
              <p className="text-[10px] text-muted-foreground">Kyoto Studio · 14m</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFollowing((f) => !f)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors",
              following ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
            )}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>

        <div className="mt-3 flex h-44 flex-col justify-end rounded-2xl bg-gradient-to-br from-emerald-500/30 via-sky-500/25 to-indigo-600/30 p-3.5">
          <p className="text-xs font-semibold text-foreground">
            Tactile glass & spatial surface tokens
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setLiked((l) => !l)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground"
          >
            <Heart
              aria-hidden="true"
              className={cn("size-4", liked && "fill-red-500 text-red-500")}
            />
            <span className="font-mono tabular-nums">{liked ? 128 : 127}</span>
          </button>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-label="Save post"
            className="text-foreground"
          >
            <Bookmark
              aria-hidden="true"
              className={cn("size-4", saved && "fill-foreground")}
            />
          </button>
        </div>
      </article>
    </div>
  );
}

export function StoriesViewerPreview() {
  const [index, setIndex] = useState(0);
  const stories = [
    { user: "Maya Lin", caption: "Testing gesture springs at 120Hz", bg: "from-sky-600 to-indigo-800" },
    { user: "Theo Brooks", caption: "Weekend ceramics workshop", bg: "from-amber-600 to-rose-700" },
    { user: "Kora Team", caption: "Version 2.4 design system live", bg: "from-emerald-600 to-teal-800" },
  ];
  const current = stories[index] ?? stories[0];

  return (
    <div className={cn("flex flex-1 flex-col justify-between bg-gradient-to-br p-4 text-white", current.bg)}>
      <div>
        <div className="flex gap-1">
          {stories.map((s, i) => (
            <button
              key={s.user}
              type="button"
              aria-label={`Story ${i + 1}`}
              onClick={() => setIndex(i)}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
            >
              <span
                className={cn(
                  "block h-full bg-white transition-all",
                  i <= index ? "w-full" : "w-0",
                )}
              />
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold">{current.user}</p>
      </div>

      <div>
        <p className="text-sm font-medium leading-snug">{current.caption}</p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + stories.length) % stories.length)}
            className="flex-1 rounded-full bg-black/30 py-2 text-xs font-medium backdrop-blur-sm"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % stories.length)}
            className="flex-1 rounded-full bg-white py-2 text-xs font-semibold text-black"
          >
            Next story
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActivityScreenPreview() {
  const [followed, setFollowed] = useState<string[]>(["Aria"]);
  const events = [
    { name: "Aria", action: "mentioned you in Navigation Kit", time: "5m" },
    { name: "Kai", action: "starred your mobile template", time: "1h" },
    { name: "Lukas", action: "shared a new wallet screen", time: "3h" },
  ];

  const toggle = (name: string) => {
    setFollowed((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );
  };

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <h3 className="text-base font-semibold text-foreground">Activity</h3>
      <div className="mt-3 space-y-2">
        {events.map((ev) => {
          const isFollowing = followed.includes(ev.name);
          return (
            <div
              key={ev.name}
              className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="text-xs text-foreground">
                  <span className="font-semibold">{ev.name}</span> {ev.action}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{ev.time}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(ev.name)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                  isFollowing ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SearchScreenPreview() {
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["Bottom sheet", "Paywall", "Token swap"]);
  const catalog = [
    "Bottom sheet navigation",
    "Accounts & currency cards",
    "Biometric unlock keypad",
    "Voice orb conversation",
  ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
        <Search aria-hidden="true" className="size-3.5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search screens..."
          aria-label="Search screens"
          className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {recent.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {recent.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] text-foreground"
            >
              <button type="button" onClick={() => setQuery(tag.split(" ")[0])}>
                {tag}
              </button>
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => setRecent((r) => r.filter((x) => x !== tag))}
                className="text-muted-foreground"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 space-y-1.5">
        {catalog.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-3 py-2.5 text-xs font-medium text-foreground"
          >
            <span>{item}</span>
            <ChevronRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FilterSheetPreview() {
  const [sort, setSort] = useState("Popular");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Reanimated", "Expo"]);

  const tags = ["Reanimated", "Expo", "Gestures", "SVG", "Charts"];
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-end bg-black/25">
      <div className="rounded-t-3xl border-t border-border bg-card px-4 pt-3 pb-4 shadow-xl">
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <SlidersHorizontal aria-hidden="true" className="size-3.5" />
            Filters
          </span>
          <button
            type="button"
            onClick={() => {
              setSort("Popular");
              setSelectedTags([]);
            }}
            className="text-[11px] text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
        </div>

        <p className="mt-3 text-[11px] font-medium text-muted-foreground">Sort by</p>
        <div className="mt-1.5 flex gap-1.5">
          {["Popular", "Newest", "Compact"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={cn(
                "flex-1 rounded-xl py-1.5 text-[11px] font-medium",
                sort === s ? "bg-foreground text-background" : "bg-background text-muted-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11px] font-medium text-muted-foreground">Stack</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium",
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background text-muted-foreground",
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="mt-4 w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          Show {14 + selectedTags.length * 6} screens
        </button>
      </div>
    </div>
  );
}

export function ProductDetailPreview() {
  const [finish, setFinish] = useState("Sandstone");
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  const finishes = [
    { name: "Graphite", hex: "#26282e" },
    { name: "Sandstone", hex: "#d6cab8" },
    { name: "Cobalt", hex: "#2f6df5" },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="relative flex h-44 items-center justify-center rounded-3xl border border-border bg-card">
          <div
            style={{
              backgroundColor:
                finishes.find((f) => f.name === finish)?.hex ?? "#d6cab8",
            }}
            className="size-24 rounded-2xl shadow-lg transition-colors"
          />
          <button
            type="button"
            onClick={() => setLiked((l) => !l)}
            aria-label="Favorite product"
            className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground"
          >
            <Heart
              aria-hidden="true"
              className={cn("size-4", liked && "fill-red-500 text-red-500")}
            />
          </button>
        </div>

        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Studio Desk Lamp</h3>
            <p className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Star aria-hidden="true" className="size-3 fill-amber-400 text-amber-400" />
              4.9 (142 reviews)
            </p>
          </div>
          <span className="font-mono text-sm font-semibold text-foreground">$189</span>
        </div>

        <p className="mt-3 text-[11px] font-medium text-muted-foreground">Finish: {finish}</p>
        <div className="mt-1.5 flex gap-2">
          {finishes.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setFinish(item.name);
                setAdded(false);
              }}
              aria-label={item.name}
              style={{ backgroundColor: item.hex }}
              className={cn(
                "size-6 rounded-full border border-white/20",
                finish === item.name && "ring-2 ring-primary ring-offset-2 ring-offset-background",
              )}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setAdded(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        {added ? <Check aria-hidden="true" className="size-3.5" /> : <ShoppingBag aria-hidden="true" className="size-3.5" />}
        <span>{added ? `Added ${finish} to bag` : "Add to bag · $189"}</span>
      </button>
    </div>
  );
}

export function BagPreview() {
  const [qty, setQty] = useState(1);
  const [promoApplied, setPromoApplied] = useState(false);

  const subtotal = 189 * qty;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discount;

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">Your bag</h3>
          <span className="font-mono text-xs text-muted-foreground">{qty} item</span>
        </div>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-card p-3">
          <div>
            <p className="text-xs font-semibold text-foreground">Studio Desk Lamp</p>
            <p className="text-[10px] text-muted-foreground">Sandstone · Free shipping</p>
            <p className="mt-1 font-mono text-xs font-semibold text-foreground">$189</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-background px-2 py-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-1 text-xs font-semibold text-foreground"
            >
              -
            </button>
            <span className="font-mono text-xs tabular-nums">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="px-1 text-xs font-semibold text-foreground"
            >
              +
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPromoApplied((p) => !p)}
          className="mt-2.5 flex w-full items-center justify-between rounded-2xl border border-dashed border-border bg-card/60 px-3 py-2 text-xs"
        >
          <span className="font-mono text-[11px] text-foreground">
            {promoApplied ? "BEUI10 (-10% applied)" : "Apply promo code BEUI10"}
          </span>
          <span className="text-[11px] font-medium text-primary">
            {promoApplied ? "Remove" : "Apply"}
          </span>
        </button>
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Total</span>
          <span className="font-mono font-semibold text-foreground tabular-nums">${total}</span>
        </div>
        <button
          type="button"
          className="w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          Continue to checkout
        </button>
      </div>
    </div>
  );
}

export function CheckoutSheetPreview() {
  const [method, setMethod] = useState<"apple" | "card">("apple");
  const [paid, setPaid] = useState(false);

  return (
    <div className="flex flex-1 flex-col justify-end bg-black/25">
      <div className="rounded-t-3xl border-t border-border bg-card px-4 pt-3 pb-4 shadow-xl">
        <div className="mx-auto h-1 w-10 rounded-full bg-border" />
        <h3 className="mt-3 text-sm font-semibold text-foreground">Express checkout</h3>

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between rounded-2xl bg-background px-3 py-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <MapPin aria-hidden="true" className="size-3.5" />
              Ship to
            </span>
            <span className="font-medium text-foreground">742 Valencia St, SF</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setMethod((m) => (m === "apple" ? "card" : "apple"));
              setPaid(false);
            }}
            className="flex w-full items-center justify-between rounded-2xl bg-background px-3 py-2.5 text-xs"
          >
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <CreditCard aria-hidden="true" className="size-3.5" />
              Pay with
            </span>
            <span className="font-medium text-foreground">
              {method === "apple" ? "Apple Pay" : "Visa •••• 4242"}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setPaid(true)}
          className="mt-4 w-full rounded-2xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
        >
          {paid ? "Order confirmed · #8921" : "Pay $189.00"}
        </button>
      </div>
    </div>
  );
}

export function OrderTrackingMobilePreview() {
  const [step, setStep] = useState(2);
  const stages = [
    { label: "Order placed", time: "10:12" },
    { label: "Packed at studio", time: "11:40" },
    { label: "Out for courier delivery", time: "14:05" },
    { label: "Delivered", time: "ETA 14:20" },
  ];

  return (
    <div className="flex flex-1 flex-col justify-between px-4 pt-2 pb-4">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] text-primary">ORDER #8921</p>
            <h3 className="text-base font-semibold text-foreground">Arriving in 15 min</h3>
          </div>
          <Truck aria-hidden="true" className="size-5 text-primary" />
        </div>

        <div className="mt-3 rounded-2xl border border-border bg-card p-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Progress</span>
            <span className="font-mono">{step + 1}/4 milestones</span>
          </div>
          <div className="mt-2 flex gap-1">
            {stages.map((s, idx) => (
              <span
                key={s.label}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors",
                  idx <= step ? "bg-emerald-500" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {stages.map((stage, idx) => {
            const done = idx <= step;
            return (
              <button
                key={stage.label}
                type="button"
                onClick={() => setStep(idx)}
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-3 py-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <PackageCheck
                    aria-hidden="true"
                    className={cn("size-3.5", done ? "text-emerald-500" : "text-muted-foreground")}
                  />
                  <span className={cn("text-xs", done ? "font-medium text-foreground" : "text-muted-foreground")}>
                    {stage.label}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{stage.time}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function CollapsingHeaderPreview() {
  const reduce = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/90 py-2 backdrop-blur">
        <motion.span
          animate={reduce ? undefined : { scale: collapsed ? 0.85 : 1.05 }}
          transition={SPRING}
          className="origin-left text-base font-semibold text-foreground"
        >
          {collapsed ? "Inbox (Collapsed)" : "Workspace Library"}
        </motion.span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-foreground"
        >
          {collapsed ? "Expand header" : "Collapse"}
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {["Design Tokens", "Motion Primitives", "Agent Flows", "Storefront UI"].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-3.5 py-3 text-xs font-medium text-foreground"
          >
            <span>{item}</span>
            <ChevronRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ActionMenuPreview() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(true);
  const [pinned, setPinned] = useState(true);

  return (
    <div className="relative flex flex-1 flex-col px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Project Note</h3>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle action menu"
          className="flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground"
        >
          <MoreHorizontal aria-hidden="true" className="size-4" />
        </button>
      </div>

      {open ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.94, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={SPRING}
          className="ml-auto mt-2 w-48 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        >
          <button
            type="button"
            onClick={() => setPinned((p) => !p)}
            className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <span>Pin to top</span>
            {pinned ? <Check aria-hidden="true" className="size-3.5 text-primary" /> : null}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <span>Share link</span>
            <Share2 aria-hidden="true" className="size-3.5 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-between px-3.5 py-2.5 text-xs font-medium text-red-500 hover:bg-muted"
          >
            <span>Archive note</span>
          </button>
        </motion.div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-border bg-card p-3.5 text-xs text-muted-foreground">
        Origin-anchored popover springs smoothly out of the top-right action trigger.
      </div>
    </div>
  );
}
