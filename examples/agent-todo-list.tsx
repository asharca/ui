'use client';
import { useState } from 'react';
import { TodoList } from '@/components/asharca/agent-todo-list';
export default function Demo() { const [step, setStep] = useState(1); return <div className="w-full max-w-xl space-y-3"><TodoList title="迁移计划" items={['核对源码许可', '适配安装依赖', '验证交互和主题'].map((title, i) => ({ id: String(i), title, status: i < step ? 'completed' : i === step ? 'in-progress' : 'pending', progress: 45 }))} /><button className="rounded-lg border border-border px-3 py-2 text-xs" onClick={() => setStep((value) => (value + 1) % 4)}>{step === 3 ? '重播计划' : '完成当前步骤'}</button></div>; }
