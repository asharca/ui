import { ToolPlaneLogo } from "../../src/index";
export function ToolPlaneLogoDemo() {
  return <div style={{ display: "flex", alignItems: "center", gap: 24 }}><span role="img" aria-label="ToolPlane 品牌标识"><ToolPlaneLogo className="size-10" /></span><span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><span aria-hidden="true"><ToolPlaneLogo className="size-6" /></span><strong>ToolPlane</strong></span></div>;
}
