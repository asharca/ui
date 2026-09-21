import { Checkbox } from '@/components/asharca/checkbox';
export default function CheckboxDemo() {
  return <div className="grid w-full max-w-xs gap-5">
    <Checkbox name="updates" label="接收项目更新" description="仅在构建完成或需要处理时通知我。" defaultChecked />
    <Checkbox name="files" label="部分文件已选择" indeterminate />
    <Checkbox label="组织管理员已锁定此选项" disabled />
  </div>;
}
