'use client';
import { useId } from 'react';
import { ChoiceField, ChoiceGroup } from '@/components/asharca/choice-field';
export default function ChoiceFieldDemo() {
  const name = useId();
  return <ChoiceGroup label="选择工作方式" className="w-full max-w-sm"><ChoiceField type="radio" name={name} value="local" variant="card" label="本地工作区" description="内容保留在当前项目，由你管理文件和版本。" defaultChecked /><ChoiceField type="radio" name={name} value="team" variant="card" label="团队工作区" description="与成员一起检查和整理工作。" /></ChoiceGroup>;
}
