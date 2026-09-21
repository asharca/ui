'use client';
import { useState } from 'react';
import { ApprovalCard } from '@/components/asharca/approval-card';
export default function ApprovalCardDemo() {
  const [revision, setRevision] = useState(0);
  return <div className="w-full max-w-md"><ApprovalCard key={revision} title="允许读取项目状态？" description="仅交互演示，不会运行命令，也不会修改你的文件。" command="git status --short" onDecision={() => undefined} />
    <button type="button" className="mt-3 rounded text-xs text-muted-foreground underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setRevision((value) => value + 1)}>重置演示</button>
  </div>;
}
