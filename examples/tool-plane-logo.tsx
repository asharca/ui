import { ToolPlaneLogo } from '@/components/asharca/tool-plane-logo';
export default function ToolPlaneLogoDemo() { return <div className="flex flex-wrap items-center justify-center gap-7"><ToolPlaneLogo /><ToolPlaneLogo svgSize={40} showWordmark={false} /><ToolPlaneLogo svgSize={22} wordmarkClass="text-sm" /></div>; }
