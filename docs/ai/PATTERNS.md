# 推荐组合模式

这些模式用于当前优化分支；使用前核对已安装包是否包含对应导出。更多可运行代码见文档站 ai/components/*.md。

## 多行选项，不靠空格对齐

```tsx
'use client';
import { useId, useState } from 'react';
import { ChoiceField, ChoiceGroup } from '@asharca/ui/choice-field';

export function NotificationSettings() {
  const radioName = useId();
  const [frequency, setFrequency] = useState('daily');
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="grid gap-6">
      <ChoiceField
        name="notifications"
        label="接收通知"
        description="通过邮件接收重要更新，说明文字可以换行。"
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
      />
      <ChoiceGroup legend="发送频率" description="一次只能选择一项。" disabled={!enabled}>
        <ChoiceField type="radio" name={radioName} value="daily" label="每天"
          checked={frequency === 'daily'} onChange={(event) => setFrequency(event.target.value)} />
        <ChoiceField type="radio" name={radioName} value="weekly" label="每周"
          checked={frequency === 'weekly'} onChange={(event) => setFrequency(event.target.value)} />
      </ChoiceGroup>
    </div>
  );
}
```

需要卡片式选项时设置 variant="card"。不要增加外层点击回调来再次切换状态，label 已有原生点击行为。

## 普通表单字段

Field / FieldLabel / FieldDescription / FieldError 是低层组合。为 Input 设置唯一 id，FieldLabel 使用 htmlFor；将说明和错误的 ID 加入 aria-describedby。验证逻辑在宿主，不要把展示文案当成真正验证。

## 表格选择

将筛选和排序后的同一份数据同时用于渲染 tr 和生成 rowIds。selectedRowIds 保存稳定 ID；数据更新时由宿主处理已删除记录。不要把“当前页全选”和“服务端所有结果全选”混为一谈。

## AI 聊天

先确定宿主的 AssistantRuntime，再接入 ChatThread。composerTools 可放 ChatComposerToolbar；替换默认附件入口时设置 showAttachmentPicker={false}，避免重复的加号。

工具栏的 pinnedIds 和 onPinnedIdsChange 由宿主管理。工具操作可以返回 Promise，组件负责执行状态与错误反馈；权限和执行由服务端校验。

使用 components.ToolCall / components.Reasoning 定制展示，getToolPresentation 提供真实名称、图标与分类。优先展示关键状态，复杂结果采用受限预览。仅渲染运行时公开提供的 reasoning，不创建或推断隐藏思维内容。

演示可以用 useExternalStoreRuntime 和内存数据；必须明确它不调用模型，不应把演示的假数据说成生产能力。

## 给 AI 的任务模板

请先读取 @asharca/ui 的 AI 使用指南、目标组件 Markdown 和目标项目安装版本，再用真实公开组件实现设置页。保留原生事件接口与可访问名称，单选/复选使用 ChoiceField，说明可换行；数据与回调由宿主控制。不生成不存在的 shadcn 导入或注册表配置。完成后运行类型检查和相关测试，并报告实际检查结果。
