'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/asharca/card';
export default function CardDemo() {
  const [saved, setSaved] = useState(false);
  return <Card className="w-full max-w-xs"><CardHeader><div><CardTitle>项目概览</CardTitle><CardDescription>把内容放在界面的中心。</CardDescription></div></CardHeader><CardContent><p className="text-xs leading-6 text-muted-foreground">标题、正文和操作共享同一套间距。无需为每块内容增加一层容器。</p></CardContent><CardFooter><button type="button" className="rounded-lg bg-primary px-3 py-2 text-xs text-primary-foreground focus-visible:outline-2 focus-visible:outline-ring" onClick={() => setSaved(!saved)}>{saved ? '已收藏' : '收藏项目'}</button></CardFooter></Card>;
}
