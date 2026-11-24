"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/app/chrome/site-sidebar";
import { ThemeToggle } from "@/components/app/chrome/theme-toggle";
import { PlatformSwitch } from "@/components/app/docs/native/platform-switch";
import { BottomSheet } from "@/components/motion/bottom-sheet";
import { Button } from "@/components/motion/button";
import {
  hasPlatformSwitch,
  isNativePath,
} from "@/lib/component-paths";
import { cn } from "@/lib/utils";

const MOBILE_TOP_LINKS = [
  { href: "/components", label: "Components" },
  { href: "/explore", label: "Explore" },
  { href: "/illustrations", label: "Illustrations" },
  { href: "/templates", label: "Templates" },
  { href: "/studio", label: "Studio" },
  { href: "/mobile", label: "Mobile" },
  { href: "/workspace", label: "Workspace" },
  { href: "/playground", label: "Playground" },
];

/** Mobile nav: a header hamburger that opens the sidebar list in beUI's own bottom sheet. */
export function MobileNav({ overHero = false }: { overHero?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger — close the sheet on any route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/components") {
      return (
        pathname.startsWith("/components") &&
        !pathname.startsWith("/components/templates") &&
        !pathname.startsWith("/components/mobile")
      );
    }
    if (href === "/mobile") {
      return (
        pathname === "/mobile" ||
        pathname.startsWith("/components/mobile") ||
        isNativePath(pathname)
      );
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="xl:hidden">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full",
          overHero && "text-white hover:bg-white/10 hover:text-white",
        )}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Menu"
        snapPoints={[0.85]}
      >
        <div className="flex flex-col gap-5 pt-2">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Theme
            </span>
            <ThemeToggle />
          </div>
          {hasPlatformSwitch(pathname) ? <PlatformSwitch layout="block" /> : null}
          <nav className="flex flex-wrap gap-1">
            {MOBILE_TOP_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </BottomSheet>
    </div>
  );
}
