"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ChevronDown, Menu, ArrowUpRight } from "lucide-react";
import { Button, ButtonLink } from "@/components/motion/button";
import { CenterMorphModal, CenterMorphModalContent, CenterMorphModalTrigger, CenterMorphModalClose } from "@/components/motion/center-morph-modal";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { PresenceGate } from "@/lib/presence-gate";
import { cn } from "@/lib/utils";

export interface NavigationLink { id: string; label: string; href: string; description?: string; group?: string }
export interface NavigationItem extends NavigationLink { children?: NavigationLink[]; featured?: NavigationLink }
export interface MarketingNavbarProps {
  brand: ReactNode; homeHref: string; items: NavigationItem[]; activeHref?: string;
  action?: { label: string; href: string }; className?: string; ariaLabel?: string;
  openMenu?: string | null; defaultOpenMenu?: string | null; onOpenMenuChange?: (id: string | null) => void;
  mobileOpen?: boolean; defaultMobileOpen?: boolean; onMobileOpenChange?: (open: boolean) => void;
}
type NavigationEdition = "pill" | "mega" | "morphing" | "feature" | "expanding" | "simple";
function NavigationSurface({ brand, homeHref, items, activeHref, action, className, ariaLabel = "Main navigation", openMenu: controlled, defaultOpenMenu = null, onOpenMenuChange, mobileOpen, defaultMobileOpen, onMobileOpenChange, edition }: MarketingNavbarProps & { edition: NavigationEdition }) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const instance = useId();
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [internal, setInternal] = useState<string | null>(defaultOpenMenu);
  const openMenu = controlled === undefined ? internal : controlled;
  const opened = items.find(item => item.id === openMenu && item.children?.length);
  const [scroll, setScroll] = useState(0);
  const changeMenu = (next: string | null) => { if (controlled === undefined) setInternal(next); onOpenMenuChange?.(next); };
  useEffect(() => {
    if (edition !== "expanding" && edition !== "simple") return;
    let parent = root.current?.parentElement;
    while (parent && !/(auto|scroll)/.test(getComputedStyle(parent).overflowY)) parent = parent.parentElement;
    const target = parent ?? window;
    const update = () => setScroll(Math.min(1, Math.max(0, (parent ? parent.scrollTop : window.scrollY) / 240)));
    update(); target.addEventListener("scroll", update, { passive: true });
    return () => target.removeEventListener("scroll", update);
  }, [edition]);
  useEffect(() => {
    if (!openMenu) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) { if (controlled === undefined) setInternal(null); onOpenMenuChange?.(null); } };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [openMenu, controlled, onOpenMenuChange]);
  const closeAndFocus = () => { const trigger = document.getElementById(`${instance}-${openMenu}-trigger`); changeMenu(null); trigger?.focus(); };
  const groups = [...new Set(opened?.children?.map(link => link.group ?? "Explore") ?? [])];
  const linkClass = "block rounded-xl p-3 text-sm transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring";
  return <LayoutGroup id={instance}><nav aria-label={ariaLabel} ref={root} onMouseLeave={() => { if (canHover) changeMenu(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) changeMenu(null); }} onKeyDown={event => { if (event.key === "Escape" && openMenu) { event.preventDefault(); closeAndFocus(); } }} className={cn("relative z-40 w-full text-foreground", edition === "mega" && "border-b border-border bg-background", edition === "pill" && "bg-background px-5 py-3 sm:px-8", (edition === "morphing" || edition === "feature") && "px-4 pt-6 sm:px-8", edition === "expanding" && "sticky top-0 px-4 pt-4", edition === "simple" && "sticky top-0 border-b border-transparent transition-colors", edition === "simple" && scroll > 0 && "border-border bg-background/85 backdrop-blur-md", className)}>
    <motion.div layout={!reduce} transition={reduce ? { duration: 0 } : SPRING_LAYOUT} style={edition === "expanding" ? { width: `${26 + scroll * 21}rem` } : undefined} className={cn("relative mx-auto", edition === "pill" && "max-w-screen-2xl", edition === "mega" && "max-w-7xl", edition === "morphing" && "max-w-5xl", edition === "feature" && "max-w-[45rem]", edition === "expanding" && "max-w-full", edition === "simple" && "max-w-7xl")}>
      <div className={cn("relative z-20 flex items-center justify-between gap-3 px-4", edition === "pill" || edition === "mega" ? "min-h-16" : edition === "feature" ? "h-[4.125rem]" : edition === "expanding" ? "h-12" : "h-14", edition === "pill" && "lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4", (edition === "morphing" || edition === "feature" || edition === "expanding") && "rounded-full border border-border/60 bg-background/80 backdrop-blur-md")}>
        <a href={homeHref} className="flex shrink-0 items-center gap-2 rounded-full py-2 text-xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-ring">{brand}</a>
        <ul className={cn("hidden items-center gap-1 md:flex", edition === "pill" && "rounded-full border border-border bg-background p-1.5")}>
          {items.map(item => <li key={item.id} onMouseEnter={() => { if (canHover) changeMenu(item.children?.length ? item.id : null); }}>{item.children?.length ? <Button id={`${instance}-${item.id}-trigger`} aria-expanded={openMenu === item.id} aria-controls={`${instance}-panel`} variant={openMenu === item.id ? "secondary" : "ghost"} size="sm" onClick={() => changeMenu(openMenu === item.id ? null : item.id)} onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); changeMenu(item.id); requestAnimationFrame(() => panel.current?.querySelector<HTMLAnchorElement>("a")?.focus()); } }}>{item.label}<ChevronDown aria-hidden="true" className="ml-1 size-3" /></Button> : <a href={item.href} aria-current={activeHref === item.href ? "page" : undefined} className="relative block rounded-full px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-ring">{activeHref === item.href && <motion.span layoutId="active-navigation" className="absolute inset-0 -z-10 rounded-full bg-muted" transition={reduce ? { duration: 0 } : SPRING_LAYOUT} />}{item.label}</a>}</li>)}
        </ul>
        <div className="hidden justify-end md:flex">{action && <ButtonLink href={action.href} size="sm">{action.label}</ButtonLink>}</div>
        <div className="md:hidden"><CenterMorphModal open={mobileOpen} defaultOpen={defaultMobileOpen} onOpenChange={onMobileOpenChange}><CenterMorphModalTrigger><Button variant="ghost" size="icon" aria-label="Open navigation"><Menu className="size-5" /></Button></CenterMorphModalTrigger><CenterMorphModalContent ariaLabel={ariaLabel} className="max-h-[85dvh] overflow-y-auto rounded-[2rem]"><nav aria-label={`${ariaLabel} mobile`} className="space-y-3 pt-4">{items.map(item => item.children?.length ? <details key={item.id} className="border-b border-border p-3"><summary className="cursor-pointer py-2 text-lg font-medium">{item.label}</summary><div className="mt-2 space-y-1">{[...item.children, ...(item.featured ? [item.featured] : [])].map(link => <CenterMorphModalClose key={link.id}><a href={link.href} className={linkClass} aria-current={activeHref === link.href ? "page" : undefined}>{link.label}<span className="mt-1 block text-xs text-muted-foreground">{link.description}</span></a></CenterMorphModalClose>)}</div></details> : <CenterMorphModalClose key={item.id}><a href={item.href} aria-current={activeHref === item.href ? "page" : undefined} className={linkClass}>{item.label}</a></CenterMorphModalClose>)}{action && <CenterMorphModalClose><ButtonLink href={action.href}>{action.label}</ButtonLink></CenterMorphModalClose>}</nav></CenterMorphModalContent></CenterMorphModal></div>
      </div>
      <AnimatePresence initial={false}>{opened && <motion.div ref={panel} id={`${instance}-panel`} layout={!reduce} initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -4 }} transition={reduce ? { duration: .1 } : SPRING_LAYOUT} className={cn("absolute top-full z-10 hidden overflow-hidden border border-border bg-background p-5 shadow-sm md:block", edition === "mega" ? "inset-x-0 rounded-b-2xl" : edition === "pill" ? "left-1/2 w-[min(90vw,42rem)] -translate-x-1/2 rounded-3xl" : "inset-x-0 rounded-b-3xl", (edition === "morphing" || edition === "feature") && "-mt-7 pt-12")}>
        <PresenceGate>{({ gate }) => <nav aria-label={`${opened.label} links`} {...gate} onKeyDown={event => { if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return; const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>("a")); if (!links.length) return; event.preventDefault(); const current = links.indexOf(document.activeElement as HTMLAnchorElement); links[event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (current + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length].focus(); }}><motion.div key={opened.id} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .18, ease: EASE_OUT }} className={cn("grid gap-5", opened.featured && "md:grid-cols-[1fr_.65fr]")}><div className={cn("grid gap-3", edition === "feature" ? "grid-cols-2" : groups.length > 1 ? "grid-cols-2" : "grid-cols-1", edition === "mega" && groups.length > 2 && "lg:grid-cols-3")}>{groups.map(group => <div key={group}><p className="mb-2 px-3 text-xs text-muted-foreground">{group}</p>{opened.children?.filter(link => (link.group ?? "Explore") === group).map(link => <a key={link.id} href={link.href} aria-current={activeHref === link.href ? "page" : undefined} onClick={() => changeMenu(null)} className={linkClass}><span className="font-medium">{link.label}</span>{link.description && <span className="mt-1 block text-xs leading-5 text-muted-foreground">{link.description}</span>}</a>)}</div>)}</div>{opened.featured && <a href={opened.featured.href} onClick={() => changeMenu(null)} className="flex min-h-40 flex-col justify-end rounded-2xl bg-muted/60 p-5 text-sm focus-visible:outline-2 focus-visible:outline-ring"><ArrowUpRight className="mb-8 size-6" aria-hidden="true" /><span className="font-medium">{opened.featured.label}</span><span className="mt-2 text-xs leading-5 text-muted-foreground">{opened.featured.description}</span></a>}</motion.div></nav>}</PresenceGate>
      </motion.div>}</AnimatePresence>
    </motion.div>
  </nav></LayoutGroup>;
}
export function PillNavigation(props: MarketingNavbarProps) { return <NavigationSurface {...props} edition="pill" />; }
export function FullWidthMegaMenu(props: MarketingNavbarProps) { return <NavigationSurface {...props} edition="mega" />; }
export function MorphingNavbar(props: MarketingNavbarProps) { return <NavigationSurface {...props} edition="morphing" />; }
export function FeatureMorph(props: MarketingNavbarProps) { return <NavigationSurface {...props} edition="feature" />; }
export function ExpandingPill(props: MarketingNavbarProps) { return <NavigationSurface {...props} edition="expanding" />; }
export function SimpleHeader(props: MarketingNavbarProps) { return <NavigationSurface {...props} edition="simple" />; }
