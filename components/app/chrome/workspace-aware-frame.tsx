"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFrame } from "@/components/app/chrome/site-frame";
import { SiteHeader } from "@/components/app/chrome/site-header";
import { KeyboardShortcuts } from "@/components/app/chrome/keyboard-shortcuts";
export function WorkspaceAwareFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/workspace") return <main>{children}</main>;
  return <><KeyboardShortcuts /><SiteHeader /><main><SiteFrame>{children}</SiteFrame></main></>;
}
