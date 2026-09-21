import { Switch } from '@/components/asharca/switch';
export default function SwitchDemo() {
  return <div className="grid w-full max-w-xs gap-6">
    <Switch label="自动保存" description="编辑时保存你的更改。" defaultChecked name="autosave" />
    <Switch label="桌面通知" name="notifications" />
    <Switch label="由管理员管理" disabled />
  </div>;
}
