"use client";

import { PanelLeft, X } from "lucide-react";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import {
  AnimatedSidebar, AnimatedSidebarClose, AnimatedSidebarContent,
  AnimatedSidebarFooter, AnimatedSidebarGroup, AnimatedSidebarGroupLabel,
  AnimatedSidebarHeader, AnimatedSidebarMenu, AnimatedSidebarMenuButton,
  AnimatedSidebarMenuItem, AnimatedSidebarTrigger, useAnimatedSidebar,
} from "@/components/motion/animated-sidebar";
import { cn } from "@/lib/utils";

export interface WorkspaceSidebarItem {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  href?: string;
  disabled?: boolean;
}
export interface WorkspaceSidebarGroup { id: string; title?: string; items: WorkspaceSidebarItem[] }
export interface WorkspaceSidebarProps {
  groups: WorkspaceSidebarGroup[];
  activeId?: string;
  onSelect?: (id: string) => void;
  title?: string;
  footer?: ReactNode;
  className?: string;
}

/** Composition of beUI primitives, not a second copy of the sidebar engine. */
export function WorkspaceSidebar({ groups, activeId, onSelect, title = "工作区", footer, className }: WorkspaceSidebarProps) {
  const { open, isMobile } = useAnimatedSidebar();
  const compact = !open && !isMobile;
  const footerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    if (compact && footerRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
  }, [compact]);
  return <AnimatedSidebar ariaLabel={`${title}导航`} variant="inset"
    className={cn(!isMobile && "h-full", className)} panelClassName="static m-0 h-full rounded-none bg-transparent">
    <AnimatedSidebarHeader className="h-11 flex-row items-center gap-0 px-3.5 py-0">
      <span className={cn("min-w-0 flex-1 truncate text-xs font-semibold", compact && "invisible")} aria-hidden={compact}>{title}</span>
      {isMobile ? <AnimatedSidebarClose aria-label="关闭工作区导航" className="size-9"><X className="size-4" /></AnimatedSidebarClose> :
        <AnimatedSidebarTrigger ref={toggleRef} aria-label={open ? "折叠工作区侧栏" : "展开工作区侧栏"} className="size-9 shrink-0"><PanelLeft className="size-[18px]" /></AnimatedSidebarTrigger>}
    </AnimatedSidebarHeader>
    <AnimatedSidebarContent className="gap-3 px-3.5 py-2 [scrollbar-width:none]">
      {groups.map((group) => <AnimatedSidebarGroup key={group.id} className="px-0 py-0">
        {group.title && <AnimatedSidebarGroupLabel className="h-7 px-2 text-[10px]">{group.title}</AnimatedSidebarGroupLabel>}
        <AnimatedSidebarMenu className="gap-1">
          {group.items.map((item) => <AnimatedSidebarMenuItem key={item.id}>
            <AnimatedSidebarMenuButton isActive={activeId === item.id} onSelect={() => onSelect?.(item.id)}
              href={item.href} icon={item.icon} badge={item.badge} disabled={item.disabled}
              className="h-9 gap-2 overflow-visible rounded-lg px-2 text-xs [&>span:first-child:not([aria-hidden])]:rounded-lg [&>span[aria-hidden=true]]:size-5 [&_svg]:size-[18px] [&>span.absolute]:bg-[var(--workspace-surface,var(--background))]">
              {item.label}
            </AnimatedSidebarMenuButton>
          </AnimatedSidebarMenuItem>)}
        </AnimatedSidebarMenu>
      </AnimatedSidebarGroup>)}
    </AnimatedSidebarContent>
    {footer && <AnimatedSidebarFooter className="border-0 px-3.5"><div ref={footerRef} inert={compact} aria-hidden={compact} className={cn("overflow-hidden whitespace-nowrap", compact && "invisible")}>{footer}</div></AnimatedSidebarFooter>}
  </AnimatedSidebar>;
}
