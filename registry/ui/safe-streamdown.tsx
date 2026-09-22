'use client';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from './utils';

export interface SafeStreamdownProps {
  children: string;
  mode?: 'static' | 'streaming';
  allowImages?: boolean;
  className?: string;
}
/** Source-registry version: progressive Markdown rendering without a chat runtime.
 * Raw HTML is ignored, default URL sanitization is kept, and remote images are opt-in.
 * The historical component name is retained; the renderer is react-markdown + GFM.
 */
export function SafeStreamdown({ children, mode = 'static', allowImages = false, className }: SafeStreamdownProps) {
  return <div aria-busy={mode === 'streaming'} className={cn('min-w-0 break-words text-sm leading-7 [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_h1]:my-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:my-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:my-3 [&_h3]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs [&_pre]:my-4 [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_th]:border-b [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border-b [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_hr]:my-5 [&_hr]:border-border', className)}>
    <Markdown skipHtml remarkPlugins={[remarkGfm]} components={{
      a: ({ children: text, href, title }) => href ? <a href={href} title={title} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{text}</a> : <span>{text}</span>,
      img: ({ src, alt }) => allowImages && typeof src === 'string' ? <img src={src} alt={alt ?? ''} loading="lazy" referrerPolicy="no-referrer" className="max-h-80 max-w-full rounded-xl object-contain" /> : <span className="text-xs text-muted-foreground">[图片：{alt || '未加载'}]</span>,
      table: ({ children: rows }) => <div className="my-4 max-w-full overflow-x-auto rounded-xl border border-border"><table className="w-full text-xs">{rows}</table></div>,
    }}>{children}</Markdown>
  </div>;
}
