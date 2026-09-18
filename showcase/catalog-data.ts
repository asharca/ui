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
})), choice, {
  id: 'chart-container', name: 'ChartContainer', file: 'Chart.tsx', module: 'chart',
  demoFile: 'ChartContainerDemo.tsx', group: '数据与布局',
  description: '基于 Recharts 的响应式图表容器、主题色、提示框与图例。',
  api: [
    ['config', 'ChartConfig', '必填', '系列键映射到 label 与可选 color；生成 --color-系列键 CSS 变量'],
    ['children', 'ReactNode', '必填', '直接组合 Recharts 的 BarChart、AreaChart、PieChart 等'],
    ['style / className', '原生 div 属性', '高度 280px', '容器必须有明确高度；style 可覆盖尺寸和系列颜色'],
    ['ChartTooltip / ChartLegend', 'Recharts 原生组件', '—', '保留 Recharts 的交互配置与属性'],
    ['ChartTooltipContent', 'active / payload / label / formatter / labelFormatter / hideLabel', '—', '在 ChartContainer 内使用，读取 config 的系列名称与颜色'],
    ['ChartLegendContent', 'payload / className', '—', '在 ChartContainer 内使用，显示系列名称与颜色'],
  ],
  notes: '沿用 shadcn 的组合方式，不隐藏 Recharts API。数据、坐标轴和格式化由宿主提供；config 的键使用普通标识符。color 可引用 --chart-1 至 --chart-5 或宿主 CSS 变量，自动适配明暗模式。需要安装 recharts 才能在应用中直接导入图表原语。为图表提供可访问名称、开启 accessibilityLayer，复杂图表同时提供数据表。',
}];
