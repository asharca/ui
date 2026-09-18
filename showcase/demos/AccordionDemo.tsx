import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../src/index";
export function AccordionDemo() {
  return <div style={{ width: "100%", maxWidth: 560 }}><Accordion type="single" collapsible defaultValue="keyboard"><AccordionItem value="keyboard"><AccordionTrigger>支持键盘操作吗？</AccordionTrigger><AccordionContent>使用 Tab 聚焦，Enter 或空格展开，方向键在触发器之间移动。</AccordionContent></AccordionItem><AccordionItem value="state"><AccordionTrigger>状态由谁管理？</AccordionTrigger><AccordionContent>可以使用 defaultValue，也可以通过 value/onValueChange 接入宿主状态。</AccordionContent></AccordionItem><AccordionItem value="disabled" disabled><AccordionTrigger>不可用条目</AccordionTrigger><AccordionContent>该条目不能展开。</AccordionContent></AccordionItem></Accordion></div>;
}
