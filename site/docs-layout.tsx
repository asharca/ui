import { useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { catalog } from '../registry/catalog.mjs';
import updateTemplate from '../docs/updating.md?raw';
import { splitUpdateGuide } from '../scripts/update-guide.mjs';
import { Sidebar } from './chrome';

const updateToc = splitUpdateGuide(updateTemplate).sections.map((section) => ({ id: section.id, label: section.title.replace(/^\d+\.\s*/, '') }));

/** Fixed independent rail, matching beUI's three-column-layout.tsx (MIT).
 * The document remains the only main-content scroller. No wheel forwarding.
 */
export function DocsLayout() {
  const { pathname } = useLocation();
  const rail = useRef<HTMLDivElement>(null);
  const normalized = pathname.replace(/\/$/, '');
  const entry = catalog.find((component) => normalized === `/components/${component.slug}`);
  const toc = entry ? [
    { id: 'preview', label: '预览与源码' }, { id: 'installation', label: '安装' },
    { id: 'api-reference', label: 'API Reference' }, { id: 'notes', label: '使用约定' },
  ] : normalized === '/docs/installation' ? [
    { id: 'requirements', label: '准备项目' }, { id: 'add', label: '添加组件' },
    { id: 'use', label: '本地导入' }, { id: 'namespace', label: '命名空间' },
    { id: 'updating', label: '安装后的更新' },
  ] : normalized === '/docs/updating' ? updateToc : [];
  useLayoutEffect(() => {
    const container = rail.current;
    const active = container?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!container || !active) return;
    const bounds = container.getBoundingClientRect();
    const target = active.getBoundingClientRect();
    // Reveal a destination on navigation, not while the reader scrolls content.
    // scrollIntoView would also move the document; adjust this rail only.
    if (target.top < bounds.top + 16) container.scrollTop -= bounds.top + 16 - target.top;
    else if (target.bottom > bounds.bottom - 24) container.scrollTop += target.bottom - bounds.bottom + 24;
  }, [pathname]);
  return <div className={`docs-layout${toc.length ? ' with-toc' : ''}`}>
    <aside className="docs-sidebar" aria-label="文档侧栏"><div className="docs-sidebar-scroll" ref={rail} tabIndex={0} aria-label="滚动组件导航"><Sidebar /></div></aside>
    <main id="main-content" tabIndex={-1} className="docs-main"><Outlet /></main>
    {toc.length > 0 && <aside className="docs-toc" aria-label="本页目录"><span>本页内容</span>{toc.map((section) => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}</aside>}
  </div>;
}
