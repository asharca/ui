'use client';
import { useEffect, useRef, useState } from 'react';
import { ToolCallCard, type ToolCallState } from '@/components/asharca/tool-call-card';
export default function ToolCallCardDemo() {
  const [state, setState] = useState<ToolCallState>('awaiting-approval'); const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <div className="grid w-full max-w-lg gap-3"><ToolCallCard key={state === 'awaiting-approval' ? 'approval' : 'result'} title="检查项目文件" state={state} input={{ directory: './components', readOnly: true }} output={state === 'completed' ? { files: 12, changed: 0, summary: '演示检查完成。' } : state === 'failed' ? { error: '本地模拟错误，可以重置。' } : undefined}
    onApprove={(approved) => { if (!approved) { setState('rejected'); return; } setState('running'); timer.current = setTimeout(() => setState('completed'), 900); }}
    onCancel={() => { if (timer.current) clearTimeout(timer.current); setState('cancelled'); }} />
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground"><button type="button" className="rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { if (timer.current) clearTimeout(timer.current); setState('awaiting-approval'); }}>重置审批</button><button type="button" className="rounded underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { if (timer.current) clearTimeout(timer.current); setState('failed'); }}>模拟失败</button><span>不会运行真实工具</span></div>
  </div>;
}
