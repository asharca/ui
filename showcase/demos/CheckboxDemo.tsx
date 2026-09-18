import { useState } from "react";
import { ChoiceField, ChoiceGroup } from "../../src/index";

export function CheckboxDemo() {
  const [enabled, setEnabled] = useState(true);
  return <div className="demo-choice-stack">
    <ChoiceGroup legend="通知设置" description="选择需要接收的通知。每个选项可独立开启，点击文字也能切换。">
      <ChoiceField name="notifications" value="releases" label="接收发布通知" description="新版本发布后发送邮件，包含更新摘要和升级说明。" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} />
      <ChoiceField name="notifications" value="security" label="接收安全提醒" description="账号出现异常登录或权限变化时通知我。" defaultChecked />
      <ChoiceField name="notifications" value="admin" label="管理员通知" description="仅管理员可修改此项，目前不可用。" disabled />
    </ChoiceGroup>
    <p role="status" className="demo-status">发布通知{enabled ? "已开启" : "已关闭"}</p>
  </div>;
}
