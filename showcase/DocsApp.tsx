/// <reference types="vite/client" />
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Box, Code2, ExternalLink, Menu, Moon, RotateCcw, Sun, X } from 'lucide-react';
import { IconButton, SearchInput, Select } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../src/Navigation';
import { Spinner } from '../src/Feedback';
import { componentDocs } from './ComponentDemos';
import { componentGroups } from './component-metadata';
import { HighlightedCode, type CodeLanguage } from './HighlightedCode';
import { version } from '../package.json';
import './docs.css';
import './docs-workbench.css';

const sources = import.meta.glob<string>('../src/*.{tsx,ts,css}', { query: '?raw', import: 'default' });
const demos = import.meta.glob<string>('./demos/*.tsx', { query: '?raw', import: 'default' });
const Workbench = lazy(() => import('./App').then((module) => ({ default: module.App })));
const Manual = lazy(() => import('./Manual').then((module) => ({ default: module.Manual })));
const THEME_KEY = 'asharca-ui-docs-theme';

function CodeBlock({ code, label, language = 'tsx' }: { code: string; label: string; language?: CodeLanguage }) {
  return <div className="docs-code"><header><span>{label}</span><CopyButton text={code} label={`复制 ${label}`} copiedLabel="已复制" failedLabel="复制失败" copyingLabel="复制中…" /></header><HighlightedCode code={code} language={language} label={label} /></div>;
}
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
  useEffect(() => {
    if (view !== 'code' || demoSource) return;
    let active = true; setDemoError(false);
    Promise.resolve().then(() => {
      const load = demos[`./demos/${doc.demoFile}`];
      if (!load) throw new Error('Unknown demo');
      return load();
    }).then((text) => { if (active) setDemoSource(text.replaceAll('"../../src/index"', '"@asharca/ui"')); })
      .catch(() => { if (active) setDemoError(true); });
    return () => { active = false; };
  }, [view, doc.demoFile, demoSource]);
  const index = componentDocs.indexOf(doc);
  return <>
    <div className="docs-page-heading"><span className="docs-eyebrow">{doc.group}</span><h1>{doc.name}</h1><p>{doc.description}</p><span className="docs-meta">React · TypeScript · v{version}</span></div>
    <section id="preview"><Tabs value={view} onValueChange={setView}>
      <div className="docs-preview-toolbar"><TabsList aria-label="组件示例视图"><TabsTrigger value="preview">预览</TabsTrigger><TabsTrigger value="code">用法代码</TabsTrigger></TabsList>
        <div className="docs-preview-actions"><Select aria-label="预览视口" value={viewport} controlSize="sm" onChange={(event) => setViewport(event.target.value)}><option value="inline">自适应</option><option value="375">手机 · 375px</option><option value="768">平板 · 768px</option><option value="1280">桌面 · 1280px</option></Select>
          <IconButton label="重置组件预览" icon={<RotateCcw size={15} />} size="sm" variant="ghost" onClick={() => setReset(reset + 1)} />
          <a href={standalone} target="_blank" rel="noreferrer" aria-label="独立打开示例" title="独立打开示例"><ExternalLink size={16} /></a>
        </div>
      </div>
      <TabsContent value="preview"><div className="docs-preview docs-preview-catalog">{viewport === 'inline' ? <div key={reset} className="docs-preview-inner docs-demo-canvas">{doc.preview}</div>
        : <div className="docs-viewport-scroll"><iframe key={`${reset}-${viewport}`} title={`${doc.name} ${viewport}px 预览`} src={standalone} style={{ width: Number(viewport) }} className="docs-preview-frame" /></div>}</div><p className="docs-preview-hint">示例在本地运行；状态不会保存到服务器。手机与平板预览使用独立视口。</p></TabsContent>
      <TabsContent value="code">{demoError ? <p role="alert">示例源码加载失败，请刷新重试。</p> : <CodeBlock code={demoSource || '// 正在加载示例…'} label="用法 TSX" />}<p>预览与用法代码来自同一份 TSX 文件。安装样式后即可接入；演示图片需要替换成自己的资源。</p></TabsContent>
    </Tabs></section>
    <section id="api"><h2>API 与接入边界</h2><div className="docs-api-scroll" role="region" aria-label={`${doc.name} 属性说明`} tabIndex={0}><table className="docs-api-table"><thead><tr><th scope="col">属性</th><th scope="col">类型</th><th scope="col">默认值</th><th scope="col">说明</th></tr></thead><tbody>{doc.api.map(([name, type, value, description]) => <tr key={name}><th scope="row"><code>{name}</code></th><td><code>{type}</code></td><td>{value}</td><td>{description}</td></tr>)}</tbody></table></div><p className="docs-contract">{doc.notes}</p><p>表格列出主要扩展属性。原生 HTML 属性和完整类型仍以导出的 TypeScript 声明为准；业务 API、路由、权限和持久化由宿主处理。</p></section>
    <section id="installation"><h2>安装与导入</h2><CodeBlock code="pnpm add @asharca/ui" label="终端" language="bash" /><CodeBlock code={`import { ${doc.name} } from "@asharca/ui${doc.module ? `/${doc.module}` : ''}";`} label="按需导入" /><p>首次接入需要配置全局样式，见<a href="#/installation">安装指南</a>。</p></section>
    <section id="source"><h2>组件源码</h2><details open={sourceOpen} onToggle={(event) => setSourceOpen(event.currentTarget.open)}><summary>查看组件实现</summary>{sourceOpen && <><label className="docs-source-select">源码文件<Select aria-label="源码文件" value={sourceFile} onChange={(event) => setSourceFile(event.target.value)}>{[doc.file, ...Object.keys(sources).map((path) => path.replace('../src/', '')).filter((file) => file !== doc.file).sort()].map((file) => <option key={file}>{file}</option>)}</Select></label>{sourceError ? <p role="alert">源码加载失败，请刷新重试。</p> : <CodeBlock code={source || '// 正在加载…'} label={`src/${sourceFile}`} language={sourceFile.endsWith('.css') ? 'css' : sourceFile.endsWith('.ts') ? 'typescript' : 'tsx'} />}</>}</details><p>源码仅在展开时加载。共享模块会包含相关组件，复制实现时还需保留本地依赖。</p></section>
    <footer className="docs-pager">{index > 0 ? <a href={`#/components/${componentDocs[index - 1].id}`}><ArrowLeft size={15} />{componentDocs[index - 1].name}</a> : <span />}{index < componentDocs.length - 1 && <a href={`#/components/${componentDocs[index + 1].id}`}>{componentDocs[index + 1].name}<ArrowRight size={15} /></a>}</footer>
  </>;
}
function Installation() {
  const [manager, setManager] = useState('pnpm');
  const command = `${manager} ${manager === 'npm' ? 'install' : 'add'}`;
  return <>
    <div className="docs-page-heading"><span className="docs-eyebrow">开始使用</span><h1>安装</h1><p>可组合的 React 控件、工作区布局与 ToolPlane 风格的 AI 聊天界面。</p><span className="docs-meta">当前工作区 v{version} · {componentDocs.length} 个文档入口</span></div>
    <section id="requirements"><h2>环境要求</h2><p>React 19、React DOM 19、Tailwind CSS 4。聊天运行时固定使用 assistant-ui 0.15.18；开发本仓库使用 Node 24 和 pnpm。</p><p>组件包不依赖 Next.js 或 ToolPlane。模型调用、鉴权与持久化都留在你的应用中。</p></section>
    <section id="dependencies"><h2>1. 安装依赖</h2><label className="docs-source-select">包管理器<Select aria-label="包管理器" value={manager} onChange={(event) => setManager(event.target.value)}>{['pnpm', 'npm', 'yarn', 'bun'].map((name) => <option key={name}>{name}</option>)}</Select></label><CodeBlock label="安装命令" language="bash" code={`${command} @asharca/ui`} /><p>安装依赖后，还需要配置下方的样式构建。</p><details><summary>依赖未自动安装或版本冲突？</summary><p>可显式声明运行时与框架依赖。固定运行时的间接依赖可能发生 peer 冲突，应对齐兼容版本，不要关闭严格检查来掩盖问题。</p><CodeBlock label="完整依赖安装命令" language="bash" code={`${command} @asharca/ui @assistant-ui/react@0.15.18 react@^19 react-dom@^19 tailwindcss@^4`} /></details></section>
    <section id="styles"><h2>2. 导入全局样式</h2><p>先配置 Tailwind 4 构建，再在全局 CSS 中导入。发布的样式包含用于扫描组件的 @source。</p><CodeBlock label="app.css" language="css" code={'@import "tailwindcss";\n@import "@asharca/ui/styles.css";'} /></section>
    <section id="first-component"><h2>3. 使用第一个组件</h2><CodeBlock label="App.tsx" code={'import { Button } from "@asharca/ui/controls";\nimport "./app.css";\n\nexport default function App() {\n  return <Button variant="primary">开始使用</Button>;\n}'} /><a className="docs-next-link" href="#/components/button">查看 Button 的全部状态<ArrowRight size={16} /></a></section>
    <section id="theme"><h2>4. 配置主题</h2><p>颜色使用 HSL 通道值。祖先元素的 .dark 类切换暗色默认主题；字号、圆角与密度可以按项目调整。</p><CodeBlock label="主题变量 CSS" language="css" code={':root {\n  --toolplane-ui-radius: 0.625rem;\n  --toolplane-ui-control-height: 2.25rem;\n  --toolplane-ui-chat-width: 53rem;\n  --toolplane-ui-composer-radius: 1.25rem;\n}\n.dark {\n  --toolplane-ui-brand: 128 73% 67%;\n}'} /><p>浮层默认挂到 body。局部主题需要明确 Portal 容器或在全局提供一致变量，不应假定局部样式自动跨越 Portal。</p></section>
    <section><h2>从场景开始</h2><div className="docs-starter-links"><a href="#/components/chat-thread">AI 聊天与流式回复<ArrowRight size={16} /></a><a href="#/components/tool-call-card">工具状态与审批<ArrowRight size={16} /></a><a href="#/components/workspace-tab-bar">工作区导航<ArrowRight size={16} /></a></div></section>
  </>;
}
function readTheme() {
  try { const stored = localStorage.getItem(THEME_KEY); if (stored === 'dark' || stored === 'light') return stored === 'dark'; } catch { /* Storage can be disabled. */ }
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}
export function DocsApp() {
  const [route, setRoute] = useState(() => window.location.hash || '#/installation');
  const [search, setSearch] = useState(''); const [open, setOpen] = useState(false); const [dark, setDark] = useState(readTheme);
  const main = useRef<HTMLElement>(null); const searchRef = useRef<HTMLInputElement>(null); const mobileTrigger = useRef<HTMLButtonElement>(null); const sidebarRef = useRef<HTMLElement>(null);
  const previewRoute = route.startsWith('#/preview/'); const [routePath, routeQuery = ''] = route.split('?');
  const effectiveDark = previewRoute ? new URLSearchParams(routeQuery).get('theme') === 'dark' : dark;
  useEffect(() => { const onHash = () => { setRoute(window.location.hash || '#/installation'); setOpen(false); setSearch(''); }; window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash); }, []);
  useEffect(() => { main.current?.scrollTo?.(0, 0); }, [route]);
  useEffect(() => { document.documentElement.classList.toggle('dark', effectiveDark); }, [effectiveDark]);
  useEffect(() => { if (!previewRoute) { try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light'); } catch { /* Preferences remain usable without storage. */ } } }, [dark, previewRoute]);
  useEffect(() => {
    const keys = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !previewRoute) { event.preventDefault(); setOpen(true); requestAnimationFrame(() => searchRef.current?.focus()); }
      if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); mobileTrigger.current?.focus(); }
      if (event.key !== 'Tab' || !open || window.innerWidth > 850) return;
      const nodes = Array.from(sidebarRef.current?.querySelectorAll<HTMLElement>('input:not(:disabled), button:not(:disabled), a[href]') ?? []).filter((node) => node.getClientRects().length > 0);
      const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', keys); return () => window.removeEventListener('keydown', keys);
  }, [open, previewRoute]);
  if (previewRoute) {
    const preview = componentDocs.find((item) => item.id === routePath.slice('#/preview/'.length));
    return <main className="docs-standalone-preview" key={routePath}>{preview ? preview.preview : <p role="alert">未找到组件示例。</p>}</main>;
  }
  if (route === '#workbench' || route === '#/examples/workspace') return <Suspense fallback={<Spinner label="加载工作区" />}><Workbench /></Suspense>;
  const id = route.startsWith('#/components/') ? route.slice('#/components/'.length) : '';
  const doc = componentDocs.find((item) => item.id === id); const guide = route === '#/guide'; const examples = route === '#/examples';
  const missing = route !== '#/installation' && route !== '#' && !doc && !guide && !examples;
  const filtered = componentDocs.filter((item) => `${item.name} ${item.description} ${item.group}`.toLowerCase().includes(search.trim().toLowerCase()));
  const toc = doc ? [['preview', '预览与用法'], ['api', 'API 与接入边界'], ['installation', '安装与导入'], ['source', '组件源码']] : [['requirements', '环境要求'], ['dependencies', '安装依赖'], ['styles', '全局样式'], ['first-component', '第一个组件'], ['theme', '主题']];
  return <div className="docs-site"><a href="#main-content" className="docs-skip-link" onClick={(event) => { event.preventDefault(); main.current?.focus(); }}>跳到正文</a>
    <header className="docs-top"><a href="#/installation" className="docs-brand"><Box size={21} /><strong>asharca/ui</strong></a><nav aria-label="站点导航"><a href="#/installation">文档</a><a href="#/examples" aria-current={examples ? 'page' : undefined}>示例</a></nav><div className="docs-top-actions"><span>v{version}</span><a href="https://github.com/asharca/ui" aria-label="GitHub 源码" title="GitHub 源码" target="_blank" rel="noreferrer"><Code2 size={18} /></a><IconButton variant="ghost" label={dark ? '切换浅色主题' : '切换深色主题'} icon={dark ? <Sun size={17} /> : <Moon size={17} />} onClick={() => setDark(!dark)} /><IconButton ref={mobileTrigger} className="docs-mobile-toggle" variant="ghost" label={open ? '关闭文档导航' : '打开文档导航'} aria-expanded={open} aria-controls="docs-navigation" icon={open ? <X size={18} /> : <Menu size={18} />} onClick={() => { setOpen(!open); if (!open) requestAnimationFrame(() => searchRef.current?.focus()); }} /></div></header>
    <div className="docs-body">{open && <button className="docs-scrim" aria-label="关闭文档导航遮罩" onClick={() => { setOpen(false); mobileTrigger.current?.focus(); }} />}
      <aside ref={sidebarRef} id="docs-navigation" className={`docs-sidebar ${open ? 'is-open' : ''}`} aria-label="文档导航"><SearchInput ref={searchRef} label="搜索组件文档" placeholder="搜索组件… ⌘/Ctrl K" clearLabel="清空搜索" value={search} onChange={(event) => setSearch(event.target.value)} onClear={() => setSearch('')} /><h2>开始使用</h2><a href="#/installation" aria-current={!doc && !guide && !examples && !missing ? 'page' : undefined}>安装</a><a href="#/guide" aria-current={guide ? 'page' : undefined}>使用手册</a><nav aria-label="组件目录">{componentGroups.map((group) => { const entries = filtered.filter((item) => item.group === group); return entries.length ? <div key={group} className="docs-nav-group"><h2>{group}<span>{entries.length}</span></h2>{entries.map((item) => <a href={`#/components/${item.id}`} key={item.id} aria-current={id === item.id ? 'page' : undefined}>{item.name}</a>)}</div> : null; })}</nav>{!filtered.length && <p role="status">没有匹配的组件</p>}</aside>
      <main id="main-content" className="docs-main" ref={main} tabIndex={-1}><div className={`docs-content ${guide ? 'docs-guide' : ''}`}>
        {missing ? <><h1>页面不存在</h1><a href="#/installation">返回安装页</a></> : examples ? <><div className="docs-page-heading"><span className="docs-eyebrow">EXAMPLES</span><h1>示例</h1><p>由 Asharca UI 组合的工作区与 AI 界面。</p></div><a className="docs-example" href="#/examples/workspace" aria-label="打开工作区示例"><img src="./workspace-preview.png" alt="工作区示例：可折叠侧边栏、标签导航和组件工作台" width={1440} height={900} /><div><div><h2>工作区</h2><p>侧边栏、标签导航、项目管理与聊天界面。</p></div><ArrowRight size={20} aria-hidden="true" /></div></a><div className="docs-starter-links"><a href="#/components/chat-thread">聊天与流式输出<ArrowRight size={16} /></a><a href="#/components/tool-call-card">工具调用与审批<ArrowRight size={16} /></a><a href="#/components/data-table">排序、筛选与表格选择<ArrowRight size={16} /></a></div></> : doc ? <ComponentPage key={id} id={id} dark={dark} /> : guide ? <Suspense fallback={<Spinner label="加载使用手册" />}><Manual onNavigate={(view) => { window.location.hash = view === 'chat' ? '#/components/chat-thread' : '#/components/button'; }} /></Suspense> : <Installation />}
      </div></main>
      {!guide && !missing && !examples && <aside className="docs-toc"><span>本页目录</span>{toc.map(([target, label]) => <button key={target} onClick={() => document.getElementById(target)?.scrollIntoView({ block: 'start' })}>{label}</button>)}</aside>}
    </div>
  </div>;
}
