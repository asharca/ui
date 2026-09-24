'use client';
import { useState } from 'react';
import { CodeBlock } from '@/components/asharca/agent-code-block';
const lines = ['type Task = { id: string; status: string };', '', 'export function complete(task: Task): Task {', '  return { ...task, status: "complete" };', '}'];
export default function Demo() { const [count, setCount] = useState(lines.length); return <div className="w-full max-w-xl space-y-3"><CodeBlock code={lines.slice(0, count).join('\n')} filename="task.ts" language="typescript" status={count < lines.length ? 'streaming' : 'complete'} highlightLines={[4]} /><button className="rounded-lg border border-border px-3 py-2 text-xs" onClick={() => setCount(count < lines.length ? count + 1 : 1)}>逐行演示</button></div>; }
