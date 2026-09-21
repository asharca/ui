import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';

export function CopyButton({ text, label = '复制代码' }: { text: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text); setState('copied');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState('idle'), 1800);
    } catch { setState('error'); }
  }
  return <button type="button" className="copy-button" aria-label={state === 'copied' ? '已复制' : label} onClick={() => void copy()}>
    {state === 'copied' ? <Check size={14} /> : <Copy size={14} />}<span role="status">{state === 'copied' ? '已复制' : state === 'error' ? '复制失败' : '复制'}</span>
  </button>;
}
export function CodeBlock({ code, language = 'tsx', label }: { code: string; language?: string; label?: string }) {
  const grammar = Prism.languages[language];
  return <div className="code-block"><div className="code-heading"><span>{label ?? language.toUpperCase()}</span><CopyButton text={code} /></div>
    <pre tabIndex={0} aria-label={label ?? '代码'}>{grammar ? <code dangerouslySetInnerHTML={{ __html: Prism.highlight(code, grammar, language) }} /> : <code>{code}</code>}</pre>
  </div>;
}
