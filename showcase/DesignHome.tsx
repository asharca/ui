import { ArrowRight, ArrowUpRight, Code2 } from 'lucide-react';
import { Button } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { ComponentTile } from './ComponentGallery';
import { componentDocs } from './ComponentDemos';
import { ReferenceShowroom } from './ReferenceShowroom';
import { appExamples } from './examples/registry';
import { version } from '../package.json';

const featured = ['tool-call-card', 'chat-composer-toolbar', 'choice-field', 'tabs', 'data-table', 'button'];

export function DesignHome() {
  return <div className="studio-home ref-home">
    <header className="ref-hero"><div><span className="ref-eyebrow"><span />OPEN SOURCE COMPONENT COLLECTION <span className="ref-version">v{version}</span></span><h1>让每个细节，<br /><span>都值得停留。</span></h1></div><div className="ref-hero-aside"><p>有质感的组件，有回应的交互。<br />为你的下一个 React 与 AI 产品，找到灵感。</p><div><Button asChild variant="primary"><a href="#/components">探索组件<ArrowRight size={15} /></a></Button><Button asChild variant="outline"><a href="#/installation">开始构建<Code2 size={15} /></a></Button></div><div className="ref-install"><code>pnpm add @asharca/ui</code><CopyButton text="pnpm add @asharca/ui" label="复制安装命令" copiedLabel="已复制安装命令" failedLabel="复制失败" iconOnly /></div></div></header>
    <ReferenceShowroom />
    <section className="ref-components" aria-labelledby="featured-title"><div className="ref-section-heading"><div><span className="ref-eyebrow">THE BUILDING BLOCKS</span><h2 id="featured-title">不止好看，拿来就能用。</h2></div><a href="#/components">浏览 {componentDocs.length} 个组件<ArrowUpRight size={15} /></a></div><div className="studio-catalog-grid ref-catalog-grid">{featured.flatMap((id) => componentDocs.find((doc) => doc.id === id) ?? []).map((doc) => <ComponentTile key={doc.id} doc={doc} />)}</div></section>
    <section className="ref-apps" aria-labelledby="examples-title"><div className="ref-section-heading"><div><span className="ref-eyebrow">PUT IT TOGETHER</span><h2 id="examples-title">从组件，到完整体验。</h2></div><a href="#/examples">应用示例<ArrowUpRight size={15} /></a></div><div className="studio-example-grid">{appExamples.slice(0, 3).map((example) => <a href={`#/examples/${example.id}`} key={example.id}><div className="studio-example-image"><img src={`${import.meta.env.BASE_URL}${example.image}`} alt={`${example.name}布局预览`} loading="lazy" width={1440} height={1000} /></div><div><h3>{example.name}<ArrowUpRight size={15} /></h3><p>{example.description}</p></div></a>)}</div></section>
    <footer className="studio-footer ref-footer"><a href="#/home"><strong>asharca / ui</strong></a><span>React · TypeScript · 为人和 AI 而设计</span><nav aria-label="页脚导航"><a href="#/installation">文档</a><a href="#/themes">主题</a><a href="#/ai">AI 参考</a><a href="https://github.com/asharca/ui" target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={12} /></a></nav></footer>
  </div>;
}
