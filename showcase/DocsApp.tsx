/// <reference types="vite/client" />
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Box, Code2, ExternalLink, FileText, Menu, Moon, RotateCcw, Sun, X } from 'lucide-react';
import { Button, IconButton, SearchInput, Select } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/Navigation';
import { Dialog, DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '../src/Dialog';
import { Spinner } from '../src/Feedback';
import { componentDocs } from './ComponentDemos';
import { componentGroups } from './component-metadata';
import { componentMarkdown, publicExample } from './component-markdown';
import { DocCode } from './DocCode';
import { version } from '../package.json';
import './docs.css';
import './docs-workbench.css';
import './ui-polish.css';

const sources = import.meta.glob<string>('../src/*.{tsx,ts,css}', { query: '?raw', import: 'default' });
const demos = import.meta.glob<string>('./demos/*.tsx', { query: '?raw', import: 'default' });
const Workbench = lazy(() => import('./App').then((module) => ({ default: module.App })));
const Manual = lazy(() => import('./Manual').then((module) => ({ default: module.Manual })));
const AIPage = lazy(() => import('./AIPage').then((module) => ({ default: module.AIPage })));
const SettingsExample = lazy(() => import('./blocks/SettingsExample').then((module) => ({ default: module.SettingsExample })));
const THEME_KEY = 'asharca-ui-docs-theme';

function ComponentPage({ id, dark }: { id: string; dark: boolean }) {
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
  const standalone = `#/preview/${id}?theme=${dark ? 'dark' : 'light'}`;
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
  // Load only this small example, not the implementation, for both copy actions.
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
    <div className="docs-page-heading"><span className="docs-eyebrow">组件 / {doc.group}</span><h1>{doc.name}</h1><p>{doc.description}</p></div>
    <div className="docs-page-actions">
      {demoSource ? <CopyButton text={componentMarkdown(doc, demoSource, version)} label="复制给 AI" copiedLabel="已复制 Markdown" failedLabel="复制失败" /> : <Button disabled size="sm">{demoError ? '文档加载失败' : '正在准备文档…'}</Button>}
      <a className="docs-outline-link" href={`${import.meta.env.BASE_URL}ai/components/${id}.md`}><FileText size={15} />Markdown</a>
      <span className="docs-meta">React · TypeScript · 工作区 v{version}</span>
    </div>
    <section id="preview"><Tabs value={view} onValueChange={setView}>
      <div className="docs-preview-toolbar"><TabsList aria-label="组件示例视图"><TabsTrigger value="preview">预览</TabsTrigger><TabsTrigger value="code">用法代码</TabsTrigger></TabsList>
        <div className="docs-preview-actions"><Select aria-label="预览视口" value={viewport} controlSize="sm" onChange={(event) => setViewport(event.target.value)}><option value="inline">自适应</option><option value="375">手机 · 375px</option><option value="768">平板 · 768px</option><option value="1280">桌面 · 1280px</option></Select>
          <IconButton label="重置组件预览" icon={<RotateCcw size={15} />} size="sm" variant="ghost" onClick={() => setReset((value) => value + 1)} />
          <a href={standalone} target="_blank" rel="noreferrer" aria-label="独立打开示例" title="独立打开示例"><ExternalLink size={16} /></a>
        </div>
      </div>
      <TabsContent value="preview"><div className="docs-preview docs-preview-catalog">{viewport === 'inline' ? <div key={reset} className="docs-preview-inner docs-demo-canvas">{doc.preview}</div>
        : <div className="docs-viewport-scroll"><iframe key={`${reset}-${viewport}`} title={`${doc.name} ${viewport}px 预览`} src={standalone} style={{ width: Number(viewport) }} className="docs-preview-frame" /></div>}</div><p className="docs-preview-hint">示例仅修改本地状态。切换视口、主题或重置，检查真实的交互表现。</p></TabsContent>
      <TabsContent value="code">{demoError ? <p role="alert">示例源码加载失败，请刷新重试。</p> : demoSource ? <DocCode code={demoSource} label="用法 TSX" /> : <Spinner label="加载示例源码" />}<p>预览与代码来自同一份文件；图片资源请替换为自己的地址。</p></TabsContent>
    </Tabs></section>
    <section id="installation"><h2>安装与导入</h2><DocCode code="pnpm add @asharca/ui" label="终端" language="bash" /><DocCode code={`import { ${doc.name} } from "@asharca/ui${doc.module ? `/${doc.module}` : ''}";`} label="按需导入" /><p>首次使用请完成<a href="#/installation">样式配置</a>。当前分支新增接口需要对应版本，不能直接套用到旧 npm 包。</p></section>
    <section id="api"><h2>API 与接入边界</h2><div className="docs-api-scroll" role="region" aria-label={`${doc.name} 属性说明`} tabIndex={0}><table className="docs-api-table"><thead><tr><th scope="col">属性</th><th scope="col">类型</th><th scope="col">默认值</th><th scope="col">说明</th></tr></thead><tbody>{doc.api.map(([name, type, value, description]) => <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td>{value}</td><td>{description}</td></tr>)}</tbody></table></div><p className="docs-contract">{doc.notes}</p><p>这里只列主要扩展属性，完整类型以公开声明为准。业务、权限、路由与持久化留在宿主应用。</p></section>
    <section id="source"><h2>组件源码</h2><details open={sourceOpen} onToggle={(event) => setSourceOpen(event.currentTarget.open)}><summary>查看组件实现</summary>{sourceOpen && <><label className="docs-source-select">源码文件<Select aria-label="源码文件" value={sourceFile} onChange={(event) => setSourceFile(event.target.value)}>{[doc.file, ...Object.keys(sources).map((path) => path.replace('../src/', '')).filter((file) => file !== doc.file).sort()].map((file) => <option key={file}>{file}</option>)}</Select></label>{sourceError ? <p role="alert">源码加载失败，请刷新重试。</p> : source ? <DocCode code={source} label={`src/${sourceFile}`} language={sourceFile.endsWith('.css') ? 'css' : sourceFile.endsWith('.ts') ? 'typescript' : 'tsx'} /> : <Spinner label="加载组件源码" />}</>}</details><p>按需读取实际实现；复制组件实现时仍需保留其本地依赖和样式。</p></section>
    <footer className="docs-pager">{index > 0 ? <a href={`#/components/${componentDocs[index - 1].id}`}><ArrowLeft size={15} />{componentDocs[index - 1].name}</a> : <span />}{index < componentDocs.length - 1 && <a href={`#/components/${componentDocs[index + 1].id}`}>{componentDocs[index + 1].name}<ArrowRight size={15} /></a>}</footer>
  </>;
}

function Installation() {
  const [manager, setManager] = useState('pnpm');
  const command = `${manager} ${manager === 'npm' ? 'install' : 'add'}`;
  return <>
    <div className="docs-page-heading"><span className="docs-eyebrow">开始使用</span><h1>安装</h1><p>可组合的 React 控件、设置表单与 ToolPlane 风格 AI 界面。</p><span className="docs-meta">工作区 v{version} · {componentDocs.length} 个组件入口</span></div>
    <div className="docs-starter-links"><a href="#/components">浏览全部组件<ArrowRight size={16} /></a><a href="#/examples/settings">查看设置页示例<ArrowRight size={16} /></a><a href="#/ai">交给 AI 开发<ArrowRight size={16} /></a></div>
    <section id="requirements"><h2>环境要求</h2><p>React 19、React DOM 19、Tailwind CSS 4。聊天运行时固定使用 assistant-ui 0.15.18；开发本仓库使用 Node 24 和 pnpm。</p><p>组件包不依赖 Next.js 或 ToolPlane。模型调用、鉴权与持久化由宿主提供。</p></section>
    <section id="dependencies"><h2>1. 安装依赖</h2><label className="docs-source-select">包管理器<Select aria-label="包管理器" value={manager} onChange={(event) => setManager(event.target.value)}>{['pnpm', 'npm', 'yarn', 'bun'].map((name) => <option key={name}>{name}</option>)}</Select></label><DocCode label="安装命令" language="bash" code={`${command} @asharca/ui`} /><details><summary>依赖未自动安装或版本冲突？</summary><p>可显式声明运行时和框架依赖。固定运行时的间接依赖仍可能发生 peer 冲突，请先对齐兼容版本，不要关闭严格检查。</p><DocCode label="完整依赖安装命令" language="bash" code={`${command} @asharca/ui @assistant-ui/react@0.15.18 react@^19 react-dom@^19 tailwindcss@^4`} /></details></section>
    <section id="styles"><h2>2. 导入全局样式</h2><p>先配置 Tailwind 4 构建，再导入样式入口。仅导入 React 组件不会自动生成全部样式。</p><DocCode label="app.css" language="css" code={'@import "tailwindcss";\n@import "@asharca/ui/styles.css";'} /></section>
    <section id="first-component"><h2>3. 使用第一个组件</h2><DocCode label="App.tsx" code={'import { Button } from "@asharca/ui/controls";\nimport "./app.css";\n\nexport default function App() {\n  return <Button variant="primary">开始使用</Button>;\n}'} /><a className="docs-next-link" href="#/components/button">查看 Button 的全部状态<ArrowRight size={16} /></a></section>
    <section id="theme"><h2>4. 配置主题</h2><p>颜色变量使用 HSL 通道值，全局 .dark 切换暗色默认主题。</p><DocCode label="主题变量 CSS" language="css" code={':root {\n  --toolplane-ui-radius: 0.5rem;\n  --toolplane-ui-control-height: 2.25rem;\n  --toolplane-ui-chat-width: 53rem;\n  --toolplane-ui-composer-radius: 1.25rem;\n}\n.dark {\n  --toolplane-ui-brand: 128 73% 67%;\n}'} /><p>浮层默认挂载到 body。局部主题需要明确 Portal 容器或全局变量，不会自动跨越 Portal。</p></section>
  </>;
}

function Overview() {
  const [group, setGroup] = useState('全部');
  const [query, setQuery] = useState('');
  const visible = componentDocs.filter((doc) => (group === '全部' || doc.group === group) && `${doc.name} ${doc.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <><div className="docs-page-heading"><span className="docs-eyebrow">组件目录</span><h1>按场景找到组件</h1><p>从基础控件到 AI 聊天，预览真实状态，复制完整示例。</p></div><SearchInput label="筛选组件总览" placeholder="按名称或用途筛选…" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} /><div className="docs-filter-bar" role="group" aria-label="组件分类">{['全部', ...componentGroups].map((item) => <Button key={item} size="sm" variant={group === item ? 'primary' : 'ghost'} aria-pressed={group === item} onClick={() => setGroup(item)}>{item}</Button>)}</div><div className="docs-catalog-grid">{visible.map((doc) => <a href={`#/components/${doc.id}`} key={doc.id}><span>{doc.group}</span><h2>{doc.name}</h2><p>{doc.description}</p><ArrowRight size={16} aria-hidden="true" /></a>)}</div>{!visible.length && <p role="status">没有匹配的组件，请调整筛选条件。</p>}</>;
}

function readTheme() {
  try { const stored = localStorage.getItem(THEME_KEY); if (stored === 'dark' || stored === 'light') return stored === 'dark'; } catch { /* Storage is optional. */ }
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function DocsApp() {
  const [route, setRoute] = useState(() => window.location.hash || '#/installation');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(readTheme);
  const [activeSection, setActiveSection] = useState('');
  const main = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearch = useRef<HTMLInputElement>(null);
  const [routePath, routeQuery = ''] = route.split('?');
  const previewRoute = routePath.startsWith('#/preview/');
  const effectiveDark = previewRoute ? new URLSearchParams(routeQuery).get('theme') === 'dark' : dark;
  const id = routePath.startsWith('#/components/') ? routePath.slice('#/components/'.length) : '';
  const doc = componentDocs.find((item) => item.id === id);
  const guide = routePath === '#/guide'; const ai = routePath === '#/ai';
  const overview = routePath === '#/components'; const examples = routePath === '#/examples';
  const settings = routePath === '#/examples/settings';
  const missing = !['#/installation', '#', '#workbench', '#/examples/workspace'].includes(routePath) && !doc && !guide && !ai && !overview && !examples && !settings && !previewRoute;
  useEffect(() => {
    const onHash = () => { setRoute(window.location.hash || '#/installation'); setOpen(false); setSearch(''); };
    window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => { main.current?.scrollTo?.(0, 0); }, [route]);
  useEffect(() => { document.documentElement.classList.toggle('dark', effectiveDark); }, [effectiveDark]);
  useEffect(() => { if (!previewRoute) { try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch { /* Storage is optional. */ } } }, [dark, previewRoute]);
  useEffect(() => {
    document.title = `${doc?.name ?? (ai ? 'AI 文档' : overview ? '组件' : examples || settings ? '示例' : guide ? '使用手册' : '安装')} — Asharca UI`;
  }, [doc, ai, overview, examples, settings, guide]);
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !previewRoute) {
        event.preventDefault();
        if (window.innerWidth <= 850) setOpen(true); else searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', keys); return () => window.removeEventListener('keydown', keys);
  }, [previewRoute]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !main.current) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveSection(visible.target.id);
    }, { root: main.current, rootMargin: '0px 0px -65% 0px', threshold: 0 });
    main.current.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [route]);
  const filtered = componentDocs.filter((item) => `${item.name} ${item.description} ${item.group}`.toLowerCase().includes(search.trim().toLowerCase()));
  const directory = (mobile: boolean) => <div className="docs-directory">
    <SearchInput ref={mobile ? mobileSearch : searchRef} label="搜索组件文档" placeholder="搜索组件…" clearLabel="清空搜索" value={search} onChange={(event) => setSearch(event.target.value)} onClear={() => setSearch('')} />
    <h2>开始使用</h2><a href="#/installation" aria-current={routePath === '#/installation' || routePath === '#' ? 'page' : undefined}>安装</a><a href="#/components" aria-current={overview ? 'page' : undefined}>组件总览</a><a href="#/guide" aria-current={guide ? 'page' : undefined}>使用手册</a><a href="#/ai" aria-current={ai ? 'page' : undefined}>AI 接入文档<span className="docs-nav-tag">Markdown</span></a>
    <nav aria-label="组件目录">{componentGroups.map((group) => {
      const entries = filtered.filter((item) => item.group === group);
      return entries.length ? <div key={group} className="docs-nav-group"><h2>{group}<span>{entries.length}</span></h2>{entries.map((item) => <a href={`#/components/${item.id}`} key={item.id} aria-current={id === item.id ? 'page' : undefined}>{item.name}</a>)}</div> : null;
    })}</nav>{!filtered.length && <p role="status">没有匹配的组件</p>}
  </div>;
  if (previewRoute) {
    const preview = componentDocs.find((item) => item.id === routePath.slice('#/preview/'.length));
    return <main data-toolplane-ui="preview" className="docs-standalone-preview" key={routePath}>{preview ? preview.preview : <p role="alert">未找到组件示例。</p>}</main>;
  }
  if (routePath === '#workbench' || routePath === '#/examples/workspace') return <Suspense fallback={<Spinner label="加载工作区" />}><Workbench /></Suspense>;
  const toc = ai ? [['ai-start', '使用方式'], ['ai-contract', '接口约定'], ['ai-prompt', '任务模板'], ['ai-generate', '同步生成']]
    : doc ? [['preview', '预览与用法'], ['installation', '安装与导入'], ['api', 'API 与接入边界'], ['source', '组件源码']]
      : [['requirements', '环境要求'], ['dependencies', '安装依赖'], ['styles', '全局样式'], ['first-component', '第一个组件'], ['theme', '主题']];
  return <Dialog open={open} onOpenChange={setOpen}><div className="docs-site" data-toolplane-ui="docs">
    <a href="#main-content" className="docs-skip-link" onClick={(event) => { event.preventDefault(); main.current?.focus(); }}>跳到正文</a>
    <header className="docs-top"><a href="#/installation" className="docs-brand"><Box size={21} /><strong>asharca/ui</strong></a><nav aria-label="站点导航"><a href="#/installation" aria-current={!examples && !settings && !ai ? 'page' : undefined}>文档</a><a href="#/examples" aria-current={examples || settings ? 'page' : undefined}>示例</a><a href="#/ai" aria-current={ai ? 'page' : undefined}>AI 文档</a></nav><div className="docs-top-actions"><span>v{version}</span><a href="https://github.com/asharca/ui" aria-label="GitHub 源码" title="GitHub 源码" target="_blank" rel="noreferrer"><Code2 size={18} /></a><IconButton variant="ghost" label={dark ? '切换浅色主题' : '切换深色主题'} icon={dark ? <Sun size={17} /> : <Moon size={17} />} onClick={() => setDark(!dark)} /><DialogTrigger asChild><IconButton className="docs-mobile-toggle" variant="ghost" label="打开文档导航" icon={<Menu size={18} />} /></DialogTrigger></div></header>
    <div className="docs-body"><aside className="docs-sidebar" aria-label="文档导航">{directory(false)}</aside>
      <main id="main-content" className="docs-main" ref={main} tabIndex={-1}><div className={`docs-content ${guide ? 'docs-guide' : ''} ${overview || examples ? 'docs-content-wide' : ''}`}>
        {missing ? <><h1>页面不存在</h1><a href="#/installation">返回安装页</a></> : ai ? <Suspense fallback={<Spinner label="加载 AI 文档" />}><AIPage /></Suspense> : overview ? <Overview /> : settings ? <Suspense fallback={<Spinner label="加载设置页" />}><SettingsExample /></Suspense> : examples ? <><div className="docs-page-heading"><span className="docs-eyebrow">组合示例</span><h1>示例</h1><p>不只看控件，也看看它们在完整界面里如何工作。</p></div><a className="docs-example" href="#/examples/workspace" aria-label="打开工作区示例"><img src="./workspace-preview.png" alt="工作区示例：可折叠侧边栏、标签导航和组件工作台" width={1440} height={900} /><div><div><h2>工作区</h2><p>侧边栏、标签导航、项目管理与聊天界面。</p></div><ArrowRight size={20} aria-hidden="true" /></div></a><div className="docs-starter-links"><a href="#/examples/settings">设置与通知表单<ArrowRight size={16} /></a><a href="#/components/chat-thread">聊天与流式输出<ArrowRight size={16} /></a><a href="#/components/tool-call-card">工具调用与审批<ArrowRight size={16} /></a><a href="#/components/data-table">排序、筛选与表格选择<ArrowRight size={16} /></a></div></> : doc ? <ComponentPage key={id} id={id} dark={dark} /> : guide ? <Suspense fallback={<Spinner label="加载使用手册" />}><Manual onNavigate={(view) => { window.location.hash = view === 'chat' ? '#/components/chat-thread' : '#/components/button'; }} /></Suspense> : <Installation />}
      </div></main>
      {!guide && !missing && !examples && !settings && !overview && <aside className="docs-toc"><span>本页目录</span>{toc.map(([target, label]) => <button key={target} aria-current={activeSection === target ? 'location' : undefined} onClick={() => { setActiveSection(target); document.getElementById(target)?.scrollIntoView({ block: 'start' }); }}>{label}</button>)}<a className="docs-toc-ai" href="#/ai">让 AI 理解这些组件<ArrowRight size={14} /></a></aside>}
    </div>
  </div><DialogPortal><DialogOverlay className="docs-mobile-overlay" /><DialogContent className="docs-mobile-dialog" aria-describedby={undefined} onOpenAutoFocus={(event) => { event.preventDefault(); mobileSearch.current?.focus(); }}><div className="docs-mobile-heading"><DialogTitle>文档导航</DialogTitle><DialogClose asChild><IconButton label="关闭文档导航" variant="ghost" icon={<X size={18} />} /></DialogClose></div>{directory(true)}</DialogContent></DialogPortal></Dialog>;
}
