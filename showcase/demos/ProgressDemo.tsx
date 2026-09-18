import { useState } from "react";
import { Button, Progress } from "../../src/index";
export function ProgressDemo() {
  const [value, setValue] = useState(35);
  return <div style={{ display: "grid", gap: 16, width: "100%", maxWidth: 440 }}><p>上传进度：{value}%</p><Progress aria-label="上传进度" value={value} /><div style={{ display: "flex", gap: 8 }}><Button onClick={() => setValue(Math.min(100, value + 15))} disabled={value === 100}>增加进度</Button><Button onClick={() => setValue(0)}>重置</Button></div><p>正在连接（进度未知）</p><Progress aria-label="正在连接" /></div>;
}
