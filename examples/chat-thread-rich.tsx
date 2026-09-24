'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatThread, type ThreadMessage } from '@/components/asharca/chat-thread';

const answer = '### 交付情况\n\n| 阶段 | 状态 | 下一步 |\n| --- | --- | --- |\n| 需求确认 | 已完成 | 开始实施 |\n| 开发交付 | 进行中 | 提交成果 |\n| 成果审核 | 待开始 | 审核或退回 |\n\n```mermaid\nflowchart LR\n  A[用户需求] --> B[开发交付]\n  B --> C{成果审核}\n  C -->|通过| D[完成归档]\n  C -->|退回| B\n```';
const initial: ThreadMessage[] = [
  { id: 'question', role: 'user', content: '请用表格汇总交付情况，再画一张 Mermaid 流程图。' },
  { id: 'answer', role: 'assistant', content: answer },
];
export default function RichChatThreadDemo() {
  const [messages, setMessages] = useState(initial);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const serial = useRef(0);
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  function stop() { if (timer.current) clearInterval(timer.current); timer.current = null; setBusy(false); }
  function send(text: string) {
    stop(); const id = `reply-${++serial.current}`; let length = 0;
    setMessages((items) => [...items, { id: `question-${serial.current}`, role: 'user', content: text }, { id, role: 'assistant', content: '' }]);
    setBusy(true);
    timer.current = setInterval(() => { length += 18; setMessages((items) => items.map((item) => item.id === id ? { ...item, content: answer.slice(0, length) } : item)); if (length >= answer.length) stop(); }, 60);
  }
  return <div className="w-full max-w-4xl" data-demo="rich-chat">
    <p className="mb-4 text-xs leading-6 text-muted-foreground">ChatThread 组合用户消息、AI 回复和输入框；SafeStreamdown 负责正文中的表格与图表。下面是本地模拟，不连接模型。</p>
    <ChatThread className="h-[40rem]" title="表格与图表对话 · 本地演示" messages={messages} onSend={send} busy={busy} onStop={stop}
      markdownOptions={{ allowMermaid: true }}
      onEdit={(id, text) => setMessages((items) => items.map((item) => item.id === id ? { ...item, content: text } : item))}
      composerFooter={<span className="text-[10px] text-muted-foreground">输入任意问题体验本地流式回复 · 图表在回复结束后渲染</span>} />
  </div>;
}
