'use client';
import { useEffect, useRef, useState } from 'react';
import { SubmitButton } from '@/components/asharca/submit-button';
export default function SubmitButtonDemo() {
  const [pending, setPending] = useState(false); const [saved, setSaved] = useState(false); const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <form onSubmit={(event) => { event.preventDefault(); if (pending) return; setPending(true); setSaved(false); timer.current = setTimeout(() => { setPending(false); setSaved(true); }, 750); }} className="grid justify-items-center gap-3"><SubmitButton pending={pending} saved={saved}>保存更改</SubmitButton><p className="text-xs text-muted-foreground">本地提交演示，不发送网络请求。</p></form>;
}
