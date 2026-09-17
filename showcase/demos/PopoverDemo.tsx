import { useId, useState } from "react";
import { Button, Field, FieldLabel, Input, Popover, PopoverClose, PopoverContent, PopoverPortal, PopoverTrigger } from "../../src/index";
export function PopoverDemo() {
  const id = useId(); const [width, setWidth] = useState(240);
  return <div><Popover><PopoverTrigger asChild><Button>设置卡片宽度</Button></PopoverTrigger><PopoverPortal><PopoverContent aria-label="卡片设置"><div style={{ display: "grid", gap: 12 }}><Field><FieldLabel htmlFor={id}>宽度（像素）</FieldLabel><Input id={id} type="number" min={120} max={480} value={width} onChange={(event) => setWidth(Math.max(120, Math.min(480, Number(event.target.value))))} /></Field><PopoverClose asChild><Button>完成</Button></PopoverClose></div></PopoverContent></PopoverPortal></Popover><p>当前宽度：{width}px</p></div>;
}
