import Markdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import template from '../docs/updating.md?raw';
import { renderUpdateGuide, splitUpdateGuide } from '../scripts/update-guide.mjs';
import { CodeBlock } from './code';
import { PageActions } from './page-actions';
import { managers, publicPath, runners, usePreferences } from './preferences';
import './updating.css';

const markdownComponents: Components = {
  // CodeBlock supplies its own pre and copy button; avoid nested pre elements.
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const language = className?.match(/(?:^|\s)language-([^\s]+)/)?.[1];
    return language ? <CodeBlock language={language} code={String(children).replace(/\n$/, '')} /> : <code className={className}>{children}</code>;
  },
  table: ({ children }) => <div className="update-table-scroll" tabIndex={0} role="region" aria-label="更新处理方式表格"><table>{children}</table></div>,
};

export function UpdatingPage() {
  const { manager, setManager } = usePreferences();
  const site = new URL(publicPath(''), window.location.origin).href;
  const guide = splitUpdateGuide(renderUpdateGuide(template, site, runners[manager]));
  return <article className="update-guide">
    <div className="page-heading page-heading-actions"><div><span className="eyebrow">维护指南</span><h1>{guide.title}</h1><p>检查差异、保留定制，让升级可审查、可回退。</p></div><PageActions route="/docs/updating" /></div>
    <div className="update-guide-toolbar"><span>命令使用</span><div className="category-tabs" role="group" aria-label="更新命令包管理器">{managers.map((name) => <button type="button" key={name} aria-pressed={manager === name} onClick={() => setManager(name)}>{name}</button>)}</div></div>
    <p className="small-note">此处切换只影响命令展示，不会执行更新。Copy Page 提供同源指南，统一使用 npx 示例。</p>
    <div className="update-prose"><Markdown remarkPlugins={[remarkGfm]} components={markdownComponents} skipHtml>{guide.intro}</Markdown></div>
    {guide.sections.map((section) => <section key={section.id} id={section.id} className="doc-section update-prose" aria-labelledby={`update-${section.id}`}>
      <h2 id={`update-${section.id}`}>{section.title}</h2>
      <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents} skipHtml>{section.markdown}</Markdown>
    </section>)}
    <nav className="page-pagination" aria-label="相邻文档"><Link to="/docs/installation">← 安装</Link><Link to="/components">浏览组件 →</Link></nav>
  </article>;
}
