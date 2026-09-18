import { Info } from "lucide-react";
import { IconButton, Tooltip, TooltipContent, TooltipPortal, TooltipProvider, TooltipTrigger } from "../../src/index";
export function TooltipDemo() {
  return <TooltipProvider delayDuration={200}><Tooltip><TooltipTrigger asChild><IconButton label="查看快捷键说明" icon={<Info />} /></TooltipTrigger><TooltipPortal><TooltipContent>使用 Tab 聚焦这个按钮也能查看说明。</TooltipContent></TooltipPortal></Tooltip></TooltipProvider>;
}
