/*
 * Adapted from beUI (1e23f4b10a404c17d9649086cf561e152527e2de).
 * Upstream path: components/motion/button/metallic.tsx
 *
 * MIT License
 *
 * Copyright (c) 2026 Saurabh Chauhan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use client";

import { motion, useReducedMotion } from "motion/react";
import { forwardRef, useState } from "react";
import { EASE_IN_OUT } from "./agent-internal-lib-ease";
import { cn } from "./utils";
import { Button, type ButtonProps } from "./agent-internal-components-motion-button-base";

export interface MetallicButtonProps extends Omit<
  ButtonProps,
  "ripple" | "variant"
> {
  /** Stops the traveling reflection while preserving the chrome rim. */
  paused?: boolean;
}

// The rim and highlight drift separately so the material stays quiet and reflective.
const SILVER_DRIFT = {
  duration: 8,
  ease: EASE_IN_OUT,
  repeat: Infinity,
};

const CHROME_SHIMMER = {
  duration: 2.4,
  ease: EASE_IN_OUT,
};

export const MetallicButton = forwardRef<
  HTMLButtonElement,
  MetallicButtonProps
>(function MetallicButton(
  {
    size = "md",
    paused = false,
    className,
    children,
    onHoverStart,
    onHoverEnd,
    ...rest
  },
  ref,
) {
  const reduce = useReducedMotion();
  const still = paused || Boolean(reduce);
  const [hovered, setHovered] = useState(false);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size={size}
      onHoverStart={(event, info) => {
        setHovered(true);
        onHoverStart?.(event, info);
      }}
      onHoverEnd={(event, info) => {
        setHovered(false);
        onHoverEnd?.(event, info);
      }}
      className={cn(
        "group relative isolate overflow-hidden border-0 bg-transparent text-foreground",
        "hover:bg-transparent hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "shadow-[0_8px_22px_rgba(0,0,0,0.16)]",
        size === "icon" && "rounded-full",
        className,
      )}
      {...rest}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[-18%] z-0 w-[136%] rounded-[inherit] bg-[linear-gradient(105deg,#111_0%,#737373_14%,#fafafa_26%,#525252_38%,#0a0a0a_50%,#a3a3a3_64%,#fff_75%,#404040_87%,#111_100%)]"
        animate={still ? undefined : { x: ["0%", "13%", "0%"] }}
        transition={still ? undefined : SILVER_DRIFT}
      />

      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-[-58%] z-[1] w-[52%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5)_48%,transparent)] opacity-50 blur-[3px] mix-blend-screen"
        animate={still ? undefined : { x: hovered ? "310%" : "0%" }}
        transition={still ? undefined : CHROME_SHIMMER}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2px] z-[2] rounded-[inherit] bg-background transition-colors group-hover:bg-muted/40"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2px] z-[3] rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(0,0,0,0.16)]"
      />

      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
      </span>
    </Button>
  );
});
