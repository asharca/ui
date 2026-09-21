import { ArrowUpRight, Box } from 'lucide-react';
import { CopyButton } from '../src/Forms';
import { DocCode } from './DocCode';
import guide from '../docs/ai/README.md?raw';
import { version } from '../package.json';

export function AIPage() {
  const base = import.meta.env.BASE_URL;
  return <div className="ex-document ex-ai"><header className="ex-page-title"><span className="ex-hero-mark" aria-hidden="true"><Box size={22} strokeWidth={1.5} /></span><h1>AI 文档</h1><p>让编程助手使用真实组件，而不是猜测接口。</p></header>
    <section id="ai-start"><h2>安装 Skill</h2><DocCode label="安装 Skill" language="bash" code="npx skills add asharca/ui" /><p>选择你的编程助手与安装范围。Skill 本身不会安装组件依赖。</p></section>
    <section id="ai-prompt"><h2>开始使用</h2><DocCode label="示例任务" language="bash" code="使用 asharca-ui skill，制作一个带工具审批的聊天界面。" /></section>
    <section id="ai-contract"><h2>直接读取文档</h2><div className="ex-resource-list">{[['llms.txt', 'llms.txt'], ['llms-full.txt', 'llms-full.txt'], ['ai/PATTERNS.md', '组合模式']].map(([path, label]) => <a key={path} href={`${base}${path}`}>{label}<ArrowUpRight size={14} /></a>)}</div><CopyButton text={guide} label="复制 AI 使用指南" copiedLabel="指南已复制" failedLabel="复制失败" /></section>
    <section id="ai-generate"><h2>与组件同步</h2><p>组件页提供完整示例、API 与“复制给 AI”。</p><DocCode label="重新生成 AI 文档" language="bash" code="pnpm docs:ai" /></section>
    <p className="ex-version">文档 v{version} · npm 组件库，不是 shadcn 注册表。</p>
  </div>;
}
