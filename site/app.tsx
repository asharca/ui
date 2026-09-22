import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { catalog } from '../registry/catalog.mjs';
import { DocsLayout } from './docs-layout';
import { Header, Footer, Dock, SearchDialog } from './chrome';
import { HomePage, CatalogPage, ComponentPage, InstallationPage, NotFound } from './pages';

export function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const documentationRoute = /^\/(components|docs)(\/|$)/.test(pathname);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((value) => !value);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  useEffect(() => {
    const entry = catalog.find((item) => pathname.replace(/\/$/, '') === `/components/${item.slug}`);
    document.title = `${entry?.name ?? (pathname.startsWith('/docs') ? '安装' : pathname.startsWith('/components') ? '组件' : 'React 组件源码')} — Asharca UI`;
    if (!hash) window.scrollTo(0, 0);
    else {
      const id = hash.slice(1);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    }
    setSearchOpen(false);
  }, [pathname, hash]);
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
