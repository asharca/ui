'use client';
import { FileDiff } from '@/components/asharca/agent-file-diff';
export default function Demo() { return <div className="w-full max-w-xl"><FileDiff file="components/task.ts" status="complete" defaultOpen collapseOnComplete={false} language="typescript" copyText={'export const status = "complete";'} lines={[{ id: '1', type: 'context', oldLine: 1, newLine: 1, content: '// Update the task state' }, { id: '2', type: 'removed', oldLine: 2, content: 'export const status = "pending";' }, { id: '3', type: 'added', newLine: 2, content: 'export const status = "complete";' }]} /></div>; }
