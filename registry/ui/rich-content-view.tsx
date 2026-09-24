'use client';

import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { Copy, Download, Maximize2, Minus, Plus, Table2 } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { cn, focusRing } from './utils';

// Presentation follows ToolPlane's Streamdown controls, while keeping this
// registry's opt-in, sanitized static-image rendering boundary.
export const actionClass = cn('inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40 motion-safe:transition-colors [&_svg]:size-4', focusRing);
const tableClass = 'w-full border-collapse text-sm [&_thead]:sticky [&_thead]:top-0 [&_thead]:bg-muted [&_th]:border-b [&_th]:border-border [&_th]:px-4 [&_th]:py-3 [&_th]:font-medium [&_th]:text-left [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap [&_td]:border-b [&_td]:border-border/60 [&_td]:px-4 [&_td]:py-3 [&_tr:last-child_td]:border-b-0 [&_tbody_tr]:hover:bg-muted/25';

export function saveText(text: string, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement('a');
  link.href = url; link.download = filename;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ExpandedContent({ open, onOpenChange, title, trigger, children }: {
  open: boolean; onOpenChange: (value: boolean) => void; title: string;
  trigger: RefObject<HTMLButtonElement | null>; children: ReactNode;
}) {
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent title={title} className="flex h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[100rem] flex-col overflow-hidden p-4 [&>div:first-child]:mb-3"
      onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus({ preventScroll: true }); }}>
      {children}
    </DialogContent>
  </Dialog>;
}

function spreadsheetValue(cell: string) {
  return /^[\s\u0000-\u001f]*[=+\-@]/.test(cell) ? `'${cell}` : cell;
}

export function MarkdownTable({ children }: { children?: ReactNode }) {
  const local = useRef<HTMLTableElement>(null);
  const expanded = useRef<HTMLTableElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { if (!feedback) return; const timer = setTimeout(() => setFeedback(''), 2000); return () => clearTimeout(timer); }, [feedback]);
  function cells() {
    const table = (open ? expanded.current : local.current) ?? local.current;
    return Array.from(table?.rows ?? []).map((row) => Array.from(row.cells).map((cell) => (cell.textContent ?? '').trim()));
  }
  async function copy() {
    try {
      const value = cells().map((row) => row.map((cell) => spreadsheetValue(cell.replace(/[\t\r\n]+/g, ' '))).join('\t')).join('\n');
      await navigator.clipboard.writeText(value);
      if (mounted.current) setFeedback('表格已复制，可粘贴到电子表格。');
    } catch { if (mounted.current) setFeedback('复制失败，请手动选择表格内容。'); }
  }
  function download() {
    try {
      // Quote all cells, retain Unicode and neutralize spreadsheet formulas.
      const csv = cells().map((row) => row.map((cell) => {
        const safe = spreadsheetValue(cell);
        return `"${safe.replace(/"/g, '""')}"`;
      }).join(',')).join('\r\n');
      saveText(`\uFEFF${csv}`, 'text/csv;charset=utf-8', 'table.csv');
      setFeedback('CSV 已导出。');
    } catch { setFeedback('导出失败，请复制表格内容。'); }
  }
  const controls = (fullscreen: boolean) => <div className="flex min-w-0 items-center justify-between gap-2">
    <span className="inline-flex items-center gap-2 px-1 text-xs text-muted-foreground"><Table2 aria-hidden="true" className="size-3.5" />表格</span>
    <div role="group" aria-label="表格操作" className="flex shrink-0 items-center gap-0.5">
      <button type="button" className={actionClass} aria-label="复制表格" title="复制表格，可粘贴到电子表格" onClick={() => void copy()}><Copy aria-hidden="true" /></button>
      <button type="button" className={actionClass} aria-label="下载表格 CSV" title="下载 CSV" onClick={download}><Download aria-hidden="true" /></button>
      {!fullscreen && <button ref={trigger} type="button" className={actionClass} aria-label="展开表格" title="展开表格" onClick={() => setOpen(true)}><Maximize2 aria-hidden="true" /></button>}
    </div>
  </div>;
  return <div data-slot="markdown-table" className="my-4 flex min-w-0 max-w-full flex-col gap-2 rounded-lg border border-border bg-muted/30 p-2">
    {controls(false)}
    <div role="region" aria-label="Markdown 表格，可横向滚动" tabIndex={0} className={cn('max-h-[28rem] min-w-0 overflow-auto rounded-md border border-border bg-background', focusRing)}>
      <table ref={local} aria-label="Markdown 表格" className={tableClass}>{children}</table>
    </div>
    <span role="status" className={feedback.includes('失败') ? 'px-1 text-xs text-destructive' : 'sr-only'}>{feedback}</span>
    <ExpandedContent open={open} onOpenChange={setOpen} title="表格预览" trigger={trigger}>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        {controls(true)}
        <div role="region" aria-label="展开的 Markdown 表格" tabIndex={0} className={cn('min-h-0 flex-1 overflow-auto rounded-lg border border-border', focusRing)}>
          <table ref={expanded} aria-label="Markdown 表格" className={tableClass}>{children}</table>
        </div>
        <span role="status" className={feedback.includes('失败') ? 'text-xs text-destructive' : 'sr-only'}>{feedback}</span>
      </div>
    </ExpandedContent>
  </div>;
}

export function DiagramViewport({ src, fullscreen = false, onError }: { src: string; fullscreen?: boolean; onError: () => void }) {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; left: number; top: number; id: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [bounds, setBounds] = useState({ width: 640, height: 320 });
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    const node = viewport.current;
    if (!node) return;
    const read = () => setBounds({ width: node.clientWidth, height: node.clientHeight });
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(read); observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const inlineHeight = Math.min(384, Math.max(224, Math.min(1, Math.max(1, bounds.width - 40) / size.width) * size.height + 56));
  const fit = Math.min(1, Math.max(1, bounds.width - 40) / size.width, Math.max(1, bounds.height - 56) / size.height);
  const reset = () => { setZoom(1); if (viewport.current) { viewport.current.scrollTop = 0; viewport.current.scrollLeft = 0; } };
  const changeZoom = (delta: number) => setZoom((value) => Math.max(0.5, Math.min(3, value + delta)));
  return <div data-slot="mermaid-viewport" className={cn('relative min-w-0 overflow-hidden rounded-md border border-border bg-background', fullscreen && 'min-h-0 flex-1')}>
    <div ref={viewport} data-slot="mermaid-canvas" role="region" aria-label="Mermaid 图表预览，可拖动或滚动" tabIndex={0}
      className={cn('overflow-auto overscroll-contain rounded-md outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring', fullscreen ? 'h-full' : '', dragging ? 'cursor-grabbing select-none' : 'cursor-grab')}
      style={fullscreen ? undefined : { height: inlineHeight }}
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop, id: event.pointerId };
        event.currentTarget.setPointerCapture(event.pointerId); setDragging(true);
      }}
      onPointerMove={(event) => {
        if (!drag.current || drag.current.id !== event.pointerId) return;
        event.currentTarget.scrollLeft = drag.current.left - event.clientX + drag.current.x;
        event.currentTarget.scrollTop = drag.current.top - event.clientY + drag.current.y;
      }}
      onPointerUp={() => { drag.current = null; setDragging(false); }}
      onPointerCancel={() => { drag.current = null; setDragging(false); }}
      onLostPointerCapture={() => { drag.current = null; setDragging(false); }}
      onKeyDown={(event) => {
        if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(0.25); }
        if (event.key === '-') { event.preventDefault(); changeZoom(-0.25); }
        if (event.key === '0') { event.preventDefault(); reset(); }
      }}>
      <div className="flex min-h-full min-w-full items-center justify-center p-5 pb-9" style={{ width: Math.max(bounds.width, size.width * fit * zoom + 40), height: Math.max(bounds.height, size.height * fit * zoom + 56) }}>
        <img src={src} alt="Mermaid 图表" draggable={false} className="block shrink-0 !max-w-none select-none"
          style={{ width: size.width * fit * zoom, height: size.height * fit * zoom }}
          onLoad={(event) => setSize({ width: event.currentTarget.naturalWidth || 1, height: event.currentTarget.naturalHeight || 1 })} onError={onError} />
      </div>
    </div>
    <div role="group" aria-label="图表缩放" className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-lg border border-border bg-background/95 p-1 shadow-sm">
      <button type="button" className={actionClass} aria-label="缩小图表" title="缩小 (-)" disabled={zoom <= 0.5} onClick={() => changeZoom(-0.25)}><Minus aria-hidden="true" /></button>
      <button type="button" className={cn(actionClass, 'w-14 text-[11px] tabular-nums')} aria-label="重置图表缩放" title="适应画布 (0)" onClick={reset}>{Math.round(zoom * 100)}%</button>
      <button type="button" className={actionClass} aria-label="放大图表" title="放大 (+)" disabled={zoom >= 3} onClick={() => changeZoom(0.25)}><Plus aria-hidden="true" /></button>
    </div>
  </div>;
}
