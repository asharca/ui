import { useState } from "react";
import { Button, RotatingHeadline } from "../../src/index";
export function RotatingHeadlineDemo() {
  const [paused, setPaused] = useState(false);
  return <div style={{ display: "grid", gap: 16 }}><h2>一起<RotatingHeadline words={paused ? ["构建"] : ["设计", "构建", "交付"]} /></h2><Button onClick={() => setPaused(!paused)}>{paused ? "恢复轮换" : "显示静态标题"}</Button><p>完整表达：一起设计、构建和交付。</p></div>;
}
