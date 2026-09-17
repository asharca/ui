import { useState } from "react";
import { Button, Pagination } from "../../src/index";
export function PaginationDemo() {
  const [page, setPage] = useState(1); const total = 4;
  return <Pagination aria-label="项目分页" summary={`第 ${page} 页 / 共 ${total} 页`} previous={<Button disabled={page === 1} onClick={() => setPage(page - 1)}>上一页</Button>} next={<Button disabled={page === total} onClick={() => setPage(page + 1)}>下一页</Button>} />;
}
