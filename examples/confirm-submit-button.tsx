'use client';
import { useState } from 'react';
import { ConfirmSubmitButton } from '@/components/asharca/confirm-submit-button';
export default function ConfirmSubmitButtonDemo() {
  const [count, setCount] = useState(0);
  return <div className="grid justify-items-center gap-4"><ConfirmSubmitButton title="移除示例项目？" prompt="这只会更新本地演示计数，不会删除文件。" triggerLabel="移除示例" confirmLabel="确认移除" onConfirm={() => setCount((value) => value + 1)} /><p role="status" className="text-xs text-muted-foreground">已确认 {count} 次</p></div>;
}
