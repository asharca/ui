'use client';
import { useState } from 'react';
import { Textarea } from '@/components/asharca/textarea';
export default function TextareaDemo() {
  const [text, setText] = useState('让界面回归内容。');
  return <div className="w-full max-w-xs"><Textarea label="项目说明" value={text} onChange={(event) => setText(event.target.value)} maxLength={120} description={`${text.length} / 120 个字符`} /></div>;
}
