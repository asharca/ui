"use client";

import {
  Activity,
  ExternalLink,
  Maximize2,
  Minimize2,
  Monitor,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  StandaloneTemplateFallback,
  type StandaloneSlug,
} from "@/components/app/templates/standalone-template-preview";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

type StageViewport = "desktop" | "mobile";

const ICON_BTN =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

export function TemplateLiveStage({
  slug,
  title,
  demoUrl,
  fallbackSlug,
  embedded = false,
}: {
  slug: string;
  title: string;
  demoUrl: string;
  fallbackSlug?: StandaloneSlug;
  embedded?: boolean;
}) {
  const [viewport, setViewport] = useState<StageViewport>("desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"iframe" | "fallback">("iframe");

  const expandBtnRef = useRef<HTMLButtonElement>(null);
  const exitBtnRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useFocusTrap(expanded, stageRef, { onEscape: () => setExpanded(false) });

  useEffect(() => {
    if (!expanded) return;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    exitBtnRef.current?.focus({ preventScroll: true });
    const expandTrigger = expandBtnRef.current;
    return () => {
      root.style.overflow = prevOverflow;
      expandTrigger?.focus({ preventScroll: true });
    };
  }, [expanded]);

  useEffect(() => {
    if (!fallbackSlug) return;
    const controller = new AbortController();
    fetch(demoUrl, { method: "HEAD", signal: controller.signal })
      .then((res) => {
        if (!res.ok) setMode("fallback");
      })
      .catch(() => {
        if (!controller.signal.aborted) setMode("fallback");
      });
    return () => controller.abort();
  }, [demoUrl, fallbackSlug]);

  const stageContent =
    mode === "fallback" && fallbackSlug ? (
      <div
        key={`${slug}-fallback-${reloadKey}`}
        className="w-full p-3 sm:p-4"
      >
        <StandaloneTemplateFallback slug={fallbackSlug} />
      </div>
    ) : (
      <iframe
        key={`${slug}-iframe-${reloadKey}`}
        src={demoUrl}
        title={`${title} live preview`}
        className={cn(
          "w-full border-0 bg-background",
          expanded ? "h-full min-h-[75vh]" : "h-[82vh] min-h-[560px]",
        )}
      />
    );

  const mobileFramed = viewport === "mobile" && !expanded;
  const dialogProps = expanded
    ? ({
        role: "dialog",
        "aria-modal": true,
        "aria-label": `${title} expanded preview`,
      } as const)
    : {};

  return (
    <div
      ref={stageRef}
      {...dialogProps}
      tabIndex={expanded ? -1 : undefined}
      data-expanded={expanded || undefined}
      data-viewport={viewport}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card/30",
        expanded &&
          "fixed inset-0 z-[100] rounded-none border-0 bg-background p-4 sm:p-6",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/60 px-3 py-2.5 sm:px-4",
          expanded && "mb-3 rounded-xl border",
        )}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="size-3.5 text-emerald-500" aria-hidden="true" />
          <span>
            {title} · {embedded ? "Interactive live site" : "Interactive preview"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {!expanded ? (
            <div className="inline-flex items-center gap-0.5 rounded-full bg-background/80 p-1">
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                aria-label="Desktop preview"
                title="Desktop preview"
                aria-pressed={viewport === "desktop"}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  viewport === "desktop"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Monitor aria-hidden="true" className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                aria-label="Mobile preview"
                title="Mobile preview"
                aria-pressed={viewport === "mobile"}
                className={cn(
                  "inline-flex size-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  viewport === "mobile"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Smartphone aria-hidden="true" className="size-3.5" />
              </button>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            aria-label="Refresh preview"
            title="Refresh preview"
            className={ICON_BTN}
          >
            <RotateCcw aria-hidden="true" className="size-3.5" />
          </button>

          <a
            href={demoUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Open live preview"
            title="Open live preview in new tab"
            className={ICON_BTN}
          >
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>

          {expanded ? (
            <button
              ref={exitBtnRef}
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Exit expanded preview"
              title="Exit (Esc)"
              className={ICON_BTN}
            >
              <Minimize2 aria-hidden="true" className="size-3.5" />
            </button>
          ) : (
            <button
              ref={expandBtnRef}
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="Expand preview"
              aria-expanded={expanded}
              title="Expand preview"
              className={ICON_BTN}
            >
              <Maximize2 aria-hidden="true" className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div
        className={cn(
          "flex flex-1 justify-center bg-background/60",
          mobileFramed && "py-6 px-3",
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-200",
            mobileFramed &&
              "mx-auto w-[390px] max-w-full overflow-hidden rounded-[28px] border border-border bg-background shadow-xl",
            expanded && "h-full min-h-0 flex-1 overflow-hidden rounded-xl border border-border",
          )}
        >
          {stageContent}
        </div>
      </div>
    </div>
  );
}
