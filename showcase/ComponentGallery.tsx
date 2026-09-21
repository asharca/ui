import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowUpRight, Code2, Grid2X2, List, RotateCcw, Search, X } from 'lucide-react';
import { Button, IconButton, SearchInput, Select } from '../src/Controls';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '../src/Dialog';
import { componentDocs } from './ComponentDemos';
import { componentGroups } from './component-metadata';
import { publicExample } from './component-markdown';
import { DocCode } from './DocCode';

export type CatalogEntry = typeof componentDocs[number];
const sources = import.meta.glob<string>('./demos/*.tsx', { query: '?raw', import: 'default' });
const loaders = import.meta.glob<Record<string, ComponentType>>('./demos/Gallery*Demo.tsx');
const compact: Record<string, string> = {
  button: 'GalleryButtonDemo', tabs: 'GalleryTabsDemo', switch: 'GallerySwitchDemo',
  avatar: 'GalleryAvatarDemo', 'dropdown-menu': 'GalleryDropdownDemo', dialog: 'GalleryDialogDemo',
  accordion: 'GalleryAccordionDemo', 'choice-field': 'GalleryChoiceDemo', 'data-table': 'GalleryTableDemo',
  'tool-call-card': 'GalleryToolDemo', 'chat-composer-toolbar': 'GalleryComposerDemo',
};
const captions: Record<string, string> = {
  button: '从点击，到完成', tabs: '连续的选中状态', switch: '轻触切换', avatar: '悬停与聚焦',
  'dropdown-menu': '自然展开，轻巧收起', dialog: '进入、编辑、返回', accordion: '内容平滑展开',
  'choice-field': '清晰的选择反馈', 'data-table': '选择与批量操作', 'tool-call-card': '调用与审批',
  'chat-composer-toolbar': '从一个想法开始', 'material-button': '细腻的金属表面',
};
const priority = ['button', 'tabs', 'switch', 'avatar', 'dropdown-menu', 'dialog', 'accordion', 'choice-field', 'data-table', 'chat-composer-toolbar', 'tool-call-card'];
const ordered = [...componentDocs].sort((a, b) => {
  const rank = (id: string) => priority.includes(id) ? priority.indexOf(id) : priority.length;
  return rank(a.id) - rank(b.id);
});
const entries = new Map(componentDocs.map((doc) => {
  const file = compact[doc.id];
  if (!file) return [doc, doc] as const;
  const Demo = lazy(async () => ({ default: (await loaders[`./demos/${file}.tsx`]())[file] }));
  return [doc, { ...doc, demoFile: `${file}.tsx`, preview: <Suspense fallback={<span role="status">加载预览…</span>}><Demo /></Suspense> }] as const;
}));

function LivePreview({ doc }: { doc: CatalogEntry }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready || !root.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((items) => {
      if (items.some((item) => item.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { root: root.current.closest('.docs-main'), rootMargin: '240px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [ready]);
  return <div ref={root} className="ex-stage studio-tile-preview docs-demo-canvas" data-preview-state={ready ? 'ready' : 'pending'} role="region" aria-label={`${doc.name} 交互预览`} tabIndex={0}>
    {ready ? doc.preview : <Button size="sm" variant="ghost" onClick={() => setReady(true)}>载入 {doc.name} 预览</Button>}
  </div>;
}

function Source({ doc }: { doc: CatalogEntry }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    let current = true;
    const load = sources[`./demos/${doc.demoFile}`];
    Promise.resolve().then(() => { if (!load) throw new Error('Missing example'); return load(); })
      .then((code) => { if (current) setText(publicExample(code)); })
      .catch(() => { if (current) setError(true); });
    return () => { current = false; };
  }, [doc.demoFile]);
  return error ? <p role="alert">源码加载失败，请关闭后重试。</p> : text ? <DocCode code={text} label={`${doc.name} 用法 TSX`} /> : <p role="status">加载源码…</p>;
}

export function ComponentTile({ doc: original, list = false, href }: { doc: CatalogEntry; list?: boolean; href?: string }) {
  const doc = entries.get(original) ?? original;
  const [revision, setRevision] = useState(0);
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}><article className="ex-card studio-tile" data-component={doc.id}>
    {!list && <div className="ex-card-frame"><LivePreview key={revision} doc={doc} /><IconButton className="ex-replay" label={`重置 ${doc.name} 预览`} size="sm" variant="ghost" icon={<RotateCcw size={14} />} onClick={() => setRevision((value) => value + 1)} /></div>}
    <div className="ex-card-caption"><a className="studio-tile-link" href={href ?? `#/components/${doc.id}`}><h3>{doc.name}</h3><p>{captions[doc.id] ?? doc.description}</p></a>
      {list ? <ArrowUpRight size={15} /> : <DialogTrigger asChild><IconButton label={`查看 ${doc.name} 源码`} variant="ghost" size="sm" icon={<Code2 size={15} />} /></DialogTrigger>}
    </div>
    <DialogPortal><DialogOverlay className="ex-code-overlay" /><DialogContent className="ex-code-dialog" aria-describedby={undefined}>
      <header><DialogTitle>{doc.name}</DialogTitle><DialogClose asChild><IconButton label="关闭源码" variant="ghost" icon={<X size={17} />} /></DialogClose></header>
      {open && <Source doc={doc} />}<footer><a href={href ?? `#/components/${doc.id}`} onClick={() => setOpen(false)}>查看组件<ArrowUpRight size={13} /></a><a href="#/installation" onClick={() => setOpen(false)}>安装</a></footer>
    </DialogContent></DialogPortal>
  </article></Dialog>;
}

export function ComponentGallery({ featured }: { featured?: CatalogEntry[] }) {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('全部');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);
  const items = featured ?? ordered;
  const groups = [...componentGroups];
  const available = groups.filter((name) => items.some((doc) => doc.group === name));
  const visible = items.filter((doc) => (group === '全部' || doc.group === group) && `${doc.name} ${doc.id} ${doc.description} ${doc.group}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <section id="collection" className="ex-collection studio-gallery" aria-label={featured ? '精选交互展厅' : '组件画廊'}>
    {!featured && <header className="ex-page-title"><h1>组件</h1><p>预览，复制，开始构建。</p></header>}
    <div className="ex-filter-row"><div className="ex-filters" role="group" aria-label="按组件分类筛选">{['全部', ...available].map((name) => <button key={name} type="button" aria-pressed={group === name} onClick={() => setGroup(name)}>{name}</button>)}</div>
      <div className="ex-view-controls" role="group" aria-label="组件展示方式"><IconButton label="搜索组件" variant="ghost" size="sm" aria-expanded={searchOpen} icon={<Search size={15} />} onClick={() => setSearchOpen((value) => !value)} /><IconButton label={layout === 'grid' ? '列表展示' : '网格展示'} variant="ghost" size="sm" icon={layout === 'grid' ? <List size={16} /> : <Grid2X2 size={16} />} onClick={() => setLayout((value) => value === 'grid' ? 'list' : 'grid')} /></div>
    </div>
    <div className="ex-catalog-search" hidden={!searchOpen}><SearchInput ref={searchRef} label="筛选组件总览" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="搜索组件…" /><Select aria-label="组件分类" value={group} onChange={(event) => setGroup(event.target.value)}>{['全部', ...available].map((name) => <option key={name}>{name}</option>)}</Select></div>
    <span className="ex-sr" role="status">{visible.length} 个组件</span>
    {visible.length ? <div className="ex-grid studio-catalog-grid" data-layout={layout}>{visible.map((doc) => <ComponentTile key={doc.id} doc={doc} list={layout === 'list'} href={doc.id === 'material-button' ? '#/components/button' : undefined} />)}</div> : <div className="ex-empty"><h2>还没有找到匹配的组件</h2><Button variant="outline" onClick={() => { setQuery(''); setGroup('全部'); }}>清除筛选</Button></div>}
  </section>;
}
