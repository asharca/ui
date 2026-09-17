import { ArrowDownToLine, FileText } from 'lucide-react';
import { CopyButton } from '../src/Forms';
import { DocCode } from './DocCode';
import guide from '../docs/ai/README.md?raw';

const prompt = '请先阅读 @asharca/ui 的 AI 使用指南和目标组件 Markdown，核对项目实际安装版本。使用真实公开组件实现界面，单选与复选优先使用 ChoiceField / ChoiceGroup，保留原生 onChange、可访问名称和多行说明。参考 ToolPlane 的工具栏与审批交互，但把业务权限、传输和持久化留在宿主。不生成不存在的 shadcn 注册表或组件 API。完成后执行类型检查和相关测试，并报告实际结果。';

export function AIPage() {
  const base = import.meta.env.BASE_URL;
  return <>
    <div className="docs-page-heading"><span className="docs-eyebrow">开始使用 / AI</span><h1>给 AI 使用的文档</h1><p>把真实的组件接口、示例和接入边界交给编程助手，而不是让它猜。</p></div>
    <div className="docs-page-actions"><CopyButton text={guide} label="复制 AI 使用指南" copiedLabel="指南已复制" failedLabel="复制失败" /><a className="docs-outline-link" href={`${base}ai/README.md`}><FileText size={15} />查看 Markdown</a></div>
    <section id="ai-start"><h2>从正确的上下文开始</h2><p>在组件页点击“复制给 AI”，得到该组件的导入方式、主要 API、完整 TSX 示例和使用约束。需要整个库时，使用下面的机器可读文件。</p><div className="docs-resource-grid">
      <a href={`${base}llms.txt`}><FileText size={20} /><strong>llms.txt</strong><span>轻量索引 · 按需读取组件</span></a>
      <a href={`${base}llms-full.txt`} download><ArrowDownToLine size={20} /><strong>llms-full.txt</strong><span>完整参考 · 包含所有组件示例</span></a>
      <a href={`${base}ai/PATTERNS.md`}><FileText size={20} /><strong>组合模式</strong><span>选择控件、表格与 AI 聊天</span></a>
    </div></section>
    <section id="ai-contract"><h2>不要猜测组件接口</h2><div className="docs-callout"><strong>这是 npm 组件库，不是 shadcn CLI 注册表。</strong><p>文档体验参考 shadcn；安装和 API 仍以 @asharca/ui 的实际公开导出为准。当前优化分支尚未发布，工作区版本号不代表 npm 同版本已有新增接口。</p></div>
      <div className="docs-api-scroll"><table className="docs-api-table"><thead><tr><th>场景</th><th>正确约定</th></tr></thead><tbody><tr><td>Checkbox / Radio / ChoiceField</td><td>原生 onChange(event)，读取 target.checked 或 target.value。</td></tr><tr><td>Switch</td><td>使用 onCheckedChange(boolean)。</td></tr><tr><td>样式</td><td>Tailwind CSS 4 + @asharca/ui/styles.css。</td></tr><tr><td>ChatThread</td><td>宿主提供 runtime；服务端校验权限并执行工具。</td></tr><tr><td>版本</td><td>先核对已安装 exports；不要随意升级或绕过 peer 检查。</td></tr></tbody></table></div>
    </section>
    <section id="ai-prompt"><h2>可直接使用的任务模板</h2><div className="docs-prompt"><p>{prompt}</p><CopyButton text={prompt} label="复制任务模板" copiedLabel="已复制" failedLabel="复制失败" /></div></section>
    <section id="ai-generate"><h2>与代码一起更新</h2><p>网页、复制给 AI 的内容和生成的 Markdown 共用一个解析后的组件目录与真实示例。构建文档站时自动更新静态文件，AI 不需要执行 JavaScript 或读取 hash 路由。</p><DocCode label="重新生成 AI 文档" language="bash" code="pnpm docs:ai" /><p>仓库指南位于 docs/ai；发布包同时包含 dist/ai。新增组件时补齐目录、示例和测试，而不是维护另一套独立接口说明。</p></section>
  </>;
}
