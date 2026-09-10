'use client';

import { forwardRef, useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from './Overlays.tsx';

export type WorkspaceSidebarItem = { id: string; label: string; icon: ReactNode; badge?: ReactNode; disabled?: boolean };
export type WorkspaceSidebarProps = Omit<HTMLAttributes<HTMLElement>, 'children' | 'onSelect'> & {
  brand: ReactNode;
  brandIcon: ReactNode;
  brandLabel: string;
  onBrandClick?: () => void;
  workspace?: { icon: ReactNode; name: string; description?: string; badge?: ReactNode };
  footer?: ReactNode;
  items: readonly WorkspaceSidebarItem[];
  activeId?: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  mobileCloseRef?: Ref<HTMLButtonElement>;
  navigationLabel?: string;
  sectionLabel?: string;
  labels?: { collapse?: string; expand?: string; close?: string };
};

export const WorkspaceSidebar = forwardRef<HTMLElement, WorkspaceSidebarProps>(function WorkspaceSidebar({
  brand, brandIcon, brandLabel, onBrandClick, workspace, footer, items, activeId, onSelect,
  collapsed, onCollapsedChange, mobileOpen = false, onMobileOpenChange, mobileCloseRef,
  navigationLabel = 'Workspace navigation', sectionLabel, labels, className, id, ...props
}, ref) {
  const generatedId = useId();
  const sidebarId = id ?? generatedId;
  const toggleLabel = collapsed ? labels?.expand ?? 'Expand sidebar' : labels?.collapse ?? 'Collapse sidebar';
  return <aside {...props} id={sidebarId} ref={ref} className={`tp-workspace-sidebar ${className ?? ''}`} data-toolplane-ui="workspace-sidebar" data-collapsed={collapsed} data-mobile-open={mobileOpen}>
    <div className="tp-workspace-sidebar__header">
      <button type="button" className="tp-workspace-sidebar__brand" aria-label={brandLabel} onClick={onBrandClick}>{brandIcon}<span>{brand}</span></button>
      <button type="button" className="tp-workspace-sidebar__toggle" aria-label={toggleLabel} title={toggleLabel} aria-controls={sidebarId} aria-expanded={!collapsed} onClick={() => onCollapsedChange(!collapsed)}>
        {collapsed ? <span className="tp-workspace-sidebar__expand">{brandIcon}<PanelLeftOpen size={18} /></span> : <PanelLeftClose size={18} />}
      </button>
      <button type="button" ref={mobileCloseRef} className="tp-workspace-sidebar__mobile-close" aria-label={labels?.close ?? 'Close navigation'} title={labels?.close ?? 'Close navigation'} onClick={() => onMobileOpenChange?.(false)}><X size={18} /></button>
    </div>
    {sectionLabel && <div className="tp-workspace-sidebar__section">{sectionLabel}</div>}
    <TooltipProvider><nav className="tp-workspace-sidebar__nav" aria-label={navigationLabel}>{items.map((item) => <Tooltip key={item.id}><TooltipTrigger asChild>
      <button type="button" className="tp-workspace-sidebar__item" disabled={item.disabled} aria-label={item.label} aria-current={activeId === item.id ? 'page' : undefined} onClick={() => onSelect(item.id)}>
        <span className="tp-workspace-sidebar__icon">{item.icon}</span><span className="tp-workspace-sidebar__label">{item.label}</span><span className="tp-workspace-sidebar__badge">{item.badge}</span>
      </button>
    </TooltipTrigger>{collapsed && <TooltipPortal><TooltipContent side="right">{item.label}</TooltipContent></TooltipPortal>}</Tooltip>)}</nav></TooltipProvider>
    {workspace && <div className="tp-workspace-sidebar__workspace"><span className="tp-workspace-sidebar__workspace-icon">{workspace.icon}</span><span className="tp-workspace-sidebar__workspace-text"><strong>{workspace.name}</strong><small>{workspace.description}</small></span><span className="tp-workspace-sidebar__workspace-badge">{workspace.badge}</span></div>}
    {footer && <div className="tp-workspace-sidebar__footer">{footer}</div>}
  </aside>;
});
