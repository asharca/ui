'use client';
import { useState } from 'react';
import { EmptyState } from '@/components/asharca/empty-state';
export default function EmptyStateDemo() {
  const [added, setAdded] = useState(false);
  return <EmptyState className="w-full max-w-sm" title={added ? '第一个项目已创建' : '还没有项目'} description={added ? '这是本地状态演示，随时可以重新开始。' : '从一个小想法开始，把需要的组件放进项目。'} icon={<span className="text-xl">+</span>} actions={<button type="button" onClick={() => setAdded(!added)} className="rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring">{added ? '重置演示' : '创建项目'}</button>} />;
}
