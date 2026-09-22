'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from './utils';

export interface WorkspaceShellProps extends ComponentPropsWithRef<'div'> {
  /** 应用导航。搭配 WorkspaceSidebar variant="inset"；折叠状态由应用管理。 */
  sidebar?: ReactNode;
  /** 面板外的标签栏。搭配 WorkspaceTabBar variant="inset"，选中标签与正文同色衔接。 */
  tabBar?: ReactNode;
  /** 小屏导航入口；仅在 sm 以下显示。传入按钮并控制侧栏的 mobileOpen。 */
  mobileHeader?: ReactNode;
  /** 内容面板内的固定标题 / 工具栏，不随正文滚动。 */
  header?: ReactNode;
  /** 内容面板内的固定底部，可放状态栏或聊天输入框。 */
  footer?: ReactNode;
  /** content：正文独立滚动；none：由子组件管理滚动，适合聊天、编辑器或分栏。 */
  scroll?: 'content' | 'none';
  /** 正文的 DOM 属性、ref、className 和可访问性关联；不会额外创建 main 地标。 */
  contentProps?: Omit<ComponentPropsWithRef<'div'>, 'children'>;
}

function hasSlot(node: ReactNode) { return node != null && typeof node !== 'boolean'; }

/**
 * 共享底色上的内嵌式工作区，不使用侧栏分隔线或外层阴影。
 * 为外层提供明确高度（例如 className="h-dvh"，或父级定高后使用 h-full）。
 * 默认不添加 main / tabpanel 语义：宿主通过 contentProps 设置 role、id、aria-labelledby。
 * 可覆盖 --workspace-shell-background（--muted）、--workspace-surface（--background）、
 * --workspace-gap（0.5rem）和 --workspace-radius（0.75rem）；不修改项目的全局主题。
 * 这是布局组件，不接管路由、标签持久化、未保存确认或移动导航状态。
 */
export function WorkspaceShell({
  sidebar,
  tabBar,
  mobileHeader,
  header,
  footer,
  scroll = 'content',
  contentProps,
  children,
  className,
  ...props
}: WorkspaceShellProps) {
  return <div {...props} data-slot="workspace-shell" className={cn(
    'flex h-full w-full min-h-0 min-w-0 overflow-hidden bg-[var(--workspace-shell-background,var(--muted))] text-foreground',
    className,
  )}>
    {sidebar}
    <div data-slot="workspace-body" className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {hasSlot(mobileHeader) && <div data-slot="workspace-mobile-header" className="flex min-h-14 shrink-0 items-center gap-3 px-3 sm:hidden">{mobileHeader}</div>}
      {hasSlot(tabBar) && <div data-slot="workspace-shell-tabs" className="min-w-0 shrink-0">{tabBar}</div>}
      <div data-slot="workspace-surface" className={cn(
        'm-[var(--workspace-gap,0.5rem)] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[var(--workspace-radius,0.75rem)] bg-[var(--workspace-surface,var(--background))]',
        hasSlot(tabBar) && 'mt-0',
      )}>
        {hasSlot(header) && <div data-slot="workspace-shell-header" className="min-w-0 shrink-0">{header}</div>}
        <div {...contentProps} data-slot="workspace-content" data-scroll={scroll} className={cn(
          'min-h-0 min-w-0 flex-1',
          scroll === 'content' ? 'overflow-auto overscroll-contain' : 'flex flex-col overflow-hidden',
          contentProps?.className,
        )}>{children}</div>
        {hasSlot(footer) && <div data-slot="workspace-shell-footer" className="min-w-0 shrink-0">{footer}</div>}
      </div>
    </div>
  </div>;
}
