import { useId, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Code2, Command, Layers3, Palette, Sparkles, Terminal, Wand2 } from 'lucide-react';
import { Button, Input, Switch } from '../src/Controls';
import { ChoiceField, ChoiceGroup } from '../src/ChoiceField';
import { CopyButton } from '../src/Forms';
import { ToolCallCard } from '../src/ToolCallCard';
import { catalogMetadata } from './catalog-data';
import { version } from '../package.json';

/** Real package controls, not a screenshot or a non-interactive illustration. */
function ComponentPreview() {
  const id = useId();
  const [project, setProject] = useState('My next idea');
  const [type, setType] = useState('agent');
  const [enabled, setEnabled] = useState(true);
  const [saved, setSaved] = useState(false);
  return <div className="landing-preview" aria-label="首页组件交互预览">
    <div className="landing-preview-top"><span><span className="landing-live-dot" />Component playground</span><span>LIVE PREVIEW</span></div>
    <div className="landing-preview-body">
      <div className="landing-preview-title"><span className="landing-app-icon"><Layers3 size={21} /></span><div><h2>从一个想法开始</h2><p>你的下一个应用，已经就绪。</p></div><span className="landing-preview-tag">React</span></div>
      <form onSubmit={(event) => { event.preventDefault(); setSaved(true); }} onChange={() => setSaved(false)}>
        <label className="landing-field" htmlFor={`${id}-name`}>项目名称<Input id={`${id}-name`} value={project} onChange={(event) => setProject(event.target.value)} required placeholder="为你的项目起个名字" /></label>
        <ChoiceGroup legend="选择起点"><div className="landing-choice-grid">
          <ChoiceField type="radio" name={`${id}-type`} label="应用界面" description="简洁、专注、高效" variant="card" value="app" checked={type === 'app'} onChange={() => setType('app')} />
          <ChoiceField type="radio" name={`${id}-type`} label="AI 工作流" description="从对话，到行动" variant="card" value="agent" checked={type === 'agent'} onChange={() => setType('agent')} />
        </div></ChoiceGroup>
        <div className="landing-switch-row"><label htmlFor={`${id}-stream`}>流式响应<span>让每一步进展清晰可见</span></label><Switch aria-label="流式响应" id={`${id}-stream`} checked={enabled} onCheckedChange={(value) => { setEnabled(value); setSaved(false); }} /></div>
        <div className="landing-preview-bottom"><span role="status">{saved ? '配置已保存 · 仅本地演示' : '可直接操作，试试看'}</span><Button type="submit" variant="primary" size="sm">{saved ? <Check size={14} /> : <Wand2 size={14} />}{saved ? '已保存' : '保存配置'}</Button></div>
      </form>
    </div>
    <div className="landing-preview-code"><code><span>import</span> {'{ Button, ChoiceField }'} <span>from</span> <em>"@asharca/ui"</em></code><Code2 size={14} aria-hidden="true" /></div>
  </div>;
}

const collections = [
  { number: '01', icon: Command, title: '基础，精确到每个状态。', description: '按钮、输入与选择控件。统一的尺寸、焦点、错误与禁用反馈。', link: '#/components/button', label: '探索基础控件', tags: ['Button', 'Input', 'ChoiceField'] },
  { number: '02', icon: Layers3, title: '组合，不必从零开始。', description: '布局、数据与导航。把小而专注的组件，组合成完整的产品体验。', link: '#/components/data-table', label: '探索布局与数据', tags: ['Card', 'DataTable', 'Dialog'] },
  { number: '03', icon: Sparkles, title: '为 AI，留好下一步。', description: '对话、工具调用与审批。让复杂任务保持清晰，让用户始终掌控。', link: '#/components/chat-thread', label: '探索 AI 组件', tags: ['ChatThread', 'ToolCallCard'] },
];

export function DesignHome() {
  return <div className="landing">
    <section className="landing-hero">
      <div className="landing-copy"><a className="landing-eyebrow" href="#/components"><span className="landing-live-dot" />为 React 与 AI 应用而设计<ArrowUpRight size={13} /></a>
        <h1>更少的复杂。<br /><span>更好的界面。</span></h1>
        <p>从一颗按钮，到完整的 AI 工作流。<br className="landing-desktop-break" />精心设计、自由组合，让你的想法更快成为产品。</p>
        <div className="landing-actions"><Button asChild variant="primary" size="lg"><a href="#/installation">开始构建<ArrowRight size={16} /></a></Button><Button asChild variant="outline" size="lg"><a href="#/components">浏览组件<Layers3 size={16} /></a></Button></div>
        <div className="landing-install"><Terminal size={15} aria-hidden="true" /><code>pnpm add @asharca/ui</code><CopyButton text="pnpm add @asharca/ui" iconOnly label="复制安装命令" copiedLabel="已复制安装命令" failedLabel="复制失败" /></div>
        <p className="landing-install-note">文档 v{version} · 以已安装包的版本和导出为准。</p>
      </div>
      <div className="landing-visual"><ComponentPreview /><div className="landing-visual-caption"><span>你看到的，就是你将使用的组件。</span><span>01 / COMPOSABLE UI</span></div></div>
    </section>
    <div className="landing-proof"><span>为你的技术栈而生</span><strong>React</strong><strong>TypeScript</strong><strong>Tailwind CSS</strong><strong>Radix</strong><span className="landing-count">{catalogMetadata.length} 个组件入口<ArrowUpRight size={14} /></span></div>
    <section className="landing-collection" aria-labelledby="collection-title"><div className="landing-section-heading"><div><span className="landing-kicker">SMALL PARTS. BIG POSSIBILITIES.</span><h2 id="collection-title">从细节出发，构建完整体验。</h2></div><a href="#/components">所有组件<ArrowRight size={16} /></a></div>
      <div className="landing-collection-grid">{collections.map(({ number, icon: Icon, title, description, link, label, tags }) => <a href={link} key={number}><div className="landing-collection-top"><Icon size={23} strokeWidth={1.5} /><span>{number}</span></div><h3>{title}</h3><p>{description}</p><div className="landing-collection-tags">{tags.map((tag) => <code key={tag}>{tag}</code>)}</div><span className="landing-text-link">{label}<ArrowUpRight size={15} /></span></a>)}</div>
    </section>
    <section className="landing-ai" aria-labelledby="ai-design-title"><div><span className="landing-kicker">BUILT FOR WHAT'S NEXT</span><h2 id="ai-design-title">不只是聊天框。<br />是一套 AI 界面语言。</h2><p>思考、调用、审批、结果。用一致的交互表达每个阶段，把模型与业务逻辑留给你的应用。</p><a className="landing-text-link" href="#/components/tool-call-card">查看工具调用组件<ArrowRight size={16} /></a><a className="landing-text-link" href="#/ai">让编程助手读懂组件<ArrowRight size={16} /></a></div><div className="landing-ai-example"><header><span className="landing-app-icon"><Sparkles size={18} /></span><div><strong>让每次行动，都有迹可循</strong><span>可展开的工具调用 · 静态示例数据</span></div></header><ToolCallCard name="design__components" state="completed" presentation={{ label: '读取组件文档', kind: 'mcp', description: '展示示例数据，不会发起网络请求。' }} output={{ components: ['Button', 'Input', 'ChoiceField'], source: 'local example' }} labels={{ completed: '已完成', output: '示例结果', copy: '复制内容', showMore: '显示完整内容', showLess: '收起内容' }} /><div className="landing-ai-answer"><Check size={17} /><p>交互已准备好。<span>接入你的 runtime，构建属于你的助手。</span></p></div><a href="#/themes">打开完整工作台预览<ArrowUpRight size={14} /></a></div></section>
    <section className="landing-bottom"><div><Palette size={23} /><h2>你的产品，你的风格。</h2><p>Minimal、Tech、Glass。共享交互约定，不限制视觉表达。</p></div><Button asChild variant="outline"><a href="#/themes">探索三套风格<ArrowRight size={16} /></a></Button></section>
    <footer className="landing-footer"><a href="#/home"><strong>asharca<span>/</span>ui</strong></a><span>为人，也为 AI 而设计。</span><nav aria-label="页脚导航"><a href="#/installation">文档</a><a href="#/ai">AI 参考</a><a href="https://github.com/asharca/ui" target="_blank" rel="noreferrer">GitHub<ArrowUpRight size={12} /></a></nav></footer>
  </div>;
}
