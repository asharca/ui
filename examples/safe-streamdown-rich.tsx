'use client';
import { useEffect, useRef, useState } from 'react';
import { SafeStreamdown } from '@/components/asharca/safe-streamdown';

const flow = '### 项目进展\n\n下面是本地示例数据，以及对应的审核流程。\n\n| 模块 | 负责人 | 状态 | 完成率 |\n| --- | --- | --- | ---: |\n| 任务发布 | 林一 | 已完成 | 100% |\n| 成果审核 | 陈宁 | 进行中 | 75% |\n| 交付归档 | 周可 | 待开始 | 0% |\n\n### 任务审核流程\n\n```mermaid\nflowchart LR\n  A[提交成果] --> B{审核通过?}\n  B -->|通过| C[完成交付]\n  B -->|修改| D[补充材料]\n  D --> A\n```\n\n图表由本地 Mermaid 渲染；可以切换源码、复制或放大。';
const sequence = '### 一次对话的消息流\n\n```mermaid\nsequenceDiagram\n  participant U as 用户\n  participant P as 输入组件\n  participant S as 应用服务\n  participant A as AI\n  U->>P: 输入问题\n  P->>S: onSend(text)\n  S->>A: 请求模型\n  A-->>S: 流式响应\n  S-->>U: 更新消息列表\n```\n\n实际模型调用由宿主应用负责，这里没有发送外部请求。';
export default function RichMarkdownDemo() {
  const [text, setText] = useState(flow);
  const [busy, setBusy] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; setBusy(false); };
  useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
  function show(value: string) { stop(); setText(value); }
  function stream() {
    stop(); setText(''); setBusy(true); let length = 0;
    timer.current = setInterval(() => { length += 18; setText(flow.slice(0, length)); if (length >= flow.length) stop(); }, 60);
  }
  const cls = 'rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring';
  return <div className="w-full max-w-3xl" data-demo="rich-markdown">
    <div className="mb-5 flex flex-wrap items-center gap-1 rounded-xl border border-border p-1" role="group" aria-label="富文本示例">
      <button type="button" className={cls} onClick={() => show(flow)}>表格与流程图</button>
      <button type="button" className={cls} onClick={() => show(sequence)}>时序图</button>
      <button type="button" className={cls} onClick={() => show('```mermaid\nflowchart LR\n  A[未完成节点\n```')}>错误回退</button>
      <button type="button" className={cls} onClick={busy ? stop : stream}>{busy ? '停止演示' : '模拟流式'}</button>
      <button type="button" className={cls} aria-pressed={enabled} onClick={() => setEnabled(!enabled)}>{enabled ? '关闭图表渲染' : '开启图表渲染'}</button>
    </div>
    <SafeStreamdown allowMermaid={enabled} mode={busy ? 'streaming' : 'static'}>{text}</SafeStreamdown>
    <details className="mt-5 text-xs text-muted-foreground"><summary className="cursor-pointer">编辑示例内容</summary><textarea aria-label="示例 Markdown" rows={8} disabled={busy} value={text} onChange={(event) => setText(event.target.value)} className="mt-3 w-full rounded-xl border border-border bg-background p-3 font-mono text-xs leading-6 outline-none focus-visible:ring-2 focus-visible:ring-ring" /></details>
  </div>;
}
