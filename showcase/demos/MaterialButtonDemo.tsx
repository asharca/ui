import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { Button } from '../../src/index';

// Import @asharca/ui/themes.css after @asharca/ui/styles.css for this material.
export function MaterialButtonDemo() {
  const [saved, setSaved] = useState(false);
  return <div style={{ display: 'grid', justifyItems: 'center', gap: 20 }}>
    <Button className="ui-material-button" onClick={() => setSaved((value) => !value)}>
      {saved ? <Check size={16} /> : <ArrowUpRight size={16} />}
      {saved ? '已保存' : '试试这个按钮'}
    </Button>
    <span role="status" style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>{saved ? '本地状态已更新，再次点击重置' : '悬停看反光，点击切换状态'}</span>
  </div>;
}
