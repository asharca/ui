'use client';
import { useState } from 'react';
import { Pagination } from '@/components/asharca/pagination';
export default function PaginationDemo() {
  const [page, setPage] = useState(1);
  return <div className="grid w-full max-w-sm gap-5"><div className="rounded-xl border border-border bg-muted/20 py-8 text-center text-xs text-muted-foreground">第 {page} 页的内容</div><Pagination page={page} pageCount={5} onPageChange={setPage} /></div>;
}
