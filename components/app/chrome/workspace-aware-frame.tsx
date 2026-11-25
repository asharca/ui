"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { KeyboardShortcuts } from "@/components/app/chrome/keyboard-shortcuts";
import { SiteFrame } from "@/components/app/chrome/site-frame";
import { SiteHeader } from "@/components/app/chrome/site-header";
import { cn } from "@/lib/utils";

export function WorkspaceAwareFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (
    pathname === "/workspace" ||
    pathname.startsWith("/workspace/") ||
    pathname === "/studio" ||
    pathname.startsWith("/studio/") ||
    pathname === "/demos" ||
    pathname.startsWith("/demos/")
  ) {
    return <main>{children}</main>;
  }

  const overlayHero = pathname === "/" || pathname === "/mobile";

  return (
    <>
      <KeyboardShortcuts />
      <SiteHeader overlayHero={overlayHero} />
      <main className={cn(!overlayHero && "pt-14")}>
        <SiteFrame>{children}</SiteFrame>
      </main>
    </>
  );
}
