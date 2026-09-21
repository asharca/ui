'use client';

import { useState, type ComponentPropsWithoutRef } from 'react';
import { Check, Copy, Sparkles } from 'lucide-react';
import { Button } from './button';
import { cn } from './utils';

export interface MessageProps extends Omit<ComponentPropsWithoutRef<'article'>, 'role'> {
  role: 'user' | 'assistant';
  copyText?: string;
  meta?: string;
}
export function Message({ role, copyText, meta, children, className, ...props }: MessageProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  async function copy() {
    try { await navigator.clipboard.writeText(copyText ?? ''); setCopyState('copied'); }
    catch { setCopyState('error'); }
  }
  return <article {...props} aria-label={role === 'user' ? '用户消息' : '助手消息'} className={cn('group flex w-full gap-3 text-sm leading-7', role === 'user' && 'flex-row-reverse', className)}>
    {role === 'assistant' && <span aria-hidden="true" className="mt-1 grid size-7 shrink-0 place-items-center rounded-full border border-border bg-muted/50"><Sparkles className="size-3.5" /></span>}
    <div className={cn('min-w-0 max-w-[90%]', role === 'assistant' && 'flex-1')}>
      <div className={cn('break-words whitespace-pre-wrap', role === 'user' ? 'rounded-2xl rounded-br-md bg-muted px-4 py-2.5' : 'py-0.5')}>{children}</div>
      {(meta || copyText !== undefined) && <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
        {meta && <span>{meta}</span>}
        {copyText !== undefined && <Button variant="ghost" size="icon" className="size-7" aria-label={copyState === 'copied' ? '已复制消息' : '复制消息'} onClick={() => void copy()}>{copyState === 'copied' ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}</Button>}
        <span role="status">{copyState === 'copied' ? '已复制' : copyState === 'error' ? '复制失败，请手动选择内容。' : ''}</span>
      </div>}
    </div>
  </article>;
}
