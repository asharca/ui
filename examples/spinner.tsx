import { Spinner } from '@/components/asharca/spinner';
export default function SpinnerDemo() { return <div className="grid justify-items-center gap-6"><Spinner label="正在加载工作区…" /><span className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5"><Spinner /><span className="text-xs">加载指示样式</span></span></div>; }
