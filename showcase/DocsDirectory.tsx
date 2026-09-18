import { useEffect, useId, useRef, useState, type Ref } from 'react';
import { ChevronDown, Layers3, Palette, Rocket, Sparkles } from 'lucide-react';
import { SearchInput } from '../src/Controls';
import { catalogMetadata } from './catalog-data';
import { componentGroups } from './component-metadata';
import { scrollWithin } from './docs-scroll';

export function DocsDirectory({ route, query, onQueryChange, inputRef, onNavigate }: {
  route: string; query: string; onQueryChange: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>; onNavigate: () => void;
}) {
  const instance = useId();
  const root = useRef<HTMLDivElement>(null);
  const active = catalogMetadata.find((item) => route === `#/components/${item.id}`);
  const activeGroup = active?.group;
  const [collapsed, setCollapsed] = useState<string[]>(() => componentGroups.filter((group) => group !== (activeGroup ?? componentGroups[0])));
  useEffect(() => {
    if (activeGroup) setCollapsed((groups) => groups.filter((group) => group !== activeGroup));
  }, [activeGroup, route]);
  useEffect(() => {
    const pane = root.current?.closest<HTMLElement>('.docs-sidebar, .docs-mobile-dialog') ?? null;
    const item = root.current?.querySelector<HTMLElement>('[aria-current="page"]') ?? null;
    scrollWithin(pane, item, 'nearest');
  }, [route, collapsed]);
  const filtered = catalogMetadata.filter((item) => `${item.name} ${item.description} ${item.group}`.toLowerCase().includes(query.trim().toLowerCase()));
  const starts = [
    { href: '#/installation', icon: Rocket, name: '安装与快速开始' },
    { href: '#/components', icon: Layers3, name: '组件总览' },
    { href: '#/themes', icon: Palette, name: '主题与定制' },
    { href: '#/ai', icon: Sparkles, name: 'AI 接入文档' },
  ];
  return <div className="docs-directory" ref={root}>
    <SearchInput ref={inputRef} label="搜索组件文档" placeholder="筛选组件…" clearLabel="清空搜索" value={query} onChange={(event) => onQueryChange(event.target.value)} onClear={() => onQueryChange('')} />
    <h2>开始使用</h2><div className="docs-start-nav">{starts.map(({ href, icon: Icon, name }) => <a key={href} href={href} onClick={onNavigate} aria-current={route === href ? 'page' : undefined}><Icon size={15} aria-hidden="true" />{name}</a>)}</div>
    <nav aria-label="组件目录">{componentGroups.map((group, index) => {
      const entries = filtered.filter((item) => item.group === group);
      const expanded = query.trim() !== '' || !collapsed.includes(group);
      return entries.length ? <div className="docs-nav-group" key={group}><h2><button type="button" aria-expanded={expanded} aria-controls={`nav-${instance}-${index}`} onClick={() => setCollapsed((groups) => groups.includes(group) ? groups.filter((item) => item !== group) : [...groups, group])}><span>{group}<small>{entries.length}</small></span><ChevronDown size={13} /></button></h2><div className="docs-nav-children" id={`nav-${instance}-${index}`} hidden={!expanded}>{entries.map((item) => <a key={item.id} href={`#/components/${item.id}`} onClick={onNavigate} aria-current={active?.id === item.id ? 'page' : undefined}>{item.name}</a>)}</div></div> : null;
    })}</nav>{!filtered.length && <p className="docs-search-empty" role="status">没有匹配的组件。试试名称或用途。</p>}
  </div>;
}
