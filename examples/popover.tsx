'use client';
import { useState } from 'react';
import { Button } from '@/components/asharca/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/asharca/popover';
export default function PopoverDemo() {
  const [density, setDensity] = useState('舒适');
  return <Popover><PopoverTrigger asChild><Button variant="outline">面板设置 · {density}</Button></PopoverTrigger><PopoverContent>
    <h3 className="font-medium">内容密度</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">选择适合你的阅读节奏。</p>
    <div className="mt-3 flex gap-1" role="group" aria-label="内容密度">{['紧凑', '舒适', '宽松'].map((item) => <Button key={item} variant={density === item ? 'secondary' : 'ghost'} size="sm" aria-pressed={density === item} onClick={() => setDensity(item)}>{item}</Button>)}</div>
  </PopoverContent></Popover>;
}
