'use client';
import { useState } from 'react';
import { Progress } from '@/components/asharca/progress';
export default function ProgressDemo() {
  const [value, setValue] = useState(45);
  return <div className="grid w-full max-w-xs gap-5"><Progress label="文件处理" value={value} /><Progress label="正在准备" /><button type="button" className="justify-self-start rounded text-xs text-muted-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setValue((current) => current >= 100 ? 0 : Math.min(100, current + 15))}>推进演示进度</button></div>;
}
