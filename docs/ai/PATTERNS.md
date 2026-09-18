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

## 可选视觉皮肤：Minimal Pro / Tech Noir / Glass

新增入口仅在包含此改动的版本存在。先确认 package.json 的 ./themes.css 导出；旧 npm 0.2.2 不保证包含它。

```css
@import "tailwindcss";
@import "@asharca/ui/styles.css";
@import "@asharca/ui/themes.css";
```

```html
<html class="dark" data-ui-style="tech" data-ui-density="comfortable">
```

风格是 minimal / tech / glass，密度是 comfortable / compact。明暗由根元素的 .dark 类决定，浅色移除该类。不要生成不存在的 ThemeProvider 或把这些属性传成 Button 的 variant。没有 data-ui-style 时保留原来的组件外观。

组件的可选样式钩子：Input / Textarea / 原生 Select 使用 data-appearance="filled"；TabsList 使用 data-variant="segmented|underline|pills"；Card / Panel 可标记 data-surface="elevated|inset|glass"。这些是原生 data-* 属性，不改变事件、语义或受控状态。Glass 只影响指定容器，不能给全部阅读区域强行添加透明度和背景模糊。

全局 html 属性让挂在 body 的 Portal 继承主题。局部作用域可以设置 data-ui-mode="light|dark"，但挂到作用域外的浮层仍需指定对应 Portal 容器，也不自动覆盖宿主所有 dark: 工具类。保留既有 --toolplane-ui-* HSL 通道与尺寸契约；自定义值放在后加载的同等或更高优先级选择器中。

构建 UI 时优先保证主操作、辅助文本、错误提示和键盘焦点可分辨；不要用更小字号、持续发光或所有卡片悬浮来制造所谓科技感。

## 给 AI 的任务模板

请先读取 @asharca/ui 的 AI 使用指南、目标组件 Markdown 和目标项目安装版本，再用真实公开组件实现设置页。保留原生事件接口与可访问名称，单选/复选使用 ChoiceField，说明可换行；数据与回调由宿主控制。不生成不存在的 shadcn 导入或注册表配置。完成后运行类型检查和相关测试，并报告实际检查结果。

视觉任务补充：在目标包确认支持 themes.css 后，采用 tech 风格、深色与 comfortable 密度；保持输入/菜单实色，只给必要容器增加层次。在桌面与 375px 视口检查文本对比度、表单状态、工具执行状态、Portal 主题与减少动画偏好。主题切换不得重新创建聊天 runtime 或丢失已输入内容。
