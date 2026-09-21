'use client';
import { useEffect, useRef, useState } from 'react';
import { SafeStreamdown } from '@/components/asharca/safe-streamdown';
const markdown = '### 让回复清楚可读\n\n支持 **强调**、`行内代码`、列表和表格。\n\n- 源码可以直接修改\n- 原始 HTML 不会执行\n\n| 能力 | 状态 |\n| --- | --- |\n| 本地安装 | 可用 |\n| 主题变量 | 复用 |';
export default function SafeStreamdownDemo() {
  const [text, setText] = useState(markdown); const [busy, setBusy] = useState(false); const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  function replay() { if (timer.current) clearInterval(timer.current); let length = 0; setBusy(true); setText(''); timer.current = setInterval(() => { length += 12; setText(markdown.slice(0, length)); if (length >= markdown.length) { if (timer.current) clearInterval(timer.current); setBusy(false); } }, 55); }
  return <div className="w-full max-w-lg"><SafeStreamdown mode={busy ? 'streaming' : 'static'}>{text}</SafeStreamdown><button type="button" onClick={replay} disabled={busy} className="mt-4 rounded text-xs text-muted-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40">{busy ? '本地逐字演示中…' : '重新演示流式内容'}</button></div>;
}
