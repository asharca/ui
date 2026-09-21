import { useState } from 'react';
import { Activity, Layers3, Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/index';

const panels = [{ id: 'overview', title: '概览', icon: Layers3, detail: '所有进展，井然有序。' }, { id: 'activity', title: '动态', icon: Activity, detail: '每一次更新，都有迹可循。' }, { id: 'settings', title: '设置', icon: Settings2, detail: '让工作区，适合你的节奏。' }];
export function GalleryTabsDemo() {
  const [value, setValue] = useState('overview');
  return <Tabs value={value} onValueChange={setValue} style={{ display: 'grid', justifyItems: 'center', gap: 18 }}><TabsList aria-label="工作区视图" data-variant="pills">{panels.map(({ id, title }) => <TabsTrigger key={id} value={id}>{title}</TabsTrigger>)}</TabsList>{panels.map(({ id, title, detail, icon: Icon }) => <TabsContent key={id} value={id} style={{ textAlign: 'center', padding: 20 }}><Icon size={30} strokeWidth={1.4} style={{ margin: '0 auto 18px' }} /><strong style={{ fontSize: 14 }}>{title}</strong><p style={{ fontSize: 12, marginTop: 8, color: 'hsl(var(--muted-foreground))' }}>{detail}</p></TabsContent>)}</Tabs>;
}
