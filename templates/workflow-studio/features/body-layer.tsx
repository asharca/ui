"use client";
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
/** App dialogs live outside clipped canvas/layout ancestors and mount only after hydration. */
export function BodyLayer({ children }: { children: ReactNode }) {
 const [mounted, setMounted] = useState(false);
 useEffect(() => { setMounted(true); }, []);
 return mounted ? createPortal(children, document.body) : null;
}
