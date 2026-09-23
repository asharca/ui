'use client';
import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/asharca/button';
export default function ButtonStatesDemo() {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return <div className="flex flex-wrap items-center justify-center gap-3">
    <Button className="min-w-28" loading={state === 'saving'} onClick={() => { setState('saving'); timer.current = setTimeout(() => setState('saved'), 800); }}>
      {state === 'saved' && <Check className="size-4" />}{state === 'saving' ? '保存中' : state === 'saved' ? '已保存' : '保存更改'}
    </Button>
    <Button variant="outline" disabled>不可用</Button>
    <Button variant="danger" size="sm">危险操作</Button>
  </div>;
}
