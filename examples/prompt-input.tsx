'use client';
import { useState } from 'react';
import { PromptInput } from '@/components/asharca/prompt-input';
export default function PromptInputDemo() {
  const [sent, setSent] = useState('');
  return <div className="w-full max-w-md"><PromptInput onSubmit={(text) => { setSent(text); }} footer="本地交互演示 · 未连接模型" />
    <p role="status" className="mt-3 min-h-5 text-center text-xs text-muted-foreground">{sent ? `已收到：${sent}` : '试着输入一句话。'}</p>
  </div>;
}
