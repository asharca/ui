'use client';
import { useEffect, useRef, useState } from 'react';
import { ChatPanel, type ChatMessage } from '@/components/asharca/chat-panel';
export default function ChatPanelDemo() {
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 'welcome', role: 'assistant', content: '你好。想从哪个想法开始？' }]);
  const [busy, setBusy] = useState(false);
  const serial = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  function append(role: 'user' | 'assistant', content: string) { const id = String(++serial.current); setMessages((items) => [...items, { id, role, content }]); }
  function send(text: string) {
    append('user', text); setBusy(true);
    timer.current = setTimeout(() => { append('assistant', '已收到。这是本地交互演示；接入时由你的应用提供模型调用与流式状态。'); setBusy(false); }, 900);
  }
  function stop() { if (timer.current) clearTimeout(timer.current); setBusy(false); append('assistant', '已停止本地演示。'); }
  return <ChatPanel className="h-[27rem] max-w-2xl" title="新的对话" messages={messages} busy={busy} onSend={send} onStop={stop} footer="本地演示 · 未连接模型" />;
}
