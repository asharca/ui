"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import {
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { focusablesIn, useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface MorphingModalProps {
  /** Which view is currently shown. `null` closes the modal. */
  viewId: string | null;
  onClose: () => void;
  children: ReactNode;
  /** "bottom" anchors to the viewport bottom (mobile-like). "center" centers vertically. */
  placement?: "bottom" | "center";
  /**
   * Accessible name for the dialog. Without it, the dialog is named by the
   * first heading in the current view.
   */
  ariaLabel?: string;
  className?: string;
}

export function MorphingModal({
  viewId,
  onClose,
  children,
  placement = "bottom",
  ariaLabel,
  className,
}: MorphingModalProps) {
  const open = viewId !== null;
  const [portalReady, setPortalReady] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const [headingId, setHeadingId] = useState<string>();

  // Focus moves into the panel on open, Tab stays inside it, Escape closes,
  // and focus returns to the opener on close.
  useFocusTrap(open && portalReady, panelRef, { onEscape: onClose });

  // The current view, not the one still fading out under it.
  const currentView = () =>
    Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>("[data-view]") ?? [],
    ).find((element) => element.dataset.view === viewId);

  // Name the dialog by the current view's first heading unless a label is set.
  useLayoutEffect(() => {
    if (!viewId || ariaLabel) return;
    const heading = currentView()?.querySelector<HTMLElement>(
      "h1, h2, h3, h4, h5, h6",
    );
    if (heading && !heading.id) heading.id = `${uid}-${viewId}-title`;
    setHeadingId(heading?.id);
  });

  // The focused control leaves with the old view, so a view change hands focus
  // to the first control of the new one.
  const shownView = useRef(viewId);
  useEffect(() => {
    const previous = shownView.current;
    shownView.current = viewId;
    if (!viewId || !previous || previous === viewId) return;
    const panel = panelRef.current;
    const active = document.activeElement;
    if (!panel || (active && active !== document.body && !panel.contains(active)))
      return;
    const view = currentView();
    (focusablesIn(view ?? null)[0] ?? panel).focus({ preventScroll: true });
  });
  const enterY = reduce ? 0 : placement === "bottom" ? 40 : 20;
  const enterScale = reduce ? 1 : 0.97;
  const [backgroundScrollLocked, setBackgroundScrollLocked] = useState(open);

  useEffect(() => setPortalReady(true), []);
  if (open && !backgroundScrollLocked) setBackgroundScrollLocked(true);

  useLayoutEffect(() => {
    if (!backgroundScrollLocked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [backgroundScrollLocked]);

  if (!portalReady) return null;

  // Keep viewport coordinates independent of transformed/clipped consumers.
  // Fixed siblings retain the inset, non-interactive panel positioning layer.
  // CSS variables keep the final paint values in Motion's render loop. Motion
  // 11 cancels WAAPI before its final inline-style write, flashing the old value
  // for a frame in Chrome (including while an exiting sibling is still mounted).
  return createPortal(
    <AnimatePresence
      initial={false}
      onExitComplete={() => {
        if (!open) setBackgroundScrollLocked(false);
      }}
    >
      {open ? (
        <PresenceGate key="backdrop">
          {({ gate }) => (
            <motion.button
              type="button"
              aria-label="Close modal"
              // Outside the panel, so the focus trap never lands on it; it is
              // a pointer target, and Escape closes from the keyboard.
              tabIndex={-1}
              initial={{ "--modal-opacity": 0 }}
              animate={{ "--modal-opacity": 1 }}
              exit={{ "--modal-opacity": 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              {...gate}
              onClick={onClose}
              className="pointer-events-auto fixed inset-0 z-[80] bg-background/5 [backdrop-filter:blur(14px)_saturate(140%)] [-webkit-backdrop-filter:blur(14px)_saturate(140%)] [opacity:var(--modal-opacity)]"
            />
          )}
        </PresenceGate>
      ) : null}

      {open ? (
        <PresenceGate key="panel-layer">
          {({ isPresent, gate }) => (
            // The layer itself never takes pointer events, so it carries
            // `inert` alone rather than the gate's pointer-events value.
            <motion.div
              layoutRoot
              layoutScroll
              data-framer-portal-id="morphing-modal"
              inert={!isPresent}
              className={cn(
                "pointer-events-none fixed inset-4 z-[80] flex justify-center",
                placement === "bottom" ? "items-end pb-4" : "items-center",
              )}
            >
              <motion.div
                key="panel"
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                aria-labelledby={ariaLabel ? undefined : headingId}
                tabIndex={-1}
                layout
                initial={{ "--modal-opacity": 0, y: enterY, scale: enterScale }}
                animate={{ "--modal-opacity": 1, y: 0, scale: 1 }}
                exit={{
                  "--modal-opacity": 0,
                  y: enterY,
                  scale: reduce ? 1 : 0.98,
                  transition: { duration: 0.18, ease: EASE_OUT },
                }}
                transition={SPRING_PANEL}
                {...gate}
                className={cn(
                  "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background shadow-2xl outline-none will-change-transform [opacity:var(--modal-opacity)]",
                  className,
                )}
              >
                {/* popLayout offsets must keep the same containing block while
                    layout projection applies and removes transforms. */}
                <motion.div layout="position" className="relative p-5">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {/* The motion element is the direct child so popLayout can
                        take its ref and lift the outgoing view out of flow;
                        otherwise both views stack for the exit and the panel
                        briefly grows to their combined height. */}
                    <motion.div
                      key={viewId}
                      className={cn(
                        "[opacity:var(--modal-opacity)]",
                        !reduce && "[filter:var(--modal-filter)]",
                      )}
                      data-view={viewId}
                      initial={
                        reduce
                          ? { "--modal-opacity": 0 }
                          : { "--modal-opacity": 0, y: 8, "--modal-filter": "blur(4px)" }
                      }
                      animate={
                        reduce
                          ? {
                              "--modal-opacity": 1,
                              transition: {
                                duration: 0.18,
                                ease: EASE_OUT,
                              },
                            }
                          : {
                              "--modal-opacity": 1,
                              y: 0,
                              "--modal-filter": "blur(0px)",
                              transition: {
                                duration: 0.24,
                                ease: EASE_OUT,
                              },
                            }
                      }
                      exit={
                        reduce
                          ? {
                              "--modal-opacity": 0,
                              transition: {
                                duration: 0.14,
                                ease: EASE_OUT,
                              },
                            }
                          : {
                              "--modal-opacity": 0,
                              y: -8,
                              "--modal-filter": "blur(4px)",
                              transition: {
                                duration: 0.16,
                                ease: EASE_OUT,
                              },
                            }
                      }
                    >
                      <PresenceGate>
                        {({ isPresent: viewPresent }) => (
                          // The outgoing view stays for its exit; inert keeps
                          // the trap and assistive technology on the incoming one.
                          <div inert={!viewPresent}>{children}</div>
                        )}
                      </PresenceGate>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </PresenceGate>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
