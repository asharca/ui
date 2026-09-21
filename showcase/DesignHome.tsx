import { ArrowRight, ArrowUpRight, Check, Code2, Layers3, Terminal } from 'lucide-react';
import { Button } from '../src/Controls';
import { CopyButton } from '../src/Forms';
import { ActionSpecimen, AgentSpecimen, MotionSpecimen, ProjectSpecimen } from './StudioSpecimens';
import { ComponentTile } from './ComponentGallery';
import { componentDocs } from './ComponentDemos';
import { appExamples } from './examples/registry';
import { version } from '../package.json';

const featured = ['button', 'tabs', 'choice-field', 'tool-call-card', 'data-table', 'chat-composer-toolbar'];

export function DesignHome() {
  return <div className="studio-home">
    <section className="studio-hero"><a href="#/components" className="studio-announcement"><span />为 React 与 AI 应用而设计<ArrowUpRight size={12} /></a><h1>每个细节，<br /><span>都恰到好处。</span></h1><p>好看的界面，更应该好用。<br />从基础交互到 AI 工作流，把想法做成值得使用的产品。</p><div className="studio-hero-actions"><Button asChild variant="primary" size="lg"><a href="#/components">探索组件<ArrowRight size={16} /></a></Button><Button asChild variant="outline" size="lg"><a href="#/installation">开始构建<Code2 size={16} /></a></Button></div><div className="studio-install"><Terminal size={14} /><code>pnpm add @asharca/ui</code><CopyButton text="pnpm add @asharca/ui" label="复制安装命令" copiedLabel="已复制安装命令" failedLabel="复制失败" iconOnly /></div></section>
    <section className="studio-showroom" aria-labelledby="showroom-title"><div className="studio-section-heading"><div><span className="studio-kicker">THE INTERACTION STUDIO</span><h2 id="showroom-title">不只是展示，试着操作。</h2></div><span className="studio-caption"><span className="studio-live-dot" />所有预览均使用本库组件</span></div><div className="studio-bento">
      <article className="studio-showcase-card studio-project-card"><div className="studio-card-label"><span>01 / FOUNDATIONS</span><a href="#/components/choice-field" aria-label="查看表单组件"><ArrowUpRight size={15} /></a></div><ProjectSpecimen /></article>
      <article className="studio-showcase-card studio-agent-card"><div className="studio-card-label"><span>02 / AI NATIVE</span><a href="#/components/tool-call-card" aria-label="查看 AI 工具组件"><ArrowUpRight size={15} /></a></div><AgentSpecimen /></article>
      <div className="studio-bento-stack"><article className="studio-showcase-card"><div className="studio-card-label"><span>03 / IN MOTION</span><a href="#/components/tabs" aria-label="查看标签页组件"><ArrowUpRight size={15} /></a></div><MotionSpecimen /></article><article className="studio-showcase-card"><div className="studio-card-label"><span>04 / SMALL DETAILS</span><Check size={14} /></div><ActionSpecimen /></article></div>
    </div></section>
    <div className="studio-foundation-strip"><span>与你的技术栈，自然契合。</span><div><strong>React 19</strong><strong>TypeScript</strong><strong>Tailwind CSS 4</strong><strong>Radix</strong></div><span>{componentDocs.length} 个组件入口 · v{version}</span></div>
    <section className="studio-featured" aria-labelledby="featured-title"><div className="studio-section-heading"><div><span className="studio-kicker">LESS ASSEMBLY. MORE POSSIBILITY.</span><h2 id="featured-title">从这一块，开始构建。</h2><p>统一的设计语言，自由的组合方式。</p></div><a className="studio-text-link" href="#/components">浏览全部组件<ArrowRight size={15} /></a></div><div className="studio-catalog-grid">{featured.map((id) => componentDocs.find((doc) => doc.id === id)).filter((doc): doc is typeof componentDocs[number] => Boolean(doc)).map((doc) => <ComponentTile key={doc.id} doc={doc} />)}</div></section>
    <section className="studio-examples" aria-labelledby="examples-title"><div className="studio-section-heading"><div><span className="studio-kicker">FROM PARTS TO PRODUCTS</span><h2 id="examples-title">组件之外，完整的产品起点。</h2><p>在真实布局里，看见组件如何一起工作。</p></div><a className="studio-text-link" href="#/examples">全部应用示例<ArrowRight size={15} /></a></div><div className="studio-example-grid">{appExamples.slice(0, 3).map((example) => <a href={`#/examples/${example.id}`} key={example.id}><div className="studio-example-image"><img src={`${import.meta.env.BASE_URL}${example.image}`} alt={`${example.name}布局预览`} loading="lazy" width={1440} height={1000} /></div><div><h3>{example.name}<ArrowUpRight size={15} /></h3><p>{example.description}</p></div></a>)}</div></section>
    <section className="studio-closing"><Layers3 size={23} strokeWidth={1.5} /><h2>保留你的风格。<br /><span>把细节交给组件。</span></h2><p>Minimal、Tech、Glass。三套视觉表达，一致的交互约定。</p><div><Button variant="primary" asChild><a href="#/themes">进入主题实验室<ArrowRight size={15} /></a></Button><a className="studio-text-link" href="#/ai">让 AI 读懂这套组件<ArrowUpRight size={15} /></a></div></section>
    <footer className="studio-footer"><a href="#/home"><strong>asharca<span>/</span>ui</strong></a><span>为人，也为 AI 而设计。</span><nav aria-label="页脚导航"><a href="#/installation">文档</a><a href="#/ai">AI 参考</a><a href="https://github.com/asharca/ui" target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={12} /></a></nav></footer>
  </div>;
}
