import { useEffect, useState } from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { Button } from '../../src/index';

// Optional motion: import @asharca/ui/themes.css and set data-ui-style="minimal".
export function GalleryButtonDemo() {
  const [state, setState] = useState<'idle' | 'saving' | 'saved'>('idle');
  useEffect(() => {
    if (state !== 'saving') return;
    const timer = window.setTimeout(() => setState('saved'), 900);
    return () => window.clearTimeout(timer);
  }, [state]);
  return <Button variant="primary" style={{ minWidth: 132, borderRadius: 999 }} loading={state === 'saving'} loadingLabel="保存中" onClick={() => setState(state === 'saved' ? 'idle' : 'saving')}><span key={state} className="ui-state-swap">{state === 'saved' ? <Check size={16} /> : <ArrowUpRight size={16} />}{state === 'saved' ? '已保存' : '保存更改'}</span></Button>;
}
