"use client";

import {
  Maximize2,
  Minimize2,
  Monitor,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import {
  createContext,
  Fragment,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

type PreviewViewport = "desktop" | "mobile";

type Expand = {
  stageId: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
  replayKey: number;
  replay: () => void;
  viewport: PreviewViewport;
  setViewport: (viewport: PreviewViewport) => void;
};

const ICON_BUTTON_CLASS =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40";

const ExpandContext = createContext<Expand | null>(null);

function useExpand() {
  const ctx = useContext(ExpandContext);
  if (!ctx) throw new Error("Preview expand parts must sit inside PreviewExpand");
  return ctx;
}

function showPreviewTabForStage(stageId: string) {
  const panel = document
    .getElementById(stageId)
    ?.closest<HTMLElement>("[role=tabpanel]");
  if (panel?.hidden) {
    document
      .querySelector<HTMLElement>(`[role=tab][aria-controls="${panel.id}"]`)
      ?.click();
  }
  return panel;
}

/**
 * Lets the preview stage expand to fill the app window and switch between
 * desktop and mobile widths.
 */
export function PreviewExpand({
  stageId,
  children,
}: {
  stageId: string;
  children: ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const [viewport, setViewport] = useState<PreviewViewport>("desktop");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const replay = () => setReplayKey((key) => key + 1);
  return (
    <ExpandContext.Provider
      value={{
        stageId,
        expanded,
        setExpanded,
        toggleRef,
        replayKey,
        replay,
        viewport,
        setViewport,
      }}
    >
      {children}
    </ExpandContext.Provider>
  );
}

/** Segmented toggle for desktop vs 390px mobile preview framing. */
export function PreviewViewportToggle({ className }: { className?: string }) {
  const { stageId, viewport, setViewport } = useExpand();

  const select = (next: PreviewViewport) => {
    showPreviewTabForStage(stageId);
    setViewport(next);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full bg-card p-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => select("desktop")}
        aria-label="Desktop preview"
        title="Desktop preview"
        aria-pressed={viewport === "desktop"}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          viewport === "desktop"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Monitor aria-hidden="true" className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={() => select("mobile")}
        aria-label="Mobile preview"
        title="Mobile preview"
        aria-pressed={viewport === "mobile"}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          viewport === "mobile"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Smartphone aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  );
}

/** Button at the right of the tab row that expands the preview. */
export function PreviewExpandToggle({ className }: { className?: string }) {
  const { stageId, expanded, setExpanded, toggleRef } = useExpand();
  const open = () => {
    const panel = showPreviewTabForStage(stageId);
    if (!panel?.hidden) {
      setExpanded(true);
      return;
    }
    const start = performance.now();
    const whenSettled = () => {
      const shown = document
        .getElementById(stageId)
        ?.closest<HTMLElement>("[role=tabpanel]");
      const moving = shown && getComputedStyle(shown).transform !== "none";
      if (moving && performance.now() - start < 500) {
        window.setTimeout(whenSettled, 16);
      } else {
        setExpanded(true);
      }
    };
    window.setTimeout(whenSettled, 16);
  };
  return (
    <button
      ref={toggleRef}
      type="button"
      onClick={open}
      aria-label="Expand preview"
      aria-expanded={expanded}
      aria-controls={stageId}
      title="Expand preview"
      className={cn(ICON_BUTTON_CLASS, className)}
    >
      <Maximize2 aria-hidden="true" className="size-4" />
    </button>
  );
}

/** Button beside the expand toggle that remounts the demo. */
export function PreviewReplayToggle({ className }: { className?: string }) {
  const { stageId, replay } = useExpand();
  const onClick = () => {
    showPreviewTabForStage(stageId);
    replay();
  };
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Replay preview"
      title="Replay preview"
      className={cn(ICON_BUTTON_CLASS, className)}
    >
      <RotateCcw aria-hidden="true" className="size-4" />
    </button>
  );
}

/** The preview stage with optional mobile framing and fullscreen expansion. */
export function PreviewExpandStage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { stageId, expanded, setExpanded, toggleRef, replayKey, replay, viewport } =
    useExpand();
  const exitRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  useFocusTrap(expanded, stageRef, { onEscape: () => setExpanded(false) });

  useEffect(() => {
    if (!expanded) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    exitRef.current?.focus({ preventScroll: true });
    const toggle = toggleRef.current;
    return () => {
      root.style.overflow = previous;
      toggle?.focus({ preventScroll: true });
    };
  }, [expanded, toggleRef]);

  const dialogProps = expanded
    ? ({
        role: "dialog",
        "aria-modal": true,
        "aria-label": "Expanded component preview",
      } as const)
    : {};

  const mobileFramed = viewport === "mobile" && !expanded;

  return (
    <div
      ref={stageRef}
      {...dialogProps}
      tabIndex={expanded ? -1 : undefined}
      id={stageId}
      data-expanded={expanded || undefined}
      data-viewport={viewport}
      className={cn(
        className,
        expanded &&
          "fixed inset-0 z-[100] min-h-0 overflow-auto rounded-none border-0 bg-background p-6 py-16",
      )}
    >
      {expanded ? (
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            type="button"
            onClick={replay}
            aria-label="Replay preview"
            title="Replay preview"
            className={ICON_BUTTON_CLASS}
          >
            <RotateCcw aria-hidden="true" className="size-4" />
          </button>
          <button
            ref={exitRef}
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Exit expanded preview"
            title="Exit (Esc)"
            className={ICON_BUTTON_CLASS}
          >
            <Minimize2 aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}
      {mobileFramed ? (
        <div className="mx-auto w-full max-w-[390px] overflow-x-hidden rounded-2xl border border-border bg-card/30 p-3 shadow-sm">
          <Fragment key={replayKey}>{children}</Fragment>
        </div>
      ) : (
        <Fragment key={replayKey}>{children}</Fragment>
      )}
    </div>
  );
}
