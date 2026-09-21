import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react';
import { ArrowUpRight, Code2, Eye, Grid2X2, List, RotateCcw, Shapes } from 'lucide-react';
import { Button, IconButton, SearchInput, Select } from '../src/Controls';
import { componentDocs } from './ComponentDemos';
import { componentGroups } from './component-metadata';
import { publicExample } from './component-markdown';
import { DocCode } from './DocCode';

type CatalogEntry = typeof componentDocs[number];
const sources = import.meta.glob<string>('./demos/*.tsx', { query: '?raw', import: 'default' });
const priority = ['button', 'tabs', 'choice-field', 'tool-call-card', 'chat-composer-toolbar', 'data-table', 'switch', 'avatar', 'accordion', 'dropdown-menu', 'dialog'];
const ordered = [...componentDocs].sort((a, b) => {
  const rank = (id: string) => priority.includes(id) ? priority.indexOf(id) : priority.length;
  return rank(a.id) - rank(b.id);
});

// Gallery compositions are deliberately smaller than the full documentation
// playgrounds. The code view reads this exact composition, not a different demo.
const compactFiles: Record<string, string> = {
  button: 'GalleryButtonDemo', tabs: 'GalleryTabsDemo', 'choice-field': 'GalleryChoiceDemo',
  'tool-call-card': 'GalleryToolDemo', 'chat-composer-toolbar': 'GalleryComposerDemo', 'data-table': 'GalleryTableDemo',
  switch: 'GallerySwitchDemo', avatar: 'GalleryAvatarDemo', accordion: 'GalleryAccordionDemo',
  'dropdown-menu': 'GalleryDropdownDemo', dialog: 'GalleryDialogDemo',
};
const compactLoaders = import.meta.glob<Record<string, ComponentType>>('./demos/Gallery*Demo.tsx');
const galleryEntries = new Map(componentDocs.map((doc) => {
  const file = compactFiles[doc.id];
  if (!file) return [doc, doc] as const;
  const Demo = lazy(async () => ({ default: (await compactLoaders[`./demos/${file}.tsx`]())[file] }));
  return [doc, { ...doc, demoFile: `${file}.tsx`, preview: <Suspense fallback={<span role="status">加载预览…</span>}><Demo /></Suspense> }] as const;
}));

function DeferredDemo({ doc }: { doc: CatalogEntry }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready || !root.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { root: root.current.closest('.docs-main'), rootMargin: '240px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [ready]);
  return <div ref={root} data-preview-state={ready ? 'ready' : 'pending'} className="studio-tile-preview docs-demo-canvas" role="region" aria-label={`${doc.name} 交互预览`} tabIndex={0}>
    {ready ? doc.preview : <Button variant="ghost" size="sm" onClick={() => setReady(true)}><Shapes size={17} />载入 {doc.name} 预览</Button>}
  </div>;
}

function TileSource({ doc }: { doc: CatalogEntry }) {
  const [source, setSource] = useState('');
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      const load = sources[`./demos/${doc.demoFile}`];
      if (!load) throw new Error('Missing demo source');
      return load();
    }).then((text) => { if (active) setSource(publicExample(text)); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [doc.demoFile]);
  return <div className="ref-tile-code">{error ? <p role="alert">源码未能加载，请重新打开代码视图。</p> : source ? <DocCode code={source} label={`${doc.name} 用法 TSX`} /> : <p role="status">正在读取同源示例…</p>}</div>;
}

export function ComponentTile({ doc: original, list = false, href }: { doc: CatalogEntry; list?: boolean; href?: string }) {
  const doc = galleryEntries.get(original) ?? original;
  const [revision, setRevision] = useState(0);
  const [code, setCode] = useState(false);
  return <article className="studio-tile ref-tile" data-component={doc.id}>
    {!list && <div className="ref-tile-surface"><div hidden={code}><DeferredDemo key={revision} doc={doc} /></div>{code && <TileSource doc={doc} />}</div>}
    <div className="ref-tile-footer"><a className="studio-tile-link" href={href ?? `#/components/${doc.id}`}><div><h3>{doc.name}</h3>{list && <p>{doc.description}</p>}</div>{list && <ArrowUpRight size={15} aria-hidden="true" />}</a>
      {!list && <div className="ref-tile-actions" role="group" aria-label={`${doc.name} 展示内容`}><IconButton label={`预览 ${doc.name}`} size="sm" variant="ghost" aria-pressed={!code} icon={<Eye size={14} />} onClick={() => setCode(false)} /><IconButton size="sm" variant="ghost" label={`重置 ${doc.name} 预览`} icon={<RotateCcw size={13} />} onClick={() => { setRevision((value) => value + 1); setCode(false); }} /><IconButton label={`查看 ${doc.name} 源码`} size="sm" variant="ghost" aria-pressed={code} icon={<Code2 size={14} />} onClick={() => setCode(true)} /></div>}
    </div>
  </article>;
}

export function ComponentGallery() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('全部');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const needle = query.trim().toLowerCase();
  const visible = ordered.filter((doc) => (group === '全部' || doc.group === group) && `${doc.id} ${doc.name} ${doc.description} ${doc.group}`.toLowerCase().includes(needle));
  return <div className="studio-gallery ref-gallery">
    <div className="studio-gallery-heading docs-page-heading"><h1 aria-label="组件">组件<span aria-hidden="true" className="ref-count">{componentDocs.length}</span></h1></div>
    <div className="studio-gallery-controls"><SearchInput label="筛选组件总览" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="搜索组件…" /><Select aria-label="组件分类" value={group} onChange={(event) => setGroup(event.target.value)}>{['全部', ...componentGroups].map((name) => <option key={name}>{name}</option>)}</Select><div className="studio-layout-controls" role="group" aria-label="组件展示方式"><IconButton label="网格展示" variant="ghost" size="sm" aria-pressed={layout === 'grid'} icon={<Grid2X2 size={16} />} onClick={() => setLayout('grid')} /><IconButton label="列表展示" variant="ghost" size="sm" aria-pressed={layout === 'list'} icon={<List size={16} />} onClick={() => setLayout('list')} /></div></div>
    <div className="studio-results"><span role="status">{visible.length} 个组件</span></div>
    {visible.length ? <div className="studio-catalog-grid ref-catalog-grid" data-layout={layout}>{visible.map((doc) => <ComponentTile key={doc.id} doc={doc} list={layout === 'list'} />)}</div> : <div className="studio-empty"><Shapes size={30} /><h2>还没有找到匹配的组件</h2><p>试试更短的关键词，或换一个分类。</p><Button variant="outline" onClick={() => { setQuery(''); setGroup('全部'); }}>清除筛选</Button></div>}
  </div>;
}
