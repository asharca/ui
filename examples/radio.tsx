'use client';
import { useId } from 'react';
import { Radio } from '@/components/asharca/radio';
export default function RadioDemo() {
  const name = useId();
  return <fieldset className="grid w-full max-w-xs gap-4"><legend className="mb-4 text-sm font-medium">运行模式</legend><Radio name={name} value="manual" label="手动确认" description="每次运行前检查操作内容。" defaultChecked /><Radio name={name} value="auto" label="自动执行" description="实际权限仍由应用校验。" /><Radio name={name} value="locked" label="由组织管理" disabled /></fieldset>;
}
