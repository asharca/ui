'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatThread, type ThreadMessage } from '@/components/asharca/chat-thread';
import type { ToolCallState } from '@/components/asharca/tool-call-card';
const initial: ThreadMessage[] = [
  { id: 'user-1', role: 'user', content: '帮我整理一个简约的界面方案。' },
  { id: 'assistant-1', role: 'assistant', content: '从三个部分开始：\n\n1. 清楚的导航\n2. 可交互的组件\n3. 简短的使用说明', reasoning: '先确认页面层级，再考虑组件之间的关系。这是公开的演示说明。', branch: { index: 0, count: 2 } },
];
export default function ChatThreadDemo() {
  const [messages, setMessages] = useState<ThreadMessage[]>(initial);
  const [busy, setBusy] = useState(false);
  const [toolState, setToolState] = useState<ToolCallState>('awaiting-approval');
  const [pinned, setPinned] = useState(['search']);
  const [search, setSearch] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const serial = useRef(0);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  function stream(id: string) {
    if (timer.current) clearInterval(timer.current);
    const answer = '这是本地模拟回复。组件支持 **Markdown**、工具过程和消息操作，实际模型请求由你的应用提供。';
    let length = 0; setBusy(true);
    timer.current = setInterval(() => {
      length += 7;
      setMessages((items) => items.map((item) => item.id === id ? { ...item, content: answer.slice(0, length) } : item));
      if (length >= answer.length) { if (timer.current) clearInterval(timer.current); setBusy(false); }
    }, 65);
  }
  function send(text: string) {
    const id = `assistant-${++serial.current + 1}`;
    setMessages((items) => [...items, { id: `user-${serial.current + 1}`, role: 'user', content: text }, { id, role: 'assistant', content: '' }]);
    stream(id);
  }
  const rendered = messages.map((message) => message.id === 'assistant-1' ? { ...message, tools: [{ id: 'tool-1', title: '检查组件目录', state: toolState, input: { path: './components', readOnly: true }, output: toolState === 'completed' ? { components: 12, changed: 0 } : undefined, onApprove: (approved: boolean) => setToolState(approved ? 'completed' : 'rejected') }] } : message);
  return <ChatThread className="h-[32rem] max-w-4xl" title="界面方案 · 本地演示" messages={rendered} onSend={send} busy={busy}
    onStop={() => { if (timer.current) clearInterval(timer.current); setBusy(false); }}
    onEdit={(id, text) => setMessages((items) => items.map((item) => item.id === id ? { ...item, content: text } : item))}
    onRegenerate={(id) => stream(id)}
    onBranchChange={(id, index) => setMessages((items) => items.map((item) => item.id === id ? { ...item, branch: { index, count: 2 }, content: index ? '另一个方案：先从 **表格与工作区布局** 开始，再补齐导航和输入组件。' : initial[1].content } : item))}
    onAttach={(files) => { const id = `files-${++serial.current}`; setMessages((items) => [...items, { id, role: 'user', content: '已选择附件（仅显示文件名，未上传）。', attachments: files.map((file, index) => ({ id: `${id}-${index}`, name: file.name })) }]); }}
    composerTools={{ pinnedIds: pinned, onPinnedIdsChange: setPinned, tools: [{ id: 'search', label: '检索', pressed: search, onSelect: () => setSearch(!search) }, { id: 'notes', label: '笔记', onSelect: () => send('整理当前讨论要点。') }] }}
    composerFooter={<span className="text-[10px] text-muted-foreground">未连接模型 · 工具不会执行真实命令</span>} />;
}
