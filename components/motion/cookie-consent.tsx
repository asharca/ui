"use client";

import { Cookie, ShieldCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Switch } from "@/components/motion/switch";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface CookieConsentCategory {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  defaultEnabled?: boolean;
}

export interface CookieConsentProps {
  categories: CookieConsentCategory[];
  privacyHref?: string;
  /** Renders inside a parent preview container instead of fixed to the viewport. */
  contained?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (choices: Record<string, boolean>) => void;
  className?: string;
}

function CookieJarIcon({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      animate={reduce ? undefined : { y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
      className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-muted/60 text-amber-400"
    >
      <Cookie className="size-5" />
    </motion.div>
  );
}

/** Floating cookie consent banner with expandable category preferences and corner settings trigger. */
export function CookieConsent({
  categories,
  privacyHref = "#privacy",
  contained = false,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  onSave,
  className,
}: CookieConsentProps) {
  const reduce = useReducedMotion() ?? false;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [customizing, setCustomizing] = useState(false);
  const [choices, setChoices] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      categories.map((cat) => [
        cat.id,
        cat.required ? true : (cat.defaultEnabled ?? false),
      ]),
    ),
  );

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = (next: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(next);
    if (!next) setCustomizing(false);
    onOpenChange?.(next);
  };

  const applyAll = (acceptOptional: boolean) => {
    const next = Object.fromEntries(
      categories.map((cat) => [cat.id, cat.required ? true : acceptOptional]),
    );
    setChoices(next);
    onSave?.(next);
    setOpen(false);
  };

  const saveCustom = () => {
    onSave?.(choices);
    setOpen(false);
  };

  const positionClass = contained
    ? "absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20"
    : "fixed bottom-5 left-5 right-5 sm:right-auto sm:max-w-md z-50";

  const triggerPosClass = contained
    ? "absolute bottom-4 left-4 z-20"
    : "fixed bottom-5 left-5 z-50";

  return (
    <div className={cn(className)}>
      <AnimatePresence mode="wait">
        {open ? (
          <motion.section
            key="cookie-banner"
            aria-label="Cookie preferences"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 16, filter: "blur(6px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 14, filter: "blur(4px)", transition: { duration: 0.2 } }
            }
            transition={reduce ? { duration: 0 } : SPRING_PANEL}
            className={cn(
              positionClass,
              "rounded-3xl border border-border bg-card/95 p-4 text-foreground shadow-2xl backdrop-blur-xl",
            )}
          >
            {!customizing ? (
              <div>
                <div className="flex items-start gap-3">
                  <CookieJarIcon reduce={reduce} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      We use cookies
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Some keep the site running. Others help us measure and improve
                      it, only with your OK.{" "}
                      <a
                        href={privacyHref}
                        onClick={(event) => {
                          if (privacyHref.startsWith("#")) event.preventDefault();
                        }}
                        className="font-medium text-foreground underline underline-offset-2"
                      >
                        Privacy policy
                      </a>
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => applyAll(false)}
                    className="inline-flex h-8 items-center rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Reject all
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomizing(true)}
                    className="inline-flex h-8 items-center rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Customize
                  </button>
                  <button
                    type="button"
                    onClick={() => applyAll(true)}
                    className="inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Accept all
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck aria-hidden="true" className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold">Cookie settings</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomizing(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Back
                  </button>
                </div>

                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li
                      key={cat.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground">
                          {cat.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {cat.description}
                        </p>
                      </div>
                      <Switch
                        checked={cat.required ? true : Boolean(choices[cat.id])}
                        disabled={cat.required}
                        onCheckedChange={(checked) =>
                          setChoices((prev) => ({ ...prev, [cat.id]: checked }))
                        }
                        ariaLabel={`Toggle ${cat.label} cookies`}
                      />
                    </li>
                  ))}
                </ul>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => applyAll(false)}
                    className="inline-flex h-8 items-center rounded-full border border-border bg-background px-3 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    Reject optional
                  </button>
                  <button
                    type="button"
                    onClick={saveCustom}
                    className="inline-flex h-8 items-center rounded-full bg-primary px-3.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Save choices
                  </button>
                </div>
              </motion.div>
            )}
          </motion.section>
        ) : (
          <motion.button
            key="cookie-reopen"
            type="button"
            aria-label="Open cookie preferences"
            title="Cookie preferences"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
            transition={reduce ? { duration: 0 } : SPRING_PANEL}
            onClick={() => setOpen(true)}
            className={cn(
              triggerPosClass,
              "grid size-10 place-items-center rounded-full border border-border bg-card text-amber-400 shadow-lg transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Cookie aria-hidden="true" className="size-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
