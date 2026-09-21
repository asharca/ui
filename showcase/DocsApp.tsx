/// <reference types="vite/client" />
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Box, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { IconButton } from '../src/Controls';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '../src/Dialog';
import { Spinner } from '../src/Feedback';
import { componentDocs } from './ComponentDemos';
import { ComponentGallery } from './ComponentGallery';
import { DocsDirectory } from './DocsDirectory';
import { SiteSearch } from './SiteSearch';
import { useDesignSettings } from './design-settings';
import { ExampleGallery, ExamplePage } from './examples/ExamplePage';
import { appExamples } from './examples/registry';
import { ComponentPage } from './ExhibitDetail';
import { Installation } from './Installation';
import './exhibit.css';
const AIPage = lazy(() => import('./AIPage').then((module) => ({ default: module.AIPage })));
const DesignHome = lazy(() => import('./DesignHome').then((module) => ({ default: module.DesignHome })));
const ThemeStudio = lazy(() => import('./ThemeStudio').then((module) => ({ default: module.ThemeStudio })));
const THEME_KEY = 'asharca-ui-docs-theme';

function readTheme() {
  try { const stored = localStorage.getItem(THEME_KEY); if (stored === 'dark' || stored === 'light') return stored === 'dark'; } catch { /* Storage is optional. */ }
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function readRoute() {
  return (window.location.hash || '#/home').replace(/^#\/guide(?=\?|$)/, '#/installation');
}

export function DocsApp() {
  const [route, setRoute] = useState(readRoute);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(readTheme);
  const main = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearch = useRef<HTMLInputElement>(null);
  const [routePath, routeQuery = ''] = route.split('?');
  const previewRoute = routePath.startsWith('#/preview/');
  const design = useDesignSettings(previewRoute ? routeQuery : null);
  const effectiveDark = previewRoute ? new URLSearchParams(routeQuery).get('theme') === 'dark' : dark;
  const id = routePath.startsWith('#/components/') ? routePath.slice('#/components/'.length) : '';
  const doc = componentDocs.find((item) => item.id === id);
  const ai = routePath === '#/ai';
  const overview = routePath === '#/components'; const examples = routePath === '#/examples';
  const example = appExamples.find((item) => routePath === `#/examples/${item.id}` || (item.id === 'workspace' && routePath === '#workbench'));
  const home = ['#/home', '#/', '#'].includes(routePath); const themes = routePath === '#/themes';
  const missing = routePath !== '#/installation' && !doc && !ai && !overview && !examples && !example && !previewRoute && !home && !themes;
  useEffect(() => {
    const onHash = () => {
      const next = readRoute();
      if (window.location.hash && window.location.hash !== next) window.history.replaceState(window.history.state, '', next);
      setRoute(next); setOpen(false); setSearchOpen(false); setSearch('');
    };
    onHash();
    window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { main.current?.scrollTo?.(0, 0); }, [route]);
  useEffect(() => { document.documentElement.classList.toggle('dark', effectiveDark); }, [effectiveDark, routePath]);
  useEffect(() => { if (!previewRoute) { try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch { /* Storage is optional. */ } } }, [dark, previewRoute]);
  useEffect(() => {
    document.title = `${doc?.name ?? example?.name ?? (home ? 'AI 界面设计系统' : themes ? '主题实验室' : ai ? 'AI 文档' : overview ? '组件' : examples ? '示例' : '安装')} — Asharca UI`;
  }, [doc, ai, overview, examples, example, home, themes]);
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !previewRoute) {
        event.preventDefault();
        setOpen(false); setSearchOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', keys); return () => window.removeEventListener('keydown', keys);
  }, [previewRoute]);
  const directory = (mobile: boolean) => <DocsDirectory route={routePath} query={search} onQueryChange={setSearch} inputRef={mobile ? mobileSearch : searchRef} onNavigate={() => setOpen(false)} />;
  if (previewRoute) {
    const preview = componentDocs.find((item) => item.id === routePath.slice('#/preview/'.length));
    return <main data-toolplane-ui="preview" className="docs-standalone-preview" key={routePath}>{preview ? preview.preview : <p role="alert">未找到组件示例。</p>}</main>;
  }
  if (example) return <><ExamplePage key={example.id} example={example} style={design.style} onStyleChange={design.setStyle} dark={dark} onDarkChange={setDark} density={design.density} onDensityChange={design.setDensity} /><SiteSearch open={searchOpen} onOpenChange={setSearchOpen} /></>;
  return <><Dialog open={open} onOpenChange={setOpen}><div className={`docs-site ex-site ${home ? 'is-home' : overview ? 'is-catalog' : ''}`} data-toolplane-ui="docs">
    <a href="#main-content" className="docs-skip-link" onClick={(event) => { event.preventDefault(); main.current?.focus(); }}>跳到正文</a>
    <header className="docs-top ex-header"><a className="ex-brand" href="#/home" aria-label="Asharca UI 首页"><Box size={21} strokeWidth={1.65} /><span>asharca<span className="ex-brand-muted"> / ui</span></span></a>
      <nav aria-label="站点导航"><a href="#/components" aria-current={overview || doc ? 'page' : undefined}>组件</a><a href="#/installation" aria-current={routePath === '#/installation' ? 'page' : undefined}>安装</a><a href="#/ai" aria-current={ai ? 'page' : undefined}>AI 文档</a><a href="#/themes" aria-current={themes ? 'page' : undefined}>主题</a><a href="#/examples" aria-current={examples ? 'page' : undefined}>示例</a></nav>
      <div className="ex-header-actions"><button type="button" className="docs-search-trigger ex-search" aria-label="搜索文档" onClick={() => setSearchOpen(true)}><Search size={15} /><span>搜索</span><kbd>⌘ K</kbd></button><a className="ex-header-install" href="#/installation">开始使用</a><a className="ex-icon" href="https://github.com/asharca/ui" target="_blank" rel="noreferrer" aria-label="GitHub 源码"><FaGithub size={17} /></a><IconButton variant="ghost" label={dark ? '切换浅色主题' : '切换深色主题'} icon={dark ? <Sun size={16} /> : <Moon size={16} />} onClick={() => setDark(!dark)} /><DialogTrigger asChild><IconButton className="docs-mobile-toggle" variant="ghost" label="打开文档导航" icon={<Menu size={18} />} /></DialogTrigger></div>
    </header>
    <div className="docs-body ex-body">{!home && !overview && <aside className="docs-sidebar" aria-label="文档导航">{directory(false)}</aside>}
      <main className="docs-main" id="main-content" ref={main} tabIndex={-1}><div className={`docs-content ex-content ${home || overview ? 'ex-content-gallery' : ''}`}>
        {missing ? <div className="ex-empty"><h1>页面不存在</h1><a href="#/components">返回组件</a></div> : home ? <Suspense fallback={<Spinner label="加载组件" />}><DesignHome /></Suspense> : themes ? <Suspense fallback={<Spinner label="加载主题" />}><ThemeStudio dark={dark} style={design.style} density={design.density} onDarkChange={setDark} onStyleChange={design.setStyle} onDensityChange={design.setDensity} /></Suspense> : ai ? <Suspense fallback={<Spinner label="加载 AI 文档" />}><AIPage /></Suspense> : overview ? <ComponentGallery /> : examples ? <ExampleGallery style={design.style} onStyleChange={design.setStyle} /> : doc ? <ComponentPage key={id} id={id} dark={dark} style={design.style} density={design.density} onStyleChange={design.setStyle} /> : <Installation />}
        <footer className="ex-footer"><a href="#/home" className="ex-brand"><Box size={18} strokeWidth={1.5} />asharca / ui</a><nav aria-label="页脚导航"><a href="#/installation">文档</a><a href="#/themes">主题</a><a href="#/examples">示例</a><a href="#/ai">AI 文档</a></nav><span>为 React 而设计。</span></footer>
      </div></main>
    </div>
  </div><DialogPortal><DialogOverlay className="docs-mobile-overlay" /><DialogContent className="docs-mobile-dialog" aria-describedby={undefined} onOpenAutoFocus={(event) => { event.preventDefault(); mobileSearch.current?.focus(); }}><div className="docs-mobile-heading"><DialogTitle>文档导航</DialogTitle><DialogClose asChild><IconButton label="关闭文档导航" variant="ghost" icon={<X size={18} />} /></DialogClose></div><nav className="docs-mobile-links" aria-label="站点入口"><a href="#/home" onClick={() => setOpen(false)}>首页</a><a href="#/examples" onClick={() => setOpen(false)}>示例</a></nav>{directory(true)}</DialogContent></DialogPortal></Dialog><SiteSearch open={searchOpen} onOpenChange={setSearchOpen} /></>;
}
