import { CopyButton } from '../src/Forms';
import { HighlightedCode, type CodeLanguage } from './HighlightedCode';

export function DocCode({ code, label, language = 'tsx' }: { code: string; label: string; language?: CodeLanguage }) {
  return <div className="docs-code">
    <header><span>{label}</span><CopyButton text={code} label={`复制 ${label}`} copiedLabel="已复制" failedLabel="复制失败" copyingLabel="复制中…" iconOnly /></header>
    <HighlightedCode code={code} language={language} label={label} />
  </div>;
}
