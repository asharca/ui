"use client";

import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const HOVER_LIFT = 1.04;
const MIN_SCALE = 0.22;
const DEFAULT_STAGE_WIDTH = 460;

/**
 * Shrinks a preview to fit the card frame instead of clipping or collapsing.
 * Renders the preview at a fixed desktop-like stage width and scales it down
 * cleanly to fit the preview well.
 */
export function PreviewFit({
  children,
  hover,
  overlay,
  maxScale = 0.82,
  stageWidth = DEFAULT_STAGE_WIDTH,
  align = "center",
  marginClassName = "m-2 mb-0",
  className,
}: {
  children: ReactNode;
  hover: boolean;
  overlay?: ReactNode;
  maxScale?: number;
  stageWidth?: number;
  align?: "center" | "top";
  marginClassName?: string;
  className?: string;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale] = useState(MIN_SCALE);
  const [pinTop, setPinTop] = useState(false);
  const [measured, setMeasured] = useState(false);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    const measure = () => {
      const outerW = outer.clientWidth;
      const outerH = outer.clientHeight;
      const childSizes = Array.from(stage.children, (child) => {
        const element = child as HTMLElement;
        return {
          width: Math.max(element.offsetWidth, element.scrollWidth),
          height: Math.max(element.offsetHeight, element.scrollHeight),
        };
      });
      const contentW = Math.max(
        stage.offsetWidth,
        stage.scrollWidth,
        ...childSizes.map(({ width }) => width),
      );
      const contentH = Math.max(
        stage.offsetHeight,
        stage.scrollHeight,
        ...childSizes.map(({ height }) => height),
      );
      if (!outerW || !outerH || !contentW || !contentH) return;

      if (align === "top") {
        const widthFit = Math.max(MIN_SCALE, (outerW * 0.98) / contentW);
        setFitScale(widthFit);
        const visualH = contentH * Math.min(maxScale, widthFit);
        setPinTop(visualH > outerH * 0.85);
      } else {
        const fit = Math.min(
          (outerW * 0.94) / contentW,
          (outerH * 0.94) / contentH,
        );
        setFitScale(Math.max(MIN_SCALE, fit));
        setPinTop(false);
      }
      setMeasured(true);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(stage);
    Array.from(stage.children).forEach((child) => {
      ro.observe(child);
    });
    return () => ro.disconnect();
  }, [align, maxScale]);

  const scale = Math.min(maxScale, fitScale) * (hover ? HOVER_LIFT : 1);

  return (
    <div
      ref={outerRef}
      className={cn(
        "relative flex min-h-0 flex-1 justify-center overflow-hidden rounded-2xl bg-background contain-[paint]",
        pinTop ? "items-start p-0" : "items-center p-3",
        marginClassName,
        className,
      )}
    >
      <div
        ref={stageRef}
        style={{ width: stageWidth, transform: `scale(${scale})` }}
        className={cn(
          "pointer-events-none flex shrink-0 items-center justify-center [&_*]:!cursor-default",
          pinTop ? "origin-top" : "origin-center",
          measured
            ? "transition-transform duration-300 ease-out"
            : "invisible",
        )}
      >
        {children}
      </div>
      {overlay}
    </div>
  );
}
