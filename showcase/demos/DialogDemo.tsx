import { useId, useState } from "react";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger, Field, FieldLabel, Input } from "../../src/index";
export function DialogDemo() {
  const id = useId(); const [open, setOpen] = useState(false); const [name, setName] = useState("我的工作区"); const [saved, setSaved] = useState("");
  return <div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button>编辑工作区</Button></DialogTrigger><DialogPortal><DialogOverlay /><DialogContent><DialogTitle>编辑工作区</DialogTitle><DialogDescription>修改显示名称，保存后返回演示页面。</DialogDescription><form onSubmit={(event) => { event.preventDefault(); setSaved(name); setOpen(false); }} style={{ display: "grid", gap: 16 }}><Field><FieldLabel htmlFor={id}>名称</FieldLabel><Input id={id} required value={name} onChange={(event) => setName(event.target.value)} /></Field><div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}><DialogClose asChild><Button>取消</Button></DialogClose><Button type="submit" variant="primary">保存</Button></div></form></DialogContent></DialogPortal></Dialog>{saved && <p role="status">已保存：{saved}</p>}</div>;
}
