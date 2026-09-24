'use client';
import { Children, isValidElement, useEffect, useId, useMemo, useRef, useState } from 'react';
import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Download, Maximize2 } from 'lucide-react';
import { actionClass, DiagramViewport, ExpandedContent, MarkdownTable, saveText } from './rich-content-view';
import { cn, focusRing } from './utils';

export interface SafeStreamdownProps {
  children: string;
  mode?: 'static' | 'streaming';
  allowImages?: boolean;
  /** Opt in to local Mermaid rendering. Streaming diagrams wait until completion. */
  allowMermaid?: boolean;
  /** Auto observes .dark / data-theme="dark" on ancestors; override for other themes. */
  mermaidTheme?: 'auto' | 'light' | 'dark';
  className?: string;
}

// Mermaid owns a global renderer. Serialize this component's jobs so two graphs
// cannot overwrite one another's theme/config; a failed job never poisons the queue.
let graphQueue: Promise<unknown> = Promise.resolve();
function renderGraph(code: string, id: string, dark: boolean, cancelled: () => boolean) {
  const job = graphQueue.then(async () => {
    if (cancelled()) return '';
    // Deliberately support plain diagram definitions, not document-controlled
    // configuration, HTML, external assets, click handlers or arbitrary styling.
    if (code.length > 20000 || !/^(?:flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|pie|gantt)\b/.test(code.trim()) ||
      /%%\{|^\s*---|<\s*[a-z/!]|(?:https?|data|javascript):|\/\/|url\s*\(|@import|@\{|(?:^|[\n;])\s*(?:click|link|links|style|classDef)\b/i.test(code)) {
      throw new Error('Unsupported or unsafe diagram definition.');
    }
    const [{ default: mermaid }, { default: purify }] = await Promise.all([import('mermaid'), import('dompurify')]);
    if (cancelled()) return '';
    mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', suppressErrorRendering: true,
      maxTextSize: 20000, maxEdges: 100, htmlLabels: false, theme: 'base', layout: 'dagre',
      fontFamily: 'Arial, PingFang SC, Microsoft YaHei, sans-serif',
      flowchart: { htmlLabels: false, useMaxWidth: false },
      themeVariables: { darkMode: dark, background: 'transparent', primaryColor: dark ? '#262626' : '#f5f5f5', primaryTextColor: dark ? '#e5e5e5' : '#262626', primaryBorderColor: dark ? '#737373' : '#a3a3a3', lineColor: dark ? '#a3a3a3' : '#737373', secondaryColor: dark ? '#303030' : '#fafafa', tertiaryColor: dark ? '#202020' : '#ffffff', mainBkg: dark ? '#262626' : '#f5f5f5', textColor: dark ? '#e5e5e5' : '#262626', actorTextColor: dark ? '#e5e5e5' : '#262626', actorBkg: dark ? '#262626' : '#f5f5f5', actorBorder: dark ? '#737373' : '#a3a3a3', signalColor: dark ? '#d4d4d4' : '#404040', signalTextColor: dark ? '#e5e5e5' : '#262626', labelBoxBkgColor: dark ? '#262626' : '#f5f5f5', labelTextColor: dark ? '#e5e5e5' : '#262626', noteBkgColor: dark ? '#303030' : '#fafafa', noteTextColor: dark ? '#e5e5e5' : '#262626', fontSize: '14px' },
    });
    if (!await mermaid.parse(code, { suppressErrors: true })) throw new Error('Invalid Mermaid syntax.');
    if (cancelled()) return '';
    const stage = document.createElement('div');
    stage.setAttribute('aria-hidden', 'true');
    stage.setAttribute('data-mermaid-measure', '');
    Object.assign(stage.style, { position: 'fixed', left: '-10000px', top: '0', width: '1200px', visibility: 'hidden', pointerEvents: 'none' });
    document.body.append(stage);
    try {
      const { svg } = await mermaid.render(id, code, stage);
      const clean = purify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true }, FORBID_TAGS: ['foreignObject', 'image', 'a'], FORBID_ATTR: ['href', 'xlink:href'] });
      const documentSvg = new DOMParser().parseFromString(clean, 'image/svg+xml');
      const root = documentSvg.documentElement;
      if (root.tagName.toLowerCase() !== 'svg') throw new Error('Invalid SVG output.');
      const box = root.getAttribute('viewBox')?.split(/[\s,]+/).map(Number);
      if (box?.length === 4 && box.every(Number.isFinite) && box[2] > 0 && box[3] > 0) {
        root.setAttribute('width', String(box[2])); root.setAttribute('height', String(box[3]));
      }
      // Display as an image, not active SVG in the host DOM. No bindFunctions,
      // scripts, diagram links, or CDN requests are used by this renderer.
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(root))}`;
    } finally { stage.remove(); }
  });
  graphQueue = job.catch(() => undefined);
  return job;
}

function MermaidBlock({ code, pending, theme }: { code: string; pending: boolean; theme: 'auto' | 'light' | 'dark' }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const host = useRef<HTMLElement>(null);
  const [dark, setDark] = useState(theme === 'dark');
  const [view, setView] = useState<'diagram' | 'source'>('diagram');
  const [revision, setRevision] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const expandTrigger = useRef<HTMLButtonElement>(null);
  const [downloadError, setDownloadError] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');
  const [result, setResult] = useState<{ key: string; src?: string; error?: boolean } | null>(null);
  const key = `${dark}:${revision}:${code}`;
  useEffect(() => {
    const update = () => setDark(theme === 'dark' || (theme === 'auto' && Boolean(host.current?.closest('.dark, [data-theme="dark"]'))));
    update();
    if (theme !== 'auto' || typeof MutationObserver === 'undefined') return;
    const observer = new MutationObserver(update);
    for (let node: Element | null = host.current; node; node = node.parentElement) observer.observe(node, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => observer.disconnect();
  }, [theme]);
  useEffect(() => {
    if (pending) return;
    let cancelled = false;
    void renderGraph(code, `asharca-graph-${id}-${revision}`, dark, () => cancelled)
      .then((src) => { if (!cancelled) setResult({ key, src }); })
      .catch(() => { if (!cancelled) setResult({ key, error: true }); });
    return () => { cancelled = true; };
  }, [code, dark, id, key, pending, revision]);
  useEffect(() => { if (copyState === 'idle') return; const timer = setTimeout(() => setCopyState('idle'), 1800); return () => clearTimeout(timer); }, [copyState]);
  const current = result?.key === key ? result : null;
  const source = view === 'source' || pending || current?.error;
  const control = cn('rounded-md px-2 py-1 text-[11px] text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40', focusRing);
  async function copy() {
    try { await navigator.clipboard.writeText(code); setCopyState('copied'); }
    catch { setCopyState('error'); }
  }
  const ready = !pending && Boolean(current?.src) && !current?.error;
  function download() {
    if (!current?.src) return;
    try {
      const data = decodeURIComponent(current.src.slice(current.src.indexOf(',') + 1));
      saveText(data, 'image/svg+xml;charset=utf-8', 'diagram.svg'); setDownloadError(false);
    } catch { setDownloadError(true); }
  }
  const controls = (fullscreen: boolean) => <div role="group" aria-label="图表操作" className="flex shrink-0 items-center gap-0.5">
    <button type="button" className={actionClass} onClick={() => void copy()} aria-label="复制 Mermaid 源码" title={copyState === 'copied' ? '已复制' : '复制源码'}><Copy aria-hidden="true" /></button>
    <button type="button" className={actionClass} onClick={download} disabled={!ready} aria-label="下载 Mermaid SVG" title="下载 SVG"><Download aria-hidden="true" /></button>
    {!fullscreen && <button ref={expandTrigger} type="button" className={actionClass} onClick={() => setExpanded(true)} disabled={!ready} aria-label="展开 Mermaid 图表" title="展开图表"><Maximize2 aria-hidden="true" /></button>}
  </div>;
  const failure = () => setResult({ key, error: true });
  return <figure ref={host} data-slot="mermaid-block" data-state={pending ? 'streaming' : current?.error ? 'error' : current?.src ? 'ready' : 'loading'} className="my-4 flex min-w-0 max-w-full flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2">
    <figcaption className="flex min-w-0 flex-wrap items-center justify-between gap-1">
      <div role="group" aria-label="图表显示方式" className="flex items-center gap-0.5 rounded-md bg-muted/50 p-0.5">
        <button type="button" className={cn(control, view === 'diagram' && 'bg-background text-foreground shadow-xs')} aria-pressed={view === 'diagram'} onClick={() => setView('diagram')}>图表</button>
        <button type="button" className={cn(control, view === 'source' && 'bg-background text-foreground shadow-xs')} aria-pressed={view === 'source'} onClick={() => setView('source')}>源码</button>
      </div>
      {controls(false)}
    </figcaption>
    {pending && <p role="status" className="px-2 text-xs text-muted-foreground">图表生成中，回复结束后渲染。</p>}
    {current?.error && !pending && <div className="flex items-center justify-between gap-3 px-2 text-xs text-muted-foreground"><p role="status">图表暂时无法渲染，已保留源码。</p><button type="button" className={control} onClick={() => setRevision((value) => value + 1)}>重试</button></div>}
    {source ? <pre aria-label="Mermaid 源码" tabIndex={0} className="!m-0 max-h-96 !rounded-md !border-border !bg-background !text-xs"><code>{code}</code></pre> : current?.src ?
      <DiagramViewport key={code} src={current.src} onError={failure} /> : <p role="status" className="rounded-md border border-border bg-background px-4 py-12 text-center text-xs text-muted-foreground">正在绘制图表…</p>}
    <span role="status" className="sr-only">{copyState === 'copied' ? 'Mermaid 源码已复制' : ''}</span>
    {copyState === 'error' && <p role="alert" className="px-2 text-xs text-destructive">复制失败，请切换源码视图手动复制。</p>}
    {downloadError && <p role="alert" className="px-2 text-xs text-destructive">导出失败，请复制图表源码。</p>}
    <ExpandedContent open={expanded} onOpenChange={setExpanded} title="Mermaid 图表预览" trigger={expandTrigger}>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between gap-2"><span className="text-xs text-muted-foreground">拖动查看 · + / − 缩放 · 0 适应画布</span>{controls(true)}</div>
        {ready && current?.src ? <DiagramViewport key={code} src={current.src} fullscreen onError={failure} /> : <p role="status">图表暂时不可用，请关闭预览查看源码。</p>}
        <span role="status" className="text-xs text-muted-foreground">{copyState === 'copied' ? 'Mermaid 源码已复制' : copyState === 'error' ? '复制失败，请查看源码。' : downloadError ? '导出失败，请复制图表源码。' : ''}</span>
      </div>
    </ExpandedContent>
  </figure>;
}

/** Raw HTML is ignored; Markdown URLs retain react-markdown sanitization.
 * Remote images and plain Mermaid diagrams are separate, explicit opt-ins.
 */
export function SafeStreamdown({ children, mode = 'static', allowImages = false, allowMermaid = false, mermaidTheme = 'auto', className }: SafeStreamdownProps) {
  const components = useMemo<Components>(() => ({
      a: ({ children: text, href, title }) => href ? <a href={href} title={title} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring">{text}</a> : <span>{text}</span>,
      img: ({ src, alt }) => allowImages && typeof src === 'string' ? <img src={src} alt={alt ?? ''} loading="lazy" referrerPolicy="no-referrer" className="max-h-80 max-w-full rounded-xl object-contain" /> : <span className="text-xs text-muted-foreground">[图片：{alt || '未加载'}]</span>,
      table: ({ children: rows }) => <MarkdownTable>{rows}</MarkdownTable>,
      pre: ({ children: content }) => {
        const code = Children.toArray(content)[0];
        if (allowMermaid && isValidElement<{ className?: string; children?: string }>(code) && /(?:^|\s)language-mermaid(?:\s|$)/.test(code.props.className ?? '')) {
          return <MermaidBlock code={String(code.props.children ?? '').replace(/\n$/, '')} pending={mode === 'streaming'} theme={mermaidTheme} />;
        }
        return <pre tabIndex={0}>{content}</pre>;
      },
  }), [allowImages, allowMermaid, mermaidTheme, mode]);
  return <div aria-busy={mode === 'streaming'} className={cn('min-w-0 max-w-full break-words text-sm leading-7 [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_h1]:my-4 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:my-4 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:my-3 [&_h3]:font-semibold [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs [&_pre]:my-4 [&_pre]:max-w-full [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/40 [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_hr]:my-5 [&_hr]:border-border', className)}>
    <Markdown skipHtml remarkPlugins={[remarkGfm]} components={components}>{children}</Markdown>
  </div>;
}
