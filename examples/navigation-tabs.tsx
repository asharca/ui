'use client';
import { useId } from 'react';
import { NavigationTabs } from '@/components/asharca/navigation-tabs';
export default function NavigationTabsDemo() {
  const id = useId();
  return <div className="w-full max-w-sm"><NavigationTabs activeId="overview" items={[{ id: 'overview', label: '概览', href: `#${id}` }, { id: 'guide', label: '使用指南', href: `#${id}-guide` }, { id: 'soon', label: '归档', href: '#', disabled: true }]} /><div id={id} className="pt-4 text-xs leading-6 text-muted-foreground">这是页面链接导航，不会冒充内容切换的 Tab。</div><p id={`${id}-guide`} className="mt-3 text-xs leading-6 text-muted-foreground">点击“使用指南”会跳到本段。正式项目可传入真实页面地址。</p></div>;
}
