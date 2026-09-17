import { useId, useState } from "react";
import { NavigationTabs, Tab, TabList, TabPanel } from "../../src/index";
export function NavigationTabsDemo() {
  const id = useId(); const [active, setActive] = useState(0);
  return <div style={{ display: "grid", gap: 24 }}><NavigationTabs aria-label="页面导航"><Tab asChild navigation current><a href="#/installation">安装</a></Tab><Tab asChild navigation><a href="#/components/button">组件</a></Tab></NavigationTabs>
    <div><TabList label="低层受控标签示例" onKeyDown={(event) => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; event.preventDefault(); const next = 1 - active; setActive(next); document.getElementById(`${id}-${next}`)?.focus(); }}>
      {["概览", "日志"].map((label, index) => <Tab key={label} id={`${id}-${index}`} current={active === index} tabIndex={active === index ? 0 : -1} aria-controls={`${id}-panel-${index}`} onClick={() => setActive(index)}>{label}</Tab>)}
    </TabList><TabPanel id={`${id}-panel-0`} aria-labelledby={`${id}-0`} current={active === 0}>当前工作区概览。</TabPanel><TabPanel id={`${id}-panel-1`} aria-labelledby={`${id}-1`} current={active === 1}>暂无新的运行日志。</TabPanel></div>
  </div>;
}
