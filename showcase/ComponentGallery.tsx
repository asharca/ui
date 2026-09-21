import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Grid2X2, List, RotateCcw, Shapes } from 'lucide-react';
import { Button, IconButton, SearchInput, Select } from '../src/Controls';
import { componentDocs } from './ComponentDemos';
import { componentGroups } from './component-metadata';

type CatalogEntry = typeof componentDocs[number];

/** Mount near the viewport, once. Existing demo/source pairing stays canonical. */
function DeferredDemo({ doc }: { doc: CatalogEntry }) {
  const root = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (ready || !root.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) { setReady(true); observer.disconnect(); }
    }, { root: root.current.closest('.docs-main'), rootMargin: '160px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [ready]);
  return <div ref={root} data-preview-state={ready ? 'ready' : 'pending'} className="studio-tile-preview docs-demo-canvas" role="region" aria-label={`${doc.name} 交互预览`} tabIndex={0}>
    {ready ? doc.preview : <Button variant="ghost" size="sm" onClick={() => setReady(true)}><Shapes size={17} />载入 {doc.name} 预览</Button>}
  </div>;
}

export function ComponentTile({ doc, list = false }: { doc: CatalogEntry; list?: boolean }) {
  const [revision, setRevision] = useState(0);
  return <article className="studio-tile" data-component={doc.id}>
    {!list && <><div className="studio-tile-top"><span>{doc.group}</span><IconButton size="sm" variant="ghost" label={`重置 ${doc.name} 预览`} icon={<RotateCcw size={13} />} onClick={() => setRevision((value) => value + 1)} /></div><DeferredDemo key={revision} doc={doc} /></>}
    <a className="studio-tile-link" href={`#/components/${doc.id}`}><div><h3>{doc.name}</h3><p>{doc.description}</p></div><ArrowUpRight size={17} aria-hidden="true" /></a>
  </article>;
}

export function ComponentGallery() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('全部');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const needle = query.trim().toLowerCase();
  const visible = componentDocs.filter((doc) => (group === '全部' || doc.group === group) && `${doc.id} ${doc.name} ${doc.description} ${doc.group}`.toLowerCase().includes(needle));
  return <div className="studio-gallery">
    <div className="studio-gallery-heading docs-page-heading"><span className="studio-kicker">THE COMPONENT COLLECTION</span><h1>组件</h1><p>先体验，再构建。找到适合你的那一块。</p><span className="docs-meta">{componentDocs.length} 个组件入口 · 真实交互 · 同源示例代码</span></div>
    <div className="studio-gallery-controls"><SearchInput label="筛选组件总览" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="搜索组件、交互或使用场景…" /><Select aria-label="组件分类" value={group} onChange={(event) => setGroup(event.target.value)}>{['全部', ...componentGroups].map((name) => <option key={name}>{name}</option>)}</Select><div className="studio-layout-controls" role="group" aria-label="组件展示方式"><IconButton label="网格展示" variant="ghost" size="sm" aria-pressed={layout === 'grid'} icon={<Grid2X2 size={16} />} onClick={() => setLayout('grid')} /><IconButton label="列表展示" variant="ghost" size="sm" aria-pressed={layout === 'list'} icon={<List size={16} />} onClick={() => setLayout('list')} /></div></div>
    <div className="studio-filters" role="group" aria-label="按组件分类筛选">{['全部', ...componentGroups].map((name) => <button type="button" key={name} aria-pressed={group === name} onClick={() => setGroup(name)}>{name}<span>{name === '全部' ? componentDocs.length : componentDocs.filter((doc) => doc.group === name).length}</span></button>)}</div>
    <div className="studio-results"><span role="status">{visible.length} 个组件</span><span>可在卡片内操作，点击名称查看代码与 API</span></div>
    {visible.length ? <div className="studio-catalog-grid" data-layout={layout}>{visible.map((doc) => <ComponentTile key={doc.id} doc={doc} list={layout === 'list'} />)}</div> : <div className="studio-empty"><Shapes size={30} /><h2>还没有找到匹配的组件</h2><p>试试更短的关键词，或换一个分类。</p><Button variant="outline" onClick={() => { setQuery(''); setGroup('全部'); }}>清除筛选</Button></div>}
  </div>;
}
