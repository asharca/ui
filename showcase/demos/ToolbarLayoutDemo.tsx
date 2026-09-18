import { useState } from "react";
import { Button, SearchInput, Toolbar } from "../../src/index";
export function ToolbarLayoutDemo() {
  const [query, setQuery] = useState(""); const [count, setCount] = useState(0);
  return <div style={{ display: "grid", gap: 16, width: "100%" }}><Toolbar actions={<><Button onClick={() => setQuery("")}>清除筛选</Button><Button variant="primary" onClick={() => setCount(count + 1)}>新建</Button></>}><SearchInput label="搜索工作区" value={query} onChange={(event) => setQuery(event.target.value)} onClear={() => setQuery("")} /></Toolbar><p role="status">已新建 {count} 项，搜索词：{query || "全部"}</p></div>;
}
