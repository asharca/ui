"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteFrame } from "@/components/app/chrome/site-frame";
import { SiteHeader } from "@/components/app/chrome/site-header";
import { KeyboardShortcuts } from "@/components/app/chrome/keyboard-shortcuts";
import { PreferencesPanel } from "@/components/app/preferences/preferences-panel";
export function WorkspaceAwareFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/workspace") return <main>{children}</main>;
  return <><KeyboardShortcuts /><SiteHeader /><main className="pt-14"><SiteFrame>{children}</SiteFrame></main><PreferencesPanel /></>;
}
