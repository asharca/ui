import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Button } from '../../src/index';

export function GalleryButtonDemo() {
  const [saved, setSaved] = useState(false);
  return <div style={{ display: 'grid', gap: 28, justifyItems: 'center' }}>
    <Button className="ui-material-button" onClick={() => setSaved(true)}>继续构建<ArrowUpRight size={16} /></Button>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}><Button variant="primary" onClick={() => setSaved(true)}><Check size={15} />保存更改</Button><Button variant="outline" onClick={() => setSaved(false)}>取消</Button></div>
    <span role="status" style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{saved ? '已保存 · 本地演示' : '为下一步行动，给出恰好的反馈。'}</span>
  </div>;
}
