'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from './utils';
export interface RotatingHeadlineProps { words: string[]; interval?: number; className?: string }
export function RotatingHeadline({ words, interval = 2600, className }: RotatingHeadlineProps) {
  const [index, setIndex] = useState(0); const reduce = useReducedMotion();
  useEffect(() => { if (reduce || words.length < 2) return; const timer = setInterval(() => setIndex((value) => value + 1), Math.max(1200, interval)); return () => clearInterval(timer); }, [interval, words.length, reduce]);
  const word = words.length ? words[(reduce ? 0 : index) % words.length] : '';
  return <span className={cn('inline-grid overflow-hidden align-bottom', className)}><span className="sr-only">{words.join('、')}</span><AnimatePresence mode="wait" initial={false}>
    <motion.span aria-hidden="true" key={word} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -10 }} transition={{ duration: reduce ? 0 : 0.18 }}>{word || '\u00a0'}</motion.span>
  </AnimatePresence></span>;
}
