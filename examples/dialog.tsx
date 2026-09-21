import { Button } from '@/components/asharca/button';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/asharca/dialog';
export default function DialogDemo() {
  return <Dialog><DialogTrigger asChild><Button variant="outline">打开对话框</Button></DialogTrigger>
    <DialogContent title="准备发布更改？" description="先确认预览中的内容。这个示例不会执行实际发布。">
      <p className="text-sm leading-7 text-muted-foreground">对话框会管理焦点、锁定背景滚动，并在关闭后把焦点交还给触发按钮。</p>
      <div className="mt-6 flex justify-end gap-2"><DialogClose asChild><Button variant="outline">取消</Button></DialogClose><DialogClose asChild><Button>确认</Button></DialogClose></div>
    </DialogContent>
  </Dialog>;
}
