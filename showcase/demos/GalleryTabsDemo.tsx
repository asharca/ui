import { useState } from 'react';
import { Activity, Layers3, Settings2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../src/index';

const panels = [{ id: 'overview', title: '概览', icon: Layers3 }, { id: 'activity', title: '活动', icon: Activity }, { id: 'settings', title: '设置', icon: Settings2 }];
export function GalleryTabsDemo() {
  const [value, setValue] = useState('overview');
  return <Tabs value={value} onValueChange={setValue} style={{ display: 'grid', justifyItems: 'center', gap: 26 }}><TabsList aria-label="动效体验" data-variant="pills">{panels.map(({ id, title }) => <TabsTrigger key={id} value={id}>{title}</TabsTrigger>)}</TabsList>{panels.map(({ id, title, icon: Icon }) => <TabsContent key={id} value={id} aria-label={title}><div className="ui-state-swap" style={{ display: 'grid', placeItems: 'center', width: 58, height: 58, borderRadius: 17, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / .6)', boxShadow: '0 3px 10px hsl(var(--foreground) / .04)' }}><Icon size={25} strokeWidth={1.5} /></div></TabsContent>)}</Tabs>;
}
