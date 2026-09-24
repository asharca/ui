import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Code2, Home, Layers, Menu, Moon, RefreshCw, Search, SlidersHorizontal, Sun, X } from 'lucide-react';
import { Dialog as PrimitiveDialog } from 'radix-ui';
import { catalog, groups } from '../registry/catalog.mjs';
import { Dialog, DialogContent } from '../registry/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../registry/ui/popover';
import { RadioGroup } from '../registry/ui/radio-group';
import { Tooltip } from '../registry/ui/tooltip';
import { Github } from './icons';
import { motion, useReducedMotion } from 'motion/react';
import { layoutSpring } from '../registry/ui/utils';
import './sidebar-motion.css';
import { publicPath, usePreferences, type Theme } from './preferences';

export const repository = 'https://github.com/asharca/ui';
function SidebarItem({ to, children, layoutId, onNavigate }: { to: string; children: ReactNode; layoutId: string; onNavigate?: () => void }) {
  const reduce = useReducedMotion();
  return <NavLink to={to} end={to === '/'} onClick={onNavigate} data-slot="docs-sidebar-item">
    {({ isActive }) => <>
      {isActive && <motion.span aria-hidden="true" data-slot="docs-sidebar-selection" initial={false}
        layoutId={reduce ? undefined : layoutId} transition={reduce ? { duration: 0 } : layoutSpring}
        className="sidebar-selection" style={{ borderRadius: 7 }} />}
      <span className="sidebar-link-label">{children}</span>
    </>}
  </NavLink>;
}
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const selectionId = useId();
  return <motion.nav layoutRoot className="side-nav" aria-label="组件导航">
    <div className="side-group">
      <span className="side-heading">开始使用</span>
      <SidebarItem layoutId={selectionId} to="/" onNavigate={onNavigate}><Home size={14} />首页</SidebarItem>
      <SidebarItem layoutId={selectionId} to="/docs/installation" onNavigate={onNavigate}><BookOpen size={14} />安装</SidebarItem>
      <SidebarItem layoutId={selectionId} to="/docs/updating" onNavigate={onNavigate}><RefreshCw size={14} />更新组件</SidebarItem>
    </div>
    {groups.map((group) => <div className="side-group" key={group}>
      <span className="side-heading">{group}<span>{catalog.filter((entry) => entry.group === group).length}</span></span>
      {catalog.filter((entry) => entry.group === group).map((entry) => <SidebarItem layoutId={selectionId} key={entry.slug} to={`/components/${entry.slug}`} onNavigate={onNavigate}>{entry.name}</SidebarItem>)}
    </div>)}
    <a className="side-llms" href={publicPath('llms.txt')} onClick={onNavigate}><Code2 size={14} />llms.txt<ArrowUpRight size={12} /></a>
  </motion.nav>;
}
export function Header({ onSearch }: { onSearch: () => void }) {
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = usePreferences();
  const { pathname, search } = useLocation();
  const current = catalog.find((entry) => pathname.replace(/\/$/, '') === `/components/${entry.slug}`);
  const ai = current?.group === 'AI 组件' || new URLSearchParams(search).get('group') === 'AI 组件';
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
    <div className="header-inner">
      <div className="header-left">
        <PrimitiveDialog.Root open={mobile} onOpenChange={setMobile}>
          <PrimitiveDialog.Trigger asChild><button type="button" className="icon-button mobile-toggle" aria-label="打开导航"><Menu size={19} /></button></PrimitiveDialog.Trigger>
          <PrimitiveDialog.Portal>
            <PrimitiveDialog.Overlay className="nav-overlay" />
            <PrimitiveDialog.Content className="nav-sheet" aria-describedby={undefined}>
              <div className="nav-sheet-heading"><PrimitiveDialog.Title>导航</PrimitiveDialog.Title><PrimitiveDialog.Close asChild><button type="button" className="icon-button" aria-label="关闭导航"><X size={18} /></button></PrimitiveDialog.Close></div>
              <Sidebar onNavigate={() => setMobile(false)} />
            </PrimitiveDialog.Content>
          </PrimitiveDialog.Portal>
        </PrimitiveDialog.Root>
        <Link to="/" className="brand" aria-label="Asharca UI 首页"><img src={publicPath('mark.svg')} width="25" height="25" alt="" /><span>asharca<span className="brand-slash">/</span>ui</span></Link>
        <nav className="top-nav" aria-label="主导航">
          <Link to="/components" className={pathname.startsWith('/components') && !ai ? 'active' : ''}>组件</Link>
          <Link to={`/components?group=${encodeURIComponent('AI 组件')}`} className={ai ? 'active' : ''}>AI 组件</Link>
          <Link to="/docs/installation" className={pathname.startsWith('/docs/') ? 'active' : ''}>文档</Link>
        </nav>
      </div>
      <div className="header-actions">
        <button type="button" className="search-trigger" onClick={onSearch} aria-label="搜索组件与文档"><Search size={15} /><span>搜索组件…</span><kbd>⌘ K</kbd></button>
        <Popover>
          <PopoverTrigger asChild><button type="button" className="icon-button" aria-label="外观设置"><SlidersHorizontal size={17} /></button></PopoverTrigger>
          <PopoverContent align="end"><RadioGroup label="外观" name="site-theme" value={theme} onValueChange={(next) => setTheme(next as Theme)} options={[{ value: 'system', label: '跟随系统' }, { value: 'light', label: '浅色' }, { value: 'dark', label: '深色' }]} /></PopoverContent>
        </Popover>
        <a href={repository} target="_blank" rel="noreferrer" className="icon-button" aria-label="GitHub 仓库"><Github size={18} /></a>
      </div>
    </div>
  </header>;
}
export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const id = useId();
  const navigate = useNavigate();
  const entries = [...catalog.map((entry) => ({ ...entry, href: `/components/${entry.slug}` })), { slug: 'installation', name: '安装与开始使用', group: '文档', description: 'shadcn CLI、手动安装与项目配置', href: '/docs/installation' }, { slug: 'updating', name: '更新组件', group: '文档', description: '更新 升级 定制 差异 合并 验证 回退 update upgrade dry-run diff', href: '/docs/updating' }];
  const results = entries.filter((entry) => `${entry.name} ${entry.group} ${entry.description}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 8);
  useEffect(() => { if (open) { setQuery(''); setActive(0); } }, [open]);
  function choose(href: string) { onOpenChange(false); navigate(href); }
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent title="搜索" description="查找组件、安装或更新说明。" className="site-search-dialog"
      onOpenAutoFocus={(event) => { event.preventDefault(); returnFocus.current = document.activeElement as HTMLElement | null; input.current?.focus(); }}
      onCloseAutoFocus={(event) => { event.preventDefault(); if (returnFocus.current?.isConnected) returnFocus.current.focus(); }}>
      <label className="sr-only" htmlFor={`${id}-input`}>搜索组件或文档</label>
      <div className="search-input-wrap"><Search size={17} />
        <input id={`${id}-input`} ref={input} role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls={`${id}-results`} aria-activedescendant={results[active] ? `${id}-${active}` : undefined} value={query}
          onChange={(event) => { setQuery(event.target.value); setActive(0); }} placeholder="输入组件名称…"
          onKeyDown={(event) => {
            if (!results.length) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setActive((index) => (index + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
            } else if (event.key === 'Enter') {
              event.preventDefault();
              if (results[active]) choose(results[active].href);
            }
          }} />
      </div>
      <ul id={`${id}-results`} role="listbox" aria-label="搜索结果" className="search-results">
        {results.map((entry, index) => <li id={`${id}-${index}`} key={entry.slug} role="option" aria-selected={active === index}>
          <button type="button" tabIndex={-1} onMouseEnter={() => setActive(index)} onClick={() => choose(entry.href)}><span>{entry.name}<small>{entry.group}</small></span><ArrowRight size={15} /></button>
        </li>)}
      </ul>
      {!results.length && <p role="status" className="empty-search">没有找到相关组件。</p>}
      <p className="search-hint">↑ ↓ 选择 <span>Enter 打开 · Esc 关闭</span></p>
    </DialogContent>
  </Dialog>;
}
export function Dock() {
  const { dark, setTheme } = usePreferences();
  return <div className="dock-position"><nav className="site-dock" aria-label="快捷导航">
    <Tooltip content="首页"><NavLink end to="/" aria-label="首页"><Home size={18} /></NavLink></Tooltip>
    <Tooltip content="组件"><NavLink to="/components" aria-label="组件"><Layers size={18} /></NavLink></Tooltip>
    <span className="dock-divider" />
    <Tooltip content="GitHub"><a href={repository} target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={18} /></a></Tooltip>
    <Tooltip content={dark ? '浅色模式' : '深色模式'}><button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={dark ? '切换浅色模式' : '切换深色模式'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button></Tooltip>
  </nav></div>;
}
export function Footer() {
  return <footer className="site-footer"><span>asharca/ui <small>MIT License</small></span><nav aria-label="页脚导航"><Link to="/docs/installation">安装</Link><Link to="/docs/updating">更新组件</Link><a href={repository} target="_blank" rel="noreferrer">GitHub</a><a href={publicPath('llms.txt')}>llms.txt</a></nav></footer>;
}
