import type { ReactNode } from "react";
import { DocsFooter } from "@/components/app/chrome/docs-footer";
import { cn } from "@/lib/utils";

/** The optional resource rail takes space only when content is supplied. */
export function ThreeColumnLayout({
  leftSidebar,
  children,
  rightSidebar,
  className,
}: {
  leftSidebar: ReactNode;
  children: ReactNode;
  rightSidebar?: ReactNode;
  className?: string;
}) {
  const hasRightSidebar = rightSidebar != null && typeof rightSidebar !== "boolean";
  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-[minmax(0,1fr)] px-4 [--left-sidebar-width:15rem] md:grid-cols-[var(--left-sidebar-width)_minmax(0,1fr)] md:gap-4 md:px-6 xl:gap-8 xl:px-8",
        hasRightSidebar && "[--right-sidebar-width:20rem] xl:grid-cols-[var(--left-sidebar-width)_minmax(0,1fr)_var(--right-sidebar-width)]",
        className,
      )}
    >
      <div className="hidden min-w-0 md:block">
        <div className="sticky top-14 h-[calc(100dvh-3.5rem)] overflow-y-auto pt-4 pb-6 pr-4 scrollbar-hide">
          {leftSidebar}
        </div>
      </div>
      <div className="min-w-0 pt-4 pb-8">
        {children}
        <DocsFooter />
      </div>
      {hasRightSidebar && <aside aria-label="Additional resources" className="hidden min-w-0 xl:block">
        <div className="sticky top-[4.5rem] z-10 max-h-[calc(100dvh-5.5rem)] overflow-y-auto pb-1 scrollbar-hide">
          {rightSidebar}
        </div>
      </aside>}
    </div>
  );
}
