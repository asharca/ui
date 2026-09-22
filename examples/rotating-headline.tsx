import { RotatingHeadline } from '@/components/asharca/rotating-headline';
export default function RotatingHeadlineDemo() {
  return <div className="text-center"><p className="text-2xl font-semibold tracking-tight">为 <RotatingHeadline words={['清晰', '专注', '创造']} className="min-w-[2.3em] text-left" /> 而设计。</p><p className="mt-4 text-xs text-muted-foreground">减少动态效果时，文字保持静止。</p></div>;
}
