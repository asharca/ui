/// <reference types="vite/client" />
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Box, ChevronRight, Code2, ExternalLink, FileText, Menu, Moon, RotateCcw, Search, Sun, X } from 'lucide-react';
import { Button, IconButton, SearchInput, Select } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/Navigation';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '../src/Dialog';
import { Spinner } from '../src/Feedback';
import { componentDocs } from './ComponentDemos';
import { componentGroups } from './component-metadata';
import { componentMarkdown, publicExample } from './component-markdown';
import { DocCode } from './DocCode';
import { DocsDirectory } from './DocsDirectory';
import { scrollWithin } from './docs-scroll';
import { SiteSearch } from './SiteSearch';
import { DesignControls } from './DesignControls';
import { previewHref, useDesignSettings, type DesignStyle, type DesignDensity } from './design-settings';
import { ExampleGallery, ExamplePage } from './examples/ExamplePage';
import { appExamples } from './examples/registry';
import { version } from '../package.json';
import './docs.css';
import './ui-polish.css';

const sources = import.meta.glob<string>('../src/*.{tsx,ts,css}', { query: '?raw', import: 'default' });
const demos = import.meta.glob<string>('./demos/*.tsx', { query: '?raw', import: 'default' });
const AIPage = lazy(() => import('./AIPage').then((module) => ({ default: module.AIPage })));
const DesignHome = lazy(() => import('./DesignHome').then((module) => ({ default: module.DesignHome })));
const ThemeStudio = lazy(() => import('./ThemeStudio').then((module) => ({ default: module.ThemeStudio })));
const THEME_KEY = 'asharca-ui-docs-theme';

function ComponentPage({ id, dark, style, density, onStyleChange }: { id: string; dark: boolean; style: DesignStyle; density: DesignDensity; onStyleChange: (style: DesignStyle) => void }) {
  const doc = componentDocs.find((item) => item.id === id)!;
  const [view, setView] = useState('preview');
  const [viewport, setViewport] = useState('inline');
  const [reset, setReset] = useState(0);
  const [sourceFile, setSourceFile] = useState(doc.file);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [source, setSource] = useState('');
  const [sourceError, setSourceError] = useState(false);
  const [demoSource, setDemoSource] = useState('');
  const [demoError, setDemoError] = useState(false);
  const standalone = previewHref(id, dark, style, density);
  useEffect(() => {
    if (!sourceOpen) return;
    let active = true; setSource(''); setSourceError(false);
    Promise.resolve().then(() => {
      const load = sources[`../src/${sourceFile}`];
      if (!load) throw new Error('Unknown source');
      return load();
    }).then((text) => { if (active) setSource(text); }).catch(() => { if (active) setSourceError(true); });
    return () => { active = false; };
  }, [sourceOpen, sourceFile]);
  useEffect(() => {
    let active = true; setDemoSource(''); setDemoError(false);
    Promise.resolve().then(() => {
      const load = demos[`./demos/${doc.demoFile}`];
      if (!load) throw new Error('Unknown demo');
      return load();
    }).then((text) => { if (active) setDemoSource(publicExample(text)); })
      .catch(() => { if (active) setDemoError(true); });
    return () => { active = false; };
  }, [doc.demoFile]);
  const index = componentDocs.indexOf(doc);
  return <>
    <div className="docs-heading-row">
      <div className="docs-page-heading"><span className="docs-eyebrow"><a href="#/components">组件</a><ChevronRight size={12} />{doc.group}</span><h1>{doc.name}</h1><p>{doc.description}</p></div>
      <div className="docs-page-actions">
        {demoSource ? <CopyButton text={componentMarkdown(doc, demoSource, version)} label="复制给 AI" copiedLabel="已复制 Markdown" failedLabel="复制失败" /> : <Button disabled size="sm">{demoError ? '文档加载失败' : '正在准备文档…'}</Button>}
        <a className="docs-icon-link" href={`${import.meta.env.BASE_URL}ai/components/${id}.md`} aria-label="查看组件 Markdown" title="查看组件 Markdown"><FileText size={16} /></a>
      </div>
    </div>
    <section id="preview"><Tabs value={view} onValueChange={setView} className="docs-component-tabs">
      <div className="docs-preview-toolbar"><TabsList data-variant="underline" aria-label="组件示例视图"><TabsTrigger value="preview">预览</TabsTrigger><TabsTrigger value="code">用法代码</TabsTrigger></TabsList>
        <div className="docs-preview-actions" hidden={view !== 'preview'}><DesignControls style={style} onStyleChange={onStyleChange} /><Select aria-label="预览视口" value={viewport} controlSize="sm" onChange={(event) => setViewport(event.target.value)}><option value="inline">自适应</option><option value="375">手机 · 375px</option><option value="768">平板 · 768px</option><option value="1280">桌面 · 1280px</option></Select>
          <IconButton label="重置组件预览" icon={<RotateCcw size={15} />} size="sm" variant="ghost" onClick={() => setReset((value) => value + 1)} />
          <a href={standalone} target="_blank" rel="noreferrer" aria-label="独立打开示例" title="独立打开示例"><ExternalLink size={16} /></a>
        </div>
      </div>
      <TabsContent value="preview" forceMount aria-hidden={view !== 'preview'} inert={view !== 'preview'} style={view === 'preview' ? undefined : { visibility: 'hidden', position: 'absolute', insetInline: 0, top: 0 }}><div className="docs-preview docs-preview-catalog">{viewport === 'inline' ? <div key={reset} className="docs-preview-inner docs-demo-canvas">{doc.preview}</div>
        : <div className="docs-viewport-scroll"><iframe key={`${reset}-${viewport}`} title={`${doc.name} ${viewport}px 预览`} src={standalone} style={{ width: Number(viewport) }} className="docs-preview-frame" /></div>}</div></TabsContent>
      <TabsContent value="code">{demoError ? <p role="alert">示例源码加载失败，请刷新重试。</p> : demoSource ? <DocCode code={demoSource} label="用法 TSX" /> : <Spinner label="加载示例源码" />}</TabsContent>
    </Tabs></section>
    <section id="installation"><h2>安装与导入</h2><DocCode code={`import { ${doc.name} } from "@asharca/ui${doc.module ? `/${doc.module}` : ''}";`} label="按需导入" /><p>首次使用请完成<a href="#/installation">安装与样式配置</a>。当前为开发分支，新增接口需核对已安装版本。</p></section>
    <section id="usage"><h2>使用约定</h2><div className="docs-usage-note"><p>{doc.notes}</p><div className="docs-related"><span>相关组件</span>{componentDocs.filter((item) => item.group === doc.group && item.id !== id).slice(0, 4).map((item) => <a key={item.id} href={`#/components/${item.id}`}>{item.name}</a>)}</div></div></section>
    <section id="api"><h2>API 参考</h2><div className="docs-api-scroll" role="region" aria-label={`${doc.name} 属性说明`} tabIndex={0}><table className="docs-api-table"><thead><tr><th scope="col">属性</th><th scope="col">类型</th><th scope="col">默认值</th><th scope="col">说明</th></tr></thead><tbody>{doc.api.map(([name, type, value, description]) => <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td>{value}</td><td>{description}</td></tr>)}</tbody></table></div><p>主要扩展属性如上，完整类型以公开声明为准。</p></section>
    <section id="source"><h2>组件源码</h2><details open={sourceOpen} onToggle={(event) => setSourceOpen(event.currentTarget.open)}><summary>查看组件实现</summary>{sourceOpen && <><label className="docs-source-select">源码文件<Select aria-label="源码文件" value={sourceFile} onChange={(event) => setSourceFile(event.target.value)}>{[doc.file, ...Object.keys(sources).map((path) => path.replace('../src/', '')).filter((file) => file !== doc.file).sort()].map((file) => <option key={file}>{file}</option>)}</Select></label>{sourceError ? <p role="alert">源码加载失败，请刷新重试。</p> : source ? <DocCode code={source} label={`src/${sourceFile}`} language={sourceFile.endsWith('.css') ? 'css' : sourceFile.endsWith('.ts') ? 'typescript' : 'tsx'} /> : <Spinner label="加载组件源码" />}</>}</details><p>按需读取实际实现；复制组件实现时仍需保留其本地依赖和样式。</p></section>
    <footer className="docs-pager">{index > 0 ? <a href={`#/components/${componentDocs[index - 1].id}`}><ArrowLeft size={15} />{componentDocs[index - 1].name}</a> : <span />}{index < componentDocs.length - 1 && <a href={`#/components/${componentDocs[index + 1].id}`}>{componentDocs[index + 1].name}<ArrowRight size={15} /></a>}</footer>
  </>;
}

function Installation() {
  const [manager, setManager] = useState('pnpm');
  const command = `${manager} ${manager === 'npm' ? 'install' : 'add'}`;
  return <>
    <div className="docs-page-heading"><span className="docs-eyebrow">开始使用</span><h1>安装</h1><p>从安装到第一个组件。把精心设计的界面，带进你的 React 项目。</p><span className="docs-meta">工作区 v{version} · {componentDocs.length} 个组件入口</span></div>
    <div className="docs-version-note">本页对应开发分支。新增接口与主题尚未发布，安装 npm 包前请核对实际版本与导出；已安装项目不需要为了浏览文档升级依赖。</div>
    <section id="requirements"><h2>环境要求</h2><div className="docs-requirements"><code>React 19</code><code>TypeScript</code><code>Tailwind CSS 4</code></div><p>React 19、React DOM 19、Tailwind CSS 4。聊天运行时固定使用 assistant-ui 0.15.18；开发本仓库使用 Node 24 和 pnpm。</p><p>组件包不依赖 Next.js 或 ToolPlane。模型调用、鉴权与持久化由宿主提供。</p></section>
    <section id="dependencies"><h2>1. 安装依赖</h2><label className="docs-source-select">包管理器<Select aria-label="包管理器" value={manager} onChange={(event) => setManager(event.target.value)}>{['pnpm', 'npm', 'yarn', 'bun'].map((name) => <option key={name}>{name}</option>)}</Select></label><DocCode label="安装命令" language="bash" code={`${command} @asharca/ui`} /><details><summary>依赖未自动安装或版本冲突？</summary><p>可显式声明运行时和框架依赖。固定运行时的间接依赖仍可能发生 peer 冲突，请先对齐兼容版本，不要关闭严格检查。</p><DocCode label="完整依赖安装命令" language="bash" code={`${command} @asharca/ui @assistant-ui/react@0.15.18 react@^19 react-dom@^19 tailwindcss@^4`} /></details></section>
    <section id="styles"><h2>2. 导入全局样式</h2><p>先配置 Tailwind 4 构建，再导入样式入口。仅导入 React 组件不会自动生成全部样式。</p><DocCode label="app.css" language="css" code={'@import "tailwindcss";\n@import "@asharca/ui/styles.css";'} /></section>
    <section id="first-component"><h2>3. 使用第一个组件</h2><DocCode label="App.tsx" code={'import { Button } from "@asharca/ui/controls";\nimport "./app.css";\n\nexport default function App() {\n  return <Button variant="primary">开始使用</Button>;\n}'} /><a className="docs-next-link" href="#/components/button">查看 Button 的全部状态<ArrowRight size={16} /></a></section>
    <section id="theme"><h2>4. 配置主题</h2><p>颜色变量使用 HSL 通道值，全局 .dark 切换暗色默认主题。可选皮肤与可复制配置见<a href="#/themes">主题实验室</a>。</p><DocCode label="主题变量 CSS" language="css" code={':root {\n  --toolplane-ui-radius: 0.5rem;\n  --toolplane-ui-control-height: 2.25rem;\n  --toolplane-ui-chat-width: 53rem;\n  --toolplane-ui-composer-radius: 1.25rem;\n}\n.dark {\n  --toolplane-ui-brand: 128 73% 67%;\n}'} /><p>浮层默认挂载到 body。局部主题需要明确 Portal 容器或全局变量，不会自动跨越 Portal。</p></section>
  </>;
}

function Overview() {
  const [group, setGroup] = useState('全部');
  const [query, setQuery] = useState('');
  const visible = componentDocs.filter((doc) => (group === '全部' || doc.group === group) && `${doc.name} ${doc.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <>
    <div className="docs-page-heading"><span className="docs-eyebrow">文档</span><h1>组件</h1><p>基础控件、应用布局与 AI 对话。</p></div>
    <div className="docs-catalog-toolbar">
      <SearchInput label="筛选组件总览" placeholder="按名称或用途筛选…" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} />
      <Select aria-label="组件分类" value={group} onChange={(event) => setGroup(event.target.value)}>{['全部', ...componentGroups].map((item) => <option key={item}>{item}</option>)}</Select>
      <span className="docs-meta" role="status">{visible.length} 个组件</span>
    </div>
    {componentGroups.map((name) => {
      const entries = visible.filter((doc) => doc.group === name);
      return entries.length > 0 && <section className="docs-catalog-section" key={name} aria-label={name}>
        <div className="docs-catalog-heading"><h2>{name}</h2><span>{entries.length}</span></div>
        <div className="docs-catalog-grid">{entries.map((doc) => <a href={`#/components/${doc.id}`} key={doc.id}><div><h3>{doc.name}</h3><p>{doc.description}</p></div><ChevronRight size={16} aria-hidden="true" /></a>)}</div>
      </section>;
    })}
    {!visible.length && <p className="docs-search-empty">没有匹配的组件，请调整筛选条件。</p>}
  </>;
}

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
  const [activeSection, setActiveSection] = useState('');
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
  useEffect(() => {
    const scroller = main.current;
    if (!scroller || typeof requestAnimationFrame === 'undefined') return;
    let frame = 0;
    const update = () => {
      const sections = Array.from(scroller.querySelectorAll<HTMLElement>('section[id]'));
      const top = scroller.getBoundingClientRect().top + 100;
      const current = sections.filter((section) => section.getBoundingClientRect().top <= top).at(-1) ?? sections[0];
      setActiveSection(current?.id ?? '');
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const observer = new MutationObserver(schedule);
    observer.observe(scroller, { childList: true, subtree: true });
    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); scroller.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, [route]);
  const directory = (mobile: boolean) => <DocsDirectory route={routePath} query={search} onQueryChange={setSearch} inputRef={mobile ? mobileSearch : searchRef} onNavigate={() => setOpen(false)} />;
  if (previewRoute) {
    const preview = componentDocs.find((item) => item.id === routePath.slice('#/preview/'.length));
    return <main data-toolplane-ui="preview" className="docs-standalone-preview" key={routePath}>{preview ? preview.preview : <p role="alert">未找到组件示例。</p>}</main>;
  }
  if (example) return <><ExamplePage key={example.id} example={example} style={design.style} onStyleChange={design.setStyle} dark={dark} onDarkChange={setDark} density={design.density} onDensityChange={design.setDensity} /><SiteSearch open={searchOpen} onOpenChange={setSearchOpen} /></>;
  const toc = ai ? [['ai-start', '使用方式'], ['ai-contract', '接口约定'], ['ai-prompt', '任务模板'], ['ai-generate', '同步生成']]
    : doc ? [['preview', '预览与用法'], ['installation', '安装与导入'], ['usage', '使用约定'], ['api', 'API 参考'], ['source', '组件源码']]
      : [['requirements', '环境要求'], ['dependencies', '安装依赖'], ['styles', '全局样式'], ['first-component', '第一个组件'], ['theme', '主题']];
  return <><Dialog open={open} onOpenChange={setOpen}><div className={`docs-site ${home ? 'is-home' : ''}`} data-toolplane-ui="docs">
    <a href="#main-content" className="docs-skip-link" onClick={(event) => { event.preventDefault(); main.current?.focus(); }}>跳到正文</a>
    <header className="docs-top">
      <a href="#/home" className="docs-brand" aria-label="Asharca UI 首页"><span className="docs-brand-mark"><Box size={18} strokeWidth={1.8} /></span><strong>asharca<span>/</span>ui</strong></a>
      <nav aria-label="站点导航"><a href="#/installation" aria-current={!home && !themes && !examples && !ai && !overview && !doc ? 'page' : undefined}>文档</a><a href="#/components" aria-current={overview || doc ? 'page' : undefined}>组件</a><a href="#/themes" aria-current={themes ? 'page' : undefined}>主题</a><a href="#/examples" aria-current={examples ? 'page' : undefined}>示例</a><a href="#/ai" aria-current={ai ? 'page' : undefined}>AI 文档</a></nav>
      <div className="docs-top-actions"><button type="button" className="docs-search-trigger" aria-label="搜索文档" onClick={() => setSearchOpen(true)}><Search size={15} /><span>搜索文档…</span></button>{themes && <DesignControls style={design.style} onStyleChange={design.setStyle} />}<a href="https://github.com/asharca/ui" aria-label="GitHub 源码" title="GitHub 源码" target="_blank" rel="noreferrer"><Code2 size={17} /></a><IconButton variant="ghost" label={dark ? '切换浅色主题' : '切换深色主题'} icon={dark ? <Sun size={17} /> : <Moon size={17} />} onClick={() => setDark(!dark)} /><DialogTrigger asChild><IconButton className="docs-mobile-toggle" variant="ghost" label="打开文档导航" icon={<Menu size={18} />} /></DialogTrigger></div>
    </header>
    <div className="docs-body"><aside className="docs-sidebar" aria-label="文档导航">{directory(false)}</aside>
      <main id="main-content" className="docs-main" ref={main} tabIndex={-1}><div className={`docs-content ${overview || examples ? 'docs-content-wide' : ''} ${home || themes ? 'design-page' : ''}`}>
        {missing ? <><h1>页面不存在</h1><a href="#/installation">返回安装页</a></> : home ? <Suspense fallback={<Spinner label="加载设计系统" />}><DesignHome /></Suspense> : themes ? <Suspense fallback={<Spinner label="加载主题实验室" />}><ThemeStudio dark={dark} style={design.style} density={design.density} onDarkChange={setDark} onStyleChange={design.setStyle} onDensityChange={design.setDensity} /></Suspense> : ai ? <Suspense fallback={<Spinner label="加载 AI 文档" />}><AIPage /></Suspense> : overview ? <Overview /> : examples ? <ExampleGallery style={design.style} onStyleChange={design.setStyle} /> : doc ? <ComponentPage key={id} id={id} dark={dark} style={design.style} density={design.density} onStyleChange={design.setStyle} /> : <Installation />}
      </div></main>
      {!missing && !examples && !overview && !home && !themes && <aside className="docs-toc" aria-label="本页目录"><span>本页目录</span>{toc.map(([target, label]) => <button key={target} aria-current={activeSection === target ? 'location' : undefined} onClick={() => { setActiveSection(target); scrollWithin(main.current, document.getElementById(target)); }}>{label}</button>)}</aside>}
    </div>
  </div><DialogPortal><DialogOverlay className="docs-mobile-overlay" /><DialogContent className="docs-mobile-dialog" aria-describedby={undefined} onOpenAutoFocus={(event) => { event.preventDefault(); mobileSearch.current?.focus(); }}><div className="docs-mobile-heading"><DialogTitle>文档导航</DialogTitle><DialogClose asChild><IconButton label="关闭文档导航" variant="ghost" icon={<X size={18} />} /></DialogClose></div><nav className="docs-mobile-links" aria-label="站点入口"><a href="#/home" onClick={() => setOpen(false)}>首页</a><a href="#/examples" onClick={() => setOpen(false)}>示例</a></nav>{directory(true)}</DialogContent></DialogPortal></Dialog><SiteSearch open={searchOpen} onOpenChange={setSearchOpen} /></>;
}
