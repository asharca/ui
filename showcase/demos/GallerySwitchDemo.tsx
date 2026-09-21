import { useId, useState } from 'react';
import { Bell, Save } from 'lucide-react';
import { Switch } from '../../src/index';

export function GallerySwitchDemo() {
  const id = useId();
  const [save, setSave] = useState(true);
  const [notify, setNotify] = useState(false);
  return <div style={{ display: 'grid', gap: 22, width: '100%', maxWidth: 234, padding: 22, border: '1px solid hsl(var(--border) / .6)', borderRadius: 18, background: 'hsl(var(--card))', boxShadow: '0 4px 16px hsl(var(--foreground) / .035)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Save size={16} aria-hidden="true" /><label htmlFor={`${id}-save`} style={{ flex: 1, fontSize: 13 }}>自动保存</label><Switch id={`${id}-save`} checked={save} onCheckedChange={setSave} /></div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Bell size={16} aria-hidden="true" /><label htmlFor={`${id}-notify`} style={{ flex: 1, fontSize: 13 }}>桌面通知</label><Switch id={`${id}-notify`} checked={notify} onCheckedChange={setNotify} /></div>
  </div>;
}
