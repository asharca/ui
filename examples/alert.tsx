'use client';
import { useState } from 'react';
import { Alert } from '@/components/asharca/alert';
export default function AlertDemo() {
  const [retried, setRetried] = useState(false);
  return <div className="grid w-full max-w-sm gap-3"><Alert title="更改已保存" tone="success">可以继续编辑，也可以进入预览。</Alert><Alert title={retried ? '连接已恢复' : '未能加载内容'} tone={retried ? 'success' : 'danger'} actions={!retried && <button type="button" className="rounded-md border border-border px-2 py-1 text-xs focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setRetried(true)}>模拟重试</button>}>{retried ? '本地状态演示已更新。' : '检查连接后重试，未保存的内容仍会保留。'}</Alert></div>;
}
