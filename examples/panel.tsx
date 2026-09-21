'use client';
import { useState } from 'react';
import { Panel } from '@/components/asharca/panel';
export default function PanelDemo() {
  const [enabled, setEnabled] = useState(true);
  return <Panel title="项目设置" description="设置内容与操作保持清楚的分区。" className="w-full max-w-sm" actions={<button type="button" onClick={() => setEnabled(!enabled)} className="rounded-lg border border-border px-3 py-2 text-xs focus-visible:outline-2 focus-visible:outline-ring">{enabled ? '暂停通知' : '恢复通知'}</button>}><div className="flex justify-between gap-3 text-xs"><span className="text-muted-foreground">更新通知</span><span role="status">{enabled ? '已开启' : '已暂停'}</span></div></Panel>;
}
