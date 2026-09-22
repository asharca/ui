'use client';
import { useState } from 'react';
import { Chip } from '@/components/asharca/chip';
export default function ChipDemo() {
  const [selected, setSelected] = useState('全部');
  return <div className="grid justify-items-center gap-4"><div role="group" aria-label="内容筛选" className="flex flex-wrap justify-center gap-2">{['全部', '组件', '示例', '文档'].map((label) => <Chip key={label} active={selected === label} onClick={() => setSelected(label)}>{label}</Chip>)}</div><p role="status" className="text-xs text-muted-foreground">当前筛选：{selected}</p></div>;
}
