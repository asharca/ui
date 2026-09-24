'use client';
import { useState } from 'react';
import { ThinkingShimmer, ReasoningText, AgentProgress } from '@/components/asharca/agent-loading-states';
export default function Demo() { const [running, setRunning] = useState(true); return <div className="w-full max-w-sm space-y-6"><ThinkingShimmer>正在思考</ThinkingShimmer><ReasoningText phrases={['检查输入', '连接上下文', '准备回复']} variant="cascade" /><ReasoningText phrases={['读取源码', '验证结果']} variant="swap" /><ReasoningText phrases={['准备迁移', '核对接口']} variant="scramble" /><AgentProgress label="处理任务" running={running} /><button className="rounded-lg border border-border px-3 py-2 text-xs" onClick={() => setRunning(!running)}>{running ? '暂停计时' : '继续计时'}</button></div>; }
