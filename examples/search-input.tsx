'use client';
import { useState } from 'react';
import { SearchInput } from '@/components/asharca/search-input';
export default function SearchInputDemo() {
  const [query, setQuery] = useState('');
  const items = ['界面组件', '应用示例', '安装文档'].filter((item) => item.includes(query));
  return <div className="w-full max-w-xs"><SearchInput label="搜索内容" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery('')} placeholder="搜索组件或文档…" /><ul className="mt-4 grid gap-2 text-xs text-muted-foreground">{items.map((item) => <li key={item}>{item}</li>)}</ul>{!items.length && <p role="status" className="mt-4 text-xs text-muted-foreground">没有匹配的内容。</p>}</div>;
}
