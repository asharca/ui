"use client";

import { Moon, RotateCcw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type PhoneTheme = "dark" | "light";

const PHONE_DARK_VARS: CSSProperties = {
  "--bg": "#0b0c0e",
  "--bg-elev": "#15171c",
  "--fg": "#f5f6f8",
  "--fg-muted": "#8e93a0",
  "--background": "#0b0c0e",
  "--foreground": "#f5f6f8",
  "--card": "#15171c",
  "--card-foreground": "#f5f6f8",
  "--popover": "#15171c",
  "--popover-foreground": "#f5f6f8",
  "--secondary": "#1d2027",
  "--secondary-foreground": "#f5f6f8",
  "--muted": "#1d2027",
  "--muted-foreground": "#8e93a0",
  "--border": "rgba(255, 255, 255, 0.09)",
  "--border-strong": "rgba(255, 255, 255, 0.16)",
  "--primary": "#2f8af5",
  "--primary-foreground": "#ffffff",
  "--input": "rgba(255, 255, 255, 0.1)",
  colorScheme: "dark",
} as CSSProperties;

const PHONE_LIGHT_VARS: CSSProperties = {
  "--bg": "#f6f7f9",
  "--bg-elev": "#ffffff",
  "--fg": "#0d0f13",
  "--fg-muted": "#666d7a",
  "--background": "#f6f7f9",
  "--foreground": "#0d0f13",
  "--card": "#ffffff",
  "--card-foreground": "#0d0f13",
  "--popover": "#ffffff",
  "--popover-foreground": "#0d0f13",
  "--secondary": "#eceef2",
  "--secondary-foreground": "#0d0f13",
  "--muted": "#eceef2",
  "--muted-foreground": "#666d7a",
  "--border": "rgba(13, 15, 19, 0.09)",
  "--border-strong": "rgba(13, 15, 19, 0.16)",
  "--primary": "#0276db",
  "--primary-foreground": "#ffffff",
  "--input": "rgba(13, 15, 19, 0.1)",
  colorScheme: "light",
} as CSSProperties;

function StatusIcons() {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      <svg aria-hidden="true" viewBox="0 0 16 10" className="h-2.5 w-3.5 fill-current">
        <rect x="0.5" y="6.5" width="2.5" height="3" rx="0.6" />
        <rect x="4.5" y="4.5" width="2.5" height="5" rx="0.6" />
        <rect x="8.5" y="2.5" width="2.5" height="7" rx="0.6" />
        <rect x="12.5" y="0.5" width="2.5" height="9" rx="0.6" opacity="0.35" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 14 10" className="h-2.5 w-3 fill-none stroke-current" strokeWidth="1.5">
        <path d="M1.5 3.5a8.5 8.5 0 0 1 11 0" strokeLinecap="round" />
        <path d="M4 6a5 5 0 0 1 6 0" strokeLinecap="round" />
        <circle cx="7" cy="8.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 22 11" className="h-2.5 w-5 fill-current">
        <rect
          x="0.75"
          y="0.75"
          width="17.5"
          height="9.5"
          rx="2.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.45"
        />
        <rect x="2.2" y="2.2" width="13.5" height="6.6" rx="1.2" />
        <rect x="19.5" y="3.5" width="1.5" height="4" rx="0.6" opacity="0.45" />
      </svg>
    </div>
  );
}

/** Realistic iOS device shell with independent phone-screen theme tokens. */
export function PhoneFrame({
  theme = "dark",
  compact = false,
  className,
  children,
}: {
  theme?: PhoneTheme;
  compact?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      style={theme === "dark" ? PHONE_DARK_VARS : PHONE_LIGHT_VARS}
      className={cn(
        "relative flex flex-col overflow-hidden bg-background text-foreground shadow-xl select-none",
        compact
          ? "h-[540px] w-[274px] rounded-[2.4rem] border-[6px] border-[#26272c] ring-1 ring-white/10"
          : "h-[620px] w-[306px] rounded-[2.75rem] border-[7px] border-[#26272c] ring-1 ring-white/10",
        className,
      )}
    >
      {/* Status bar + Dynamic Island */}
      <div className="relative z-20 flex h-10 shrink-0 items-center justify-between px-6 pt-1 text-[11px] font-semibold text-foreground">
        <span className="tabular-nums">9:41</span>
        <div
          aria-hidden="true"
          className="absolute top-2.5 left-1/2 h-[20px] w-[76px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10"
        />
        <StatusIcons />
      </div>

      {/* Screen viewport */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {children}
      </div>

      {/* Home indicator */}
      <div
        aria-hidden="true"
        className="relative z-20 flex h-5 shrink-0 items-center justify-center"
      >
        <span className="h-1 w-24 rounded-full bg-foreground/25" />
      </div>
    </div>
  );
}

/** Detail page preview stage wrapping PhoneFrame with Light/Dark + Replay controls. */
export function PhoneStage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [overrideTheme, setOverrideTheme] = useState<PhoneTheme | null>(null);
  const [replayKey, setReplayKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const siteTheme: PhoneTheme =
    mounted && resolvedTheme === "light" ? "light" : "dark";
  const activeTheme = overrideTheme ?? siteTheme;

  return (
    <section
      aria-label={`${title} mobile screen preview`}
      className="relative flex min-h-[670px] items-center justify-center overflow-hidden rounded-2xl border border-border bg-card/60 px-4 py-8"
    >
      <PhoneFrame key={`${replayKey}-${title}`} theme={activeTheme}>
        {children}
      </PhoneFrame>

      <div className="absolute right-4 bottom-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            setOverrideTheme(activeTheme === "dark" ? "light" : "dark")
          }
          aria-label={
            activeTheme === "dark"
              ? "Switch phone screen to light theme"
              : "Switch phone screen to dark theme"
          }
          title={
            activeTheme === "dark"
              ? "Light phone theme"
              : "Dark phone theme"
          }
          className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/85 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {activeTheme === "dark" ? (
            <Sun aria-hidden="true" className="size-4" />
          ) : (
            <Moon aria-hidden="true" className="size-4" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setReplayKey((prev) => prev + 1)}
          aria-label="Replay screen"
          title="Replay screen"
          className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/85 text-muted-foreground backdrop-blur transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
        </button>
      </div>
    </section>
  );
}
