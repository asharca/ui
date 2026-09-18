import { ToolPlaneLogo } from "../../src/index";
export function ToolPlaneLogoDemo() {
  return <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}><ToolPlaneLogo svgSize={40} showWordmark={false} role="img" aria-label="ToolPlane 品牌标识" /><ToolPlaneLogo svgSize={28} wordmarkClass="text-xl" /><ToolPlaneLogo svgSize={20} wordmarkClass="text-sm" /></div>;
}
