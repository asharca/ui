import { useState } from "react";
import { Button, Card, Skeleton } from "../../src/index";
export function SkeletonDemo() {
  const [loading, setLoading] = useState(true);
  return <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 400 }}><Card aria-busy={loading}>{loading ? <div style={{ display: "grid", gap: 12 }}><Skeleton style={{ width: 48, height: 48, borderRadius: "50%" }} /><Skeleton style={{ width: "70%", height: 20 }} /><Skeleton style={{ width: "100%", height: 16 }} /></div> : <><h3>ToolPlane 工作区</h3><p>共享组件与智能工具。</p></>}</Card><Button onClick={() => setLoading(!loading)}>{loading ? "显示内容" : "显示占位"}</Button></div>;
}
