'use client';
import { useEffect, useRef, useState } from 'react';
import { ToolResult } from '@/components/asharca/tool-result';
export default function ToolResultDemo() {
  const [status, setStatus] = useState<'running' | 'success'>('success');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <div className="w-full max-w-md"><ToolResult title="检查组件构建" status={status} defaultOpen output={status === 'running' ? '正在检查类型与依赖…' : '演示输出\n✓ 类型检查通过\n✓ 组件预览已准备'} />
    <button type="button" className="mt-3 rounded text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring" onClick={() => { setStatus('running'); timer.current = setTimeout(() => setStatus('success'), 900); }}>重新演示</button>
  </div>;
}
