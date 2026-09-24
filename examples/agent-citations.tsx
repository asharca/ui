'use client';
import { Citation, Citations } from '@/components/asharca/agent-citations';
const sources = [{ id: 'beui', title: 'beUI · Agent 组件', domain: 'beui.dev', url: 'https://beui.dev/components/agents' }, { id: 'shadcn', title: 'shadcn · Registry', domain: 'ui.shadcn.com', url: 'https://ui.shadcn.com/docs/registry' }];
export default function Demo() { return <div className="w-full max-w-xl space-y-4"><p className="text-sm leading-7">组件来自可修改的源码<Citation citationId="beui" index={1} idPrefix="agent-demo-sources" />，通过 Registry 分发<Citation citationId="shadcn" index={2} idPrefix="agent-demo-sources" />。</p><Citations citations={sources} title="参考来源" idPrefix="agent-demo-sources" defaultOpen /></div>; }
