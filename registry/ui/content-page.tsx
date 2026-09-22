import type { ReactNode } from 'react';
import { cn } from './utils';
export interface ContentPageProps { title: ReactNode; description?: ReactNode; children: ReactNode; headingLevel?: 1 | 2; className?: string }
export function ContentPage({ title, description, children, headingLevel = 1, className }: ContentPageProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return <article className={cn('mx-auto w-full max-w-2xl space-y-5 text-sm leading-7', className)}><header><Heading className="text-2xl font-semibold tracking-tight">{title}</Heading>{description && <p className="mt-2 text-muted-foreground">{description}</p>}</header><div className="space-y-4 [&_h2]:mt-6 [&_h2]:text-base [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5 [&_a]:underline [&_a]:underline-offset-4">{children}</div></article>;
}
