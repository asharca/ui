import { CopyButton } from '@/components/asharca/copy-button';
export default function CopyButtonDemo() {
  return <div className="grid w-full max-w-xs gap-4"><div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border bg-muted/30 p-3"><code className="truncate text-xs">pnpm dev</code><CopyButton text="pnpm dev" label="复制命令" iconOnly /></div><div className="flex justify-center"><CopyButton text="简约的组件，属于你的源码。" label="复制文字" /></div></div>;
}
