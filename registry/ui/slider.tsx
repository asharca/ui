'use client';
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cn, focusRing } from './utils';

export interface SliderProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'value' | 'defaultValue'> { label: ReactNode; value?: number; defaultValue?: number; formatValue?: (value: number) => string; wrapperClassName?: string }
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, value, defaultValue = 50, min = 0, max = 100, formatValue = String, wrapperClassName, id: suppliedId, className, onChange, ...props }, ref,
) {
  const id = useId(); const input = useRef<HTMLInputElement>(null);
  const [internal, setInternal] = useState(defaultValue);
  useImperativeHandle(ref, () => input.current!, []);
  useEffect(() => {
    const form = input.current?.form;
    const reset = () => { if (value === undefined) setInternal(defaultValue); };
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [value, defaultValue]);
  const current = value ?? internal;
  return <div className={cn('grid w-full gap-3 text-sm', wrapperClassName)}>
    <div className="flex items-center justify-between gap-4"><label htmlFor={suppliedId ?? id} className="font-medium">{label}</label><output className="font-mono text-xs tabular-nums text-muted-foreground">{formatValue(current)}</output></div>
    <input {...props} ref={input} id={suppliedId ?? id} type="range" min={min} max={max} {...(value !== undefined ? { value } : { defaultValue })} aria-valuetext={formatValue(current)}
      onChange={(event) => { setInternal(Number(event.currentTarget.value)); onChange?.(event); }}
      className={cn('h-6 w-full cursor-pointer rounded-lg accent-primary disabled:cursor-not-allowed disabled:opacity-50', focusRing, className)} />
  </div>;
});
