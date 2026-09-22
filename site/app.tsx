import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { catalog } from '../registry/catalog.mjs';
import { DocsLayout } from './docs-layout';
import { Header, Footer, Dock, SearchDialog } from './chrome';
import { HomePage, CatalogPage, ComponentPage, InstallationPage, NotFound } from './pages';

const WorkspaceWindow = lazy(() => import('../examples/workspace-shell'));

export function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname, hash, search } = useLocation();
  // The window uses an existing static route, so refreshing works on Pages too.
  // The example validates its session-scoped token; no source, title or draft is read from this URL.
  const detachedWorkspace = new URLSearchParams(search).has('__workspaceWindow');
  const documentationRoute = /^\/(components|docs)(\/|$)/.test(pathname);
  useEffect(() => {
    if (detachedWorkspace) return;
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setSearchOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [detachedWorkspace]);
  useEffect(() => {
    if (detachedWorkspace) return;
    const entry = catalog.find((item) => pathname.replace(/\/$/, '') === `/components/${item.slug}`);
    document.title = `${entry?.name ?? (pathname.startsWith('/docs') ? '安装' : pathname.startsWith('/components') ? '组件' : 'React 组件源码')} — Asharca UI`;
    if (!hash) window.scrollTo(0, 0);
    else requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
    setSearchOpen(false);
  }, [pathname, hash, detachedWorkspace]);
  if (detachedWorkspace) return <Suspense fallback={<main className="p-6" role="status">正在恢复标签页面…</main>}><WorkspaceWindow /></Suspense>;
  return <>
    <a className="skip-link" href="#main-content">跳到正文</a>
    <Header onSearch={() => setSearchOpen(true)} />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<DocsLayout />}>
        <Route path="/components" element={<CatalogPage />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
        <Route path="/docs/installation" element={<InstallationPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    {!documentationRoute && <Footer />}
    <Dock />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
  </>;
}
