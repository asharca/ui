import { useState } from 'react';
import { ArrowUp, Globe2, Paperclip } from 'lucide-react';
import { Button, ChatComposerToolbar, Textarea } from '../../src/index';

export function GalleryComposerDemo() {
  const [text, setText] = useState('');
  const [pinned, setPinned] = useState(['search']);
  const [search, setSearch] = useState(false);
  const [status, setStatus] = useState('本地演示，不发送数据。');
  return <div><form style={{ padding: 14, border: '1px solid hsl(var(--border))', borderRadius: 18, background: 'hsl(var(--card))', boxShadow: '0 10px 30px -18px hsl(var(--foreground) / .25)' }} onSubmit={(event) => { event.preventDefault(); if (text.trim()) { setStatus('任务已记录在当前演示中。'); setText(''); } }}><Textarea aria-label="描述界面想法" placeholder="你想构建什么？" value={text} onChange={(event) => setText(event.target.value)} style={{ border: 0, background: 'transparent', boxShadow: 'none', minHeight: 80, resize: 'vertical' }} /><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}><ChatComposerToolbar pinnedIds={pinned} onPinnedIdsChange={setPinned} labels={{ open: '添加工具', customize: '自定义工具栏', close: '关闭' }} tools={[{ id: 'search', label: '搜索', icon: <Globe2 size={15} />, pressed: search, onSelect: () => setSearch((value) => !value) }, { id: 'file', label: '附件', icon: <Paperclip size={15} />, onSelect: () => setStatus('附件入口演示，不会访问文件。') }]} /><Button type="submit" variant="primary" size="sm" aria-label="提交本地想法" disabled={!text.trim()}><ArrowUp size={15} /></Button></div></form><p role="status" style={{ fontSize: 12, marginTop: 18, textAlign: 'center', color: 'hsl(var(--muted-foreground))' }}>{status}</p></div>;
}
