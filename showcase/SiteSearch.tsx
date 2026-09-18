import { useRef, useState } from 'react';
import { ArrowRight, FileText, Search, X } from 'lucide-react';
import { IconButton, SearchInput } from '../src/Controls';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from '../src/Dialog';
import { catalogMetadata } from './catalog-data';
import { appExamples } from './examples/registry';

const pages = [
  { name: '安装与快速开始', group: '指南', description: '依赖、样式、导入与第一个组件', href: '#/installation' },
  { name: '主题实验室', group: '指南', description: 'Minimal Tech Glass 明暗模式与界面密度', href: '#/themes' },
  { name: 'AI 接入文档', group: '指南', description: 'llms.txt Markdown 编程助手', href: '#/ai' },
  { name: '组合示例', group: '指南', description: '后台、图表、看板、工作区与设置', href: '#/examples' },
  ...appExamples.map((example) => ({ name: example.name, group: '示例', description: example.description, href: `#/examples/${example.id}` })),
  ...catalogMetadata.map((doc) => ({ name: doc.name, group: doc.group, description: doc.description, href: `#/components/${doc.id}` })),
];

// Keep positioning inline: CSS optimization can fold translate into transform
// and accidentally reactivate the shared Dialog's Tailwind Y translation.
export function SiteSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const links = useRef<Array<HTMLAnchorElement | null>>([]);
  const previous = useRef<HTMLElement | null>(null);
  const term = query.trim().toLowerCase();
  const results = (term ? pages.filter((item) => `${item.name} ${item.description} ${item.group}`.toLowerCase().includes(term)) : pages.slice(0, 10)).slice(0, 30);
  const close = () => { onOpenChange(false); setQuery(''); };
  return <Dialog open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) setQuery(''); }}><DialogPortal><DialogOverlay className="site-search-overlay" /><DialogContent className="site-search-dialog" style={{ transform: 'none', translate: '-50% 0' }} aria-describedby={undefined} onOpenAutoFocus={(event) => { event.preventDefault(); previous.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; input.current?.focus(); }} onCloseAutoFocus={(event) => { event.preventDefault(); if (previous.current?.isConnected) previous.current.focus(); }}>
    <div className="site-search-heading"><DialogTitle><Search size={17} />搜索文档</DialogTitle><DialogClose asChild><IconButton label="关闭搜索" variant="ghost" icon={<X size={16} />} /></DialogClose></div>
    <SearchInput ref={input} label="搜索文档和组件" placeholder="搜索组件、用途或指南…" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} onKeyDown={(event) => {
      if (results.length && (event.key === 'ArrowDown' || event.key === 'Enter')) { event.preventDefault(); if (event.key === 'Enter') links.current[0]?.click(); else links.current[0]?.focus(); }
      if (results.length && event.key === 'ArrowUp') { event.preventDefault(); links.current[results.length - 1]?.focus(); }
    }} />
    <div className="site-search-results" aria-label="文档搜索结果"><p className="site-search-count" role="status">{term ? `${results.length} 个结果${results.length === 30 ? '（最多显示 30 项）' : ''}` : '快速访问'}</p>{results.map((item, index) => <a key={item.href} href={item.href} ref={(node) => { links.current[index] = node; }} onClick={close} onKeyDown={(event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); const next = index + (event.key === 'ArrowDown' ? 1 : -1); if (next < 0 || next >= results.length) input.current?.focus(); else links.current[next]?.focus(); }
    }}><span className="site-search-icon"><FileText size={17} /></span><span><strong>{item.name}<small>{item.group}</small></strong><span>{item.description}</span></span><ArrowRight size={15} /></a>)}{!results.length && <p className="docs-search-empty">没有找到结果，试试 Button、表单或 AI。</p>}</div>
  </DialogContent></DialogPortal></Dialog>;
}
