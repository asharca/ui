import { componentMetadata, type ApiRow, type ComponentMetadata } from './component-metadata.ts';

const logoApi: readonly ApiRow[] = [
  ['svgSize', 'number', '28', '品牌图形尺寸（像素）'],
  ['showWordmark', 'boolean', 'true', '是否显示 ToolPlane 文字'],
  ['wordmarkClass', 'string', 'text-2xl', '品牌文字样式'],
  ['className / 原生 span 属性', 'HTML span 属性', '—', '外层布局和可访问名称'],
];
const choice: ComponentMetadata = {
  id: 'choice-field', name: 'ChoiceField', file: 'ChoiceField.tsx', module: 'choice-field',
  demoFile: 'ChoiceFieldDemo.tsx', group: '基础控件',
  description: '对齐首行文字的单选与复选选项，支持说明、错误提示和整行点击。',
  api: [
    ['type', 'checkbox | radio', 'checkbox', '原生控件类型；保留 name/value/ref 与原生事件'],
    ['label', 'ReactNode', '必填', '选项标题与可访问名称'],
    ['description / error', 'ReactNode', '—', '自动生成 ID 并关联 aria-describedby；error 默认设置 aria-invalid'],
    ['variant', 'plain | card', 'plain', '普通选项行或整行可点击的选项卡'],
    ['checked / onChange', '原生 input 属性', '—', '使用 event.target.checked，不是 onCheckedChange'],
    ['wrapperClassName', 'string', '—', '外层布局；className 和 ref 作用在 input'],
  ],
  notes: 'ChoiceGroup 提供原生 fieldset/legend/disabled。标题与说明不要放链接、按钮或嵌套 label。同组 Radio 必须具有相同 name，不同组必须不同。',
};

// Both the rendered site and generated Markdown consume this resolved catalog.
export const catalogMetadata: ComponentMetadata[] = [...componentMetadata.map((metadata) => ({
  ...metadata,
  demoFile: metadata.name === 'Toolbar' ? 'ToolbarLayoutDemo.tsx' : metadata.demoFile,
  api: metadata.name === 'ToolPlaneLogo' ? logoApi : metadata.api,
  notes: metadata.name === 'Checkbox' || metadata.name === 'Radio'
    ? `${metadata.notes} 带标题或多行说明时优先组合 ChoiceField / ChoiceGroup，避免空格对齐。`
    : metadata.notes,
})), choice];
