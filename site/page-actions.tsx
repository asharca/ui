import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Copy, FileDown, LoaderCircle, TriangleAlert } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../registry/ui/dropdown-menu';
import { publicPath } from './preferences';
import { assistantLink, getPageDocument, type AssistantTarget, type PageDocument } from './page-documents';
import { AssistantIcon } from './assistant-icons';

type CopyState = 'idle' | 'copying' | 'copied' | 'error';
/** Split-button structure and action names reference beUI copy-page.tsx (MIT). */
export function PageActions({ route }: { route: string }) {
  const page = getPageDocument(route);
  return page ? <Actions key={page.route} page={page} /> : null;
}
function Actions({ page }: { page: PageDocument }) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<CopyState>('idle');
  const controller = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; controller.current?.abort(); if (timer.current) clearTimeout(timer.current); };
  }, []);
  async function markdown(signal: AbortSignal) {
    const response = await fetch(publicPath(page.markdownPath), { signal });
    if (!response.ok || /text\/html/i.test(response.headers.get('content-type') || '')) throw new Error('Markdown unavailable');
    const text = await response.text();
    if (!text.startsWith(`# ${page.title}\n`) || text.includes('\ufffd')) throw new Error('Invalid Markdown response');
    return text;
  }
  async function copy() {
    if (busy.current) return;
    busy.current = true;
    if (timer.current) clearTimeout(timer.current);
    controller.current = new AbortController();
    const signal = controller.current.signal;
    setState('copying');
    try {
      // ClipboardItem retains the click's user activation in Safari while the
      // static document is fetched. writeText is the older-browser fallback.
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
        const content = markdown(signal).then((text) => new Blob([text], { type: 'text/plain' }));
        void content.catch(() => undefined);
        await navigator.clipboard.write([new ClipboardItem({ 'text/plain': content })]);
      } else {
        const text = await markdown(signal);
        if (signal.aborted || !mounted.current) return;
        if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
        await navigator.clipboard.writeText(text);
      }
      if (!signal.aborted && mounted.current) {
        setState('copied');
        timer.current = setTimeout(() => setState('idle'), 1800);
      }
    } catch {
      if (!signal.aborted && mounted.current) setState('error');
    } finally { busy.current = false; }
  }
  return <div className="page-actions">
    <div className="page-action-buttons">
      <button type="button" className="page-copy" onClick={() => void copy()} disabled={state === 'copying'} aria-busy={state === 'copying'} aria-label="Copy page as Markdown">
        {state === 'copying' ? <LoaderCircle className="motion-safe:animate-spin" /> : state === 'copied' ? <Check /> : state === 'error' ? <TriangleAlert /> : <Copy />}
        <span>{state === 'copied' ? 'Copied' : state === 'error' ? 'Try again' : 'Copy Page'}</span>
      </button>
      <span className="page-action-divider" aria-hidden="true" />
      <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
        <DropdownMenuTrigger asChild><button type="button" className="page-action-toggle" aria-label="More page actions"><ChevronDown className={open ? 'rotate-180' : undefined} /></button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="page-action-menu" aria-label="Page actions">
          <DropdownMenuItem asChild><a href={publicPath(page.markdownPath)} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer"><FileDown aria-hidden="true" />View as Markdown</a></DropdownMenuItem>
          {(['v0', 'ChatGPT', 'Claude'] as AssistantTarget[]).map((target) => {
            const href = assistantLink(target, page);
            return <DropdownMenuItem key={target} asChild disabled={!href}>
              <a href={href ?? undefined} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" aria-disabled={!href || undefined} title={href ? '打开外部服务并带入本页公开文档；不会包含预览中输入的内容。' : '请先配置公开部署地址。'}>
                <AssistantIcon target={target} />Open in {target}
              </a>
            </DropdownMenuItem>;
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <span role="status" className="sr-only">{state === 'copied' ? '页面 Markdown 已复制' : state === 'copying' ? '正在复制页面' : ''}</span>
    {state === 'error' && <span role="alert" className="page-copy-error">复制失败，请重试或选择 View as Markdown。</span>}
  </div>;
}
