import { HoverCard, HoverCardContent, HoverCardPortal, HoverCardTrigger } from "../../src/index";
export function HoverCardDemo() {
  return <HoverCard openDelay={200}><HoverCardTrigger asChild><a href="https://github.com/asharca/ui" target="_blank" rel="noreferrer">@asharca/ui</a></HoverCardTrigger><HoverCardPortal><HoverCardContent style={{ maxWidth: 300 }}><strong>Asharca UI</strong><p>从 ToolPlane 提炼的 React 组件和 AI 聊天界面。</p><p>点击原链接可查看完整仓库。</p></HoverCardContent></HoverCardPortal></HoverCard>;
}
