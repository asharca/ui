import { Accordion, AccordionItem } from '@/components/asharca/accordion';
export default function AccordionDemo() {
  return <Accordion type="single" collapsible defaultValue="source" className="w-full max-w-sm">
    <AccordionItem value="source" title="源码安装在哪里？">安装在项目的 components/asharca 目录下，路径遵循你的 shadcn 配置。</AccordionItem>
    <AccordionItem value="theme" title="可以使用自己的主题吗？">可以。组件复用项目中的语义化颜色变量，不覆盖已有主题。</AccordionItem>
    <AccordionItem value="modify" title="可以直接修改组件吗？">可以。源码属于你的项目，可以按实际需要调整。</AccordionItem>
  </Accordion>;
}
