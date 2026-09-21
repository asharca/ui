import { useState } from 'react';
import { ToolCallCard, zhCN, type ToolCallState } from '../../src/index';

export function GalleryToolDemo() {
  const [state, setState] = useState<ToolCallState>('awaiting-approval');
  return <div style={{ display: 'grid', gap: 14 }}><ToolCallCard name="design__draft" state={state} labels={zhCN.toolCall} presentation={{ label: '准备界面草稿', kind: 'skill' }} onApprove={(approved) => setState(approved ? 'completed' : 'rejected')} /><p style={{ fontSize: 12, textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>本地演示</p></div>;
}
