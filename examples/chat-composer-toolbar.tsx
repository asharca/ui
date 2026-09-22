'use client';
import { useState } from 'react';
import { Globe, FileText, Search } from 'lucide-react';
import { ChatComposerToolbar } from '@/components/asharca/chat-composer-toolbar';
export default function ChatComposerToolbarDemo() {
  const [pinned, setPinned] = useState(['web']); const [web, setWeb] = useState(false); const [action, setAction] = useState('选择工具或调整固定项。');
  return <div className="w-full max-w-md rounded-2xl border border-border bg-background p-4"><p className="mb-4 text-sm text-muted-foreground">描述你想完成的任务…</p><ChatComposerToolbar pinnedIds={pinned} onPinnedIdsChange={setPinned} tools={[
    { id: 'web', label: '联网', group: '检索', icon: <Globe className="size-3.5" />, pressed: web, onSelect: () => { setWeb(!web); setAction(web ? '已关闭联网选项' : '已开启联网选项（仅状态演示）'); } },
    { id: 'search', label: '搜索文件', group: '检索', icon: <Search className="size-3.5" />, onSelect: () => setAction('已选择文件搜索（本地演示）') },
    { id: 'document', label: '整理文档', group: '内容', icon: <FileText className="size-3.5" />, onSelect: () => setAction('已选择文档整理（本地演示）') },
    { id: 'restricted', label: '组织管理', group: '管理', disabled: true, pinable: false, onSelect: () => undefined },
  ]} /><p role="status" className="mt-3 text-[10px] text-muted-foreground">{action}</p></div>;
}
