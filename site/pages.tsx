import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronRight, Code2, Search } from 'lucide-react';
import { catalog, groups } from '../registry/catalog.mjs';
import { PageActions } from './page-actions';
import { ApiReference } from './api-reference';
import { CodeBlock } from './code';
import { ExampleSection, Preview } from './preview';
import { Installation, InstallCommand } from './registry';
import { publicPath, registryUrl, runners, usePreferences } from './preferences';

type CatalogEntry = (typeof catalog)[number];
function ComponentCard({ entry }: { entry: CatalogEntry }) {
  return <article className="component-card" data-component={entry.slug} data-wide={entry.wide || undefined} style={entry.wide ? { gridColumn: '1 / -1' } : undefined}>
    <div className="card-preview" style={entry.wide ? { height: 'auto', minHeight: 330, padding: 'clamp(16px, 3vw, 28px)' } : undefined}><Preview name={entry.examples[0]} /></div>
    <div className="card-caption"><div><Link to={`/components/${entry.slug}`}>{entry.name}</Link><p>{entry.description}</p></div><Link className="card-arrow" to={`/components/${entry.slug}`} aria-label={`查看 ${entry.name}`}><ArrowUpRight size={17} /></Link></div>
  </article>;
}
export function HomePage() {
  const featured = ['button', 'tabs', 'switch', 'input', 'checkbox', 'radio-group', 'prompt-input', 'tool-result', 'data-table', 'chart-container'];
  return <main id="main-content" tabIndex={-1} className="home-page">
    <section className="hero"><span className="hero-eyebrow"><span />{catalog.length} 个组件 · 开放源码</span><h1>简约的组件。<br />属于你的源码。</h1><p>为 React 与 AI 界面而写。<br className="mobile-break" />预览、安装，直接在项目中修改。</p><div className="hero-actions"><Link to="/components" className="site-cta">浏览组件<ArrowRight size={15} /></Link><Link to="/docs/installation" className="site-cta secondary">开始使用</Link></div></section>
    <section className="home-install" aria-label="安装组件"><p>React · Tailwind CSS · Motion</p><InstallCommand /><Link to="/docs/installation" className="installation-hint">首次使用？先配置项目 <ArrowUpRight size={12} /></Link></section>
    <section className="home-components"><div className="section-heading"><div><span className="eyebrow">COMPONENTS</span><h2>从一个组件开始。</h2></div><Link to="/components">查看全部组件<ArrowRight size={15} /></Link></div><div className="component-grid">{featured.map((slug) => <ComponentCard key={slug} entry={catalog.find((entry) => entry.slug === slug)!} />)}</div></section>
  </main>;
}
export function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const requested = params.get('group') || '全部';
  const group = groups.includes(requested) ? requested : '全部';
  const query = params.get('q') || '';
  const visible = catalog.filter((entry) => (group === '全部' || entry.group === group) && `${entry.name} ${entry.slug} ${entry.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  function change(key: string, value: string) {
    // BrowserRouter writes history before a concurrent render finishes. Reading
    // that current URL prevents a fast input event from restoring an old group.
    const next = new URLSearchParams(window.location.search);
    if (value && value !== '全部') next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  }
  return <article>
    <div className="page-heading page-heading-actions"><div><span className="eyebrow">COLLECTION</span><h1>{group === '全部' ? '组件' : group}</h1><p>按需安装，让源码成为项目的一部分。</p></div><PageActions route="/components" /></div>
    <div className="catalog-toolbar" style={{ flexWrap: 'wrap' }}><div className="category-tabs" role="group" aria-label="组件分类">{['全部', ...groups].map((name) => <button type="button" key={name} aria-pressed={group === name} onClick={() => change('group', name)}>{name}</button>)}</div><label className="catalog-search"><Search size={14} /><span className="sr-only">筛选组件</span><input value={query} onChange={(event) => change('q', event.target.value)} placeholder="筛选组件…" /></label></div>
    <p className="catalog-count" aria-live="polite">{visible.length} 个组件</p><div className="component-grid">{visible.map((entry) => <ComponentCard key={entry.slug} entry={entry} />)}</div>
    {!visible.length && <div className="empty-state"><h2>没有找到组件</h2><button type="button" className="text-button" onClick={() => setParams({})}>清除筛选</button></div>}
  </article>;
}
export function ComponentPage() {
  const { slug } = useParams();
  const entry = catalog.find((item) => item.slug === slug);
  if (!entry) return <NotFound inline />;
  const index = catalog.indexOf(entry);
  return <article>
    <div className="breadcrumb"><Link to="/components">组件</Link><ChevronRight size={12} /><span>{entry.group}</span></div>
    <div className="page-heading component-heading"><div><h1>{entry.name}</h1><p>{entry.description}</p></div><div className="component-page-actions"><PageActions route={`/components/${entry.slug}`} /><a className="registry-link" href={registryUrl(entry.slug)} aria-label="查看组件安装清单"><Code2 size={15} />JSON</a></div></div>
    <div id="preview">{entry.examples.map((name, index) => <ExampleSection key={name} slug={entry.slug} name={name} title={index === 0 ? '预览' : entry.slug === 'workspace-shell' ? '不带标签栏的工作区' : '状态与反馈'} />)}</div>
    <section id="installation" className="doc-section"><h2>安装</h2><Installation slug={entry.slug} /><p className="small-note">已有 shadcn 项目可以直接添加。首次使用请先完成<Link to="/docs/installation">项目配置</Link>。</p></section>
    <ApiReference key={entry.slug} slug={entry.slug} />
    <section id="notes" className="doc-section"><h2>使用约定</h2><p className="reading-note">预览和安装清单使用同一份源码。Usage 是上方演示的完整代码；API Reference 与 Markdown 从同一份类型信息生成。导入路径根据你的项目配置调整。</p>{entry.group === 'AI 组件' && <p className="reading-note">这里只提供界面与交互。模型调用、权限校验、持久化和流式状态由应用提供；演示不会连接外部模型。</p>}{entry.slug === 'safe-streamdown' && <p className="reading-note">保留原组件名称；源码版使用 react-markdown 与 GFM 重新实现，不依赖旧聊天运行时。默认忽略原始 HTML，远程图片需要显式启用。</p>}{entry.slug === 'workspace-shell' && <p className="reading-note">为 WorkspaceShell 提供明确高度，并给 WorkspaceSidebar 与 WorkspaceTabBar 设置 variant="inset"。不带标签栏时自动保留顶部留白。scroll="content" 只滚动正文；聊天、编辑器或分栏使用 scroll="none" 并由子区域管理滚动。通过 contentProps 传入面板 id、role 和 aria-labelledby，路由与未保存确认仍由应用负责。背景、圆角和留白可用 --workspace-shell-background、--workspace-surface、--workspace-radius 与 --workspace-gap 调整，不覆盖全局主题。</p>}{entry.slug === 'workspace-tab-bar' && <p className="reading-note">关闭和重排由应用处理。未保存内容的确认应放在 onClose 中；固定标签和最后一个标签不会直接关闭。</p>}</section>
    <nav className="page-pagination" aria-label="相邻组件">{index > 0 ? <Link to={`/components/${catalog[index - 1].slug}`}>← {catalog[index - 1].name}</Link> : <span />}{index < catalog.length - 1 && <Link to={`/components/${catalog[index + 1].slug}`}>{catalog[index + 1].name} →</Link>}</nav>
  </article>;
}
export function InstallationPage() {
  const { manager } = usePreferences();
  const pattern = `${new URL(publicPath('r/'), window.location.origin).href}{name}.json`;
  return <article>
    <div className="page-heading page-heading-actions"><div><span className="eyebrow">GET STARTED</span><h1>把组件带进项目。</h1><p>使用 shadcn 安装源码。不发布独立组件包。</p></div><PageActions route="/docs/installation" /></div>
    <section id="requirements" className="doc-section"><h2>1. 准备项目</h2><p className="reading-note">需要 React 19、TypeScript 和 Tailwind CSS 4。已有 components.json 的项目可以跳过初始化。</p><CodeBlock language="bash" label="在项目目录执行" code={`${runners[manager]} init`} /><p className="small-note">初始化由官方 shadcn CLI 完成。组件沿用项目的主题变量，不覆盖已有配色。</p></section>
    <section id="add" className="doc-section"><h2>2. 添加组件</h2><InstallCommand /><p className="reading-note">命令会添加完整的源码文件与所需依赖。默认写入 components/asharca；有 src 目录或自定义别名时，按 components.json 解析。</p></section>
    <section id="use" className="doc-section"><h2>3. 从本地导入</h2><CodeBlock label="App.tsx" code={'import { Button } from "@/components/asharca/button";\n\nexport default function App() {\n  return <Button>开始使用</Button>;\n}'} /><p className="small-note">这里的 @/ 是示例别名。组件之间使用相对导入，可以随项目的组件目录一起移动。</p></section>
    <section id="namespace" className="doc-section"><h2>可选：配置简写命令</h2><p className="reading-note">把 registries 字段合并到现有 components.json 中，不要替换其他配置。</p><CodeBlock language="json" label="components.json · 合并字段" code={JSON.stringify({ registries: { '@asharca': pattern } }, null, 2)} /><CodeBlock language="bash" label="配置后使用" code={`${runners[manager]} add @asharca/button`} /><p className="small-note">@asharca 是配置在项目中的安装源别名，不是另一个包，也不假设它已加入官方公共命名空间。</p></section>
    <section className="doc-section"><h2>手动安装与更新</h2><p className="reading-note">每个组件页面的 Manual 标签列出全部依赖和源码文件。无论哪种安装方式，拿到的都是相同源码。更新前先检查差异，不要直接覆盖自己修改过的文件。</p><Link className="text-link" to="/components">浏览组件 <ArrowRight size={15} /></Link></section>
  </article>;
}
export function NotFound({ inline = false }: { inline?: boolean }) {
  const Container = inline ? 'div' : 'main';
  return <Container id={inline ? undefined : 'main-content'} tabIndex={-1} className="not-found"><span className="eyebrow">404</span><h1>这里还没有内容。</h1><Link to="/components" className="site-cta">浏览组件 <ArrowRight size={15} /></Link></Container>;
}
