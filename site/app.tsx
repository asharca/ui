import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, ChevronRight, Code2, Home as HomeIcon, Layers, Menu, Moon, Search, SlidersHorizontal, Sun, X } from 'lucide-react';
import { Github } from './icons';
import { Dialog as PrimitiveDialog } from 'radix-ui';
import { catalog, groups } from '../registry/catalog.mjs';
import { Dialog, DialogContent } from '../registry/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../registry/ui/popover';
import { RadioGroup } from '../registry/ui/radio-group';
import { Tooltip } from '../registry/ui/tooltip';
import { CodeBlock } from './code';
import { ExampleSection, Preview } from './preview';
import { Installation, InstallCommand } from './registry';
import { publicPath, registryUrl, runners, usePreferences, type Theme } from './preferences';

const repository = 'https://github.com/asharca/ui';
type CatalogEntry = (typeof catalog)[number];
function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return <nav className="side-nav" aria-label="组件导航">
    <div className="side-group"><span className="side-heading">开始使用</span><NavLink to="/" end onClick={onNavigate}><HomeIcon size={14} />首页</NavLink><NavLink to="/docs/installation" onClick={onNavigate}><BookOpen size={14} />安装</NavLink></div>
    {groups.map((group) => <div className="side-group" key={group}><span className="side-heading">{group}<span>{catalog.filter((entry) => entry.group === group).length}</span></span>{catalog.filter((entry) => entry.group === group).map((entry) => <NavLink key={entry.slug} to={`/components/${entry.slug}`} onClick={onNavigate}>{entry.name}</NavLink>)}</div>)}
    <a className="side-llms" href={publicPath('llms.txt')} onClick={onNavigate}><Code2 size={14} />llms.txt<ArrowUpRight size={12} /></a>
  </nav>;
}
function Header({ onSearch }: { onSearch: () => void }) {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = usePreferences();
  const { pathname, search } = useLocation();
  const current = catalog.find((entry) => pathname.replace(/\/$/, '') === `/components/${entry.slug}`);
  const ai = current?.group === 'AI 组件' || new URLSearchParams(search).get('group') === 'AI 组件';
  useEffect(() => { const update = () => setScrolled(window.scrollY > 8); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update); }, []);
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}><div className="header-inner">
    <div className="header-left"><PrimitiveDialog.Root open={mobile} onOpenChange={setMobile}>
      <PrimitiveDialog.Trigger asChild><button type="button" className="icon-button mobile-toggle" aria-label="打开导航"><Menu size={19} /></button></PrimitiveDialog.Trigger>
      <PrimitiveDialog.Portal><PrimitiveDialog.Overlay className="nav-overlay" /><PrimitiveDialog.Content className="nav-sheet" aria-describedby={undefined}>
        <div className="nav-sheet-heading"><PrimitiveDialog.Title>导航</PrimitiveDialog.Title><PrimitiveDialog.Close asChild><button type="button" className="icon-button" aria-label="关闭导航"><X size={18} /></button></PrimitiveDialog.Close></div>
        <Sidebar onNavigate={() => setMobile(false)} />
      </PrimitiveDialog.Content></PrimitiveDialog.Portal>
    </PrimitiveDialog.Root>
      <Link to="/" className="brand" aria-label="Asharca UI 首页"><img src={publicPath('mark.svg')} width="25" height="25" alt="" /><span>asharca<span className="brand-slash">/</span>ui</span></Link>
      <nav className="top-nav" aria-label="主导航"><Link to="/components" className={pathname.startsWith('/components') && !ai ? 'active' : ''}>组件</Link><Link to={`/components?group=${encodeURIComponent('AI 组件')}`} className={ai ? 'active' : ''}>AI 组件</Link><NavLink to="/docs/installation">文档</NavLink></nav>
    </div>
    <div className="header-actions"><button type="button" className="search-trigger" onClick={onSearch} aria-label="搜索组件与文档"><Search size={15} /><span>搜索组件…</span><kbd>⌘ K</kbd></button>
      <Popover><PopoverTrigger asChild><button type="button" className="icon-button" aria-label="外观设置"><SlidersHorizontal size={17} /></button></PopoverTrigger><PopoverContent align="end"><RadioGroup label="外观" name="site-theme" value={theme} onValueChange={(next) => setTheme(next as Theme)} options={[{ value: 'system', label: '跟随系统' }, { value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }]} /></PopoverContent></Popover>
      <a href={repository} target="_blank" rel="noreferrer" className="icon-button" aria-label="GitHub 仓库"><Github size={18} /></a>
    </div>
  </div></header>;
}
function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const id = useId();
  const navigate = useNavigate();
  const entries = [...catalog.map((entry) => ({ ...entry, href: `/components/${entry.slug}` })), { slug: 'installation', name: '安装与开始使用', group: '文档', description: 'shadcn CLI、手动安装与项目配置', href: '/docs/installation' }];
  const results = entries.filter((entry) => `${entry.name} ${entry.group} ${entry.description}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8);
  useEffect(() => { if (open) { setQuery(''); setActive(0); } }, [open]);
  function choose(href: string) { onOpenChange(false); navigate(href); }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent title="搜索" description="查找组件或安装说明。" className="site-search-dialog" onOpenAutoFocus={(event) => { event.preventDefault(); returnFocus.current = document.activeElement as HTMLElement | null; input.current?.focus(); }} onCloseAutoFocus={(event) => { event.preventDefault(); if (returnFocus.current?.isConnected) returnFocus.current.focus(); }}>
    <label className="sr-only" htmlFor={`${id}-input`}>搜索组件或文档</label><div className="search-input-wrap"><Search size={17} /><input id={`${id}-input`} ref={input} role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls={`${id}-results`} aria-activedescendant={results[active] ? `${id}-${active}` : undefined} value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder="输入组件名称…"
      onKeyDown={(event) => { if (!results.length) return; if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setActive((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length); } else if (event.key === 'Enter') { event.preventDefault(); if (results[active]) choose(results[active].href); } }} /></div>
    <ul id={`${id}-results`} role="listbox" aria-label="搜索结果" className="search-results">{results.map((entry, index) => <li id={`${id}-${index}`} key={entry.slug} role="option" aria-selected={active === index}><button type="button" tabIndex={-1} onMouseEnter={() => setActive(index)} onClick={() => choose(entry.href)}><span>{entry.name}<small>{entry.group}</small></span><ArrowRight size={15} /></button></li>)}</ul>
    {!results.length && <p role="status" className="empty-search">没有找到相关组件。</p>}<p className="search-hint">↑ ↓ 选择 <span>Enter 打开 · Esc 关闭</span></p>
  </DialogContent></Dialog>;
}
function Dock() {
  const { dark, setTheme } = usePreferences();
  return <div className="dock-position"><nav className="site-dock" aria-label="快捷导航">
    <Tooltip content="首页"><NavLink end to="/" aria-label="首页"><HomeIcon size={18} /></NavLink></Tooltip>
    <Tooltip content="组件"><NavLink to="/components" aria-label="组件"><Layers size={18} /></NavLink></Tooltip>
    <span className="dock-divider" />
    <Tooltip content="GitHub"><a href={repository} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a></Tooltip>
    <Tooltip content={dark ? '浅色模式' : '深色模式'}><button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? '切换浅色模式' : '切换深色模式'}>{dark ? <Sun size={18} /> : <Moon size={18} /></button></Tooltip>
  </nav></div>;
}
function Footer() { return <footer className="site-footer"><span>asharca/ui <small>MIT License</small></span><nav aria-label="页脚导航"><Link to="/docs/installation">安装</Link><a href={repository} target="_blank" rel="noreferrer">GitHub</a><a href={publicPath('llms.txt')}>llms.txt</a></nav></footer>; }
function ComponentCard({ entry }: { entry: CatalogEntry }) {
  return <article className="component-card"><div className="card-preview"><Preview name={entry.examples[0]} /></div><div className="card-caption"><div><Link to={`/components/${entry.slug}`}>{entry.name}</Link><p>{entry.description}</p></div><Link className="card-arrow" to={`/components/${entry.slug}`} aria-label={`查看 ${entry.name}`}><ArrowUpRight size={17} /></Link></div></article>;
}
function HomePage() {
  const featured = ['button', 'tabs', 'switch', 'input', 'checkbox', 'radio-group', 'prompt-input', 'tool-result'];
  return <main id="main-content" tabIndex={-1} className="home-page"><section className="hero"><span className="hero-eyebrow"><span />{catalog.length} 个组件 · 开放源码</span><h1>简约的组件。<br />属于你的源码。</h1><p>为 React 与 AI 界面而写。<br className="mobile-break" />预览、安装，直接在项目中修改。</p><div className="hero-actions"><Link to="/components" className="site-cta">浏览组件<ArrowRight size={15} /></Link><Link to="/docs/installation" className="site-cta secondary">开始使用</Link></div></section>
    <section className="home-install" aria-label="安装组件"><p>React · Tailwind CSS · Motion</p><InstallCommand /><Link to="/docs/installation" className="installation-hint">首次使用？先配置项目 <ArrowUpRight size={12} /></Link></section>
    <section className="home-components"><div className="section-heading"><div><span className="eyebrow">COMPONENTS</span><h2>从一个组件开始。</h2></div><Link to="/components">查看全部组件<ArrowRight size={15} /></Link></div><div className="component-grid">{featured.map((slug) => <ComponentCard key={slug} entry={catalog.find((entry) => entry.slug === slug)!} />)}</div></section>
  </main>;
}
function DocsLayout({ children, toc }: { children: ReactNode; toc?: { id: string; label: string }[] }) {
  return <div className={`docs-layout${toc ? ' with-toc' : ''}`}><aside className="docs-sidebar"><Sidebar /></aside><main id="main-content" tabIndex={-1} className="docs-main">{children}</main>{toc && <aside className="docs-toc" aria-label="本页目录"><span>本页内容</span>{toc.map((section) => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</aside>}</div>;
}
function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const group = params.get('group') || '全部';
  const query = params.get('q') || '';
  const visible = catalog.filter((entry) => (group === '全部' || entry.group === group) && `${entry.name} ${entry.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  function change(key: string, value: string) { const next = new URLSearchParams(params); if (value && value !== '全部') next.set(key, value); else next.delete(key); setParams(next, { replace: true }); }
  return <DocsLayout><div className="page-heading"><span className="eyebrow">COLLECTION</span><h1>{group === 'AI 组件' ? 'AI 组件' : '组件'}</h1><p>按需安装，让源码成为项目的一部分。</p></div>
    <div className="catalog-toolbar"><div className="category-tabs" role="group" aria-label="组件分类">{['全部', ...groups].map((name) => <button type="button" key={name} aria-pressed={group === name} onClick={() => change('group', name)}>{name}</button>)}</div><label className="catalog-search"><Search size={14} /><span className="sr-only">筛选组件</span><input value={query} onChange={(event) => change('q', event.target.value)} placeholder="筛选组件…" /></label></div>
    <p className="catalog-count" aria-live="polite">{visible.length} 个组件</p><div className="component-grid">{visible.map((entry) => <ComponentCard key={entry.slug} entry={entry} />)}</div>
    {!visible.length && <div className="empty-state"><h2>没有找到组件</h2><button type="button" className="text-button" onClick={() => setParams({})}>清除筛选</button></div>}
  </DocsLayout>;
}
function ComponentPage() {
  const { slug } = useParams();
  const entry = catalog.find((item) => item.slug === slug);
  if (!entry) return <NotFound />;
  const index = catalog.indexOf(entry);
  return <DocsLayout toc={[{ id: 'preview', label: '预览与源码' }, { id: 'installation', label: '安装' }, { id: 'notes', label: '使用约定' }]}>
    <div className="breadcrumb"><Link to="/components">组件</Link><ChevronRight size={12} /><span>{entry.group}</span></div>
    <div className="page-heading component-heading"><div><h1>{entry.name}</h1><p>{entry.description}</p></div><a className="registry-link" href={registryUrl(entry.slug)} aria-label="查看组件安装清单"><Code2 size={15} />JSON</a></div>
    <div id="preview">{entry.examples.map((name, index) => <ExampleSection key={name} slug={entry.slug} name={name} title={index === 0 ? '预览' : '状态与反馈'} />)}</div>
    <section id="installation" className="doc-section"><h2>安装</h2><Installation slug={entry.slug} /><p className="small-note">已有 shadcn 项目可以直接添加。首次使用请先完成<Link to="/docs/installation">项目配置</Link>。</p></section>
    <section id="notes" className="doc-section"><h2>使用约定</h2><p className="reading-note">预览和安装清单使用同一份源码。Usage 是上方演示的完整代码；公共属性类型可在 Code 中直接查看。导入路径根据你的项目配置调整。</p>{entry.group === 'AI 组件' && <p className="reading-note">这里只提供界面与交互。模型调用、权限校验、持久化和流式状态由应用提供；演示不会连接外部模型。</p>}</section>
    <nav className="page-pagination" aria-label="相邻组件">{index > 0 ? <Link to={`/components/${catalog[index - 1].slug}`}>← {catalog[index - 1].name}</Link> : <span />}{index < catalog.length - 1 && <Link to={`/components/${catalog[index + 1].slug}`}>{catalog[index + 1].name} →</Link>}</nav>
  </DocsLayout>;
}
function InstallationPage() {
  const { manager } = usePreferences();
  const pattern = `${new URL(publicPath('r/'), window.location.origin).href}{name}.json`;
  return <DocsLayout toc={[{ id: 'requirements', label: '准备项目' }, { id: 'add', label: '添加组件' }, { id: 'use', label: '本地导入' }, { id: 'namespace', label: '命名空间' }]}>
    <div className="page-heading"><span className="eyebrow">GET STARTED</span><h1>把组件带进项目。</h1><p>使用 shadcn 安装源码。不发布独立组件包。</p></div>
    <section id="requirements" className="doc-section"><h2>1. 准备项目</h2><p className="reading-note">需要 React 19、TypeScript 和 Tailwind CSS 4。已有 components.json 的项目可以跳过初始化。</p><CodeBlock language="bash" label="在项目目录执行" code={`${runners[manager]} init`} /><p className="small-note">初始化由官方 shadcn CLI 完成。组件沿用项目的主题变量，不覆盖已有配色。</p></section>
    <section id="add" className="doc-section"><h2>2. 添加组件</h2><InstallCommand /><p className="reading-note">命令会添加完整的源码文件与所需依赖。默认写入 components/asharca；有 src 目录或自定义别名时，按 components.json 解析。</p></section>
    <section id="use" className="doc-section"><h2>3. 从本地导入</h2><CodeBlock label="App.tsx" code={'import { Button } from "@/components/asharca/button";\n\nexport default function App() {\n  return <Button>开始使用</Button>;\n}'} /><p className="small-note">这里的 @/ 是示例别名。组件之间使用相对导入，可以随项目的组件目录一起移动。</p></section>
    <section id="namespace" className="doc-section"><h2>可选：配置简写命令</h2><p className="reading-note">把 registries 字段合并到现有 components.json 中，不要替换其他配置。</p><CodeBlock language="json" label="components.json · 合并字段" code={JSON.stringify({ registries: { '@asharca': pattern } }, null, 2)} /><CodeBlock language="bash" label="配置后使用" code={`${runners[manager]} add @asharca/button`} /><p className="small-note">@asharca 是配置在项目中的安装源别名，不是另一个包，也不假设它已加入官方公共命名空间。</p></section>
    <section className="doc-section"><h2>手动安装与更新</h2><p className="reading-note">每个组件页面的 Manual 标签列出全部依赖和源码文件。无论哪种安装方式，拿到的都是相同源码。更新前先检查差异，不要直接覆盖自己修改过的文件。</p><Link className="text-link" to="/components">浏览组件 <ArrowRight size={15} /></Link></section>
  </DocsLayout>;
}
function NotFound() { return <main id="main-content" tabIndex={-1} className="not-found"><span className="eyebrow">404</span><h1>这里还没有内容。</h1><Link to="/components" className="site-cta">浏览组件 <ArrowRight size={15} /></Link></main>; }
export function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    const key = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen((value) => !value); } };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    const entry = catalog.find((item) => pathname.replace(/\/$/, '') === `/components/${item.slug}`);
    document.title = `${entry?.name ?? (pathname.startsWith('/docs') ? '安装' : pathname.startsWith('/components') ? '组件' : 'React 组件源码')} — Asharca UI`;
    if (!window.location.hash) window.scrollTo(0, 0);
    setSearchOpen(false);
  }, [pathname]);
  return <><a className="skip-link" href="#main-content">跳到正文</a><Header onSearch={() => setSearchOpen(true)} /><Routes><Route path="/" element={<HomePage />} /><Route path="/components" element={<CatalogPage />} /><Route path="/components/:slug" element={<ComponentPage />} /><Route path="/docs/installation" element={<InstallationPage />} /><Route path="*" element={<NotFound />} /></Routes><Footer /><Dock /><SearchDialog open={searchOpen} onOpenChange={setSearchOpen} /></>;
}
