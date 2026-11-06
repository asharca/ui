"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent } from "react";

/** Stops marketing playback offscreen, in background tabs, and while focus is inside. */
export function useMarketingPlayback<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [observedNode, setObservedNode] = useState<T | null>(null);
  const playbackRef = useCallback((node: T | null) => { ref.current = node; setObservedNode(node); }, []);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    const node = observedNode ?? ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    const update = () => setPageVisible(document.visibilityState !== "hidden");
    update();
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [observedNode]);
  return {
    ref, playbackRef, playing: visible && pageVisible && !hovered && !focused,
    interactionProps: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true),
      onBlurCapture: (event: FocusEvent<T>) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      },
    },
  };
}
