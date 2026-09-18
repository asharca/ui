# Asharca UI · Design System v1

本轮是可执行的视觉系统，不是重新实现组件运行时。新增主题文件属于 0.2.3 的发布范围；发布状态以 npm 和 GitHub Release 为准，不要推断旧 npm 0.2.2 已经提供这些文件。

## 三套视觉风格

| 风格 | 色彩与表面 | 几何 | 适用场景 |
| --- | --- | --- | --- |
| Minimal Pro / minimal | 中性色、轻阴影、实色面板 | 10px 基础圆角 | 文档、设置、企业表单 |
| Tech Noir / tech | 蓝黑或冷白、钴蓝强调、细边界与克制阴影 | 8px 基础圆角 | AI、Agent、工具控制台 |
| Glass / glass | 紫色强调、柔和阴影、指定容器轻透明 | 14px 基础圆角 | 产品展示、轻量工作台 |

每套都提供浅色和深色；密度独立为 comfortable / compact。科技感不是持续动画或满屏渐变。玻璃仅用于 data-surface="glass"，输入、代码、菜单与浮层保持实色；系统要求减少透明度时关闭模糊。普通 Card 不添加假按钮语义，也不默认悬浮抬升。

## 设计准则

颜色使用配对的语义变量。普通文字、辅助文字、主操作各自有前景/背景；执行状态同时使用文字和图标。层级依次是 page → shell → card → overlay；交互高亮不是额外的装饰层。

间距以 4px 为基本单位，常见 8/12/16/20/24/32。常规控件高度舒适 40px、紧凑 36px；明确的 sm/lg 用法保持已有契约。指针粗粒度设备为常规按钮增大目标，不压缩文字字号。选择控件固定 16px，使用整行标签提供点击面积，保留首行对齐。

动效通常为 160ms，颜色/边界/阴影变化，不使用持续闪烁与卡片位移。保留 prefers-reduced-motion 与 forced-colors。对比度自动检查只针对测试样本，不等于完整 WCAG 认证。

## 宿主接入

```css
@import "tailwindcss";
@import "@asharca/ui/styles.css";
@import "@asharca/ui/themes.css";
```

```html
<html class="dark" data-ui-style="tech" data-ui-density="comfortable">
```

未导入 themes.css 或未设置 data-ui-style 时，保留原有组件样式。浅色移除全局 dark 类；皮肤值是 minimal / tech / glass。框架中用对应根元素属性即可，不需要虚构 ThemeProvider。

可通过更后面的同等或更高优先级选择器覆盖原有 --toolplane-ui-* 变量，HSL 颜色仍然使用通道值。全局主题设置在 html 后，body 内的 Portal 也继承相同变量。局部预览可以使用 data-ui-style 和 data-ui-mode="light|dark"，但 Portal 仍须使用同一容器；局部明暗不等于重写宿主所有 dark: 工具类。

## 高频组件的视觉契约

Button 保留六种已有 variant，不新增虚假的 soft API；主操作与次操作、轮廓、ghost 和危险操作有独立层级。disabled/loading 仍由原有实现阻止激活。

Input / Textarea / Select 默认实色、明确边界，支持原生 data-appearance="filled" 的填充式外观。错误边界配合 aria-invalid 与说明 ID，不能只靠红色。只读和禁用不是同一种状态。

ChoiceField / ChoiceGroup 保留原生 input / fieldset，标题、说明、错误对齐在同一列。选中卡片使用背景与边界，键盘焦点使用外轮廓，禁用态不触发 hover。

Card / Panel 使用统一表面、圆角和轻高光，可用 data-surface="elevated|inset|glass" 明确指定层次。原生 data-* 是样式钩子，不是新 React 组件属性。

TabsList 可使用 data-variant="segmented|underline|pills"，Radix Tabs 的键盘和 ARIA 关系不变。Dialog / 菜单 / Popover 不修改焦点或 Portal 行为；实色阅读面、边界与阴影负责层次。

DataTable 用更清晰的表头、行间距、受控选中态和数字排版。ToolCallCard 使用有语义的状态标记与工具图标容器，保留七种真实状态、审批与受限结果。ChatThread 的输入框、工具栏、Markdown 与工具过程共享主题，不复制宿主业务逻辑。

## 展示与机器文档

#/home 是产品式入口，#/themes 是可交互主题实验室。无 hash 和 #/ 默认进入产品首页；安装页改为明确的 #/installation，全部组件路由保留。顶栏风格切换与明暗独立；主题实验室可调密度并复制配置。独立 iframe / 新窗口通过 URL 接收风格、明暗和密度，不写回父页面偏好。

主题切换不重挂载当前内嵌示例；页面重载、重置或切换 iframe 视口会重置本地演示数据。展示中的运行按钮仅有可取消的本地计时器，不发送模型或工具请求。

AI 组合指南 docs/ai/PATTERNS.md 增加了这些真实契约，并自动进入 llms-full.txt。UTF-8 文档响应修复保持不变。

## 验证范围

常规 lint、库/站点构建、54 份公开 API 示例、单元测试、原有浏览器布局检查与真实 Vite 编码检查继续执行。新增三皮肤 × 双明暗 × 三视口检查：布局、状态保留、密度、浮层、iframe 参数与示例文字对比度。截图用于人工检查，尚不是维护好的跨浏览器像素基线。

原有无锁安装的 assistant-ui core/cloud peer 冲突仍是发布阻塞。本次不关闭严格检查，不改变依赖和版本，不合并 main，不发布。
