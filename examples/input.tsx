import { Input } from '@/components/asharca/input';
export default function InputDemo() {
  return <div className="grid w-full max-w-xs gap-5">
    <Input label="工作区名称" placeholder="例如：我的工作区" description="稍后可以在设置中修改。" />
    <Input label="项目标识" defaultValue="my project" error="请使用字母、数字和连字符。" />
  </div>;
}
