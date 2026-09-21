'use client';

import { Slot, Tabs as TabsPrimitive } from 'radix-ui';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  ComponentRef,
  ReactNode,
} from 'react';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<ComponentRef<typeof TabsPrimitive.List>, ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(
  function TabsList({ className, ...props }, ref) {
    const node = useRef<ComponentRef<typeof TabsPrimitive.List>>(null);
    useImperativeHandle(ref, () => node.current!, []);
    useEffect(() => {
      const list = node.current;
      if (!list || typeof requestAnimationFrame === 'undefined') return;
      // A CSS pseudo-element keeps the public DOM, asChild, refs and Radix
      // roving-focus semantics intact. Unmeasurable/unstyled lists keep their
      // original active-tab presentation (including SSR and hidden panels).
      let frame = 0;
      let observed: HTMLElement[] = [];
      const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
      const measure = () => {
        const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).filter((tab) => tab.closest('[role="tablist"]') === list);
        if (tabs.length !== observed.length || tabs.some((tab, index) => tab !== observed[index])) {
          resize?.disconnect(); resize?.observe(list); tabs.forEach((tab) => resize?.observe(tab));
          observed = tabs;
        }
        const active = tabs.find((tab) => tab.dataset.state === 'active');
        if (!active || !list.offsetWidth || !active.offsetWidth) { delete list.dataset.indicator; return; }
        const bounds = list.getBoundingClientRect();
        const selected = active.getBoundingClientRect();
        const scaleX = bounds.width / list.offsetWidth || 1;
        const scaleY = bounds.height / list.offsetHeight || 1;
        const values = {
          x: (selected.left - bounds.left) / scaleX + list.scrollLeft - list.clientLeft,
          y: (selected.top - bounds.top) / scaleY + list.scrollTop - list.clientTop,
          width: selected.width / scaleX,
          height: selected.height / scaleY,
        };
        for (const [name, value] of Object.entries(values)) list.style.setProperty(`--ui-tabs-${name}`, `${value}px`);
        list.dataset.indicator = 'ready';
      };
      function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); }
      const mutations = typeof MutationObserver === 'undefined' ? null : new MutationObserver(schedule);
      mutations?.observe(list, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['data-state', 'data-orientation', 'dir', 'class'] });
      // Direction can be inherited from any host, including a runtime RTL toggle.
      for (let parent = list.parentElement; parent; parent = parent.parentElement) mutations?.observe(parent, { attributes: true, attributeFilter: ['dir'] });
      window.addEventListener('resize', schedule);
      measure();
      return () => {
        cancelAnimationFrame(frame); resize?.disconnect(); mutations?.disconnect();
        window.removeEventListener('resize', schedule); delete list.dataset.indicator;
        for (const name of ['x', 'y', 'width', 'height']) list.style.removeProperty(`--ui-tabs-${name}`);
      };
    }, []);
    return <TabsPrimitive.List {...props} ref={node} data-toolplane-ui="tabs-list" className={cx('ui-tabs-list', className)} />;
  },
);

export const TabsTrigger = forwardRef<ComponentRef<typeof TabsPrimitive.Trigger>, ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(
  function TabsTrigger({ className, ...props }, ref) {
    return <TabsPrimitive.Trigger {...props} ref={ref} data-toolplane-ui="tabs-trigger" className={cx('ui-tabs-trigger', className)} />;
  },
);

export const TabsContent = forwardRef<ComponentRef<typeof TabsPrimitive.Content>, ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(
  function TabsContent({ className, ...props }, ref) {
    return <TabsPrimitive.Content {...props} ref={ref} data-toolplane-ui="tabs-content" className={cx('ui-tabs-content', className)} />;
  },
);

export type ChipProps = ComponentPropsWithoutRef<'span'> & {
  active?: boolean;
  asChild?: boolean;
};

export function Chip({ active = false, asChild = false, className, ...props }: ChipProps) {
  const Component = asChild ? Slot.Root : 'span';
  return (
    <Component
      {...props}
      data-toolplane-ui="chip"
      data-active={active || undefined}
      className={cx('ui-chip', active && 'ui-chip-active', className)}
    />
  );
}

export type TabListProps = ComponentPropsWithoutRef<'div'> & {
  label: string;
  navigation?: boolean;
};

export function TabList({ className, label, navigation = false, ...props }: TabListProps) {
  const classes = cx(
    'inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-muted p-1 ring-1 ring-border/70',
    className,
  );

  if (navigation) {
    return (
      <nav
        {...props}
        aria-label={label}
        data-toolplane-ui="tab-list"
        className={classes}
      />
    );
  }

  return (
    <div
      {...props}
      data-toolplane-ui="tab-list"
      role="tablist"
      aria-label={label}
      className={classes}
    />
  );
}

export type NavigationTabsProps = ComponentPropsWithoutRef<'nav'> & {
  contentClassName?: string;
};

export function NavigationTabs({
  children,
  className,
  contentClassName,
  ...props
}: NavigationTabsProps) {
  return (
    <nav
      {...props}
      data-toolplane-ui="navigation-tabs"
      className={cx('max-w-full overflow-x-auto pb-1', className)}
    >
      <div className={cx('inline-flex min-w-max items-center gap-1 rounded-xl bg-muted p-1 ring-1 ring-border/70', contentClassName)}>
        {children}
      </div>
    </nav>
  );
}

export type BreadcrumbsProps = ComponentPropsWithoutRef<'nav'>;

export function Breadcrumbs({
  'aria-label': ariaLabel = 'Breadcrumb',
  children,
  className,
  ...props
}: BreadcrumbsProps) {
  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      data-toolplane-ui="breadcrumbs"
      className={cx('min-w-0 overflow-hidden', className)}
    >
      <ol className="flex min-w-0 items-center gap-2 overflow-hidden">{children}</ol>
    </nav>
  );
}

export type BreadcrumbItemProps = ComponentPropsWithoutRef<'li'> & {
  current?: boolean;
  separator?: ReactNode;
};

export function BreadcrumbItem({
  children,
  className,
  current = false,
  separator,
  ...props
}: BreadcrumbItemProps) {
  return (
    <li {...props} className={cx('flex min-w-0 items-center gap-2', className)}>
      {separator ? <span aria-hidden="true" className="shrink-0 text-muted-foreground/55">{separator}</span> : null}
      <span
        aria-current={current ? 'page' : undefined}
        className={cx('truncate', current ? 'text-muted-foreground' : 'font-semibold text-foreground')}
      >
        {children}
      </span>
    </li>
  );
}

export type TabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  count?: number;
  current?: boolean;
  navigation?: boolean;
};

export function Tab({
  asChild = false,
  children,
  className,
  count,
  current = false,
  navigation = false,
  type = 'button',
  ...props
}: TabProps) {
  const classes = cx(
    'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors',
    current
      ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60'
      : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
    className,
  );

  if (asChild) {
    return (
      <Slot.Root
        {...props}
        data-toolplane-ui="tab"
        data-current={current || undefined}
        role={navigation ? undefined : 'tab'}
        aria-current={navigation && current ? 'page' : undefined}
        aria-selected={navigation ? undefined : current}
        className={classes}
      >
        {children}
      </Slot.Root>
    );
  }

  return (
    <button
      {...props}
      type={type}
      data-toolplane-ui="tab"
      data-current={current || undefined}
      role={navigation ? undefined : 'tab'}
      aria-current={navigation && current ? 'page' : undefined}
      aria-selected={navigation ? undefined : current}
      className={classes}
    >
      {children}
      {typeof count === 'number' ? (
        <span className="text-muted-foreground/70">{count}</span>
      ) : null}
    </button>
  );
}

export type TabPanelProps = ComponentPropsWithoutRef<'div'> & {
  current?: boolean;
};

export function TabPanel({ className, current = false, ...props }: TabPanelProps) {
  return (
    <div
      {...props}
      data-toolplane-ui="tab-panel"
      role="tabpanel"
      hidden={!current}
      className={className}
    />
  );
}

export type PaginationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  next?: ReactNode;
  previous?: ReactNode;
  summary: ReactNode;
};

export function Pagination({
  className,
  next,
  previous,
  summary,
  ...props
}: PaginationProps) {
  return (
    <nav
      {...props}
      data-toolplane-ui="pagination"
      className={cx(
        'flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <span>{summary}</span>
      <div className="flex gap-2">
        {previous}
        {next}
      </div>
    </nav>
  );
}
