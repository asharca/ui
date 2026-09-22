'use client';
import { useId, useState } from 'react';
import { Field, FieldLabel, FieldDescription, FieldError } from '@/components/asharca/field';
export default function FieldDemo() {
  const id = useId(); const [name, setName] = useState('workspace'); const invalid = !name.trim();
  return <Field className="max-w-xs"><FieldLabel htmlFor={id}>工作区标识</FieldLabel><input id={id} value={name} onChange={(event) => setName(event.target.value)} aria-invalid={invalid} aria-describedby={`${id}-help${invalid ? ` ${id}-error` : ''}`} className="h-10 rounded-xl border border-border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring" /><FieldDescription id={`${id}-help`}>由标签、输入与辅助信息自由组合。</FieldDescription>{invalid && <FieldError id={`${id}-error`}>标识不能为空。</FieldError>}</Field>;
}
