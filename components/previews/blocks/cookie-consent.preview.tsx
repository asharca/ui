"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import {
  CookieConsent,
  type CookieConsentCategory,
} from "@/components/motion/cookie-consent";

const CATEGORIES: CookieConsentCategory[] = [
  {
    id: "essential",
    label: "Essential",
    description: "Required for session security and theme memory.",
    required: true,
    defaultEnabled: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Helps us understand which pages are most useful.",
    defaultEnabled: false,
  },
  {
    id: "preferences",
    label: "Preferences",
    description: "Remembers editor layout and sidebar state.",
    defaultEnabled: true,
  },
];

export function CookieConsentPreview() {
  const [open, setOpen] = useState(true);
  const [savedSummary, setSavedSummary] = useState<string | null>(null);

  return (
    <div className="relative h-80 w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-background p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-muted" />
          <span className="h-2.5 w-16 rounded-full bg-muted" />
          <span className="h-2.5 w-12 rounded-full bg-muted/60" />
        </div>
        <button
          type="button"
          onClick={() => {
            setSavedSummary(null);
            setOpen(true);
          }}
          className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw aria-hidden="true" className="size-3" />
          Reset
        </button>
      </div>

      <div aria-hidden="true" className="mt-6 space-y-3">
        <div className="h-4 w-52 rounded-full bg-muted/70" />
        <div className="h-3 w-72 rounded-full bg-muted/50" />
        <div className="h-2.5 w-full rounded-full bg-muted/35" />
        <div className="h-2.5 w-5/6 rounded-full bg-muted/35" />
      </div>

      {savedSummary ? (
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          {savedSummary}
        </p>
      ) : null}

      <CookieConsent
        contained
        categories={CATEGORIES}
        open={open}
        onOpenChange={setOpen}
        onSave={(choices) => {
          const enabled = Object.entries(choices)
            .filter(([, on]) => on)
            .map(([k]) => k)
            .join(", ");
          setSavedSummary(`Saved consent: ${enabled}`);
        }}
      />
    </div>
  );
}
