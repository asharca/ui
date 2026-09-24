'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, File, Paperclip, Pencil, RotateCcw } from 'lucide-react';
import { ChatPanel } from './chat-panel';
import { Button } from './button';
import { Textarea } from './textarea';
import { SafeStreamdown, type SafeStreamdownProps } from './safe-streamdown';
import { ToolCallCard, type ToolCallCardProps } from './tool-call-card';
import { ChatComposerToolbar, type ChatComposerToolbarProps } from './chat-composer-toolbar';

export interface ThreadAttachment { id: string; name: string; href?: string }
export interface ThreadMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  attachments?: ThreadAttachment[];
  tools?: (ToolCallCardProps & { id: string })[];
  branch?: { index: number; count: number };
}
export interface ChatThreadProps {
  messages: ThreadMessage[];
  onSend: (text: string) => void | Promise<void>;
  busy?: boolean;
  onStop?: () => void;
  onEdit?: (id: string, text: string) => void | Promise<void>;
  onRegenerate?: (id: string) => void | Promise<void>;
  onBranchChange?: (id: string, index: number) => void;
  onAttach?: (files: File[]) => void | Promise<void>;
  composerTools?: ChatComposerToolbarProps;
  composerFooter?: ReactNode;
  /** Body rendering options for both roles; diagrams and remote images remain opt-in. */
  markdownOptions?: Pick<SafeStreamdownProps, 'allowImages' | 'allowMermaid' | 'mermaidTheme'>;
  title?: string;
  className?: string;
}
function attachmentHref(href: string | undefined) {
  if (!href) return undefined;
  try { const url = new URL(href, 'https://example.invalid'); return ['https:', 'http:', 'blob:'].includes(url.protocol) ? href : undefined; } catch { return undefined; }
}
export function ChatThread({ messages, onSend, busy = false, onStop, onEdit, onRegenerate, onBranchChange, onAttach, composerTools, composerFooter, markdownOptions, title = '对话', className }: ChatThreadProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState('');
  const locked = useRef(false);
  const mounted = useRef(true);
  const attachmentInput = useRef<HTMLInputElement>(null);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function run(id: string, action: () => void | Promise<void>, done?: () => void) {
    if (locked.current) return;
    locked.current = true; setPending(id); setError('');
    try { await action(); if (mounted.current) done?.(); }
    catch (cause) { if (mounted.current) setError(cause instanceof Error ? cause.message : '操作失败，请重试。'); }
    finally { locked.current = false; if (mounted.current) setPending(null); }
  }
  const rendered = messages.map((message, index) => ({
    id: message.id, role: message.role,
    copyText: message.role === 'assistant' ? message.content : undefined,
    content: <div className="space-y-3 whitespace-normal">
      {message.reasoning && <details className="rounded-lg border border-border px-3 py-2"><summary className="cursor-pointer text-xs text-muted-foreground">思考过程</summary><div className="mt-2 text-xs leading-6 text-muted-foreground">{message.reasoning}</div></details>}
      {editing === message.id ? <form onSubmit={(event) => { event.preventDefault(); if (draft.trim()) void run(`edit-${message.id}`, () => onEdit?.(message.id, draft.trim()), () => setEditing(null)); }}>
        <Textarea label="编辑消息" value={draft} onChange={(event) => setDraft(event.target.value)} disabled={Boolean(pending)} />
        <div className="mt-2 flex gap-2"><Button size="sm" type="submit" loading={pending === `edit-${message.id}`} disabled={!draft.trim()}>保存编辑</Button><Button size="sm" variant="ghost" disabled={Boolean(pending)} onClick={() => setEditing(null)}>取消编辑</Button></div>
      </form> : <SafeStreamdown {...markdownOptions} mode={busy && index === messages.length - 1 && message.role === 'assistant' ? 'streaming' : 'static'}>{message.content}</SafeStreamdown>}
      {message.attachments?.length ? <div className="flex flex-wrap gap-2">{message.attachments.map((file) => {
        const href = attachmentHref(file.href);
        const label = <><File aria-hidden="true" className="size-3.5 shrink-0" /><span className="truncate">{file.name}</span></>;
        const cls = 'inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs';
        return href ? <a key={file.id} href={href} target="_blank" rel="noopener noreferrer" className={cls}>{label}</a> : <span key={file.id} className={cls}>{label}</span>;
      })}</div> : null}
      {message.tools?.map(({ id, ...tool }) => <ToolCallCard key={id} {...tool} />)}
      <div className="flex flex-wrap items-center gap-1">
        {message.role === 'user' && onEdit && editing !== message.id && <Button size="sm" variant="ghost" disabled={busy || Boolean(pending)} onClick={() => { setEditing(message.id); setDraft(message.content); setError(''); }}><Pencil aria-hidden="true" className="size-3" />编辑</Button>}
        {message.role === 'assistant' && onRegenerate && <Button size="sm" variant="ghost" disabled={busy || Boolean(pending)} loading={pending === `regenerate-${message.id}`} onClick={() => void run(`regenerate-${message.id}`, () => onRegenerate(message.id))}><RotateCcw aria-hidden="true" className="size-3" />重新生成</Button>}
        {message.branch && message.branch.count > 1 && <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Button size="icon" variant="ghost" className="size-7" aria-label="上一分支" disabled={busy || !onBranchChange || message.branch.index <= 0} onClick={() => onBranchChange?.(message.id, message.branch!.index - 1)}><ChevronLeft className="size-3" /></Button><span>{message.branch.index + 1} / {message.branch.count}</span><Button size="icon" variant="ghost" className="size-7" aria-label="下一分支" disabled={busy || !onBranchChange || message.branch.index >= message.branch.count - 1} onClick={() => onBranchChange?.(message.id, message.branch!.index + 1)}><ChevronRight className="size-3" /></Button></span>}
      </div>
    </div>,
  }));
  return <ChatPanel className={className} title={title} messages={rendered} onSend={onSend} busy={busy} onStop={onStop} footer={<div className="grid gap-2">
    <div className="flex flex-wrap items-center gap-1">
      {onAttach && <><input ref={attachmentInput} type="file" multiple aria-label="添加附件" className="sr-only" disabled={busy || Boolean(pending)} onChange={(event) => { const files = Array.from(event.target.files ?? []); if (files.length) void run('attachments', () => onAttach(files), () => { if (attachmentInput.current) attachmentInput.current.value = ''; }); }} /><Button size="sm" variant="ghost" loading={pending === 'attachments'} disabled={busy || Boolean(pending)} onClick={() => attachmentInput.current?.click()}><Paperclip aria-hidden="true" className="size-3.5" />附件</Button></>}
      {composerTools && <ChatComposerToolbar {...composerTools} />}
    </div>
    {composerFooter}{error && <p role="alert" className="text-xs text-destructive">{error}</p>}
  </div>} />;
}
